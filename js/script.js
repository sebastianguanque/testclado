// Define tus párrafos aquí
const paragraphs = [
  "La vida es un regalo valioso, disfrutala",
  "El sol brilla, el dia es hermoso",
  "Aprende del pasado, vive el presente",
  "Sueña grande, trabaja duro, logra todo",
  "La felicidad esta en las pequeñas cosas",
  "Un buen libro, una mente abierta",
  "El tiempo vuela, aprovecha cada instante",
  "Siempre hay algo por lo que agradecer",
  "La amistad verdadera es un tesoro",
  "Sonrie, el mundo te devuelve la sonrisa",
  "Cree en ti, eres capaz de todo",
  "Respira hondo, relaja tu mente ahora",
  "El camino es largo, sigue adelante",
  "Cada dia es una nueva oportunidad",
  "Se amable, deja tu huella positiva",
  "Escucha tu corazon, el te guiara",
  "La paciencia es una gran virtud",
  "Disfruta el viaje, no solo el destino",
  "El conocimiento es poder, aprende mas",
  "Nunca te rindas, persiste siempre",
  "La musica alegra el alma, escucha mas",
  "Un gesto amable cambia el dia",
  "Se tu mismo, los demas ya existen",
  "La naturaleza nos da mucha paz",
  "Siembra amor, cosecha felicidad",
  "El futuro es hoy, actua con valor",
  "La familia es el pilar de la vida",
  "Busca la luz en la oscuridad",
  "Vive el momento, no te preocupes",
  "El exito es la suma de esfuerzos",
  "La honestidad es la mejor politica",
  "Ayuda a otros, haz la diferencia",
  "Explora el mundo, descubre algo nuevo",
  "Los desafios te hacen mas fuerte",
  "El amor todo lo puede y lo logra",
  "Cuida tu cuerpo, es tu templo",
  "Piensa positivo, atrae lo bueno",
  "La fe mueve montañas, confia siempre",
  "El silencio es a veces la respuesta",
  "Deja ir lo que no te hace bien",
  "Celebra tus logros, grandes y pequeños",
  "La empatia es clave para entender",
  "Un abrazo sincero sana el alma",
  "El perdon libera tu corazon",
  "Comienza hoy, no esperes mas",
  "La gratitud abre puertas bonitas",
  "Respeta a todos, sin excepcion",
  "La imaginacion no tiene limites",
  "Acepta los cambios, fluye con ellos",
  "Haz lo que amas, ama lo que haces",
]

// Elementos del DOM
const palabrasValueSpan = document.querySelector(".tile__palabras .tile__value")
const precisionValueSpan = document.querySelector(".tile__precision .tile__value")
const tiempoValueSpan = document.querySelector(".tile__tiempo .tile__value")

const palabrasTile = document.querySelector(".tile__palabras")
const precisionTile = document.querySelector(".tile__precision")
const tiempoTile = document.querySelector(".tile__tiempo")

const textAreaInput = document.querySelector(".text-area__input")
const textAreaText = document.querySelector(".text-area__text")

const resetButton = document.querySelector(".button__reset")
const changeButton = document.querySelector(".button__change")

const keys = document.querySelectorAll(".key")

// Teclas válidas e ignoradas
const validInputKeys = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,. "

const ignoredkeys = [
  "Shift",
  "CapsLock",
  "Control",
  "Alt",
  "Meta",
  "Tab",
  "Enter",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
]

const getRandomParagraph = () => {
  return paragraphs[Math.floor(Math.random() * paragraphs.length)].split(" ")
}

// Función para detectar dispositivos móviles/tablets
const isMobileOrTablet = () => {
  return window.innerWidth <= 1024
}

class Letter {
  constructor(letter) {
    this.letter = letter
    this.letterElement = this.getLetterTemplate()
    this.letterElement.textContent = letter
    this.isCorrectlyTyped = false
    this.hasBeenTyped = false
  }

  getLetterTemplate() {
    return document.querySelector("#letter-template").content.querySelector(".letter").cloneNode(true)
  }

  getCursorTemplate() {
    return document.querySelector("#cursor-template").content.querySelector(".cursor").cloneNode(true)
  }

  setCorrect() {
    this.letterElement.classList.add("letter__correct")
    this.letterElement.classList.remove("letter__incorrect")
    this.isCorrectlyTyped = true
    this.hasBeenTyped = true
  }

  setIncorrect() {
    this.letterElement.classList.add("letter__incorrect")
    this.letterElement.classList.remove("letter__correct")
    this.isCorrectlyTyped = false
    this.hasBeenTyped = true
  }

  setUntyped() {
    this.letterElement.classList.remove("letter__incorrect")
    this.letterElement.classList.remove("letter__correct")
    this.isCorrectlyTyped = false
    this.hasBeenTyped = false
  }

  addCursor() {
    const cursor = this.getCursorTemplate()
    this.letterElement.append(cursor)
    this.letterElement.classList.add("letter__current")
  }

  removeCursor() {
    const cursor = this.letterElement.querySelector(".cursor")
    if (cursor) {
      cursor.remove()
    }
    this.letterElement.classList.remove("letter__current")
  }
}

class Word {
  constructor(wordString) {
    this.wordString = wordString
    this.wordElement = this.getWordTemplate()
    this.letterObjs = []
    ;[...wordString].forEach((char) => {
      const letterObj = new Letter(char)
      this.letterObjs.push(letterObj)
      this.wordElement.append(letterObj.letterElement)
    })
  }

  getWordTemplate() {
    return document.querySelector("#word-template").content.querySelector(".word").cloneNode(true)
  }
}

class Key {
  constructor(keyElement) {
    this.keyElement = keyElement
    this.keyText = keyElement.querySelector(".key__text").textContent.trim()
  }

  triggerKey(isCorrect) {
    if (isCorrect) {
      this.keyElement.classList.add("key__correct")
    } else {
      this.keyElement.classList.add("key__incorrect")
    }

    setTimeout(() => {
      this.keyElement.classList.remove("key__correct", "key__incorrect")
    }, 200)
  }
}

class Keyboard {
  constructor() {
    this.keyObjs = {}
    this.createKeys()
  }

  createKeys() {
    Array.from(keys).forEach((keyElement) => {
      let keyText = keyElement.querySelector(".key__text").textContent.trim()
      if (keyText.toLowerCase() === "space") {
        keyText = " "
      }
      this.keyObjs[keyText.toLowerCase()] = new Key(keyElement)
    })
  }

  triggerKey(isCorrect, key) {
    const normalizedKey = key.toLowerCase()
    if (this.keyObjs[normalizedKey]) {
      this.keyObjs[normalizedKey].triggerKey(isCorrect)
    }
  }
}

class TileManager {
  constructor(
    palabrasValueSpan,
    precisionValueSpan,
    tiempoValueSpan,
    palabrasTileDiv,
    precisionTileDiv,
    tiempoTileDiv,
  ) {
    this.palabrasValueSpan = palabrasValueSpan
    this.precisionValueSpan = precisionValueSpan
    this.tiempoValueSpan = tiempoValueSpan

    this.palabrasTileDiv = palabrasTileDiv
    this.precisionTileDiv = precisionTileDiv
    this.tiempoTileDiv = tiempoTileDiv
  }

  updatePalabras(count) {
    this.palabrasValueSpan.textContent = count
  }

  updatePrecision(precision) {
    this.precisionValueSpan.textContent = precision + "%"
  }

  updateTiempo(tiempo) {
    this.tiempoValueSpan.textContent = tiempo + "s"
  }

  hideResults() {
    this.palabrasValueSpan.textContent = "0"
    this.precisionValueSpan.textContent = "0%"
    this.tiempoValueSpan.textContent = "0s"

    // Remover las clases de visibilidad
    this.palabrasTileDiv.classList.remove("tile__visible")
    this.precisionTileDiv.classList.remove("tile__visible")
    this.tiempoTileDiv.classList.remove("tile__visible")

    // Ocultar completamente después de la transición
    setTimeout(() => {
      this.palabrasTileDiv.style.display = "none"
      this.precisionTileDiv.style.display = "none"
      this.tiempoTileDiv.style.display = "none"
    }, 200) // Esperar a que termine la transición
  }

  showResults() {
    // Primero mostrar los elementos (display: flex)
    this.palabrasTileDiv.style.display = "flex"
    this.precisionTileDiv.style.display = "flex"
    this.tiempoTileDiv.style.display = "flex"

    // Luego añadir las clases con animación escalonada
    setTimeout(() => {
      this.palabrasTileDiv.classList.add("tile__visible")
    }, 100)

    setTimeout(() => {
      this.precisionTileDiv.classList.add("tile__visible")
    }, 200)

    setTimeout(() => {
      this.tiempoTileDiv.classList.add("tile__visible")
    }, 300)
  }
}

class GameState {
  constructor() {
    this.reset()
  }

  reset() {
    this.words = []
    this.currentWordIndex = 0
    this.currentLetterIndex = 0
    this.startTime = null
    this.endTime = null
    this.correctKeysTyped = 0
    this.incorrectKeysTyped = 0
    this.isGameActive = false
    this.currentParagraph = null
  }

  startGame(paragraph) {
    this.reset()
    this.currentParagraph = paragraph

    paragraph.forEach((wordString, index) => {
      const wordObj = new Word(wordString)
      this.words.push(wordObj)

      if (index < paragraph.length - 1) {
        const spaceWordObj = new Word(" ")
        this.words.push(spaceWordObj)
      }
    })

    this.isGameActive = true
    this.startTime = Date.now()
  }

  endGame() {
    if (!this.isGameActive) return

    this.endTime = Date.now()
    this.isGameActive = false
  }
}

class Game {
  constructor(textAreaInput, textAreaText, resetButton, changeButton) {
    this.textAreaInput = textAreaInput
    this.textAreaText = textAreaText
    this.resetButton = resetButton
    this.changeButton = changeButton
    this.mobileStartButton = document.getElementById("mobileStartButton")

    this.tileManager = new TileManager(
      palabrasValueSpan,
      precisionValueSpan,
      tiempoValueSpan,
      palabrasTile,
      precisionTile,
      tiempoTile,
    )
    this.keyboard = new Keyboard()
    this.gameState = new GameState()

    this.setEventListeners()
    this.startNewGameWithRandomParagraph()
    this.handleMobileDisplay()
  }

  setEventListeners() {
    // Detectar si es dispositivo móvil/tablet
    if (isMobileOrTablet()) {
      // En móviles/tablets, solo enfocar cuando se pulse el botón de inicio
      if (this.mobileStartButton) {
        this.mobileStartButton.addEventListener("click", () => {
          this.activateMobileMode()
        })
      }
    } else {
      // En desktop, mantener el comportamiento original
      document.addEventListener("keydown", () => this.textAreaInput.focus())
    }

    this.textAreaInput.addEventListener("keydown", (e) => {
      this.handleKeyDown(e)
    })

    this.resetButton.addEventListener("click", () => {
      this.resetGameWithCurrentParagraph()
    })

    this.changeButton.addEventListener("click", () => {
      this.startNewGameWithRandomParagraph()
    })

    // Manejar cambios de orientación/tamaño de ventana
    window.addEventListener("resize", () => {
      this.handleMobileDisplay()
    })
  }

  activateMobileMode() {
    // Ocultar el botón de inicio móvil
    const mobileStart = document.querySelector(".mobile-start")
    if (mobileStart) {
      mobileStart.classList.add("mobile-start--active")
    }

    // Enfocar el input para mostrar el teclado virtual
    this.textAreaInput.focus()

    // Pequeño retraso para asegurar que el teclado aparezca
    setTimeout(() => {
      this.textAreaInput.focus()
    }, 100)
  }

  handleMobileDisplay() {
    const mobileStart = document.querySelector(".mobile-start")
    const keyboardArea = document.querySelector(".keyboard-area")

    if (isMobileOrTablet()) {
      // En móviles/tablets: ocultar teclado virtual, mostrar botón de inicio
      if (keyboardArea) keyboardArea.style.display = "none"
      if (mobileStart && !mobileStart.classList.contains("mobile-start--active")) {
        mobileStart.style.display = "flex"
      }
    } else {
      // En desktop: mostrar teclado virtual, ocultar botón de inicio
      if (keyboardArea) keyboardArea.style.display = "block"
      if (mobileStart) mobileStart.style.display = "none"
    }
  }

  startNewGameWithRandomParagraph() {
    const paragraph = getRandomParagraph()
    this.gameState.startGame(paragraph)
    this.renderWords()
    this.updateCursorPosition()
    this.textAreaInput.value = ""

    // Solo enfocar automáticamente en desktop
    if (!isMobileOrTablet()) {
      this.textAreaInput.focus()
    }

    this.tileManager.hideResults()

    // Mostrar nuevamente el botón de inicio en móviles si estaba oculto
    if (isMobileOrTablet()) {
      const mobileStart = document.querySelector(".mobile-start")
      if (mobileStart) {
        mobileStart.classList.remove("mobile-start--active")
      }
    }
  }

  resetGameWithCurrentParagraph() {
    const paragraphToUse = this.gameState.currentParagraph || getRandomParagraph()
    this.gameState.startGame(paragraphToUse)
    this.renderWords()
    this.updateCursorPosition()
    this.textAreaInput.value = ""

    // Solo enfocar automáticamente en desktop
    if (!isMobileOrTablet()) {
      this.textAreaInput.focus()
    }

    this.tileManager.hideResults()

    // Mostrar nuevamente el botón de inicio en móviles si estaba oculto
    if (isMobileOrTablet()) {
      const mobileStart = document.querySelector(".mobile-start")
      if (mobileStart) {
        mobileStart.classList.remove("mobile-start--active")
      }
    }
  }

  renderWords() {
    this.textAreaText.innerHTML = ""
    this.gameState.words.forEach((wordObj) => {
      this.textAreaText.append(wordObj.wordElement)
    })
  }

  updateCursorPosition() {
    if (this.currentLetterObj) {
      this.currentLetterObj.removeCursor()
    }

    const currentWord = this.gameState.words[this.gameState.currentWordIndex]
    if (currentWord && currentWord.letterObjs[this.gameState.currentLetterIndex]) {
      this.currentLetterObj = currentWord.letterObjs[this.gameState.currentLetterIndex]
      this.currentLetterObj.addCursor()
    }
  }

  handleKeyDown(event) {
    const key = event.key

    if (ignoredkeys.includes(key)) {
      event.preventDefault()
      return
    }

    if (key === "Backspace") {
      event.preventDefault()
      this.handleBackspace()
      this.updateCursorPosition()
    } else if (key === "Enter") {
      event.preventDefault()
      this.handleEnter()
      this.updateCursorPosition()
    } else if (validInputKeys.includes(key) && this.gameState.isGameActive) {
      this.processCharacter(key)
      this.updateCursorPosition()
    }
  }

  processCharacter(typedKey) {
    const currentWord = this.gameState.words[this.gameState.currentWordIndex]
    if (!currentWord) return

    const currentLetter = currentWord.letterObjs[this.gameState.currentLetterIndex]

    if (currentLetter) {
      if (typedKey === currentLetter.letter) {
        currentLetter.setCorrect()
        this.keyboard.triggerKey(true, typedKey)
        this.gameState.correctKeysTyped++
      } else {
        currentLetter.setIncorrect()
        this.keyboard.triggerKey(false, typedKey)
        this.gameState.incorrectKeysTyped++
      }

      if (this.gameState.currentLetterIndex < currentWord.letterObjs.length - 1) {
        this.gameState.currentLetterIndex++
      } else {
        this.gameState.currentWordIndex++
        this.gameState.currentLetterIndex = 0
        this.textAreaInput.value = ""

        if (this.gameState.currentWordIndex >= this.gameState.words.length) {
          this.endGame()
        }
      }
    }

    this.updateTiles()
  }

  handleBackspace() {
    if (
      !this.gameState.isGameActive ||
      (this.gameState.currentWordIndex === 0 && this.gameState.currentLetterIndex === 0)
    ) {
      return
    }

    if (this.gameState.currentLetterIndex > 0) {
      this.gameState.currentLetterIndex--
      const letterToUntype =
        this.gameState.words[this.gameState.currentWordIndex].letterObjs[this.gameState.currentLetterIndex]
      if (letterToUntype.hasBeenTyped) {
        if (letterToUntype.isCorrectlyTyped) {
          this.gameState.correctKeysTyped--
        } else {
          this.gameState.incorrectKeysTyped--
        }
      }
      letterToUntype.setUntyped()
      this.keyboard.triggerKey(true, letterToUntype.letter)
    } else if (this.gameState.currentWordIndex > 0) {
      this.gameState.currentWordIndex--
      const previousWord = this.gameState.words[this.gameState.currentWordIndex]
      this.gameState.currentLetterIndex = previousWord.letterObjs.length - 1

      const letterToUntype = previousWord.letterObjs[this.gameState.currentLetterIndex]
      if (letterToUntype.hasBeenTyped) {
        if (letterToUntype.isCorrectlyTyped) {
          this.gameState.correctKeysTyped--
        } else {
          this.gameState.incorrectKeysTyped--
        }
      }
      letterToUntype.setUntyped()
      this.keyboard.triggerKey(true, letterToUntype.letter)
    }
    this.updateTiles()
  }

  handleEnter() {
    const currentWord = this.gameState.words[this.gameState.currentWordIndex]
    if (!currentWord || this.gameState.currentLetterIndex === currentWord.letterObjs.length) {
      if (!this.gameState.isGameActive && this.gameState.currentWordIndex >= this.gameState.words.length) {
        return
      }
    }

    for (let i = this.gameState.currentLetterIndex; i < currentWord.letterObjs.length; i++) {
      const letter = currentWord.letterObjs[i]
      if (!letter.hasBeenTyped) {
        letter.setIncorrect()
        this.gameState.incorrectKeysTyped++
      }
    }

    this.gameState.currentWordIndex++
    this.gameState.currentLetterIndex = 0
    this.textAreaInput.value = ""

    this.updateTiles()

    if (this.gameState.currentWordIndex >= this.gameState.words.length) {
      this.endGame()
    }
  }

  updateTiles() {
    const totalKeysTyped = this.gameState.correctKeysTyped + this.gameState.incorrectKeysTyped
    let accuracy = 0
    if (totalKeysTyped > 0) {
      accuracy = Math.round((this.gameState.correctKeysTyped / totalKeysTyped) * 100)
    }
    this.tileManager.updatePrecision(accuracy)

    let wordsCompletedCount = 0
    for (let i = 0; i < this.gameState.currentWordIndex; i++) {
      const word = this.gameState.words[i]
      if (word.wordString.trim() !== "") {
        wordsCompletedCount++
      }
    }
    this.tileManager.updatePalabras(wordsCompletedCount)

    if (this.gameState.isGameActive && this.gameState.startTime) {
      const elapsedSeconds = Math.floor((Date.now() - this.gameState.startTime) / 1000)
      this.tileManager.updateTiempo(elapsedSeconds)
    }
  }

  calculateWPM() {
    let correctWords = 0

    for (let i = 0; i < this.gameState.words.length; i++) {
      const wordObj = this.gameState.words[i]
      if (wordObj.wordString.trim() === "") continue

      let typedCorrectly = true
      for (let j = 0; j < wordObj.letterObjs.length; j++) {
        const letterObj = wordObj.letterObjs[j]
        if (!letterObj.isCorrectlyTyped && letterObj.hasBeenTyped) {
          typedCorrectly = false
          break
        }
      }
      if (typedCorrectly) {
        correctWords++
      }
    }

    const timeTakenSeconds = this.calculateTimeTaken()
    if (timeTakenSeconds === 0) return 0
    const WPM = (correctWords / timeTakenSeconds) * 60
    return Math.round(WPM)
  }

  calculateAccuracy() {
    const totalKeysTyped = this.gameState.correctKeysTyped + this.gameState.incorrectKeysTyped
    if (totalKeysTyped === 0) return 0
    const accuracyPercent = (this.gameState.correctKeysTyped / totalKeysTyped) * 100
    return Math.round(accuracyPercent)
  }

  calculateTimeTaken() {
    if (!this.gameState.startTime || !this.gameState.endTime) {
      return this.gameState.isGameActive && this.gameState.startTime
        ? (Date.now() - this.gameState.startTime) / 1000
        : 0
    }
    return (this.gameState.endTime - this.gameState.startTime) / 1000
  }

  endGame() {
    this.gameState.endGame()

    const WPM = this.calculateWPM()
    const accuracy = this.calculateAccuracy()
    const time = Math.round(this.calculateTimeTaken())

    this.tileManager.updatePalabras(WPM)
    this.tileManager.updatePrecision(accuracy)
    this.tileManager.updateTiempo(time)

    this.tileManager.showResults()

    if (this.currentLetterObj) {
      this.currentLetterObj.removeCursor()
    }
    this.textAreaInput.value = ""
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  const game = new Game(textAreaInput, textAreaText, resetButton, changeButton)

  setInterval(() => {
    if (game.gameState.isGameActive && game.gameState.startTime) {
      const elapsedSeconds = Math.floor((Date.now() - game.gameState.startTime) / 1000)
      game.tileManager.updateTiempo(elapsedSeconds)
    }
  }, 1000)
})
