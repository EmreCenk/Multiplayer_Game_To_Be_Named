
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


function polar_to_cartesian(r,theta,array_new_origin = [0,0]){
    // automatically converts theta into radians, the input should be in regular degrees.
    theta = 0.0174533*theta;    //converting to radians:

    x = r*Math.cos(theta)+array_new_origin[0];
    y = r*Math.sin(theta)+array_new_origin[1];

    return [x,y];

}


function cartesian_to_polar(x,y,array_new_origin = [0,0]){

    // Returns r, theta. Theta is in radians.
    w = (x - array_new_origin[0]);
    h = (y - array_new_origin[0]);

    r = Math.sqrt(
        (w**2)+(h**2)
    );
    theta = Math.atan2(h,w);

    return [r,theta];
}
class bullet{
    constructor(x,y,target_x,target_y, velocity = 8, radius = 3, color="black"){
        this.x = x;
        this.y = y;
        let polar_coordinates = cartesian_to_polar(target_x,target_y,[x,y]);
        this.angle = polar_coordinates[0];
        this.dist_origin = 0;
        this.velocity = velocity;
        this.radius = radius;

    }

    move(){
        this.dist_origin += this.velocity;
        let new_coordinates = polar_to_cartesian(this.dist_origin, this.angle)

        this.x = new_coordinates[0];
        this.y = new_coordinates[1];
        
    }

    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2);
        c.fillStyle = this.color;
        c.fill();

    }}