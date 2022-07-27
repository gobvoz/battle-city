import { Direction } from './constants.js';

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
  }

  _changeAnimationFrame = () => (this.animationFrame ^= 1);

  moveUp = () => {
    this.activeKeys.up = true;
    this.direction = Direction.UP;
  };
  moveDown = () => {
    this.activeKeys.down = true;
    this.direction = Direction.DOWN;
  };
  moveLeft = () => {
    this.activeKeys.left = true;
    this.direction = Direction.LEFT;
  };
  moveRight = () => {
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

    if (this.activeKeys.up) {
      this.y -= speed;
      this._changeAnimationFrame();
    } else if (this.activeKeys.down) {
      this.y += speed;
      this._changeAnimationFrame();
    } else if (this.activeKeys.left) {
      this.x -= speed;
      this._changeAnimationFrame();
    } else if (this.activeKeys.right) {
      this.x += speed;
      this._changeAnimationFrame();
    }
  }
}
