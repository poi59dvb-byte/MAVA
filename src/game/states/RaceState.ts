import type { GameState } from '../StateMachine';
import type { Game } from '../Game';
import { Car } from '../../entities/Car';
import { CarController } from '../../entities/CarController';
import { TrackLoader } from '../../world/TrackLoader';
import { Track } from '../../world/Track';
import { Collision } from '../../world/Collision';
import { Checkpoints } from '../../world/Checkpoints';
import { Pickups } from '../../world/Pickups';
import carData from '../../data/cars/car_01.json';
import { PauseState } from './PauseState';
import { ResultState } from './ResultState';
import { createLighting } from '../../render/Lighting';
import { Particles } from '../../render/Particles';

export class RaceState implements GameState {
  private controller!: CarController;
  private car!: Car;
  private collision!: Collision;
  private checkpoints!: Checkpoints;
  private pickups!: Pickups;
  private particles!: Particles;
  private raceTime = 0;
  private lapStart = 0;
  private bestLap = 0;
  private countdown = 2.6;
  private lastPause = false;
  private wasNitro = false;

  enter(game: Game): void {
    game.ui.clear();
    game.ui.mountHUD();
    game.ui.mountTouch();
    game.ui.showTouch(game.settings.touchLayout, true);

    const trackData = new TrackLoader().load();
    game.currentTrack = trackData;
    const track = new Track(trackData);

    game.engine.scene.clear();
    createLighting(game.engine.scene);
    game.engine.scene.add(track.build());

    this.collision = new Collision(trackData);
    this.checkpoints = new Checkpoints(trackData);
    this.pickups = new Pickups(trackData);
    this.pickups.attach(game.engine.scene);

    this.controller = new CarController(carData, trackData.spawnPoint, trackData.spawnHeading);
    this.car = new Car(carData);
    game.engine.scene.add(this.car.mesh);

    this.particles = new Particles(game.engine.scene);

    game.engine.input.setTouchLayout(game.settings.touchLayout);
    game.engine.input.bindTouch({
      touchA: game.ui.layer.querySelector('#touchA') as HTMLElement,
      touchB: game.ui.layer.querySelector('#touchB') as HTMLElement,
      dragArea: game.ui.layer.querySelector('#dragArea') as HTMLElement,
    });

    const reset = () => {
      this.controller.reset(trackData.spawnPoint, trackData.spawnHeading);
      this.checkpoints.reset();
      this.raceTime = 0;
      this.lapStart = 0;
      this.bestLap = 0;
      this.countdown = 1.4;
    };

    game.ui.layer.querySelector('#restartBtn')?.addEventListener('click', () => {
      game.engine.audio.click();
      reset();
    });

    game.ui.layer.querySelector('#pauseBtn')?.addEventListener('click', () => {
      void game.stateMachine.pushPause(game, new PauseState());
    });
  }

  update(game: Game, dt: number): void {
    const input = game.engine.input.update(dt);

    if (game.restartRequested) {
      game.restartRequested = false;
      const t = game.currentTrack!;
      this.controller.reset(t.spawnPoint, t.spawnHeading);
      this.checkpoints.reset();
      this.raceTime = 0;
      this.lapStart = 0;
      this.bestLap = 0;
      this.countdown = 1.4;
    }

    if (this.countdown > 0) {
      this.countdown -= dt;
      game.ui.showCountdown(
        this.countdown > 1 ? '3' : this.countdown > 0.65 ? '2' : this.countdown > 0.2 ? '1' : 'GO!',
      );
      if (this.countdown <= 0) game.ui.hideCountdown();
      return;
    }

    this.raceTime += dt * 1000;

    if (input.restart) {
      const t = game.currentTrack!;
      this.controller.reset(t.spawnPoint, t.spawnHeading);
      this.checkpoints.reset();
      this.raceTime = 0;
      this.lapStart = 0;
    }

    if (input.pause && !this.lastPause) {
      void game.stateMachine.pushPause(game, new PauseState());
    }
    this.lastPause = input.pause;

    this.controller.update(input, dt, game.settings.assist, game.settings.sensitivity);
    const s = this.controller.state;

    const hit = this.collision.resolveCircle(s.position.x, s.position.z, 0.8);
    if (hit.collided) {
      s.position.x += hit.normalX * 0.16;
      s.position.z += hit.normalZ * 0.16;
      s.velocity.x *= 0.58;
      s.velocity.z *= 0.58;
      game.engine.audio.collision();
      game.engine.cameraRig.addShake(0.3);
      this.car.mesh.position.y = 0.08;
    } else {
      this.car.mesh.position.y *= 0.85;
    }

    const nitroPickup = this.pickups.collect(s.position.x, s.position.z);
    if (nitroPickup > 0) s.nitro = Math.min(s.nitro + nitroPickup, this.controller.stats.nitroCapacity);

    const progress = this.checkpoints.update(s.position.x, s.position.z, s.heading);
    if (progress.lapCompleted) {
      const lap = this.raceTime - this.lapStart;
      this.lapStart = this.raceTime;
      this.bestLap = this.bestLap ? Math.min(this.bestLap, lap) : lap;
    }

    if (progress.finished) {
      const best = game.storage.getBest(game.trackId);
      let newBest = false;
      if (!best || this.raceTime < best) {
        game.storage.setBest(game.trackId, this.raceTime);
        newBest = true;
      }
      game.lastResult = { total: this.raceTime, bestLap: this.bestLap, pb: newBest ? this.raceTime : best, newBest };
      void game.stateMachine.set(game, new ResultState());
    }

    if (s.drifting) this.particles.spawn(s.position.x, s.position.z);
    if (s.nitroActive && !this.wasNitro) {
      game.engine.audio.nitroBurst();
      game.engine.cameraRig.addShake(0.15);
      navigator.vibrate?.(12);
    }
    this.wasNitro = s.nitroActive;

    game.engine.audio.update(s.speed, s.drifting, s.nitroActive);

    this.car.sync(s);
    game.engine.cameraRig.follow(s.position, s.velocity, s.heading, s.speed, s.nitroActive);
    game.ui.updateHud({
      mode: game.mode === 'timeAttack' ? 'Time Attack' : 'Quick Race',
      lap: `Lap ${Math.min(this.checkpoints.lap, game.currentTrack!.laps)}/${game.currentTrack!.laps}`,
      time: this.raceTime,
      speed: s.speed,
      drift: s.drifting,
      nitro: s.nitro,
      driftMeter: s.driftMeter,
      best: game.storage.getBest(game.trackId),
    });

    game.engine.debug.draw([
      `FPS: ${game.engine.time.fps.toFixed(0)}`,
      `Speed: ${s.speed.toFixed(1)}`,
      `Drift: ${String(s.drifting)}`,
      `Nitro: ${s.nitro.toFixed(2)}`,
    ]);
  }

  exit(game: Game): void {
    game.ui.showTouch('A', false);
    game.ui.showTouch('B', false);
  }
}
