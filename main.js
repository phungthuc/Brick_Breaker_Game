let canvas;
let context;
let canvasWidth = 850;
let canvasHeight = 500;
let secondsPassed = 0;
let oldPassed = 0;
let ballX = 425;
let ballY = 460;
let ballDX = 300;
let ballDY = 140;
let radius = 10;
let paddleWidth = 170;
let paddleHeight = 12;

let brickConfig = {
    offSetX: 25,
    offSetY: 25,
    margin: 25,
    width: 78,
    height: 15,
    totalRow: 3,
    totalCol: 8
};

let isGameOver = false;
let isGameWin = false;
let score = 0;
let maxScore = brickConfig.totalCol * brickConfig.totalRow;

let brickList = [];

let paddle = {
    paddleX: (canvasWidth - paddleWidth) / 2,
    paddleY: canvasHeight - paddleHeight,
    speed: 20,
    
    isMovingLeft: false,
    isMovingRight: false
};

window.onload = init;

function init() {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');

    createBrickObjects();

    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    if(!isGameOver) {
        secondsPassed = (timeStamp - oldPassed) / 1000;
        oldPassed = timeStamp;

        update(secondsPassed);

        detectEdgeCollisions();
        movingPaddle();
        checkBallCollidePaddle();
        checkBallCollideBricks();
        checkGameOver();
        
        clear();

        drawBall();
        drawPaddle();
        drawBricks();
        drawScore();

        requestAnimationFrame(gameLoop);
    }else {
        console.log('Game Over!');
        alert('You Lose!');
    }
}

function drawBall() {
    
    context.beginPath();
    context.fillStyle='#110000';
    context.arc(ballX, ballY, radius, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
    
}

function drawPaddle() {
    context.beginPath();
    context.fillStyle = '#FF0000';
    context.fillRect(paddle.paddleX, paddle.paddleY, paddleWidth, paddleHeight);
    context.closePath();
}   

/*
    2 * OFFSET + 8 * WIDTH + 7 * MARGIN = 850
    OFFSET = MARGIN = 25
    => WIDTH = 78 
    ROW = 3 COL = 8
*/
function drawBricks() {
    brickList.forEach(function(b) {
        if(!b.isBroken) {
            context.beginPath();
            context.fillStyle='#00FFFF';
            context.fillRect(b.x, b.y, brickConfig.width, brickConfig.height);
            context.fill();
            context.closePath();
        }       
    });
}

function drawScore() {
    context.beginPath();
    context.font = '22px Arial';
    context.fillStyle = 'black';
    context.fillText('Score: ' + score, 10, 20);
    context.closePath();
}

function createBrickObjects() {
    for(let i = 0; i < brickConfig.totalRow; i++) {
        for(let j = 0; j < brickConfig.totalCol; j++) {
            brickList.push({
                x: brickConfig.offSetX + j * (brickConfig.width + brickConfig.margin),
                y: brickConfig.offSetY + i * (brickConfig.height + brickConfig.margin),
                isBroken: false 
            });
        }
    }
}

function update(secondsPassed) {
    ballX += ballDX * secondsPassed;
    ballY -= ballDY * secondsPassed;
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function detectEdgeCollisions() {
    //check Collisions left and right
    if(ballX < radius) {
        ballDX = Math.abs(ballDX);
        ballX = radius;
    }else if(ballX > canvas.width - radius) {
        ballDX = - Math.abs(ballDX);
        ballX = canvas.width - radius;
    }else if(ballY < radius) {
        ballDY = - Math.abs(ballDY);
        ballY = radius;
    }
}

function movingPaddle() {
    document.addEventListener('keyup', function(event) {
        console.log('KEY UP');
        console.log(event);
    
        if(event.keyCode == 37){
            paddle.isMovingLeft = false;
        }else if(event.keyCode == 39) {
            paddle.isMovingRight = false;
        }
    });
    
    document.addEventListener('keydown', function(event) {
        console.log('KEY DOWN');
        console.log(event);
    
        if(event.keyCode == 37){
            paddle.isMovingLeft = true;
        }else if(event.keyCode == 39) {
            paddle.isMovingRight = true;
        }
    });
    if(paddle.isMovingLeft) {
        paddle.paddleX -= paddle.speed;
    }else if(paddle.isMovingRight) {
        paddle.paddleX += paddle.speed;
    }

    if(paddle.paddleX < 0) {
        paddle.paddleX = 0;
    }else if(paddle.paddleX > canvasWidth - paddleWidth) {
        paddle.paddleX = canvasWidth - paddleWidth;
    }
}

function checkGameOver(){
    if(ballY > canvas.height - radius) {
        isGameOver = true;
    }
}

function checkBallCollidePaddle() {
    if(ballY + radius >= canvasHeight - paddleHeight && ballX >= paddle.paddleX && 
        ballX <= paddle.paddleX + paddleWidth) {

        ballDY = Math.abs(ballDY);
        ballY = canvasHeight - radius - paddleHeight;
    }
}

function checkBallCollideBricks() {
    brickList.forEach(function(b) {
        if(!b.isBroken) {
            if(ballX >= b.x && ballX <= b.x + brickConfig.width 
            && ballY + radius >= b.y && ballY - radius <= b.y + brickConfig.height) {
                ballDY = - Math.abs(ballDY);
                b.isBroken = true;
                score += 1;
                if(score >= maxScore) {
                    isGameWin = true;
                    console.log('You Win!');
                    alert('You Win!');
                }
            }
        }
    });
}

