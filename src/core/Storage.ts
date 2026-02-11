import type { TouchLayout } from '../utils/types';

const KEY = 'mava-settings-v2';

export interface Settings {
  assist: boolean;
  sensitivity: number;
  touchLayout: TouchLayout;
  muted: boolean;
  masterVolume: number;
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
    if (!raw)
      return { assist: true, sensitivity: 1, touchLayout: 'A', muted: false, masterVolume: 0.55 };
    return {
      assist: true,
      sensitivity: 1,
      touchLayout: 'A',
      muted: false,
      masterVolume: 0.55,
      ...JSON.parse(raw),
    } as Settings;
  }

  setSettings(s: Settings): void {
    localStorage.setItem(KEY, JSON.stringify(s));
  }
}
