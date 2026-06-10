interface VerificationPayload {
  movesCount: number;
  gameType: string;
  boardSnapshot: string[];
}

export class GameService {
  public static verifySessionAuthenticity(data: VerificationPayload): boolean {
    const { movesCount, gameType } = data;

    // Fast algorithmic verification gates
    if (gameType === "tictactoe") {
      if (movesCount < 3 || movesCount > 9) return false; // Impossible states
    }

    if (gameType === "wordle") {
      if (movesCount < 1 || movesCount > 6) return false;
    }

    return true;
  }
}