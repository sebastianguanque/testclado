// classes/TileManager.js

export class TileManager {
  constructor(
    palabrasValueSpan,
    precisionValueSpan,
    tiempoValueSpan,
    palabrasTileDiv,
    precisionTileDiv,
    tiempoTileDiv
  ) {
    this.palabrasValueSpan = palabrasValueSpan;
    this.precisionValueSpan = precisionValueSpan;
    this.tiempoValueSpan = tiempoValueSpan;

    this.palabrasTileDiv = palabrasTileDiv;
    this.precisionTileDiv = precisionTileDiv;
    this.tiempoTileDiv = tiempoTileDiv;
  }

  updatePalabras(count) {
    this.palabrasValueSpan.textContent = count;
  }

  updatePrecision(precision) {
    this.precisionValueSpan.textContent = precision + "%";
  }

  updateTiempo(tiempo) {
    this.tiempoValueSpan.textContent = tiempo + "s";
  }

  hideResults() {
    this.palabrasValueSpan.textContent = "0";
    this.precisionValueSpan.textContent = "0%";
    this.tiempoValueSpan.textContent = "0s";

    this.palabrasTileDiv.classList.remove("tile__visible");
    this.precisionTileDiv.classList.remove("tile__visible");
    this.tiempoTileDiv.classList.remove("tile__visible");

    setTimeout(() => {
      this.palabrasTileDiv.style.display = "none";
      this.precisionTileDiv.style.display = "none";
      this.tiempoTileDiv.style.display = "none";
    }, 200);
  }

  showResults() {
    this.palabrasTileDiv.style.display = "flex";
    this.precisionTileDiv.style.display = "flex";
    this.tiempoTileDiv.style.display = "flex";

    setTimeout(() => {
      this.palabrasTileDiv.classList.add("tile__visible");
    }, 100);

    setTimeout(() => {
      this.precisionTileDiv.classList.add("tile__visible");
    }, 200);

    setTimeout(() => {
      this.tiempoTileDiv.classList.add("tile__visible");
    }, 300);
  }
}
