import type { TrackData } from '../utils/types';

export interface CollisionResult {
  collided: boolean;
  normalX: number;
  normalZ: number;
}

export class Collision {
  constructor(private track: TrackData) {}

  resolveCircle(x: number, z: number, radius: number): CollisionResult {
    for (const wall of this.track.walls) {
      const vx = wall.bx - wall.ax;
      const vz = wall.bz - wall.az;
      const wx = x - wall.ax;
      const wz = z - wall.az;
      const t = Math.max(0, Math.min(1, (wx * vx + wz * vz) / (vx * vx + vz * vz)));
      const px = wall.ax + vx * t;
      const pz = wall.az + vz * t;
      const dx = x - px;
      const dz = z - pz;
      const dist = Math.hypot(dx, dz);
      if (dist < radius + 0.35) {
        const n = dist || 1;
        return { collided: true, normalX: dx / n, normalZ: dz / n };
      }
    }
    return { collided: false, normalX: 0, normalZ: 0 };
  }
}
