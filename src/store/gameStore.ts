import { create } from 'zustand';
import {
  generatePuzzle, checkWin, getHint, getSolveSteps,
  getErrors, type Grid, type Difficulty,
} from '../utils/sudoku';
import { saveBestTime, getBestTimes, getStats, saveStats, type Stats } from '../utils/storage';

type Notes = Record<string, number[]>;
type HistoryEntry = { grid: Grid; notes: Notes };

interface GameStore {
  grid: Grid;
  initialGrid: Grid;
  solution: Grid;
  errors: boolean[][];
  selectedCell: [number, number] | null;
  difficulty: Difficulty;
  notes: Notes;
  isNoteMode: boolean;
  timer: number;
  isRunning: boolean;
  isPaused: boolean;
  gameWon: boolean;
  mistakeCount: number;
  hintsRemaining: number;
  isSolving: boolean;
  solveVersion: number;
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  bestTimes: Record<Difficulty, number | null>;
  stats: Stats;
  isNewRecord: boolean;
  theme: 'dark' | 'light';
  showStats: boolean;

  startNewGame: (difficulty?: Difficulty) => void;
  setDifficulty: (d: Difficulty) => void;
  selectCell: (row: number, col: number) => void;
  enterNumber: (num: number | null) => void;
  toggleNoteMode: () => void;
  useHint: () => void;
  undo: () => void;
  redo: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  tickTimer: () => void;
  toggleTheme: () => void;
  toggleStats: () => void;
  autoSolve: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  grid: [],
  initialGrid: [],
  solution: [],
  errors: [],
  selectedCell: null,
  difficulty: 'easy',
  notes: {},
  isNoteMode: false,
  timer: 0,
  isRunning: false,
  isPaused: false,
  gameWon: false,
  mistakeCount: 0,
  hintsRemaining: 3,
  isSolving: false,
  solveVersion: 0,
  undoStack: [],
  redoStack: [],
  bestTimes: getBestTimes(),
  stats: getStats(),
  isNewRecord: false,
  theme: 'dark',
  showStats: false,

  startNewGame: (difficulty) => {
    const d = difficulty ?? get().difficulty;
    const { puzzle, solution } = generatePuzzle(d);
    set({
      grid: puzzle,
      initialGrid: puzzle.map(r => [...r]),
      solution,
      errors: Array(9).fill(null).map(() => Array(9).fill(false)),
      selectedCell: null,
      difficulty: d,
      notes: {},
      isNoteMode: false,
      timer: 0,
      isRunning: true,
      isPaused: false,
      gameWon: false,
      mistakeCount: 0,
      hintsRemaining: 3,
      isSolving: false,
      solveVersion: get().solveVersion + 1,
      undoStack: [],
      redoStack: [],
      isNewRecord: false,
    });
  },

  setDifficulty: (d) => get().startNewGame(d),

  selectCell: (row, col) => set({ selectedCell: [row, col] }),

  enterNumber: (num) => {
    const { selectedCell, grid, initialGrid, notes, isNoteMode, gameWon, isSolving, undoStack } = get();
    if (!selectedCell || gameWon || isSolving) return;
    const [r, c] = selectedCell;
    if (initialGrid[r][c] !== null) return;

    const key = `${r}-${c}`;

    if (isNoteMode && num !== null) {
      const cellNotes = [...(notes[key] ?? [])];
      const idx = cellNotes.indexOf(num);
      if (idx === -1) cellNotes.push(num);
      else cellNotes.splice(idx, 1);
      set({ notes: { ...notes, [key]: cellNotes } });
      return;
    }

    set({ undoStack: [...undoStack, { grid: grid.map(row => [...row]), notes: { ...notes } }], redoStack: [] });

    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    const newNotes = { ...notes };
    delete newNotes[key];
    const errors = getErrors(newGrid);

    let { mistakeCount } = get();
    if (num !== null && errors[r][c]) mistakeCount++;

    if (checkWin(newGrid)) {
      const { timer, difficulty, stats } = get();
      const isNewRecord = saveBestTime(difficulty, timer);
      const newStats: Stats = {
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon + 1,
        currentStreak: stats.currentStreak + 1,
        bestStreak: Math.max(stats.bestStreak, stats.currentStreak + 1),
      };
      saveStats(newStats);
      set({ grid: newGrid, notes: newNotes, errors, gameWon: true, isRunning: false, isNewRecord, mistakeCount, bestTimes: getBestTimes(), stats: newStats });
    } else {
      set({ grid: newGrid, notes: newNotes, errors, mistakeCount });
    }
  },

  toggleNoteMode: () => set(s => ({ isNoteMode: !s.isNoteMode })),

  useHint: () => {
    const { grid, solution, hintsRemaining, initialGrid, notes, undoStack, gameWon, isSolving } = get();
    if (hintsRemaining <= 0 || gameWon || isSolving) return;
    const hint = getHint(grid, solution);
    if (!hint) return;
    const { row, col, val } = hint;
    if (initialGrid[row][col] !== null) return;

    set({ undoStack: [...undoStack, { grid: grid.map(r => [...r]), notes: { ...notes } }], redoStack: [] });
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = val;
    const newNotes = { ...notes };
    delete newNotes[`${row}-${col}`];
    const errors = getErrors(newGrid);
    const won = checkWin(newGrid);

    if (won) {
      const { timer, difficulty, stats } = get();
      const isNewRecord = saveBestTime(difficulty, timer);
      const newStats: Stats = { gamesPlayed: stats.gamesPlayed + 1, gamesWon: stats.gamesWon + 1, currentStreak: stats.currentStreak + 1, bestStreak: Math.max(stats.bestStreak, stats.currentStreak + 1) };
      saveStats(newStats);
      set({ grid: newGrid, notes: newNotes, errors, gameWon: true, isRunning: false, isNewRecord, hintsRemaining: hintsRemaining - 1, bestTimes: getBestTimes(), stats: newStats });
    } else {
      set({ grid: newGrid, notes: newNotes, errors, hintsRemaining: hintsRemaining - 1, selectedCell: [row, col] });
    }
  },

  undo: () => {
    const { undoStack, redoStack, grid, notes } = get();
    if (!undoStack.length) return;
    const prev = undoStack[undoStack.length - 1];
    set({
      grid: prev.grid, notes: prev.notes, errors: getErrors(prev.grid),
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, { grid: grid.map(r => [...r]), notes: { ...notes } }],
    });
  },

  redo: () => {
    const { undoStack, redoStack, grid, notes } = get();
    if (!redoStack.length) return;
    const next = redoStack[redoStack.length - 1];
    set({
      grid: next.grid, notes: next.notes, errors: getErrors(next.grid),
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, { grid: grid.map(r => [...r]), notes: { ...notes } }],
    });
  },

  pauseGame: () => set({ isPaused: true, isRunning: false }),
  resumeGame: () => set({ isPaused: false, isRunning: true }),

  tickTimer: () => {
    const { isRunning, isPaused, gameWon } = get();
    if (isRunning && !isPaused && !gameWon) set(s => ({ timer: s.timer + 1 }));
  },

  toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  toggleStats: () => set(s => ({ showStats: !s.showStats })),

  autoSolve: () => {
    const { grid, initialGrid, isSolving, gameWon, solveVersion } = get();
    if (isSolving || gameWon) return;

    const steps = getSolveSteps(grid.map(r => [...r]));
    // Capture the version at the moment we START solving.
    // If startNewGame() is called while solving, solveVersion increments
    // and every pending applyStep will see the mismatch and stop.
    const myVersion = solveVersion;
    set({ isSolving: true, isRunning: false });

    const applyStep = (index: number) => {
      // Abort if a new game was started since we began
      if (get().solveVersion !== myVersion) return;

      if (index >= steps.length) {
        const { grid: g } = get();
        set({ isSolving: false, gameWon: checkWin(g.map(r => [...r])), isRunning: false });
        return;
      }
      const { row, col, val } = steps[index];
      const { grid: cur } = get();
      if (initialGrid[row][col] === null && cur[row][col] === null) {
        const ng = cur.map(r => [...r]);
        ng[row][col] = val;
        set({ grid: ng, selectedCell: [row, col] });
      }
      setTimeout(() => applyStep(index + 1), 60);
    };
    setTimeout(() => applyStep(0), 100);
  },
}));
