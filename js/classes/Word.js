// classes/Word.js

import { Letter } from "./Letter.js";

export class Word {
  constructor(wordString) {
    this.wordString = wordString;
    this.wordElement = this.getWordTemplate();
    this.letterObjs = [];
    [...wordString].forEach((char) => {
      const letterObj = new Letter(char);
      this.letterObjs.push(letterObj);
      this.wordElement.append(letterObj.letterElement);
    });
  }

  getWordTemplate() {
    return document
      .querySelector("#word-template")
      .content.querySelector(".word")
      .cloneNode(true);
  }
}
