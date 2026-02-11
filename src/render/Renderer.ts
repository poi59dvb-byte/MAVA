import * as THREE from 'three';

export class Renderer {
  readonly instance: THREE.WebGLRenderer;
  readonly camera: THREE.PerspectiveCamera;

  constructor(root: HTMLElement) {
    this.instance = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.instance.setSize(root.clientWidth, root.clientHeight);
    this.instance.setClearColor(0x060b18);
    this.camera = new THREE.PerspectiveCamera(62, root.clientWidth / root.clientHeight, 0.1, 1500);
    root.appendChild(this.instance.domElement);

    window.addEventListener('resize', () => {
      this.camera.aspect = root.clientWidth / root.clientHeight;
      this.camera.updateProjectionMatrix();
      this.instance.setSize(root.clientWidth, root.clientHeight);
    });
  }

  render(scene: THREE.Scene): void {
    this.instance.render(scene, this.camera);
  }
}
