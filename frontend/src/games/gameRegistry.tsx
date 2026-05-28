import { SoloTicTacToe } from "@/components/game/SoloTicTacToe";

import { SoloConnect4 } from "@/components/game/SoloConnect4";
import { ColorMemory } from "@/components/game/ColorMemory";

export const gameRegistry = {
  tictactoe: {
    title: "Tic Tac Toe",

    component:
      SoloTicTacToe,
  },

  connect4: {
  title: "Connect 4",

  component:
    SoloConnect4,
},

  wordle: {
    title: "Wordle",

    component: () => (
      <div className="text-4xl text-slate-500">
        Wordle Coming Soon
      </div>
    ),
  },

colormemory: {
  title: "Color Memory",

  component:
    ColorMemory,
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