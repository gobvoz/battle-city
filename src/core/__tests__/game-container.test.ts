import { GameContainer } from '../game-container.js';
import { EventEmitter } from '../event-emitter.js';
import { StatsManager } from '../stats-manager.js';

describe('GameContainer', () => {
  let container: GameContainer;

  beforeEach(() => {
    container = new GameContainer();
  });

  it('creates without throwing', () => {
    expect(() => new GameContainer()).not.toThrow();
  });

  it('has correct default mutable state', () => {
    expect(container.currentLevel).toBe(1);
    expect(container.player1Lives).toBe(2);
    expect(container.player2Lives).toBe(2);
    expect(container.fps).toBe(0);
    expect(container.busyTime).toBe(0);
  });

  it('exposes an EventEmitter instance', () => {
    expect(container.events).toBeInstanceOf(EventEmitter);
  });

  it('exposes a StatsManager instance', () => {
    expect(container.stats).toBeInstanceOf(StatsManager);
  });

  it('exposes an input handler', () => {
    expect(container.input).toBeDefined();
    expect(typeof container.input.isKeyPressed).toBe('function');
  });

  it('exposes a sprite loader', () => {
    expect(container.sprite).toBeDefined();
    expect(typeof container.sprite.load).toBe('function');
  });

  it('implements IGameContext — mutable fields are writable', () => {
    container.currentLevel = 3;
    container.player1Lives = 0;
    container.player2Lives = 1;
    container.fps = 60;
    container.busyTime = '0.016';

    expect(container.currentLevel).toBe(3);
    expect(container.player1Lives).toBe(0);
    expect(container.player2Lives).toBe(1);
    expect(container.fps).toBe(60);
    expect(container.busyTime).toBe('0.016');
  });

  it('events emitted through container are received by listeners', () => {
    const listener = vi.fn();
    container.events.on('test', listener);
    container.events.emit('test', 42);
    expect(listener).toHaveBeenCalledWith(42);
  });
});
