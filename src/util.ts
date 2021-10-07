export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function rand_range(min: number, max: number): number {
  if (min === max) {
    return min;
  }
  if (min > max) {
    throw new Error(`Invalid rand_range. min: ${min} max: ${max}`);
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
