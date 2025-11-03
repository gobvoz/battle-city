export class DebugManager {
  static enabled = false;

  static log(...args) {
    if (!DebugManager.enabled) return;

    const stack = new Error().stack?.split('\n')[2] || '';
    const match = stack.match(/(\/[\w./-]+):(\d+):(\d+)/);
    const location = match ? `${match[1]}:${match[2]}` : 'unknown location';

    console.log(`${args.join(' ')} ${location}`);
  }

  static toggle() {
    DebugManager.enabled = !DebugManager.enabled;
    console.log(`Debug mode: ${DebugManager.enabled ? 'ON' : 'OFF'}`);
  }
}
