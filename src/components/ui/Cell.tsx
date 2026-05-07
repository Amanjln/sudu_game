import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

interface CellProps {
  row: number;
  col: number;
}

export const Cell = ({ row, col }: CellProps) => {
  const { grid, initialGrid, selectedCell, errors, notes, isNoteMode, gameWon, selectCell, enterNumber } = useGameStore();
  const value = grid[row]?.[col];
  const isInitial = initialGrid[row]?.[col] !== null;
  const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
  const isError = errors[row]?.[col];
  const cellNotes = notes[`${row}-${col}`] ?? [];

  const isHighlighted = selectedCell
    ? (selectedCell[0] === row || selectedCell[1] === col ||
       (Math.floor(selectedCell[0] / 3) === Math.floor(row / 3) &&
        Math.floor(selectedCell[1] / 3) === Math.floor(col / 3)))
    : false;

  const isSameValue = selectedCell && value !== null && grid[selectedCell[0]]?.[selectedCell[1]] === value;

  const handleClick = () => {
    if (gameWon) return;
    selectCell(row, col);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (gameWon || isInitial) return;
    if (/^[1-9]$/.test(e.key)) enterNumber(parseInt(e.key));
    else if (e.key === 'Backspace' || e.key === 'Delete') enterNumber(null);
  };

  const getCellClass = () => {
    let cls = 'sudoku-cell';
    if (isSelected) cls += ' selected';
    else if (isSameValue) cls += ' same-value';
    else if (isHighlighted) cls += ' highlighted';
    if (isError) cls += ' error';
    if (isInitial) cls += ' initial';
    if (isNoteMode && !isInitial && value === null) cls += ' note-mode';
    return cls;
  };

  return (
    <motion.div
      className={getCellClass()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="gridcell"
      aria-label={`Row ${row + 1} Col ${col + 1}${value ? ` value ${value}` : ' empty'}`}
      animate={isError ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {value !== null ? (
          <motion.span
            key={value}
            className="cell-value"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {value}
          </motion.span>
        ) : cellNotes.length > 0 ? (
          <motion.div
            key="notes"
            className="notes-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
              <span key={n} className={`note-num ${cellNotes.includes(n) ? 'active' : ''}`}>
                {cellNotes.includes(n) ? n : ''}
              </span>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};
