export default class Tank {
  activeKeys = new Set();

  x = 20;
  y = 20;

  moveUp = () => (this.activeKeys.up = true);
  moveDown = () => (this.activeKeys.down = true);
  moveLeft = () => (this.activeKeys.left = true);
  moveRight = () => (this.activeKeys.right = true);
  stopUp = () => (this.activeKeys.up = false);
  stopDown = () => (this.activeKeys.down = false);
  stopLeft = () => (this.activeKeys.left = false);
  stopRight = () => (this.activeKeys.right = false);
  fire = () => console.log('fire');

  update() {
    if (this.activeKeys.up) {
      this.y -= 1;
      return;
    }
    if (this.activeKeys.down) {
      this.y += 1;
      return;
    }
    if (this.activeKeys.left) {
      this.x -= 1;
      return;
    }
    if (this.activeKeys.right) {
      this.x += 1;
      return;
    }
  }
}
