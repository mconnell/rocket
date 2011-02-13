jQuery(function($){

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var c_width = 100.0;
var ppm = canvas.width/c_width;
var c_height = canvas.height/ppm;
ctx.setTransform(ppm, 0, 0, -ppm, 0, canvas.height);  

var worldAABB = new b2AABB();
worldAABB.lowerBound.Set(-10000.0, -10000.0);
worldAABB.upperBound.Set(10000.0, 10000.0);
var gravity = new b2Vec2(0.0, -9.8);
var world = new b2World(worldAABB, gravity, true);
window.world = world;

var groundBodyDef = new b2BodyDef();
groundBodyDef.position.Set(c_width/2.0, 3.0);
var groundBody = world.CreateBody(groundBodyDef);
var groundShapeDef = new b2PolygonDef();
groundShapeDef.restitution = 0.0;
groundShapeDef.friction = 0.5;
groundShapeDef.density = 1.0;
groundBody.w = c_width*1.0
groundBody.h = 5.0
groundShapeDef.SetAsBox(groundBody.w, groundBody.h);
groundBody.CreateShape(groundShapeDef);
groundBody.SynchronizeShapes();

bodies = [groundBody];
var explosionParticles = [];

function spawn(x, y) {
    var bodyDef = new b2BodyDef();
    bodyDef.position.Set(x, y);
    var body = world.CreateBody(bodyDef);
    var shapeDef = new b2PolygonDef();
    shapeDef.SetAsBox(1.25, 2.0);
    body.w = 1.25;
    body.h = 2.0;
    shapeDef.restitution = 0.0;
    shapeDef.density = 1.0;
    shapeDef.friction = 0.9;
    body.CreateShape(shapeDef);
    body.SetMassFromShapes();
    bodies.push(body);
    foo = body;
}

// $(canvas).click(function (e){
//     var o = $(canvas).offset();
//     var x = (e.pageX-o.left)/ppm;
//     var y = (canvas.height-e.pageY+o.top)/ppm;
//     explode(x, y);
// //    spawn((e.pageX-o.left)/ppm, (canvas.height-e.pageY+o.top)/ppm);
// });
// //debugger;

for(var i = 0; i < 1; i ++) {
    spawn(c_width/2, c_height);
}

var fps = new Engine.FPSCounter(ctx);
window.setInterval(function() {

    world.Step(1.0/60.0, 10);
    //ctx.clearRect(0.0, 0.0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, c_width, c_height);
    ctx.fillStyle = 'black';
    for(var i = 0; i < bodies.length; i++){
        var body = bodies[i];
        var t = body.m_xf;
        ctx.translate(t.position.x, t.position.y)
        ctx.rotate(body.GetAngle());
        ctx.fillRect(-body.w, -body.h, body.w*2, body.h*2);
        ctx.rotate(-body.GetAngle());
        ctx.translate(-t.position.x, -t.position.y)
    }

    applyMovement();

    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    fps.draw();
    ctx.restore();
}, 1000/60);

thrust       = false;
rotate_left  = false;
rotate_right = false;

window.addEventListener('keydown', keyDown, false);
window.addEventListener('keyup', keyUp, false);

function keyDown(event){
  switch(event.keyCode){
    case 38:
      thrust = true;
      break;
    case 37: // left
      rotate_left = true;
      break;
    case 39: // right
      rotate_right = true;
      break;
  };
};

function keyUp(event){
  switch(event.keyCode){
    case 38:
      thrust = false;
      break;
    case 37: // left
      rotate_left  = false;
      break;
    case 39: // right
      rotate_right = false;
      break;
  };
};
function applyMovement(){
  if(thrust){
    thrust_vec = new b2Mat22(new b2Vec2(0, 0), new b2Vec2(1, 1));
    thrust_vec.Set(foo.GetAngle() + 1.5707);
    thrust_vec.col1.y *= 250;
    thrust_vec.col1.x *= 250;
    foo.ApplyForce(thrust_vec.col1, foo.GetWorldCenter());
  };
  if(rotate_left){
    foo.ApplyTorque(40);
  };
  if(rotate_right){
    foo.ApplyTorque(-40);
  };
}


});
jQuery.noConflict();
