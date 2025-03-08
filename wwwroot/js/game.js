let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];
let currentPlayer = "X";
let gameOver = false;

// Track scores
let playerWins = 0;
let computerWins = 0;
let draws = 0;

function makeMove(row, col) {
    if (gameOver || board[row][col] !== "") return;

    board[row][col] = currentPlayer;
    document.getElementById("board").rows[row].cells[col].innerText = currentPlayer;

    if (checkWinner(currentPlayer)) {
        document.getElementById("status").innerText = `${currentPlayer} Wins!`;
        if (currentPlayer === "X") {
            playerWins++;
            document.getElementById("playerWins").textContent = `Wins: ${playerWins}`;
        } else {
            computerWins++;
            document.getElementById("computerWins").textContent = `Wins: ${computerWins}`;
        }
        gameOver = true;
        return;
    }

    if (isDraw()) {
        document.getElementById("status").innerText = "It's a Draw!";
        draws++;
        document.getElementById("draws").textContent = `Draws: ${draws}`;
        gameOver = true;
        return;
    }

    currentPlayer = (currentPlayer === "X") ? "O" : "X";
}

function checkWinner(player) {
    // Check Rows & Columns
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true;
        if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true;
    }

    // Check Diagonals
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;

    return false;
}

function isDraw() {
    return board.flat().every(cell => cell !== "");
}

function restartGame() {
    board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    currentPlayer = "X";
    gameOver = false;

    let cells = document.getElementById("board").getElementsByTagName("td");
    for (let cell of cells) {
        cell.innerText = "";
    }

    document.getElementById("status").innerText = "";
}