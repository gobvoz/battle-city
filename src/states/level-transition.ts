type Phase = 'closing' | 'showing' | 'opening';

export class LevelTransition {
  private phase: Phase = 'closing';
  private timer = 0;
  private stateReady = false;
  private readonly levelNumber: number;

  private readonly closeDuration = 0.5;
  private readonly minShowDuration = 1.5;
  private readonly openDuration = 0.5;

  onClosed: (() => void) | null = null;
  onDone: (() => void) | null = null;

  constructor(levelNumber: number) {
    this.levelNumber = levelNumber;
  }

  get isFullyClosed(): boolean {
    return this.phase === 'showing';
  }

  markStateReady(): void {
    this.stateReady = true;
  }

  update(deltaTime: number): void {
    this.timer += deltaTime;

    switch (this.phase) {
      case 'closing':
        if (this.timer >= this.closeDuration) {
          this.phase = 'showing';
          this.timer = 0;
          this.onClosed?.();
        }
        break;
      case 'showing':
        if (this.timer >= this.minShowDuration && this.stateReady) {
          this.phase = 'opening';
          this.timer = 0;
        }
        break;
      case 'opening':
        if (this.timer >= this.openDuration) {
          this.onDone?.();
        }
        break;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = ctx.canvas;
    const maxHeight = height / 2;
    let shutterHeight: number;

    switch (this.phase) {
      case 'closing': {
        const progress = Math.min(this.timer / this.closeDuration, 1);
        shutterHeight = progress * maxHeight;
        break;
      }
      case 'showing':
        shutterHeight = maxHeight;
        break;
      case 'opening': {
        const progress = Math.min(this.timer / this.openDuration, 1);
        shutterHeight = (1 - progress) * maxHeight;
        break;
      }
    }

    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, width, shutterHeight);
    ctx.fillRect(0, height - shutterHeight, width, shutterHeight);

    if (this.phase === 'showing') {
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`STAGE ${this.levelNumber}`, width / 2, height / 2);
    }
  }
}
