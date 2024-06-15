import { eventEmitter } from "./EventEmitter.js";

let game_grid_divs = [];
let invadersId = 0;
const grid_width = 15;
const resultDisplay = document.querySelector(".results");

export default class Invaders {
  constructor(squares, shooterIndex) {
    this.alienInvaders = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30,
      31, 32, 33, 34, 35, 36, 37, 38, 39,
    ];
    this.invadersRemoved = [];
    game_grid_divs = squares;
    this.isGoingRight = true;
    this.direction = 1;
    this.currentShooterIndex = shooterIndex;
    this.createInvaders();
  }

  createInvaders() {
    eventEmitter.on("changeShooterIndex", this.setShooterIndex.bind(this));
    eventEmitter.on("invaderShot", this.updateRemovedInvaders.bind(this));
    this.draw();
    invadersId = setInterval(this.moveInvaders.bind(this), 600);
  }

  setShooterIndex(shooterIndex) {
    this.currentShooterIndex = shooterIndex;
  }

  updateRemovedInvaders(newRemovedInavders) {
    this.invadersRemoved = newRemovedInavders;
  }

  removeInvaderByIndex(currentLaserIndex) {
    const alienRemoved = this.alienInvaders.indexOf(currentLaserIndex);
    this.invadersRemoved.push(alienRemoved);
  }

  draw() {
    for (let i = 0; i < this.alienInvaders.length; i++) {
      if (!this.invadersRemoved.includes(i)) {
        this.addInvaders(i);
      }
    }
  }

  addInvaders(i) {
    const square = game_grid_divs[this.alienInvaders[i]];
    square.classList.add("invader");

    // Check if the image is already appended
    if (!square.querySelector("img")) {
      const img = document.createElement("img");
      img.src = "images/SpaceInvadersGreen.png";
      img.alt = "InvaderImg"; // Adding alt text for accessibility
      img.id = "invaderImg";
      img.style.width = "100%"; // Ensures the image fits the square
      img.style.height = "100%"; // Ensures the image fits the square
      square.appendChild(img);
    }
  }

  removeInvaders() {
    for (let i = 0; i < this.alienInvaders.length; i++) {
      game_grid_divs[this.alienInvaders[i]].classList.remove("invader");
      const img =
        game_grid_divs[this.alienInvaders[i]].querySelector("#invaderImg");
      if (img) {
        img.remove(); // This removes the img element from the DOM
      }
    }
  }

  moveInvaders() {
    const leftEdge = this.alienInvaders[0] % grid_width === 0;
    const rightEdge =
      this.alienInvaders[this.alienInvaders.length - 1] % grid_width ===
      grid_width - 1;

    this.removeInvaders();

    if (rightEdge && this.isGoingRight) {
      for (let i = 0; i < this.alienInvaders.length; i++) {
        this.alienInvaders[i] += grid_width + 1;
        this.direction = -1;
        this.isGoingRight = false;
      }
    }

    if (leftEdge && !this.isGoingRight) {
      for (let i = 0; i < this.alienInvaders.length; i++) {
        this.alienInvaders[i] += grid_width - 1;
        this.direction = 1;
        this.isGoingRight = true;
      }
    }

    for (let i = 0; i < this.alienInvaders.length; i++) {
      this.alienInvaders[i] += this.direction;
    }

    this.draw();

    if (
      game_grid_divs[this.currentShooterIndex].classList.contains("invader")
    ) {
      resultDisplay.innerHTML = "GAME OVER";
      clearInterval(invadersId);
      //clearInterval(asteroidId);
    }
    if (this.invadersRemoved.length === this.alienInvaders.length) {
      resultDisplay.innerHTML = "YOU WIN";
      clearInterval(invadersId);
      //clearInterval(asteroidId);
    }
  }
}
