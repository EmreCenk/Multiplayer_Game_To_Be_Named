



from flask import Flask, render_template
from flask_socketio import SocketIO, send
from character_class import character


players=[]
app = Flask(__name__)
app.config['SECRET_KEY'] = "I will eventually set a secret key"




@app.route("/")
def home():
    return render_template("index.html")


socketio = SocketIO(app, cors_allowed_origins='*')
@socketio.on("update")
def give_info(msg):
    print("update: " + str(msg))
    send(msg, broadcast = True)

@socketio.on("init")
def initialize(stats):
    global players
    stats=eval(stats)
    players.append(character(1,1,1))

if __name__ == "__main__":
    socketio.run(app)