/** Reads a positive integer environment variable, falling back on missing or invalid values. */
export function readPositiveIntEnv(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return value > 0 ? value : fallback;
}
