import GameObject from '../core/game-object.js';
import { event } from '../config/events.js';
import { WorldOption, BrickWallOption, ObjectType } from '../config/constants.js';
import type { IHittable } from './map.type.js';

export default class BrickWall extends GameObject {
  currentSprite: number;

  constructor(coordinates: { x: number; y: number }) {
    const options = {
      width: WorldOption.TILE_SIZE,
      height: WorldOption.TILE_SIZE,
      sprites: BrickWallOption.SPRITES,
    };

    super({ ...coordinates, ...options });

    this.currentSprite = 0;
  }

  hit(object: IHittable): boolean {
    if (object.type !== ObjectType.PROJECTILE) return false;

    if (this.currentSprite !== 0 || object.power > 1) {
      this.emit(event.object.DESTROYED, this);
      return true;
    }

    this.currentSprite = object.direction;
    return true;
  }

  moveThrough(): boolean {
    return true;
  }

  get sprite(): readonly number[] {
    return (this.sprites as readonly (readonly number[])[])[this.currentSprite];
  }
}
