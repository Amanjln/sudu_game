import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { getNumberCounts } from '../../utils/sudoku';

export const NumberPad = () => {
  const { grid, selectedCell, initialGrid, gameWon, isSolving, enterNumber } = useGameStore();
  const counts = getNumberCounts(grid);

  const canEnter = selectedCell && !gameWon && !isSolving &&
    initialGrid[selectedCell[0]]?.[selectedCell[1]] === null;

  return (
    <div className="number-pad">
      <div className="number-pad-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const isComplete = counts[num] === 9;
          return (
            <motion.button
              key={num}
              className={`num-btn ${isComplete ? 'complete' : ''}`}
              onClick={() => canEnter && enterNumber(num)}
              disabled={!canEnter || isComplete}
              whileHover={!isComplete && canEnter ? { scale: 1.08, y: -2 } : {}}
              whileTap={!isComplete && canEnter ? { scale: 0.94 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <span className="num-btn-value">{num}</span>
              <span className="num-btn-count">{9 - counts[num]}</span>
            </motion.button>
          );
        })}
      </div>
      <motion.button
        className="erase-btn"
        onClick={() => canEnter && enterNumber(null)}
        disabled={!canEnter}
        whileHover={canEnter ? { scale: 1.04 } : {}}
        whileTap={canEnter ? { scale: 0.96 } : {}}
      >
        ⌫ Erase
      </motion.button>
    </div>
  );
};
