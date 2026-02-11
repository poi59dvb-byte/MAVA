import type { TouchLayout } from '../utils/types';

const KEY = 'mava-settings-v1';

export interface Settings {
  assist: boolean;
  sensitivity: number;
  touchLayout: TouchLayout;
}

export class Storage {
  getBest(trackId: string): number {
    return Number(localStorage.getItem(`best:${trackId}`)) || 0;
  }

  setBest(trackId: string, ms: number): void {
    localStorage.setItem(`best:${trackId}`, String(ms));
  }

  getSettings(): Settings {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { assist: true, sensitivity: 1, touchLayout: 'A' };
    return { assist: true, sensitivity: 1, touchLayout: 'A', ...JSON.parse(raw) } as Settings;
  }

  setSettings(s: Settings): void {
    localStorage.setItem(KEY, JSON.stringify(s));
  }
}
