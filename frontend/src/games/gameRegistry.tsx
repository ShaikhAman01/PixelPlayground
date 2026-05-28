import { SoloTicTacToe } from "@/components/game/SoloTicTacToe";

import { SoloConnect4 } from "@/components/game/SoloConnect4";
import { ColorMemory } from "@/components/game/ColorMemory";
import { SlidePuzzle } from "@/components/game/SlidePuzzle";
import { WordleGame } from "@/components/game/WordleGame";

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

  component:
    WordleGame,
},

colormemory: {
  title: "Color Memory",

  component:
    ColorMemory,
},

slidepuzzle: {
  title:
    "Slide Puzzle",

  component:
    SlidePuzzle,
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