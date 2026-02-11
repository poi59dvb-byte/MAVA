import * as THREE from 'three';
import type { CarState, CarStats } from '../utils/types';

export class Car {
  readonly mesh: THREE.Group;

  constructor(private stats: CarStats) {
    this.mesh = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.5, 2.2),
      new THREE.MeshStandardMaterial({ color: stats.visual.color }),
    );
    body.position.y = 0.35;
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.1, 1.6),
      new THREE.MeshStandardMaterial({ color: stats.visual.accent }),
    );
    stripe.position.set(0.15, 0.62, 0);
    this.mesh.add(body, stripe);
  }

  sync(state: CarState): void {
    this.mesh.position.copy(state.position);
    this.mesh.rotation.y = -state.heading + Math.PI / 2;
  }
}
