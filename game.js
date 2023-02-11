// Declaring the constants for the obstacle, player, and score.

const obstacle = document.querySelector('.obstacle');
const obstacleArray = [];

const player = document.querySelector('.player');
let playerLeft = 0;
let playerBottom = 0;
let jumping = false;
let doubleJumping = false;

// Animate the Player
let currentFrame = 0;
const frameWidth = 123;
const frameHeight = 123;
const numFrames = 8;

function animatePlayer() {
    currentFrame = (currentFrame + 1) % numFrames;
    player.style.backgroundPosition = `-${currentFrame * frameWidth}px 0px`;
}
    
    



const scoreDisplay = document.querySelector('.score');
let score = 0;
let startTime = Date.now();


// Creating the obstacle and randomizing the obstacle spawn.

function createObstacle() {
    const newObstacle = document.createElement('div');
    gameContainer.appendChild(newObstacle);
    newObstacle.classList.add('obstacle');

    // Generate a random number between 0 and 2

    const randomNum = Math.floor(Math.random() * 3);

    switch (randomNum) {
      case 0:
        newObstacle.style.bottom = "0px";
        break;
      case 1:
        newObstacle.style.bottom = "50px";
        break;
      case 2:
        newObstacle.style.bottom = "100px";
        break;
    }

    newObstacle.style.left = window.innerWidth;
    newObstacle.style.width = '50px';
    newObstacle.style.height = '50px';
  
    let speed = 2 + score / 20;
    newObstacle.speed = speed;

    return newObstacle;
};

function randomizeObstacleSpawn() {
    const randomTimeout = Math.floor(Math.random() * 2000) + 500;
    setTimeout(() => {
      obstacleArray.push(createObstacle());
      if (obstacle.offsetLeft + obstacle.offsetWidth < 0) {
        removeObstacle(obstacleArray[index]);
        index++;
      }
      randomizeObstacleSpawn();
    }, randomTimeout);
  }
  
  randomizeObstacleSpawn();

// Creating the player movement and collision detection.

const moveObstacle = (obstacle) => {
    obstacle.style.left = `${obstacle.offsetLeft - obstacle.speed}px`;
};

const gameContainer = document.querySelector('#game-container');
gameContainer.style.height = `${window.innerHeight}px`;
gameContainer.style.width = '100%';
gameContainer.style.background = 'black';

player.style.left = '0';
player.style.bottom = '0';

document.addEventListener('keydown', (e) => {
    if (checkCollision() === true) return; // Exit the game early, and prevent post-death movement if the player has lost.

    if (e.code === 'KeyA') {
        playerLeft -= 2;
        player.style.left = `${playerLeft}%`;
        animatePlayer();
    } else if (e.code === 'KeyD') {
        playerLeft += 2;
        player.style.left = `${playerLeft}%`;
        animatePlayer();
    } else if (e.code === 'Space' && !jumping) {
        jumping = true;
        playerBottom += 100;
        player.style.bottom = `${playerBottom}px`;
        setTimeout(() => {
            playerBottom -= 100;
            player.style.bottom = `${playerBottom}px`;
            jumping = false;
            doubleJumping = false;
        }, 1000);
    } else if (e.code === 'Space' && jumping && !doubleJumping) {
        doubleJumping = true;
        playerBottom += 100;
        player.style.bottom = `${playerBottom}px`;
        setTimeout(() => {
            playerBottom -= 100;
            player.style.bottom = `${playerBottom}px`;
            jumping = false;
            doubleJumping = false;
        }, 1000);
    }

    //Prevent the player from being able to move off-screen (or outside of the viewport).

    if (playerLeft < 0) {
        playerLeft = 0;
    }
    if (playerLeft > 95) {
        playerLeft = 95;
    }
});


const checkCollision = () => {
    const playerRect = player.getBoundingClientRect();

    for (const obstacle of obstacleArray) {
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top &&
            playerRect.top < obstacleRect.bottom
        ) {
            scoreDisplay.innerHTML = `Game Over! : ${score.toFixed(1)}`;
            return true;
        }
    }

    return false;
};


// Declaring the stop game, update score and removeObstacle functions. (I know I should move this higher up).

const stopGame = () => {
    clearInterval(gameLoop);
};

const removeObstacle = (obstacle) => {
    if (obstacle.offsetLeft + obstacle.offsetWidth < 0) {
      obstacle.remove();
    }
}; 

const updateScore = () => {
    score = (Date.now() - startTime) / 1000;
    scoreDisplay.innerHTML = `Score: ${score.toFixed(1)}`;
};


// Declaring the start game function and calling it.

let gameLoop;
    
const startGame = () => {
    score = 0;
    startTime = Date.now();
    gameLoop = setInterval(() => {
    for (const obstacle of obstacleArray) {
        moveObstacle(obstacle);
    }
    updateScore();
    if (checkCollision()) {
        stopGame();
    }
    }, 16);

    animateScript();

    };
    
startGame();
