import type { Game } from './Game';

export interface GameState {
  enter(game: Game): void | Promise<void>;
  update(game: Game, dt: number): void;
  exit(game: Game): void;
}

export class StateMachine {
  private current: GameState | null = null;

  async set(game: Game, next: GameState): Promise<void> {
    this.current?.exit(game);
    this.current = next;
    await this.current.enter(game);
  }

  update(game: Game, dt: number): void {
    this.current?.update(game, dt);
  }
}
