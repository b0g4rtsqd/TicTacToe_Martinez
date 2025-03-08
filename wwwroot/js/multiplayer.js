const connection = new signalR.HubConnectionBuilder()
    .withUrl("/gamehub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

let board = [["", "", ""], ["", "", ""], ["", "", ""]]; // Initialize empty board
let currentPlayer = "";
let gameActive = false;

// Start SignalR connection
connection.start().then(() => {
    console.log("Connected to SignalR Hub");
}).catch(err => {
    console.error("Error connecting to SignalR Hub:", err.toString());
});

// Assign role when a player joins
connection.on("AssignRole", (role) => {
    currentPlayer = role;
    gameActive = true;
    updateTurnIndicator();
});

// Receive move from opponent
connection.on("ReceiveMove", (row, col, player) => {
    document.getElementById("board").rows[row].cells[col].innerHTML = player;
    board[row][col] = player;
    checkWinOrDraw();
    updateTurnIndicator();
});

// Reset board when server instructs
connection.on("ResetBoard", () => {
    resetBoard();
});

// Update turn indicator from server
connection.on("UpdateTurnIndicator", (player) => {
    currentPlayer = player;
    updateTurnIndicator();
});

// Handle player making a move
function makeMove(row, col) {
    let cell = document.getElementById("board").rows[row].cells[col];

    if (!gameActive || board[row][col] !== "" || cell.innerHTML !== "" || !currentPlayer) return;

    cell.innerHTML = currentPlayer;
    board[row][col] = currentPlayer;

    connection.invoke("SendMove", row, col, currentPlayer).catch(err => console.error(err));
    checkWinOrDraw();
}

// Check win conditions
function checkWinOrDraw() {
    const winPatterns = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
            alert(`${board[a[0]][a[1]]} wins!`);
            updateScoreboard(board[a[0]][a[1]]);
            gameActive = false;
            connection.invoke("RestartGame").catch(err => console.error(err));
            return;
        }
    }

    if (board.flat().every(cell => cell !== "")) {
        alert("It's a draw!");
        gameActive = false;
        connection.invoke("RestartGame").catch(err => console.error(err));
    }
}

// Update scoreboard
function updateScoreboard(winner) {
    if (winner === "X") {
        let player1Wins = document.getElementById("player1Wins");
        player1Wins.textContent = `${parseInt(player1Wins.textContent) + 1} wins`;
    } else if (winner === "O") {
        let player2Wins = document.getElementById("player2Wins");
        player2Wins.textContent = `${parseInt(player2Wins.textContent) + 1} wins`;
    }
}

// Reset the board
function resetBoard() {
    board = [["", "", ""], ["", "", ""], ["", "", ""]];
    document.querySelectorAll("#board td").forEach(cell => cell.innerHTML = "");
    gameActive = true;
    updateTurnIndicator();
}

// Update turn indicator
function updateTurnIndicator() {
    document.getElementById("turnIndicator").textContent = `${currentPlayer === "X" ? "Player 1" : "Player 2"}'s turn`;
}

// Restart game
function restartGame() {
    connection.invoke("RestartGame").catch(err => console.error(err));
}
