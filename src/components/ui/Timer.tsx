import { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatTime } from '../../utils/storage';

export const Timer = () => {
  const { timer, isRunning, isPaused, gameWon, difficulty, bestTimes, tickTimer, pauseGame, resumeGame } = useGameStore();
  const best = bestTimes[difficulty];

  useEffect(() => {
    if (!isRunning || isPaused || gameWon) return;
    const id = setInterval(tickTimer, 1000);
    return () => clearInterval(id);
  }, [isRunning, isPaused, gameWon, tickTimer]);

  return (
    <div className="timer-section">
      <div className="timer-display">
        <span className="timer-icon">⏱</span>
        <span className={`timer-value ${gameWon ? 'timer-won' : ''}`}>
          {formatTime(timer)}
        </span>
        {!gameWon && isRunning && (
          <button
            className="pause-btn"
            onClick={isPaused ? resumeGame : pauseGame}
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
        )}
      </div>
      {best !== null && (
        <div className="best-time">
          Best: {formatTime(best)}
        </div>
      )}
    </div>
  );
};
