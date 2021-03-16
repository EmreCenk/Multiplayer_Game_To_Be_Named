
import time
import threading
from flask import Flask, render_template
from flask_socketio import SocketIO, send
from game_classes_server import character

#GLOBAL CONSTANTS:
global constant_vy,constant_vx,constant_radius,constant_frame_rate
constant_vy = 8
constant_vx = 8
constant_radius = 5
constant_frame_rate = 45


potential_coordinates = [
    [0,0],
    [1920/2,0],
    [0,1080/2],
    [1920/2,1080/2]
]
players=[]
app = Flask(__name__)
app.config["SECRET_KEY"] = "I will eventually set a secret key"

other_names = {"update":"n"}

# def tick_game():

@app.route("/")
def home():
    return render_template("index.html")


socketio = SocketIO(app, cors_allowed_origins="*")

def current_milli_time():
    return (time.time, time.time() * 1000,round(time.time() * 1000))

def broadcast_player_position(json_thing):
    global players
    # print(current_milli_time())


    #json_thing is in the following format: {'id': 0, 'x': 155, 'y': 145}
    socketio.emit(other_names["update"], json_thing, broadcast=True) #Broadcasting update

    #updating player stats accordingly:
    players[json_thing["id"]].x = json_thing["x"]
    players[json_thing["id"]].y = json_thing["y"]
    
def disconnect_player(object_sent):
    player_id = object_sent["id"]
    players.pop(player_id)

    socketio.emit("d", object_sent, broadcast = True)



def broadcast_new_bullet(bullet_json):
    print(current_milli_time())

    print(bullet_json)
    print()
    socketio.emit("b", bullet_json, broadcast=True) #Broadcasting new bullet

@socketio.on("json")
def broadcast_update(json_thing):
    if "p" in json_thing:
        broadcast_player_position(json_thing["p"])
    
    elif "b" in json_thing:
        broadcast_new_bullet(json_thing["b"])

    elif "d" in json_thing:
        disconnect_player(json_thing["d"])

@socketio.on("message")
def initialize(stats):
    #initialize player
    global players    
    cur_cor = potential_coordinates[0] #get one of the corners
    players.append(character(cur_cor[0],cur_cor[1],constant_radius,len(players)))

    print(players,len(players))

    tosend={"id":len(players)-1,"my_id":len(players)-1,"x":cur_cor[0], "y": cur_cor[1], "r":constant_radius, "vx": constant_vx, "vy":constant_vy}
    
    ptosend = json_to_players()
    ptosend[tosend["id"]] = tosend

    send(ptosend,broadcast=False)


    #tell everyone that a new player has joined:
    socketio.emit("new player", tosend, broadcast = True)
    


def json_to_players():
    final={}
    for p in players:
        if p.id!=len(players)-1:
            final[p.id] = {"id":p.id,"x":p.x, "y": p.y, "r":p.radius, "vx": constant_vx, "vy":constant_vy}

    return final    
def update_player(id,newx,newy):
    player = players[id]
    player.x = newx
    player.y = newy
if __name__ == "__main__":
    print("server online")
    socketio.run(app)
