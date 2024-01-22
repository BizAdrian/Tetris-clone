// Game board setup
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
let piece;
const board = [];
const bgn = document.createElement("audio");
bgn.setAttribute("src", "./assets/Soundtracks/Tetris-theme.mp3");
const clearLineSound = document.createElement("audio");
clearLineSound.setAttribute("src", "./assets/Soundtracks/Clear-line.mp3");
const easterEggSound = document.createElement("audio");
easterEggSound.setAttribute("src", "./assets/Soundtracks/Tetris-Rap.mp3");
const gameOverSound = document.createElement("audio");
let rotatedShape;
let isPaused = false;
let  isEasterEggPlaying = false;
// biome-ignore lint/style/useConst: <explanation>
// biome-ignore lint/style/noVar: <explanation>
var    volumeIcon = document.querySelector('mySVG');

bgn.loop = true;
bgn.volume = 0.5;

clearLineSound.loop = false;
clearLineSound.volume = 0.5;

easterEggSound.loop = false;
easterEggSound.volume = 0.5;



function changeIcon(icon) {
  if (bgn.paused) {
      bgn.play();
      icon.outerHTML = '<svg id="mySVG" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-volume" width="24" height="24" viewBox="0 0 24 24" stroke-width="0.5" stroke="#000000" fill="#ffffff" stroke-linecap="round" stroke-linejoin="round" onclick="changeIcon(this)"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M17.7 5a9 9 0 0 1 0 14" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /></svg>';
  } else {
      bgn.pause();
      icon.outerHTML = '<svg id="mySVG" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-volume-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" onclick="changeIcon(this)"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 1.912 4.934m-1.377 2.602a5 5 0 0 1 -.535 .464" /><path d="M17.7 5a9 9 0 0 1 2.362 11.086m-1.676 2.299a9 9 0 0 1 -.686 .615" /><path d="M9.069 5.054l.431 -.554a.8 .8 0 0 1 1.5 .5v2m0 4v8a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l1.294 -1.664" /><path d="M3 3l18 18" /></svg>';
  }
}



  const logo = document.querySelector('.logo');
// biome-ignore lint/complexity/useArrowFunction: <explanation>
logo.addEventListener('click', function() {
  if (!isEasterEggPlaying) {
      bgn.pause();
      easterEggSound.play();
      isEasterEggPlaying = true;
  } else {
      easterEggSound.pause();
      bgn.play();
      isEasterEggPlaying = false;
  }
});

// biome-ignore lint/complexity/useArrowFunction: <explanation>
easterEggSound.addEventListener('ended', function() {
  bgn.play();
  isEasterEggPlaying = false;
});


// init board
for (let row = 0; row < BOARD_HEIGHT; row++) {
  board[row] = [];
  for (let col = 0; col < BOARD_WIDTH; col++) {
    board[row][col] = 0;
  }
}

// Tetrominoes
const tetrominoes = [
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#ffd800",
  },
  {
    shape: [
      [0, 2, 0],
      [2, 2, 2],
    ],
    color: "#7925DD",
  },
  {
    shape: [
      [0, 3, 3],
      [3, 3, 0],
    ],
    color: "orange",
  },
  {
    shape: [
      [4, 4, 0],
      [0, 4, 4],
    ],
    color: "red",
  },
  {
    shape: [
      [5, 0, 0],
      [5, 5, 5],
    ],
    color: "green",
  },
  {
    shape: [
      [0, 0, 6],
      [6, 6, 6],
    ],
    color: "#ff6400 ",
  },
  { shape: [[7, 7, 7, 7]], color: "#00b5ff" },
];

// Tetromino randomizer
function randomTetromino() {
  const index = Math.floor(Math.random() * tetrominoes.length);
  const tetromino = tetrominoes[index];
  return {
    shape: tetromino.shape,
    color: tetromino.color,
    row: 0,
    col: Math.floor(Math.random() * (BOARD_WIDTH - tetromino.shape[0].length + 1)),
  };
}

// Current tetromino
let currentTetromino = randomTetromino();
let currentGhostTetromino;

// Draw tetromino
function drawTetromino() {
  const shape = currentTetromino.shape;
  const color = currentTetromino.color;
  const row = currentTetromino.row;
  const col = currentTetromino.col;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.style.backgroundColor = color;
        // biome-ignore lint/style/useTemplate: <explanation>
        block.style.top = (row + r) * 24 + "px";
        // biome-ignore lint/style/useTemplate: <explanation>
        block.style.left = (col + c) * 24 + "px";
        block.setAttribute("id", `block-${row + r}-${col + c}`);
        document.getElementById("game_board").appendChild(block);
      }
    }
  }
}

// Erase tetromino from board
function eraseTetromino() {
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        // biome-ignore lint/style/useConst: <explanation>
        let  row = currentTetromino.row + i;
        // biome-ignore lint/style/useConst: <explanation>
        let  col = currentTetromino.col + j;
        // biome-ignore lint/style/useConst: <explanation>
        let  block = document.getElementById(`block-${row}-${col}`);

        if (block) {
          document.getElementById("game_board").removeChild(block);
        }
      }
    }
  }
}

// Check if tetromino can move in the specified direction
function canTetrominoMove(rowOffset, colOffset) {
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        // biome-ignore lint/style/useConst: <explanation>
        let  row = currentTetromino.row + i + rowOffset;
        // biome-ignore lint/style/useConst: <explanation>
        let  col = currentTetromino.col + j + colOffset;

        if (row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
          return false;
        }
      }
    }
  }
  return true;
}

// Check if tetromino can move in the specified direction
function canTetrominoRotate() {
  for (let i = 0; i < rotatedShape.length; i++) {
    for (let j = 0; j < rotatedShape[i].length; j++) {
      if (rotatedShape[i][j] !== 0) {
        // biome-ignore lint/style/useConst: <explanation>
       let  row = currentTetromino.row + i;
        // biome-ignore lint/style/useConst: <explanation>
       let  col = currentTetromino.col + j;

        if (row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
          return false;
        }
      }
    }
  }
  return true;
}

// Lock the tetromino in place
function lockTetromino() {
  // Add the tetromino to the board
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        // biome-ignore lint/style/useConst: <explanation>
let  row = currentTetromino.row + i;
        // biome-ignore lint/style/useConst: <explanation>
let  col = currentTetromino.col + j;
        board[row][col] = currentTetromino.color;
        // Comprueba si alguna parte del tetromino está en la fila 0
        if (row === 0) {
          alert('Game Over');
          restartGame();
          return;
        }
      }
    }
  }

  // Check if any rows need to be cleared
  // biome-ignore lint/style/useConst: <explanation>
let  rowsCleared = clearRows();
  if (rowsCleared > 0) {
    // updateScore(rowsCleared);
  }

  // Create a new tetromino
  currentTetromino = randomTetromino();
}


function clearRows() {
  let rowsCleared = 0;

 
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    let rowFilled = true;

    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x] === 0) {
        rowFilled = false;
        break;
      }
    }

    if (rowFilled) {
      if (clearLineSound.readyState >= 2) {
        clearLineSound.play();
      }
      rowsCleared++;

      for (let yy = y; yy > 0; yy--) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[yy][x] = board[yy - 1][x];
        }
      }

      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[0][x] = 0;
      }
      document.getElementById("game_board").innerHTML = "";
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
          if (board[row][col]) {
            const block = document.createElement("div");
            block.classList.add("block");
            block.style.backgroundColor = board[row][col];
            // biome-ignore lint/style/useTemplate: <explanation>
            block.style.top = row * 24 + "px";
            // biome-ignore lint/style/useTemplate: <explanation>
            block.style.left = col * 24 + "px";
            block.setAttribute("id", `block-${row}-${col}`);
            document.getElementById("game_board").appendChild(block);
          }
        }
      }
    }
  }

  return rowsCleared;
}

// Rotate the tetromino
function rotateTetromino() {
  rotatedShape = [];
  for (let i = 0; i < currentTetromino.shape[0].length; i++) {
    // biome-ignore lint/style/useConst: <explanation>
    let  row = [];
    for (let j = currentTetromino.shape.length - 1; j >= 0; j--) {
      row.push(currentTetromino.shape[j][i]);
    }
    rotatedShape.push(row);
  }

  // Check if the rotated tetromino can be placed
  if (canTetrominoRotate()) {
    eraseTetromino();
    currentTetromino.shape = rotatedShape;
    drawTetromino();
  }

  moveGhostTetromino();
}

// Move the tetromino
function moveTetromino(direction) {
  if (isPaused) return;

  let row = currentTetromino.row;
  let col = currentTetromino.col;

  if (direction === "left") {
    if (canTetrominoMove(0, -1)) {
      eraseTetromino();
      col -= 1;
      currentTetromino.col = col;
      currentTetromino.row = row;
      drawTetromino();
    }
  } else if (direction === "right") {
    if (canTetrominoMove(0, 1)) {
      eraseTetromino();
      col += 1;
      currentTetromino.col = col;
      currentTetromino.row = row;
      drawTetromino();
    }
  } else {
    if (canTetrominoMove(1, 0)) {
      eraseTetromino();
      row++;
      currentTetromino.col = col;
      currentTetromino.row = row;
      drawTetromino();
    } else {
      lockTetromino();
    }
  }

  moveGhostTetromino();
}

drawTetromino();
setInterval(moveTetromino, 500);

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      moveTetromino("left");
      break;
    case 39: // right arrow
      moveTetromino("right");
      break;
    case 40: // down arrow
      moveTetromino("down");
      break;
    case 38: // up arrow
      rotateTetromino();
      break;
    case 32: // up arrow
      dropTetromino();
      break;
    default:
      break;
  }
}

// Añade escuchadores de eventos táctiles al documento
document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

// biome-ignore lint/style/noVar: <explanation>
var  xDown = null;                                                        
// biome-ignore lint/style/noVar: <explanation>
var  yDown = null;                                                        

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
      return;
  }

  // biome-ignore lint/style/noVar: <explanation>
var  xUp = evt.touches[0].clientX;                                    
  // biome-ignore lint/style/noVar: <explanation>
var  yUp = evt.touches[0].clientY;

  // biome-ignore lint/style/noVar: <explanation>
var  xDiff = xDown - xUp;
  // biome-ignore lint/style/noVar: <explanation>
var  yDiff = yDown - yUp;

  // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
if  (evt.touches.length == 2) { // Si hay dos dedos en la pantalla
      // biome-ignore lint/style/noVar: <explanation>
// biome-ignore lint/correctness/noInnerDeclarations: <explanation>
var    xDownSecond = evt.touches[1].clientX; // Segundo dedo
      // biome-ignore lint/style/noVar: <explanation>
// biome-ignore lint/correctness/noInnerDeclarations: <explanation>
var    yDownSecond = evt.touches[1].clientY;

      // biome-ignore lint/correctness/noInnerDeclarations: <explanation>
// biome-ignore lint/style/noVar: <explanation>
var    angle = Math.atan2(yDown - yDownSecond, xDown - xDownSecond) * 180 / Math.PI;

      if (angle > 45 && angle < 135) {
          rotateTetromino("clockwise"); // Rotar en sentido horario
      } else if (angle < -45 && angle > -135) {
          rotateTetromino("counterclockwise"); // Rotar en sentido antihorario
      }
  } else if (Math.abs(xDiff) > Math.abs(yDiff)) { // Deslizamiento horizontal
      if (xDiff > 0) {
          moveTetromino("left"); // Izquierda
      } else {
          moveTetromino("right"); // Derecha
      }                       
  } else { // Deslizamiento vertical
      if (yDiff > 0) {
          // Arriba
      } else { 
          moveTetromino("down"); // Abajo
      }                                                                 
  }
  xDown = null;
  yDown = null;                                             
};

// sound init
document.body.addEventListener("click", () => {
  bgm.play();
  bgm.muted = false;
  drop.muted = false;
});

function dropTetromino() {
  let row = currentTetromino.row;
  // biome-ignore lint/style/useConst: <explanation>
let  col = currentTetromino.col;

  drop.muted = false;
  drop.play();

  while (canTetrominoMove(1, 0)) {
    eraseTetromino();
    row++;
    currentTetromino.col = col;
    currentTetromino.row = row;
    drawTetromino();
  }
  lockTetromino();
}

// Draw Ghost tetromino
function drawGhostTetromino() {
  const shape = currentGhostTetromino.shape;
  const color = "rgba(255,255,255,0.5)";
  const row = currentGhostTetromino.row;
  const col = currentGhostTetromino.col;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const block = document.createElement("div");
        block.classList.add("ghost");
        block.style.backgroundColor = color;
        // biome-ignore lint/style/useTemplate: <explanation>
        block.style.top = (row + r) * 24 + "px";
        // biome-ignore lint/style/useTemplate: <explanation>
        block.style.left = (col + c) * 24 + "px";
        block.setAttribute("id", `ghost-${row + r}-${col + c}`);
        document.getElementById("game_board").appendChild(block);
      }
    }
  }
}

function eraseGhostTetromino() {
  const ghost = document.querySelectorAll(".ghost");
  for (let i = 0; i < ghost.length; i++) {
    ghost[i].remove();
  }
}

// Check if tetromino can move in the specified direction
function canGhostTetrominoMove(rowOffset, colOffset) {
  for (let i = 0; i < currentGhostTetromino.shape.length; i++) {
    for (let j = 0; j < currentGhostTetromino.shape[i].length; j++) {
      if (currentGhostTetromino.shape[i][j] !== 0) {
        // biome-ignore lint/style/useConst: <explanation>
      let  row = currentGhostTetromino.row + i + rowOffset;
        // biome-ignore lint/style/useConst: <explanation>
      let  col = currentGhostTetromino.col + j + colOffset;

        if (row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
          return false;
        }
      }
    }
  }
  return true;
}

function moveGhostTetromino() {
  eraseGhostTetromino();

  currentGhostTetromino = { ...currentTetromino };
  while (canGhostTetrominoMove(1, 0)) {
    currentGhostTetromino.row++;
  }

  drawGhostTetromino();
}


function togglePause() {
  isPaused = !isPaused;
}

function restartGame() {
  // Limpia el tablero
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      board[row][col] = 0;
      // biome-ignore lint/style/useConst: <explanation>
let  block = document.getElementById(`block-${row}-${col}`);
      if (block) {
        document.getElementById("game_board").removeChild(block);
      }
    }
  }

  // Crea un nuevo tetromino
  currentTetromino = randomTetromino();

  // Asegúrate de que el juego no esté en pausa
  isPaused = false;
}

