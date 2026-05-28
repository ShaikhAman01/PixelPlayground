import { SoloTicTacToe } from "@/components/game/SoloTicTacToe";

export const gameRegistry = {
  tictactoe: {
    title: "Tic Tac Toe",

    component:
      SoloTicTacToe,
  },

  connect4: {
    title: "Connect 4",

    component: () => (
      <div className="text-4xl text-slate-500">
        Connect 4 Coming Soon
      </div>
    ),
  },

  wordle: {
    title: "Wordle",

    component: () => (
      <div className="text-4xl text-slate-500">
        Wordle Coming Soon
      </div>
    ),
  },

  "color-memory": {
    title:
      "Color Memory",

    component: () => (
      <div className="text-4xl text-slate-500">
        Color Memory Coming Soon
      </div>
    ),
  },

  "slide-puzzle": {
    title:
      "Slide Puzzle",

    component: () => (
      <div className="text-4xl text-slate-500">
        Slide Puzzle Coming Soon
      </div>
    ),
  },

  sudoku: {
    title: "Sudoku",

    component: () => (
      <div className="text-4xl text-slate-500">
        Sudoku Coming Soon
      </div>
    ),
  },
};