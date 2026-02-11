import * as THREE from 'three';

export const materials = {
  road: new THREE.MeshStandardMaterial({ color: 0x243247, roughness: 0.94 }),
  grass: new THREE.MeshStandardMaterial({ color: 0x0b1a30, roughness: 1 }),
  wall: new THREE.MeshStandardMaterial({ color: 0x35dbff, emissive: 0x102f4d, roughness: 0.76 }),
  checkpoint: new THREE.MeshStandardMaterial({ color: 0xff5ed8, emissive: 0x4d1846 }),
};
