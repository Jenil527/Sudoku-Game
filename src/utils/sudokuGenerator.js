const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const isValid = (board, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
    const boxCol = Math.floor(col / 3) * 3 + i % 3;
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

const fillBoard = (board) => {
  for (let i = 0; i < 81; i++) {
    const row = Math.floor(i / 9);
    const col = i % 9;
    if (board[row][col] === 0) {
      const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (let num of numbers) {
        if (isValid(board, row, col, num)) {
          board[row][col] = num;
          if (fillBoard(board)) {
            return true;
          }
          board[row][col] = 0;
        }
      }
      return false; // Backtrack
    }
  }
  return true;
}

const countSolutions = (board, limit = 2) => {
  let count = 0;
  
  const solve = (b) => {
    for (let i = 0; i < 81; i++) {
      const row = Math.floor(i / 9);
      const col = i % 9;
      if (b[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(b, row, col, num)) {
            b[row][col] = num;
            solve(b);
            if (count >= limit) return;
            b[row][col] = 0;
          }
        }
        return; // Backtrack
      }
    }
    count++;
  }
  
  solve(board);
  return count;
}

export const generateSudoku = (difficulty = 40) => {
  // 1. Initialize empty board
  let board = Array(9).fill().map(() => Array(9).fill(0));
  
  // 2. Fill completely
  fillBoard(board);
  
  // Save full solution
  const solution = board.map(row => [...row]);
  
  // 3. Remove elements randomly while maintaining unique solution
  let cells = [];
  for (let i = 0; i < 81; i++) cells.push(i);
  shuffle(cells);
  
  let cellsToRemove = Math.min(difficulty, 64); // Don't remove too many, max 64 removed (17 clues minimum for unique Sudoku)
  
  for (let cell of cells) {
    if (cellsToRemove <= 0) break;
    
    const row = Math.floor(cell / 9);
    const col = cell % 9;
    
    const backup = board[row][col];
    board[row][col] = 0;
    
    // Create copy for solver
    const copy = board.map(r => [...r]);
    const numSolutions = countSolutions(copy, 2);
    
    if (numSolutions !== 1) {
      // Not unique, put it back
      board[row][col] = backup;
    } else {
      cellsToRemove--;
    }
  }
  
  return {
    puzzle: board,
    solution: solution
  };
}
