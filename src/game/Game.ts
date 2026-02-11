import type { TrackData, GameMode } from '../utils/types';
import { Engine } from '../core/Engine';
import { Storage, type Settings } from '../core/Storage';
import { StateMachine } from './StateMachine';
import { UI } from '../ui/UI';
import { BootState } from './states/BootState';
import { MenuState } from './states/MenuState';

export class Game {
  readonly engine: Engine;
  readonly storage = new Storage();
  readonly stateMachine = new StateMachine();
  readonly ui: UI;

  mode: GameMode = 'quick';
  trackId = 'track_01';
  currentTrack: TrackData | null = null;
  resumeRequested = false;
  restartRequested = false;
  menuRequested = false;

  settings: Settings = this.storage.getSettings();

  lastResult = { total: 0, bestLap: 0, pb: 0, newBest: false };

  constructor(root: HTMLElement) {
    this.engine = new Engine(root);
    this.ui = new UI(root);
    this.engine.setLoop((dt) => this.update(dt));
    this.engine.audio.setMuted(this.settings.muted);
    this.engine.audio.setVolume(this.settings.masterVolume);
  }

  async start(): Promise<void> {
    await this.stateMachine.set(this, new BootState());
    this.engine.start();
  }

  private update(dt: number): void {
    if (this.menuRequested) {
      this.menuRequested = false;
      void this.stateMachine.set(this, new MenuState());
      return;
    }
    if (this.resumeRequested) {
      this.resumeRequested = false;
      this.stateMachine.resume(this);
      return;
    }
    this.stateMachine.update(this, dt);
  }
}
