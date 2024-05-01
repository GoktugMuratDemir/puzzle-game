var cards = ["A", "B", "C", "D"];
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

let count = 5;
let countDown = 60;

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
  let countdown = setTimeout(function tick() {
    counterElement.innerText = count;
    count--;
    if (count >= 0) {
      countdown = setTimeout(tick, delay);
    } else {
      counterElement.parentNode.removeChild(counterElement);
    }
  }, 0);

  document.body.style.pointerEvents = "none";

  setTimeout(function () {
    document.body.style.pointerEvents = "auto";
  }, 5000);
}

// Game initialization
function gameInit() {
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

// If cards match
function success() {
  currentSelection[0].classList.add("matched");
  currentSelection[1].classList.add("matched");
  currentSelection[0].classList.remove("selected");
  currentSelection[1].classList.remove("selected");
  currentSelection = [];
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
}

// gameInit();
