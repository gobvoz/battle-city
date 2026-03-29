// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (...args: any[]) => void;

export class EventEmitter {
  game: unknown;
  private listeners: Record<string, Listener[]>;

  constructor(game?: unknown) {
    this.game = game;
    this.listeners = {};
  }

  on(event: string, listener: Listener): void {
    __DEBUG__ && console.log('-> event added: ' + event);

    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event: string, listener: Listener): void {
    __DEBUG__ && console.log('-< event removed: ' + event);
    if (!this.listeners[event]) return;

    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  emit(event: string, ...args: unknown[]): void {
    __DEBUG__ && console.log('>> event emitted: ' + event);

    if (!this.listeners[event]) return;

    const listeners = [...this.listeners[event]];
    for (const listener of listeners) {
      listener(...args);
    }
  }

  clearListeners(): void {
    this.listeners = {};
  }
}
