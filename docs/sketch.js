let w_h = 600; // height of canvas
let w_w = 400; // width of canvas
let blockSize = w_w / 5; // size of each block
let fallingBlock; // the current falling block
let gameOver = false; // whether the game is over
let blocks = []; // an array to store all the blocks

let mySound;
function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound('song.mp3');
}

class Block {
  constructor(x, y, size, g) {
    // initialize block properties
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = [random(400), random(400), random(400)];
    this.g = g;
  }

  draw() {
    // draw the block on the canvas
    fill(this.color);
    rect(this.x, this.y, this.size, this.size);
  }

  update() {
    // update the position of the block
    this.y += this.g;
  }

  hitBottom(height) {
    // check if the block has hit the bottom of the canvas
    return this.y + this.size >= height;
  }

  hitBlock(blocks) {
    // check if the block has hit another block
    for (let block of blocks) {
      if (block.x === this.x && block.y === this.y + this.size) {
        return true;
      }
    }
    return false;
  }
}

function setup() {
  createCanvas(w_w, w_h);
  startNewBlock();
}

function matrix() {
  // draw the lines of the matrix
  stroke(150); // grey lines
  strokeWeight(2); // thick lines
  for (let i = height; i >= -1; i -= blockSize) line(0, i, width, i); // x lines
  for (let j = 0; j < width; j += blockSize) line(j, 0, j, height); // y lines
  noStroke();
}

function draw() {
  background(0);
  matrix();
  fallingBlock.draw();
  updateFallingBlock();
  drawAllBlocks();
  removeFullLines();
  if (gameOver) {
    // display game over message
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255); // set the background color
    square(50, 230, 300); // draw the background rectangle
    fill(255, 0, 0);
    text("Game Over", width / 2, height / 2);
    text("Click on screen", width / 2, height / 2 + 100);
    text("to restart the game", width / 2, height / 2 + 150);
    noLoop();
  }
}

function updateFallingBlock() {
  // update the position of the falling block
  fallingBlock.update();
  if (fallingBlock.hitBottom(height) || fallingBlock.hitBlock(blocks)) {
    // if the falling block has hit the bottom or another block, add it to the array of blocks and start a new block
    blocks.push(fallingBlock);
    if (!startNewBlock()) {
      // if new block collapses with a block it's game over
      gameOver = true;
    }
  }
}

function drawAllBlocks() {
  // draw all the blocks on the screen
  for (let block of blocks) {
    block.draw();
  }
}

function startNewBlock() {
  // create new block
  let x = floor(random(0, w_w / blockSize)) * blockSize;
  let y = 0;
  // update the fallingBlock to the new Block
  fallingBlock = new Block(x, y, blockSize, 10);
  for (let block of blocks) {
    // check if it's possible to start a new block
    if (block.x === fallingBlock.x && block.y - block.size <= fallingBlock.y) {
      return false;
    }
  }
  return true;
}

function keyPressed() {
  // move the blocks based on the keys pressed
  if (keyCode === LEFT_ARROW) {
    if (fallingBlock.x >= blockSize) {
      // move to the left if not out of bounds
      fallingBlock.x -= fallingBlock.size;
    }
  } else if (keyCode === RIGHT_ARROW) {
    // move to the right if not out of bounds
    if (fallingBlock.x + fallingBlock.size <= width - blockSize) {
      fallingBlock.x += fallingBlock.size;
    }
  }
}

function mouseClicked() {
  // if the games is over and mouse clicked, restart the game
  if (gameOver) {
    gameOver = false;
    loop();
    blocks = [];
    startNewBlock();
  }
}

function removeFullLines() {
  // remove the line where all blocks are present
  for (let i = height - blockSize; i >= 0; i -= blockSize) {
    let count = 0;
    for (let block of blocks) {
      if (block.y === i) {
        count++;
      }
    }
    if (count === width / blockSize) {
      removeLine(i);
    }
  }
}

function removeLine(lineY) {
  // The function removeLine takes in a lineY parameter
  // The blocks array is filtered so that only blocks with a "y" property not equal to lineY are kept
  blocks = blocks.filter((block) => block.y !== lineY);

  // For each block in the blocks array
  for (let block of blocks) {
    // If the "y" property of the block is less than lineY
    if (block.y < lineY) {
      // The "y" property of the block is increased by the value of blockSize
      block.y += blockSize;
    }
  }
}

function mousePressed() {
console.log(mySound.file) 
  if (mySound.isPlaying()) {
    mySound.stop();
  } else {
    mySound.play();
  }
}
