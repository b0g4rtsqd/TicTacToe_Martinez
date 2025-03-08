namespace TicTacToe.Models
{
    public class GameModel
    {
        public string[,] Board { get; set; } = new string[3, 3];
        public string CurrentPlayer { get; set; } = "X";
    }
}
