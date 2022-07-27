export default class View {
  scale = 8;
  blinkedFrame = true;

  constructor(canvas, sprite, world) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.sprite = sprite;

    this.world = world;

    this._changeAnimationFrame = this._changeAnimationFrame.bind(this);
    setInterval(this._changeAnimationFrame, 500);
  }

  async init() {
    await this.sprite.load();
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = '#000';
    this.context.fillRect(
      0,
      0,
      this.world.level.length * this.scale,
      this.world.level[0].length * this.scale,
    );

    this._renderGrid();
    this._renderField();
    this._renderTank(this.world.player1Tank);
    this._renderCollisionTile();
  }

  _changeAnimationFrame() {
    this.blinkedFrame = !this.blinkedFrame;
  }

  _renderGrid() {
    for (let coord = 0; coord <= this.world.level.length; coord++) {
      this.context.strokeStyle = '#aaa';
      this.context.beginPath();
      this.context.moveTo(coord * this.scale, 0);
      this.context.lineTo(coord * this.scale, this.world.level.length * this.scale);
      this.context.stroke();
      this.context.beginPath();
      this.context.moveTo(0, coord * this.scale);
      this.context.lineTo(this.world.level.length * this.scale, coord * this.scale);
      this.context.stroke();
    }
  }

  _renderCollisionTile() {
    this.context.fillStyle = this.blinkedFrame ? 'rgba(0, 255, 0, 0.5)' : 'transparent';
    this.context.beginPath();
    this.context.rect(
      this.world.collisionTileX * this.scale,
      this.world.collisionTileY * this.scale,
      this.scale,
      this.scale,
    );
    this.context.fill();
  }

  _renderTile(x, y, tile) {
    this.context.drawImage(
      this.sprite.image,
      ...this.sprite.getTile(tile),
      this.scale,
      this.scale,
      x * this.scale,
      y * this.scale,
      this.scale,
      this.scale,
    );
  }

  _renderField() {
    const { level } = this.world;

    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level[y].length; x++) {
        const tile = level[y][x];

        if (tile === 0) {
          continue;
        }

        this._renderTile(x, y, tile);
      }
    }
  }

  _renderTank(tank) {
    this.context.drawImage(
      this.sprite.image,
      ...tank.getFrame(),
      this.scale * 2,
      this.scale * 2,
      tank.x,
      tank.y,
      this.scale * 2,
      this.scale * 2,
    );
  }
}
