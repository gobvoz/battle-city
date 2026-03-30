import { IntroState } from './intro.state.js';
import { PauseState } from './pause.state.js';
import { World } from '../world/world.js';
import { Renderer } from '../world/renderer.js';
import { event } from '../config/events.js';
import type { IGameContext } from '../core/game-context.type.js';

export class PlayState {
  private game: IGameContext;
  private paused: boolean;
  private subState: IntroState | null;
  private pause: PauseState;
  private world: World;
  private renderer: Renderer;
  private _offCompleteIntro: (() => void) | null = null;
  private _offTogglePause: (() => void) | null = null;

  constructor(game: IGameContext) {
    this.game = game;
    this.paused = false;

    this.subState = new IntroState(this.game);
    this.pause = new PauseState(this.game);
    this.world = new World(this.game);
    this.renderer = new Renderer(this.game, this.world);

    this.completeIntro = this.completeIntro.bind(this);
    this.exit = this.exit.bind(this);
    this.togglePause = this.togglePause.bind(this);
  }

  start(): void {
    __DEBUG__ && console.log('Entering Play State');

    this.subState?.start();
    this.world.start();
    this.renderer.start();

    this._offCompleteIntro = this.game.events.on(event.COMPLETE_INTRO, this.completeIntro);
    this._offTogglePause = this.game.events.on(event.TOGGLE_PAUSE, this.togglePause);
  }

  update(deltaTime: number): void {
    if (this.subState) this.subState.update(deltaTime);

    if (this.paused) {
      this.pause.update(deltaTime);
      return;
    }

    this.world.update(deltaTime);
    this.renderer.update(deltaTime);
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.renderer.render(ctx);

    if (this.subState) this.subState.render(ctx);
    this.pause.render(ctx);
  }

  exit(): void {
    __DEBUG__ && console.log('Exiting Play State');

    this._offCompleteIntro?.();
    this._offCompleteIntro = null;
    this._offTogglePause?.();
    this._offTogglePause = null;

    if (this.subState) this.subState.exit();
    this.pause.exit();
    this.world.exit();

    this.game.events.emit(event.CHANGE_STATE, event.state.GAME_OVER);
  }

  private completeIntro(): void {
    __DEBUG__ && console.log('Intro complete, starting gameplay');

    this._offCompleteIntro = null;
    this.subState = null;

    this.pause.start();
  }

  private togglePause(): void {
    this.paused = !this.paused;

    __DEBUG__ && console.log(this.paused ? 'Paused gameplay' : 'Resumed gameplay');
  }
}
