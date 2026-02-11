import type { GameState } from '../StateMachine';
import type { Game } from '../Game';

export class PauseState implements GameState {
  enter(game: Game): void {
    const p = document.createElement('div');
    p.id = 'pausePanel';
    p.className = 'panel center';
    p.innerHTML = '<h2>Paused</h2><button id="resume">Resume</button><button id="menu">Menu</button>';
    game.ui.layer.appendChild(p);
    p.querySelector('#resume')?.addEventListener('click', () => game.resumeRequested = true);
    p.querySelector('#menu')?.addEventListener('click', () => game.menuRequested = true);
  }
  update(): void {}
  exit(game: Game): void { game.ui.layer.querySelector('#pausePanel')?.remove(); }
}
