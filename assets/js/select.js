document.addEventListener("DOMContentLoaded", function () {
  // Get all clickable images
  var images = document.querySelectorAll(".clickable-image");

  // Add click event listener to each image
  images.forEach(function (image, index) {
    // Get the unlock score for each image
    var unlockScore = getUnlockScore(index + 1);

    // If the score is null or less than the unlock score,
    // and the image is not the first UFO image,
    // make it unclickable by returning early from the function
    if ((getScore() === null || getScore() < unlockScore) && index !== 0) {
      // scoreCard.classList.add("locked");
      return;
    }

    image.addEventListener("click", function () {
      // Get the value associated with the clicked image
      var value = this.getAttribute("data-value");

      // Store the selected image value in localStorage
      localStorage.setItem("ImgSelect", value);

      // Redirect to game.html
      window.open("./game.html", "_self");
    });
  });

  // Set the src attribute of selectedImageElement to the value stored in localStorage
  var a = localStorage.getItem("ImgSelect");
  var selectedImageElement = document.getElementById("selectedImage");
  if (selectedImageElement) {
    if (a === null) {
      // Set a default image if localStorage is empty
      a = "./assets/img/space.png";
      localStorage.setItem("ImgSelect", a);
    }
    selectedImageElement.src = a;
  }

  // Function to get the score from localStorage
  function getScore() {
    var score = localStorage.getItem("highScore");
    return score ? parseInt(score) : null; // Returning null if score is not set
  }

  // Function to get the unlock score for each image
  function getUnlockScore(index) {
    switch (index) {
      case 2:
        return 3000;
      case 3:
        return 4000;
      case 4:
        return 5500;
      case 5:
        return 8000;
      case 6:
        return 12000;
      case 7:
        return 25000;
      case 8:
        return 30000;
      case 9:
        return 40000;
      case 10:
        return 50000;
      case 11:
        return 80000;
      case 12:
        return 120000;
      case 13:
        return 200000;
      default:
        return 0; // Return 0 for the first UFO image
    }
  }
});

var score = localStorage.getItem("highScore");
var scoreCard1 = document.getElementById("scs1");
var scoreCard2 = document.getElementById("scs2");
var scoreCard3 = document.getElementById("scs3");
var scoreCard4 = document.getElementById("scs4");
var scoreCard5 = document.getElementById("scs5");
var scoreCard6 = document.getElementById("scs6");
var scoreCard7 = document.getElementById("scs7");
var scoreCard8 = document.getElementById("scs8");
var scoreCard9 = document.getElementById("scs9");
var scoreCard10 = document.getElementById("scs10");
var scoreCard11 = document.getElementById("scs11");
if (score > 2999) {
  scoreCard1.classList.add("locked");
}
if (score > 3999) {
  scoreCard2.classList.add("locked");
}
if (score > 5499) {
  scoreCard3.classList.add("locked");
}
if (score > 7999) {
  scoreCard4.classList.add("locked");
}
if (score > 11999) {
  scoreCard5.classList.add("locked");
}
if (score > 24999) {
  scoreCard6.classList.add("locked");
}
if (score > 29999) {
  scoreCard7.classList.add("locked");
}
if (score > 39999) {
  scoreCard8.classList.add("locked");
}
if (score > 49999) {
  scoreCard9.classList.add("locked");
}
if (score > 79999) {
  scoreCard10.classList.add("locked");
}
if (score > 119999) {
  scoreCard11.classList.add("locked");
}
