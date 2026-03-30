import Resurrection from '../resurrection.js';
import { TankType, ResurrectionOption, Player1TankOption } from '../../config/constants.js';

function makeResurrection(): Resurrection {
  return new Resurrection({
    x: 10,
    y: 20,
    tankType: TankType.PLAYER_1,
    options: Player1TankOption,
  });
}

describe('Resurrection', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('stores tankType and tankOptions', () => {
    const r = makeResurrection();
    expect(r.tankType).toBe(TankType.PLAYER_1);
    expect(r.tankOptions).toBe(Player1TankOption);
  });

  it('positions at given x/y', () => {
    const r = makeResurrection();
    expect(r.x).toBe(10);
    expect(r.y).toBe(20);
  });

  it('starts at animationFrame 0', () => {
    const r = makeResurrection();
    expect(r.animationFrame).toBe(0);
    r.destroy();
  });

  it('advances animationFrame every ANIMATION_INTERVAL ms', () => {
    const r = makeResurrection();
    vi.advanceTimersByTime(ResurrectionOption.ANIMATION_INTERVAL);
    expect(r.animationFrame).toBe(1);
    vi.advanceTimersByTime(ResurrectionOption.ANIMATION_INTERVAL);
    expect(r.animationFrame).toBe(2);
    r.destroy();
  });

  it('wraps animationFrame back to 0 at the end of sprites', () => {
    const r = makeResurrection();
    const frameCount = ResurrectionOption.SPRITES.length;
    vi.advanceTimersByTime(ResurrectionOption.ANIMATION_INTERVAL * frameCount);
    expect(r.animationFrame).toBe(0);
    r.destroy();
  });

  it('emits "destroyed" after ANIMATION_TIME ms', () => {
    const r = makeResurrection();
    const listener = vi.fn();
    r.on('destroyed', listener);
    vi.advanceTimersByTime(ResurrectionOption.ANIMATION_TIME);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(r);
  });

  it('destroy() prevents "destroyed" from being emitted', () => {
    const r = makeResurrection();
    const listener = vi.fn();
    r.on('destroyed', listener);
    r.destroy();
    vi.advanceTimersByTime(ResurrectionOption.ANIMATION_TIME + 1000);
    expect(listener).not.toHaveBeenCalled();
  });

  it('destroy() is idempotent — calling twice does not throw', () => {
    const r = makeResurrection();
    expect(() => {
      r.destroy();
      r.destroy();
    }).not.toThrow();
  });
});
