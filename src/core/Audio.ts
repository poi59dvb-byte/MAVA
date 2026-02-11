import { clamp, lerp } from '../utils/math';

export class AudioSystem {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private driftOsc: OscillatorNode | null = null;
  private driftGain: GainNode | null = null;
  private nitroOsc: OscillatorNode | null = null;
  private nitroGain: GainNode | null = null;
  private _muted = false;
  private _volume = 0.55;

  private ensure(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = this._muted ? 0 : this._volume;
      this.master.connect(this.ctx.destination);
      this.setupLoops();
    }
    return this.ctx;
  }

  private setupLoops(): void {
    if (!this.ctx || !this.master) return;

    this.engineOsc = this.ctx.createOscillator();
    this.engineGain = this.ctx.createGain();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.value = 90;
    this.engineGain.gain.value = 0.0001;
    this.engineOsc.connect(this.engineGain).connect(this.master);
    this.engineOsc.start();

    this.driftOsc = this.ctx.createOscillator();
    this.driftGain = this.ctx.createGain();
    this.driftOsc.type = 'triangle';
    this.driftOsc.frequency.value = 240;
    this.driftGain.gain.value = 0.0001;
    this.driftOsc.connect(this.driftGain).connect(this.master);
    this.driftOsc.start();

    this.nitroOsc = this.ctx.createOscillator();
    this.nitroGain = this.ctx.createGain();
    this.nitroOsc.type = 'square';
    this.nitroOsc.frequency.value = 420;
    this.nitroGain.gain.value = 0.0001;
    this.nitroOsc.connect(this.nitroGain).connect(this.master);
    this.nitroOsc.start();
  }

  setMuted(v: boolean): void {
    this._muted = v;
    this.ensure();
    if (this.master) this.master.gain.value = v ? 0 : this._volume;
  }

  setVolume(v: number): void {
    this._volume = clamp(v, 0, 1);
    this.ensure();
    if (this.master && !this._muted) this.master.gain.value = this._volume;
  }

  click(): void {
    this.beep(520, 0.018, 0.012);
  }
  nitroBurst(): void {
    this.beep(860, 0.035, 0.028);
  }
  collision(): void {
    this.beep(120, 0.05, 0.038);
  }

  update(speed: number, drifting: boolean, nitro: boolean): void {
    this.ensure();
    if (
      !this.engineOsc ||
      !this.engineGain ||
      !this.driftOsc ||
      !this.driftGain ||
      !this.nitroGain ||
      !this.nitroOsc
    )
      return;

    this.engineOsc.frequency.value = lerp(this.engineOsc.frequency.value, 80 + speed * 3.2, 0.15);
    this.engineGain.gain.value = lerp(this.engineGain.gain.value, 0.02 + speed * 0.0004, 0.1);

    this.driftOsc.frequency.value = lerp(this.driftOsc.frequency.value, 200 + speed * 1.6, 0.2);
    this.driftGain.gain.value = lerp(this.driftGain.gain.value, drifting ? 0.03 : 0.0001, 0.2);

    this.nitroOsc.frequency.value = lerp(this.nitroOsc.frequency.value, nitro ? 640 : 420, 0.15);
    this.nitroGain.gain.value = lerp(this.nitroGain.gain.value, nitro ? 0.03 : 0.0001, 0.14);
  }

  beep(freq: number, dur = 0.05, vol = 0.04): void {
    try {
      const ctx = this.ensure();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.value = vol;
      osc.connect(gain).connect(this.master!);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {}
  }
}
