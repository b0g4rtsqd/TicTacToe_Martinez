let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];
let currentPlayer = "X"; // Player is X, AI is O
let playerWins = 0;
let aiWins = 0;

function playerMove(row, col) {
    if (board[row][col] === "" && currentPlayer === "X") {
        makeMove(row, col, "X");
        if (!checkWin("X") && !checkDraw()) {
            currentPlayer = "O";
            updateTurnIndicator("Computer's turn");
            setTimeout(aiMove, 500); // AI makes a move after a short delay
        }
    }
}

function makeMove(row, col, player) {
    board[row][col] = player;
    let cell = document.getElementById("board").rows[row].cells[col];
    cell.innerHTML = player;
    cell.style.color = player === "X" ? "blue" : "red"; // X = Blue, O = Red

    if (checkWin(player)) {
        if (player === "X") {
            playerWins++;
        } else {
            aiWins++;
        }
        updateScoreboard();
        alert(`${player === "X" ? "Player" : "Computer"} wins!`);
        restartGame();
    } else if (checkDraw()) {
        alert("It's a draw!");
        restartGame();
    }
}

function aiMove() {
    let bestMove = findBestMove();
    if (bestMove) {
        makeMove(bestMove.row, bestMove.col, "O");
        if (!checkWin("O") && !checkDraw()) {
            currentPlayer = "X";
            updateTurnIndicator("Your turn");
        }
    }
}

function updateTurnIndicator(message) {
    document.getElementById("turnIndicator").textContent = message;
}

function updateScoreboard() {
    document.getElementById("playerWins").textContent = `Player (X): ${playerWins}`;
    document.getElementById("aiWins").textContent = `Computer (O): ${aiWins}`;
}

function findBestMove() {
    let bestScore = -Infinity;
    let move = null;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === "") {
                board[row][col] = "O";
                let score = minimax(board, 0, false);
                board[row][col] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = { row, col };
                }
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin("O")) return 10 - depth;
    if (checkWin("X")) return depth - 10;
    if (checkDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === "") {
                    board[row][col] = "O";
                    bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                    board[row][col] = "";
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === "") {
                    board[row][col] = "X";
                    bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                    board[row][col] = "";
                }
            }
        }
        return bestScore;
    }
}

function checkWin(player) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true;
        if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true;
    }
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
    return false;
}

function checkDraw() {
    return board.flat().every(cell => cell !== "");
}

function restartGame() {
    board = [["", "", ""], ["", "", ""], ["", "", ""]];
    currentPlayer = "X";
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let cell = document.getElementById("board").rows[row].cells[col];
            cell.innerHTML = "";
            cell.style.color = "black"; // Reset color
        }
    }
    updateTurnIndicator("Your turn");
}
