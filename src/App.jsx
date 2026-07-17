import { useState, useEffect } from 'react'
import './App.css'
import { generateSudoku } from './utils/sudokuGenerator'
import { encodeBoard, decodeBoard } from './utils/urlEncoder'
import SudokuGrid from './components/SudokuGrid'
import ControlPanel from './components/ControlPanel'

function App() {
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [initialBoard, setInitialBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [solution, setSolution] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [notes, setNotes] = useState(Array(9).fill().map(() => Array(9).fill().map(() => new Set())));
  const [selectedCell, setSelectedCell] = useState(null);
  const [notesMode, setNotesMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState(40); // Number of cells to remove

  useEffect(() => {
    // Check URL hash for shared game
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/game?code=')) {
      const code = hash.replace('#/game?code=', '');
      const decoded = decodeBoard(code);
      if (decoded) {
        setBoard(decoded);
        setInitialBoard(decoded.map(r => [...r]));
        // We don't have the solution for shared games immediately, but we can compute it if needed.
        // For simplicity, we just won't show solution or we can run the solver in the background.
        setLoading(false);
        return;
      }
    }
    
    // Otherwise generate new game
    startNewGame(difficulty);
  }, []);

  const startNewGame = async (diff) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/generate?difficulty=${diff}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate puzzle from C++ backend.');
      }
      
      const { puzzle, solution: newSolution } = await response.json();
      
      setBoard(puzzle.map(r => [...r]));
      setInitialBoard(puzzle.map(r => [...r]));
      setSolution(newSolution);
      setNotes(Array(9).fill().map(() => Array(9).fill().map(() => new Set())));
      setSelectedCell(null);
      setLoading(false);
      
      // Update URL
      const code = encodeBoard(puzzle);
      window.history.replaceState(null, '', `#/game?code=${code}`);
    } catch (err) {
      alert("Error contacting C++ backend:\n" + err.message + "\n\nDid you run 'node backend/server.js'?");
      setLoading(false);
    }
  };

  const handleCellClick = (r, c) => {
    setSelectedCell({ r, c });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    
    // Can't edit initial clues
    if (initialBoard[r][c] !== 0) return;
    
    if (notesMode) {
      const newNotes = [...notes];
      const cellNotes = new Set(newNotes[r][c]);
      if (cellNotes.has(num)) {
        cellNotes.delete(num);
      } else {
        cellNotes.add(num);
      }
      newNotes[r][c] = cellNotes;
      setNotes(newNotes);
    } else {
      const newBoard = [...board];
      newBoard[r][c] = newBoard[r][c] === num ? 0 : num; // Toggle off if same number
      setBoard(newBoard);
      
      // Clear notes for this cell when a number is placed
      if (newBoard[r][c] !== 0) {
        const newNotes = [...notes];
        newNotes[r][c] = new Set();
        setNotes(newNotes);
      }
    }
  };

  const handleDelete = () => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (initialBoard[r][c] !== 0) return;
    
    const newBoard = [...board];
    newBoard[r][c] = 0;
    setBoard(newBoard);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleDelete();
      } else if (e.key === 'n' || e.key === 'N') {
        setNotesMode(!notesMode);
      }
      // Basic navigation
      if (selectedCell) {
        let { r, c } = selectedCell;
        if (e.key === 'ArrowUp') r = Math.max(0, r - 1);
        if (e.key === 'ArrowDown') r = Math.min(8, r + 1);
        if (e.key === 'ArrowLeft') c = Math.max(0, c - 1);
        if (e.key === 'ArrowRight') c = Math.min(8, c + 1);
        setSelectedCell({ r, c });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, notesMode, board, initialBoard, notes]);

  const checkSolution = () => {
    let isCorrect = true;
    let isComplete = true;
    
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          isComplete = false;
        } else if (solution[r][c] !== 0 && board[r][c] !== solution[r][c]) {
          isCorrect = false;
        }
      }
    }
    
    if (isCorrect && isComplete) {
      alert("Congratulations! You solved it!");
    } else if (isCorrect) {
      alert("Looking good so far! Keep going.");
    } else {
      alert("There are some mistakes.");
    }
  };

  const shareGame = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("Game URL copied to clipboard! Share it with friends.");
    });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Sudoku</h1>
      </header>
      
      <main className="game-container">
        {loading ? (
          <div className="loading">Generating Puzzle...</div>
        ) : (
          <>
            <SudokuGrid 
              board={board} 
              initialBoard={initialBoard} 
              notes={notes}
              selectedCell={selectedCell}
              onCellClick={handleCellClick}
            />
            <ControlPanel 
              onNumberClick={handleNumberInput}
              onDelete={handleDelete}
              notesMode={notesMode}
              onToggleNotes={() => setNotesMode(!notesMode)}
              onNewGame={() => startNewGame(difficulty)}
              onCheck={checkSolution}
              onShare={shareGame}
              difficulty={difficulty}
              onDifficultyChange={(e) => setDifficulty(parseInt(e.target.value))}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default App
