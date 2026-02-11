import * as THREE from 'three';

export function createLighting(scene: THREE.Scene): void {
  const amb = new THREE.AmbientLight(0x99bbff, 0.55);
  const dir = new THREE.DirectionalLight(0xffffff, 0.85);
  dir.position.set(8, 18, 5);
  scene.add(amb, dir);
}
