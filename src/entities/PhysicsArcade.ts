import * as THREE from 'three';
import { clamp, length2 } from '../utils/math';
import type { CarState, CarStats, ControlProfile } from '../utils/types';

export interface TrackPhysicsInfo {
  assist: boolean;
  sensitivity: number;
}

export class PhysicsArcade {
  step(
    car: CarState,
    input: ControlProfile,
    dtRaw: number,
    stats: CarStats,
    track: TrackPhysicsInfo,
  ): CarState {
    const dt = clamp(dtRaw, 1 / 240, 1 / 30);

    const fwd = new THREE.Vector3(Math.cos(car.heading), 0, Math.sin(car.heading));
    const right = new THREE.Vector3(-fwd.z, 0, fwd.x);

    const forwardSpeed = car.velocity.dot(fwd);
    let accel = input.throttle * stats.accel;
    accel -= input.brake * (forwardSpeed > 8 ? stats.brake : stats.brake * 0.4);

    car.drifting = input.drift && car.speed > stats.maxSpeed * 0.25;
    car.nitroActive = input.nitro && car.nitro > 0.01;

    if (car.nitroActive) {
      accel += stats.nitroPower;
      car.nitro = clamp(car.nitro - dt * 0.35, 0, stats.nitroCapacity);
    } else {
      car.nitro = clamp(car.nitro + dt * 0.02, 0, stats.nitroCapacity);
    }

    const speedFactor = clamp(car.speed / stats.maxSpeed, 0.08, 1);
    const steerLoss = track.assist ? 0.5 : 0.3;
    const steerGain = car.drifting ? 1.35 : 1;
    const turn =
      input.steer * stats.turnRate * track.sensitivity * steerGain * (1 - speedFactor * steerLoss);
    car.angularVelocity = clamp(turn, -3.5, 3.5);
    car.heading += car.angularVelocity * dt;

    car.velocity.addScaledVector(fwd, accel * dt);

    const lateral = car.velocity.dot(right);
    const grip = (car.drifting ? stats.driftGrip : stats.grip) * (track.assist ? 1 : 0.72);
    car.velocity.addScaledVector(right, -lateral * grip * dt);

    if (!car.drifting) {
      const stabilize = clamp(lateral * dt * (track.assist ? 5 : 2.5), -20, 20);
      car.velocity.addScaledVector(right, -stabilize);
    }

    if (Math.abs(car.angularVelocity) > (track.assist ? 2.4 : 3.2)) {
      car.angularVelocity *= 0.82;
    }

    car.velocity.multiplyScalar(1 - Math.min(0.95, dt * 1.8));

    car.speed = length2(car.velocity.x, car.velocity.z);
    const max = stats.maxSpeed + (car.nitroActive ? stats.nitroPower * 0.35 : 0);
    if (car.speed > max) car.velocity.multiplyScalar(max / car.speed);

    car.position.addScaledVector(car.velocity, dt);

    if (car.drifting && Math.abs(lateral) > 12) {
      car.driftMeter = clamp(car.driftMeter + dt * 0.42, 0, 1);
      car.nitro = clamp(car.nitro + dt * 0.06, 0, stats.nitroCapacity);
    } else {
      car.driftMeter = clamp(car.driftMeter - dt * 0.25, 0, 1);
    }

    car.speed = length2(car.velocity.x, car.velocity.z);
    return car;
  }
}
