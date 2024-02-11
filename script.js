// Initialize canvas and context
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const WHITE = "#ffffff";
const BLACK = "#000000";
const FPS = 60;

// Paddle and ball objects
let playerPaddle = {
  x: 20,
  y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
  dy: 0,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};

let aiPaddle = {
  x: WIDTH - 30,
  y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
  dy: 0,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};

let ball = {
  x: WIDTH / 2 - BALL_SIZE / 2,
  y: HEIGHT / 2 - BALL_SIZE / 2,
  dx: 5 * (Math.random() < 0.5 ? -1 : 1),
  dy: 5 * (Math.random() < 0.5 ? -1 : 1),
  size: BALL_SIZE,
};

// Score variables
let playerScore = 0;
let aiScore = 0;

// Add a variable to track the AI paddle speed
let aiPaddleSpeed = 4.5; // Increase the speed for faster AI paddle movement
// Default to slow-paced gameplay

// Add a variable to track if the game is paused
let paused = false;

// Function to toggle pause state
function togglePause() {
  paused = !paused;
  if (paused) {
    document.getElementById("pauseButton").textContent = "Resume";
  } else {
    document.getElementById("pauseButton").textContent = "Pause";
  }
}

// Function to toggle AI paddle speed
function toggleSpeed() {
  aiPaddleSpeed = aiPaddleSpeed === 4 ? 6 : 4; // Toggle between slow (4) and fast (6) speed
}

// Keyboard event listeners
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp") {
    playerPaddle.dy = -10;
  } else if (event.key === "ArrowDown") {
    playerPaddle.dy = 10;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    playerPaddle.dy = 0;
  }
});

// Main game loop
function update() {
  if (!paused) {
    // Only update the game if it's not paused
    // Move paddles
    playerPaddle.y += playerPaddle.dy;
    aiPaddle.y +=
      ball.y < aiPaddle.y + aiPaddle.height / 2
        ? -aiPaddleSpeed
        : ball.y > aiPaddle.y + aiPaddle.height / 2
        ? aiPaddleSpeed
        : 0;

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y + ball.size > HEIGHT || ball.y < 0) {
      ball.dy *= -1;
    }

    // Ball collision with paddles
    if (
      ball.x < playerPaddle.x + playerPaddle.width &&
      ball.x + ball.size > playerPaddle.x &&
      ball.y < playerPaddle.y + playerPaddle.height &&
      ball.y + ball.size > playerPaddle.y
    ) {
      ball.dx *= -1;
    }

    if (
      ball.x < aiPaddle.x + aiPaddle.width &&
      ball.x + ball.size > aiPaddle.x &&
      ball.y < aiPaddle.y + aiPaddle.height &&
      ball.y + ball.size > aiPaddle.y
    ) {
      ball.dx *= -1;
    }

    // Ball out of bounds
    if (ball.x < 0) {
      aiScore++; // Increment AI score
      reset();
    } else if (ball.x > WIDTH) {
      playerScore++; // Increment player score
      reset();
    }
  }
}

// Draw function
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw paddles
    ctx.fillStyle = WHITE;
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    // Draw ball
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

    // Draw dotted line in the middle
    ctx.beginPath();
    ctx.setLineDash([5, 10]); // Set the dash pattern: 5 pixels on, 10 pixels off
    ctx.strokeStyle = WHITE; // Set the stroke color to white
    ctx.moveTo(WIDTH / 2, 0); // Move to the middle of the canvas at the top
    ctx.lineTo(WIDTH / 2, HEIGHT); // Draw a line to the middle of the canvas at the bottom
    ctx.stroke(); // Stroke the line

    // Draw score
    ctx.font = "bold 60px Arial"; // Set font style and size
    ctx.textAlign = "center";
    // Create gradient for player score
    let playerGradient = ctx.createLinearGradient(0, 0, WIDTH / 4, 0);
    playerGradient.addColorStop(0, "black"); // White color at the start
    playerGradient.addColorStop(1, "white"); // Black color at the end
    ctx.fillStyle = playerGradient;
    ctx.fillText(playerScore, WIDTH / 4, HEIGHT / 2 + 25); // Draw player score in the middle of the left side
    // Create gradient for AI score
    let aiGradient = ctx.createLinearGradient(WIDTH / 2, 0, (3 * WIDTH) / 4, 0);
    aiGradient.addColorStop(0, "black"); // White color at the start
    aiGradient.addColorStop(1, "white"); // Black color at the end
    ctx.fillStyle = aiGradient;
    ctx.fillText(aiScore, (3 * WIDTH) / 4, HEIGHT / 2 + 25); // Draw AI score in the middle of the right side
}

// Reset function
function reset() {
  ball.x = WIDTH / 2 - BALL_SIZE / 2;
  ball.y = HEIGHT / 2 - BALL_SIZE / 2;
  ball.dx = 5 * (Math.random() < 0.5 ? -1 : 1);
  ball.dy = 5 * (Math.random() < 0.5 ? -1 : 1);
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game loop
gameLoop();

// Add event listeners
document.getElementById("pauseButton").addEventListener("click", togglePause);
document.getElementById("speedToggle").addEventListener("click", toggleSpeed);
