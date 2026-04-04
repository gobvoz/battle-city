import type { StageConfig } from '../config/constants.type.js';
import { getCustomStage } from './custom-stages.js';

export async function loadStage(level: number): Promise<StageConfig> {
  const url = `/stages/stage-${String(level).padStart(2, '0')}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load stage ${level}: ${response.status}`);
  }

  return (await response.json()) as StageConfig;
}

export function loadCustomStage(level: number): StageConfig {
  const stage = getCustomStage(level);
  if (!stage) {
    throw new Error(`Custom stage ${level} not found in storage`);
  }
  return stage;
}
