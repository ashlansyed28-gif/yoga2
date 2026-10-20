/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Ambient Sound Sanctuary
// Generates authentic Tibetan singing bowls, meditation chimes, and soft drone

class SoundSanctuaryEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;
  private analyser: AnalyserNode | null = null;

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.85;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    if (!this.analyser) {
      this.getContext();
    }
    return this.analyser;
  }

  public playSingingBowl(baseFreq: number = 216): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 5.5;

    // Frequencies characteristic of Tibetan singing bowl modal resonance
    const partials = [
      { freq: baseFreq, gainRatio: 0.5 },
      { freq: baseFreq * 2.76, gainRatio: 0.3 },
      { freq: baseFreq * 5.4, gainRatio: 0.15 },
      { freq: baseFreq * 8.9, gainRatio: 0.05 }
    ];

    const masterBowlGain = ctx.createGain();
    masterBowlGain.gain.setValueAtTime(0.001, now);
    masterBowlGain.gain.linearRampToValueAtTime(0.35, now + 0.08);
    masterBowlGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    masterBowlGain.connect(ctx.destination);

    partials.forEach(({ freq, gainRatio }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle pitch drift to simulate organic metal resonance
      osc.frequency.linearRampToValueAtTime(freq * 0.998, now + duration);

      oscGain.gain.setValueAtTime(gainRatio, now);
      osc.connect(oscGain);
      oscGain.connect(masterBowlGain);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  public playZenTingsha(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 3.5;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.2, now + 0.02);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    masterGain.connect(ctx.destination);

    [1760, 3520, 5280].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      const g = ctx.createGain();
      g.gain.setValueAtTime(idx === 0 ? 0.6 : 0.2, now);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration);
    });
  }

  public startAmbientPrana(): void {
    if (this.isAmbientPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.08, now + 2);

      // Warm low frequency foundation (108 Hz - OM pitch)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(108, now);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(216, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      this.isAmbientPlaying = true;
    } catch {
      // Audio autoplay gracefully handled
    }
  }

  public stopAmbientPrana(): void {
    if (!this.ambientGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 1.5);
      setTimeout(() => {
        this.isAmbientPlaying = false;
      }, 1600);
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  public playMeditationBell(pitch: number = 432): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 7.0;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    masterGain.connect(ctx.destination);

    // Warm pure harmonic blend (432Hz Sacred A tone)
    [pitch, pitch * 2, pitch * 3.01, pitch * 4.15].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(idx === 0 ? 0.6 : 0.15 / idx, now);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration);
    });
  }

  public playEmergencySighTone(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 6.0;

    // Deep soothing theta-frequency ground tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(136.1, now); // 136.1 Hz OM / Earth frequency

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  public startOmMusic(fundamentalFreq: number = 136.1, breathCycleSec: number = 10): void {
    if (this.isAmbientPlaying) {
      this.stopAmbientPrana();
    }
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.09, now + 2.5);

      // Primary warm vocal chanting oscillators (fundamental + harmonics)
      const oscSa1 = ctx.createOscillator();
      oscSa1.type = 'sine';
      oscSa1.frequency.setValueAtTime(fundamentalFreq, now);

      const oscSa2 = ctx.createOscillator();
      oscSa2.type = 'triangle';
      oscSa2.frequency.setValueAtTime(fundamentalFreq, now);

      // Fifth harmonic (Pa at 1.5x) - divine harmonizer
      const oscPa = ctx.createOscillator();
      oscPa.type = 'sine';
      oscPa.frequency.setValueAtTime(fundamentalFreq * 1.5, now);

      // Octave harmonic (2x) for vocal formant resonance
      const oscOctave = ctx.createOscillator();
      oscOctave.type = 'sine';
      oscOctave.frequency.setValueAtTime(fundamentalFreq * 2, now);

      // Slow breath LFO for cyclical natural chant swelling
      const lfoFreq = 1 / Math.max(4, breathCycleSec);
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(lfoFreq, now);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.035, now);
      lfo.connect(lfoGain.gain);

      // Warm vocal lowpass formant filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(500, fundamentalFreq * 2.8), now);
      filter.Q.setValueAtTime(2.2, now);

      const blendGain = ctx.createGain();
      blendGain.gain.setValueAtTime(0.7, now);

      oscSa1.connect(filter);
      oscSa2.connect(filter);
      oscPa.connect(filter);
      oscOctave.connect(filter);

      filter.connect(blendGain);
      blendGain.connect(this.ambientGain);

      if (this.analyser) {
        this.ambientGain.connect(this.analyser);
      }
      this.ambientGain.connect(ctx.destination);

      oscSa1.start(now);
      oscSa2.start(now);
      oscPa.start(now);
      oscOctave.start(now);
      lfo.start(now);

      this.isAmbientPlaying = true;
    } catch {
      // Audio autoplay handled
    }
  }

  public startNatureSoundscape(type: 'stream' | 'rain' | 'tanpura'): void {
    if (this.isAmbientPlaying) {
      this.stopAmbientPrana();
    }
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.06, now + 2);

      if (type === 'tanpura') {
        // Tanpura root & fifth drone: Sa (108Hz) & Pa (162Hz) + octaves
        [108, 162, 216].forEach((f) => {
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, now);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(280, now);

          osc.connect(filter);
          filter.connect(this.ambientGain!);
          osc.start();
        });
      } else {
        // Filtered soothing pink/white noise simulation for rain or stream
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 2.8;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(type === 'rain' ? 650 : 380, now);
        filter.Q.setValueAtTime(type === 'rain' ? 1.2 : 0.8, now);

        whiteNoise.connect(filter);
        filter.connect(this.ambientGain);
        whiteNoise.start();
      }

      this.ambientGain.connect(ctx.destination);
      this.isAmbientPlaying = true;
    } catch {
      // Audio autoplay handled
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, now);
    }
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }
}

export const soundSanctuary = new SoundSanctuaryEngine();
