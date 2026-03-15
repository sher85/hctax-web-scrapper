import dotenv from 'dotenv';

let loaded = false;

export function loadEnv(): void {
  if (loaded) {
    return;
  }

  dotenv.config({ quiet: true });
  loaded = true;
}
