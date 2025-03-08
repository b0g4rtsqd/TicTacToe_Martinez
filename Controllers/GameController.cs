    using Microsoft.AspNetCore.Mvc;

    namespace TicTacToe.Controllers
    {
        public class GameController : Controller
        {
            public IActionResult Index()
            {
                return View();
            }

            public IActionResult AI()
            {
                return View();
            }

            public IActionResult Multiplayer()
            {
                return View();
            }
        }
    }
