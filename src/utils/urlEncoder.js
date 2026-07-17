export const encodeBoard = (board) => {
  return board.flat().join('');
}

export const decodeBoard = (str) => {
  if (!str || str.length !== 81) return null;
  const board = [];
  for (let i = 0; i < 9; i++) {
    const rowStr = str.substring(i * 9, i * 9 + 9);
    board.push(rowStr.split('').map(Number));
  }
  return board;
}
