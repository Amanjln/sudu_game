import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { DIFFICULTY_CONFIG } from '../../utils/sudoku';
import { formatTime } from '../../utils/storage';

export const VictoryModal = () => {
  const { gameWon, timer, difficulty, mistakeCount, hintsRemaining, isNewRecord, startNewGame } = useGameStore();

  if (!gameWon) return null;

  const shareText = `🧩 Sudoku ${DIFFICULTY_CONFIG[difficulty].label} completed!\n⏱ Time: ${formatTime(timer)}\n💡 Hints used: ${3 - hintsRemaining}\n❌ Mistakes: ${mistakeCount}\n${isNewRecord ? '🏆 New Personal Best!\n' : ''}Built with React + Three.js\n#Sudoku #Portfolio #WebDev`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard! Paste on LinkedIn 🚀');
    }
  };

  return (
    <motion.div
      className="victory-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="victory-modal"
        initial={{ scale: 0.5, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
      >
        <motion.div
          className="victory-emoji"
          animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          🏆
        </motion.div>

        <h2 className="victory-title">Puzzle Solved!</h2>

        {isNewRecord && (
          <motion.div
            className="new-record-banner"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.6 }}
          >
            ⚡ New Personal Best!
          </motion.div>
        )}

        <div className="victory-stats">
          <div className="v-stat">
            <span className="v-stat-icon">⏱</span>
            <span className="v-stat-value">{formatTime(timer)}</span>
            <span className="v-stat-label">Time</span>
          </div>
          <div className="v-stat">
            <span className="v-stat-icon">🎯</span>
            <span className="v-stat-value" style={{ color: DIFFICULTY_CONFIG[difficulty].color }}>
              {DIFFICULTY_CONFIG[difficulty].label}
            </span>
            <span className="v-stat-label">Difficulty</span>
          </div>
          <div className="v-stat">
            <span className="v-stat-icon">❌</span>
            <span className="v-stat-value">{mistakeCount}</span>
            <span className="v-stat-label">Mistakes</span>
          </div>
          <div className="v-stat">
            <span className="v-stat-icon">💡</span>
            <span className="v-stat-value">{3 - hintsRemaining}</span>
            <span className="v-stat-label">Hints</span>
          </div>
        </div>

        <div className="victory-actions">
          <motion.button
            className="btn-primary"
            onClick={() => startNewGame()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            🎮 Play Again
          </motion.button>
          <motion.button
            className="btn-share"
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            🔗 Share on LinkedIn
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
