import Asteroid from "./asteroid.js";
import Invaders from "./invaders.js";
import Ship from "./ship.js";
import Laser from "./laser.js";
import { eventEmitter } from "./EventEmitter.js";

// Initalize
const grid = document.querySelector(".grid");
const width = 15;
let currentShooterIndex = 202;

// Create Game
createGameGrid();
const squares = Array.from(document.querySelectorAll(".grid div"));

// Ensure consistent shooter placement
eventEmitter.on("changeShooterIndex", setShooterIndex);

// Create Game Objects
const asteroid = new Asteroid(squares, currentShooterIndex);
const invaders = new Invaders(squares, currentShooterIndex);
const ship = new Ship(squares);
const laser = new Laser(squares, currentShooterIndex, invaders);

// Functions
function setShooterIndex(shooterIndex) {
  currentShooterIndex = shooterIndex;
}

function createGameGrid() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.id = i;
    grid.appendChild(square);
  }
}
