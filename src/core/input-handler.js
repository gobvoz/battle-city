import { keyCode } from '../config/key-codes.js';
import { event } from '../config/events.js';

export class Input {
  constructor(game) {
    this.keys = new Set();
    this.game = game;

    this.allowedKeys = new Set(Object.values(keyCode));

    window.addEventListener('keydown', e => {
      const code = e.code;
      if (!this.allowedKeys.has(code)) return;

      this.keys.add(code);

      const evtName = Object.values(event.key).find(v => v.endsWith(code)) || `key:${code}`;

      this.game.events.emit(evtName, event.inputAction.PRESSED);
      e.preventDefault();
    });

    window.addEventListener('keyup', e => {
      const code = e.code;
      if (!this.allowedKeys.has(code)) return;

      this.keys.delete(code);

      const evtName = Object.values(event.key).find(v => v.endsWith(code)) || `key:${code}`;

      this.game.events.emit(evtName, event.inputAction.RELEASED);
      e.preventDefault();
    });
  }

  isKeyPressed(code) {
    return this.keys.has(code);
  }

  isKeyReleased(code) {
    return !this.keys.has(code);
  }

  activeKeys() {
    return new Set(this.keys);
  }
}
