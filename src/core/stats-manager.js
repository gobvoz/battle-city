import { TankType } from '../config/constants.js';

export class StatsManager {
  constructor() {
    this.scores = {
      [TankType.PLAYER_1]: this._createPlayerStats(),
      [TankType.PLAYER_2]: this._createPlayerStats(),
      total: 0,
    };
  }

  reset() {
    this.scores[TankType.PLAYER_1] = this._createPlayerStats();
    this.scores[TankType.PLAYER_2] = this._createPlayerStats();
    this.scores.total = 0;
  }

  nextLevel() {
    this.scores.total +=
      this.scores[TankType.PLAYER_1].level + this.scores[TankType.PLAYER_2].level;

    this.scores[TankType.PLAYER_1] = this._createPlayerStats();
    this.scores[TankType.PLAYER_2] = this._createPlayerStats();
  }

  _createPlayerStats() {
    return {
      [1]: 0,
      [2]: 0,
      [3]: 0,
      [4]: 0,

      level: 0,
    };
  }

  recordKill(player, enemyType) {
    this.scores[player][enemyType]++;
    console.log(this.scores);
  }
}
