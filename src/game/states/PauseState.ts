import type { GameState } from '../StateMachine';
import type { Game } from '../Game';

export class PauseState implements GameState {
  enter(game: Game): void {
    const p = game.ui.mountPause();
    p.querySelector('#resume')?.addEventListener('click', () => {
      game.resumeRequested = true;
      game.engine.audio.click();
    });
    p.querySelector('#pauseRestart')?.addEventListener('click', () => {
      game.restartRequested = true;
      game.resumeRequested = true;
      game.engine.audio.click();
    });
    p.querySelector('#pauseMenu')?.addEventListener('click', () => {
      game.menuRequested = true;
      game.engine.audio.click();
    });
  }
  update(): void {}
  exit(game: Game): void {
    game.ui.layer.querySelector('#pausePanel')?.remove();
  }
}
