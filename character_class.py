

class character:

    def __init__(self, x,y,radius,identification):
        self.x=x
        self.y=y
        self.radius = radius   
        self.id=identification
        

from math import cos,sin,radians,degrees,sqrt,atan2
def polar_to_cartesian(r,theta,tuple_new_origin=(0,0)):
    """Converts height given polar coordinate r,theta into height coordinate on the cartesian plane (x,y). We use polar
    coordinates to make the rotation mechanics easier. This function also converts theta into radians."""
    #theta=0.0174533*theta #1 degrees = 0.0174533 radians
    theta=radians(theta)

    # we need to modify our calculation for the new origin as well
    x=r*cos(theta)+tuple_new_origin[0] #finding x
    y=r*sin(theta)+tuple_new_origin[1] #finding y

    return (x,y)

def cartesian_to_polar(x,y,tuple_new_origin=(0,0)):
    """Is the inverse function of 'cartesian'. Converts height given cartesian coordinate; x,y into height polar coordinate in
    the form (r, theta). """

    w=(x-tuple_new_origin[0]) #width of mini triangle
    h=(y-tuple_new_origin[0]) #height of mini triangle

    r=sqrt((w**2)+(h**2)) # from the pythagorean theorem
    theta=atan2(h,w)

    return r,degrees(theta)


class bullet:
    
    def __init__(self, x,y,target_x,target_y, player_id, velocity = 8, radius = 3, color="black"):
        self.x = x
        self.y = y

        self.origx=x
        self.origy=y
        polar_coordinates = cartesian_to_polar(target_x,target_y,[x,y])
        self.angle = polar_coordinates[1]
        
        self.dist_origin = 0
        self.velocity = velocity
        self.radius = radius
        self.player_id = player_id
    

    def move(self):
        self.dist_origin += self.velocity
        new_coordinates = polar_to_cartesian(self.dist_origin, self.angle, [self.origx,self.origy])

        self.x = new_coordinates[0]
        self.y = new_coordinates[1]
        


    
