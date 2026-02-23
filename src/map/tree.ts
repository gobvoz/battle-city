import GameObject from '../core/game-object.js';
import { WorldOption, TreeOption } from '../config/constants.js';

export default class Tree extends GameObject {
  zIndex: number;

  constructor(coordinates: { x: number; y: number }) {
    const options = {
      width: WorldOption.TILE_SIZE,
      height: WorldOption.TILE_SIZE,
      sprites: TreeOption.SPRITES,
    };

    super({ ...coordinates, ...options });

    this.zIndex = TreeOption.Z_INDEX;
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
