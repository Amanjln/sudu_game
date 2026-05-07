import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { DIFFICULTY_CONFIG } from '../../utils/sudoku';
import { formatTime } from '../../utils/storage';

export const StatsPanel = () => {
  const { showStats, bestTimes, stats, toggleStats } = useGameStore();
  const difficulties = ['easy', 'medium', 'hard', 'expert'] as const;

  return (
    <>
      <motion.button
        className="stats-toggle-btn"
        onClick={toggleStats}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Stats"
      >
        📊 Stats
      </motion.button>

      <AnimatePresence>
        {showStats && (
          <>
            <motion.div
              className="stats-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleStats}
            />
            <motion.div
              className="stats-panel"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="stats-header">
                <h2>📊 Statistics</h2>
                <button className="close-btn" onClick={toggleStats}>✕</button>
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-value">{stats.gamesPlayed}</span>
                  <span className="stat-label">Played</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{stats.gamesWon}</span>
                  <span className="stat-label">Won</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">
                    {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
                  </span>
                  <span className="stat-label">Win Rate</span>
                </div>
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-value">{stats.currentStreak}</span>
                  <span className="stat-label">🔥 Streak</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{stats.bestStreak}</span>
                  <span className="stat-label">🏆 Best</span>
                </div>
              </div>

              <h3 className="best-times-title">⚡ Best Times</h3>
              <div className="best-times-list">
                {difficulties.map((d) => (
                  <div key={d} className="best-time-row">
                    <span className="diff-label" style={{ color: DIFFICULTY_CONFIG[d].color }}>
                      {DIFFICULTY_CONFIG[d].label}
                    </span>
                    <span className="best-time-val">
                      {bestTimes[d] !== null ? formatTime(bestTimes[d]!) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
