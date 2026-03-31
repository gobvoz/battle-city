import { event } from '../config/events.js';
import {
  PointPerEnemyType,
  EnemyTankToOption,
  Direction,
  RenderOption,
} from '../config/constants.js';
import type { IGameContext } from '../core/game-context.type.js';
import type { InputAction } from '../config/events.type.js';
import type { EnemyTypeValue } from '../config/constants.type.js';
import type { Scores } from '../core/stats-manager.js';

type DisplayedCount = [number, number];

export class ResultsState {
  private game: IGameContext;
  private enemyType: number;
  private interval: number;
  private elapsed: number;
  private finished: boolean;
  private scores: Scores;
  private displayedCounts: DisplayedCount[];
  private _offEnter: (() => void) | null = null;

  constructor(game: IGameContext) {
    this.game = game;

    this.enemyType = 1;
    this.interval = 0.3;
    this.elapsed = 0;
    this.finished = false;

    this.scores = this.game.stats.scores;
    this.displayedCounts = [];

    this.changeState = this.changeState.bind(this);
  }

  start(): void {
    __DEBUG__ && console.log('Entering Results State');
  }

  update(deltaTime: number): void {
    if (this.finished) return;

    this.elapsed += deltaTime;
    if (this.elapsed < this.interval) return;

    this.elapsed = 0;

    if (this.enemyType > 4) {
      this._offEnter = this.game.events.once(event.key.ENTER, this.changeState);
      this.finished = true;
      return;
    }

    const currentScores = this.scores[this.enemyType];

    if (!this.displayedCounts[this.enemyType]) {
      this.displayedCounts[this.enemyType] = [0, 0];
      return;
    }

    let ticked = false;

    if (this.displayedCounts[this.enemyType][0] < currentScores[0]) {
      this.displayedCounts[this.enemyType][0]++;
      ticked = true;
    }

    if (this.displayedCounts[this.enemyType][1] < currentScores[1]) {
      this.displayedCounts[this.enemyType][1]++;
      ticked = true;
    }

    if (ticked) this.game.events.emit(event.sound.SCORE_TICK);

    if (
      this.displayedCounts[this.enemyType][0] === currentScores[0] &&
      this.displayedCounts[this.enemyType][1] === currentScores[1]
    ) {
      this.enemyType++;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(230, 50, 0, 1)';
    ctx.fillText('HI-SCORE', ctx.canvas.width / 2 - 50, 20);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText(`STAGE ${this.game.currentLevel}`, ctx.canvas.width / 2, 60);

    this._drawResultTable(ctx);

    if (this.finished) {
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('PRESS ENTER TO NEXT LEVEL', ctx.canvas.width / 2, ctx.canvas.height / 2 + 110);
    }
  }

  private _drawResultTable(ctx: CanvasRenderingContext2D): void {
    const startY = 100;
    const lineHeight = (RenderOption.UNIT_SIZE + 4) * RenderOption.MULTIPLEXER;

    ctx.fillStyle = 'rgba(230, 50, 0, 1)';
    ctx.textAlign = 'right';
    ctx.fillText('I-PLAYER', ctx.canvas.width / 2 - 100, startY);

    ctx.fillStyle = 'white';
    ctx.fillText('PTS', ctx.canvas.width / 2 - 100, startY + lineHeight * 2);
    ctx.fillText('PTS', ctx.canvas.width / 2 - 100, startY + lineHeight * 3);
    ctx.fillText('PTS', ctx.canvas.width / 2 - 100, startY + lineHeight * 4);
    ctx.fillText('PTS', ctx.canvas.width / 2 - 100, startY + lineHeight * 5);

    ctx.fillStyle = 'rgba(230, 50, 0, 1)';
    ctx.textAlign = 'left';
    ctx.fillText('II-PLAYER', ctx.canvas.width / 2 + 100, startY);

    ctx.fillStyle = 'white';
    ctx.fillText('PTS', ctx.canvas.width / 2 + 100, startY + lineHeight * 2);
    ctx.fillText('PTS', ctx.canvas.width / 2 + 100, startY + lineHeight * 3);
    ctx.fillText('PTS', ctx.canvas.width / 2 + 100, startY + lineHeight * 4);
    ctx.fillText('PTS', ctx.canvas.width / 2 + 100, startY + lineHeight * 5);

    for (let i = 1; i <= 4; i++) {
      const tankOptions = EnemyTankToOption[i as EnemyTypeValue];
      const sprite = tankOptions.SPRITES[Direction.UP][0];

      ctx.drawImage(
        this.game.sprite.image,
        sprite[0] * RenderOption.UNIT_SIZE,
        sprite[1] * RenderOption.UNIT_SIZE,
        RenderOption.UNIT_SIZE,
        RenderOption.UNIT_SIZE,
        ctx.canvas.width / 2 - (RenderOption.UNIT_SIZE * RenderOption.MULTIPLEXER) / 2,
        startY + lineHeight * i + lineHeight / 2,
        RenderOption.UNIT_SIZE * RenderOption.MULTIPLEXER,
        RenderOption.UNIT_SIZE * RenderOption.MULTIPLEXER
      );
    }

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('⇽     ⇾', ctx.canvas.width / 2, startY + lineHeight * 2);
    ctx.fillText('⇽     ⇾', ctx.canvas.width / 2, startY + lineHeight * 3);
    ctx.fillText('⇽     ⇾', ctx.canvas.width / 2, startY + lineHeight * 4);
    ctx.fillText('⇽     ⇾', ctx.canvas.width / 2, startY + lineHeight * 5);

    const levelScores: [number, number] = [0, 0];
    const levelCounts: [number, number] = [0, 0];

    this.displayedCounts.forEach((count, enemyType) => {
      ctx.fillStyle = 'white';
      ctx.textAlign = 'right';
      ctx.fillText(
        String(count[0]),
        ctx.canvas.width / 2 - 55,
        (enemyType + 1) * lineHeight + startY
      );
      ctx.fillText(
        String(count[0] * PointPerEnemyType[enemyType as EnemyTypeValue]),
        ctx.canvas.width / 2 - 160,
        (enemyType + 1) * lineHeight + startY
      );

      ctx.textAlign = 'left';
      ctx.fillText(
        String(count[1]),
        ctx.canvas.width / 2 + 55,
        (enemyType + 1) * lineHeight + startY
      );
      ctx.fillText(
        String(count[1] * PointPerEnemyType[enemyType as EnemyTypeValue]),
        ctx.canvas.width / 2 + 160,
        (enemyType + 1) * lineHeight + startY
      );

      levelScores[0] += count[0] * PointPerEnemyType[enemyType as EnemyTypeValue];
      levelScores[1] += count[1] * PointPerEnemyType[enemyType as EnemyTypeValue];

      levelCounts[0] += count[0];
      levelCounts[1] += count[1];
    });

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, startY + 6 * lineHeight - 30);
    ctx.lineTo(ctx.canvas.width - 100, startY + 6 * lineHeight - 30);
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.textAlign = 'right';
    ctx.fillText(`${levelScores[0]}`, ctx.canvas.width / 2 - 150, startY + 6 * lineHeight);
    ctx.textAlign = 'left';
    ctx.fillText(`${levelScores[1]}`, ctx.canvas.width / 2 + 150, startY + 6 * lineHeight);

    ctx.textAlign = 'right';
    ctx.fillText(`${levelCounts[0]}`, ctx.canvas.width / 2 - 60, startY + 6 * lineHeight);
    ctx.textAlign = 'left';
    ctx.fillText(`${levelCounts[1]}`, ctx.canvas.width / 2 + 60, startY + 6 * lineHeight);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(248, 154, 47, 1)';
    ctx.fillText(
      `${this.scores.total[0] + levelScores[0]}`,
      ctx.canvas.width / 2 - 100,
      startY + lineHeight
    );
    ctx.textAlign = 'left';
    ctx.fillText(
      `${this.scores.total[1] + levelScores[1]}`,
      ctx.canvas.width / 2 + 100,
      startY + lineHeight
    );

    const hiScore = Math.max(
      this.scores.hiScore,
      this.scores.total[0] + levelScores[0],
      this.scores.total[1] + levelScores[1]
    );
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(248, 154, 47, 1)';
    ctx.fillText(`${hiScore}`, ctx.canvas.width / 2 + 50, 20);
  }

  changeState(key: InputAction): void {
    if (key !== event.inputAction.PRESSED) return;
    this.game.events.emit(event.CHANGE_STATE, event.state.NEXT_LEVEL);
  }

  exit(): void {
    this._offEnter?.();
    this._offEnter = null;
    this.game.events.emit(event.sound.STOP_ALL);
    __DEBUG__ && console.log('Exiting Results State');
  }
}
