



from flask import Flask, render_template
from flask_socketio import SocketIO, send
from character_class import character

global constant_vy,constant_vx
constant_vy = 5
constant_vx = 5

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

@socketio.on("leaving")
def pop_person(msg):
    print("We are here ", msg, type(msg))


@socketio.on("message")
def initialize(stats):
    global players    
    cur_cor = potential_coordinates[len(players)]
    players.append(character(cur_cor[0],cur_cor[1],5))

    tosend={"id":len(players),"x":cur_cor[0], "y": cur_cor[1], "r":5, "vx": constant_vx, "vy":constant_vy}
    print("Sending ", tosend)
    send(tosend,broadcast=True) #tell the person what their coordinates are
    print("sent")

if __name__ == "__main__":
    socketio.run(app)