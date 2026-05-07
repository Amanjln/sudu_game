export type Grid = (number | null)[][];
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export const DIFFICULTY_CONFIG: Record<Difficulty, { clues: number; label: string; color: string }> = {
  easy:   { clues: 36, label: 'Easy',   color: '#22c55e' },
  medium: { clues: 30, label: 'Medium', color: '#f59e0b' },
  hard:   { clues: 25, label: 'Hard',   color: '#f97316' },
  expert: { clues: 22, label: 'Expert', color: '#ef4444' },
};

export const getEmptyGrid = (): Grid => Array(9).fill(null).map(() => Array(9).fill(null));

export const isValid = (grid: Grid, row: number, col: number, num: number): boolean => {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }
  const sr = Math.floor(row / 3) * 3;
  const sc = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (grid[sr + i][sc + j] === num) return false;
  return true;
};

export const solveGrid = (grid: Grid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveGrid(grid)) return true;
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const generateFullBoard = (): Grid => {
  const grid = getEmptyGrid();
  for (let box = 0; box < 9; box += 3) {
    const nums = shuffle([1,2,3,4,5,6,7,8,9]);
    let idx = 0;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        grid[box + i][box + j] = nums[idx++];
  }
  solveGrid(grid);
  return grid;
};

export const generatePuzzle = (difficulty: Difficulty = 'easy'): { puzzle: Grid; solution: Grid } => {
  const solution = generateFullBoard();
  const puzzle = solution.map(r => [...r]);
  const toRemove = 81 - DIFFICULTY_CONFIG[difficulty].clues;
  const positions = shuffle(Array.from({ length: 81 }, (_, i) => i));
  for (let i = 0; i < toRemove; i++) {
    const r = Math.floor(positions[i] / 9);
    const c = positions[i] % 9;
    puzzle[r][c] = null;
  }
  return { puzzle, solution };
};

export const checkWin = (grid: Grid): boolean => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === null) return false;
      const v = grid[r][c]!;
      grid[r][c] = null;
      if (!isValid(grid, r, c, v)) { grid[r][c] = v; return false; }
      grid[r][c] = v;
    }
  }
  return true;
};

export const getErrors = (grid: Grid): boolean[][] =>
  grid.map((row, r) =>
    row.map((val, c) => {
      if (val === null) return false;
      const copy = grid.map(x => [...x]);
      copy[r][c] = null;
      return !isValid(copy, r, c, val);
    })
  );

export interface SolveStep { row: number; col: number; val: number; }

export const getSolveSteps = (puzzle: Grid): SolveStep[] => {
  const grid = puzzle.map(r => [...r]);
  const steps: SolveStep[] = [];
  const solve = (g: Grid): boolean => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (g[r][c] === null) {
          for (let n = 1; n <= 9; n++) {
            if (isValid(g, r, c, n)) {
              g[r][c] = n;
              steps.push({ row: r, col: c, val: n });
              if (solve(g)) return true;
              g[r][c] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  solve(grid);
  return steps;
};

export const getHint = (grid: Grid, solution: Grid): { row: number; col: number; val: number } | null => {
  const empty: [number, number][] = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (grid[r][c] === null) empty.push([r, c]);
  if (!empty.length) return null;
  const [row, col] = empty[Math.floor(Math.random() * empty.length)];
  return { row, col, val: solution[row][col]! };
};

export const getNumberCounts = (grid: Grid): Record<number, number> => {
  const counts: Record<number, number> = {};
  for (let n = 1; n <= 9; n++) counts[n] = 0;
  for (const row of grid)
    for (const cell of row)
      if (cell !== null) counts[cell]++;
  return counts;
};
