import { damp, clamp } from '../utils/math';
import type { ControlProfile, TouchLayout } from '../utils/types';

export class Input {
  private keys = new Set<string>();
  private layout: TouchLayout = 'A';
  private touchState = { throttle: 0, brake: 0, drift: false, nitro: false, steer: 0 };
  private steerSmoothed = 0;

  profile: ControlProfile = { steer: 0, throttle: 0, brake: 0, drift: false, nitro: false, restart: false, pause: false };

  constructor(private root: HTMLElement) {
    window.addEventListener('keydown', (e) => this.keys.add(e.code));
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
  }

  setTouchLayout(layout: TouchLayout): void {
    this.layout = layout;
  }

  bindTouch(elements: {
    touchA: HTMLElement;
    touchB: HTMLElement;
    dragArea: HTMLElement;
  }): void {
    const bindBtn = (el: HTMLElement, key: keyof typeof this.touchState, value: number | boolean) => {
      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        (this.touchState[key] as number | boolean) = value;
      });
      const clear = () => {
        (this.touchState[key] as number | boolean) = typeof value === 'number' ? 0 : false;
      };
      el.addEventListener('pointerup', clear);
      el.addEventListener('pointercancel', clear);
      el.addEventListener('pointerleave', clear);
    };

    elements.touchA.querySelectorAll<HTMLElement>('[data-key]')?.forEach((btn) => {
      const key = btn.dataset.key ?? '';
      if (key === 'left') bindBtn(btn, 'steer', -1);
      if (key === 'right') bindBtn(btn, 'steer', 1);
      if (key === 'throttle') bindBtn(btn, 'throttle', 1);
      if (key === 'brake') bindBtn(btn, 'brake', 1);
      if (key === 'drift') bindBtn(btn, 'drift', true);
      if (key === 'nitro') bindBtn(btn, 'nitro', true);
    });

    elements.touchB.querySelectorAll<HTMLElement>('button[data-key]')?.forEach((btn) => {
      const key = btn.dataset.key ?? '';
      if (key === 'throttle') bindBtn(btn, 'throttle', 1);
      if (key === 'brake') bindBtn(btn, 'brake', 1);
      if (key === 'drift') bindBtn(btn, 'drift', true);
      if (key === 'nitro') bindBtn(btn, 'nitro', true);
    });

    let active = false;
    let startX = 0;
    elements.dragArea.addEventListener('pointerdown', (e) => {
      active = true;
      startX = e.clientX;
    });
    elements.dragArea.addEventListener('pointermove', (e) => {
      if (!active) return;
      const raw = clamp((e.clientX - startX) / 120, -1, 1);
      this.touchState.steer = Math.abs(raw) < 0.12 ? 0 : raw;
    });
    const stop = () => {
      active = false;
      this.touchState.steer = 0;
    };
    elements.dragArea.addEventListener('pointerup', stop);
    elements.dragArea.addEventListener('pointercancel', stop);
  }

  update(dt: number): ControlProfile {
    const steerKeys = (this.keys.has('KeyA') || this.keys.has('ArrowLeft') ? -1 : 0) + (this.keys.has('KeyD') || this.keys.has('ArrowRight') ? 1 : 0);
    const keyboardSteer = clamp(steerKeys, -1, 1);

    const gamepad = navigator.getGamepads?.()[0];
    const gpSteer = gamepad && Math.abs(gamepad.axes[0] ?? 0) > 0.12 ? gamepad.axes[0] : 0;

    const rawSteer = this.layout === 'B' ? (Math.abs(this.touchState.steer) > Math.abs(keyboardSteer) ? this.touchState.steer : keyboardSteer) : (this.touchState.steer || keyboardSteer);
    this.steerSmoothed = damp(this.steerSmoothed, gpSteer || rawSteer, 12, dt);

    this.profile = {
      steer: clamp(this.steerSmoothed, -1, 1),
      throttle: this.keys.has('KeyW') || this.keys.has('ArrowUp') ? 1 : this.touchState.throttle,
      brake: this.keys.has('KeyS') || this.keys.has('ArrowDown') ? 1 : this.touchState.brake,
      drift: this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') || this.touchState.drift,
      nitro: this.keys.has('Space') || this.touchState.nitro,
      restart: this.keys.has('KeyR'),
      pause: this.keys.has('Escape'),
    };
    return this.profile;
  }
}
