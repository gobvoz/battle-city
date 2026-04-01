import Base from '../base.js';
import { ObjectType, BaseOption } from '../../config/constants.js';

const projectileHit = { objectType: ObjectType.PROJECTILE } as never;
const tankHit = { objectType: ObjectType.PLAYER_TANK } as never;

describe('Base', () => {
  it('positions at BaseOption coordinates', () => {
    const base = new Base({});
    expect(base.x).toBe(BaseOption.START_X);
    expect(base.y).toBe(BaseOption.START_Y);
  });

  it('starts with destroyed = false', () => {
    const base = new Base({});
    expect(base.destroyed).toBe(false);
  });

  it('hit() returns false for non-projectile', () => {
    const base = new Base({});
    expect(base.hit(tankHit)).toBe(false);
  });

  it('hit() by projectile sets destroyed = true', () => {
    const base = new Base({});
    base.hit(projectileHit);
    expect(base.destroyed).toBe(true);
  });

  it('hit() by projectile emits "destroyed" with self', () => {
    const base = new Base({});
    const listener = vi.fn();
    base.on('destroyed', listener);
    base.hit(projectileHit);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(base);
  });

  it('moveThrough() always returns true', () => {
    const base = new Base({});
    expect(base.moveThrough()).toBe(true);
  });
});
