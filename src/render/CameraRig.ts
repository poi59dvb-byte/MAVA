import * as THREE from 'three';
import { lerp } from '../utils/math';

export class CameraRig {
  private shake = 0;

  constructor(private camera: THREE.PerspectiveCamera) {}

  addShake(amount: number): void {
    this.shake = Math.min(1, this.shake + amount);
  }

  follow(
    target: THREE.Vector3,
    velocity: THREE.Vector3,
    heading: number,
    speed: number,
    nitro: boolean,
  ): void {
    const dist = 14 + Math.min(5.2, speed * 0.018);
    const lead = Math.min(3.4, velocity.length() * 0.06);
    const tx = target.x + velocity.x * 0.07 - Math.cos(heading) * (dist - lead);
    const tz = target.z + velocity.z * 0.07 - Math.sin(heading) * (dist - lead);

    this.camera.position.x = lerp(this.camera.position.x, tx, 0.1);
    this.camera.position.y = lerp(this.camera.position.y, 10 + speed * 0.005, 0.1);
    this.camera.position.z = lerp(this.camera.position.z, tz, 0.1);

    this.shake = Math.max(0, this.shake - 0.04);
    const sx = (Math.random() - 0.5) * this.shake * 0.18;
    const sz = (Math.random() - 0.5) * this.shake * 0.18;

    this.camera.lookAt(
      target.x + Math.cos(heading) * 5 + sx,
      0.9,
      target.z + Math.sin(heading) * 5 + sz,
    );
    this.camera.fov = lerp(this.camera.fov, nitro ? 70 : 62, 0.12);
    this.camera.updateProjectionMatrix();
  }
}
