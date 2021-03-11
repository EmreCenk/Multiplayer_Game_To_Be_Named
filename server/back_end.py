



from flask import Flask
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = "I will eventually set a secret key"

socketio = SocketIO(app, cors_allowed_origins='*')

@socketio.on("message")
def give_info(msg):
    print("message: " + msg) 
    send(msg, broadcast = True) 

if __name__ == "__main__":
    socketio.run(app, debug = True)