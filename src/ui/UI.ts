import { fmt } from '../utils/math';
import { hudTemplate } from './hud';
import { menuTemplate } from './menu';
import { resultsTemplate } from './results';
import { touchTemplate } from './touchControls';

export class UI {
  readonly layer: HTMLDivElement;

  constructor(root: HTMLElement) {
    this.layer = document.createElement('div');
    this.layer.className = 'ui-layer';
    root.appendChild(this.layer);
  }

  clear(): void { this.layer.innerHTML = ''; }

  showCountdown(v: string): void {
    let el = this.layer.querySelector<HTMLDivElement>('#count');
    if (!el) {
      el = document.createElement('div');
      el.id = 'count';
      el.className = 'center';
      el.style.fontSize = '96px';
      el.style.fontWeight = '800';
      this.layer.appendChild(el);
    }
    el.textContent = v;
  }

  hideCountdown(): void { this.layer.querySelector('#count')?.remove(); }

  mountMenu(): HTMLDivElement {
    this.clear();
    this.layer.innerHTML = menuTemplate;
    return this.layer.querySelector('#menuPanel') as HTMLDivElement;
  }

  mountHUD(): void {
    this.layer.insertAdjacentHTML('beforeend', hudTemplate);
  }

  mountTouch(): void {
    this.layer.insertAdjacentHTML('beforeend', touchTemplate);
  }

  showTouch(layout: 'A' | 'B', enabled: boolean): void {
    const a = this.layer.querySelector('#touchA') as HTMLElement;
    const b = this.layer.querySelector('#touchB') as HTMLElement;
    a?.classList.toggle('hidden', !enabled || layout !== 'A');
    b?.classList.toggle('hidden', !enabled || layout !== 'B');
  }

  updateHud(data: { mode: string; lap: string; time: number; speed: number; drift: boolean; nitro: number; driftMeter: number; best: number }): void {
    (this.layer.querySelector('#mode') as HTMLElement).textContent = data.mode;
    (this.layer.querySelector('#lap') as HTMLElement).textContent = data.lap;
    (this.layer.querySelector('#time') as HTMLElement).textContent = fmt(data.time);
    (this.layer.querySelector('#speed') as HTMLElement).textContent = `Speed: ${Math.round(data.speed)}`;
    (this.layer.querySelector('#drift') as HTMLElement).textContent = data.drift ? 'Drift ON' : 'Drift OFF';
    (this.layer.querySelector('#best') as HTMLElement).textContent = `Best: ${data.best ? fmt(data.best) : '--:--.---'}`;
    (this.layer.querySelector('#nitroBar') as HTMLElement).style.width = `${Math.round((data.nitro / 1) * 100)}%`;
    (this.layer.querySelector('#driftBar') as HTMLElement).style.width = `${Math.round(data.driftMeter * 100)}%`;
  }

  mountResults(result: { total: number; bestLap: number; pb: number; newBest: boolean }): void {
    this.layer.insertAdjacentHTML('beforeend', resultsTemplate);
    (this.layer.querySelector('#resultTitle') as HTMLElement).textContent = result.newBest ? 'New Personal Best!' : 'Finished!';
    (this.layer.querySelector('#totalTime') as HTMLElement).textContent = `Total: ${fmt(result.total)}`;
    (this.layer.querySelector('#bestLap') as HTMLElement).textContent = `Best lap: ${result.bestLap ? fmt(result.bestLap) : '--:--.---'}`;
    (this.layer.querySelector('#pb') as HTMLElement).textContent = `Record: ${result.pb ? fmt(result.pb) : '--:--.---'}`;
  }
}
