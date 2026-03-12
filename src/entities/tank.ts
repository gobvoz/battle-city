import GameObject from '../core/game-object.js';
import { event } from '../config/events.js';
import { Direction, WorldOption, ObjectType, TankType, KeyCode } from '../config/constants.js';
import type { DirectionType, TankTypeValue } from '../config/constants.type.js';
import type { PlayerIndex } from '../core/stats-manager.js';
import type {
  TankOptions,
  IEnemyTankOptions,
  IPlayerTankOptions,
  TankSprites,
  IHitObject,
} from './entities.type.js';
import type { IWorld } from '../world/world.type.js';

export type TankState = 'dead' | 'active';

type PlayerKeyBinding = { UP: string; DOWN: string; LEFT: string; RIGHT: string };

export default class Tank extends GameObject {
  state: TankState = 'dead';
  declare sprites: TankSprites;

  protected readonly tankOptions: TankOptions;
  direction: DirectionType;
  speed: number;
  projectileSpeed: number;
  power: number;
  playerIndex: PlayerIndex | undefined;
  oldX: number;
  oldY: number;
  animationFrame: 0 | 1;
  movementStep: number;
  movementTile: number;
  type: TankTypeValue;
  hasProjectile: boolean;
  invulnerable: boolean;

  constructor({
    type,
    tankOptions,
    world,
    x,
    y,
  }: {
    type: TankTypeValue;
    tankOptions: TankOptions;
    world: IWorld;
    x: number;
    y: number;
  }) {
    super({
      world,
      x,
      y,
      width: tankOptions.WIDTH,
      height: tankOptions.HEIGHT,
      sprites: tankOptions.SPRITES,
    });

    this.tankOptions = tankOptions;
    this.direction = tankOptions.START_DIRECTION;
    this.speed = tankOptions.MOVEMENT_SPEED;
    this.projectileSpeed = tankOptions.PROJECTILE_SPEED;
    this.power = tankOptions.DEFAULT_POWER ?? 1;
    this.playerIndex =
      'PLAYER_INDEX' in tankOptions ? (tankOptions as IPlayerTankOptions).PLAYER_INDEX : undefined;

    this.oldX = this.x;
    this.oldY = this.y;
    this.animationFrame = 1;

    this.movementStep = WorldOption.STEP_SIZE;
    this.movementTile = WorldOption.TILE_SIZE;

    this.type = type;

    this.hasProjectile = false;
    this.invulnerable = false;
  }

  _changeAnimationFrame = (): void => {
    this.animationFrame ^= 1 as 0 | 1;
  };

  _stickToGrid(): void {
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

  moveUp = (): void => {
    if (this.direction === Direction.LEFT || this.direction === Direction.RIGHT) {
      this._stickToGrid();
    }
    this.direction = Direction.UP;
  };

  moveDown = (): void => {
    if (this.direction === Direction.LEFT || this.direction === Direction.RIGHT) {
      this._stickToGrid();
    }
    this.direction = Direction.DOWN;
  };

  moveLeft = (): void => {
    if (this.direction === Direction.UP || this.direction === Direction.DOWN) {
      this._stickToGrid();
    }
    this.direction = Direction.LEFT;
  };

  moveRight = (): void => {
    if (this.direction === Direction.UP || this.direction === Direction.DOWN) {
      this._stickToGrid();
    }
    this.direction = Direction.RIGHT;
  };

  stopUp = (): void => {};
  stopDown = (): void => {};
  stopLeft = (): void => {};
  stopRight = (): void => {};

  fire = (): void => {
    if (this.state !== 'active') return;
    this.emit(event.object.FIRE, this);
  };

  hit(object: IHitObject): boolean {
    if (this.invulnerable) return false;
    if (object.type !== ObjectType.PROJECTILE) return false;
    if (
      object.type === ObjectType.PROJECTILE &&
      object.tank === (this as unknown as typeof object.tank)
    )
      return false;
    if (object.type === ObjectType.PROJECTILE && object.tank.type === this.type) return false;

    if (this.type === TankType.ENEMY) {
      this.emit(
        event.stats.RECORD_KILL,
        (this.tankOptions as IEnemyTankOptions).ENEMY_TYPE,
        object.tank.playerIndex
      );
    }

    this.emit(event.object.DESTROYED, this);
    this.state = 'dead';
    return true;
  }

  moveThrough(object: IHitObject): boolean {
    if (this === (object as unknown as this)) return false;
    if (
      object.type === ObjectType.PROJECTILE &&
      object.tank === (this as unknown as typeof object.tank)
    )
      return false;
    if (object.type === ObjectType.PROJECTILE && object.tank.type === this.type) return false;

    return true;
  }

  get sprite(): [number, number] {
    return [
      this.sprites[this.direction][this.animationFrame][0] * WorldOption.UNIT_SIZE,
      this.sprites[this.direction][this.animationFrame][1] * WorldOption.UNIT_SIZE,
    ];
  }

  update(_deltaTime: number | undefined, activeKeys: Set<string>): void {
    const speed = (this.world as IWorld).hasCollision(this) ? 0 : this.speed;
    const kb = KeyCode[this.type] as unknown as PlayerKeyBinding;
    let tankTryToMove = false;

    if (this.direction === Direction.UP && activeKeys.has(kb.UP)) {
      this.realY -= speed;
      tankTryToMove = true;
    } else if (this.direction === Direction.DOWN && activeKeys.has(kb.DOWN)) {
      this.realY += speed;
      tankTryToMove = true;
    } else if (this.direction === Direction.LEFT && activeKeys.has(kb.LEFT)) {
      this.realX -= speed;
      tankTryToMove = true;
    } else if (this.direction === Direction.RIGHT && activeKeys.has(kb.RIGHT)) {
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
