import { PauseState } from './pause.state.js';
import { World } from '../world/world.js';
import { Renderer } from '../world/renderer.js';
import { event } from '../config/events.js';
import type { IGameContext } from '../core/game-context.type.js';

export class PlayState {
  private game: IGameContext;
  private paused: boolean;
  private pause: PauseState;
  private world: World;
  private renderer: Renderer;
  private _offTogglePause: (() => void) | null = null;

  constructor(game: IGameContext) {
    this.game = game;
    this.paused = false;

    this.pause = new PauseState(this.game);
    this.world = new World(this.game);
    this.renderer = new Renderer(this.game, this.world);

    this.exit = this.exit.bind(this);
    this.togglePause = this.togglePause.bind(this);
  }

  start(): void {
    __DEBUG__ && console.log('Entering Play State');

    this.world.start();
    this.renderer.start();
    this.pause.start();

    this._offTogglePause = this.game.events.on(event.TOGGLE_PAUSE, this.togglePause);
  }

  update(deltaTime: number): void {
    if (this.paused) {
      this.pause.update(deltaTime);
      return;
    }

    this.world.update(deltaTime);
    this.renderer.update(deltaTime);
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.renderer.render(ctx);
    this.pause.render(ctx);
  }

  exit(): void {
    __DEBUG__ && console.log('Exiting Play State');

    this._offTogglePause?.();
    this._offTogglePause = null;

    this.pause.exit();
    this.world.exit();

    this.game.events.emit(event.CHANGE_STATE, event.state.GAME_OVER);
  }

  private togglePause(): void {
    this.paused = !this.paused;

    __DEBUG__ && console.log(this.paused ? 'Paused gameplay' : 'Resumed gameplay');
  }
}
