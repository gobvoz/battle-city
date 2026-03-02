import GameObject from '../core/game-object.js';
import { event } from '../config/events.js';
import { Direction, WorldOption, ProjectileOption, ObjectType } from '../config/constants.js';
import type { DirectionType, ObjectTypeValue, TankTypeValue } from '../config/constants.type.js';
import type { PlayerIndex } from '../core/stats-manager.js';
import type { IWorld } from '../world/world.type.js';

type ProjectileSprites = Record<DirectionType, readonly [number, number]>;

export interface ITankForProjectile {
  direction: DirectionType;
  power: number;
  projectileSpeed: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: TankTypeValue;
  playerIndex: PlayerIndex | undefined;
  hasProjectile: boolean;
}

export default class Projectile extends GameObject {
  tank: ITankForProjectile;
  power: number;
  direction: DirectionType;
  speed: number;
  type: ObjectTypeValue;
  declare sprites: ProjectileSprites;

  constructor({
    tank,
    direction,
    world,
  }: {
    tank: ITankForProjectile;
    direction: DirectionType;
    world: IWorld;
  }) {
    super({
      world,
      x: 0,
      y: 0,
      width: ProjectileOption.WIDTH,
      height: ProjectileOption.HEIGHT,
      sprites: ProjectileOption.SPRITES,
    });

    this.tank = tank;
    this.power = tank.power;

    this.realX = this._getStartX(tank);
    this.realY = this._getStartY(tank);
    this.x = this._getStartX(tank);
    this.y = this._getStartY(tank);

    this.direction = direction;
    this.speed = tank.projectileSpeed;
    this.type = ObjectType.PROJECTILE;
  }

  private _getStartX(tank: ITankForProjectile): number {
    switch (tank.direction) {
      case Direction.UP:
      case Direction.DOWN:
        return tank.x + (tank.width >> 1) - (this.width >> 1);
      case Direction.LEFT:
        return tank.x;
      case Direction.RIGHT:
        return tank.x + tank.width;
      default:
        return 0;
    }
  }

  private _getStartY(tank: ITankForProjectile): number {
    switch (tank.direction) {
      case Direction.UP:
        return tank.y;
      case Direction.DOWN:
        return tank.y + tank.height;
      case Direction.LEFT:
      case Direction.RIGHT:
        return tank.y + (tank.height >> 1) - (this.height >> 1);
      default:
        return 0;
    }
  }

  get sprite(): [number, number] {
    return [
      this.sprites[this.direction][0] * WorldOption.UNIT_SIZE,
      this.sprites[this.direction][1] * WorldOption.UNIT_SIZE,
    ];
  }

  update(): void {
    const hasCollision = (this.world as IWorld).hasCollision(this);

    if (hasCollision) {
      this.emit(event.object.DESTROYED, this);
    }

    const speed = hasCollision ? 0 : this.speed;

    if (this.direction === Direction.UP) {
      this.realY -= speed;
    } else if (this.direction === Direction.DOWN) {
      this.realY += speed;
    } else if (this.direction === Direction.LEFT) {
      this.realX -= speed;
    } else if (this.direction === Direction.RIGHT) {
      this.realX += speed;
    }

    this.x = this.realX >> 0;
    this.y = this.realY >> 0;
  }
}
