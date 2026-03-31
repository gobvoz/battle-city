import { event } from '../config/events.js';
import type { IGameContext } from '../core/game-context.type.js';

export class IntroState {
  private game: IGameContext;
  private timer: number;
  private duration: number;
  private transitionTime: number;

  constructor(game: IGameContext) {
    this.game = game;

    this.timer = 0;
    this.duration = 3;
    this.transitionTime = 0.5;
  }

  start(): void {
    __DEBUG__ && console.log('Entering Intro State');
    this.timer = 0;
    this.game.events.emit(event.sound.INTRO);
  }

  update(deltaTime: number): void {
    this.timer += deltaTime;

    if (this.timer >= this.duration) {
      this.exit();
      this.game.events.emit(event.COMPLETE_INTRO);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = ctx.canvas;

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
    __DEBUG__ && console.log('Exiting Intro State');
  }
}
