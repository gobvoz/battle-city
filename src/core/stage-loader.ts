import type { StageConfig } from '../config/constants.type.js';

export async function loadStage(level: number): Promise<StageConfig> {
  const url = `/stages/stage-${String(level).padStart(2, '0')}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load stage ${level}: ${response.status}`);
  }

  return (await response.json()) as StageConfig;
}
