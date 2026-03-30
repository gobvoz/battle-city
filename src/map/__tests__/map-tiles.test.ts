import BrickWall from '../brick-wall.js';
import SteelWall from '../steel-wall.js';
import Water from '../water.js';
import Tree from '../tree.js';
import Ice from '../ice.js';
import { ObjectType, Direction } from '../../config/constants.js';
import type { IHittable } from '../map.type.js';

// Minimal projectile stub satisfying IHittable
function makeProjectile(power = 1, direction = Direction.UP): IHittable {
  return { type: ObjectType.PROJECTILE, power, direction } as IHittable;
}
const nonProjectile = {
  type: ObjectType.PLAYER_TANK,
  power: 1,
  direction: Direction.UP,
} as IHittable;

// ─── BrickWall ────────────────────────────────────────────────────────────────

describe('BrickWall', () => {
  it('hit() returns false for non-projectile', () => {
    const wall = new BrickWall({ x: 0, y: 0 });
    expect(wall.hit(nonProjectile)).toBe(false);
  });

  it('first hit with power=1 changes sprite and returns true', () => {
    const wall = new BrickWall({ x: 0, y: 0 });
    const result = wall.hit(makeProjectile(1, Direction.UP));
    expect(result).toBe(true);
    // sprite index changes to direction value
    expect(wall.currentSprite).toBe(Direction.UP);
  });

  it('second hit with power=1 emits "destroyed"', () => {
    const wall = new BrickWall({ x: 0, y: 0 });
    const listener = vi.fn();
    wall.on('destroyed', listener);
    wall.hit(makeProjectile(1));
    wall.hit(makeProjectile(1));
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(wall);
  });

  it('first hit with power>1 immediately emits "destroyed"', () => {
    const wall = new BrickWall({ x: 0, y: 0 });
    const listener = vi.fn();
    wall.on('destroyed', listener);
    wall.hit(makeProjectile(2));
    expect(listener).toHaveBeenCalledOnce();
  });

  it('moveThrough() always returns true', () => {
    const wall = new BrickWall({ x: 0, y: 0 });
    expect(wall.moveThrough()).toBe(true);
  });
});

// ─── SteelWall ────────────────────────────────────────────────────────────────

describe('SteelWall', () => {
  it('hit() returns false for non-projectile', () => {
    const wall = new SteelWall({ x: 0, y: 0 });
    expect(wall.hit(nonProjectile)).toBe(false);
  });

  it('hit() with power=1 returns true but does NOT emit "destroyed"', () => {
    const wall = new SteelWall({ x: 0, y: 0 });
    const listener = vi.fn();
    wall.on('destroyed', listener);
    expect(wall.hit(makeProjectile(1))).toBe(true);
    expect(listener).not.toHaveBeenCalled();
  });

  it('hit() with power>1 emits "destroyed"', () => {
    const wall = new SteelWall({ x: 0, y: 0 });
    const listener = vi.fn();
    wall.on('destroyed', listener);
    wall.hit(makeProjectile(2));
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(wall);
  });

  it('moveThrough() always returns true', () => {
    const wall = new SteelWall({ x: 0, y: 0 });
    expect(wall.moveThrough()).toBe(true);
  });
});

// ─── Water ────────────────────────────────────────────────────────────────────

describe('Water', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('hit() always returns false', () => {
    const w = new Water({ x: 0, y: 0 });
    expect(w.hit(makeProjectile())).toBe(false);
    w.destroy();
  });

  it('moveThrough() returns false for projectiles', () => {
    const w = new Water({ x: 0, y: 0 });
    expect(w.moveThrough(makeProjectile())).toBe(false);
    w.destroy();
  });

  it('moveThrough() returns true for tanks', () => {
    const w = new Water({ x: 0, y: 0 });
    expect(w.moveThrough(nonProjectile)).toBe(true);
    w.destroy();
  });

  it('animationFrame advances every 400ms', () => {
    const w = new Water({ x: 0, y: 0 });
    expect(w.currentSprite).toBe(0);
    vi.advanceTimersByTime(400);
    expect(w.currentSprite).toBe(1);
    w.destroy();
  });

  it('destroy() stops animation', () => {
    const w = new Water({ x: 0, y: 0 });
    w.destroy();
    vi.advanceTimersByTime(2000);
    expect(w.currentSprite).toBe(0);
  });
});

// ─── Tree ─────────────────────────────────────────────────────────────────────

describe('Tree', () => {
  it('hit() always returns false', () => {
    expect(new Tree({ x: 0, y: 0 }).hit()).toBe(false);
  });

  it('moveThrough() always returns false', () => {
    expect(new Tree({ x: 0, y: 0 }).moveThrough()).toBe(false);
  });

  it('has elevated zIndex', () => {
    expect(new Tree({ x: 0, y: 0 }).zIndex).toBeGreaterThan(0);
  });
});

// ─── Ice ─────────────────────────────────────────────────────────────────────

describe('Ice', () => {
  it('hit() always returns false', () => {
    expect(new Ice({ x: 0, y: 0 }).hit()).toBe(false);
  });

  it('moveThrough() always returns false', () => {
    expect(new Ice({ x: 0, y: 0 }).moveThrough()).toBe(false);
  });
});
