import Explosive from '../explosive.js';
import Projectile from '../projectile.js';
import { Direction, ExplosiveOption, TankType } from '../../config/constants.js';
import type { ITankForProjectile } from '../projectile.js';

const SW = ExplosiveOption.SMALL_WIDTH;
const SH = ExplosiveOption.SMALL_HEIGHT;
const BW = ExplosiveOption.BIG_WIDTH;
const BH = ExplosiveOption.BIG_HEIGHT;

function makeProjectile(direction: ITankForProjectile['direction']): Projectile {
  const p = new Projectile();
  p.init({
    tank: {
      x: 50,
      y: 200,
      width: 32,
      height: 32,
      direction,
      power: 1,
      projectileSpeed: 2,
      type: TankType.PLAYER_1,
      playerIndex: 0,
      hasProjectile: false,
    },
    direction,
    world: {} as never,
  });
  return p;
}

const mockTank = { x: 100, y: 200, width: 32, height: 32 };
const mockBase = { x: 60, y: 80, width: 16, height: 16 };

describe('Explosive.init()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('sets SMALL dimensions for a projectile explosion', () => {
    const e = new Explosive();
    e.init({ projectile: makeProjectile(Direction.UP), world: {} as never });
    expect(e.width).toBe(SW);
    expect(e.height).toBe(SH);
  });

  it('sets BIG dimensions for a tank explosion', () => {
    const e = new Explosive();
    e.init({ tank: mockTank as never, world: {} as never });
    expect(e.width).toBe(BW);
    expect(e.height).toBe(BH);
  });

  it('sets BIG dimensions for a base explosion', () => {
    const e = new Explosive();
    e.init({ base: mockBase as never, world: {} as never });
    expect(e.width).toBe(BW);
    expect(e.height).toBe(BH);
  });

  it('centers explosion around tank', () => {
    const e = new Explosive();
    e.init({ tank: mockTank as never, world: {} as never });
    expect(e.x).toBe(mockTank.x - (BW >> 1) + (mockTank.width >> 1));
    expect(e.y).toBe(mockTank.y - (BH >> 1) + (mockTank.height >> 1));
  });

  it('resets animationFrame to 0 on each init', () => {
    const e = new Explosive();
    e.init({ projectile: makeProjectile(Direction.UP), world: {} as never });
    vi.advanceTimersByTime(150);
    expect(e.animationFrame).toBe(1);
    e.destroy();
    e.clearListeners();
    e.init({ projectile: makeProjectile(Direction.DOWN), world: {} as never });
    expect(e.animationFrame).toBe(0);
  });

  it('animationFrame advances every 150ms', () => {
    const e = new Explosive();
    e.init({ projectile: makeProjectile(Direction.UP), world: {} as never });
    expect(e.animationFrame).toBe(0);
    vi.advanceTimersByTime(150);
    expect(e.animationFrame).toBe(1);
    vi.advanceTimersByTime(150);
    expect(e.animationFrame).toBe(2);
  });

  it('emits "destroyed" after 450ms', () => {
    const e = new Explosive();
    e.init({ projectile: makeProjectile(Direction.UP), world: {} as never });
    const listener = vi.fn();
    e.on('destroyed', listener);
    vi.advanceTimersByTime(450);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(e);
  });

  it('destroy() stops timers — "destroyed" is never emitted', () => {
    const e = new Explosive();
    e.init({ projectile: makeProjectile(Direction.UP), world: {} as never });
    const listener = vi.fn();
    e.on('destroyed', listener);
    e.destroy();
    vi.advanceTimersByTime(1000);
    expect(listener).not.toHaveBeenCalled();
  });

  it('can be reused after destroy() + clearListeners()', () => {
    const e = new Explosive();
    e.init({ projectile: makeProjectile(Direction.UP), world: {} as never });
    e.destroy();
    e.clearListeners();

    e.init({ projectile: makeProjectile(Direction.DOWN), world: {} as never });
    const listener = vi.fn();
    e.on('destroyed', listener);
    vi.advanceTimersByTime(450);
    expect(listener).toHaveBeenCalledOnce();
  });
});
