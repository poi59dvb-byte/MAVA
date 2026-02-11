import * as THREE from 'three';
import { Time } from './Time';
import { Input } from './Input';
import { AudioSystem } from './Audio';
import { Debug } from './Debug';
import { Renderer } from '../render/Renderer';
import { CameraRig } from '../render/CameraRig';

export class Engine {
  readonly scene = new THREE.Scene();
  readonly time = new Time();
  readonly input: Input;
  readonly audio = new AudioSystem();
  readonly renderer: Renderer;
  readonly cameraRig: CameraRig;
  readonly debug: Debug;

  private running = false;
  private loopCb: ((dt: number) => void) | null = null;

  constructor(private root: HTMLElement) {
    this.renderer = new Renderer(root);
    this.cameraRig = new CameraRig(this.renderer.camera);
    this.input = new Input();
    this.debug = new Debug(root);
    this.scene.fog = new THREE.Fog(0x050912, 40, 170);
  }

  setLoop(cb: (dt: number) => void): void {
    this.loopCb = cb;
  }

  update(dt: number): void {
    this.loopCb?.(dt);
  }

  render(): void {
    this.renderer.render(this.scene);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    const frame = (now: number) => {
      if (!this.running) return;
      this.time.tick(now);
      this.update(this.time.delta);
      this.render();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}
