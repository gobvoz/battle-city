import { AudioManager } from './audio-manager.js';
import { EventEmitter } from './event-emitter.js';
import { Input } from './input-handler.js';
import { Sprite } from './sprite.js';
import { StatsManager } from './stats-manager.js';
import type { StageConfig } from '../config/constants.type.js';

export interface PlayerState {
  lives: number;
  stars: number;
}

export type CampaignMode = 'standard' | 'custom';

export interface IGameContext {
  audio: AudioManager;
  events: EventEmitter;
  input: Input;
  sprite: Sprite;
  stats: StatsManager;
  currentLevel: number;
  currentStage: StageConfig | null;
  playerCount: 1 | 2;
  campaignMode: CampaignMode;
  customStageLevels: number[];
  player1: PlayerState;
  player2: PlayerState;
  fps: number;
  busyTime: number | string;
}
