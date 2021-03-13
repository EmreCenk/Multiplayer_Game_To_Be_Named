
var my_id;
var socket = io.connect("http://127.0.0.1:5000/");

// ESTABLISHING SOCKET CONNECTION:
$(document).ready(function(){
    socket.on("connect",function(){
        socket.emit("message", {});
        
    });


    socket.on('message', function(msg) {
        init_char(msg);
   
	});

    socket.on("n", function(something){ //also known as on("update")
        update_player(something);
    });

    socket.on("new player", function(something){
        //a new  p
        console.log(something,"new player");
        if (something["id"]!==my_id){ //to make sure you don't add yourself twice
            add_player(something);
        }
    });


})


function add_player(info){

    
    let c_x = info["x"];
    let c_y = info["y"];
    let c_r = info["r"];
    let vx = info["vx"];
    let vy = info["vy"];
    let cur_id = info["id"];
    let some_ch = new character(c_x,c_y,c_r,vx,vy,cur_id);
    other_players.push(some_ch);
    console.log("Player added: " , other_players ,other_players.length);

}


function update_player(json_input){
    
    let curid = json_input["id"];
    // if (curid === my_id){return null};
    let new_x = json_input["x"];
    let new_y = json_input["y"];

    for (var person in other_players){
        
        if ( other_players[person].identification === curid){
            other_players[person].x = new_x;
            other_players[person].y = new_y;

            break;
        }
    }


}
function init_char(msg){
    console.log(msg, typeof(msg));
    for (var person in msg){
        person = msg[person];
        if (person.hasOwnProperty('my_id')){
            my_id = person["my_id"];
            console.log("id is finally here!", my_id);

        }
        add_player(person);


    }
    
    
    console.log("character init ");
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
        let didx = false;
        let didy = false;
        let newx = this.x;
        let newy = this.y;

        if (array_of_current_moves[0]){
            newx-=this.vx;
            didx = !didx;
        }
        
        if (array_of_current_moves[1]){
            newx+=this.vx;
            didx = !didx;
        }
        
        if (array_of_current_moves[2]){
            newy-=this.vy;
            didy = !didy;
        }
        
        if (array_of_current_moves[3]){
            newy+=this.vy;
            didy = !didy;
        }

        return [didy || didx , newx, newy];

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
// window.addEventListener("beforeunload", function (){
//     console.log("YAS");

//     socket.emit('message', {username:my_id}
//     )})

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

    modify(event.key,true)
}

function key_up(event){
    modify(event.key,false)
}





function animate(){
    //animate
    //animate info received from server
    c.clearRect(0,0,window.innerWidth,window.innerHeight);

    //animate and update your own character::
    requestAnimationFrame(animate);

    for (cur_ch of other_players){

        cur_ch.draw();

        if (cur_ch.identification === my_id){
            //check if you are moving
            let original = cur_ch.move(moving);
            let move_here = original[0];
            let newx = original[1]; 
            let newy = original[2];
            console.log(move_here,newx,newy);
            if (move_here){
                // you have moved
                socket.emit("json", {id:cur_ch.identification, x:newx, y:newy});
            }
        }
    }
    //animate other characters:
}

animate();
