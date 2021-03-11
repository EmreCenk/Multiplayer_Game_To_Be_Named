



$(document).ready(
    function(){
        //connecting to socket: 
        var socket = io.connect("http://127.0.0.1:5000/")


        socket.on("connect",function(){
            socket.send("user has connected");
        });


    }
)