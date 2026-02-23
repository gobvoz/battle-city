import GameObject from '../core/game-object.js';
import { WorldOption, IceOption } from '../config/constants.js';

export default class Ice extends GameObject {
  constructor(coordinates: { x: number; y: number }) {
    const options = {
      width: WorldOption.TILE_SIZE,
      height: WorldOption.TILE_SIZE,
      sprites: IceOption.SPRITES,
    };

    super({ ...coordinates, ...options });
  }

  hit(): boolean {
    return false;
  }

  moveThrough(): boolean {
    return false;
  }

  get sprite(): readonly number[] {
    return (this.sprites as readonly (readonly number[])[])[0];
  }
}
