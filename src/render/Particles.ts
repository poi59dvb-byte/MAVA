import * as THREE from 'three';

export class Particles {
  private points: THREE.Points;
  private pos: Float32Array;

  constructor(scene: THREE.Scene) {
    this.pos = new Float32Array(90);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x55e8ff, size: 0.22, transparent: true, opacity: 0.65 });
    this.points = new THREE.Points(geo, mat);
    scene.add(this.points);
  }

  spawn(x: number, z: number): void {
    for (let i = this.pos.length - 3; i >= 3; i -= 3) {
      this.pos[i] = this.pos[i - 3];
      this.pos[i + 1] = this.pos[i - 2];
      this.pos[i + 2] = this.pos[i - 1];
    }
    this.pos[0] = x;
    this.pos[1] = 0.12;
    this.pos[2] = z;
    (this.points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }
}
