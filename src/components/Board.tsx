import type React from 'react';
import { Cell } from './Cell';
import type { Grid } from '../utils/sudoku';

interface BoardProps {
  grid: Grid;
  initialGrid: Grid;
  selectedCell: [number, number] | null;
  errors: boolean[][];
  onChange: (row: number, col: number, val: number | null) => void;
  onSelect: (row: number, col: number) => void;
}

export const Board: React.FC<BoardProps> = ({ grid, initialGrid, selectedCell, errors, onChange, onSelect }) => {
  return (
    <div className="sudoku-board">
      {grid.map((row, rIdx) => (
        <div key={rIdx} className="sudoku-row">
          {row.map((cell, cIdx) => {
            const isSelected = selectedCell?.[0] === rIdx && selectedCell?.[1] === cIdx;
            const isHighlighted = selectedCell ? 
              (selectedCell[0] === rIdx || selectedCell[1] === cIdx || 
               (Math.floor(selectedCell[0]/3) === Math.floor(rIdx/3) && Math.floor(selectedCell[1]/3) === Math.floor(cIdx/3))) 
              : false;

            return (
              <Cell 
                key={`${rIdx}-${cIdx}`}
                value={cell}
                isInitial={initialGrid[rIdx][cIdx] !== null}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                isError={errors[rIdx][cIdx]}
                onChange={(val) => onChange(rIdx, cIdx, val)}
                onSelect={() => onSelect(rIdx, cIdx)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
