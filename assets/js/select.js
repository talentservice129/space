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
        return 30000;
      case 3:
        return 40000;
      case 4:
        return 55000;
      case 5:
        return 80000;
      case 6:
        return 120000;
      case 7:
        return 250000;
      case 8:
        return 300000;
      case 9:
        return 400000;
      case 10:
        return 500000;
      case 11:
        return 800000;
      case 12:
        return 120000;
      default:
        return 0; // Return 0 for the first UFO image
    }
  }

  // Update score cards based on the score
  var score = parseInt(localStorage.getItem("highScore"), 10) || 0;
  var scoreCards = [
    { id: "scs1", limit: 30000 },
    { id: "scs2", limit: 40000 },
    { id: "scs3", limit: 55000 },
    { id: "scs4", limit: 80000 },
    { id: "scs5", limit: 120000 },
    { id: "scs6", limit: 250000 },
    { id: "scs7", limit: 300000 },
    { id: "scs8", limit: 400000 },
    { id: "scs9", limit: 500000 },
    { id: "scs10", limit: 800000 },
    { id: "scs11", limit: 1200000 },
  ];

  scoreCards.forEach(function (scoreCard) {
    var element = document.getElementById(scoreCard.id);
    if (element && score >= scoreCard.limit) {
      element.classList.add("locked");
    }
  });
});
