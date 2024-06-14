const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
const width = 15;
const invadersRemoved = [];
let currentShooterIndex = 202;
let invadersId;
let isGoingRight = true;
let direction = 1;

for (let i = 0; i < width * width; i++) {
  const square = document.createElement("div");
  square.id = i;
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

console.log(squares);

// Hard Coded alien positions
const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!invadersRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add("invader");
    }
  }
}
draw();

squares[currentShooterIndex].classList.add("shooter");

function moveShooter(e) {
  squares[currentShooterIndex].classList.remove("shooter");
  switch (e.key) {
    case "ArrowLeft":
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
      break;
    case "ArrowRight":
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
      break;
  }
  squares[currentShooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);

// Function to move shooter left
function moveShooterLeft() {
  squares[currentShooterIndex].classList.remove("shooter");
  if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
  squares[currentShooterIndex].classList.add("shooter");
}

// Function to move shooter right
function moveShooterRight() {
  squares[currentShooterIndex].classList.remove("shooter");
  if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
  squares[currentShooterIndex].classList.add("shooter");
}

// Event listeners for touch controls
document.getElementById("leftBtn").addEventListener("click", moveShooterLeft);
document.getElementById("rightBtn").addEventListener("click", moveShooterRight);

function removeInvaders() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove("invader");
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
  }
  if (invadersRemoved.length === alienInvaders.length) {
    resultDisplay.innerHTML = "YOU WIN";
    clearInterval(invadersId);
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
