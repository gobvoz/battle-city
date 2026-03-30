import { EventEmitter } from './event-emitter.js';
import { Input } from './input-handler.js';
import { Sprite } from './sprite.js';
import { StatsManager } from './stats-manager.js';
import type { IGameContext } from './game-context.type.js';

export class GameContainer implements IGameContext {
  readonly events: EventEmitter;
  readonly input: Input;
  readonly sprite: Sprite;
  readonly stats: StatsManager;

  currentLevel = 1;
  player1Lives = 2;
  player2Lives = 2;
  fps = 0;
  busyTime: number | string = 0;

  constructor() {
    this.events = new EventEmitter();
    this.sprite = new Sprite('/sprites/sprite.png');
    this.stats = new StatsManager();
    this.input = new Input(this);
  }
}
