import React from 'react';
import './ControlPanel.css';

const ControlPanel = ({ 
  onNumberClick, 
  onDelete, 
  notesMode, 
  onToggleNotes, 
  onNewGame, 
  onCheck, 
  onShare,
  difficulty,
  onDifficultyChange
}) => {
  
  return (
    <div className="control-panel">
      <div className="numpad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button 
            key={num} 
            className="btn-num"
            onClick={() => onNumberClick(num)}
          >
            {num}
          </button>
        ))}
      </div>
      
      <div className="actions">
        <button 
          className={`btn-action ${notesMode ? 'active' : ''}`}
          onClick={onToggleNotes}
        >
          {notesMode ? '✏️ Notes (ON)' : '🖊️ Pen (ON)'}
        </button>
        <button className="btn-action" onClick={onDelete}>
          ⌫ Delete
        </button>
        <button className="btn-action" onClick={onCheck}>
          ✓ Check
        </button>
        <button className="btn-action" onClick={onShare}>
          🔗 Share URL
        </button>
      </div>

      <div className="settings">
        <div className="difficulty-slider">
          <label>Difficulty (empty cells): {difficulty}</label>
          <input 
            type="range" 
            min="20" 
            max="60" 
            value={difficulty} 
            onChange={onDifficultyChange} 
          />
        </div>
        <button className="btn-new-game" onClick={onNewGame}>
          New Game
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
