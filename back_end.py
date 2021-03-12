



from flask import Flask, render_template
from flask_socketio import SocketIO, send
from character_class import character

global constant_vy,constant_vx,constant_radius
constant_vy = 5
constant_vx = 5
constant_radius = 5

potential_coordinates = [
    [0,0],
    [1920/2,0],
    [0,1080/2],
    [1920/2,1080/2]
]
players=[]
app = Flask(__name__)
app.config["SECRET_KEY"] = "I will eventually set a secret key"




@app.route("/")
def home():
    return render_template("index.html")


socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on("json")
def pop_person(json_thing):

    socketio.emit("update", json_thing, broadcast=True) #Broadcasting update
    print("update",json_thing)

@socketio.on("message")
def initialize(stats):
    global players    
    cur_cor = potential_coordinates[len(players)] #get one of the corners
    players.append(character(cur_cor[0],cur_cor[1],constant_radius,len(players)))

    print(players,len(players))

    tosend={"id":len(players)-1,"my_id":len(players)-1,"x":cur_cor[0], "y": cur_cor[1], "r":constant_radius, "vx": constant_vx, "vy":constant_vy}
    
    ptosend = json_to_players()
    ptosend[tosend["id"]] = tosend

    send(ptosend,broadcast=False)

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
    socketio.run(app)