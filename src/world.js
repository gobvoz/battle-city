import Tank from './tank.js';

export default class World {
  level = [];

  init(level) {
    this.level = level;
  }

  player1Tank = new Tank();
  //player2Tank = new Tank();

  enemyTankList = [];

  update() {
    this.player1Tank.update();
  }
}
