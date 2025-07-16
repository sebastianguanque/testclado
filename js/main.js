// main.js

import { Game } from "./classes/Game.js";

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game(); // Ya no necesita pasar parámetros

  setInterval(() => {
    if (game.gameState.isGameActive && game.gameState.startTime) {
      const elapsedSeconds = Math.floor(
        (Date.now() - game.gameState.startTime) / 1000
      );
      game.tileManager.updateTiempo(elapsedSeconds);
    }
  }, 1000);
});
