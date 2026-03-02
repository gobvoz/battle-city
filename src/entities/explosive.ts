import GameObject from '../core/game-object.js';
import { event } from '../config/events.js';
import { Direction, ExplosiveOption, WorldOption } from '../config/constants.js';
import type { DirectionType } from '../config/constants.type.js';
import type Projectile from './projectile.js';
import type Tank from './tank.js';
import type Base from './base.js';

type ExplosiveSprites = readonly (readonly [number, number])[];

interface IExplosiveProps {
  projectile?: Projectile;
  tank?: Tank;
  base?: Base;
  world?: unknown;
}

interface IPositioned {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: DirectionType;
}

export default class Explosive extends GameObject {
  projectile: Projectile | undefined;
  tank: Tank | undefined;
  base: Base | undefined;
  animationFrame: number;
  declare sprites: ExplosiveSprites;

  private _intervalId: ReturnType<typeof setInterval> | null;
  private _timeoutId: ReturnType<typeof setTimeout> | null;

  constructor({ projectile, tank, base, world }: IExplosiveProps) {
    let width = 0;
    let height = 0;
    let sprites: ExplosiveSprites = [];

    if (projectile) {
      width = ExplosiveOption.SMALL_WIDTH;
      height = ExplosiveOption.SMALL_HEIGHT;
      sprites = ExplosiveOption.SPRITES[0];
    } else if (tank || base) {
      width = ExplosiveOption.BIG_WIDTH;
      height = ExplosiveOption.BIG_HEIGHT;
      sprites = ExplosiveOption.SPRITES[1];
    }

    super({ world, x: 0, y: 0, width, height, sprites });

    this.projectile = projectile;
    this.tank = tank;
    this.base = base;

    if (projectile) {
      this.x = this._getStartX(projectile);
      this.y = this._getStartY(projectile);
    }
    if (tank) {
      this.x = tank.x - (this.width >> 1) + (tank.width >> 1);
      this.y = tank.y - (this.height >> 1) + (tank.height >> 1);
    }
    if (base) {
      this.x = base.x - (this.width >> 1) + (base.width >> 1);
      this.y = base.y - (this.height >> 1) + (base.height >> 1);
    }

    this.animationFrame = 0;

    this._changeAnimationFrame = this._changeAnimationFrame.bind(this);
    this._removeExplosive = this._removeExplosive.bind(this);

    this._intervalId = setInterval(this._changeAnimationFrame, 150);
    this._timeoutId = setTimeout(this._removeExplosive, 450);
  }

  private _getStartX(projectile: IPositioned): number {
    switch (projectile.direction) {
      case Direction.UP:
      case Direction.DOWN:
        return projectile.x + (projectile.width >> 1) - (this.width >> 1);
      case Direction.LEFT:
        return projectile.x - (this.width >> 1);
      case Direction.RIGHT:
        return projectile.x + projectile.width - (this.width >> 1);
      default:
        return 0;
    }
  }

  private _getStartY(projectile: IPositioned): number {
    switch (projectile.direction) {
      case Direction.UP:
        return projectile.y - (this.height >> 1);
      case Direction.DOWN:
        return projectile.y + projectile.height - (this.height >> 1);
      case Direction.LEFT:
      case Direction.RIGHT:
        return projectile.y + (projectile.height >> 1) - (this.height >> 1);
      default:
        return 0;
    }
  }

  private _changeAnimationFrame(): void {
    this.animationFrame = (this.animationFrame + 1) % this.sprites.length;
  }

  destroy(): void {
    if (this._intervalId !== null) clearInterval(this._intervalId);
    if (this._timeoutId !== null) clearTimeout(this._timeoutId);
    this._intervalId = null;
    this._timeoutId = null;
  }

  private _removeExplosive(): void {
    this.destroy();
    this.emit(event.object.DESTROYED, this);
  }

  get sprite(): [number, number] {
    return [
      this.sprites[this.animationFrame][0] * WorldOption.UNIT_SIZE,
      this.sprites[this.animationFrame][1] * WorldOption.UNIT_SIZE,
    ];
  }
}
