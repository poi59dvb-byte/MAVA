import type { Game } from './Game';

export interface GameState {
  enter(game: Game): void | Promise<void>;
  update(game: Game, dt: number): void;
  exit(game: Game): void;
}

export class StateMachine {
  private current: GameState | null = null;
  private pausedUnderlying: GameState | null = null;

  async set(game: Game, next: GameState): Promise<void> {
    this.current?.exit(game);
    if (this.pausedUnderlying && this.pausedUnderlying !== this.current) {
      this.pausedUnderlying.exit(game);
    }
    this.pausedUnderlying = null;
    this.current = next;
    await this.current.enter(game);
  }

  async pushPause(game: Game, pauseState: GameState): Promise<void> {
    if (!this.current || this.pausedUnderlying) return;
    this.pausedUnderlying = this.current;
    this.current = pauseState;
    await this.current.enter(game);
  }

  resume(game: Game): void {
    if (!this.pausedUnderlying || !this.current) return;
    this.current.exit(game);
    this.current = this.pausedUnderlying;
    this.pausedUnderlying = null;
  }

  update(game: Game, dt: number): void {
    this.current?.update(game, dt);
  }
}
