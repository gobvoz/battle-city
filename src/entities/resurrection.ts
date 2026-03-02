import GameObject from '../core/game-object.js';
import { event } from '../config/events.js';
import { ResurrectionOption } from '../config/constants.js';
import type { TankTypeValue } from '../config/constants.type.js';
import type { TankOptions } from './entities.type.js';

type ResurrectionSprites = readonly (readonly [number, number])[];

export default class Resurrection extends GameObject {
  tankType: TankTypeValue;
  tankOptions: TankOptions;
  animationFrame: number;
  declare sprites: ResurrectionSprites;

  private _intervalId: ReturnType<typeof setInterval> | null;
  private _timeoutId: ReturnType<typeof setTimeout> | null;

  constructor({
    x,
    y,
    tankType,
    options: tankOptions,
    world,
  }: {
    x: number;
    y: number;
    tankType: TankTypeValue;
    options: TankOptions;
    world?: unknown;
  }) {
    super({
      world,
      x,
      y,
      width: ResurrectionOption.WIDTH,
      height: ResurrectionOption.HEIGHT,
      sprites: ResurrectionOption.SPRITES,
    });

    this.tankType = tankType;
    this.tankOptions = tankOptions;

    this.animationFrame = 0;

    this._changeAnimationFrame = this._changeAnimationFrame.bind(this);
    this._removeResurrection = this._removeResurrection.bind(this);

    this._intervalId = setInterval(
      this._changeAnimationFrame,
      ResurrectionOption.ANIMATION_INTERVAL,
    );
    this._timeoutId = setTimeout(this._removeResurrection, ResurrectionOption.ANIMATION_TIME);
  }

  private _changeAnimationFrame(): void {
    this.animationFrame = this.animationFrame + 1;

    if (this.animationFrame === this.sprites.length) {
      this.animationFrame = 0;
    }
  }

  destroy(): void {
    if (this._intervalId !== null) clearInterval(this._intervalId);
    if (this._timeoutId !== null) clearTimeout(this._timeoutId);
    this._intervalId = null;
    this._timeoutId = null;
  }

  private _removeResurrection(): void {
    this.destroy();
    this.emit(event.object.DESTROYED, this);
  }

  get sprite(): [number, number] {
    return [
      this.sprites[this.animationFrame][0] * this.width,
      this.sprites[this.animationFrame][1] * this.height,
    ];
  }
}
