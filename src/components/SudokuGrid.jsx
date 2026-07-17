import React from 'react';
import './SudokuGrid.css';

const SudokuGrid = ({ board, initialBoard, notes, selectedCell, onCellClick }) => {
  
  // Helper to render pencil marks
  const renderNotes = (r, c) => {
    const cellNotes = Array.from(notes[r][c]);
    if (cellNotes.length === 0) return null;
    
    return (
      <div className="notes-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <div key={num} className="note-num">
            {cellNotes.includes(num) ? num : ''}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="sudoku-grid">
      {board.map((row, r) => (
        <div key={r} className="grid-row">
          {row.map((val, c) => {
            const isInitial = initialBoard[r][c] !== 0;
            const isSelected = selectedCell?.r === r && selectedCell?.c === c;
            
            // Highlight cells in same row, col, or box as selected
            const isRelated = selectedCell && (
              selectedCell.r === r || 
              selectedCell.c === c ||
              (Math.floor(selectedCell.r / 3) === Math.floor(r / 3) && Math.floor(selectedCell.c / 3) === Math.floor(c / 3))
            );
            
            // Highlight cells with the same number
            const selectedVal = selectedCell ? board[selectedCell.r][selectedCell.c] : 0;
            const isSameNumber = val !== 0 && selectedVal === val;
            
            let classes = "cell";
            if (isInitial) classes += " initial";
            if (isSelected) classes += " selected";
            else if (isSameNumber) classes += " same-number";
            else if (isRelated) classes += " related";
            
            // Add thick borders for 3x3 boxes
            if (c % 3 === 2 && c !== 8) classes += " border-right";
            if (r % 3 === 2 && r !== 8) classes += " border-bottom";

            return (
              <div 
                key={`${r}-${c}`} 
                className={classes}
                onClick={() => onCellClick(r, c)}
              >
                {val !== 0 ? (
                  <span className="cell-value">{val}</span>
                ) : (
                  renderNotes(r, c)
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SudokuGrid;
