let nowPlaying = false;

const menu = document.getElementById("menu");

const newGameButton = document.getElementById("new-game");
newGameButton.addEventListener("click", function () {
  if (document.getElementById("strike") !== null) {
    document.getElementById("strike").remove();
  }
  resetBoard();
  printBoard();
  getPlayers();
});

let players = [];
let currentPlayer;

const playerFactory = (name, marker) => {
  return {
    name,
    marker,
  };
};

function getPlayers() {
  menu.innerHTML = "";
  let label = document.createElement("label");
  label.innerHTML = "Player one name?";
  menu.appendChild(label);
  let input = document.createElement("input");
  input.type = "text";
  menu.appendChild(input);
  let button = document.createElement("button");
  button.innerHTML = "Submit";
  button.addEventListener("click", function () {
    if (input.value !== "") {
      if (players.length === 0) {
        players.push(playerFactory(input.value, "X"));
        label.innerHTML = "Player two name?";
        input.value = "";
      } else {
        players.push(playerFactory(input.value, "O"));
        currentPlayer = players[0];
        nowPlaying = true;
        whoseTurn();
      }
    } else {
      label.innerHTML = "Please choose a valid player name.";
    }
  });
  menu.appendChild(button);
}

function whoseTurn() {
  menu.innerHTML = "";
  let p = document.createElement("p");
  p.innerHTML = currentPlayer["name"] + "'s turn";
  menu.appendChild(p);
}

const board = document.getElementById("board");
const s1 = document.getElementById("s1");
const s2 = document.getElementById("s2");
const s3 = document.getElementById("s3");
const s4 = document.getElementById("s4");
const s5 = document.getElementById("s5");
const s6 = document.getElementById("s6");
const s7 = document.getElementById("s7");
const s8 = document.getElementById("s8");
const s9 = document.getElementById("s9");

let gameBoard;

function resetBoard() {
  gameBoard = [
    { element: s1, marker: "" },
    { element: s2, marker: "" },
    { element: s3, marker: "" },
    { element: s4, marker: "" },
    { element: s5, marker: "" },
    { element: s6, marker: "" },
    { element: s7, marker: "" },
    { element: s8, marker: "" },
    { element: s9, marker: "" },
  ];
}

resetBoard();

for (let i = 0; i < gameBoard.length; i++) {
  gameBoard[i]["element"].addEventListener("click", function () {
    if (nowPlaying === false) {
      return;
    }
    if (gameBoard[i]["marker"] === "") {
      gameBoard[i]["marker"] = currentPlayer.marker;
      printBoard();
      evaluateBoard();
      if (nowPlaying === false) {
        return;
      }
      if (currentPlayer === players[0]) {
        currentPlayer = players[1];
      } else {
        currentPlayer = players[0];
      }
      whoseTurn();
    }
  });
}

function printBoard() {
  for (let i = 0; i < gameBoard.length; i++) {
    gameBoard[i]["element"].innerHTML = "";
    if (gameBoard[i]["marker"] === "X") {
      let div = document.createElement("div");
      div.className = "marker-x";
      gameBoard[i]["element"].appendChild(div);
    } else if (gameBoard[i]["marker"] === "O") {
      let div = document.createElement("div");
      div.className = "marker-o";
      gameBoard[i]["element"].appendChild(div);
    }
  }
}

function announceWinner(marker) {
  menu.innerHTML = "";
  let p = document.createElement("p");
  if (marker === "X") {
    p.innerHTML = players[0]["name"] + " wins!";
  } else if (marker === "O") {
    p.innerHTML = players[1]["name"] + " wins!";
  } else {
    p.innerHTML = "Draw";
  }
  menu.appendChild(p);
  nowPlaying = false;
  players = [];
  menu.appendChild(newGameButton);
}

function evaluateBoard() {
  for (let i = 0; i < 9; i += 3) {
    if (gameBoard[i]["marker"] !== "") {
      if (
        gameBoard[i]["marker"] === gameBoard[i + 1]["marker"] &&
        gameBoard[i]["marker"] === gameBoard[i + 2]["marker"]
      ) {
        announceWinner(gameBoard[i]["marker"]);
        let strike = document.createElement("div");
        strike.id = "strike";
        strike.className = "h" + i;
        board.appendChild(strike);
        return;
      }
    }
  }
  for (let i = 0; i < 3; i++) {
    if (gameBoard[i]["marker"] !== "") {
      if (
        gameBoard[i]["marker"] === gameBoard[i + 3]["marker"] &&
        gameBoard[i]["marker"] === gameBoard[i + 6]["marker"]
      ) {
        announceWinner(gameBoard[i]["marker"]);
        let strike = document.createElement("div");
        strike.id = "strike";
        strike.className = "v" + i;
        board.appendChild(strike);
        return;
      }
    }
  }
  if (gameBoard[4]["marker"] !== "") {
    if (
      gameBoard[4]["marker"] === gameBoard[0]["marker"] &&
      gameBoard[4]["marker"] === gameBoard[8]["marker"]
    ) {
      announceWinner(gameBoard[4]["marker"]);
      let strike = document.createElement("div");
      strike.id = "strike";
      strike.className = "dccw";
      board.appendChild(strike);
      return;
    } else if (
      gameBoard[4]["marker"] === gameBoard[2]["marker"] &&
      gameBoard[4]["marker"] === gameBoard[6]["marker"]
    ) {
      announceWinner(gameBoard[4]["marker"]);
      let strike = document.createElement("div");
      strike.id = "strike";
      strike.className = "dcw";
      board.appendChild(strike);
      return;
    }
  }
  let filledSquares = 0;
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i]["marker"] !== "") {
      filledSquares += 1;
    }
  }
  if (filledSquares === 9) {
    announceWinner();
    return;
  }
}
