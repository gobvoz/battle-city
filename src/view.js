import { PADDING_LEFT, PADDING_TOP } from './constants.js';

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
      PADDING_LEFT,
      PADDING_TOP,
      this.world.level.length * this.scale,
      this.world.level[0].length * this.scale,
    );

    this._renderGrid();
    this._renderField();
    this._renderTank(this.world.player1Tank);
    this._renderCollisionTile();
    this._renderDebugInfo();
  }

  _changeAnimationFrame() {
    this.blinkedFrame = !this.blinkedFrame;
  }

  _renderGrid() {
    for (let coord = 0; coord <= this.world.level.length; coord++) {
      this.context.strokeStyle = '#aaa';
      this.context.beginPath();
      this.context.moveTo(PADDING_LEFT + coord * this.scale, PADDING_TOP);
      this.context.lineTo(
        PADDING_LEFT + coord * this.scale,
        PADDING_TOP + this.world.level.length * this.scale,
      );
      this.context.stroke();
      this.context.beginPath();
      this.context.moveTo(PADDING_LEFT, PADDING_TOP + coord * this.scale);
      this.context.lineTo(
        PADDING_LEFT + this.world.level.length * this.scale,
        PADDING_TOP + coord * this.scale,
      );
      this.context.stroke();
    }
  }

  _renderCollisionTile() {
    if (this.world.collisionTileX === null) return;

    this.context.fillStyle = this.blinkedFrame ? 'rgba(0, 255, 0, 0.5)' : 'transparent';
    this.context.beginPath();
    this.context.rect(
      PADDING_LEFT + this.world.collisionTileX * this.scale,
      PADDING_TOP + this.world.collisionTileY * this.scale,
      this.scale,
      this.scale,
    );
    this.context.fill();
  }

  _renderDebugInfo() {
    this.context.fillStyle = '#fff';
    this.context.font = '12px monospace';
    this.context.fillText(
      `${this.world.player1Tank.x},${this.world.player1Tank.y}`,
      PADDING_LEFT + this.world.player1Tank.x,
      PADDING_TOP + this.world.player1Tank.y,
    );
  }

  _renderTile(x, y, tile) {
    this.context.drawImage(
      this.sprite.image,
      ...this.sprite.getTile(tile),
      this.scale,
      this.scale,
      PADDING_LEFT + x * this.scale,
      PADDING_TOP + y * this.scale,
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
      PADDING_LEFT + tank.x,
      PADDING_TOP + tank.y,
      this.scale * 2,
      this.scale * 2,
    );
  }
}
