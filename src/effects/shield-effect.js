import BaseEffect from './base-effect.js';

export default class ShieldEffect extends BaseEffect {
  width = 16;
  height = 16;
  x = 0;
  y = 0;

  start() {
    console.log('start shield effect');
    this.target.invulnerable = true;
  }

  end() {
    console.log('end shield effect');
    this.target.invulnerable = false;
  }

  get sprite() {
    return [16, 8];
  }
}
