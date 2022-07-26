export default class Tank {
  activeKeys = new Set();
  direction = 'top';

  x = 20;
  y = 20;

  frameSize = 16;
  animationFrame = 1;
  frames = {
    top: [
      [0, 0],
      [1, 0],
    ],
    left: [
      [2, 0],
      [3, 0],
    ],
    bottom: [
      [4, 0],
      [5, 0],
    ],
    right: [
      [6, 0],
      [7, 0],
    ],
  };

  _changeAnimationFrame = () => (this.animationFrame ^= 1);

  moveUp = () => (this.activeKeys.up = true);
  moveDown = () => (this.activeKeys.down = true);
  moveLeft = () => (this.activeKeys.left = true);
  moveRight = () => (this.activeKeys.right = true);
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
    if (this.activeKeys.up) {
      this.y -= 1;
      this.direction = 'top';
      this._changeAnimationFrame();
    } else if (this.activeKeys.down) {
      this.y += 1;
      this.direction = 'bottom';
      this._changeAnimationFrame();
    } else if (this.activeKeys.left) {
      this.x -= 1;
      this.direction = 'left';
      this._changeAnimationFrame();
    } else if (this.activeKeys.right) {
      this.x += 1;
      this.direction = 'right';
      this._changeAnimationFrame();
    }
  }
}
