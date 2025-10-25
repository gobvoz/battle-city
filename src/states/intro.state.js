export class IntroState {
  constructor(game) {
    this.game = game;

    this.timer = 0;
    this.duration = 5; // Intro lasts for 3 seconds
    this.transitionTime = 0.5; // 0.5 seconds transition
  }

  start(levelNumber) {
    if (this.game.DEBUG) console.log('Entering Intro State');

    this.levelNumber = levelNumber;
    this.timer = 0;
  }

  update(deltaTime) {
    this.timer += deltaTime;

    if (this.timer >= this.duration) {
      this.exit();
      this.game.events.emit('intro:complete');
    }
  }

  render(ctx) {
    const { width, height } = ctx.canvas;

    // Рассчитываем прогресс от 0 до 1
    const t = Math.min(this.timer / this.duration, 1);

    let shutterHeight = 0; // высота серых прямоугольников
    const maxHeight = height / 2;

    if (t < this.transitionTime / this.duration) {
      // стадия закрытия
      const progress = t / (this.transitionTime / this.duration);
      shutterHeight = progress * maxHeight;
    } else if (t > 1 - this.transitionTime / this.duration) {
      // стадия открытия
      const progress = (1 - t) / (this.transitionTime / this.duration);
      shutterHeight = progress * maxHeight;
    } else {
      // полностью закрыто
      shutterHeight = maxHeight;
    }

    // очищаем экран
    //ctx.clearRect(0, 0, width, height);

    // рисуем фон
    //ctx.fillStyle = 'black';
    //ctx.fillRect(0, 0, width, height);

    // рисуем шторки
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, width, shutterHeight); // верхняя шторка
    ctx.fillRect(0, height - shutterHeight, width, shutterHeight); // нижняя шторка

    // текст показываем только если шторки закрылись
    if (t > this.transitionTime / this.duration && t < 1 - this.transitionTime / this.duration) {
      ctx.fillStyle = 'black';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`LEVEL ${this.levelNumber}`, width / 2, height / 2);
    }
  }

  exit() {
    if (this.game.DEBUG) console.log('Exiting Intro State');
  }
}
