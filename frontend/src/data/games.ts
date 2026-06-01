export interface GameItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
}

export const games: GameItem[] = [
  {
    id: "tictactoe",
    title: "Tic Tac Toe",
    description: "classic cozy strategy",
    iconName: "Grid",
    color: "from-pink-200 to-violet-200",
  },
  {
    id: "connect4",
    title: "Connect 4",
    description: "drop & connect",
    iconName: "Columns3",
    color: "from-sky-200 to-cyan-200",
  },
  {
    id: "wordle",
    title: "Wordle",
    description: "guess the hidden word",
    iconName: "Type",
    color: "from-emerald-200 to-lime-200",
  },
  {
    id: "colormemory",
    title: "Color Memory",
    description: "remember the sequence",
    iconName: "Palette",
    color: "from-orange-200 to-pink-200",
  },
  {
    id: "slidepuzzle",
    title: "Slide Puzzle",
    description: "rearrange the tiles",
    iconName: "LayoutGrid",
    color: "from-yellow-200 to-orange-200",
  },
  {
    id: "sudoku",
    title: "Sudoku",
    description: "relax & solve",
    iconName: "Binary",
    color: "from-violet-200 to-indigo-200",
  },
];