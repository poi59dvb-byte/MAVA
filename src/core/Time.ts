import { clamp } from '../utils/math';

export class Time {
  delta = 1 / 60;
  elapsed = 0;
  fps = 60;
  private last = performance.now();

  tick(now: number): void {
    const raw = (now - this.last) / 1000;
    this.last = now;
    this.delta = clamp(raw, 1 / 240, 1 / 30);
    this.elapsed += this.delta;
    this.fps = 1 / this.delta;
  }
}
