import * as THREE from 'three';

export const materials = {
  road: new THREE.MeshStandardMaterial({ color: 0x243247, roughness: 0.95 }),
  grass: new THREE.MeshStandardMaterial({ color: 0x0e2439, roughness: 1 }),
  wall: new THREE.MeshStandardMaterial({ color: 0x28b9ff, emissive: 0x0a3350, roughness: 0.8 }),
  checkpoint: new THREE.MeshStandardMaterial({ color: 0xff4ed8, emissive: 0x430d38 }),
};
