import { RenderOption, DEBUG } from './constants.js';

export default class View {
  blinkedFrame = true;

  constructor(canvas, sprite, world) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.context.imageSmoothingEnabled = false;

    this.sprite = sprite;

    this.world = world;
    this._changeAnimationFrame = this._changeAnimationFrame.bind(this);
    setInterval(this._changeAnimationFrame, 500);
  }

  async init() {
    await this.sprite.load();
  }

  render(fps, busyTime) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = '#000';
    this.context.fillRect(
      RenderOption.PADDING_LEFT,
      RenderOption.PADDING_TOP,
      this.world.stage.length * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      this.world.stage[0].length * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
    );

    DEBUG && this._renderGrid();
    this._renderField();
    //this._renderTank(this.world.player1Tank);

    this.world.objects.forEach(gameObject => {
      this._renderObject(gameObject);
    });

    DEBUG && this._renderCollisionTile();
    DEBUG && this._renderDebugInfo(fps, busyTime);
  }

  _changeAnimationFrame() {
    this.blinkedFrame = !this.blinkedFrame;
  }

  _renderGrid() {
    for (let mapUnit = 0; mapUnit <= this.world.stage.length; mapUnit++) {
      this.context.strokeStyle = '#555';
      if (mapUnit % 2 === 0) {
        this.context.strokeStyle = '#888';
      }
      this.context.beginPath();
      this.context.moveTo(
        RenderOption.PADDING_LEFT + mapUnit * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.PADDING_TOP,
      );
      this.context.lineTo(
        RenderOption.PADDING_LEFT + mapUnit * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.PADDING_TOP +
          this.world.stage.length * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      );
      this.context.stroke();
      this.context.beginPath();
      this.context.moveTo(
        RenderOption.PADDING_LEFT,
        RenderOption.PADDING_TOP + mapUnit * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      );
      this.context.lineTo(
        RenderOption.PADDING_LEFT +
          this.world.stage.length * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.PADDING_TOP + mapUnit * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      );
      this.context.stroke();
    }
  }

  _renderCollisionTile() {
    if (this.world.collisionTiles.length === 0) return;

    this.context.fillStyle = this.blinkedFrame ? 'rgba(0, 255, 0, 0.5)' : 'transparent';
    this.world.collisionTiles.forEach(tile => {
      this.context.beginPath();
      this.context.rect(
        RenderOption.PADDING_LEFT + tile[0] * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.PADDING_TOP + tile[1] * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      );
      this.context.fill();
    });
  }

  _renderDebugInfo(fps, busyTime) {
    this.context.fillStyle = '#fff';
    this.context.font = '12px monospace';

    // this.context.fillText(
    //   `${this.world.player1Tank.x},${this.world.player1Tank.y}`,
    //   RenderOption.PADDING_LEFT + this.world.player1Tank.x * RenderOption.MULTIPLEXER,
    //   RenderOption.PADDING_TOP + this.world.player1Tank.y * RenderOption.MULTIPLEXER,
    // );

    this.context.fillText(
      `fps:  ${fps}`,
      RenderOption.PADDING_LEFT + this.world.maxWorldX * RenderOption.MULTIPLEXER + 10,
      RenderOption.PADDING_TOP + 10,
    );
    this.context.fillText(
      `busy: ${busyTime}`,
      RenderOption.PADDING_LEFT + this.world.maxWorldX * RenderOption.MULTIPLEXER + 10,
      RenderOption.PADDING_TOP + 20,
    );
  }

  // _renderTile(x, y, tile) {
  _renderTile(tile) {
    this.context.drawImage(
      this.sprite.image,
      //...this.sprite.getTile(tile.terrainType),
      tile.sprite[0] * RenderOption.UNIT_SIZE,
      tile.sprite[1] * RenderOption.UNIT_SIZE,
      RenderOption.TILE_SIZE,
      RenderOption.TILE_SIZE,
      RenderOption.PADDING_LEFT + tile.x * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      RenderOption.PADDING_TOP + tile.y * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
    );
  }

  _renderField() {
    const { stage } = this.world;

    for (let y = 0; y < stage.length; y++) {
      for (let x = 0; x < stage[y].length; x++) {
        const tile = stage[y][x];

        if (tile === null) {
          continue;
        }

        // this._renderTile(x, y, tile);
        this._renderTile(tile);
      }
    }
  }

  _renderObject(gameObject) {
    this.context.drawImage(
      this.sprite.image,
      ...gameObject.sprite,
      gameObject.width,
      gameObject.height,
      RenderOption.PADDING_LEFT + gameObject.x * RenderOption.MULTIPLEXER,
      RenderOption.PADDING_TOP + gameObject.y * RenderOption.MULTIPLEXER,
      gameObject.width * RenderOption.MULTIPLEXER,
      gameObject.width * RenderOption.MULTIPLEXER,
    );
  }
}
