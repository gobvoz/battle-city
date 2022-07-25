export default class View {
  constructor(canvas, sprite, world) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.sprite = sprite;

    this.world = world;
  }

  async init() {
    await this.sprite.load();
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderTank(this.world.player1Tank);
  }

  renderTank(tank) {
    this.context.drawImage(this.sprite.image, 0, 0, 16, 16, tank.x, tank.y, 16, 16);
  }
}
