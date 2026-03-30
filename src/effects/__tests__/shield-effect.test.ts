import ShieldEffect from '../shield-effect.js';
import { ShieldEffectOptions } from '../../config/constants.js';

function makeTarget() {
  return { invulnerable: false, x: 10, y: 20 };
}

describe('ShieldEffect', () => {
  it('start() sets target.invulnerable = true', () => {
    const target = makeTarget();
    const effect = new ShieldEffect({ target, effectOptions: ShieldEffectOptions });
    effect.start();
    expect(target.invulnerable).toBe(true);
  });

  it('end() sets target.invulnerable = false', () => {
    const target = makeTarget();
    const effect = new ShieldEffect({ target, effectOptions: ShieldEffectOptions });
    effect.start();
    effect.end();
    expect(target.invulnerable).toBe(false);
  });

  it('x/y getters proxy to target', () => {
    const target = makeTarget();
    const effect = new ShieldEffect({ target, effectOptions: ShieldEffectOptions });
    expect(effect.x).toBe(target.x);
    expect(effect.y).toBe(target.y);
  });

  it('tracks target x/y when target moves', () => {
    const target = makeTarget();
    const effect = new ShieldEffect({ target, effectOptions: ShieldEffectOptions });
    target.x = 99;
    target.y = 88;
    expect(effect.x).toBe(99);
    expect(effect.y).toBe(88);
  });

  it('starts with finished = false', () => {
    const effect = new ShieldEffect({ target: makeTarget(), effectOptions: ShieldEffectOptions });
    expect(effect.finished).toBe(false);
  });

  it('toggles currentSprite between 0 and 1 when timer >= interval', () => {
    const target = makeTarget();
    const effect = new ShieldEffect({ target, effectOptions: ShieldEffectOptions });
    // Enough deltaTime to cross the sprite interval (0.04) but not expire duration (5)
    effect.update(ShieldEffectOptions.ANIMATION_INTERVAL + 0.001);
    const sprite1 = effect.sprite;
    effect.update(ShieldEffectOptions.ANIMATION_INTERVAL + 0.001);
    const sprite2 = effect.sprite;
    expect(sprite1).not.toEqual(sprite2);
  });

  it('emits "destroyed" and sets finished=true when duration expires', () => {
    const target = makeTarget();
    const effect = new ShieldEffect({ target, effectOptions: ShieldEffectOptions });
    const listener = vi.fn();
    effect.on('destroyed', listener);
    // A single deltaTime larger than EFFECT_DURATION exhausts it
    effect.update(ShieldEffectOptions.EFFECT_DURATION + 1);
    expect(effect.finished).toBe(true);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(effect);
  });

  it('calls end() when duration expires (invulnerable reset)', () => {
    const target = makeTarget();
    const effect = new ShieldEffect({ target, effectOptions: ShieldEffectOptions });
    effect.start();
    effect.update(ShieldEffectOptions.EFFECT_DURATION + 1);
    expect(target.invulnerable).toBe(false);
  });

  it('does not emit "destroyed" before duration expires', () => {
    const target = makeTarget();
    const effect = new ShieldEffect({ target, effectOptions: ShieldEffectOptions });
    const listener = vi.fn();
    effect.on('destroyed', listener);
    effect.update(ShieldEffectOptions.EFFECT_DURATION / 2);
    expect(listener).not.toHaveBeenCalled();
  });
});
