export default class View {
  scale = 16;

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
    this.context.fillRect(0, 0, 13 * this.scale, 13 * this.scale);

    this.renderField();
    this.renderTank(this.world.player1Tank);
  }

  renderTile(x, y, tile) {
    this.context.drawImage(
      this.sprite.image,
      ...this.sprite.getTile(tile),
      16,
      16,
      x * this.scale,
      y * this.scale,
      this.scale,
      this.scale,
    );
  }

  renderField() {
    const { level } = this.world;

    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level[y].length; x++) {
        const tile = level[y][x];

        if (tile === 0) {
          continue;
        }

        this.renderTile(x, y, tile);
      }
    }
  }

  renderTank(tank) {
    this.context.drawImage(
      this.sprite.image,
      ...tank.getFrame(),
      16,
      16,
      tank.x,
      tank.y,
      this.scale,
      this.scale,
    );
  }
}
