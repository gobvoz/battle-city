import { keyCode } from '../config/key-codes.js';
import { event } from '../config/events.js';
import type { IGameContext } from './game-context.type.js';

export class Input {
  private keys: Set<string>;
  private game: IGameContext;
  private allowedKeys: Set<string>;

  constructor(game: IGameContext) {
    this.keys = new Set();
    this.game = game;
    this.allowedKeys = new Set(Object.values(keyCode));

    window.addEventListener('keydown', e => {
      const code = e.code;
      if (!this.allowedKeys.has(code)) return;

      this.keys.add(code);

      const evtName = Object.values(event.key).find(v => v.endsWith(code)) ?? `key:${code}`;

      this.game.events.emit(evtName, event.inputAction.PRESSED);
      e.preventDefault();
    });

    window.addEventListener('keyup', e => {
      const code = e.code;
      if (!this.allowedKeys.has(code)) return;

      this.keys.delete(code);

      const evtName = Object.values(event.key).find(v => v.endsWith(code)) ?? `key:${code}`;

      this.game.events.emit(evtName, event.inputAction.RELEASED);
      e.preventDefault();
    });
  }

  isKeyPressed(code: string): boolean {
    return this.keys.has(code);
  }

  isKeyReleased(code: string): boolean {
    return !this.keys.has(code);
  }

  activeKeys(): Set<string> {
    return new Set(this.keys);
  }
}
