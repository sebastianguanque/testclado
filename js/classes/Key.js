// classes/Key.js

export class Key {
  constructor(keyElement) {
    this.keyElement = keyElement;
    this.keyText = keyElement.querySelector(".key__text").textContent.trim();
  }

  triggerKey(isCorrect) {
    if (isCorrect) {
      this.keyElement.classList.add("key__correct");
    } else {
      this.keyElement.classList.add("key__incorrect");
    }

    setTimeout(() => {
      this.keyElement.classList.remove("key__correct", "key__incorrect");
    }, 200);
  }
}
