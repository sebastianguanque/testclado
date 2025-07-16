// classes/GameState.js

import { Word } from "./Word.js";

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.words = [];
    this.currentWordIndex = 0;
    this.currentLetterIndex = 0;
    this.startTime = null;
    this.endTime = null;
    this.correctKeysTyped = 0;
    this.incorrectKeysTyped = 0;
    this.isGameActive = false;
    this.currentParagraph = null;
  }

  startGame(paragraph) {
    this.reset();
    this.currentParagraph = paragraph;

    paragraph.forEach((wordString, index) => {
      const wordObj = new Word(wordString);
      this.words.push(wordObj);

      if (index < paragraph.length - 1) {
        const spaceWordObj = new Word(" ");
        this.words.push(spaceWordObj);
      }
    });

    this.isGameActive = true;
    this.startTime = Date.now();
  }

  endGame() {
    if (!this.isGameActive) return;

    this.endTime = Date.now();
    this.isGameActive = false;
  }
}
