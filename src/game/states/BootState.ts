import type { GameState } from '../StateMachine';
import type { Game } from '../Game';
import { MenuState } from './MenuState';

export class BootState implements GameState {
  async enter(game: Game): Promise<void> {
    await game.stateMachine.set(game, new MenuState());
  }
  update(): void {}
  exit(): void {}
}
