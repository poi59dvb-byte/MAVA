import * as THREE from 'three';
import { PhysicsArcade } from './PhysicsArcade';
import type { CarState, CarStats, ControlProfile } from '../utils/types';

export class CarController {
  readonly physics = new PhysicsArcade();
  state: CarState;

  constructor(public stats: CarStats, spawn: { x: number; y: number; z: number }, heading: number) {
    this.state = {
      position: new THREE.Vector3(spawn.x, spawn.y, spawn.z),
      velocity: new THREE.Vector3(),
      heading,
      angularVelocity: 0,
      drifting: false,
      nitroActive: false,
      speed: 0,
      nitro: stats.nitroCapacity,
      driftMeter: 0,
    };
  }

  reset(spawn: { x: number; y: number; z: number }, heading: number): void {
    this.state.position.set(spawn.x, spawn.y, spawn.z);
    this.state.velocity.set(0, 0, 0);
    this.state.heading = heading;
    this.state.speed = 0;
    this.state.driftMeter = 0;
    this.state.nitro = this.stats.nitroCapacity;
  }

  update(input: ControlProfile, dt: number, assist: boolean, sensitivity: number): void {
    this.state = this.physics.step(this.state, input, dt, this.stats, { assist, sensitivity });
  }
}
