

// import character from "game_classes"
// import bullet from "./game_classes"

//THE 'character' and 'bullet' CLASSES ARE IMPORTED FROM 'game_classes.js' IN THE HTML FILE
var my_id;
var main_ch;
//io.connect("http://127.0.0.1:5000/") -> used to be arguement for io();
var socket = io();

//CONTROLS AND ALTERNATIVES
const move_left = ['ArrowLeft','a']; // the 'a' and left arrow
const move_right = ['ArrowRight','d']; // 'd' and right arrow
const move_up = ['ArrowUp','w']; // 'w' and up arrow
const move_down = ['ArrowDown','s']; //'s' and down arrow
const shoot_buttons = ["x","X",]; // 'x' key to shoot bullets
const frame_rate = 45;

var moving = [false,false,false,false]; // index 0: left ,1:right , 2:up, 3:down

window.innerWidth = 1920/4;
window.innerHeight = 1080/4;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var other_players = []
var bullets = []

$(document).ready(function(){

    // ESTABLISHING SOCKET CONNECTION:
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

        add_bullet(something);
    })
    
    ;

    socket.on("new player", function(something){
        //a new  p
        if (something["id"]!==my_id){ //to make sure you don't add yourself twice
            add_player(something);
        }
    });
    
    socket.on("d", function(something){
        disconnect_player(something);
    })

})

function disconnect_player(player_object){
    let id = player_object["id"];
    console.log(id, "yoyoyoyo");
    for (let i=0; i<other_players.length; i++){
        if (id === other_players[i].id){
            other_players.splice(i,1);//player has been popped from the array
            console.log("player popped", other_players.length);
            return null;
        }
    }

}

function add_bullet(bullet_object){
    let id = bullet_object["id"]; 
    if (id === my_id){
        //it was my bullet
        return null

    }

    let c_x = bullet_object["x"];
    let c_y = bullet_object["y"];
    let ox = bullet_object["ox"]; //origin x
    let oy = bullet_object["oy"]; //origin y
    let req_time = bullet_object["t"]; //when the request was first made

    let date_object = new Date();
    let cycles = (date_object.getTime()-req_time)*frame_rate/1000; 
    cycles = Math.floor(cycles); //round to lower integer.
    let cur_bul = new bullet(c_x,c_y, ox, oy,id);

    // console.log(date_object.getTime(), req_time, cycles);
    for (let i=0; i<cycles; i++){
        cur_bul.move();
    }

    

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
        
        if ( other_players[person].id === curid){
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


window.addEventListener("keydown",key_pressed);
window.addEventListener("keyup",key_up);
window.setInterval(maintain_physics, 1000/frame_rate);
canvas.onmousedown = shoot_bullet;
// window.addEventListener("beforeunload", function (){
//     console.log("YAS");

//     socket.emit('message', {username:my_id}
//     )})

function shoot_bullet(event){
    let x = event.pageX - $('#main_canvas_object').offset().left;
    let y = event.pageY - $('#main_canvas_object').offset().top;
    let cur_bul = new bullet(main_ch.x,main_ch.y, x, y, my_id);
    let date_object = new Date();

    bullets.push(cur_bul);

    socket.emit('json', {"b": {"x":main_ch.x, "y":main_ch.y, "ox": x, "oy":y, "id":my_id,"t":date_object.getTime()}});
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


function update_main_ch(){

    let cur_ch = main_ch;
    //check if you are moving
    let original = cur_ch.move(moving);
    let move_here = original[0];
    let newx = original[1]; 
    let newy = original[2];

    if (move_here){
        // you have moved
        socket.emit("json", {"p":{id:cur_ch.id, x:newx, y:newy}});
    }

    main_ch.x = newx;
    main_ch.y = newy;
}

function update_bullets(){
    
    for (let i=0; i<bullets.length; i++){
        let bul = bullets[i];
        bul.move();
        if (bul.x<0 || bul.x>window.innerWidth || bul.y<0 || bul.y>window.innerHeight){
            bullets.splice(i,1);
            console.log("bullet has dissapeared hihi")
        }
    }
}

function check_player_death(){
    for (let bul of bullets){
        
        if (bul.id ===  my_id){

            continue;
        }
        if (is_colliding(main_ch.x,   main_ch.y,   main_ch.radius, bul.x,  bul.y, bul.radius )){
            socket.emit("json", {"d":{id:cur_ch.id}});

            window.cancelAnimationFrame(animate);
            // window.location.href = "/death"; // redirect yourself

            alert("YOU HAVE DIED");

            

        }
    }
}
function maintain_physics(){
    console.log("maintaining physics");
    update_main_ch();
    update_bullets();
    check_player_death();
}

function animate(){
    //animate
    //animate info received from server
    c.clearRect(0,0,window.innerWidth,window.innerHeight);

    //animate and update your own character::
    requestAnimationFrame(animate);

    for (cur_ch of other_players){

        cur_ch.draw();


    }

    for (bul of bullets){
        bul.draw();

    }
    //animate other characters:
}

animate();
