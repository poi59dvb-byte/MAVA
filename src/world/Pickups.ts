import * as THREE from 'three';
import type { TrackData } from '../utils/types';

export class Pickups {
  items: Array<{ x: number; z: number; active: boolean }> = [];
  private mesh = new THREE.Group();

  constructor(private track: TrackData) {
    this.items = (track.pickups ?? []).map((p) => ({ x: p.x, z: p.z, active: true }));
    this.items.forEach((p) => {
      const m = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.4),
        new THREE.MeshBasicMaterial({ color: 0x47f1ff }),
      );
      m.position.set(p.x, 0.8, p.z);
      this.mesh.add(m);
    });
  }

  attach(scene: THREE.Scene): void {
    scene.add(this.mesh);
  }

  collect(x: number, z: number): number {
    let gain = 0;
    this.items.forEach((item, i) => {
      if (!item.active) return;
      if (Math.hypot(x - item.x, z - item.z) < 1.1) {
        item.active = false;
        const child = this.mesh.children[i];
        if (child) child.visible = false;
        gain += 0.18;
      }
    });
    return gain;
  }
}
