import GameObject from '../core/game-object.js';
import { WorldOption, WaterOption, ObjectType } from '../config/constants.js';
import type { IHittable } from './map.type.js';

export default class Water extends GameObject {
  currentSprite: number;
  private _intervalId: ReturnType<typeof setInterval>;

  constructor(coordinates: { x: number; y: number }) {
    const options = {
      width: WorldOption.TILE_SIZE,
      height: WorldOption.TILE_SIZE,
      sprites: WaterOption.SPRITES,
    };

    super({ ...coordinates, ...options });

    this.currentSprite = 0;

    this._changeAnimationFrame = this._changeAnimationFrame.bind(this);
    this._intervalId = setInterval(this._changeAnimationFrame, 400);
  }

  destroy(): void {
    clearInterval(this._intervalId);
  }

  private _changeAnimationFrame(): void {
    const sprites = this.sprites as readonly unknown[];
    this.currentSprite = sprites.length === this.currentSprite + 1 ? 0 : this.currentSprite + 1;
  }

  hit(_object: IHittable): boolean {
    return false;
  }

  moveThrough(object: IHittable): boolean {
    if (object.type === ObjectType.PROJECTILE) return false;
    return true;
  }

  get sprite(): readonly number[] {
    return (this.sprites as readonly (readonly number[])[])[this.currentSprite];
  }
}
