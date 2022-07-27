import { Direction, MOVEMENT_TRASH_HOLE } from './constants.js';

export default class Tank {
  activeKeys = new Set();

  frameSize = 16;
  animationFrame = 1;
  frames = {
    [Direction.UP]: [
      [0, 0],
      [1, 0],
    ],
    [Direction.LEFT]: [
      [2, 0],
      [3, 0],
    ],
    [Direction.DOWN]: [
      [4, 0],
      [5, 0],
    ],
    [Direction.RIGHT]: [
      [6, 0],
      [7, 0],
    ],
  };

  constructor(world, x, y, direction, speed) {
    this.world = world;

    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = speed;

    this.movementTrashStep = MOVEMENT_TRASH_HOLE / 2;
    this.movementTrashHole = MOVEMENT_TRASH_HOLE;
  }

  _changeAnimationFrame = () => (this.animationFrame ^= 1);

  _helpTurnTank() {
    const deltaX = this.x % this.movementTrashHole;
    const deltaY = this.y % this.movementTrashHole;

    if (this.direction === Direction.LEFT) {
      this.x += deltaX <= this.movementTrashStep ? -deltaX : this.movementTrashHole - deltaX;
    }
    if (this.direction === Direction.RIGHT) {
      this.x += deltaX <= this.movementTrashStep ? -deltaX : this.movementTrashHole - deltaX;
    }
    if (this.direction === Direction.UP) {
      this.y += deltaY <= this.movementTrashStep ? -deltaY : this.movementTrashHole - deltaY;
    }
    if (this.direction === Direction.DOWN) {
      this.y += deltaY <= this.movementTrashStep ? -deltaY : this.movementTrashHole - deltaY;
    }
  }

  moveUp = () => {
    if (this.direction === Direction.LEFT || this.direction === Direction.RIGHT) {
      this._helpTurnTank();
    }

    this.activeKeys.up = true;
    this.direction = Direction.UP;
  };
  moveDown = () => {
    if (this.direction === Direction.LEFT || this.direction === Direction.RIGHT) {
      this._helpTurnTank();
    }

    this.activeKeys.down = true;
    this.direction = Direction.DOWN;
  };
  moveLeft = () => {
    if (this.direction === Direction.UP || this.direction === Direction.DOWN) {
      this._helpTurnTank();
    }

    this.activeKeys.left = true;
    this.direction = Direction.LEFT;
  };
  moveRight = () => {
    if (this.direction === Direction.UP || this.direction === Direction.DOWN) {
      this._helpTurnTank();
    }

    this.activeKeys.right = true;
    this.direction = Direction.RIGHT;
  };

  stopUp = () => (this.activeKeys.up = false);
  stopDown = () => (this.activeKeys.down = false);
  stopLeft = () => (this.activeKeys.left = false);
  stopRight = () => (this.activeKeys.right = false);
  fire = () => console.log('fire');

  getFrame = () => [
    this.frames[this.direction][this.animationFrame][0] * this.frameSize,
    this.frames[this.direction][this.animationFrame][1] * this.frameSize,
  ];

  update() {
    const speed = this.world.canIMove(this) ? this.speed : 0;

    if (this.direction === Direction.UP && this.activeKeys.up) {
      this.y -= speed;
      this._changeAnimationFrame();
    } else if (this.direction === Direction.DOWN && this.activeKeys.down) {
      this.y += speed;
      this._changeAnimationFrame();
    } else if (this.direction === Direction.LEFT && this.activeKeys.left) {
      this.x -= speed;
      this._changeAnimationFrame();
    } else if (this.direction === Direction.RIGHT && this.activeKeys.right) {
      this.x += speed;
      this._changeAnimationFrame();
    }
  }
}
