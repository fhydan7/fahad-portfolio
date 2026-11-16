// Deterministic PRNG (mulberry32). Same seed -> same dataset, every run.
// This is what makes the synthetic data "deterministic" per Section 30 of the brief.
export function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SEED = 190426; // fixed seed for the entire platform

// small helpers built on a rand() function
export function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
export function range(rand: () => number, min: number, max: number) {
  return min + rand() * (max - min);
}
export function rangeInt(rand: () => number, min: number, max: number) {
  return Math.floor(range(rand, min, max + 1));
}
export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
export function round(v: number, dp = 0) {
  const f = Math.pow(10, dp);
  return Math.round(v * f) / f;
}
