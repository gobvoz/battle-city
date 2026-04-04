import GameObject from '../core/game-object.js';
import { WorldOption, PowerUpOption } from '../config/constants.js';
import type { PowerUpTypeValue } from '../config/constants.type.js';

export default class PowerUp extends GameObject {
  powerUpType: PowerUpTypeValue;
  private _blinkTimer = 0;
  visible = true;

  constructor({ x, y, type }: { x: number; y: number; type: PowerUpTypeValue }) {
    super({
      x,
      y,
      width: PowerUpOption.WIDTH,
      height: PowerUpOption.HEIGHT,
      sprites: PowerUpOption.SPRITES,
    });

    this.powerUpType = type;
  }

  update(deltaTime: number): void {
    this._blinkTimer += deltaTime;

    if (this._blinkTimer >= PowerUpOption.BLINK_INTERVAL) {
      this._blinkTimer = 0;
      this.visible = !this.visible;
    }
  }

  get sprite(): [number, number] {
    const s = PowerUpOption.SPRITES[this.powerUpType];
    return [s[0] * WorldOption.UNIT_SIZE, s[1] * WorldOption.UNIT_SIZE];
  }
}
