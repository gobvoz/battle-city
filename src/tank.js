export default class Tank {
  direction = 0;

  x = 20;
  y = 20;

  moveUp() {
    this.direction = 0;
    //this.y -= 1;
  }
  moveDown() {
    this.direction = 180;
    //this.y += 1;
  }
  moveLeft() {
    this.direction = 270;
    //this.x -= 1;
  }
  moveRight() {
    this.direction = 90;
    //this.x += 1;
  }
  fire() {
    console.log('fire');
  }

  update(isMoving) {
    if (isMoving) {
      switch (this.direction) {
        case 0:
          this.y -= 1;
          break;
        case 180:
          this.y += 1;
          break;
        case 270:
          this.x -= 1;
          break;
        case 90:
          this.x += 1;
          break;
        default:
          break;
      }
    }
  }
}
