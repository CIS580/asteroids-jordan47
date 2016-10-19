(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Asteroid = require('./asteroid.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas);
var asteroids = [];
for(var i = 0; i < 10; i++)
{
  asteroids[i] = new Asteroid({x: canvas.width/2, y: canvas.height/2}, canvas);
}
/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime, canvas);
  for(var i = 0; i < asteroids.length; i++)
  {
    asteroids[i].update(elapsedTime, asteroids);
  }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.render(elapsedTime, ctx);
  for(var i = 0; i < asteroids.length; i++)
  {
    asteroids[i].render(elapsedTime, ctx);
  }
  ctx.fillStyle = 'white';
  ctx.font = "12pt Jokerman"
  ctx.fillText("Score: " + player.score + "       Lvl: " + player.level + "       Lives : " + player.lives, 10, 475);
}

},{"./asteroid.js":2,"./game.js":3,"./player.js":5}],2:[function(require,module,exports){
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

},{"./vector.js":6}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Laser;

/**
 * @constructor Laser
 * Creates a new laser object
 * @param {Postition} position object specifying an x and y
 */
function Laser(position, angle) {
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: -8*Math.sin(angle),
    y: -8*Math.cos(angle)
  }
  this.angle = angle;
}

/**
 * @function updates the laser object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Laser.prototype.update = function(time) {
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Laser.prototype.render = function(time, ctx) {
  ctx.save();
  // Draw the laser
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 2, 8);

  ctx.restore();
}

},{}],5:[function(require,module,exports){
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

},{"./app.js":1,"./asteroid.js":2,"./laser.js":4}],6:[function(require,module,exports){
/**
 * @module Vector
 * A library of vector functions.
 */
module.exports = exports = {
  rotate: rotate,
  dotProduct: dotProduct,
  magnitude: magnitude,
  normalize: normalize
}

/**
 * @function rotate
 * Rotates a vector about the Z-axis
 * @param {Vector} a - the vector to rotate
 * @param {float} angle - the angle to roatate by (in radians)
 * @returns a new vector representing the rotated original
 */
function rotate(a, angle) {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
  }
}

/**
 * @function dotProduct
 * Computes the dot product of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed dot product
 */
function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y
}

/**
 * @function magnitude
 * Computes the magnitude of a vector
 * @param {Vector} a the vector
 * @returns the calculated magnitude
 */
function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

/**
 * @function normalize
 * Normalizes the vector
 * @param {Vector} a the vector to normalize
 * @returns a new vector that is the normalized original
 */
function normalize(a) {
  var mag = magnitude(a);
  return {x: a.x / mag, y: a.y / mag};
}

},{}]},{},[1,3,5,2,6]);
