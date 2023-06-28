var canvas = document.getElementById('game-canvas');
var context = canvas.getContext('2d');

var gridSize = 20;
var canvasWidth = 800;
var canvasHeight = 600;
var gridWidth = canvasWidth / gridSize;
var gridHeight = canvasHeight / gridSize;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

var snake = {
  x: Math.floor(gridWidth / 2), // Startpositie X van de slang
  y: Math.floor(gridHeight / 2), // Startpositie Y van de slang
  dx: 0, // Initiële bewegingsrichting X van de slang (geen beweging)
  dy: 0, // Initiële bewegingsrichting Y van de slang (geen beweging)
  tail: [], // Array om de segmenten van de slangstaart op te slaan
  tailLength: 1 // Initiële lengte van de slangstaart
};

var apple = {
  x: Math.floor(Math.random() * gridWidth), // X-positie van de appel (willekeurig gegenereerd)
  y: Math.floor(Math.random() * gridHeight) // Y-positie van de appel (willekeurig gegenereerd)
};

var score = 0;
var scoreElement = document.getElementById('score');

// Geluidseffect laden
var pickupSound = new Audio('pickup.wav');

function update() {
  snake.x += snake.dx; // Update de X-positie van de slang op basis van de X-richting
  snake.y += snake.dy; // Update de Y-positie van de slang op basis van de Y-richting

  if (snake.x < 0) {
    snake.x = gridWidth - 1; // Wikkel naar de andere kant van het rooster
  } else if (snake.x >= gridWidth) {
    snake.x = 0; // Wikkel naar de andere kant van het rooster
  }

  if (snake.y < 0) {
    snake.y = gridHeight - 1; // Wikkel naar de andere kant van het rooster
  } else if (snake.y >= gridHeight) {
    snake.y = 0; // Wikkel naar de andere kant van het rooster
  }

  if (snake.x === apple.x && snake.y === apple.y) {
    score = score + 5; // Verhoog de score
    scoreElement.textContent = 'Score: ' + score; // Update de score weergave
    snake.tailLength++; // Verhoog de lengte van de slangstaart
    apple.x = Math.floor(Math.random() * gridWidth); // Genereer een nieuwe X-positie voor de appel
    apple.y = Math.floor(Math.random() * gridHeight); // Genereer een nieuwe Y-positie voor de appel
    // Speel het geluidseffect af
    pickupSound.play();
  }

  snake.tail.unshift({ x: snake.x, y: snake.y }); // Voeg een nieuw segment toe aan het begin van de slangstaart
  if (snake.tail.length > snake.tailLength) {
    snake.tail.pop(); // Verwijder het laatste segment van de slangstaart als het de lengte overschrijdt
  }

  for (var i = 1; i < snake.tail.length; i++) {
    if (snake.tail[i].x === snake.x && snake.tail[i].y === snake.y) {
      // Botsing met de staart, game over
      scoreElement.textContent = 'Game Over! Eindscore: ' + score;
      snake.x = Math.floor(gridWidth / 2); // Zet de X-positie van de slang terug naar het midden
      snake.y = Math.floor(gridHeight / 2); // Zet de Y-positie van de slang terug naar het midden
      snake.tail = []; // Wis de slangstaart
      snake.tailLength = 1; // Zet de lengte van de slangstaart terug naar 1
      score = 0; // Reset de score
      break;
    }
  }

  draw(); // Roep de draw-functie aan om het speelveld bij te werken
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Maak het speelveld leeg

  context.fillStyle = 'green';
  for (var i = 0; i < snake.tail.length; i++) {
    context.fillRect(
      snake.tail[i].x * gridSize,
      snake.tail[i].y * gridSize,
      gridSize,
      gridSize
    ); // Teken elk segment van de slangstaart
  }

  context.fillStyle = 'red';
  context.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize); // Teken de appel
}

function handleKeyDown(event) {
  switch (event.key) {
    case 'ArrowUp':
      if (snake.dy !== 1) {
        snake.dx = 0;
        snake.dy = -1;
      }
      break;
    case 'ArrowDown':
      if (snake.dy !== -1) {
        snake.dx = 0;
        snake.dy = 1;
      }
      break;
    case 'ArrowLeft':
      if (snake.dx !== 1) {
        snake.dx = -1;
        snake.dy = 0;
      }
      break;
    case 'ArrowRight':
      if (snake.dx !== -1) {
        snake.dx = 1;
        snake.dy = 0;
      }
      break;
  }
}

document.addEventListener('keydown', handleKeyDown);

setInterval(update, 110); // Roep de update-functie elke 200 milliseconden aan (langzamere beweging)
