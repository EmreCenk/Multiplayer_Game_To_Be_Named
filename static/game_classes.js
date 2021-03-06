
var canvas = document.querySelector("canvas"); //selecting the canvas from the html
var c = canvas.getContext("2d");
//Making canvas full screen:
console.log("EXECUTE THEM!");



class character{
    constructor(x,y,radius, vx, vy, id, color="black"){
        this.x=x;
        this.y=y;
        this.radius = radius;
        this.vx=vx;
        this.vy = vy;
        this.color=color;
        this.show=true;
        this.id=id;
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
    // theta = 0.0174533*theta;    //converting to radians:

    x = r*Math.cos(theta)+array_new_origin[0];
    y = r*Math.sin(theta)+array_new_origin[1];

    return [x,y];

}


function cartesian_to_polar(x,y,array_new_origin = [0,0]){

    // Returns r, theta. Theta is in radians.
    w = (x - array_new_origin[0]);
    h = (y - array_new_origin[1]);

    r = Math.sqrt(
        (w**2)+(h**2)
    );
    theta = Math.atan(h/w);

    if (x<array_new_origin[0]){
        theta+=Math.PI;
    }
    
    return [r,theta];
}

function is_colliding(x,y,r,xx,yy,rr){

    let distance = Math.sqrt((xx-x)**2 + (yy-y)**2); //calculating the distance between the points
    let limit_dist = rr+r;
    
    console.log(x,y,r,xx,yy,rr);
    console.log(distance,limit_dist, "did we collide?")
    if (distance<=limit_dist){
        return true
    }
    
    return false;

}
class bullet{
    constructor(x,y,target_x,target_y, id, velocity = 8, radius = 3, color="black"){
        this.x = x;
        this.y = y;

        this.origx=x;
        this.origy=y;
        
        let polar_coordinates = cartesian_to_polar(target_x,target_y,[x,y]);
        this.angle = polar_coordinates[1];
        
        // console.log("ANGLE: " + this.angle*57.2957795);
        this.dist_origin = 0;
        this.velocity = velocity;
        this.radius = radius;
        this.id = id;
    }

    move(){
        this.dist_origin += this.velocity;
        let new_coordinates = polar_to_cartesian(this.dist_origin, this.angle, [this.origx,this.origy])

        this.x = new_coordinates[0];
        this.y = new_coordinates[1];
        
    }

    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2);
        c.fillStyle = this.color;
        c.fill();

    }}