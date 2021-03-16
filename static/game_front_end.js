

//THE 'character' and 'bullet' CLASSES ARE IMPORTED FROM 'game_classes.js' IN THE HTML FILE
var my_id;
var main_ch;
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
    })
    
    socket.on("b", function(something){
        console.log(something);
        add_bullet(something);
    })
    
    ;

    socket.on("new player", function(something){
        //a new  p
        if (something["id"]!==my_id){ //to make sure you don't add yourself twice
            add_player(something);
        }
    });


})

function add_bullet(bullet_object){
    let c_x = bullet_object["x"];
    let c_y = bullet_object["y"];
    let ox = bullet_object["ox"]; //origin x
    let oy = bullet_object["oy"]; //origin y
    let id = bullet_object["id"]; 
    let cur_bul = new bullet(c_x,c_y, ox, oy,id);

    bullets.push(cur_bul);
}
function add_player(info){

    
    let c_x = info["x"];
    let c_y = info["y"];
    let c_r = info["r"];
    let vx = info["vx"];
    let vy = info["vy"];
    let cur_id = info["id"];
    let some_ch = new character(c_x,c_y,c_r,vx,vy,cur_id);
    other_players.push(some_ch);

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

    for (var person in msg){
        person = msg[person];
        if (person.hasOwnProperty('my_id')){
            my_id = person["my_id"];

            let c_x = person["x"];
            let c_y = person["y"];
            let c_r = person["r"];
            let vx = person["vx"];
            let vy = person["vy"];
            let cur_id = person["id"];
            main_ch = new character(c_x,c_y,c_r,vx,vy,cur_id)

        }
        add_player(person);


    }
    
    
}
//CONTROLS AND ALTERNATIVES
const move_left = ['ArrowLeft','a']; // the 'a' and left arrow
const move_right = ['ArrowRight','d']; // 'd' and right arrow
const move_up = ['ArrowUp','w']; // 'w' and up arrow
const move_down = ['ArrowDown','s']; //'s' and down arrow
const shoot_buttons = ["x","X",]; // 'x' key to shoot bullets

var moving = [false,false,false,false]; // index 0: left ,1:right , 2:up, 3:down

window.innerWidth = 1920/4;
window.innerHeight = 1080/4;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var other_players = []
var bullets = []

window.addEventListener("keydown",key_pressed);
window.addEventListener("keyup",key_up);
canvas.onmousedown = shoot_bullet;
// window.addEventListener("beforeunload", function (){
//     console.log("YAS");

//     socket.emit('message', {username:my_id}
//     )})

function shoot_bullet(event){
    let x = event.pageX - $('#main_canvas_object').offset().left;
    let y = event.pageY - $('#main_canvas_object').offset().top;
    let cur_bul = new bullet(main_ch.x,main_ch.y, x, y, my_id);

    bullets.push(cur_bul);

    socket.emit('json', {"b": {"x":main_ch.x, "y":main_ch.y, "ox": x, "oy":y, "id":my_id}});
}
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

            if (move_here){
                // you have moved
                socket.emit("json", {"p":{id:cur_ch.identification, x:newx, y:newy}});
            }

            main_ch.x = newx;
            main_ch.y = newy;
        }
    }

    for (bul of bullets){
        bul.move();
        bul.draw();

    }
    //animate other characters:
}

animate();
