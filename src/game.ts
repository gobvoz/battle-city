import { GameContainer } from './core/game-container.js';
import { SoundSystem } from './core/sound-system.js';
import { loadStage } from './core/stage-loader.js';

import { keyCode } from './config/key-codes.js';
import { event } from './config/events.js';
import { SoundPath } from './config/sounds.js';

import { MenuState } from './states/menu.state.js';
import { PlayState } from './states/play.state.js';
import { GameOverState } from './states/game-over.state.js';
import { ResultsState } from './states/results.state.js';
import { RestartGameState } from './states/restart-game.state.js';
import { LevelTransition } from './states/level-transition.js';

import type { IGameContext } from './core/game-context.type.js';
import type { DebugManager as DebugManagerType } from './core/debug-manager.js';

let DebugManager: typeof DebugManagerType | undefined;

if (__DEBUG__) {
  import('./core/debug-manager.js').then(module => {
    DebugManager = module.DebugManager;
  });
}

type GameState = {
  start(): void;
  update(deltaTime: number): void;
  render(ctx: CanvasRenderingContext2D): void;
  exit(): void;
};

export class Game {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly container: GameContainer;

  private state: GameState;
  private transition: LevelTransition | null = null;
  private lastTime = 0;
  private running = false;
  private fpsCounter = 0;
  private busyTimeCounter = 0;

  get context(): IGameContext {
    return this.container;
  }

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.container = new GameContainer();
    new SoundSystem(this.container.audio, this.container.events);
    this.state = new MenuState(this.container);

    this.loop = this.loop.bind(this);
    this.changeState = this.changeState.bind(this);

    if (__DEBUG__) {
      this.toggleDebug = this.toggleDebug.bind(this);
    }
  }

  async start(): Promise<void> {
    __DEBUG__ && this.container.events.on(event.key.D, this.toggleDebug);

    this.container.events.on(event.CHANGE_STATE, this.changeState);

    this.lastTime = performance.now();
    this.running = true;

    await Promise.all([
      this.container.sprite.load(),
      ...Object.entries(SoundPath).map(([name, path]) =>
        this.container.audio.loadSound(name, path).catch(() => {
          __DEBUG__ && console.warn(`Failed to load sound: ${name}`);
        })
      ),
    ]);

    this.state.start();

    requestAnimationFrame(this.loop);

    setInterval(() => {
      this.container.fps = this.fpsCounter * 2;
      this.fpsCounter = 0;

      this.container.busyTime = String(this.busyTimeCounter / this.container.fps)
        .padEnd(5, ' ')
        .slice(0, 5);
      this.busyTimeCounter = 0;
    }, 500);
  }

  loop(currentTime: number): void {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (__DEBUG__ && DebugManager?.handleDebugDelay()) {
      requestAnimationFrame(this.loop);
      return;
    }

    this.busyTimeCounter += deltaTime;

    this.update(deltaTime);
    this.render();

    this.fpsCounter++;

    if (this.running) requestAnimationFrame(this.loop);
  }

  update(deltaTime: number): void {
    this.state.update(deltaTime);
    this.transition?.update(deltaTime);
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.state.render(this.ctx);
    this.transition?.render(this.ctx);
  }

  changeState(newStateName: string): void {
    if (newStateName === event.state.NEXT_LEVEL) {
      this.startLevelTransition();
      return;
    }

    this.transition = null;

    this.container.events.off(event.CHANGE_STATE, this.changeState);
    this.state.exit();

    switch (newStateName) {
      case event.state.MENU:
        this.state = new MenuState(this.container);
        break;
      case event.state.PLAY:
        this.state = new PlayState(this.container);
        break;
      case event.state.GAME_OVER:
        this.state = new GameOverState(this.container);
        break;
      case event.state.RESULTS:
        this.state = new ResultsState(this.container);
        break;
      case event.state.RESTART:
        this.state = new RestartGameState(this.container);
        break;
      default:
        console.warn(`Unknown state: ${newStateName}`);
    }

    this.container.events.on(event.CHANGE_STATE, this.changeState);
    this.state.start();
  }

  private startLevelTransition(): void {
    this.container.currentLevel++;
    this.container.stats.nextLevel();
    this.container.events.emit(event.sound.INTRO);

    const transition = new LevelTransition(this.container.currentLevel);
    this.transition = transition;

    let stageLoaded = false;

    transition.onClosed = () => {
      if (stageLoaded) {
        this.switchToPlayState();
        transition.markStateReady();
      }
    };

    transition.onDone = () => {
      this.transition = null;
    };

    loadStage(this.container.currentLevel).then(stage => {
      this.container.currentStage = stage;
      stageLoaded = true;

      __DEBUG__ && console.log(`Stage ${this.container.currentLevel} loaded`);

      if (transition.isFullyClosed) {
        this.switchToPlayState();
        transition.markStateReady();
      }
    });
  }

  private switchToPlayState(): void {
    this.container.events.off(event.CHANGE_STATE, this.changeState);
    this.state.exit();
    this.state = new PlayState(this.container);
    this.container.events.on(event.CHANGE_STATE, this.changeState);
    this.state.start();
  }

  toggleDebug(key: string): void {
    if (key !== 'pressed') return;

    if (
      !this.container.input.isKeyPressed(keyCode.CONTROL_LEFT) &&
      !this.container.input.isKeyPressed(keyCode.CONTROL_RIGHT)
    )
      return;

    DebugManager?.toggle();
  }
}
