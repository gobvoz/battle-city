import { EventEmitter } from '../core/event-emitter.js';

export default class BaseEffect extends EventEmitter {
  constructor(target, duration = 3000) {
    super();

    this.target = target;
    this.interval = duration;
    this.startTime = Date.now();
    this.finished = false;
  }

  update(deltaTime) {
    if (Date.now() - this.startTime > this.interval) {
      this.end();
      this.finished = true;
    }
  }
}
