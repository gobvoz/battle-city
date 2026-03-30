import { event } from '../config/events.js';
import type { IGameContext } from '../core/game-context.type.js';
import type { InputAction } from '../config/events.type.js';

export class PauseState {
  private game: IGameContext;
  private active: boolean;
  private timer: number;
  private textVisible: boolean;
  private _offEscape: (() => void) | null = null;

  constructor(game: IGameContext) {
    this.game = game;
    this.active = false;
    this.timer = 0;
    this.textVisible = true;

    this.toggle = this.toggle.bind(this);
  }

  start(): void {
    __DEBUG__ && console.log('Entering Pause State');

    this.timer = 0;
    this.textVisible = true;

    this._offEscape = this.game.events.on(event.key.ESCAPE, this.toggle);
  }

  update(deltaTime: number): void {
    if (!this.active) return;

    this.timer += deltaTime;

    if (this.timer >= 0.5) {
      this.textVisible = !this.textVisible;
      this.timer = 0;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (this.textVisible) {
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSE', ctx.canvas.width / 2, ctx.canvas.height / 2);
    }

    ctx.restore();
  }

  toggle(key: InputAction): void {
    if (key !== event.inputAction.PRESSED) return;
    this.active = !this.active;
    this.timer = 0;

    __DEBUG__ && console.log(this.active ? 'Game paused' : 'Game resumed');

    this.active
      ? this.game.events.emit(event.TOGGLE_PAUSE, event.pauseAction.ON)
      : this.game.events.emit(event.TOGGLE_PAUSE, event.pauseAction.OFF);
  }

  exit(): void {
    __DEBUG__ && console.log('Exiting Pause State');
    this._offEscape?.();
    this._offEscape = null;
  }
}
