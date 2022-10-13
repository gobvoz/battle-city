import { RenderOption, SidePanelOption, DEBUG } from './constants.js';

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

  render(game) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = '#666';
    this.context.fillRect(0, 0, 256 * RenderOption.MULTIPLEXER, 224 * RenderOption.MULTIPLEXER);

    this.context.fillStyle = '#000';
    this.context.fillRect(
      RenderOption.PADDING_LEFT,
      RenderOption.PADDING_TOP,
      this.world.stage.length * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      this.world.stage[0].length * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
    );

    DEBUG && this._renderGrid();
    const postRender = this._renderField();
    //this._renderTank(this.world.player1Tank);

    this.world.objects.forEach(gameObject => {
      gameObject && this._renderObject(gameObject);
      DEBUG && this._renderObjectBorder(gameObject);
    });

    this._renderSidePanel(game);

    postRender.forEach(tile => {
      this._renderTile(tile);
    });

    DEBUG && this._renderCollisionTile();
    DEBUG && this._renderDebugInfo(game, this.world);
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

  _renderDebugInfo(game, world) {
    this.context.fillStyle = '#fff';
    this.context.font = '12px monospace';

    // this.context.fillText(
    //   `${this.world.player1Tank.x},${this.world.player1Tank.y}`,
    //   RenderOption.PADDING_LEFT + this.world.player1Tank.x * RenderOption.MULTIPLEXER,
    //   RenderOption.PADDING_TOP + this.world.player1Tank.y * RenderOption.MULTIPLEXER,
    // );

    this.context.fillText(`fps:  ${game.fps}`, 10, 224 * RenderOption.MULTIPLEXER + 10);
    this.context.fillText(`busy: ${game.busyTime}`, 10, 224 * RenderOption.MULTIPLEXER + 20);
    this.context.fillText(
      `tanks: ${world.enemyArray.length}`,
      10,
      224 * RenderOption.MULTIPLEXER + 30,
    );

    world.enemyTanks.forEach((tank, index) => {
      this.context.fillText(
        `tank ${index}: ${String(tank.x).padStart(3, ' ').slice(0, 3)} ${String(tank.y)
          .padStart(3, ' ')
          .slice(0, 3)}`,
        10,
        224 * RenderOption.MULTIPLEXER + 40 + index * 10,
      );
    });
  }

  _renderTile(tile) {
    this.context.drawImage(
      this.sprite.image,
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
    const postRender = [];

    for (let y = 0; y < stage.length; y++) {
      for (let x = 0; x < stage[y].length; x++) {
        const tile = stage[y][x];

        if (tile === null) {
          continue;
        }

        if (tile.zIndex) {
          postRender.push(tile);
          continue;
        }

        this._renderTile(tile);
      }
    }

    return postRender;
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

  _renderObjectBorder(gameObject) {
    this.context.strokeStyle = '#fff';
    this.context.beginPath();
    this.context.rect(
      RenderOption.PADDING_LEFT + gameObject.x * RenderOption.MULTIPLEXER,
      RenderOption.PADDING_TOP + gameObject.y * RenderOption.MULTIPLEXER,
      gameObject.width * RenderOption.MULTIPLEXER,
      gameObject.width * RenderOption.MULTIPLEXER,
    );
    this.context.stroke();
  }

  _renderSidePanel(game) {
    let isNextRow = true;
    let offsetY = 0;

    for (let i = 0; i < this.world.enemyArray.length; i++) {
      this.context.drawImage(
        this.sprite.image,
        ...SidePanelOption.TANK.SPRITES,
        SidePanelOption.TANK.WIDTH,
        SidePanelOption.TANK.HEIGHT,
        SidePanelOption.TANK.OFFSET_X +
          SidePanelOption.TANK.WIDTH * RenderOption.MULTIPLEXER * isNextRow,
        SidePanelOption.TANK.OFFSET_Y + offsetY * RenderOption.MULTIPLEXER,
        SidePanelOption.TANK.WIDTH * RenderOption.MULTIPLEXER,
        SidePanelOption.TANK.HEIGHT * RenderOption.MULTIPLEXER,
      );

      isNextRow = !isNextRow;
      if (isNextRow) offsetY = ((i + 1) * SidePanelOption.TANK.HEIGHT) / 2;
    }

    // player 1
    if (game.player1Tank) {
      const player1logo = SidePanelOption.PLAYER_1;
      this.context.drawImage(
        this.sprite.image,
        ...player1logo.SPRITES,
        player1logo.WIDTH,
        player1logo.HEIGHT,
        player1logo.OFFSET_X,
        player1logo.OFFSET_Y,
        player1logo.WIDTH * RenderOption.MULTIPLEXER,
        player1logo.HEIGHT * RenderOption.MULTIPLEXER,
      );
      const player1Lives = SidePanelOption.NUMBER[game.player1Lives];
      this.context.drawImage(
        this.sprite.image,
        ...player1Lives.SPRITES,
        player1Lives.WIDTH,
        player1Lives.HEIGHT,
        player1logo.OFFSET_X + RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        player1logo.OFFSET_Y + RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        player1Lives.WIDTH * RenderOption.MULTIPLEXER,
        player1Lives.HEIGHT * RenderOption.MULTIPLEXER,
      );
    }

    //player 2
    if (game.player1Tank) {
      const player2logo = SidePanelOption.PLAYER_2;
      this.context.drawImage(
        this.sprite.image,
        ...player2logo.SPRITES,
        player2logo.WIDTH,
        player2logo.HEIGHT,
        player2logo.OFFSET_X,
        player2logo.OFFSET_Y,
        player2logo.WIDTH * RenderOption.MULTIPLEXER,
        player2logo.HEIGHT * RenderOption.MULTIPLEXER,
      );
      const player2Lives = SidePanelOption.NUMBER[game.player2Lives];
      this.context.drawImage(
        this.sprite.image,
        ...player2Lives.SPRITES,
        player2Lives.WIDTH,
        player2Lives.HEIGHT,
        player2logo.OFFSET_X + RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        player2logo.OFFSET_Y + RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        player2Lives.WIDTH * RenderOption.MULTIPLEXER,
        player2Lives.HEIGHT * RenderOption.MULTIPLEXER,
      );
    }

    //stage
    const stage = SidePanelOption.STAGE;
    this.context.drawImage(
      this.sprite.image,
      ...stage.SPRITES,
      stage.WIDTH,
      stage.HEIGHT,
      stage.OFFSET_X,
      stage.OFFSET_Y,
      stage.WIDTH * RenderOption.MULTIPLEXER,
      stage.HEIGHT * RenderOption.MULTIPLEXER,
    );
    const stageLevelRight = game.currentStage % 10;
    const stageLevelLeft = (game.currentStage - stageLevelRight) / 10;
    if (stageLevelLeft) {
      const number = SidePanelOption.NUMBER[stageLevelLeft];
      this.context.drawImage(
        this.sprite.image,
        ...number.SPRITES,
        number.WIDTH,
        number.HEIGHT,
        stage.OFFSET_X,
        stage.OFFSET_Y + RenderOption.TILE_SIZE * 2 * RenderOption.MULTIPLEXER,
        number.WIDTH * RenderOption.MULTIPLEXER,
        number.HEIGHT * RenderOption.MULTIPLEXER,
      );
    }
    const number = SidePanelOption.NUMBER[stageLevelRight];
    this.context.drawImage(
      this.sprite.image,
      ...number.SPRITES,
      number.WIDTH,
      number.HEIGHT,
      stage.OFFSET_X + RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      stage.OFFSET_Y + RenderOption.TILE_SIZE * 2 * RenderOption.MULTIPLEXER,
      number.WIDTH * RenderOption.MULTIPLEXER,
      number.HEIGHT * RenderOption.MULTIPLEXER,
    );
  }
}
