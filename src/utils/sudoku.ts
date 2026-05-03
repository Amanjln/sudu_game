export type Grid = (number | null)[][];

export const getEmptyGrid = (): Grid => Array(9).fill(null).map(() => Array(9).fill(null));

export const isValid = (grid: Grid, row: number, col: number, num: number): boolean => {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }
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
            grid[row][col] = null; // Backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
};

const fillBox = (grid: Grid, rowStart: number, colStart: number) => {
  let num: number;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9) + 1;
      } while (!isSafeInBox(grid, rowStart, colStart, num));
      grid[rowStart + i][colStart + j] = num;
    }
  }
};

const isSafeInBox = (grid: Grid, rowStart: number, colStart: number, num: number) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[rowStart + i][colStart + j] === num) return false;
    }
  }
  return true;
};

export const generateFullBoard = (): Grid => {
  const grid = getEmptyGrid();
  // Fill diagonal 3x3 matrices to randomize the board
  for (let i = 0; i < 9; i += 3) {
    fillBox(grid, i, i);
  }
  solveGrid(grid);
  return grid;
};

export const generatePuzzle = (): { puzzle: Grid, solution: Grid } => {
  const solution = generateFullBoard();
  const puzzle = solution.map(row => [...row]);
  
  // Remove 40 cells for easy difficulty
  let attempts = 40; 
  while (attempts > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    while (puzzle[row][col] === null) {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    }
    puzzle[row][col] = null;
    attempts--;
  }
  return { puzzle, solution };
};

export const checkWin = (grid: Grid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) return false;
      // Temporarily clear the cell to check if it's still valid (no duplicates)
      const val = grid[row][col];
      grid[row][col] = null;
      if (!isValid(grid, row, col, val!)) {
        grid[row][col] = val;
        return false;
      }
      grid[row][col] = val;
    }
  }
  return true;
};
