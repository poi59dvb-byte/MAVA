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

    const startLine = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 2.2, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    startLine.rotation.x = -Math.PI / 2;
    startLine.position.set(this.data.spawnPoint.x, 0.04, this.data.spawnPoint.z + 1.2);
    this.group.add(startLine);

    for (const cp of this.data.checkpoints.filter((_, i) => i % 2 === 1)) {
      const arrow = new THREE.Mesh(
        new THREE.ConeGeometry(0.6, 1.2, 3),
        new THREE.MeshStandardMaterial({ color: 0x61dfff, emissive: 0x143958 }),
      );
      arrow.position.set(cp.x, 0.35, cp.z);
      arrow.rotation.y = Math.atan2(cp.nz, cp.nx) - Math.PI / 2;
      this.group.add(arrow);
    }

    for (const w of this.data.walls) {
      const dx = w.bx - w.ax;
      const dz = w.bz - w.az;
      const len = Math.hypot(dx, dz);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(len, 1.2, 0.8), materials.wall);
      wall.position.set((w.ax + w.bx) / 2, 0.6, (w.az + w.bz) / 2);
      wall.rotation.y = Math.atan2(dz, dx);
      this.group.add(wall);
    }

    const deco = this.data.decorations ?? [];
    if (deco.length > 0) {
      const coneGeo = new THREE.ConeGeometry(0.4, 0.8, 6);
      const coneMat = new THREE.MeshStandardMaterial({ color: 0xff7a54 });
      const cones = new THREE.InstancedMesh(coneGeo, coneMat, deco.length);
      deco.forEach((d, i) => {
        const m = new THREE.Matrix4();
        m.makeTranslation(d.x, 0.4, d.z);
        cones.setMatrixAt(i, m);
      });
      this.group.add(cones);
    }

    return this.group;
  }
}
