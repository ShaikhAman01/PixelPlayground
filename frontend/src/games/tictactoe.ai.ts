import { Cell } from "./tictactoe.engine";

// Checks terminal states for minimax optimization
const checkTerminals = (board: Cell[]): "X" | "O" | "DRAW" | null => {
  const combos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  for (const [a, b, c] of combos) {
    if (board[a] && board[a] === board[b] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as "X" | "O";
    }
  }
  if (board.every(cell => cell !== null)) return "DRAW";
  return null;
};

// Perfect Unbeatable Minimax
const minimax = (board: Cell[], depth: number, isMax: boolean): number => {
  const score = checkTerminals(board);
  if (score === "O") return 10 - depth;
  if (score === "X") return depth - 10;
  if (score === "DRAW") return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X";
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
};

const getRandomMove = (board: Cell[]): number | null => {
  const empty = board.map((c, i) => c === null ? i : null).filter(v => v !== null) as number[];
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
};

const getBestMove = (board: Cell[]): number | null => {
  let bestVal = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = "O";
      let moveVal = minimax(board, 0, false);
      board[i] = null;
      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = i;
      }
    }
  }
  return bestMove;
};

export const getCpuMove = (board: Cell[], difficulty: "EASY" | "MEDIUM" | "HARD"): number | null => {
  if (difficulty === "EASY") {
    return getRandomMove(board);
  }
  if (difficulty === "MEDIUM") {
    return Math.random() < 0.5 ? getBestMove(board) : getRandomMove(board);
  }
  return getBestMove(board); 
};