

var socket = io("https://localhost:3000");
socket.on("init",initialize);
function initialize(message){
    console.log(message);
}
