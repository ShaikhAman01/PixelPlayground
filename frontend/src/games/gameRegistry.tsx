import { SoloTicTacToe } from "@/components/game/SoloTicTacToe";

import { SoloConnect4 } from "@/components/game/SoloConnect4";
import { ColorMemory } from "@/components/game/ColorMemory";
import { SlidePuzzle } from "@/components/game/SlidePuzzle";
import { WordleGame } from "@/components/game/WordleGame";
import { Game2048 } from "@/components/game/Game2048";

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

game2048: {
  title: "2048",

  component:
    Game2048,
},
};