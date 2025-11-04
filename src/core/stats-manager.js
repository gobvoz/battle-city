import { TankType, EnemyType } from '../config/constants.js';

export class StatsManager {
  constructor() {
    this.scores = {
      [EnemyType.COMMON]: [3, 3],
      [EnemyType.FAST]: [0, 0],
      [EnemyType.POWER]: [0, 0],
      [EnemyType.ARMOR]: [9, 0],
      level: [0, 0],
      total: [0, 0],
    };
  }

  reset() {}

  nextLevel() {}

  recordKill(player, enemyType) {
    this.scores[enemyType][player]++;
    console.log(this.scores);
  }
}
