const DEFAULT_DEBUG_DELAY = 0;

export class DebugManager {
  static overlay: unknown = null;
  static debugDelay: number = DEFAULT_DEBUG_DELAY;

  static log(...args: unknown[]): void {
    if (!__DEBUG__) return;

    const stack = new Error().stack?.split('\n')[2] ?? '';
    const match = stack.match(/(\/[\w./-]+):(\d+):(\d+)/);
    const location = match ? `${match[1]}:${match[2]}` : 'unknown location';

    console.log(`${args.join(' ')} ${location}`);
  }

  static render(): void {
    if (!__DEBUG__) return;
  }

  static toggle(): void {
    // __DEBUG__ is a Vite compile-time define, reassignment only works in dev
    (globalThis as Record<string, unknown>)['__DEBUG__'] = !__DEBUG__;
    console.log(`Debug mode: ${__DEBUG__ ? 'ON' : 'OFF'}`);
  }

  static handleDebugDelay(): boolean {
    if (DebugManager.debugDelay > 0) {
      DebugManager.debugDelay--;
      return true;
    }

    DebugManager.debugDelay = DEFAULT_DEBUG_DELAY;
    return false;
  }
}
