export const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const damp = (v: number, target: number, lambda: number, dt: number): number =>
  lerp(v, target, 1 - Math.exp(-lambda * dt));
export const length2 = (x: number, z: number): number => Math.hypot(x, z);
export const normalizeAngle = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
export const fmt = (ms: number): string => {
  const m = Math.floor(ms / 60000)
    .toString()
    .padStart(2, '0');
  const s = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, '0');
  const mm = Math.floor(ms % 1000)
    .toString()
    .padStart(3, '0');
  return `${m}:${s}.${mm}`;
};
