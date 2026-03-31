import { EventEmitter } from '../event-emitter.js';
import { SoundSystem } from '../sound-system.js';
import { event } from '../../config/events.js';
import { SoundName } from '../../config/sounds.js';
import type { AudioManager } from '../audio-manager.js';

function createMockAudio(): AudioManager {
  return {
    playSound: vi.fn(),
    playLoop: vi.fn(),
    stopLoop: vi.fn(),
    stopAll: vi.fn(),
  } as unknown as AudioManager;
}

describe('SoundSystem', () => {
  let events: EventEmitter;
  let audio: AudioManager;
  let system: SoundSystem;

  beforeEach(() => {
    events = new EventEmitter();
    audio = createMockAudio();
    system = new SoundSystem(audio, events);
  });

  afterEach(() => {
    system.destroy();
  });

  it('plays PLAYER_SHOT sound on event', () => {
    events.emit(event.sound.PLAYER_SHOT);
    expect(audio.playSound).toHaveBeenCalledWith(SoundName.PLAYER_SHOT);
  });

  it('plays TANK_EXPLODE sound on event', () => {
    events.emit(event.sound.TANK_EXPLODE);
    expect(audio.playSound).toHaveBeenCalledWith(SoundName.TANK_EXPLODE);
  });

  it('plays BASE_EXPLODE sound on event', () => {
    events.emit(event.sound.BASE_EXPLODE);
    expect(audio.playSound).toHaveBeenCalledWith(SoundName.BASE_EXPLODE);
  });

  it('plays BRICK_HIT sound on event', () => {
    events.emit(event.sound.BRICK_HIT);
    expect(audio.playSound).toHaveBeenCalledWith(SoundName.BRICK_HIT);
  });

  it('plays WALL_HIT sound on event', () => {
    events.emit(event.sound.WALL_HIT);
    expect(audio.playSound).toHaveBeenCalledWith(SoundName.WALL_HIT);
  });

  it('plays GAME_OVER sound on event', () => {
    events.emit(event.sound.GAME_OVER);
    expect(audio.playSound).toHaveBeenCalledWith(SoundName.GAME_OVER);
  });

  it('plays PAUSE sound on event', () => {
    events.emit(event.sound.PAUSE);
    expect(audio.playSound).toHaveBeenCalledWith(SoundName.PAUSE);
  });

  it('plays INTRO sound on event', () => {
    events.emit(event.sound.INTRO);
    expect(audio.playSound).toHaveBeenCalledWith(SoundName.INTRO);
  });

  it('plays SCORE_TICK sound on event', () => {
    events.emit(event.sound.SCORE_TICK);
    expect(audio.playSound).toHaveBeenCalledWith(SoundName.SCORE_TICK);
  });

  it('starts ENGINE_IDLE loop on PLAYER_SPAWN', () => {
    events.emit(event.sound.PLAYER_SPAWN);
    expect(audio.playLoop).toHaveBeenCalledWith(SoundName.ENGINE_IDLE);
  });

  it('stops engine loops on PLAYER_DEATH', () => {
    events.emit(event.sound.PLAYER_DEATH);
    expect(audio.stopLoop).toHaveBeenCalledWith(SoundName.ENGINE_MOVE);
    expect(audio.stopLoop).toHaveBeenCalledWith(SoundName.ENGINE_IDLE);
  });

  it('switches to ENGINE_MOVE loop on MOVE_START', () => {
    events.emit(event.sound.MOVE_START);
    expect(audio.stopLoop).toHaveBeenCalledWith(SoundName.ENGINE_IDLE);
    expect(audio.playLoop).toHaveBeenCalledWith(SoundName.ENGINE_MOVE);
  });

  it('switches to ENGINE_IDLE loop on MOVE_STOP', () => {
    events.emit(event.sound.MOVE_STOP);
    expect(audio.stopLoop).toHaveBeenCalledWith(SoundName.ENGINE_MOVE);
    expect(audio.playLoop).toHaveBeenCalledWith(SoundName.ENGINE_IDLE);
  });

  it('calls stopAll on STOP_ALL event', () => {
    events.emit(event.sound.STOP_ALL);
    expect(audio.stopAll).toHaveBeenCalledOnce();
  });

  it('unsubscribes all listeners on destroy()', () => {
    system.destroy();

    events.emit(event.sound.PLAYER_SHOT);
    events.emit(event.sound.TANK_EXPLODE);
    events.emit(event.sound.STOP_ALL);

    expect(audio.playSound).not.toHaveBeenCalled();
    expect(audio.stopAll).not.toHaveBeenCalled();
  });

  it('is safe to call destroy() twice', () => {
    system.destroy();
    expect(() => system.destroy()).not.toThrow();
  });
});
