export class AudioSystem {
  private ctx: AudioContext | null = null;

  private ensure(): AudioContext {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    return this.ctx;
  }

  beep(freq: number, dur = 0.05, vol = 0.04): void {
    try {
      const ctx = this.ensure();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.value = vol;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch {}
  }

  nitro(): void { this.beep(920, 0.03, 0.03); }
  drift(): void { this.beep(240, 0.012, 0.01); }
  collision(): void { this.beep(130, 0.04, 0.03); }
}
