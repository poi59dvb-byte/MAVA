import type { Vector3 } from 'three';

export type GameMode = 'quick' | 'timeAttack';
export type TouchLayout = 'A' | 'B';

export interface ControlProfile {
  steer: number;
  throttle: number;
  brake: number;
  drift: boolean;
  nitro: boolean;
  restart: boolean;
  pause: boolean;
}

export interface CarStats {
  maxSpeed: number;
  accel: number;
  brake: number;
  turnRate: number;
  grip: number;
  driftGrip: number;
  nitroPower: number;
  nitroCapacity: number;
  mass: number;
  visual: { color: string; accent: string };
}

export interface CarState {
  position: Vector3;
  velocity: Vector3;
  heading: number;
  angularVelocity: number;
  drifting: boolean;
  nitroActive: boolean;
  speed: number;
  nitro: number;
  driftMeter: number;
}

export interface TrackData {
  name: string;
  author?: string;
  laps: number;
  spawnPoint: { x: number; y: number; z: number };
  spawnHeading: number;
  checkpoints: Array<{ x: number; z: number; nx: number; nz: number; radius: number; heading: number }>;
  walls: Array<{ ax: number; az: number; bx: number; bz: number }>;
  pickups?: Array<{ x: number; z: number; kind: 'nitro' }>;
  decorations?: Array<{ x: number; z: number; type: 'cone' | 'sign' | 'tree' }>;
}
