import GameObject from '../core/game-object.js';
import { event } from '../config/events.js';
import { BaseOption, ObjectType } from '../config/constants.js';
import type { ObjectTypeValue } from '../config/constants.type.js';

type BaseSprites = Record<0 | 1, readonly [number, number]>;

export default class Base extends GameObject {
  destroyed: boolean;
  declare sprites: BaseSprites;

  constructor({ world }: { world?: unknown }) {
    super({
      world,
      x: BaseOption.START_X,
      y: BaseOption.START_Y,
      width: BaseOption.WIDTH,
      height: BaseOption.HEIGHT,
      sprites: BaseOption.SPRITES,
    });

    this.destroyed = false;
  }

  update(): void {
    // do nothing
  }

  get sprite(): [number, number] {
    const key = Number(this.destroyed) as 0 | 1;
    return [this.sprites[key][0] * this.width, this.sprites[key][1] * this.height];
  }

  hit(object: { objectType: ObjectTypeValue }): boolean {
    if (object.objectType !== ObjectType.PROJECTILE) return false;

    this.emit(event.object.DESTROYED, this);
    this.destroyed = true;
    return true;
  }

  moveThrough(): boolean {
    return true;
  }
}
