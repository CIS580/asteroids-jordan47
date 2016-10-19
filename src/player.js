"use strict";

const MS_PER_FRAME = 1000/8;

const Laser = require('./laser.js');
const Asteroid = require('./asteroid.js');
const App = require('./app.js');

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position, canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.state = "idle";
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: 0,
    y: 0
  }
  this.angle = 0;
  this.radius  = 64;
  this.thrusting = false;
  this.steerLeft = false;
  this.steerRight = false;
  this.shooting = false;
  this.lasers = [];
  this.level = 1;
  this.score = 0;
  this.lives = 3;

  var self = this;
  window.onkeydown = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = true;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = true;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = true;
        break;
      case 'i':
        self.shooting = true;
        break;
    }
  }

  window.onkeyup = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = false;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = false;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = false;
        break;
      case 'i':
        self.shooting = false;
        break;
    }
  }
}

function checkCollisions(astArr, canvas)
{
  astArr.forEach(function(asteroid)
  {
    if(self.position.x < asteroid.position.x + asteroid.radius &&
   self.position.x + 10 > asteroid.position.x &&
   self.position.y < asteroid.position.y + asteroid.radius &&
   10 + self.position.y > asteroid.position.y)
   {
     player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas);
     var asteroids = [];
     for(var i = 0; i < (10 + 5 * self.level); i++)
     {
       asteroids[i] = new Asteroid({x: canvas.width/2, y: canvas.height/2}, canvas);
     }
   }
 });
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time, canvas) {
  if(typeof astArr != "undefined") checkCollisions(App.asteroids, canvas);
  if(this.shooting) this.lasers.push(new Laser(this.position, this.angle));
  if(this.lasers.length > 64) this.lasers.shift();
  console.log(this.lasers.length);
  this.lasers.forEach(function(laser)
  {
    laser.update(time);
  });
  // Apply angular velocity
  if(this.steerLeft) {
    this.angle += time * 0.005;
  }
  if(this.steerRight) {
    this.angle -= 0.1;
  }
  // Apply acceleration
  if(this.thrusting) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    this.velocity.x -= acceleration.x;
    this.velocity.y -= acceleration.y;
  }
  // Apply velocity
  this.position.x += this.velocity.x/15;
  this.position.y += this.velocity.y/15;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  ctx.save();

  // Draw player's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-10, 10);
  ctx.lineTo(0, 0);
  ctx.lineTo(10, 10);
  ctx.closePath();
  ctx.strokeStyle = 'white';
  ctx.stroke();

  // Draw engine thrust
  if(this.thrusting) {
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(5, 10);
    ctx.arc(0, 10, 5, 0, Math.PI, true);
    ctx.closePath();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }

  ctx.restore();
  // Draw the lasers
  this.lasers.forEach(function(laser)
  {
    laser.render(time, ctx);
  });
}
