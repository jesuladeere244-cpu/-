const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  levelUp: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  eat: 'https://assets.mixkit.co/active_storage/sfx/1093/1093-preview.mp3',
  shower: 'https://assets.mixkit.co/active_storage/sfx/1145/1145-preview.mp3',
  play: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  evolution: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  study: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  sleep: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
};

class AudioService {
  private muted: boolean = false;
  private audios: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    // Preload sounds
    if (typeof window !== 'undefined') {
      Object.entries(SOUNDS).forEach(([key, url]) => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.audios.set(key, audio);
      });
    }
  }

  play(soundName: keyof typeof SOUNDS) {
    if (this.muted) return;
    const audio = this.audios.get(soundName);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.warn('Audio play failed:', e));
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

export const audioService = new AudioService();
