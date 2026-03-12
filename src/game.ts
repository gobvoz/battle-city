import { EventEmitter } from './core/event-emitter.js';
import { Input } from './core/input-handler.js';
import { AudioManager } from './core/audio-manager.js';
import { Sprite } from './core/sprite.js';
import { StatsManager } from './core/stats-manager.js';

import { keyCode } from './config/key-codes.js';
import { event } from './config/events.js';

import { MenuState } from './states/menu.state.js';
import { PlayState } from './states/play.state.js';
import { GameOverState } from './states/game-over.state.js';
import { ResultsState } from './states/results.state.js';
import { NextLevelState } from './states/next-level.state.js';
import { RestartGameState } from './states/restart-game.state.js';

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
  fps = 0;
  fpsCounter = 0;
  busyTime: number | string = 0;
  busyTimeCounter = 0;

  private ctx: CanvasRenderingContext2D;

  currentLevel: number;
  player1Lives: number;
  player2Lives: number;

  context: IGameContext;
  events: EventEmitter;
  audio: AudioManager;
  sprite: Sprite;
  stats: StatsManager;
  input: Input;
  state: GameState;

  private lastTime: number;
  private running: boolean;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;

    this.currentLevel = 1;
    this.player1Lives = 2;
    this.player2Lives = 2;

    const context = {} as IGameContext;
    Object.defineProperties(context, {
      events: { get: () => this.events },
      input: { get: () => this.input },
      sprite: { get: () => this.sprite },
      stats: { get: () => this.stats },
      currentLevel: {
        get: () => this.currentLevel,
        set: (level: number) => (this.currentLevel = level),
      },
      player1Lives: {
        get: () => this.player1Lives,
        set: (lives: number) => (this.player1Lives = lives),
      },
      player2Lives: {
        get: () => this.player2Lives,
        set: (lives: number) => (this.player2Lives = lives),
      },
      fps: { get: () => this.fps },
      busyTime: { get: () => this.busyTime },
    });
    this.context = context;

    this.events = new EventEmitter(this.context);
    this.audio = new AudioManager();
    this.sprite = new Sprite('/sprites/sprite.png');
    this.stats = new StatsManager();

    this.input = new Input(this.context);
    this.state = new MenuState(this.context);

    this.lastTime = 0;
    this.running = false;

    this.loop = this.loop.bind(this);
    this.changeState = this.changeState.bind(this);

    if (__DEBUG__) {
      this.toggleDebug = this.toggleDebug.bind(this);
    }
  }

  async start(): Promise<void> {
    __DEBUG__ && this.events.on(event.key.D, this.toggleDebug.bind(this));

    this.events.on(event.CHANGE_STATE, this.changeState);

    this.lastTime = performance.now();
    this.running = true;

    await this.sprite.load();
    this.state.start();

    requestAnimationFrame(this.loop);

    setInterval(() => {
      this.fps = this.fpsCounter * 2;
      this.fpsCounter = 0;

      this.busyTime = String(this.busyTimeCounter / this.fps)
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
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.state.render(this.ctx);
  }

  changeState(newStateName: string): void {
    this.events.off(event.CHANGE_STATE, this.changeState);
    this.state.exit();

    switch (newStateName) {
      case event.state.MENU:
        this.state = new MenuState(this.context);
        break;
      case event.state.PLAY:
        this.state = new PlayState(this.context);
        break;
      case event.state.GAME_OVER:
        this.state = new GameOverState(this.context);
        break;
      case event.state.RESULTS:
        this.state = new ResultsState(this.context);
        break;
      case event.state.NEXT_LEVEL:
        this.state = new NextLevelState(this.context);
        break;
      case event.state.RESTART:
        this.state = new RestartGameState(this.context);
        break;
      default:
        console.warn(`Unknown state: ${newStateName}`);
    }

    this.events.on(event.CHANGE_STATE, this.changeState);
    this.state.start();
  }

  toggleDebug(key: string): void {
    if (key !== 'pressed') return;

    if (
      !this.input.isKeyPressed(keyCode.CONTROL_LEFT) &&
      !this.input.isKeyPressed(keyCode.CONTROL_RIGHT)
    )
      return;

    DebugManager?.toggle();
  }
}
