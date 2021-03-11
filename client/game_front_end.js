

const socket = io("http://localhost:5000");
socket.on("init",initialize);
function initialize(message){
    console.log(message);
}
