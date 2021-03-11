

const io = require('socket.io')();

io.on("connection",client =>{
    client.emit("init",{data:"this is actually working!"})
}); //when someone connects, emit the 'init' signal with the json object

io.listen(3000);