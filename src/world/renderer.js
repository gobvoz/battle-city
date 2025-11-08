import { SidePanelOption } from '../config/constants.js';
import { RenderOption } from '../config/render.js';

export class Renderer {
  constructor(game, world) {
    this.game = game;
    this.world = world;

    this.blinkedFrame = false;
    this.blinkCounter = 0;
  }

  update(deltaTime) {
    this.blinkCounter += deltaTime;

    if (this.blinkCounter >= 0.5) {
      this.blinkedFrame = !this.blinkedFrame;
      this.blinkCounter = 0;
    }
  }

  start() {}

  render(ctx) {
    this._drawField(ctx);

    __DEBUG__ && this._renderGrid(ctx);

    const postRender = this._renderField(ctx);

    this.world.objects.forEach(gameObject => {
      this._renderObject(ctx, gameObject);
      __DEBUG__ && this._renderObjectBorder(ctx, gameObject);
    });

    postRender.forEach(tile => {
      this._renderTile(ctx, tile);
    });

    this._renderSidePanel(ctx);

    __DEBUG__ && this._renderCollisionTile(ctx);
    __DEBUG__ && this._renderDebugInfo(ctx, this.world);
  }

  _drawField(ctx) {
    ctx.fillStyle = '#666';
    ctx.fillRect(0, 0, 256 * RenderOption.MULTIPLEXER, 224 * RenderOption.MULTIPLEXER);

    ctx.fillStyle = '#000';
    ctx.fillRect(
      RenderOption.PADDING_LEFT,
      RenderOption.PADDING_TOP,
      this.world.stage.length * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      this.world.stage[0].length * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
    );
  }

  _renderGrid(ctx) {
    for (let mapUnit = 0; mapUnit <= this.world.stage.length; mapUnit++) {
      ctx.strokeStyle = '#555';
      if (mapUnit % 2 === 0) {
        ctx.strokeStyle = '#888';
      }
      ctx.beginPath();
      ctx.moveTo(
        RenderOption.PADDING_LEFT + mapUnit * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.PADDING_TOP,
      );
      ctx.lineTo(
        RenderOption.PADDING_LEFT + mapUnit * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.PADDING_TOP +
          this.world.stage.length * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(
        RenderOption.PADDING_LEFT,
        RenderOption.PADDING_TOP + mapUnit * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      );
      ctx.lineTo(
        RenderOption.PADDING_LEFT +
          this.world.stage.length * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.PADDING_TOP + mapUnit * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      );
      ctx.stroke();
    }
  }

  _renderCollisionTile(ctx) {
    if (this.world.collisionTiles.length === 0) return;

    ctx.fillStyle = this.blinkedFrame ? 'rgba(0, 255, 0, 0.5)' : 'transparent';
    this.world.collisionTiles.forEach(tile => {
      ctx.beginPath();
      ctx.rect(
        RenderOption.PADDING_LEFT + tile[0] * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.PADDING_TOP + tile[1] * RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      );
      ctx.fill();
    });
  }

  _renderDebugInfo(ctx) {
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';

    // ctx.fillText(
    //   `${this.world.player1Tank.x},${this.world.player1Tank.y}`,
    //   RenderOption.PADDING_LEFT + this.world.player1Tank.x * RenderOption.MULTIPLEXER,
    //   RenderOption.PADDING_TOP + this.world.player1Tank.y * RenderOption.MULTIPLEXER,
    // );

    ctx.fillText(`fps:  ${this.game.fps}`, 10, 224 * RenderOption.MULTIPLEXER + 10);
    ctx.fillText(`busy: ${this.game.busyTime}`, 10, 224 * RenderOption.MULTIPLEXER + 20);
    ctx.fillText(`tanks: ${this.world.enemyArray.length}`, 10, 224 * RenderOption.MULTIPLEXER + 30);

    this.world.enemyTanks.forEach((tank, index) => {
      ctx.fillText(
        `tank ${index}: ${String(tank.x).padStart(3, ' ').slice(0, 3)} ${String(tank.y)
          .padStart(3, ' ')
          .slice(0, 3)}`,
        10,
        224 * RenderOption.MULTIPLEXER + 40 + index * 10,
      );
    });
    ctx.font = `${RenderOption.FONT_SIZE}px font-7x7`;
  }

  _renderTile(ctx, tile) {
    ctx.drawImage(
      this.game.sprite.image,
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

  _renderField(ctx) {
    const stage = this.world.stage;
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

        this._renderTile(ctx, tile);
      }
    }

    return postRender;
  }

  _renderObject(ctx, gameObject) {
    // 272 96 16 16 505 20 40 40
    ctx.drawImage(
      this.game.sprite.image,
      ...gameObject.sprite,
      gameObject.width,
      gameObject.height,
      RenderOption.PADDING_LEFT + gameObject.x * RenderOption.MULTIPLEXER,
      RenderOption.PADDING_TOP + gameObject.y * RenderOption.MULTIPLEXER,
      gameObject.width * RenderOption.MULTIPLEXER,
      gameObject.width * RenderOption.MULTIPLEXER,
    );
  }

  _renderObjectBorder(ctx, gameObject) {
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.rect(
      RenderOption.PADDING_LEFT + gameObject.x * RenderOption.MULTIPLEXER,
      RenderOption.PADDING_TOP + gameObject.y * RenderOption.MULTIPLEXER,
      gameObject.width * RenderOption.MULTIPLEXER,
      gameObject.width * RenderOption.MULTIPLEXER,
    );
    ctx.stroke();
  }

  _renderSidePanel(ctx) {
    let isNextRow = true;
    let offsetY = 0;

    for (let i = 0; i < this.world.enemyArray.length; i++) {
      ctx.drawImage(
        this.game.sprite.image,
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
    if (this.world.player1Tank) {
      const player1logo = SidePanelOption.PLAYER_1;
      ctx.drawImage(
        this.game.sprite.image,
        ...player1logo.SPRITES,
        player1logo.WIDTH,
        player1logo.HEIGHT,
        player1logo.OFFSET_X,
        player1logo.OFFSET_Y,
        player1logo.WIDTH * RenderOption.MULTIPLEXER,
        player1logo.HEIGHT * RenderOption.MULTIPLEXER,
      );
      const player1Lives = SidePanelOption.NUMBER[this.game.player1Lives];
      ctx.drawImage(
        this.game.sprite.image,
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
    if (this.world.player2Tank) {
      const player2logo = SidePanelOption.PLAYER_2;
      ctx.drawImage(
        this.sprite.image,
        ...player2logo.SPRITES,
        player2logo.WIDTH,
        player2logo.HEIGHT,
        player2logo.OFFSET_X,
        player2logo.OFFSET_Y,
        player2logo.WIDTH * RenderOption.MULTIPLEXER,
        player2logo.HEIGHT * RenderOption.MULTIPLEXER,
      );
      const player2Lives = SidePanelOption.NUMBER[this.world.player2Lives];
      ctx.drawImage(
        this.game.sprite.image,
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
    ctx.drawImage(
      this.game.sprite.image,
      ...stage.SPRITES,
      stage.WIDTH,
      stage.HEIGHT,
      stage.OFFSET_X,
      stage.OFFSET_Y,
      stage.WIDTH * RenderOption.MULTIPLEXER,
      stage.HEIGHT * RenderOption.MULTIPLEXER,
    );
    const stageLevelRight = this.game.currentLevel % 10;
    const stageLevelLeft = (this.game.currentLevel - stageLevelRight) / 10;
    if (stageLevelLeft) {
      const number = SidePanelOption.NUMBER[stageLevelLeft];
      ctx.drawImage(
        this.game.sprite.image,
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
    ctx.drawImage(
      this.game.sprite.image,
      ...number.SPRITES,
      number.WIDTH,
      number.HEIGHT,
      stage.OFFSET_X + RenderOption.TILE_SIZE * RenderOption.MULTIPLEXER,
      stage.OFFSET_Y + RenderOption.TILE_SIZE * 2 * RenderOption.MULTIPLEXER,
      number.WIDTH * RenderOption.MULTIPLEXER,
      number.HEIGHT * RenderOption.MULTIPLEXER,
    );
  }

  exit() {}
}
