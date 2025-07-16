// classes/Keyboard.js

import { Key } from "./Key.js";
import { keys } from "../domElements.js";

export class Keyboard {
  constructor() {
    this.keyObjs = {};
    this.createKeys();
  }

  createKeys() {
    Array.from(keys).forEach((keyElement) => {
      let keyText = keyElement.querySelector(".key__text").textContent.trim();
      if (keyText.toLowerCase() === "space") {
        keyText = " ";
      }
      this.keyObjs[keyText.toLowerCase()] = new Key(keyElement);
    });
  }

  triggerKey(isCorrect, key) {
    const normalizedKey = key.toLowerCase();
    if (this.keyObjs[normalizedKey]) {
      this.keyObjs[normalizedKey].triggerKey(isCorrect);
    }
  }
}
