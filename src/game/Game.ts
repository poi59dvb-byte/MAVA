import type { TrackData, GameMode, TouchLayout } from '../utils/types';
import { Engine } from '../core/Engine';
import { Storage } from '../core/Storage';
import { StateMachine } from './StateMachine';
import { UI } from '../ui/UI';
import { BootState } from './states/BootState';

export class Game {
  readonly engine: Engine;
  readonly storage = new Storage();
  readonly stateMachine = new StateMachine();
  readonly ui: UI;

  mode: GameMode = 'quick';
  trackId = 'track_01';
  currentTrack: TrackData | null = null;
  pausedStateCache: unknown = null;
  resumeRequested = false;
  menuRequested = false;

  settings = this.storage.getSettings();

  lastResult = { total: 0, bestLap: 0, pb: 0, newBest: false };

  constructor(root: HTMLElement) {
    this.engine = new Engine(root);
    this.ui = new UI(root);
    this.engine.setLoop((dt) => this.update(dt));
  }

  async start(): Promise<void> {
    await this.stateMachine.set(this, new BootState());
    this.engine.start();
  }

  private update(dt: number): void {
    if (this.resumeRequested) {
      this.resumeRequested = false;
      if (this.pausedStateCache) {
        void this.stateMachine.set(this, this.pausedStateCache as never);
      }
      return;
    }
    this.stateMachine.update(this, dt);
  }
}
