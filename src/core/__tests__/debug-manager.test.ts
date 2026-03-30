import { DebugManager } from '../debug-manager.js';

describe('DebugManager', () => {
  beforeEach(() => {
    DebugManager.debugDelay = 0;
  });

  describe('handleDebugDelay()', () => {
    it('returns false and resets delay when delay is 0', () => {
      DebugManager.debugDelay = 0;
      expect(DebugManager.handleDebugDelay()).toBe(false);
      expect(DebugManager.debugDelay).toBe(0);
    });

    it('returns true and decrements delay when delay > 0', () => {
      DebugManager.debugDelay = 3;
      expect(DebugManager.handleDebugDelay()).toBe(true);
      expect(DebugManager.debugDelay).toBe(2);
    });

    it('returns false when delay decrements to 0', () => {
      DebugManager.debugDelay = 1;
      DebugManager.handleDebugDelay(); // 1 → 0, returns true
      expect(DebugManager.handleDebugDelay()).toBe(false); // already 0
    });
  });
});
