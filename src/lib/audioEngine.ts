/**
 * AudioEngine — a Web Audio API based ambient flute/music synth.
 * Generates a gentle flute-like melody using oscillators + filters + reverb,
 * plus a soft pad drone. No external audio files needed.
 */

type NoteName = string;

const MELODY: NoteName[] = [
  'E5', 'G5', 'A5', 'B5', 'A5', 'G5', 'E5', 'D5',
  'E5', 'G5', 'A5', 'C6', 'B5', 'A5', 'G5', 'E5',
  'D5', 'E5', 'G5', 'F5', 'E5', 'D5', 'C5', 'D5',
  'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5', 'D5',
];

const NOTE_FREQ: Record<string, number> = {
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5, D6: 1174.66, E6: 1318.51,
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private padOsc: OscillatorNode[] = [];
  private padGain: GainNode | null = null;
  private melodyTimer: number | null = null;
  private noteIndex = 0;
  private isPlaying = false;
  private volume = 0.5;

  private ensureCtx() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.ctx.destination);

    // Reverb
    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = this.makeReverbBuffer(2.5, 2.0);
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.value = 0.35;
    this.reverbNode.connect(this.reverbGain);
    this.reverbGain.connect(this.masterGain);

    this.dryGain = this.ctx.createGain();
    this.dryGain.gain.value = 0.7;
    this.dryGain.connect(this.masterGain);
  }

  private makeReverbBuffer(duration: number, decay: number): AudioBuffer {
    const ctx = this.ctx!;
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * duration);
    const buf = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return buf;
  }

  private playFluteNote(freq: number, time: number, duration: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = freq;
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2.005; // slight detune for warmth

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.linearRampToValueAtTime(2200, time + 0.08);
    filter.frequency.linearRampToValueAtTime(900, time + duration);
    filter.Q.value = 3;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.22, time + 0.06);
    gain.gain.linearRampToValueAtTime(0.18, time + duration * 0.6);
    gain.gain.linearRampToValueAtTime(0, time + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.dryGain!);
    gain.connect(this.reverbNode!);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + duration + 0.05);
    osc2.stop(time + duration + 0.05);
  }

  private startPad() {
    const ctx = this.ctx!;
    this.padGain = ctx.createGain();
    this.padGain.gain.value = 0.0;
    this.padGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 4);
    this.padGain.connect(this.dryGain!);
    this.padGain.connect(this.reverbNode!);

    const padFreqs = [130.81, 196.0, 261.63]; // C3, G3, C4
    padFreqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.5 : i === 1 ? 0.3 : 0.25;
      osc.connect(g);
      g.connect(this.padGain!);
      osc.start();
      this.padOsc.push(osc);
    });
  }

  private scheduleMelody() {
    if (!this.ctx || !this.isPlaying) return;
    const note = MELODY[this.noteIndex % MELODY.length];
    const freq = NOTE_FREQ[note] || 523.25;
    const time = this.ctx.currentTime + 0.02;
    const dur = 0.9 + Math.random() * 0.4;
    this.playFluteNote(freq, time, dur);
    this.noteIndex++;
    this.melodyTimer = window.setTimeout(() => this.scheduleMelody(), dur * 1000 * 0.85);
  }

  play() {
    this.ensureCtx();
    if (this.ctx!.state === 'suspended') this.ctx!.resume();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startPad();
    this.scheduleMelody();
  }

  pause() {
    this.isPlaying = false;
    if (this.melodyTimer) { clearTimeout(this.melodyTimer); this.melodyTimer = null; }
    this.padOsc.forEach(o => { try { o.stop(); } catch { /* */ } });
    this.padOsc = [];
    if (this.padGain && this.ctx) {
      this.padGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    }
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.1);
    }
  }

  getVolume() { return this.volume; }
  getIsPlaying() { return this.isPlaying; }

  // One-shot flute chirp for UI feedback
  chirp(freq: number = 880) {
    this.ensureCtx();
    if (this.ctx!.state === 'suspended') this.ctx!.resume();
    const time = this.ctx!.currentTime;
    this.playFluteNote(freq, time, 0.5);
  }
}

export const audioEngine = new AudioEngine();
