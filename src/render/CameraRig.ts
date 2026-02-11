import * as THREE from 'three';
import { lerp } from '../utils/math';

export class CameraRig {
  constructor(private camera: THREE.PerspectiveCamera) {}

  follow(target: THREE.Vector3, heading: number, speed: number, nitro: boolean): void {
    const dist = 14 + Math.min(4.5, speed * 0.018);
    const boost = nitro ? 1.2 : 0;
    const tx = target.x - Math.cos(heading) * (dist + boost);
    const tz = target.z - Math.sin(heading) * (dist + boost);

    this.camera.position.x = lerp(this.camera.position.x, tx, 0.1);
    this.camera.position.y = lerp(this.camera.position.y, 9.5 + speed * 0.006, 0.1);
    this.camera.position.z = lerp(this.camera.position.z, tz, 0.1);

    this.camera.lookAt(target.x + Math.cos(heading) * 5, 0.8, target.z + Math.sin(heading) * 5);
    this.camera.fov = lerp(this.camera.fov, nitro ? 70 : 62, 0.12);
    this.camera.updateProjectionMatrix();
  }
}
