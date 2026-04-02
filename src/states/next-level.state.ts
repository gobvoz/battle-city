import { event } from '../config/events.js';
import { loadStage } from '../core/stage-loader.js';
import type { IGameContext } from '../core/game-context.type.js';

export class NextLevelState {
  private game: IGameContext;
  private timer: number;
  private duration: number;
  private transitionTime: number;
  private stageLoaded: boolean;
  private animationDone: boolean;

  constructor(game: IGameContext) {
    this.game = game;

    this.timer = 0;
    this.duration = 3;
    this.transitionTime = 0.5;
    this.stageLoaded = false;
    this.animationDone = false;
  }

  start(): void {
    __DEBUG__ && console.log('Entering Next Level State');

    this.game.currentLevel++;
    this.game.stats.nextLevel();

    this.game.events.emit(event.sound.INTRO);

    loadStage(this.game.currentLevel).then(stage => {
      this.game.currentStage = stage;
      this.stageLoaded = true;

      __DEBUG__ && console.log(`Stage ${this.game.currentLevel} loaded`);

      if (this.animationDone) {
        this.game.events.emit(event.CHANGE_STATE, event.state.PLAY);
      }
    });
  }

  update(deltaTime: number): void {
    this.timer += deltaTime;

    if (this.timer >= this.duration && !this.animationDone) {
      this.animationDone = true;

      if (this.stageLoaded) {
        this.game.events.emit(event.CHANGE_STATE, event.state.PLAY);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = ctx.canvas;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    const t = Math.min(this.timer / this.duration, 1);

    let shutterHeight: number;
    const maxHeight = height / 2;

    if (t < this.transitionTime / this.duration) {
      const progress = t / (this.transitionTime / this.duration);
      shutterHeight = progress * maxHeight;
    } else if (t > 1 - this.transitionTime / this.duration) {
      const progress = (1 - t) / (this.transitionTime / this.duration);
      shutterHeight = progress * maxHeight;
    } else {
      shutterHeight = maxHeight;
    }

    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, width, shutterHeight);
    ctx.fillRect(0, height - shutterHeight, width, shutterHeight);

    if (t > this.transitionTime / this.duration && t < 1 - this.transitionTime / this.duration) {
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`STAGE ${this.game.currentLevel}`, width / 2, height / 2);
    }
  }

  exit(): void {
    __DEBUG__ && console.log('Exiting Next Level State');
  }
}
