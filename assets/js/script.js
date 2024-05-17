// Hides the crash screen so it can be unhidden later
document.getElementById("crash-panel").classList.toggle("hidden");
// Hides the completed screen so it can be unhidden later
document.getElementById("completed-panel").classList.toggle("hidden");
// Hides bottom banner containing direction buttons
document.getElementById("bottom-banner").classList.toggle("hidden");
// Reloads the page on resize to ensure game works correctrly using screen dimensions
window.addEventListener("resize", reload, false);
// Creates mute button event listener
document.getElementById("mute").addEventListener("click", toggleMute);
// Reloads page when game restarted / reset button pressed
document.getElementById("reset").addEventListener("click", reload);
// Launches animations when Start Game button pressed
document.getElementById("start-btn").addEventListener("click", initialiseGame);
document.getElementById("start-btn1").addEventListener("click", initialiseGame);

// -- Global Variables --

// References HTML canvas element
const canvas = document.getElementById("canvas");
// Gets the context CanvasRenderingContext2D interface for canvas
const ctx = canvas.getContext("2d", { alpha: false });
// Sets the sizes to inner window sizes
const cnvsWidth = window.innerWidth;
// -4 removes the overflow scrollbar
const cnvsHeight = window.innerHeight - 4;
// Sets dimensions to these variables
ctx.canvas.width = cnvsWidth;
ctx.canvas.height = cnvsHeight;
// Length of canvas
const cnvsLength = canvas.width;
// Center of axis points on canvas
const centreOfX = canvas.width / 2;
const centreOfY = canvas.height / 2;
// Position of player ship on y axis
var shipFromCenter = centreOfY / 2;
// Unit of size for shapes
var size = 1;
// Initial angle of canvas rotation for player ship object
var angle = 0;
// Initial score - The score is 0 to allow for countdown timer, game starts when score increases to 0
var score = 0;
// Arrays to store object instances
var starsArray = [];
var spritesArray = [];
// Used for ship direction functionality
var time = null;
// Used to detect whether game has ended or not
var endGame = false;
// Responsive variables - number of objects generated on screen at one time & speed of generated objects based on screen width
// Initial values
var initialNumberOfStars, initialNumberOfSprites, initialSpeed;

// Function to update values based on score
function updateValues(score) {
  var interval = Math.floor(score / 1000);
  var increasePercentage = interval * 0.02;

  // Update initial values based on interval and increasePercentage
  numberOfStars = Math.floor(initialNumberOfStars * (1 + increasePercentage));
  numberOfSprites = Math.floor(
    initialNumberOfSprites * (1 + increasePercentage)
  );
  speed = initialSpeed + interval * 0.02 * initialSpeed;
}

// Initial setup based on cnvsWidth
if (cnvsWidth < 360) {
  initialNumberOfStars = 650 * 0.4; // 260
  initialNumberOfSprites = 60 * 0.4; // 24
  initialSpeed = 0.02;
} else if (cnvsWidth < 768) {
  initialNumberOfStars = 900 * 0.4; // 360
  initialNumberOfSprites = 80 * 0.4; // 32
  initialSpeed = 0.04;
} else if (cnvsWidth < 1200) {
  initialNumberOfStars = 1200 * 0.4; // 480
  initialNumberOfSprites = 90 * 0.4; // 36
  initialSpeed = 0.06;
} else {
  initialNumberOfStars = 1500 * 0.4; // 600
  initialNumberOfSprites = 100 * 0.4; // 40
  initialSpeed = 0.1;
}

// Initial update of values
updateValues(0); // Assuming score starts from 0

// Later, whenever the score changes, call updateValues(score)

// -- Class Definitions --

// Background Stars (Inspired by Sharad Choudhary's formula - https://www.youtube.com/watch?v=CSoZPdhNwjY)
class Star {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  moveStar() {
    this.z = this.z - speed;
    if (this.z <= 0) {
      this.z = cnvsWidth;
      this.x = Math.random() * cnvsWidth;
      this.y = Math.random() * cnvsHeight;
    }
  }

  // Creates and renders the Star object to the canvas when called on the object each frame
  showStar() {
    let xPos = (this.x - centreOfX) * (cnvsLength / this.z);
    let yPos = (this.y - centreOfY) * (cnvsLength / this.z);
    // Relocates zero to the center of the screen and ensures objects move away from this center, including object positions decreasing in value
    xPos = xPos + centreOfX;
    yPos = yPos + centreOfY;
    // Changes size of the Star object in relation to the center of the canvas and Z value; size is smallest when in the center
    let s = size * (cnvsLength / this.z);

    // Calculate the points of the star
    const points = 5; // You can adjust this for more or fewer points
    const innerRadius = s / 2; // Radius of the inner corners of the star
    const outerRadius = s; // Radius of the outer corners of the star
    const angleStep = (Math.PI * 2) / points; // Angle between each point

    ctx.beginPath();

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius; // Alternating between inner and outer radius
      const currentAngle = i * angleStep;
      const x = xPos + radius * Math.cos(currentAngle);
      const y = yPos + radius * Math.sin(currentAngle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();

    // if (score === 250) {
    //   const a = [1, 2, 3];
    //   console.log(Math.floor(Math.random()*100));
    // }

    function getColor(score) {
      const interval = 450;
      const storedPermutation = localStorage.getItem("randomPermutation");
      let retrievedPermutation = [];

      // Check if the stored permutation exists in localStorage
      if (storedPermutation) {
        retrievedPermutation = JSON.parse(storedPermutation);
      } else {
        // If not, initialize with default permutation
        retrievedPermutation = [0, 1, 2, 3, 4];
      }

      // console.log(storedPermutation)
      const colors = ["#6900b4", "#00708b", "#132aff", "#4cc437", "#e3124b"];
      const colorIndex =
        Math.floor(score / interval) % retrievedPermutation.length;
      const permutationIndex = retrievedPermutation[colorIndex];

      return colors[permutationIndex];
    }

    const color = getColor(score);
    ctx.fillStyle = color;

    // if (score <= 250) {
    //   ctx.fillStyle = "#6900b4";
    // } else if (score <= 500) {
    //   ctx.fillStyle = "#00708b";
    // } else if (score <= 750) {
    //   ctx.fillStyle = "#132aff";
    // } else if (score <= 1000) {
    //   ctx.fillStyle = "#4cc437";
    // } else if (score <= 1250) {
    //   ctx.fillStyle = "#e3124b";
    // }

    // else if (score <= 430) {
    //   ctx.fillStyle = "7609c4";
    // } else if (score <= 540) {
    //   ctx.fillStyle = "#1b1bd6";
    // } else if (score <= 590) {
    //   ctx.fillStyle = "#7f00d4";
    // } else if (score <= 650) {
    //   ctx.fillStyle = "#132aff";
    // } else if (score <= 700) {
    //   ctx.fillStyle = "#00708b";
    // } else if (score <= 750) {
    //   ctx.fillStyle = "#386323";
    // } else if (score <= 810) {
    //   ctx.fillStyle = "#5d794f";
    // } else if (score <= 870) {
    //   ctx.fillStyle = "#4cc437";
    // } else if (score <= 920) {
    //   ctx.fillStyle = "#838383";
    // } else if (score <= 1000) {
    //   ctx.fillStyle = "#704cf0";
    // }

    ctx.fill();
  }
}

// #6900b4 #00708b #132aff #4cc437 red

// #6900b4 #00708b #132aff #4cc437 red
const Mix = [
  "assets/img/x.png",
  "assets/img/3000_3500.png",
  "assets/img/1_500.png",
  "assets/img/1250_1750.png",
  "assets/img/1750_2250.png",
];

const purple = [
  "assets/img/purple/p1.png",
  "assets/img/purple/p2.png",
  "assets/img/purple/p3.png",
  "assets/img/purple/p4.png",
  "assets/img/purple/p5.png",
  "assets/img/purple/p6.png",
];
const blue = [
  "assets/img/blue/b1.png",
  "assets/img/blue/b2.png",
  "assets/img/blue/b3.png",
  "assets/img/blue/b4.png",
  "assets/img/blue/b5.png",
  "assets/img/blue/b6.png",
];
const imagePaths = [
  "assets/img/Darkblue/d1.png",
  "assets/img/Darkblue/d2.png",
  "assets/img/Darkblue/d3.png",
  "assets/img/Darkblue/d2.png",
  "assets/img/Darkblue/d3.png",
];
const green = [
  "assets/img/green/g1.png",
  "assets/img/green/g2.png",
  "assets/img/green/g3.png",
  "assets/img/green/g4.png",
  "assets/img/green/g5.png",
  "assets/img/green/g6.png",
  "assets/img/green/g7.png",
];
const Red = [
  "assets/img/red/r1.png",
  "assets/img/red/r2.png",
  "assets/img/red/r3.png",
  "assets/img/red/r4.png",
  "assets/img/red/r5.png",
  "assets/img/red/r6.png",
];
class Sprite {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.image = new Image();

    this.image.src = "assets/img/1_500.png";
    this.randomX = notZeroRange(-10, 10);
    this.randomY = notZeroRange(-10, 10);
  }

  // Called on the Sprite object each frame to create movement
  moveSprite() {
    this.z = this.z - speed / 2;

    // If object reaches the top of the canvas z-index (0), reset z value
    if (this.z <= 0) {
      this.z = cnvsWidth;

      if (Math.random() < 0.02) {
        this.randomX = 0;
        this.randomY = 9;
      } else {
        this.randomX = notZeroRange(-10, 10);
        this.randomY = notZeroRange(-10, 10);
      }
    }
  }

  // Creates and renders the Sprite object (asteroid) to the canvas when called on the object each frame
  showSprite() {
    if (true) {
      let xPos = this.x;
      let yPos = this.y;
      let s = (size / 1) * (cnvsLength / this.z);
      xPos = xPos + s * this.randomX;
      yPos = yPos + s * this.randomY;

      // Draw the asteroid image instead of a geometric shape
      ctx.drawImage(this.image, xPos - s, yPos - s, s * 2, s * 2);

      function getAsteroid(score) {
        const interval = 450;
        const storedPermutation = localStorage.getItem("randomPermutation");
        let retrievedPermutation = [];

        // Check if the stored permutation exists in localStorage
        if (storedPermutation) {
          retrievedPermutation = JSON.parse(storedPermutation);
        } else {
          // If not, initialize with default permutation
          retrievedPermutation = [0, 1, 2, 3, 4];
        }

        // console.log(storedPermutation)
        const colors = [
          purple[retrievedPermutation[0]],
          blue[retrievedPermutation[1]],
          imagePaths[retrievedPermutation[2]],
          green[retrievedPermutation[3]],
          Red[retrievedPermutation[4]],
        ];
        const colorIndex =
          Math.floor(score / interval) % retrievedPermutation.length;
        const permutationIndex = retrievedPermutation[colorIndex];

        return colors[permutationIndex];
      }

      const ast = getAsteroid(score);
      this.image.src = ast;

      // if( score < 500 ){
      //   this.image.src = 'assets/img/1_500.png';
      // } else if( score < 10000 ){
      //   this.image.src = 'assets/img/2500_3000.png';
      // }
      // else if( score < 1250 ) {
      //   this.image.src = 'assets/img/1000_1250.png';
      // } else if( score < 1750 ) {
      //   this.image.src = 'assets/img/1250_1750.png';
      // } else if( score < 2250 ) {
      //   this.image.src = 'assets/img/1750_2250.png';
      // } else if( score < 2500 ) {
      //   this.image.src = 'assets/img/2250_2500.png';
      // } else if( score < 3000 ) {
      //   this.image.src = 'assets/img/2500_3000.png';
      // } else if( score < 3500 ) {
      //   this.image.src = 'assets/img/3000_3500.png';
      // } else if( score < 3750 ) {
      //   this.image.src = 'assets/img/3500_3750.png';
      // } else if( score < 4250 ) {
      //   this.image.src = 'assets/img/3750_4250.png';
      // } else if( score < 5000 ) {
      //   this.image.src = 'assets/img/4250_5000.png';
      // } else if( score < 6000 ) {
      //   this.image.src = 'assets/img/5000_6000.png';
      // } else if( score < 7000 ) {
      //   this.image.src = 'assets/img/6000_7000.png';
      // } else if( score < 8000 ) {
      //   this.image.src = 'assets/img/7000_8000.png';
      // } else {
      //   this.image.src = 'assets/img/8000_10000.png';
      // }

      collisionDetection(xPos, yPos);
    }
  }
}

// ... (Rest of your code)

// Function to get a random number between min and max, excluding zero
function notZeroRange(min, max) {
  let num = 0;
  while (num === 0) {
    num = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return num;
}

// -- Functions --

// Converts angle degree to radians
function convertToRadians(degree) {
  return degree * (Math.PI / 180);
}

// Generates random number between two values ensuring the value is atleast min argument input
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// Returns a number between two values avoiding zero by never being between -1.75 and 1.75
function notZeroRange(min, max) {
  if (getRandom(0, 1) > 0.5) {
    return getRandom(min, -1.75);
  } else {
    return getRandom(1.75, max);
  }
}

// Mute button functionality
function toggleMute() {
  music.muted = !music.muted;
  explosion.muted = !explosion.muted;
  start.muted = !start.muted;
  completed.muted = !completed.muted;
  document.getElementById("i-muted").classList.toggle("hidden");
  document.getElementById("i-not-muted").classList.toggle("hidden");
}

// Clears canvas then draws Star objects when called each frame within update()
function drawStars() {
  if (!endGame) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cnvsWidth, cnvsHeight);
  } else {
    // Creates trail and spins canvas on end game screens
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(-1000, -1000, canvas.width + 3000, canvas.height + 3000);
    ctx.translate(centreOfX, centreOfY);
    ctx.rotate(Math.PI * -0.0009);
    ctx.translate(-centreOfX, -centreOfY);
  }

  // Calls methods on Star objects array each frame
  for (var i = 0; i < numberOfStars; i++) {
    starsArray[i].showStar(); // Updates the z value
    starsArray[i].moveStar(); // Paints new object
  }
}

// Calls methods on Star objects array each frame
function drawSprites() {
  for (var i = 0; i < numberOfSprites; i++) {
    spritesArray[i].showSprite(); // Updates the z value
    spritesArray[i].moveSprite(); // Paints new object
  }
}

// Draws player spaceship
function playerShip() {
  const shipImage = document.getElementById("shipImage");
  x1 = 0;
  y1 = 0 + centreOfY / 2;
  x2 = 80;
  y2 = 40 + centreOfY / 2 + 20;
  x3 = -230;
  y3 = 0 + centreOfY / 2 + 20;
  s = 9;

  // Save and transform canvas to centre of screen for ship rotation
  ctx.save();
  ctx.translate(centreOfX, centreOfY);
  ctx.rotate(convertToRadians(angle));

  const shipX = -((x2 - x1) / 2) + x1;
  const shipY = -((y2 - y1) / 2) + y1;

  ctx.drawImage(shipImage, shipX, shipY, x2 - x1, y2 - y1 + 18);

  // Shapes used to draw ship
  // Under Glow
  ctx.beginPath();

  // Restore canvas to saved state before transformation
  ctx.restore();
}

// Move left functionality
function moveLeft() {
  // Removes the delay in movement after initial keydown
  time = setInterval(function () {
    // Appends angle value to ships angle of position
    angle += 2;
    if (angle > 360) {
      angle = 0;
    }
  }, 10);
}

// Move right functionality
function moveRight() {
  // Fires movement rapidly - Removes the delay in movement after initial keydown and increases speed
  time = setInterval(function () {
    // Appends angle value to ships angle of position
    angle -= 2;
    if (angle < -360) {
      angle = 0;
    }
  }, 10);
}

// Stops movement when user stops touching screen
function unTouch() {
  // Clears setInterval timer
  clearInterval(time);
}

// Key down functionality
function keyDown(e) {
  // Removes key event repeat on key hold
  if (e.repeat) {
    return;
  }
  // Prevents bug caused when multiple keys are pressed
  document.removeEventListener("keydown", keyDown);
  // Key event listeners
  if (e.key === "ArrowLeft" || e.key === "Left") {
    moveLeft();
  } else if (e.key === "ArrowRight" || e.key === "Right") {
    moveRight();
  } else if (e.key === "Enter" && score < -99) {
    initialiseGame();
  } else if (e.key === "Enter" && endGame) {
    reload();
  }
}

// Key up functionality
function keyUp(e) {
  if (
    e.key === "ArrowLeft" ||
    e.key === "Left" ||
    e.key === "ArrowRight" ||
    e.key === "Right" ||
    e.key === "Enter"
  ) {
    // Clears setInterval timer
    clearInterval(time);
    // Adds event listener back in - Prevents bug caused when multiple keys are pressed
    document.addEventListener("keydown", keyDown);
  }
}

// Directional contols event listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
document
  .getElementById("left-direction-btn")
  .addEventListener("touchstart", moveLeft, { passive: true });
document
  .getElementById("left-direction-btn")
  .addEventListener("touchend", unTouch);
document
  .getElementById("right-direction-btn")
  .addEventListener("touchstart", moveRight, { passive: true });
document
  .getElementById("right-direction-btn")
  .addEventListener("touchend", unTouch);

// Reloads page
function reload() {
  window.location.reload(true);
}

// Functions to convert angle into X and Y positions of the Ship object on canvas - Used to create an array for collision detection
// Returns positive angle value
function getActualAngle(angle) {
  if (angle >= 0 && angle < 270) {
    // rotates the 0 point to where player craft renders
    return angle + 90;
  } else if (angle >= 270) {
    return angle - 270;
  } else if (angle >= -90 && angle < 0) {
    return 360 + angle - 270;
  } else {
    return 360 + angle;
  }
}

// Get the cosine values associated with angle
function getAngleNumber(angle) {
  const angleInRadians = (angle * Math.PI) / 180;
  return [Math.cos(angleInRadians), Math.sin(angleInRadians)];
}

// Creates array with all possible X and Y coordinates associated with angle
function getAllPossibleShipLocations() {
  // Creates object to store array
  let shipLocations = {};
  // Takes the angle and returns correct Math.cos() value for X
  function getXShipValue(angle) {
    let actualAngle = getActualAngle(angle);
    if (actualAngle >= 0 && actualAngle <= 360) {
      return getAngleNumber(angle)[0];
    } else {
      return -getAngleNumber(angle)[0];
    }
  }
  // Takes the angle and returns correct Math.sin() value for Y
  function getYShipValue(angle) {
    let actualAngle = getActualAngle(angle);
    if (actualAngle >= 0 && actualAngle <= 360) {
      return getAngleNumber(angle)[1];
    } else {
      return -getAngleNumber(angle)[1];
    }
  }
  // Performs operations to generate correct X position value
  function generateX(angle) {
    let shipValue = getXShipValue(angle) * shipFromCenter;
    return centreOfX + shipValue;
  }
  // Performs operations to generate correct Y position value
  function generateY(angle) {
    let shipValue = getYShipValue(angle) * shipFromCenter;
    return centreOfY + shipValue;
  }
  // Assigns final X and Y values correlating with the angle to array indexes
  for (i = 0; i < 360; i++) {
    let angleKey = i.toString();
    shipLocations[angleKey] = [generateX(i), generateY(i)];
  }
  // Returns an array - Needs index key to be called
  return shipLocations;
}

// Takes angle and calls associated index key from shipLocations array
function getShipLocation(angle) {
  // Returns positive angle value
  function getActualAngle(angle) {
    if (angle >= 0 && angle < 270) {
      // rotates the 0 point to where player craft renders
      return angle + 90;
    } else if (angle >= 270) {
      return angle - 270;
    } else if (angle >= -90 && angle < 0) {
      return 360 + angle - 270;
    } else {
      return 360 + angle + 90;
    }
  }
  // Creates string used for index key
  let actualAngle = getActualAngle(angle).toString();
  // Calls the array with associated index key
  return getAllPossibleShipLocations()[actualAngle];
}

// Collision detection between the X and Y of the sprites with the shipLocations array X and Y values generated in getShipLocations()
function collisionDetection(x, y) {
  if (
    // The range of the detection is 35 each side enabling high incrimentation sprite values to be caught
    x - getShipLocation(angle)[0] <= 35 &&
    x - getShipLocation(angle)[0] >= -35 &&
    y - getShipLocation(angle)[1] <= 35 &&
    y - getShipLocation(angle)[1] >= -35
  ) {
    // Calls crash screen when a collision is detected
    crashScreen();
  }
}

// Draws current score to the screen in bottom left
// function drawScore() {
//   if (cnvsWidth <= 600) {
//     ctx.font = "3vw Orbitron, sans-serif";
//     ctx.fillStyle = "rgba(0, 0, 0, 0.25)"; // Black with opacity 0.25
//     ctx.fillRect(cnvsWidth - 180, 50, 150, 60); // Adjust position and size as needed
//     ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // Border color
//     ctx.strokeRect(cnvsWidth - 180, 50, 150, 60); // Draw border
//     ctx.strokeStyle = "rgba(252, 252, 252, 1)";
//     ctx.strokeText("SCORE:" + score, cnvsWidth - 80, 100);
//   } else {
//     ctx.fillStyle = "rgba(255, 255, 255, 0.25)"; // Black with opacity 0.25
//     ctx.fillRect(cnvsWidth - 350, 50, 300, 60); // Adjust position and size as needed
//     ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // Border color
//     ctx.strokeRect(cnvsWidth - 350, 50, 300, 60); // Draw border
//   }
// }

// let score = 0; // Initialize the score variable

function drawScore() {
  // Convert score to string and pad with leading zeros
  let scoreText = score.toString().padStart(6, "0");

  if (cnvsWidth <= 600) {
    ctx.font = "5vw Orbitron, sans-serif";
    ctx.strokeText(scoreText, cnvsWidth - 108, 50);
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)"; // Black with opacity 0.25
    ctx.fillRect(cnvsWidth - 120, 22, 110, 40); // Adjust position and size as needed
    // ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // Border color
    ctx.lineJoin = "round";
    // ctx.strokeRect(cnvsWidth - 315, 60, 300, 60); // Draw border
  } else {
    ctx.font = "2vw Orbitron, sans-serif";
    ctx.strokeText(scoreText, cnvsWidth - 170, 50);
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)"; // Black with opacity 0.25
    ctx.fillRect(cnvsWidth - 185, 10, 180, 60); // Adjust position and size as needed
    // ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // Border color
    ctx.lineJoin = "round";
    // ctx.strokeRect(cnvsWidth - 315, 60, 300, 60); // Draw border
  }

  scoreText++; // Increment the score
}

// Increases the value of score per frame
function scoreIncrease() {
  score += 1;
}

// Increases the speed per frame
function speedIncrease() {
  // if (score < 3000 && cnvsWidth < 600) {
  //   speed += 0.002;
  // } else if (score < 3000 && cnvsWidth < 1200) {
  //   speed += 0.002;
  // } else if (score < 3000) {
  //   speed += 0.002;
  // } else if (score < 6000 && cnvsWidth < 600) {
  //   speed += 0.00186;
  // } else if (score < 6000 && cnvsWidth < 1200) {
  //   speed += 0.00186;
  // } else if (score < 6000) {
  //   speed += 0.000186;
  // } else if (score < 9000 && cnvsWidth < 600) {
  //   speed += 0.001732;
  // } else if (score < 9000 && cnvsWidth < 1200) {
  //   speed += 0.001732;
  // } else if (score < 9000) {
  //   speed += 0.001732;
  // }

  if (score % 1000 === 0 && score !== 0) {
    // speed *= 1.02;
    // New stars & Sprites
    for (let i = numberOfStars; i < Math.floor(numberOfStars * 1.01); i++) {
      starsArray[i] = new Star(
        Math.random() * cnvsWidth,
        Math.random() * cnvsHeight,
        Math.random() * cnvsWidth
      );
    }
    numberOfStars = Math.floor(numberOfStars * 1.01);
    console.log("Stars:", starsArray);

    for (let i = numberOfSprites; i < Math.floor(numberOfSprites * 1.01); i++) {
      spritesArray[i] = new Sprite(
        centreOfX,
        centreOfY,
        Math.random() * cnvsWidth
      );
    }
    numberOfSprites = Math.floor(numberOfSprites * 1.01);
  }
}

// Crash screen functionality
function crashScreen() {
  document.getElementById("bottom-banner").classList.toggle("hidden");
  document.getElementById("crash-panel").classList.toggle("hidden");
  document.getElementById("github").classList.toggle("hidden");
  document.getElementById("restart-btn").addEventListener("click", reload);
  document.getElementById("explosion").play();
  endGame = true;
  saveHighScore();
}

// Completed screen functionality
function completedScreen() {
  document.getElementById("bottom-banner").classList.toggle("hidden");
  document.getElementById("completed-panel").classList.toggle("hidden");
  document.getElementById("github").classList.toggle("hidden");
  document.getElementById("restart-btn").addEventListener("click", reload);
  document.getElementById("completed").play();
  endGame = true;
  // saveHighScore()
}

// Called each frame to create main loop animation
function update() {
  // Checks if the game has ended each frame
  if (!endGame) {
    // Callback method used to create main loop
    window.requestAnimationFrame(update);
    drawStars();
    drawSprites();
    playerShip();
    drawScore();
    speedIncrease();
    scoreIncrease();
  } else {
    window.requestAnimationFrame(update);
    drawStars();
    document.getElementById("score-output").innerHTML = score - 1;
  }
}

function saveHighScore() {
  const prevHighScore = localStorage.getItem("highScore");
  console.log("Highest Score: " + prevHighScore);
  console.log("Your Score: " + score);
  if (prevHighScore && prevHighScore < score) {
    localStorage.setItem("highScore", score);
  } else if (!prevHighScore) {
    localStorage.setItem("highScore", score);
  }
}

// -- Code functionality --

// Generates new Star object per array iteration and maintains Star numbers to numberOfStars
for (var i = 0; i < numberOfStars; i++) {
  starsArray[i] = new Star(
    Math.random() * cnvsWidth,
    Math.random() * cnvsHeight,
    Math.random() * cnvsWidth
  );
}

// Calls function once to initially allow one frame of stars to be rendered before game starts so that they are visible behind the start panel
drawStars();

// Called when Start Game button is pressed - Starts game rendering Sprite objects and triggering main loop
function saveSelectedOption() {
  var audioDropdown = document.getElementById("audioDropdown");
  var selectedOptionValue = audioDropdown.value;
  localStorage.setItem("selectedOption", selectedOptionValue);
}

function showSelectedOption() {
  var selectedOption = localStorage.getItem("selectedOption");

  if (selectedOption) {
    var audioDropdown = document.getElementById("audioDropdown");
    audioDropdown.value = selectedOption;
    console.log(selectedOption, "selected option");
  }
}

function initialiseGame() {
  // Hides start panel and GitHub icon, shows direction buttons, plays audio
  document.getElementById("start-panel").classList.toggle("hidden");
  document.getElementById("bottom-banner").classList.toggle("hidden");
  document.getElementById("github").classList.toggle("hidden");
  document.getElementById("start").play();
  var audioDropdown = document.getElementById("audioDropdown");
  var selectedOption = audioDropdown.value;

  saveSelectedOption();

  var audioPlayer = document.getElementById("music");
  audioPlayer.src = selectedOption;
  audioPlayer.play();

  document.getElementById("milkyway-container").classList.toggle("hidden");
  document
    .getElementById("milkyway-container-bottom")
    .classList.toggle("hidden");

  // Generates new Sprite object per array iteration and maintains Sprite numbers to numberOfSprites
  for (var i = 0; i < numberOfSprites; i++) {
    spritesArray[i] = new Sprite(
      centreOfX,
      centreOfY,
      Math.random() * cnvsWidth
    );
  }
  // Show some initial asteroids on the screen
  for (let i = 0; i < 5; i++) {
    // You can adjust the number of initial asteroids
    spritesArray[i].z = Math.random() * cnvsWidth; // Set their z positions randomly
  }

  // Triggers main loop animations
  update();
}

function showHighScore() {
  const highScore = localStorage.getItem("highScore");
  console.log(highScore, "high score");
  document.getElementById("high-score-output").innerHTML = highScore;
}

showSelectedOption();
showHighScore();
