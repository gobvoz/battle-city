import { event } from '../config/events.js';
import { SoundName } from '../config/sounds.js';
import type { AudioManager } from './audio-manager.js';
import type { EventEmitter } from './event-emitter.js';

export class SoundSystem {
  private readonly audio: AudioManager;
  private readonly offs: (() => void)[] = [];

  constructor(audio: AudioManager, events: EventEmitter) {
    this.audio = audio;

    this.offs = [
      events.on(event.sound.PLAYER_SHOT, () => this.audio.playSound(SoundName.PLAYER_SHOT)),
      events.on(event.sound.TANK_EXPLODE, () => this.audio.playSound(SoundName.TANK_EXPLODE)),
      events.on(event.sound.BASE_EXPLODE, () => this.audio.playSound(SoundName.BASE_EXPLODE)),
      events.on(event.sound.BRICK_HIT, () => this.audio.playSound(SoundName.BRICK_HIT)),
      events.on(event.sound.WALL_HIT, () => this.audio.playSound(SoundName.WALL_HIT)),
      events.on(event.sound.GAME_OVER, () => this.audio.playSound(SoundName.GAME_OVER)),
      events.on(event.sound.PAUSE, () => this.audio.playSound(SoundName.PAUSE)),
      events.on(event.sound.INTRO, () => this.audio.playSound(SoundName.INTRO)),
      events.on(event.sound.SCORE_TICK, () => this.audio.playSound(SoundName.SCORE_TICK)),
      events.on(event.sound.PLAYER_SPAWN, () => this.audio.playLoop(SoundName.ENGINE_IDLE)),
      events.on(event.sound.PLAYER_DEATH, () => {
        this.audio.stopLoop(SoundName.ENGINE_MOVE);
        this.audio.stopLoop(SoundName.ENGINE_IDLE);
      }),
      events.on(event.sound.MOVE_START, () => {
        this.audio.stopLoop(SoundName.ENGINE_IDLE);
        this.audio.playLoop(SoundName.ENGINE_MOVE);
      }),
      events.on(event.sound.MOVE_STOP, () => {
        this.audio.stopLoop(SoundName.ENGINE_MOVE);
        this.audio.playLoop(SoundName.ENGINE_IDLE);
      }),
      events.on(event.sound.STOP_ALL, () => this.audio.stopAll()),
    ];
  }

  destroy(): void {
    this.offs.forEach(off => off());
    this.offs.length = 0;
  }
}
