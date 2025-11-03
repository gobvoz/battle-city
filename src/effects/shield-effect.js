import BaseEffect from './base-effect.js';

import { WorldOption } from '../config/constants.js';
import { event } from '../config/events.js';

export default class ShieldEffect extends BaseEffect {
  constructor({ world, target, effectOptions, ...rest }) {
    super(target);

    this.effectOptions = effectOptions;

    this.sprites = effectOptions.SPRITES;
    this.currentSprite = 0;

    this.timer = 0;
    this.interval = effectOptions.ANIMATION_INTERVAL;

    this.effectDuration = effectOptions.EFFECT_DURATION;
    this.finished = false;

    this.width = effectOptions.WIDTH;
    this.height = effectOptions.HEIGHT;
  }

  start() {
    this.target.invulnerable = true;
  }

  update(deltaTime) {
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

  end() {
    this.target.invulnerable = false;
  }

  get sprite() {
    return [
      this.sprites[this.currentSprite][0] * WorldOption.UNIT_SIZE,
      this.sprites[this.currentSprite][1] * WorldOption.UNIT_SIZE,
    ];
  }

  get x() {
    return this.target.x;
  }

  get y() {
    return this.target.y;
  }
}
