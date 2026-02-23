export class AudioManager {
  private sounds: Record<string, HTMLAudioElement>;

  constructor() {
    this.sounds = {};
  }

  loadSound(name: string, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = src;
      audio.oncanplaythrough = () => {
        this.sounds[name] = audio;
        resolve();
      };
      audio.onerror = () => reject(`Failed to load sound: ${src}`);
    });
  }

  playSound(name: string): void {
    const sound = this.sounds[name];
    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch(e => {
      console.warn(`Failed to play sound: ${name}`, e);
    });
  }

  stopSound(name: string): void {
    const sound = this.sounds[name];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    } else {
      console.warn(`Sound not found: ${name}`);
    }
  }

  setVolume(name: string, volume: number): void {
    const sound = this.sounds[name];
    if (sound) {
      sound.volume = volume;
    } else {
      console.warn(`Sound not found: ${name}`);
    }
  }

  muteAll(): void {
    for (const name in this.sounds) {
      this.sounds[name].muted = true;
    }
  }

  unmuteAll(): void {
    for (const name in this.sounds) {
      this.sounds[name].muted = false;
    }
  }
}
