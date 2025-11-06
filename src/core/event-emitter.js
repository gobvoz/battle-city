export class EventEmitter {
  constructor(game) {
    this.game = game;
    this.listeners = {};
  }

  on(event, listener) {
    __DEBUG__ && console.log('-> event added: ' + event);

    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event, listener) {
    __DEBUG__ && console.log('-< event removed: ' + event);
    if (!this.listeners[event]) return;

    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  emit(event, ...args) {
    __DEBUG__ && console.log('>> event emitted: ' + event);

    if (!this.listeners[event]) return;

    const listeners = [...this.listeners[event]];
    for (const listener of listeners) {
      listener(...args);
    }
  }
}
