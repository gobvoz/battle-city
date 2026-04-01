import { AudioManager } from './audio-manager.js';
import { EventEmitter } from './event-emitter.js';
import { Input } from './input-handler.js';
import { Sprite } from './sprite.js';
import { StatsManager } from './stats-manager.js';

export interface IGameContext {
  audio: AudioManager;
  events: EventEmitter;
  input: Input;
  sprite: Sprite;
  stats: StatsManager;
  currentLevel: number;
  playerCount: 1 | 2;
  player1Lives: number;
  player2Lives: number;
  fps: number;
  busyTime: number | string;
}
