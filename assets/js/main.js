var cards = ["A", "B", "C", "D", "E", "F", "G", "H"];
cards = [...cards, ...cards];
var rowCount = calculateRowCount(cards);
var gameBoard = document.getElementById("game-board");
gameBoard.style.gridTemplateColumns = `repeat(${rowCount}, 1fr)`;
gameBoard.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`;

document.getElementById("startButton").addEventListener("click", function () {
  this.style.display = "none";
  gameInit();
});

var currentSelection = [];
var delay = 1000;

let remainingTime = 5;

var score = 0;
var scorePoint = {
  success: 10,
  fail: -5,
};

var scoreBoard = document.getElementById("score-board");

function updateScore(amount) {
  score += amount;
  scoreBoard.innerText = "Score: " + score;
}

function calculateRowCount(cardArray) {
  var rowCount;
  if (cardArray.length % 4 === 0) {
    rowCount = cardArray.length / 4;
  } else {
    rowCount = Math.ceil(cardArray.length / 4);
  }
  return rowCount;
}

// Fisher-Yates (veya Knuth) O(N)
// Shuffle function
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function startCountDown() {
  let counterElement = document.getElementById("counter");
  let countdownTimes = 2;

  let countdown = setTimeout(function tick() {
    if (countdownTimes === 2) {
      counterElement.innerText = `The Game Will Start: ${remainingTime}`;
    } else {
      counterElement.innerText = `The Time Left: ${remainingTime}`;
    }
    remainingTime--;
    if (remainingTime >= 0) {
      countdown = setTimeout(tick, delay);
    } else {
      countdownTimes--;
      if (countdownTimes > 0) {
        if (counterElement.innerText.endsWith("0")) {
          remainingTime = 100;
          countdown = setTimeout(tick, delay);
        } else {
          counterElement.parentNode.removeChild(counterElement);
        }
      } else {
        failGame("timeout");
      }
    }
  }, 0);

  document.body.style.pointerEvents = "none";

  setTimeout(function () {
    document.body.style.pointerEvents = "auto";
  }, delay * remainingTime);
}

// Game initialization
function gameInit() {
  scoreBoard.style.display = "flex";

  startCountDown();

  var shuffledCards = shuffle(cards);
  for (let i = 0; i < shuffledCards.length; i++) {
    var card = document.createElement("div");
    card.classList.add("card");
    card.dataset.item = shuffledCards[i];
    card.innerHTML = `<p>${shuffledCards[i]}</p>`;
    card.addEventListener("click", revealCard);
    gameBoard.appendChild(card);
  }
}

// Reveal card function
function revealCard() {
  if (currentSelection.length >= 2) return;

  this.innerHTML = this.dataset.item;
  currentSelection.push(this);

  this.classList.add("selected");

  if (currentSelection.length === 2) {
    currentSelection[0].dataset.item === currentSelection[1].dataset.item
      ? success()
      : fail();
  }
}

function reloadGame() {
  location.reload();
}

function successGame() {
  var matchedCards = document.querySelectorAll(".matched");
  if (matchedCards.length === cards.length) {
    alert("Congratulations! You have won the game!");
  }
}

function failGame(status) {
  if (status === "fail") {
    alert("You have failed the game!");
  }
  if (status === "timeout") {
    alert("You have failed the game because of the timeout!");
  }

  reloadGame();
}

// If cards match
function success() {
  currentSelection[0].classList.add("matched");
  currentSelection[1].classList.add("matched");
  currentSelection[0].classList.remove("selected");
  currentSelection[1].classList.remove("selected");
  currentSelection = [];
  updateScore(scorePoint.success);
  successGame();
}

/**
 * Handles the logic when the player fails to match two selections.
 */
function fail() {
  currentSelection[0].classList.add("selected");
  currentSelection[1].classList.add("selected");

  setTimeout(function () {
    currentSelection[0].classList.remove("selected");
    currentSelection[1].classList.remove("selected");

    currentSelection[0].classList.add("error");
    currentSelection[1].classList.add("error");

    setTimeout(function () {
      currentSelection[0].innerHTML = "";
      currentSelection[1].innerHTML = "";
      currentSelection[0].classList.remove("error");
      currentSelection[1].classList.remove("error");
      currentSelection = [];
    }, delay);
  }, delay);
  updateScore(scorePoint.fail);
}

// gameInit();
