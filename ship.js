import { eventEmitter } from "./EventEmitter.js";

let currentShooterIndex = 202;
let game_grid_divs = [];
const grid_width = 15;

export default class Ship {
  constructor(squares) {
    game_grid_divs = squares;
    this.currentShooterIndex = currentShooterIndex; // Initialize currentShooterIndex

    this.addShooter = this.addShooter.bind(this); // Bind methods
    this.moveShooterLeft = this.moveShooterLeft.bind(this);
    this.moveShooterRight = this.moveShooterRight.bind(this);
    this.setShooterIndex = this.setShooterIndex.bind(this);

    this.addShooter();
    document.addEventListener("keydown", this.moveShooter.bind(this));
    document
      .getElementById("leftBtn")
      .addEventListener("click", this.moveShooterLeft);
    document
      .getElementById("rightBtn")
      .addEventListener("click", this.moveShooterRight);
    eventEmitter.on("changeShooterIndex", this.setShooterIndex);
  }

  setShooterIndex(shooterIndex) {
    this.currentShooterIndex = shooterIndex;
  }

  addShooter() {
    const shooter = game_grid_divs[this.currentShooterIndex];

    shooter.classList.add("shooter");
    // Check if the image is already appended
    if (!shooter.querySelector("img")) {
      const img = document.createElement("img");
      img.src = "images/Ship.png";
      img.id = "shooterImg";
      img.style.width = "100%"; // Ensures the image fits the square
      img.style.height = "100%"; // Ensures the image fits the square
      shooter.appendChild(img);
    }
  }

  moveShooter(e) {
    this.removeShooter();
    switch (e.key) {
      case "ArrowLeft":
        if (this.currentShooterIndex % grid_width !== 0)
          this.currentShooterIndex -= 1;
        break;
      case "ArrowRight":
        if (this.currentShooterIndex % grid_width < grid_width - 1)
          this.currentShooterIndex += 1;
        break;
    }
    this.addShooter();
    eventEmitter.emit("changeShooterIndex", this.currentShooterIndex);
  }

  removeShooter() {
    const shooterElem = game_grid_divs[this.currentShooterIndex];
    shooterElem.classList.remove("shooter");
    const shooterImg = shooterElem.querySelector("#shooterImg");
    if (shooterImg) {
      shooterImg.remove();
    }
  }

  moveShooterLeft() {
    this.removeShooter();
    if (this.currentShooterIndex % grid_width !== 0)
      this.currentShooterIndex -= 1;
    this.addShooter();
    eventEmitter.emit("changeShooterIndex", this.currentShooterIndex);
  }

  moveShooterRight() {
    this.removeShooter();

    if (this.currentShooterIndex % grid_width < grid_width - 1)
      this.currentShooterIndex += 1;
    this.addShooter();
    eventEmitter.emit("changeShooterIndex", this.currentShooterIndex);
  }
}
