import type { GameState } from '../StateMachine';
import type { Game } from '../Game';
import { RaceState } from './RaceState';

export class MenuState implements GameState {
  enter(game: Game): void {
    const panel = game.ui.mountMenu();
    const settings = game.storage.getSettings();
    (panel.querySelector('#touchSel') as HTMLSelectElement).value = settings.touchLayout;
    (panel.querySelector('#assistSel') as HTMLInputElement).checked = settings.assist;
    (panel.querySelector('#sensSel') as HTMLInputElement).value = String(settings.sensitivity);
    (panel.querySelector('#muteSel') as HTMLInputElement).checked = settings.muted;
    (panel.querySelector('#volumeSel') as HTMLInputElement).value = String(settings.masterVolume);

    panel.querySelector('#startBtn')?.addEventListener('click', async () => {
      game.engine.audio.click();
      game.mode = (panel.querySelector('#modeSel') as HTMLSelectElement).value as 'quick' | 'timeAttack';
      game.trackId = (panel.querySelector('#trackSel') as HTMLSelectElement).value;
      game.settings = {
        touchLayout: (panel.querySelector('#touchSel') as HTMLSelectElement).value as 'A' | 'B',
        assist: (panel.querySelector('#assistSel') as HTMLInputElement).checked,
        sensitivity: Number((panel.querySelector('#sensSel') as HTMLInputElement).value),
        muted: (panel.querySelector('#muteSel') as HTMLInputElement).checked,
        masterVolume: Number((panel.querySelector('#volumeSel') as HTMLInputElement).value),
      };
      game.storage.setSettings(game.settings);
      game.engine.audio.setMuted(game.settings.muted);
      game.engine.audio.setVolume(game.settings.masterVolume);
      await game.stateMachine.set(game, new RaceState());
    });
  }
  update(): void {}
  exit(game: Game): void {
    game.ui.clear();
  }
}
