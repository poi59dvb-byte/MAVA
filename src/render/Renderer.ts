import * as THREE from 'three';

export class Renderer {
  readonly renderer: THREE.WebGLRenderer;
  readonly camera: THREE.PerspectiveCamera;
  private canvas: HTMLCanvasElement;
  private ro: ResizeObserver | null = null;

  constructor(private root: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'game-canvas';
    this.root.appendChild(this.canvas);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x050912, 1);

    this.camera = new THREE.PerspectiveCamera(62, 1, 0.1, 260);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.root);
  }

  private resize(): void {
    const w = Math.max(1, this.root.clientWidth);
    const h = Math.max(1, this.root.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  render(scene: THREE.Scene): void {
    this.renderer.render(scene, this.camera);
  }
}
