const DEFAULT_DEBUG_DELAY = 0;

export class DebugManager {
  static overlay = null;
  static debugDelay = DEFAULT_DEBUG_DELAY;

  static log(...args) {
    if (!__DEBUG__) return;

    const stack = new Error().stack?.split('\n')[2] || '';
    const match = stack.match(/(\/[\w./-]+):(\d+):(\d+)/);
    const location = match ? `${match[1]}:${match[2]}` : 'unknown location';

    console.log(`${args.join(' ')} ${location}`);
  }

  static render() {
    if (!__DEBUG__) return;
  }

  static toggle() {
    __DEBUG__ = !__DEBUG__;
    console.log(`Debug mode: ${__DEBUG__ ? 'ON' : 'OFF'}`);
  }

  static handleDebugDelay() {
    if (DebugManager.debugDelay > 0) {
      DebugManager.debugDelay--;
      return true;
    }

    DebugManager.debugDelay = DEFAULT_DEBUG_DELAY;
    return false;
  }
}
