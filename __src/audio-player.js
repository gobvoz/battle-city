export default class AudioPlayer {
  constructor(soundsConfig = []) {
    this.sounds = {}; // { name: { buffer, isEffect } }
    this.muted = false;
    this.volume = 1.0;

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Глобальный gain
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = this.volume;

    // Отдельный gain для фонового звука
    this.bgGain = this.audioContext.createGain();
    this.bgGain.connect(this.masterGain);
    this.bgGain.gain.value = 1.0;

    this.currentBackground = null;
    this.currentBackgroundSource = null;

    this.init(soundsConfig);
  }

  async loadSound(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  async init(soundsConfig) {
    const promises = soundsConfig.map(async ({ name, src, isEffect = false }) => {
      const buffer = await this.loadSound(src);
      this.sounds[name] = { buffer, isEffect };
    });
    return Promise.all(promises);
  }

  play(name) {
    if (this.muted) return;

    const entry = this.sounds[name];
    if (!entry) {
      console.warn(`Sound "${name}" not found`);
      return;
    }

    if (entry.isEffect) {
      this._playEffect(entry.buffer);
    } else {
      this._playBackground(name, entry.buffer);
    }
  }

  _playBackground(name, buffer) {
    if (this.currentBackground === name) return; // тот же фон уже играет

    // Остановить предыдущий фон
    if (this.currentBackgroundSource) {
      this.currentBackgroundSource.stop();
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.bgGain);
    source.start(0);

    this.currentBackground = name;
    this.currentBackgroundSource = source;
  }

  _playEffect(buffer) {
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = false;

    // Эффект подключается через отдельный gain
    const effectGain = this.audioContext.createGain();
    effectGain.connect(this.masterGain);
    source.connect(effectGain);

    // Заглушаем фон на время эффекта
    if (this.currentBackgroundSource) {
      this.bgGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    }

    source.onended = () => {
      // Возвращаем фон
      if (this.currentBackgroundSource) {
        this.bgGain.gain.setValueAtTime(1.0, this.audioContext.currentTime);
      }
    };

    source.start(0);
  }

  stop(name) {
    const entry = this.sounds[name];
    if (!entry) return;

    if (!entry.isEffect && this.currentBackgroundSource && this.currentBackground === name) {
      this.currentBackgroundSource.stop();
      this.currentBackgroundSource = null;
      this.currentBackground = null;
    }
  }

  setVolume(level) {
    this.volume = Math.min(Math.max(level, 0), 1);
    this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
  }

  mute() {
    this.muted = true;
    this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
  }

  unmute() {
    this.muted = false;
    this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
  }
}
