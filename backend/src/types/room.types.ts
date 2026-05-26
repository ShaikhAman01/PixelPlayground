export interface Player {
  id: string;

  username: string;

  connected: boolean;
}


export interface Room {
  id: string;

  players: Player[];

  maxPlayers: number;

  gameState: unknown;

  createdAt: number;
}