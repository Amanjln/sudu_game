import { useState, useEffect, useCallback } from 'react';
import { Board } from './components/Board';
import { generatePuzzle, isValid, checkWin, type Grid } from './utils/sudoku';

function App() {
  const [grid, setGrid] = useState<Grid>([]);
  const [initialGrid, setInitialGrid] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [gameWon, setGameWon] = useState(false);

  const startNewGame = useCallback(() => {
    const { puzzle } = generatePuzzle();
    setInitialGrid(puzzle.map(r => [...r]));
    setGrid(puzzle.map(r => [...r]));
    setSelectedCell(null);
    setGameWon(false);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleChange = (row: number, col: number, val: number | null) => {
    if (gameWon) return;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = val;
    setGrid(newGrid);

    if (checkWin(newGrid)) {
      setGameWon(true);
    }
  };

  const errors = grid.map((row, rIdx) => 
    row.map((val, cIdx) => {
      if (val === null) return false;
      const newGrid = grid.map(r => [...r]);
      newGrid[rIdx][cIdx] = null; // Temporarily remove to check valid
      return !isValid(newGrid, rIdx, cIdx, val);
    })
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell || gameWon) return;
      const [r, c] = selectedCell;
      if (e.key === "Backspace" || e.key === "Delete") {
        if (initialGrid[r][c] === null) handleChange(r, c, null);
      } else if (/^[1-9]$/.test(e.key)) {
        if (initialGrid[r][c] === null) handleChange(r, c, parseInt(e.key, 10));
      } else if (e.key === "ArrowUp" && r > 0) {
        setSelectedCell([r - 1, c]);
      } else if (e.key === "ArrowDown" && r < 8) {
        setSelectedCell([r + 1, c]);
      } else if (e.key === "ArrowLeft" && c > 0) {
        setSelectedCell([r, c - 1]);
      } else if (e.key === "ArrowRight" && c < 8) {
        setSelectedCell([r, c + 1]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, grid, initialGrid, gameWon]);

  if (grid.length === 0) return <div className="loading">Loading...</div>;

  return (
    <div className="app-container">
      <header className="header">
        <h1>Sudoku</h1>
        <p>Fill the 9×9 grid with numbers 1-9 so each row, column, and 3×3 box has no repeats.</p>
      </header>
      
      <main className="main-content">
        <Board 
          grid={grid}
          initialGrid={initialGrid}
          selectedCell={selectedCell}
          errors={errors}
          onChange={handleChange}
          onSelect={(r, c) => setSelectedCell([r, c])}
        />
        
        <div className="controls">
          <button className="btn-primary" onClick={startNewGame}>New Game</button>
        </div>

        {gameWon && (
          <div className="victory-overlay">
            <div className="victory-modal">
              <h2>Congratulations!</h2>
              <p>You have successfully solved the puzzle.</p>
              <button className="btn-primary" onClick={startNewGame}>Play Again</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
