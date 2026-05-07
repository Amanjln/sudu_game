import { useEffect } from 'react';
import './App.css';
import { Scene3D } from './components/3d/Scene3D';
import { Board } from './components/ui/Board';
import { NumberPad } from './components/ui/NumberPad';
import { Controls } from './components/ui/Controls';
import { Timer } from './components/ui/Timer';
import { StatsPanel } from './components/ui/StatsPanel';
import { VictoryModal } from './components/ui/VictoryModal';
import { useGameStore } from './store/gameStore';

function App() {
  const {
    grid, selectedCell, initialGrid, gameWon, isSolving, isPaused,
    mistakeCount, theme,
    startNewGame, selectCell, enterNumber, undo, redo,
    toggleNoteMode, toggleTheme, resumeGame,
  } = useGameStore();

  /* ── Bootstrap ──────────────────────────────── */
  useEffect(() => { startNewGame('easy'); }, []);

  /* ── Apply theme class to <html> ─────────────── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* ── Global keyboard handler ──────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameWon || isSolving) return;

      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); return; }
      if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); redo(); return; }
      if (e.key === 'n' || e.key === 'N') { toggleNoteMode(); return; }

      if (!selectedCell) return;
      const [r, c] = selectedCell;

      if (/^[1-9]$/.test(e.key)) {
        if (initialGrid[r]?.[c] === null) enterNumber(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        if (initialGrid[r]?.[c] === null) enterNumber(null);
      } else if (e.key === 'ArrowUp'    && r > 0) selectCell(r - 1, c);
      else if (e.key === 'ArrowDown'  && r < 8) selectCell(r + 1, c);
      else if (e.key === 'ArrowLeft'  && c > 0) selectCell(r, c - 1);
      else if (e.key === 'ArrowRight' && c < 8) selectCell(r, c + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedCell, grid, initialGrid, gameWon, isSolving, enterNumber, selectCell, undo, redo, toggleNoteMode]);

  if (!grid.length) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Orbitron, monospace', color: '#00f5ff', fontSize: '1.2rem', letterSpacing: '0.1em',
      }}>
        Initializing…
      </div>
    );
  }

  return (
    <>
      {/* ── 3D Background Canvas ──────────────────── */}
      <Scene3D />

      {/* ── Glassmorphism Game Panel ──────────────── */}
      <div className="app-wrapper">
        <div className="game-panel">

          {/* Header */}
          <header className="game-header">
            <h1 className="game-logo">SUDOKU 3D</h1>

            <div className="header-right">
              <Timer />

              {/* Mistakes */}
              <div className="mistake-counter">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className={`mistake-dot ${mistakeCount > i ? '' : 'empty'}`}
                  />
                ))}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {mistakeCount} mistake{mistakeCount !== 1 ? 's' : ''}
                </span>
              </div>

              <button className="theme-btn" onClick={toggleTheme} title="Toggle Theme">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              <StatsPanel />
            </div>
          </header>

          {/* Controls */}
          <Controls />

          {/* Main Game Body */}
          <main className="game-body" style={{ position: 'relative' }}>
            {/* Pause Overlay */}
            {isPaused && (
              <div className="pause-overlay">
                <h2>⏸ Paused</h2>
                <button className="btn-primary" onClick={resumeGame}>▶ Resume</button>
              </div>
            )}

            <Board />
            <NumberPad />
          </main>

          {/* Footer */}
          <footer className="game-footer">
            {isSolving ? (
              <div className="solving-indicator">
                <span className="solving-dot" />
                <span className="solving-dot" style={{ animationDelay: '0.2s' }} />
                <span className="solving-dot" style={{ animationDelay: '0.4s' }} />
                Auto-solving…
              </div>
            ) : (
              <span>Arrows to navigate · N to toggle notes · Ctrl+Z undo</span>
            )}

          </footer>
        </div>
      </div>

      {/* Victory Modal */}
      <VictoryModal />
    </>
  );
}

export default App;
