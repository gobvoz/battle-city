import { EventEmitter } from '../core/event-emitter.js';

export interface IEffectTarget {
  invulnerable: boolean;
  x: number;
  y: number;
}

export default class BaseEffect extends EventEmitter {
  target: IEffectTarget;
  interval: number;
  startTime: number;
  finished: boolean;

  constructor(target: IEffectTarget, duration = 3000) {
    super();

    this.target = target;
    this.interval = duration;
    this.startTime = Date.now();
    this.finished = false;
  }

  update(_deltaTime?: number): void {
    if (Date.now() - this.startTime > this.interval) {
      this.end();
      this.finished = true;
    }
  }

  end(): void {}
}
