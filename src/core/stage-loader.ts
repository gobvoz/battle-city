import type { EnemyTypeValue, StageConfig } from '../config/constants.type.js';
import { getCustomStage } from './custom-stages.js';

let totalStages: number | null = null;
let lastStageEnemies: EnemyTypeValue[] | null = null;

export async function loadStage(level: number): Promise<StageConfig> {
  // First pass: discover total stages on the fly
  if (totalStages === null) {
    const stage = await fetchStage(level);
    // Try to peek at the next one to detect when we've hit the end
    const nextExists = await stageExists(level + 1);
    if (!nextExists) {
      totalStages = level;
      lastStageEnemies = [...stage.enemies];
    }
    return stage;
  }

  // Subsequent levels: wrap map, replace enemies after first pass
  const mapLevel = ((level - 1) % totalStages) + 1;
  const stage = await fetchStage(mapLevel);

  if (level > totalStages && lastStageEnemies) {
    stage.enemies = [...lastStageEnemies];
  }

  return stage;
}

async function fetchStage(level: number): Promise<StageConfig> {
  const url = `/stages/stage-${String(level).padStart(2, '0')}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load stage ${level}: ${response.status}`);
  }

  return (await response.json()) as StageConfig;
}

async function stageExists(level: number): Promise<boolean> {
  const url = `/stages/stage-${String(level).padStart(2, '0')}.json`;
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export function loadCustomStage(stageNum: number): StageConfig {
  const stage = getCustomStage(stageNum);
  if (!stage) {
    throw new Error(`Custom stage ${stageNum} not found in storage`);
  }
  return stage;
}

export function resetStageLoader(): void {
  totalStages = null;
  lastStageEnemies = null;
}
