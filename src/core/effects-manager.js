export default class EffectsManager {
  constructor(world) {
    this.world = world;
    this.activeEffects = [];
  }

  addEffect(effect) {
    this.activeEffects.push(effect);
  }

  removeEffect(effect) {
    this.activeEffects = this.activeEffects.filter(e => e !== effect);
  }

  update(deltaTime) {
    this.activeEffects.forEach(effect => effect.update(deltaTime));
    this.activeEffects = this.activeEffects.filter(effect => !effect.finished);
  }
}
