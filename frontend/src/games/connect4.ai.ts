import { Cell } from "./connect4.engine";

export class Connect4AI {
  private rows = 6;
  private cols = 7;

  // Evaluates a 4-window slot segment to compute heuristics scores
  private evaluateWindow(window: Cell[], aiPlayer: "O"): number {
    let score = 0;
    const humanPlayer = "X";

    const aiCount = window.filter((c) => c === aiPlayer).length;
    const emptyCount = window.filter((c) => c === null).length;
    const humanCount = window.filter((c) => c === humanPlayer).length;

    if (aiCount === 4) score += 1000;
    else if (aiCount === 3 && emptyCount === 1) score += 50;
    else if (aiCount === 2 && emptyCount === 2) score += 10;

    if (humanCount === 3 && emptyCount === 1) score -= 80; // High blocking priority

    return score;
  }

  // Scores structural positional advantages across row, column, and diagonal matrices
  private scorePosition(board: Cell[][], aiPlayer: "O"): number {
    let score = 0;

    // Prioritize Middle Column
    const centerArray = board.map((row) => row[3]);
    const centerCount = centerArray.filter((c) => c === aiPlayer).length;
    score += centerCount * 6;

    // Horizontal
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols - 3; c++) {
        const window = [board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]];
        score += this.evaluateWindow(window, aiPlayer);
      }
    }

    // Vertical
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows - 3; r++) {
        const window = [board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]];
        score += this.evaluateWindow(window, aiPlayer);
      }
    }

    // Diagonals
    for (let r = 0; r < this.rows - 3; r++) {
      for (let c = 0; c < this.cols - 3; c++) {
        const window = [board[r][r + c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]];
        score += this.evaluateWindow(window, aiPlayer);
      }
    }
    for (let r = 3; r < this.rows; r++) {
      for (let c = 0; c < this.cols - 3; c++) {
        const window = [board[r][c], board[r - 1][c + 1], board[r - 2][c + 2], board[r - 3][c + 3]];
        score += this.evaluateWindow(window, aiPlayer);
      }
    }

    return score;
  }

  private getNextAvailableRow(board: Cell[][], col: number): number | null {
    for (let r = this.rows - 1; r >= 0; r--) {
      if (board[r][col] === null) return r;
    }
    return null;
  }

  private getValidMoves(board: Cell[][]): number[] {
    const validCols: number[] = [];
    for (let c = 0; c < this.cols; c++) {
      if (board[0][c] === null) validCols.push(c);
    }
    return validCols;
  }

  // Alpha-Beta Pruning Minimax Engine
  private minimax(
    board: Cell[][],
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): { score: number; column: number | null } {
    const validMoves = this.getValidMoves(board);
    const isTerminal = validMoves.length === 0 || depth === 0;

    if (isTerminal) {
      return { score: this.scorePosition(board, "O"), column: null };
    }

    if (isMaximizing) {
      let value = -Infinity;
      let bestColumn = validMoves[0] ?? null;
      for (const col of validMoves) {
        const row = this.getNextAvailableRow(board, col)!;
        board[row][col] = "O";
        const newScore = this.minimax(board, depth - 1, alpha, beta, false).score;
        board[row][col] = null;
        if (newScore > value) {
          value = newScore;
          bestColumn = col;
        }
        alpha = Math.max(alpha, value);
        if (alpha >= beta) break;
      }
      return { score: value, column: bestColumn };
    } else {
      let value = Infinity;
      let bestColumn = validMoves[0] ?? null;
      for (const col of validMoves) {
        const row = this.getNextAvailableRow(board, col)!;
        board[row][col] = "X";
        const newScore = this.minimax(board, depth - 1, alpha, beta, true).score;
        board[row][col] = null;
        if (newScore < value) {
          value = newScore;
          bestColumn = col;
        }
        beta = Math.min(beta, value);
        if (alpha >= beta) break;
      }
      return { score: value, column: bestColumn };
    }
  }

  public getMove(board: Cell[][], difficulty: "EASY" | "MEDIUM" | "HARD"): number | null {
    const validMoves = this.getValidMoves(board);
    if (validMoves.length === 0) return null;

    if (difficulty === "EASY") {
      if (validMoves.includes(3)) return 3; // Center bias
      return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    if (difficulty === "MEDIUM") {
      // 50/50 split between smart look-ahead calculations and casual drops
      if (Math.random() < 0.5) {
        return this.minimax(board, 3, -Infinity, Infinity, true).column;
      }
      return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    // HARD Mode: Runs a 4-level deep minimax tree search
    return this.minimax(board, 4, -Infinity, Infinity, true).column;
  }
}