import type { Difficulty } from './sudoku';

const BEST_TIMES_KEY = 'sudoku_best_times';
const STATS_KEY = 'sudoku_stats';

export interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
}

export const getBestTimes = (): Record<Difficulty, number | null> => {
  try {
    const stored = localStorage.getItem(BEST_TIMES_KEY);
    return stored ? JSON.parse(stored) : { easy: null, medium: null, hard: null, expert: null };
  } catch {
    return { easy: null, medium: null, hard: null, expert: null };
  }
};

export const saveBestTime = (difficulty: Difficulty, seconds: number): boolean => {
  const times = getBestTimes();
  if (times[difficulty] === null || seconds < times[difficulty]!) {
    times[difficulty] = seconds;
    localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(times));
    return true;
  }
  return false;
};

export const getStats = (): Stats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    return stored ? JSON.parse(stored) : { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, bestStreak: 0 };
  } catch {
    return { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, bestStreak: 0 };
  }
};

export const saveStats = (stats: Stats): void => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};
