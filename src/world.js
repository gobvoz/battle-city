import Tank from './tank.js';

export default class World {
  grig = [];

  player1Tank = new Tank();
  //player2Tank = new Tank();

  enemyTankList = [];

  update() {
    this.player1Tank.update();
  }
}
