import { EventEmitter } from './event-emitter.js';

export interface GameObjectOptions {
  world?: unknown;
  x: number;
  y: number;
  width: number;
  height: number;
  sprites: unknown;
}

export default class GameObject extends EventEmitter {
  world: unknown;
  realX: number;
  realY: number;
  x: number;
  y: number;
  width: number;
  height: number;
  sprites: unknown;

  constructor({ world, x, y, width, height, sprites }: GameObjectOptions) {
    super();

    this.world = world;

    this.realX = x;
    this.realY = y;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.sprites = sprites;
  }

  get top(): number {
    return this.y;
  }
  get bottom(): number {
    return this.y + this.height;
  }
  get left(): number {
    return this.x;
  }
  get right(): number {
    return this.x + this.width;
  }

  update(_deltaTime?: number, _activeKeys?: Set<string>): void {}

  hit(_object: unknown): boolean {
    return true;
  }

  moveThrough(_object: unknown): boolean {
    return true;
  }
}
