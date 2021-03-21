let playerOne;
let playerTwo;
let currentPlayer;
let nowPlaying = false;
const squares = [];

const newSquare = (element) => {
  const marker = '';
  return { element, marker };
};

function resetBoard() {
  while (squares.length > 0) {
    squares.pop();
  }
  for (let i = 1; i < 10; i += 1) {
    squares.push(newSquare(document.getElementById(`s${i}`)));
    document.getElementById(`s${i}`).innerHTML = '';
  }
  if (document.getElementById('strike') !== null) {
    document.getElementById('strike').remove();
  }
}

const newPlayer = (name, marker) => ({
  name, marker,
});

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function askForPlayer(number) {
  let numberAsString = '';
  if (number === 1) {
    numberAsString = 'one';
  } else if (number === 2) {
    numberAsString = 'two';
  }
  const menu = document.getElementById('menu');
  menu.innerHTML = '';
  const label = document.createElement('label');
  label.innerHTML = `Player ${numberAsString} name?`;
  label.id = 'playerNameInputLabel';
  menu.appendChild(label);
  const input = document.createElement('input');
  input.type = 'text';
  input.id = `player${capitalize(numberAsString)}NameInput`;
  menu.appendChild(input);
  const button = document.createElement('button');
  button.innerHTML = 'Submit';
  button.id = `player${capitalize(numberAsString)}NameSubmit`;
  menu.appendChild(button);
}

function printCurrentTurn() {
  const menu = document.getElementById('menu');
  menu.innerHTML = '';
  const p = document.createElement('p');
  p.innerHTML = `${currentPlayer.name}'s turn`;
  menu.appendChild(p);
}

function drawStrike(className) {
  const strike = document.createElement('div');
  strike.id = 'strike';
  strike.className = className;
  document.getElementById('board').appendChild(strike);
}

function announceWinner(playerMarker) {
  let player;
  if (playerMarker === 'x') {
    player = playerOne;
  } else if (playerMarker === 'o') {
    player = playerTwo;
  }
  const menu = document.getElementById('menu');
  menu.innerHTML = '';
  const p = document.createElement('p');
  if (playerMarker === 'draw') {
    p.innerHTML = 'Draw.';
  } else {
    p.innerHTML = `${player.name} wins!`;
  }
  menu.appendChild(p);
  const newGameButton = document.createElement('button');
  newGameButton.id = 'new-game';
  newGameButton.innerHTML = 'New Game';
  menu.appendChild(newGameButton);
  playerOne = '';
  playerTwo = '';
  currentPlayer = '';
  nowPlaying = false;
}

function evaluateBoard() {
  for (let i = 0; i < 9; i += 3) {
    if (squares[i].marker !== '') {
      if (
        squares[i].marker === squares[i + 1].marker
          && squares[i].marker === squares[i + 2].marker
      ) {
        announceWinner(squares[i].marker);
        drawStrike(`h${i}`);
        return;
      }
    }
  }
  for (let i = 0; i < 3; i += 1) {
    if (squares[i].marker !== '') {
      if (
        squares[i].marker === squares[i + 3].marker
          && squares[i].marker === squares[i + 6].marker
      ) {
        announceWinner(squares[i].marker);
        drawStrike(`v${i}`);
        return;
      }
    }
  }
  if (squares[4].marker !== '') {
    if (
      squares[4].marker === squares[0].marker
        && squares[4].marker === squares[8].marker
    ) {
      announceWinner(squares[4].marker);
      drawStrike('dccw');
      return;
    } if (
      squares[4].marker === squares[2].marker
        && squares[4].marker === squares[6].marker
    ) {
      announceWinner(squares[4].marker);
      drawStrike('dcw');
      return;
    }
  }
  let filledSquares = 0;
  for (let i = 0; i < 9; i += 1) {
    if (squares[i].marker !== '') {
      filledSquares += 1;
    }
  }
  if (filledSquares === 9) {
    announceWinner('draw');
  } else if (currentPlayer === playerOne) {
    currentPlayer = playerTwo;
    printCurrentTurn();
  } else if (currentPlayer === playerTwo) {
    currentPlayer = playerOne;
    printCurrentTurn();
  }
}

document.addEventListener('click', (e) => {
  const newGameButton = document.getElementById('new-game');
  const playerNameInputLabel = document.getElementById('playerNameInputLabel');
  const playerOneNameInput = document.getElementById('playerOneNameInput');
  const playerOneNameSubmit = document.getElementById('playerOneNameSubmit');
  const playerTwoNameInput = document.getElementById('playerTwoNameInput');
  const playerTwoNameSubmit = document.getElementById('playerTwoNameSubmit');
  if (e.path.includes(newGameButton)) {
    resetBoard();
    askForPlayer(1);
  } else if (e.path.includes(playerOneNameSubmit)) {
    if (playerOneNameInput.value.trim() === '') {
      playerNameInputLabel.innerHTML = 'Please choose a valid player name.';
    } else {
      playerOne = newPlayer(playerOneNameInput.value, 'x');
      askForPlayer(2);
    }
  } else if (e.path.includes(playerTwoNameSubmit)) {
    if (playerTwoNameInput.value.trim() === '') {
      playerNameInputLabel.innerHTML = 'Please choose a valid player name.';
    } else {
      playerTwo = newPlayer(playerTwoNameInput.value, 'o');
      nowPlaying = true;
      currentPlayer = playerOne;
      printCurrentTurn();
    }
  } else if (nowPlaying === true) {
    for (let i = 1; i < 10; i += 1) {
      if (e.path.includes(document.getElementById(`s${i}`)) && (squares[i - 1].marker === '')) {
        squares[i - 1].marker = currentPlayer.marker;
        const markerDiv = document.createElement('div');
        markerDiv.className = `marker-${currentPlayer.marker}`;
        document.getElementById(`s${i}`).appendChild(markerDiv);
        evaluateBoard();
      }
    }
  }
});
