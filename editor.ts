// =====================================================
// Battle City — Level Editor
// =====================================================

import {
  saveCustomStage,
  getCustomStage,
  deleteCustomStage,
  getCustomStageLevels,
} from './src/core/custom-stages.js';
import type { StageConfig } from './src/config/constants.type.js';

// --- Constants (mirroring game config) ---
const TILE_SIZE = 8; // px in sprite sheet
const GRID = 26; // 26×26 tile grid
const SCALE = 3; // display scale
const CELL = TILE_SIZE * SCALE; // rendered cell size
const CANVAS_SIZE = GRID * CELL; // total canvas px

const SPRITE_SRC = '/sprites/sprite.png';

const TerrainType = {
  EMPTY: 0,
  BRICK: 1,
  STEEL: 2,
  TREE: 3,
  WATER: 4,
  ICE: 5,
} as const;
type TerrainValue = (typeof TerrainType)[keyof typeof TerrainType];

// Sprite coords [x, y] in UNIT_SIZE (16px) grid — matching game constants
// For tiles we use TILE_SIZE (8px) slices, so fractional coords mean half-tile offset
const TERRAIN_SPRITES: Record<number, [number, number]> = {
  [TerrainType.EMPTY]: [-1, -1], // no sprite
  [TerrainType.BRICK]: [16, 4],
  [TerrainType.STEEL]: [16, 4.5],
  [TerrainType.TREE]: [16.5, 4.5],
  [TerrainType.WATER]: [16, 5],
  [TerrainType.ICE]: [17, 4.5],
};

const TERRAIN_NAMES: Record<number, string> = {
  [TerrainType.EMPTY]: 'Empty',
  [TerrainType.BRICK]: 'Brick',
  [TerrainType.STEEL]: 'Steel',
  [TerrainType.TREE]: 'Tree',
  [TerrainType.WATER]: 'Water',
  [TerrainType.ICE]: 'Ice',
};

const TERRAIN_COLORS: Record<number, string> = {
  [TerrainType.EMPTY]: '#000',
  [TerrainType.BRICK]: '#b85c18',
  [TerrainType.STEEL]: '#aaa',
  [TerrainType.TREE]: '#0a0',
  [TerrainType.WATER]: '#28c',
  [TerrainType.ICE]: '#cef',
};

// Enemy type colors for wave display
const ENEMY_NAMES: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };

// Base occupies these tiles (non-editable)
const BASE_TILES: [number, number][] = [
  [24, 12],
  [24, 13],
  [25, 12],
  [25, 13],
];

// Default fortress around base
const FORTRESS_TILES: [number, number][] = [
  [23, 11],
  [23, 12],
  [23, 13],
  [23, 14],
  [24, 11],
  [24, 14],
  [25, 11],
  [25, 14],
];

// Base sprite [x, y] in UNIT_SIZE tiles
const BASE_SPRITE: [number, number] = [19, 2];

// --- State ---
let terrain: number[][] = createEmptyTerrain();
let enemies: number[] = createDefaultEnemies();
let selectedTerrain: TerrainValue = TerrainType.BRICK;
let selectedEnemy = 1;
let spriteImage: HTMLImageElement;
let painting = false;
let erasing = false;

// Undo/Redo
type Snapshot = { terrain: number[][]; enemies: number[] };
let undoStack: Snapshot[] = [];
let redoStack: Snapshot[] = [];
const MAX_UNDO = 50;

// --- Helpers ---
function createEmptyTerrain(): number[][] {
  const grid: number[][] = [];
  for (let y = 0; y < GRID; y++) {
    grid.push(new Array(GRID).fill(TerrainType.EMPTY));
  }
  // Default fortress bricks
  for (const [r, c] of FORTRESS_TILES) {
    grid[r][c] = TerrainType.BRICK;
  }
  return grid;
}

function createDefaultEnemies(): number[] {
  return new Array(20).fill(1);
}

function cloneTerrain(t: number[][]): number[][] {
  return t.map(row => [...row]);
}

function snapshot(): Snapshot {
  return { terrain: cloneTerrain(terrain), enemies: [...enemies] };
}

function pushUndo(): void {
  undoStack.push(snapshot());
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  redoStack = [];
}

function undo(): void {
  if (!undoStack.length) return;
  redoStack.push(snapshot());
  const s = undoStack.pop()!;
  terrain = s.terrain;
  enemies = s.enemies;
  renderEnemyWave();
  draw();
}

function redo(): void {
  if (!redoStack.length) return;
  undoStack.push(snapshot());
  const s = redoStack.pop()!;
  terrain = s.terrain;
  enemies = s.enemies;
  renderEnemyWave();
  draw();
}

function isBaseTile(y: number, x: number): boolean {
  return BASE_TILES.some(([by, bx]) => by === y && bx === x);
}

// --- Canvas setup ---
const canvas = document.getElementById('editor') as HTMLCanvasElement;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
const ctx = canvas.getContext('2d')!;
ctx.imageSmoothingEnabled = false;

// --- Sprite loading ---
async function loadSprite(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = SPRITE_SRC;
  });
}

// --- Drawing ---
function draw(): void {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Draw terrain
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const t = terrain[y][x];
      if (t !== TerrainType.EMPTY) {
        drawTile(x, y, t);
      }
    }
  }

  // Draw base
  if (spriteImage) {
    ctx.drawImage(
      spriteImage,
      BASE_SPRITE[0] * 16,
      BASE_SPRITE[1] * 16,
      16,
      16,
      12 * CELL,
      24 * CELL,
      CELL * 2,
      CELL * 2
    );
  }

  // Draw grid
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL, 0);
    ctx.lineTo(i * CELL, CANVAS_SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL);
    ctx.lineTo(CANVAS_SIZE, i * CELL);
    ctx.stroke();
  }

  // Highlight spawn points (top: 0, 6*2, 12*2 = cols 0, 12, 24)
  ctx.strokeStyle = 'rgba(255, 50, 0, 0.3)';
  ctx.lineWidth = 2;
  for (const sx of [0, 12, 24]) {
    ctx.strokeRect(sx * CELL + 1, 1, CELL * 2 - 2, CELL * 2 - 2);
  }

  // Player spawn points (bottom)
  ctx.strokeStyle = 'rgba(0, 200, 0, 0.3)';
  ctx.strokeRect(8 * CELL + 1, 24 * CELL + 1, CELL * 2 - 2, CELL * 2 - 2);
  ctx.strokeRect(16 * CELL + 1, 24 * CELL + 1, CELL * 2 - 2, CELL * 2 - 2);

  // Base highlight
  ctx.strokeStyle = 'rgba(255, 200, 0, 0.4)';
  ctx.strokeRect(12 * CELL + 1, 24 * CELL + 1, CELL * 2 - 2, CELL * 2 - 2);
}

function drawTile(x: number, y: number, type: number): void {
  const coords = TERRAIN_SPRITES[type];
  if (!coords || coords[0] < 0) return;

  if (spriteImage) {
    // Sprite coords are in UNIT_SIZE (16px) with fractional = half-tile offsets
    const sx = coords[0] * 16;
    const sy = coords[1] * 16;
    ctx.drawImage(spriteImage, sx, sy, TILE_SIZE, TILE_SIZE, x * CELL, y * CELL, CELL, CELL);
  } else {
    // Fallback: colored rectangles
    ctx.fillStyle = TERRAIN_COLORS[type] || '#f0f';
    ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
  }
}

// --- Canvas interaction ---
function getTileCoords(e: MouseEvent): [number, number] | null {
  const rect = canvas.getBoundingClientRect();
  const scaleX = CANVAS_SIZE / rect.width;
  const scaleY = CANVAS_SIZE / rect.height;
  const x = Math.floor(((e.clientX - rect.left) * scaleX) / CELL);
  const y = Math.floor(((e.clientY - rect.top) * scaleY) / CELL);
  if (x < 0 || x >= GRID || y < 0 || y >= GRID) return null;
  return [y, x];
}

function paintTile(y: number, x: number): void {
  if (isBaseTile(y, x)) return;
  const value = erasing ? TerrainType.EMPTY : selectedTerrain;
  if (terrain[y][x] === value) return;
  terrain[y][x] = value;
  draw();
}

canvas.addEventListener('mousedown', e => {
  e.preventDefault();
  const coords = getTileCoords(e);
  if (!coords) return;
  pushUndo();
  if (e.button === 2) {
    erasing = true;
  } else {
    erasing = false;
  }
  painting = true;
  paintTile(coords[0], coords[1]);
});

canvas.addEventListener('mousemove', e => {
  if (!painting) return;
  const coords = getTileCoords(e);
  if (!coords) return;
  paintTile(coords[0], coords[1]);
});

canvas.addEventListener('mouseup', () => {
  painting = false;
  erasing = false;
});

canvas.addEventListener('mouseleave', () => {
  painting = false;
  erasing = false;
});

canvas.addEventListener('contextmenu', e => e.preventDefault());

// --- Palette UI ---
function buildPalette(): void {
  const palette = document.getElementById('palette')!;
  palette.innerHTML = '';

  for (const [key, name] of Object.entries(TERRAIN_NAMES)) {
    const type = Number(key) as TerrainValue;
    const item = document.createElement('div');
    item.className = 'palette-item' + (type === selectedTerrain ? ' selected' : '');
    item.title = name;

    if (type === TerrainType.EMPTY) {
      item.innerHTML = `<span style="color:#666; font-size:18px">✕</span>`;
    } else if (spriteImage) {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      const pctx = c.getContext('2d')!;
      pctx.imageSmoothingEnabled = false;
      const coords = TERRAIN_SPRITES[type];
      pctx.drawImage(
        spriteImage,
        coords[0] * 16,
        coords[1] * 16,
        TILE_SIZE,
        TILE_SIZE,
        0,
        0,
        32,
        32
      );
      item.appendChild(c);
    } else {
      item.style.background = TERRAIN_COLORS[type];
    }

    item.addEventListener('click', () => {
      selectedTerrain = type;
      buildPalette();
    });

    palette.appendChild(item);
  }
}

// --- Enemy wave UI ---
function renderEnemyWave(): void {
  const container = document.getElementById('enemy-wave')!;
  container.innerHTML = '';

  for (let i = 0; i < 20; i++) {
    const slot = document.createElement('div');
    slot.className = 'enemy-slot';
    const type = enemies[i] || 1;
    slot.dataset.type = String(type);
    slot.textContent = ENEMY_NAMES[type];
    slot.title = `Slot ${i + 1}: Enemy type ${type}`;

    slot.addEventListener('click', () => {
      pushUndo();
      enemies[i] = (enemies[i] % 4) + 1;
      renderEnemyWave();
    });

    slot.addEventListener('contextmenu', e => {
      e.preventDefault();
      pushUndo();
      enemies[i] = ((enemies[i] - 2 + 4) % 4) + 1;
      renderEnemyWave();
    });

    container.appendChild(slot);
  }
}

// --- Save / Load ---
function stageToJson(): string {
  return JSON.stringify({ terrain, enemies }, null, 2);
}

function downloadJson(): void {
  const num = (document.getElementById('stage-num') as HTMLInputElement).value;
  const filename = `stage-${num.padStart(2, '0')}.json`;
  const blob = new Blob([stageToJson()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function loadStageFromServer(level: number): Promise<void> {
  const url = `/stages/stage-${String(level).padStart(2, '0')}.json`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      alert(`Stage ${level} not found (${resp.status})`);
      return;
    }
    const data = await resp.json();
    pushUndo();
    terrain = data.terrain ?? createEmptyTerrain();
    enemies = data.enemies ?? createDefaultEnemies();
    // Ensure grid is 26×26
    while (terrain.length < GRID) terrain.push(new Array(GRID).fill(0));
    for (const row of terrain) while (row.length < GRID) row.push(0);
    // Ensure 20 enemies
    while (enemies.length < 20) enemies.push(1);
    enemies.length = 20;
    renderEnemyWave();
    draw();
  } catch (err) {
    alert(`Failed to load stage: ${err}`);
  }
}

function importFromFile(): void {
  const fileInput = document.getElementById('file-import') as HTMLInputElement;
  fileInput.click();
}

// --- Local Storage ---
function getStageNum(): number {
  return parseInt((document.getElementById('stage-num') as HTMLInputElement).value, 10) || 1;
}

function saveToStorage(): void {
  const num = getStageNum();
  const stage: StageConfig = { terrain, enemies };
  saveCustomStage(num, stage);
  renderStorageList();
}

function loadFromStorage(): void {
  const num = getStageNum();
  const stage = getCustomStage(num);
  if (!stage) {
    alert(`No custom stage ${num} in storage`);
    return;
  }
  pushUndo();
  terrain = stage.terrain ?? createEmptyTerrain();
  enemies = stage.enemies ?? createDefaultEnemies();
  while (terrain.length < GRID) terrain.push(new Array(GRID).fill(0));
  for (const row of terrain) while (row.length < GRID) row.push(0);
  while (enemies.length < 20) enemies.push(1);
  enemies.length = 20;
  renderEnemyWave();
  draw();
}

function deleteFromStorage(): void {
  const num = getStageNum();
  if (!getCustomStage(num)) {
    alert(`No custom stage ${num} in storage`);
    return;
  }
  deleteCustomStage(num);
  renderStorageList();
}

function renderStorageList(): void {
  const container = document.getElementById('storage-list')!;
  const levels = getCustomStageLevels();
  if (levels.length === 0) {
    container.innerHTML = '<div class="empty">No saved stages</div>';
    return;
  }
  container.textContent = `Saved: ${levels.map(n => `#${n}`).join(', ')}`;
}

// --- Keyboard ---
document.addEventListener('keydown', e => {
  // Ctrl+S — save
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    downloadJson();
    return;
  }
  // Ctrl+Z — undo
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault();
    undo();
    return;
  }
  // Ctrl+Y — redo
  if (e.ctrlKey && e.key === 'y') {
    e.preventDefault();
    redo();
    return;
  }

  // Number keys for terrain
  const num = parseInt(e.key, 10);
  if (!isNaN(num) && num >= 0 && num <= 5 && !(e.target instanceof HTMLInputElement)) {
    selectedTerrain = num as TerrainValue;
    buildPalette();
    return;
  }

  if (e.key === 'e' || e.key === 'E') {
    if (e.target instanceof HTMLInputElement) return;
    selectedTerrain = TerrainType.EMPTY;
    buildPalette();
  }
});

// --- Button wiring ---
document.getElementById('btn-save')!.addEventListener('click', downloadJson);

document.getElementById('btn-load')!.addEventListener('click', () => {
  const num = parseInt((document.getElementById('stage-num') as HTMLInputElement).value, 10);
  if (num > 0) loadStageFromServer(num);
});

document.getElementById('btn-clear')!.addEventListener('click', () => {
  pushUndo();
  terrain = createEmptyTerrain();
  draw();
});

document.getElementById('btn-fill-enemies')!.addEventListener('click', () => {
  pushUndo();
  for (let i = 0; i < 20; i++) {
    if (!enemies[i]) enemies[i] = selectedEnemy;
  }
  renderEnemyWave();
});

document.getElementById('btn-clear-enemies')!.addEventListener('click', () => {
  pushUndo();
  enemies = createDefaultEnemies();
  renderEnemyWave();
});

document.getElementById('btn-import')!.addEventListener('click', importFromFile);

document.getElementById('btn-save-storage')!.addEventListener('click', saveToStorage);
document.getElementById('btn-load-storage')!.addEventListener('click', loadFromStorage);
document.getElementById('btn-delete-storage')!.addEventListener('click', deleteFromStorage);

document.getElementById('file-import')!.addEventListener('change', e => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string);
      pushUndo();
      terrain = data.terrain ?? createEmptyTerrain();
      enemies = data.enemies ?? createDefaultEnemies();
      while (terrain.length < GRID) terrain.push(new Array(GRID).fill(0));
      for (const row of terrain) while (row.length < GRID) row.push(0);
      while (enemies.length < 20) enemies.push(1);
      enemies.length = 20;
      renderEnemyWave();
      draw();
    } catch (err) {
      alert(`Invalid JSON: ${err}`);
    }
  };
  reader.readAsText(file);
  input.value = '';
});

// --- Init ---
async function init(): Promise<void> {
  spriteImage = await loadSprite();
  buildPalette();
  renderEnemyWave();
  renderStorageList();
  draw();
}

init();
