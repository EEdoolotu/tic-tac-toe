const Gameboard = (function() {
    let board = ["","","","","","","","",""]

    const getBoard = () => board;

    const placeMarker = (index, marker) => {
        board[index] = marker;
    };

    const resetBoard = () => {
        board = ["","","","","","","","",""]
    };

    return {getBoard, placeMarker, resetBoard};

})();

const Player = (name, marker) => {
    return {name, marker};
};

const gameController = (function() {
    const playerOne = Player("Player 1", "X");
    const playerTwo = Player("Player 2", "O");
    let activePlayer = playerOne;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    

    const playRound = (index) => {
        
        Gameboard.placeMarker(index, activePlayer.marker);

        console.log(`placing ${activePlayer.marker} at index${index}...`)

        switchPlayerTurn();

    }

    return {playRound};
})();


const displayController = (function() {
    const boardElement = document.getElementById("gameboard")

    const render = () => {
        const board = Gameboard.getBoard();
        boardElement.innerHTML = ""

        board.forEach((mark, index) => {
            const cell = document.createElement("div")
            cell.classList.add("cell")
            cell.textContent = mark;
 
            boardElement.appendChild(cell);
        });
    };

    return {render}
})();

displayController.render()