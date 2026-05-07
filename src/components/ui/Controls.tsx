import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { DIFFICULTY_CONFIG, type Difficulty } from '../../utils/sudoku';

export const Controls = () => {
  const {
    difficulty, isNoteMode, hintsRemaining, isSolving, gameWon,
    undoStack, redoStack,
    setDifficulty, startNewGame, toggleNoteMode, useHint, undo, redo, autoSolve,
  } = useGameStore();

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

  return (
    <div className="controls-panel">
      {/* Difficulty Selector */}
      <div className="difficulty-tabs">
        {difficulties.map((d) => (
          <motion.button
            key={d}
            className={`diff-tab ${difficulty === d ? 'active' : ''}`}
            style={difficulty === d ? { borderColor: DIFFICULTY_CONFIG[d].color, color: DIFFICULTY_CONFIG[d].color } : {}}
            onClick={() => setDifficulty(d)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {DIFFICULTY_CONFIG[d].label}
          </motion.button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <motion.button
          className="action-btn"
          onClick={() => startNewGame()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="New Game"
        >
          🔄 New
        </motion.button>

        <motion.button
          className={`action-btn ${undoStack.length === 0 ? 'disabled' : ''}`}
          onClick={undo}
          disabled={undoStack.length === 0}
          whileHover={undoStack.length > 0 ? { scale: 1.05 } : {}}
          whileTap={undoStack.length > 0 ? { scale: 0.95 } : {}}
          title="Undo (Ctrl+Z)"
        >
          ↩ Undo
        </motion.button>

        <motion.button
          className={`action-btn ${redoStack.length === 0 ? 'disabled' : ''}`}
          onClick={redo}
          disabled={redoStack.length === 0}
          whileHover={redoStack.length > 0 ? { scale: 1.05 } : {}}
          whileTap={redoStack.length > 0 ? { scale: 0.95 } : {}}
          title="Redo (Ctrl+Y)"
        >
          ↪ Redo
        </motion.button>

        <motion.button
          className={`action-btn note-btn ${isNoteMode ? 'active-note' : ''}`}
          onClick={toggleNoteMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Toggle Note Mode"
        >
          ✏️ {isNoteMode ? 'Notes ON' : 'Notes'}
        </motion.button>

        <motion.button
          className={`action-btn hint-btn ${hintsRemaining === 0 ? 'disabled' : ''}`}
          onClick={useHint}
          disabled={hintsRemaining === 0 || gameWon}
          whileHover={hintsRemaining > 0 ? { scale: 1.05 } : {}}
          whileTap={hintsRemaining > 0 ? { scale: 0.95 } : {}}
          title={`Hint (${hintsRemaining} left)`}
        >
          💡 Hint
          <span className="hint-badge">{hintsRemaining}</span>
        </motion.button>

        <motion.button
          className={`action-btn solve-btn ${isSolving ? 'solving' : ''}`}
          onClick={autoSolve}
          disabled={isSolving || gameWon}
          whileHover={!isSolving && !gameWon ? { scale: 1.05 } : {}}
          whileTap={!isSolving && !gameWon ? { scale: 0.95 } : {}}
          title="Auto Solve"
        >
          {isSolving ? '⚡ Solving…' : '🤖 Solve'}
        </motion.button>
      </div>
    </div>
  );
};
