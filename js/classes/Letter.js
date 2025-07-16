// classes/Letter.js

export class Letter {
  constructor(letter) {
    this.letter = letter;
    this.letterElement = this.getLetterTemplate();
    this.letterElement.textContent = letter;
    this.isCorrectlyTyped = false;
    this.hasBeenTyped = false;
  }

  getLetterTemplate() {
    return document
      .querySelector("#letter-template")
      .content.querySelector(".letter")
      .cloneNode(true);
  }

  getCursorTemplate() {
    return document
      .querySelector("#cursor-template")
      .content.querySelector(".cursor")
      .cloneNode(true);
  }

  setCorrect() {
    this.letterElement.classList.add("letter__correct");
    this.letterElement.classList.remove("letter__incorrect");
    this.isCorrectlyTyped = true;
    this.hasBeenTyped = true;
  }

  setIncorrect() {
    this.letterElement.classList.add("letter__incorrect");
    this.letterElement.classList.remove("letter__correct");
    this.isCorrectlyTyped = false;
    this.hasBeenTyped = true;
  }

  setUntyped() {
    this.letterElement.classList.remove("letter__incorrect");
    this.letterElement.classList.remove("letter__correct");
    this.isCorrectlyTyped = false;
    this.hasBeenTyped = false;
  }

  addCursor() {
    const cursor = this.getCursorTemplate();
    this.letterElement.append(cursor);
    this.letterElement.classList.add("letter__current");
  }

  removeCursor() {
    const cursor = this.letterElement.querySelector(".cursor");
    if (cursor) {
      cursor.remove();
    }
    this.letterElement.classList.remove("letter__current");
  }
}
