export default class BaseEffect {
  constructor(target, duration = 3000) {
    this.target = target;
    this.duration = duration;
    this.startTime = Date.now();
    this.finished = false;
  }

  start() {}
  end() {}

  update(deltaTime) {
    if (Date.now() - this.startTime > this.duration) {
      this.end();
      this.finished = true;
    }
  }
}
