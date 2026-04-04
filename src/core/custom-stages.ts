import type { StageConfig } from '../config/constants.type.js';

const STORAGE_KEY = 'battle-city:custom-stages';

export interface CustomStagesMap {
  [level: string]: StageConfig;
}

function readAll(): CustomStagesMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomStagesMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: CustomStagesMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getCustomStage(level: number): StageConfig | null {
  const map = readAll();
  return map[String(level)] ?? null;
}

export function saveCustomStage(level: number, stage: StageConfig): void {
  const map = readAll();
  map[String(level)] = stage;
  writeAll(map);
}

export function deleteCustomStage(level: number): void {
  const map = readAll();
  delete map[String(level)];
  writeAll(map);
}

export function getCustomStageCount(): number {
  return Object.keys(readAll()).length;
}

export function getCustomStageLevels(): number[] {
  return Object.keys(readAll())
    .map(Number)
    .sort((a, b) => a - b);
}
