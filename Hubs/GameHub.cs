using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace TicTacToe.Hubs
{
    public class GameHub : Hub
    {
        private static string player1 = null;
        private static string player2 = null;
        private static string currentPlayer = "X";
        private static string[,] board = new string[3, 3];

        public async Task SendMove(int row, int col, string player)
        {
            Console.WriteLine($"Move received: row={row}, col={col}, player={player}");
            board[row, col] = player;
            await Clients.All.SendAsync("ReceiveMove", row, col, player);
            currentPlayer = player == "X" ? "O" : "X";
            await Clients.All.SendAsync("UpdateTurnIndicator", currentPlayer);
        }

        public async Task RestartGame()
        {
            Console.WriteLine("Game restarted");
            board = new string[3, 3];
            currentPlayer = "X";
            await Clients.All.SendAsync("ResetBoard");
            await Clients.All.SendAsync("UpdateTurnIndicator", currentPlayer);
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"Client connected: {Context.ConnectionId}");
            if (string.IsNullOrEmpty(player1))
            {
                player1 = Context.ConnectionId;
                await Clients.Caller.SendAsync("AssignRole", "X");
            }
            else if (string.IsNullOrEmpty(player2))
            {
                player2 = Context.ConnectionId;
                await Clients.Caller.SendAsync("AssignRole", "O");
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
            if (Context.ConnectionId == player1)
                player1 = null;
            else if (Context.ConnectionId == player2)
                player2 = null;
            await base.OnDisconnectedAsync(exception);
        }
    }
}