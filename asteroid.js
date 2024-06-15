import { eventEmitter } from "./EventEmitter.js";

let asteroid_index = 0;
let game_grid_divs = [];
let asteroidIntervalID;
const grid_width = 15;
const resultDisplay = document.querySelector(".results");

export default class Asteroid {
  constructor(squares, shooterIndex) {
    game_grid_divs = squares;
    this.currentShooterIndex = shooterIndex;
    this.moveAsteroid = this.moveAsteroid.bind(this); // Bind the method to the instance, becuse its used in interval
    eventEmitter.on("changeShooterIndex", this.setShooterIndex.bind(this));
    this.addRandomAsteroid();
  }

  setShooterIndex(newI) {
    this.currentShooterIndex = newI;
  }

  addAsteroid(indexStart) {
    const square = game_grid_divs[indexStart];
    square.classList.add("asteroid");

    // Check if the image is already appended
    if (!square.querySelector("img")) {
      const img = document.createElement("img");
      img.src = "images/asteroid.png";
      img.id = "asteroidImg";
      img.style.width = "100%"; // Ensures the image fits the square
      img.style.height = "100%"; // Ensures the image fits the square
      square.appendChild(img);
    }
  }

  removeAsteroid(index) {
    const square = game_grid_divs[index];
    square.classList.remove("asteroid");
    const img = square.querySelector("#asteroidImg");
    if (img) {
      img.remove();
    }
  }

  moveAsteroid() {
    this.removeAsteroid(asteroid_index);

    asteroid_index += grid_width;
    //console.log(asteroid_index);
    //console.log(this.currentShooterIndex);

    if (asteroid_index >= game_grid_divs.length) {
      clearInterval(asteroidIntervalID);
      this.addRandomAsteroid();
    } else {
      this.addAsteroid(asteroid_index);

      if (asteroid_index == this.currentShooterIndex) {
        console.log("Game Over");
        resultDisplay.innerHTML = "GAME OVER";
        clearInterval(asteroidIntervalID);
        //clearInterval(invadersId);
      }
    }
  }

  addRandomAsteroid() {
    // grid : 15 * 15
    const GRID_WIDTH = 15;
    // Returns a random integer from 0 to 1:
    asteroid_index = Math.floor(Math.random() * 15);
    this.addAsteroid(asteroid_index);
    asteroidIntervalID = setInterval(this.moveAsteroid, 600);
  }
}
