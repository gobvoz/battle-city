import { StatsManager } from '../stats-manager.js';
import { HI_SCORE_KEY, EnemyType, PointPerEnemyType } from '../../config/constants.js';

describe('StatsManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes total scores as [0, 0]', () => {
    const sm = new StatsManager();
    expect(sm.scores.total).toEqual([0, 0]);
  });

  it('initializes hiScore as 0 when localStorage is empty', () => {
    const sm = new StatsManager();
    expect(sm.scores.hiScore).toBe(0);
  });

  it('reads hiScore from localStorage on creation', () => {
    localStorage.setItem(HI_SCORE_KEY, '9900');
    const sm = new StatsManager();
    expect(sm.scores.hiScore).toBe(9900);
  });

  it('recordKill increments the correct player and enemy type', () => {
    const sm = new StatsManager();
    sm.recordKill(0, EnemyType.COMMON);
    sm.recordKill(0, EnemyType.COMMON);
    sm.recordKill(1, EnemyType.FAST);
    expect(sm.scores[EnemyType.COMMON]).toEqual([2, 0]);
    expect(sm.scores[EnemyType.FAST]).toEqual([0, 1]);
  });

  it('nextLevel accumulates kills × points into total', () => {
    const sm = new StatsManager();
    sm.recordKill(0, EnemyType.COMMON); // 1 × 100
    sm.recordKill(1, EnemyType.ARMOR); //  1 × 400
    sm.nextLevel();
    expect(sm.scores.total[0]).toBe(PointPerEnemyType[EnemyType.COMMON]);
    expect(sm.scores.total[1]).toBe(PointPerEnemyType[EnemyType.ARMOR]);
  });

  it('nextLevel resets per-level kill counts', () => {
    const sm = new StatsManager();
    sm.recordKill(0, EnemyType.COMMON);
    sm.nextLevel();
    expect(sm.scores[EnemyType.COMMON]).toEqual([0, 0]);
  });

  it('nextLevel updates hiScore when total exceeds it', () => {
    const sm = new StatsManager();
    sm.recordKill(0, EnemyType.ARMOR); // 400 pts
    sm.nextLevel();
    expect(sm.scores.hiScore).toBe(PointPerEnemyType[EnemyType.ARMOR]);
    expect(localStorage.getItem(HI_SCORE_KEY)).toBe(String(PointPerEnemyType[EnemyType.ARMOR]));
  });

  it('nextLevel does not update hiScore when total is lower', () => {
    localStorage.setItem(HI_SCORE_KEY, '99999');
    const sm = new StatsManager();
    sm.recordKill(0, EnemyType.COMMON); // only 100 pts
    sm.nextLevel();
    expect(sm.scores.hiScore).toBe(99999);
  });

  it('reset clears total scores to [0, 0]', () => {
    const sm = new StatsManager();
    sm.recordKill(0, EnemyType.COMMON);
    sm.nextLevel();
    sm.reset();
    expect(sm.scores.total).toEqual([0, 0]);
  });
});
