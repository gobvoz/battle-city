import GameObject from './game-object.js';

import { Direction, WorldOption, KeyCode } from './constants.js';

export default class Tank extends GameObject {
  constructor({ direction, speed, playerIndex, ...rest }) {
    super({ ...rest });

    this.direction = direction;
    this.speed = speed;

    this.animationFrame = 1;

    this.movementStep = WorldOption.STEP_SIZE;
    this.movementTile = WorldOption.TILE_SIZE;

    this.playerIndex = playerIndex;

    this.alreadyShot = false;
  }

  _changeAnimationFrame = () => (this.animationFrame ^= 1);

  _stickToGrid() {
    const deltaX = this.x % this.movementTile;
    const deltaY = this.y % this.movementTile;

    if (this.direction === Direction.LEFT) {
      this.x += deltaX <= this.movementStep ? -deltaX : this.movementTile - deltaX;
    }
    if (this.direction === Direction.RIGHT) {
      this.x += deltaX <= this.movementStep ? -deltaX : this.movementTile - deltaX;
    }
    if (this.direction === Direction.UP) {
      this.y += deltaY <= this.movementStep ? -deltaY : this.movementTile - deltaY;
    }
    if (this.direction === Direction.DOWN) {
      this.y += deltaY <= this.movementStep ? -deltaY : this.movementTile - deltaY;
    }
  }

  moveUp = () => {
    if (this.direction === Direction.LEFT || this.direction === Direction.RIGHT) {
      this._stickToGrid();
    }

    this.direction = Direction.UP;
  };
  moveDown = () => {
    if (this.direction === Direction.LEFT || this.direction === Direction.RIGHT) {
      this._stickToGrid();
    }

    this.direction = Direction.DOWN;
  };
  moveLeft = () => {
    if (this.direction === Direction.UP || this.direction === Direction.DOWN) {
      this._stickToGrid();
    }

    this.direction = Direction.LEFT;
  };
  moveRight = () => {
    if (this.direction === Direction.UP || this.direction === Direction.DOWN) {
      this._stickToGrid();
    }

    this.direction = Direction.RIGHT;
  };

  stopUp = () => {};
  stopDown = () => {};
  stopLeft = () => {};
  stopRight = () => {};

  fire = () => {
    this.emit('fire', this);
  };

  get sprite() {
    return [
      this.sprites[this.direction][this.animationFrame][0] * WorldOption.UNIT_SIZE,
      this.sprites[this.direction][this.animationFrame][1] * WorldOption.UNIT_SIZE,
    ];
  }

  update(activeKeys) {
    const speed = this.world.hasCollision(this) ? 0 : this.speed;

    if (this.direction === Direction.UP && activeKeys.has(KeyCode[this.playerIndex].UP)) {
      this.y -= speed;
      this._changeAnimationFrame();
    } else if (
      this.direction === Direction.DOWN &&
      activeKeys.has(KeyCode[this.playerIndex].DOWN)
    ) {
      this.y += speed;
      this._changeAnimationFrame();
    } else if (
      this.direction === Direction.LEFT &&
      activeKeys.has(KeyCode[this.playerIndex].LEFT)
    ) {
      this.x -= speed;
      this._changeAnimationFrame();
    } else if (
      this.direction === Direction.RIGHT &&
      activeKeys.has(KeyCode[this.playerIndex].RIGHT)
    ) {
      this.x += speed;
      this._changeAnimationFrame();
    }
  }
}
