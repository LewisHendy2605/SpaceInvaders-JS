const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
const width = 15;
const invadersRemoved = [];
let currentShooterIndex = 202;
let currentAsteroidIndex = 0;
let invadersId;
let asteroidId;
let isGoingRight = true;
let direction = 1;

for (let i = 0; i < width * width; i++) {
  const square = document.createElement("div");
  square.id = i;
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

//console.log(squares);

// Hard Coded alien positions
const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

function addInvaders(i) {
  const square = squares[alienInvaders[i]];
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

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!invadersRemoved.includes(i)) {
      addInvaders(i);
    }
  }
}
draw();

addShooter();

function moveShooter(e) {
  removeShooter();
  switch (e.key) {
    case "ArrowLeft":
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
      break;
    case "ArrowRight":
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
      break;
  }
  addShooter();
}

document.addEventListener("keydown", moveShooter);

function removeShooter() {
  const shooterElem = squares[currentShooterIndex];
  shooterElem.classList.remove("shooter");
  const shooterImg = shooterElem.querySelector("#shooterImg");
  if (shooterImg) {
    shooterImg.remove();
  }
}

/*
squares[alienInvaders[i]].classList.remove("invader");
    const img = squares[alienInvaders[i]].querySelector("img");
    if (img) {
      img.remove(); // This removes the img element from the DOM
    }
*/

function addShooter() {
  const shooter = squares[currentShooterIndex];

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

// Function to move shooter left
function moveShooterLeft() {
  removeShooter();
  if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
  addShooter();
}

// Function to move shooter right
function moveShooterRight() {
  removeShooter();

  if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
  addShooter();
}

// Event listeners for touch controls
document.getElementById("leftBtn").addEventListener("click", moveShooterLeft);
document.getElementById("rightBtn").addEventListener("click", moveShooterRight);

function removeInvaders() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove("invader");
    const img = squares[alienInvaders[i]].querySelector("#invaderImg");
    if (img) {
      img.remove(); // This removes the img element from the DOM
    }
  }
}

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;

  removeInvaders();

  if (rightEdge && isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      isGoingRight = false;
    }
  }

  if (leftEdge && !isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      isGoingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }

  draw();

  if (squares[currentShooterIndex].classList.contains("invader")) {
    resultDisplay.innerHTML = "GAME OVER";
    clearInterval(invadersId);
    clearInterval(asteroidId);
  }
  if (invadersRemoved.length === alienInvaders.length) {
    resultDisplay.innerHTML = "YOU WIN";
    clearInterval(invadersId);
    clearInterval(asteroidId);
  }
}
invadersId = setInterval(moveInvaders, 600);

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;

  function moveLaser() {
    squares[currentLaserIndex].classList.remove("laser");
    // Move laser up
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add("laser");

    if (squares[currentLaserIndex].classList.contains("invader")) {
      squares[currentLaserIndex].classList.remove("laser");
      squares[currentLaserIndex].classList.remove("invader");
      squares[currentLaserIndex].classList.add("boom");

      setTimeout(
        () => squares[currentLaserIndex].classList.remove("boom"),
        300
      );
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      invadersRemoved.push(alienRemoved);
      results++;
      resultDisplay.innerHTML = results;
    }
  }

  if (e.key === "ArrowUp" || e.type === "click") {
    laserId = setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", shoot);
document.getElementById("shootBtn").addEventListener("click", shoot);

// Asteroids
function addAsteroid(indexStart) {
  const square = squares[indexStart];
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

function removeAsteroid(index) {
  const square = squares[index];
  square.classList.remove("asteroid");
  const img = square.querySelector("#asteroidImg");
  if (img) {
    img.remove(); // This removes the img element from the DOM
  }
}

function addRandomAsteroid() {
  // grid : 15 * 15
  const GRID_WIDTH = 15;
  // Returns a random integer from 0 to 1:
  currentAsteroidIndex = Math.floor(Math.random() * 15);
  addAsteroid(currentAsteroidIndex);
  asteroidId = setInterval(moveAsteroid, 600);
}

addRandomAsteroid();

function moveAsteroid() {
  removeAsteroid(currentAsteroidIndex);

  currentAsteroidIndex += width;

  if (currentAsteroidIndex >= squares.length) {
    clearInterval(asteroidId);
    addRandomAsteroid();
  } else {
    addAsteroid(currentAsteroidIndex);

    if (squares[currentAsteroidIndex].classList.contains("shooter")) {
      resultDisplay.innerHTML = "GAME OVER";
      clearInterval(asteroidId);
      clearInterval(invadersId);
    }
  }
}
