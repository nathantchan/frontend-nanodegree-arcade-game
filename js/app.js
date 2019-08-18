function randomSpeed() {
  const speeds = [50, 100, 500];
  const i = Math.floor(Math.random() * 3);
  return speeds[i];
}

function initialY() {
  let row = Math.floor(Math.random() * 3);
  if (row == 3) {
    //in unlikely case that 1 is drawn by Math.random()
    row = 2;
  }

  return row * 80 + 64;
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = 0;
    this.y = initialY();
    this.speed = randomSpeed();
    this.width = 85;
    this.height= 50; 
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, player) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= ctx.canvas.width) {
      this.x += dt * this.speed
    } else {
      this.x = 0;
      this.y = initialY();
    }

    // collision detection algorithm adapted from
    // http://blog.sklambert.com/html5-canvas-game-2d-collision-detection/#d-collision-detection
    if (player.x < this.x + this.width &&
        player.x + player.width  > this.x &&
		    player.y < this.y + this.height &&
        player.y + player.height > this.y) {
      const collided = true;
      player.update(true);
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
  constructor() {
    this.sprite = "images/char-boy.png";
    this.x = 200;
    this.y = 380;
    this.width = 85;
    this.height = 50;
  }

  update(collided=false) {
    if (collided) {
      this.reset();
    }
  }

  render() {ctx.drawImage(Resources.get(this.sprite), this.x, this.y)}

  handleInput(key) {
    const y_step = 80;
    const x_step = 100;
    switch (key) {
      case 'left':
        this.x -= x_step;
        break;
      case 'right':
        this.x += x_step;
        break;
      case 'up':
        this.y -= y_step;
        break;
      case 'down':
        this.y += y_step;
    }

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > 400) {
      this.x = 400;
    }
 
    if (this.y < 60) {
      // The player has reached the end.
      window.openModal();
      this.reset();
    } else if (this.y > 380) {
      this.y = 380;
    }
  }

  reset() {
    this.y = 380;
    this.x = 200;
  }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const enemy = new Enemy();
const allEnemies = [];

for (var i=0; i<3; i++) {
  allEnemies.push(new Enemy());
}

const player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Modal JS code adapted from:
// https://lowrey.me/modals-in-pure-es6-javascript/
class Modal {
  constructor(overlay) {
    this.overlay = overlay;
    const closeButton = overlay.querySelector('.button-close')
    closeButton.addEventListener('click', this.close.bind(this));
    overlay.addEventListener('click', e => {
      if (e.srcElement.id === this.overlay.id) {
        this.close();
      }
    });
  }
  open() {
    this.overlay.classList.remove('is-hidden');
  }

  close() {
    this.overlay.classList.add('is-hidden');
  }
}
const modal = new Modal(document.querySelector('.modal-overlay'));
window.openModal = modal.open.bind(modal);
