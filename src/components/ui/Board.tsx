import { Cell } from './Cell';
import { useGameStore } from '../../store/gameStore';

export const Board = () => {
  const { grid } = useGameStore();
  if (!grid.length) return null;

  const getBorderClass = (row: number, col: number) => {
    let cls = 'cell-wrapper';
    if (col % 3 === 2 && col !== 8) cls += ' border-right-box';
    if (row % 3 === 2 && row !== 8) cls += ' border-bottom-box';
    return cls;
  };

  return (
    <div className="sudoku-board" role="grid" aria-label="Sudoku Board">
      {grid.map((row, rIdx) => (
        <div key={rIdx} className="sudoku-row" role="row">
          {row.map((_, cIdx) => (
            <div key={cIdx} className={getBorderClass(rIdx, cIdx)}>
              <Cell row={rIdx} col={cIdx} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
