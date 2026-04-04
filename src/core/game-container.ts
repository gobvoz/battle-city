import { AudioManager } from './audio-manager.js';
import { EventEmitter } from './event-emitter.js';
import { Input } from './input-handler.js';
import { Sprite } from './sprite.js';
import { StatsManager } from './stats-manager.js';
import type { IGameContext, PlayerState, CampaignMode } from './game-context.type.js';
import type { StageConfig } from '../config/constants.type.js';

export class GameContainer implements IGameContext {
  readonly audio: AudioManager;
  readonly events: EventEmitter;
  readonly input: Input;
  readonly sprite: Sprite;
  readonly stats: StatsManager;

  currentLevel = 0;
  currentStage: StageConfig | null = null;
  playerCount: 1 | 2 = 1;
  campaignMode: CampaignMode = 'standard';
  customStageLevels: number[] = [];
  player1: PlayerState = { lives: 2, stars: 0 };
  player2: PlayerState = { lives: 2, stars: 0 };
  fps = 0;
  busyTime: number | string = 0;

  constructor() {
    this.audio = new AudioManager();
    this.events = new EventEmitter();
    this.sprite = new Sprite('/sprites/sprite.png');
    this.stats = new StatsManager();
    this.input = new Input(this);
  }
}
