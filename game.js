//Set the obstacle element to be generated when the game starts and when previous obstacles leave the screen.
const obstacle = document.querySelector('.obstacle');
let obstacleLeft = 100;


const player = document.querySelector('.player');
let playerLeft = 0;
let playerBottom = 0;
let jumping = false;

const scoreDisplay = document.querySelector('.score');
let score = 0;
let startTime = Date.now();

const obstacleArray = [];

function createObstacle() {
    //Code for creating a new obstacle element
    const newObstacle = () => {
        //Code for creating a new obstacle element
        const newObstacle = document.createElement('div');
        newObstacle.classList.add('obstacle');
        newObstacle.style.top = `${Math.random() * window.innerHeight}px`;
        newObstacle.style.left = `${window.innerWidth + score}px`;
        newObstacle.style.width = 50 + 'px';
        newObstacle.style.height = 50 + 'px';
        document.body.appendChild(newObstacle);

        return newObstacle;
      };    
    
    obstacleArray.push(newObstacle); 
};

createObstacle();
      
setInterval(() => createObstacle(), 1000);


// Set the game container to be the same height as the window
const gameContainer = document.querySelector('#game-container');
gameContainer.style.height = (window.innerHeight) + 'px';
gameContainer.style.width = (window.innerWidth) + 'px';
gameContainer.background = 'black';
gameContainer.style.width = 100 + '%';

//Set the position of the player
player.style.left = '0';
player.style.bottom = '0';



//Move the player using the A, D and Space Keys

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyA') {
        playerLeft -= 2;
        player.style.left = playerLeft + '%';
    } else if (e.code === 'KeyD') {
        playerLeft += 2;
        player.style.left = playerLeft + '%';
    } else if (e.code === 'Space' && !jumping) {
        jumping = true;
        playerBottom += 100;
        player.style.bottom = playerBottom + 'px';
        setTimeout(() => {
            playerBottom -= 100;
            player.style.bottom = playerBottom + 'px';
            jumping = false;
        }, 500);
    }
});

// Move the obstacles towards the player at varying speeds, that get increasingly faster as the players score increases
const moveObstacle = () => {
    obstacleLeft -= 2 + score / 50;
    obstacle.style.left = obstacleLeft + '%';
};

// Check for collision between the player and the obstacle
const checkCollision = () => {
    const playerRect = player.getBoundingClientRect();
    let collision = false;
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

    return false;
};

// Stop the game when an obstacle is hit and display a reset button to restart the game
const stopGame = () => {
    clearInterval(gameLoop);
    const resetButton = document.querySelector('.reset-button');
    resetButton.innerHTML = 'Reset';
    resetButton.addEventListener('click', () => {
        window.location.reload();
    });
    document.body.appendChild(resetButton);
};

// When an obstacle goes off the screen, remove the obstacle and create a new one
let currentObstacle = obstacle;

const removeObstacle = () => {
    currentObstacle.remove();
    currentObstacle = createObstacle();
};

// Prevent the play from moving off the screen.
const checkObjective = () => {
    if (playerLeft < 0) {
        playerLeft = 0;
    } else if (playerLeft > 100) {
        playerLeft = 0;
    }

};

//The main game loop where all the actions occur
const gameLoop = setInterval(() => {
    const timeElapsed = (Date.now() - startTime) / 1000;
    score = timeElapsed;
    scoreDisplay.innerHTML = score.toFixed(1);

    if(checkObjective()) {
        clearInterval(gameLoop);
    } else {
        moveObstacle();
        checkCollision();
    }

    if (checkCollision()) {
        stopGame();
        clearinterval(gameLoop);
    }

    if (currentObstacle.offsetLeft < -10) {
        removeObstacle();
    }
}, 20);

//Start the Game
gameLoop;