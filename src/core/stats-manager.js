import { PointPerEnemyType, HI_SCORE_KEY } from '../config/constants.js';

export class StatsManager {
  constructor() {
    this.scores = {};

    this._resetLevelScores();

    this.scores.total = [0, 0];
    this.scores.hiScore = 0;

    const hiScore = localStorage.getItem(HI_SCORE_KEY);
    if (hiScore) {
      this.scores.hiScore = parseInt(hiScore, 10) || 0;
    }
  }

  reset() {
    this._resetLevelScores();
    this.scores.total = [0, 0];
    this.scores.hiScore = this.scores.hiScore;
  }

  nextLevel() {
    for (let enemyType = 1; enemyType <= 4; enemyType++) {
      this.scores.total[0] += this.scores[enemyType][0] * PointPerEnemyType[enemyType];
      this.scores.total[1] += this.scores[enemyType][1] * PointPerEnemyType[enemyType];

      this.scores[enemyType] = [0, 0];
    }

    if (this.scores.total[0] > this.scores.hiScore || this.scores.total[1] > this.scores.hiScore) {
      this.scores.hiScore = Math.max(this.scores.total[0], this.scores.total[1]);

      localStorage.setItem(HI_SCORE_KEY, this.scores.hiScore.toString());
    }
  }

  _resetLevelScores() {
    for (let enemyType = 1; enemyType <= 4; enemyType++) {
      this.scores[enemyType] = [0, 0];
    }
  }

  recordKill(player, enemyType) {
    this.scores[enemyType][player]++;
  }
}
