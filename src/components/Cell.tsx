import React from 'react';

interface CellProps {
  value: number | null;
  isInitial: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isError: boolean;
  onChange: (val: number | null) => void;
  onSelect: () => void;
}

export const Cell: React.FC<CellProps> = ({ 
  value, isInitial, isSelected, isHighlighted, isError, onChange, onSelect 
}) => {
  let classes = "sudoku-cell";
  if (isInitial) classes += " cell-initial";
  if (isSelected) classes += " cell-selected";
  else if (isHighlighted) classes += " cell-highlighted";
  if (isError) classes += " cell-error";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isInitial) return;
    const val = e.target.value.slice(-1); // Get last typed character
    if (val === "" || val === "0") {
      onChange(null);
    } else if (/^[1-9]$/.test(val)) {
      onChange(parseInt(val, 10));
    }
  };

  return (
    <div className={classes} onClick={onSelect}>
      {isInitial ? (
        <span className="cell-text">{value}</span>
      ) : (
        <input 
          type="text"
          className="cell-input"
          value={value || ""}
          onChange={handleChange}
          onFocus={onSelect}
        />
      )}
    </div>
  );
};
