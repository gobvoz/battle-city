export class AudioManager {
  constructor() {
    this.sounds = {};
  }

  loadSound(name, src) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = src;
      audio.onload = () => {
        this.sounds[name] = audio;
        resolve();
      };
      audio.onerror = () => reject(`Failed to load sound: ${src}`);
    });
  }

  playSound(name) {
    const sound = this.sounds[name];
    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch(e => {
      console.warn(`Failed to play sound: ${name}`, e);
    });
  }

  stopSound(name) {
    const sound = this.sounds[name];

    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    } else {
      console.warn(`Sound not found: ${name}`);
    }
  }

  setVolume(name, volume) {
    const sound = this.sounds[name];
    if (sound) {
      sound.volume = volume;
    } else {
      console.warn(`Sound not found: ${name}`);
    }
  }

  muteAll() {
    for (const name in this.sounds) {
      this.sounds[name].muted = true;
    }
  }

  unmuteAll() {
    for (const name in this.sounds) {
      this.sounds[name].muted = false;
    }
  }
}
