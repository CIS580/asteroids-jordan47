"use strict";

const MS_PER_FRAME = 1000/8;

const Vector = require('./vector.js');

/**
 * @module exports the Asteroid class
 */
module.exports = exports = Asteroid;

/**
 * @constructor Asteroid
 * Creates a new asteroid object
 * @param {Postition} position object specifying an x and y
 */
function Asteroid(position, canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.position = {
    x: Math.random() * this.worldWidth,
    y: Math.random() * this.worldHeight
  };
  var powerOf = Math.floor(Math.random() * 3);
  this.angle = Math.pow(-1, powerOf) * (Math.random() * (2 * Math.PI));
  this.radius  = (Math.random() + 0.625) * 32;
  this.mass = this.radius;
  this.direction;

  if(this.angle < 0)  this.direction = 0;
  else this.dirction = 1;

  this.velocity = {
    x: Math.random() * 30 / this.mass,
    y: Math.random() * 30 / this.mass
  }

  if(this.angle < 0)
  {
    this.velocity.x = -this.velocity.x;
    this.velocity.y = -this.velocity.y;
  }

  var self = this;
}

function circleCollisionHandler(astArr)
{
  for(var i = 0; i < astArr.length; j++)
  {
    for(var j = 0; j < astArr.length; j++)
    {
      if(i == j) j++;
      var dx = astArr[i].position.x - astArr[j].position.x;
      var dy = astArr[i].position.y - astArr[j].position.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < astArr[i].radius + astArr[j].radius) {
        var collisionNormal = {
          x: astArr[i].position.x - astArr[j].position.x,
          y: astArr[i].position.y - astArr[j].position.y
        }
        // calculate the overlap between balls
        var overlap = 32 - (Math.sqrt(collisionNormal.x * collisionNormal.x + collisionNormal.y * collisionNormal.y));
        var mag = magnitude(collisionNormal);
        var collisionNormal =
        {
          x: collisionNormal.x / mag,
          y: collisionNormal.y / mag
        };
        astArr[i].position.x += collisionNormal.x * overlap / 2;
        astArr[i].position.y += collisionNormal.y * overlap / 2;
        astArr[j].position.x -= collisionNormal.x * overlap / 2;
        astArr[j].position.y -= collisionNormal.y * overlap / 2;
        // Rotate the problem space so that the normal
        // of collision lies along the x-axis
        var angle = Math.atan2(collisionNormal.y, collisionNormal.x);


        var a =
        {
          x: astArr[i].velocity.x * Math.cos(self.angle) - astArr[i].velocity.y * Math.sin(self.angle),
          y: astArr[i].velocity.x * Math.sin(self.angle) + astArr[i].velocity.y * Math.cos(self.angle)
        };
        var b =
        {
          x: astArr[j].velocity.x * Math.cos(self.angle) - astArr[j].velocity.y * Math.sin(self.angle),
          y: astArr[j].velocity.x * Math.sin(self.angle) + astArr[j].velocity.y * Math.cos(self.angle)
        };
        // Solve the collision along the x-axis
        var NewVeloX1 = (astArr[i].velocity.x * (astArr[i].mass - astArr[j].mass) + (2 * astArr[j].mass * astArr[j].velocity.x)) / (astArr[i].mass + astArr[j].mass);
        var NewVeloX2 = (astArr[j].velocity.x * (astArr[j].mass - astArr[i].mass) + (2 * astArr[i].mass * astArr[i].velocity.x)) / (astArr[j].mass + astArr[i].mass);
        var NewVeloY1 = (astArr[i].velocity.y * (astArr[i].mass - astArr[j].mass) + (2 * astArr[j].mass * astArr[j].velocity.y)) / (astArr[i].mass + astArr[j].mass);
        var NewVeloY2 = (astArr[j].velocity.y * (astArr[j].mass - astArr[i].mass) + (2 * astArr[i].mass * astArr[i].velocity.y)) / (astArr[j].mass + astArr[i].mass);
        a.x = NewVeloX1;
        b.x = NewVeloX2;
        a.y = NewVeloY1;
        b.y = NewVeloY2;
        // Rotate the problem space back to world space
        var tempA = a;
        var tempB = b;
        a =
        {
          x: tempA.x * Math.cos(-self.angle) - tempA.y * Math.sin(-self.angle),
          y: tempA.x * Math.sin(-self.angle) + tempA.y * Math.cos(-self.angle)
        }
        b =
        {
          x: tempB.x * Math.cos(-self.angle) - tempB.y * Math.sin(-self.angle),
          y: tempA.x * Math.sin(-self.angle) + tempA.y * Math.cos(-self.angle)
        }
        astArr[i].velocity.x = a.x;
        astArr[j].velocity.x = b.x;
        astArr[i].velocity.y = a.y;
        astArr[j].velocity.y = b.y;
      }
    }
  }
}

/**
 * @function updates the asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Asteroid.prototype.update = function(time, astArr) {
  console.log(astArr.length);
  //circleCollisionHandler(astArr);
  // Apply velocity
  if(this.direction = 0)
  {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
  else
  {
    this.position.x -= this.velocity.x;
    this.position.y -= this.velocity.y;
  }
  
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function renders the asteroid into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Asteroid.prototype.render = function(time, ctx) {
  ctx.save();

  // Draw asteroids
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'white';
  ctx.stroke();

  ctx.restore();
}
