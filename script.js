const Gameboard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const placeMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, placeMarker, resetBoard };
})();

const Player = (name, marker, isComputer = false) => {
    return { name, marker, isComputer };
};

const gameController = (function() {
    const playerOne = Player("Player", "X");
    const playerTwo = Player("Computer", "O", true); // Set as computer
    let activePlayer = playerOne;
    let gameOver = false;

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
        displayController.setStatus(`${activePlayer.name}'s turn (${activePlayer.marker})`);
    };

    const checkWin = (board) => {
        return winConditions.some(condition => {
            return condition.every(index => board[index] === activePlayer.marker);
        });
    };

    const makeComputerMove = () => {
        const availableIndices = Gameboard.getBoard()
            .map((val, idx) => val === "" ? idx : null)
            .filter(val => val !== null);
        
        if (availableIndices.length > 0 && !gameOver) {
            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            playRound(randomIndex);
        }
    };

    const playRound = (index) => {
        if (gameOver) return;

        const success = Gameboard.placeMarker(index, activePlayer.marker);

        if (success) {
            displayController.render();
            
            if (checkWin(Gameboard.getBoard())) {
                displayController.setStatus(`${activePlayer.name} wins!`);
                gameOver = true;
            } else if (Gameboard.getBoard().every(cell => cell !== "")) {
                displayController.setStatus("It's a tie!");
                gameOver = true;
            } else {
                switchPlayerTurn();
                
                // If the new active player is a computer, trigger their move
                if (activePlayer.isComputer && !gameOver) {
                    setTimeout(makeComputerMove, 600); // 0.6s delay for realism
                }
            }
        }
    };

    const resetGame = () => {
        activePlayer = playerOne;
        gameOver = false;
        Gameboard.resetBoard();
        displayController.render();
        displayController.setStatus("Your turn (X)");
    };

    return { playRound, resetGame };
})();

const displayController = (function() {
    const boardElement = document.getElementById("gameboard");
    const statusElement = document.getElementById("game-status");

    const setStatus = (message) => {
        statusElement.textContent = message;
    };

    const render = () => {
        const board = Gameboard.getBoard();
        boardElement.innerHTML = "";

        board.forEach((mark, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = mark;
            cell.addEventListener("click", () => gameController.playRound(index));
            boardElement.appendChild(cell);
        });
    };

    return { render, setStatus };
})();

// INITIALIZATION
displayController.render();
const resetBtn = document.getElementById("restart-btn");
resetBtn.addEventListener("click", gameController.resetGame);