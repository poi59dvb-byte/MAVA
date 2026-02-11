import type { TrackData } from '../utils/types';

export class Checkpoints {
  current = 0;
  passed = new Set<number>();
  lap = 1;
  lastCheckpoint = 0;
  private prevStartSide = -1;

  constructor(private track: TrackData) {}

  reset(): void {
    this.current = 0;
    this.passed.clear();
    this.lap = 1;
    this.lastCheckpoint = 0;
    this.prevStartSide = -1;
  }

  update(x: number, z: number, heading: number): { lapCompleted: boolean; finished: boolean } {
    const cp = this.track.checkpoints[this.current];
    const side = (x - cp.x) * cp.nx + (z - cp.z) * cp.nz;
    if (Math.abs(side) < cp.radius) {
      this.passed.add(this.current);
      this.lastCheckpoint = this.current;
      this.current = (this.current + 1) % this.track.checkpoints.length;
    }

    const start = this.track.checkpoints[0];
    const startSide = (x - start.x) * start.nx + (z - start.z) * start.nz;
    const crossed = this.prevStartSide < 0 && startSide >= 0;
    this.prevStartSide = startSide;

    const facing = Math.cos(heading) * start.nx + Math.sin(heading) * start.nz > 0;
    if (crossed && facing && this.passed.size >= this.track.checkpoints.length - 1) {
      this.lap += 1;
      this.passed.clear();
      return { lapCompleted: true, finished: this.lap > this.track.laps };
    }

    return { lapCompleted: false, finished: false };
  }
}
