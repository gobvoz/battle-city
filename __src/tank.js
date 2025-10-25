import GameObject from './game-object.js';

import { Direction, WorldOption, ObjectType, TankType, KeyCode } from './constants.js';

export default class Tank extends GameObject {
  state = 'dead';

  constructor({ playerIndex, type, tankOptions, ...rest }) {
    const options = {
      width: tankOptions.WIDTH,
      height: tankOptions.HEIGHT,
      sprites: tankOptions.SPRITES,
    };

    super({ ...rest, ...options });

    this.direction = tankOptions.START_DIRECTION;
    this.speed = tankOptions.MOVEMENT_SPEED;
    this.projectileSpeed = tankOptions.PROJECTILE_SPEED;
    this.power = tankOptions.DEFAULT_POWER;

    this.oldX = this.x;
    this.oldY = this.y;
    this.animationFrame = 1;

    this.movementStep = WorldOption.STEP_SIZE;
    this.movementTile = WorldOption.TILE_SIZE;

    this.type = type;

    this.hasProjectile = false;
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
    this.realX = this.x;
    this.realY = this.y;
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

  hit(object) {
    if (object.type !== ObjectType.PROJECTILE) return false;
    if (object.type === ObjectType.PROJECTILE && object.tank === this) return false;
    if (object.type === ObjectType.PROJECTILE && object.tank.type === this.type) return false;

    this.emit('destroy', this);
    this.state = 'dead';
    return true;
  }

  moveThrough(object) {
    if (this === object) return false;
    if (object.type === ObjectType.PROJECTILE && object.tank === this) return false;
    if (object.type === ObjectType.PROJECTILE && object.tank.type === this.type) return false;

    return true;
  }

  get sprite() {
    return [
      this.sprites[this.direction][this.animationFrame][0] * WorldOption.UNIT_SIZE,
      this.sprites[this.direction][this.animationFrame][1] * WorldOption.UNIT_SIZE,
    ];
  }

  update(activeKeys) {
    const speed = this.world.hasCollision(this) ? 0 : this.speed;
    let tankTryToMove = false;

    if (this.direction === Direction.UP && activeKeys.has(KeyCode[this.type].UP)) {
      this.realY -= speed;
      tankTryToMove = true;
    } else if (this.direction === Direction.DOWN && activeKeys.has(KeyCode[this.type].DOWN)) {
      this.realY += speed;
      tankTryToMove = true;
    } else if (this.direction === Direction.LEFT && activeKeys.has(KeyCode[this.type].LEFT)) {
      this.realX -= speed;
      tankTryToMove = true;
    } else if (this.direction === Direction.RIGHT && activeKeys.has(KeyCode[this.type].RIGHT)) {
      this.realX += speed;
      tankTryToMove = true;
    }

    if (this.oldX !== this.x || this.oldY !== this.y || tankTryToMove) {
      this.oldX = this.x;
      this.oldY = this.y;

      this._changeAnimationFrame();
    }

    this.x = this.realX >> 0;
    this.y = this.realY >> 0;

    this.state = 'active';
  }
}
