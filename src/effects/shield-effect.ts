import BaseEffect from './base-effect.js';
import { WorldOption } from '../config/constants.js';
import { event } from '../config/events.js';

interface IShieldEffectOptions {
  WIDTH: number;
  HEIGHT: number;
  EFFECT_DURATION: number;
  ANIMATION_INTERVAL: number;
  SPRITES: readonly (readonly [number, number])[];
}

export default class ShieldEffect extends BaseEffect {
  private sprites: IShieldEffectOptions['SPRITES'];
  private currentSprite: number;
  private timer: number;
  private effectDuration: number;

  width: number;
  height: number;

  constructor({
    target,
    effectOptions,
  }: {
    target: InstanceType<typeof BaseEffect>['target'];
    effectOptions: IShieldEffectOptions;
  }) {
    super(target);

    this.sprites = effectOptions.SPRITES;
    this.currentSprite = 0;

    this.timer = 0;
    this.interval = effectOptions.ANIMATION_INTERVAL;
    this.effectDuration = effectOptions.EFFECT_DURATION;
    this.finished = false;

    this.width = effectOptions.WIDTH;
    this.height = effectOptions.HEIGHT;
  }

  start(): void {
    this.target.invulnerable = true;
  }

  update(deltaTime: number): void {
    this.timer += deltaTime;
    this.effectDuration -= deltaTime;

    if (this.effectDuration <= 0) {
      this.end();
      this.emit(event.object.DESTROYED, this);
      this.finished = true;
      return;
    }

    if (this.timer >= this.interval) {
      this.timer = 0;
      this.currentSprite ^= 1;
    }
  }

  end(): void {
    this.target.invulnerable = false;
  }

  get sprite(): [number, number] {
    return [
      this.sprites[this.currentSprite][0] * WorldOption.UNIT_SIZE,
      this.sprites[this.currentSprite][1] * WorldOption.UNIT_SIZE,
    ];
  }

  get x(): number {
    return this.target.x;
  }

  get y(): number {
    return this.target.y;
  }
}
