

var socket = io.connect("http://127.0.0.1:5000/");

// ESTABLISHING SOCKET CONNECTION:
$(document).ready(function(){
    socket.on("connect",function(){
        socket.emit("message", {});
        
    });

    socket.on('message', function(msg) {
        init_char(msg);
   
	});

    socket.on("update", function(something){
        console.log(something);
        console.log(typeof(something));
    })

    // socket.on("init", function(sent){
    //     console.log("is this happening");
    //     console.log(String(sent), typeof(sent));
    //     const identification = sent;


    // }
    // );

    // socket.on("update", update_players)
})

function init_char(msg){
    console.log(msg, typeof(msg));
    const identification = msg["id"];
    let c_x = msg["x"];
    let c_y = msg["y"];
    let c_r = msg["r"];
    let vx = msg["vx"];
    let vy = msg["vy"];

    main_ch = new character(c_x,c_y,c_r,vx,vy,identification);
    
    
    console.log("character init ", main_ch);
}
//CONTROLS AND ALTERNATIVES
const move_left = ['ArrowLeft','a']; // the 'a' and left arrow
const move_right = ['ArrowRight','d']; // 'd' and right arrow
const move_up = ['ArrowUp','w']; // 'w' and up arrow
const move_down = ['ArrowDown','s']; //'s' and down arrow

var moving = [false,false,false,false]; // index 0: left ,1:right , 2:up, 3:down

window.innerWidth = 1920/2;
window.innerHeight = 1080/2;

var canvas = document.querySelector("canvas"); //selecting the canvas from the html
var c = canvas.getContext("2d");
//Making canvas full screen:
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


class character{
    constructor(x,y,radius, vx, vy, identification, color="black"){
        this.x=x;
        this.y=y;
        this.radius = radius;
        this.vx=vx;
        this.vy = vy;
        this.color=color;
        this.show=true;
        this.identification=identification;
    }

    move(array_of_current_moves){
        let didwe = false;
        if (array_of_current_moves[0]){
            this.x-=this.vx;
            didwe=true;
        }
        
        if (array_of_current_moves[1]){
            this.x+=this.vx;
            didwe=true;
        }
        
        if (array_of_current_moves[2]){
            this.y-=this.vy;
            didwe=true;
        }
        
        if (array_of_current_moves[3]){
            this.y+=this.vy;
            didwe=true;
        }

        return didwe

    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2);
        c.fillStyle = this.color;
        c.fill();

    }
}
// $("body").append("<li>" + msg);


var other_players = []

// window.onbeforeunload = function (e) {
//     e = e || window.event;


//     console.log("YAS");

//     socket.emit('message', {username:identification});
    

//     return 'Sure?';
// };

window.addEventListener("keydown",key_pressed);
window.addEventListener("keyup",key_up);
window.addEventListener("beforeunload", function (){
    console.log("YAS");

    socket.emit('message', {username:identification}
    )})

function modify(cur_key, what_to=true){


    if (move_left.includes(cur_key)){
        moving[0] = what_to;
    }
    else if (move_right.includes(cur_key)){
        moving[1] = what_to;
    }
    else if (move_up.includes(cur_key)){
        moving[2] = what_to;
    }
    else if (move_down.includes(cur_key)){
        moving[3] = what_to;
    }

}


function key_pressed(event){

    let cur_key = event.key;
    modify(event.key,true)
}

function key_up(event){
    modify(event.key,false)
}





function animate(){
    //animate
    //animate info received from server
    c.clearRect(0,0,window.innerWidth,window.innerHeight);

    //animate character:
    requestAnimationFrame(animate);
    main_ch.draw();
    let move_here = main_ch.move(moving);
    if (move_here){
        socket.emit("json", {id:main_ch.identification, x:main_ch.x, y:main_ch.y});

    }
}

animate();
