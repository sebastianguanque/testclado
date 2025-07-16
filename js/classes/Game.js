// classes/Game.js

import { TileManager } from "./TileManager.js";
import { Keyboard } from "./Keyboard.js";
import { GameState } from "./GameState.js";
import { getRandomParagraph, isMobileOrTablet } from "../utils.js";
import { validInputKeys, ignoredkeys } from "../constants.js";
import {
  palabrasValueSpan,
  precisionValueSpan,
  tiempoValueSpan,
  palabrasTile,
  precisionTile,
  tiempoTile,
  textAreaInput,
  textAreaText,
  resetButton,
  changeButton,
  mobileStartButton, // Añadido para el constructor de Game
} from "../domElements.js";

export class Game {
  constructor() {
    // Se eliminan los parámetros del constructor original ya que se importan directamente
    this.textAreaInput = textAreaInput;
    this.textAreaText = textAreaText;
    this.resetButton = resetButton;
    this.changeButton = changeButton;
    this.mobileStartButton = mobileStartButton; // Ahora se obtiene de domElements.js

    this.tileManager = new TileManager(
      palabrasValueSpan,
      precisionValueSpan,
      tiempoValueSpan,
      palabrasTile,
      precisionTile,
      tiempoTile
    );
    this.keyboard = new Keyboard();
    this.gameState = new GameState();

    this.setEventListeners();
    this.startNewGameWithRandomParagraph();
    this.handleMobileDisplay();
  }

  setEventListeners() {
    if (isMobileOrTablet()) {
      if (this.mobileStartButton) {
        this.mobileStartButton.addEventListener("click", () => {
          this.activateMobileMode();
        });
      }
    } else {
      document.addEventListener("keydown", () => this.textAreaInput.focus());
    }

    this.textAreaInput.addEventListener("input", (e) => {
      this.handleTextInput(e);
    });

    this.textAreaInput.addEventListener("keydown", (e) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        this.handleBackspace();
        this.updateCursorPosition();
      } else if (e.key === "Enter") {
        e.preventDefault();
        this.handleEnter();
        this.updateCursorPosition();
      }
    });

    this.resetButton.addEventListener("click", () => {
      this.resetGameWithCurrentParagraph();
    });

    this.changeButton.addEventListener("click", () => {
      this.startNewGameWithRandomParagraph();
    });

    window.addEventListener("resize", () => {
      this.handleMobileDisplay();
    });
  }

  activateMobileMode() {
    const mobileStart = document.querySelector(".mobile-start");
    if (mobileStart) {
      mobileStart.classList.add("mobile-start--active");
    }

    this.textAreaInput.focus();

    setTimeout(() => {
      this.textAreaInput.focus();
    }, 100);
  }

  handleTextInput(event) {
    if (!this.gameState.isGameActive) return;

    const typedText = event.target.value;

    if (typedText.length > 0) {
      const typedKey = typedText.charAt(typedText.length - 1);
      event.target.value = "";

      if (validInputKeys.includes(typedKey)) {
        this.processCharacter(typedKey);
        this.updateCursorPosition();
      }
    }
  }

  handleMobileDisplay() {
    const mobileStart = document.querySelector(".mobile-start");
    const keyboardArea = document.querySelector(".keyboard-area");

    if (isMobileOrTablet()) {
      if (keyboardArea) keyboardArea.style.display = "none";
      if (
        mobileStart &&
        !mobileStart.classList.contains("mobile-start--active")
      ) {
        mobileStart.style.display = "flex";
      }
    } else {
      if (keyboardArea) keyboardArea.style.display = "block";
      if (mobileStart) mobileStart.style.display = "none";
    }
  }

  startNewGameWithRandomParagraph() {
    const paragraph = getRandomParagraph();
    this.gameState.startGame(paragraph);
    this.renderWords();
    this.updateCursorPosition();
    this.textAreaInput.value = "";

    if (!isMobileOrTablet()) {
      this.textAreaInput.focus();
    }

    this.tileManager.hideResults();

    if (isMobileOrTablet()) {
      const mobileStart = document.querySelector(".mobile-start");
      if (mobileStart) {
        mobileStart.classList.remove("mobile-start--active");
      }
    }
  }

  resetGameWithCurrentParagraph() {
    const paragraphToUse =
      this.gameState.currentParagraph || getRandomParagraph();
    this.gameState.startGame(paragraphToUse);
    this.renderWords();
    this.updateCursorPosition();
    this.textAreaInput.value = "";

    if (!isMobileOrTablet()) {
      this.textAreaInput.focus();
    }

    this.tileManager.hideResults();

    if (isMobileOrTablet()) {
      const mobileStart = document.querySelector(".mobile-start");
      if (mobileStart) {
        mobileStart.classList.remove("mobile-start--active");
      }
    }
  }

  renderWords() {
    this.textAreaText.innerHTML = "";
    this.gameState.words.forEach((wordObj) => {
      this.textAreaText.append(wordObj.wordElement);
    });
  }

  updateCursorPosition() {
    if (this.currentLetterObj) {
      this.currentLetterObj.removeCursor();
    }

    const currentWord = this.gameState.words[this.gameState.currentWordIndex];
    if (
      currentWord &&
      currentWord.letterObjs[this.gameState.currentLetterIndex]
    ) {
      this.currentLetterObj =
        currentWord.letterObjs[this.gameState.currentLetterIndex];
      this.currentLetterObj.addCursor();
    }
  }

  handleKeyDown(event) {
    const key = event.key;

    if (ignoredkeys.includes(key)) {
      event.preventDefault();
      return;
    }

    if (key === "Backspace") {
      event.preventDefault();
      this.handleBackspace();
      this.updateCursorPosition();
    } else if (key === "Enter") {
      event.preventDefault();
      this.handleEnter();
      this.updateCursorPosition();
    }
  }
  processCharacter(typedKey) {
    const currentWord = this.gameState.words[this.gameState.currentWordIndex];
    if (!currentWord) return;

    const currentLetter =
      currentWord.letterObjs[this.gameState.currentLetterIndex];

    if (currentLetter) {
      if (typedKey === currentLetter.letter) {
        currentLetter.setCorrect();
        this.keyboard.triggerKey(true, typedKey);
        this.gameState.correctKeysTyped++;
      } else {
        currentLetter.setIncorrect();
        this.keyboard.triggerKey(false, typedKey);
        this.gameState.incorrectKeysTyped++;
      }

      if (
        this.gameState.currentLetterIndex <
        currentWord.letterObjs.length - 1
      ) {
        this.gameState.currentLetterIndex++;
      } else {
        this.gameState.currentWordIndex++;
        this.gameState.currentLetterIndex = 0;
        this.textAreaInput.value = "";

        if (this.gameState.currentWordIndex >= this.gameState.words.length) {
          this.endGame();
        }
      }
    }

    this.updateTiles();
  }

  handleBackspace() {
    if (
      !this.gameState.isGameActive ||
      (this.gameState.currentWordIndex === 0 &&
        this.gameState.currentLetterIndex === 0)
    ) {
      return;
    }

    if (this.gameState.currentLetterIndex > 0) {
      this.gameState.currentLetterIndex--;
      const letterToUntype =
        this.gameState.words[this.gameState.currentWordIndex].letterObjs[
          this.gameState.currentLetterIndex
        ];
      if (letterToUntype.hasBeenTyped) {
        if (letterToUntype.isCorrectlyTyped) {
          this.gameState.correctKeysTyped--;
        } else {
          this.gameState.incorrectKeysTyped--;
        }
      }
      letterToUntype.setUntyped();
      this.keyboard.triggerKey(true, letterToUntype.letter);
    } else if (this.gameState.currentWordIndex > 0) {
      this.gameState.currentWordIndex--;
      const previousWord =
        this.gameState.words[this.gameState.currentWordIndex];
      this.gameState.currentLetterIndex = previousWord.letterObjs.length - 1;

      const letterToUntype =
        previousWord.letterObjs[this.gameState.currentLetterIndex];
      if (letterToUntype.hasBeenTyped) {
        if (letterToUntype.isCorrectlyTyped) {
          this.gameState.correctKeysTyped--;
        } else {
          this.gameState.incorrectKeysTyped--;
        }
      }
      letterToUntype.setUntyped();
      this.keyboard.triggerKey(true, letterToUntype.letter);
    }
    this.updateTiles();
  }

  handleEnter() {
    const currentWord = this.gameState.words[this.gameState.currentWordIndex];
    if (
      !currentWord ||
      this.gameState.currentLetterIndex === currentWord.letterObjs.length
    ) {
      if (
        !this.gameState.isGameActive &&
        this.gameState.currentWordIndex >= this.gameState.words.length
      ) {
        return;
      }
    }

    for (
      let i = this.gameState.currentLetterIndex;
      i < currentWord.letterObjs.length;
      i++
    ) {
      const letter = currentWord.letterObjs[i];
      if (!letter.hasBeenTyped) {
        letter.setIncorrect();
        this.gameState.incorrectKeysTyped++;
      }
    }

    this.gameState.currentWordIndex++;
    this.gameState.currentLetterIndex = 0;
    this.textAreaInput.value = "";

    this.updateTiles();

    if (this.gameState.currentWordIndex >= this.gameState.words.length) {
      this.endGame();
    }
  }

  updateTiles() {
    const totalKeysTyped =
      this.gameState.correctKeysTyped + this.gameState.incorrectKeysTyped;
    let accuracy = 0;
    if (totalKeysTyped > 0) {
      accuracy = Math.round(
        (this.gameState.correctKeysTyped / totalKeysTyped) * 100
      );
    }
    this.tileManager.updatePrecision(accuracy);

    let wordsCompletedCount = 0;
    for (let i = 0; i < this.gameState.currentWordIndex; i++) {
      const word = this.gameState.words[i];
      if (word.wordString.trim() !== "") {
        wordsCompletedCount++;
      }
    }
    this.tileManager.updatePalabras(wordsCompletedCount);

    if (this.gameState.isGameActive && this.gameState.startTime) {
      const elapsedSeconds = Math.floor(
        (Date.now() - this.gameState.startTime) / 1000
      );
      this.tileManager.updateTiempo(elapsedSeconds);
    }
  }

  calculateWPM() {
    let correctWords = 0;

    for (let i = 0; i < this.gameState.words.length; i++) {
      const wordObj = this.gameState.words[i];
      if (wordObj.wordString.trim() === "") continue;

      let typedCorrectly = true;
      for (let j = 0; j < wordObj.letterObjs.length; j++) {
        const letterObj = wordObj.letterObjs[j];
        if (!letterObj.isCorrectlyTyped && letterObj.hasBeenTyped) {
          typedCorrectly = false;
          break;
        }
      }
      if (typedCorrectly) {
        correctWords++;
      }
    }

    const timeTakenSeconds = this.calculateTimeTaken();
    if (timeTakenSeconds === 0) return 0;
    const WPM = (correctWords / timeTakenSeconds) * 60;
    return Math.round(WPM);
  }

  calculateAccuracy() {
    const totalKeysTyped =
      this.gameState.correctKeysTyped + this.gameState.incorrectKeysTyped;
    if (totalKeysTyped === 0) return 0;
    const accuracyPercent =
      (this.gameState.correctKeysTyped / totalKeysTyped) * 100;
    return Math.round(accuracyPercent);
  }

  calculateTimeTaken() {
    if (!this.gameState.startTime || !this.gameState.endTime) {
      return this.gameState.isGameActive && this.gameState.startTime
        ? (Date.now() - this.gameState.startTime) / 1000
        : 0;
    }
    return (this.gameState.endTime - this.gameState.startTime) / 1000;
  }

  endGame() {
    this.gameState.endGame();

    const WPM = this.calculateWPM();
    const accuracy = this.calculateAccuracy();
    const time = Math.round(this.calculateTimeTaken());

    this.tileManager.updatePalabras(WPM);
    this.tileManager.updatePrecision(accuracy);
    this.tileManager.updateTiempo(time);

    this.tileManager.showResults();

    if (this.currentLetterObj) {
      this.currentLetterObj.removeCursor();
    }
    this.textAreaInput.value = "";
  }
}
