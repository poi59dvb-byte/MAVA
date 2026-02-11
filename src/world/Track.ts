import * as THREE from 'three';
import type { TrackData } from '../utils/types';
import { materials } from '../render/Materials';

export class Track {
  group = new THREE.Group();
  constructor(public data: TrackData) {}

  build(): THREE.Group {
    const road = new THREE.Mesh(new THREE.TorusGeometry(36, 8, 12, 64), materials.road);
    road.rotation.x = Math.PI / 2;
    road.position.y = 0.02;

    const grass = new THREE.Mesh(new THREE.CircleGeometry(75, 36), materials.grass);
    grass.rotation.x = -Math.PI / 2;

    this.group.add(grass, road);

    for (const w of this.data.walls) {
      const dx = w.bx - w.ax;
      const dz = w.bz - w.az;
      const len = Math.hypot(dx, dz);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(len, 1.2, 0.8), materials.wall);
      wall.position.set((w.ax + w.bx) / 2, 0.6, (w.az + w.bz) / 2);
      wall.rotation.y = Math.atan2(dz, dx);
      this.group.add(wall);
    }

    return this.group;
  }
}
