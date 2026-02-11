import type { GameState } from '../StateMachine';
import type { Game } from '../Game';
import { MenuState } from './MenuState';
import { RaceState } from './RaceState';

export class ResultState implements GameState {
  enter(game: Game): void {
    game.ui.mountResults(game.lastResult);
    game.ui.layer.querySelector('#againBtn')?.addEventListener('click', async () => {
      await game.stateMachine.set(game, new RaceState());
    });
    game.ui.layer.querySelector('#retryBtn')?.addEventListener('click', async () => {
      await game.stateMachine.set(game, new RaceState());
    });
    game.ui.layer.querySelector('#menuBtn')?.addEventListener('click', async () => {
      await game.stateMachine.set(game, new MenuState());
    });
  }
  update(): void {}
  exit(game: Game): void {
    game.ui.clear();
  }
}
