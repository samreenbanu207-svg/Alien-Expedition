// Web Audio API Procedural Sound Synthesizer for Alien Expedition

class SoundFXManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private roverOscillator: OscillatorNode | null = null;
  private roverGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private initialized: boolean = false;

  public init() {
    if (this.initialized) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.initialized = true;
      this.startWindAmbience();
      this.initRoverMotor();
    } catch {
      // Audio context might fail or be blocked by browser policies
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx) {
      if (muted && this.ctx.state === 'running') {
        this.ctx.suspend();
      } else if (!muted && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private startWindAmbience() {
    if (!this.ctx) return;
    try {
      // Pink/Brown noise generator for atmospheric alien wind
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 280;

      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = 0.08;

      whiteNoise.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);
      whiteNoise.start();
    } catch {
      // ignore
    }
  }

  private initRoverMotor() {
    if (!this.ctx) return;
    try {
      this.roverOscillator = this.ctx.createOscillator();
      this.roverOscillator.type = 'triangle';
      this.roverOscillator.frequency.value = 45; // Idle rumble

      this.roverGain = this.ctx.createGain();
      this.roverGain.gain.value = 0.0; // Starts silent until moving

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;

      this.roverOscillator.connect(filter);
      filter.connect(this.roverGain);
      this.roverGain.connect(this.ctx.destination);
      this.roverOscillator.start();
    } catch {
      // ignore
    }
  }

  public updateRoverSound(speed: number, isMoving: boolean) {
    if (!this.ctx || this.isMuted || !this.roverOscillator || !this.roverGain) return;
    try {
      const now = this.ctx.currentTime;
      if (isMoving && speed > 0.1) {
        const targetFreq = 50 + speed * 15;
        this.roverOscillator.frequency.setTargetAtTime(targetFreq, now, 0.1);
        this.roverGain.gain.setTargetAtTime(0.045 + Math.min(speed * 0.015, 0.06), now, 0.1);
      } else {
        this.roverOscillator.frequency.setTargetAtTime(40, now, 0.2);
        this.roverGain.gain.setTargetAtTime(0.01, now, 0.2);
      }
    } catch {
      // ignore
    }
  }

  public playClick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  }

  public playScanBeep() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1400, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch {
      // ignore
    }
  }

  public playDiscoveryChime() {
    if (!this.ctx || this.isMuted) return;
    try {
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 (Scientific discovery chime)
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const startTime = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    } catch {
      // ignore
    }
  }

  public playWarning() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.setValueAtTime(280, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {
      // ignore
    }
  }
}

export const soundFX = new SoundFXManager();
