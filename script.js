const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = Array(100).fill().map(() => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5,
  d: Math.random() * 1
}));

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00f0ff";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function animateStars() {
  stars.forEach(star => {
    star.y += star.d;
    if (star.y > canvas.height) star.y = 0;
  });
  drawStars();
  requestAnimationFrame(animateStars);
}

animateStars();

window.onscroll = () => {
  document.getElementById("backToTop").style.display = window.scrollY > 300 ? 'block' : 'none';
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById("login").style.display = "flex";

function checkLogin() {
  const user = document.getElementById("username").value;
  if (user === "bidin1") {
    document.getElementById("login").style.display = "none";
    document.getElementById("loading").style.display = "flex";
    setTimeout(() => {
      document.getElementById("loading").style.display = "none";
      document.getElementById("portfolio").style.display = "block";
      initGame();
    }, 2500);
  } else {
    alert("Username salah!");
  }
}

function initGame() {
  const board = document.getElementById("board");
  board.innerHTML = '';
  const cells = Array(9).fill(null);
  let currentPlayer = "X";

  function aiMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (cells[i] === null) {
        cells[i] = "O";
        let score = minimax(cells, 0, false);
        cells[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    if (move !== undefined) {
      cells[move] = "O";
      render();
      checkWinner();
    }
  }

  function minimax(board, depth, isMaximizing) {
    const result = evaluate(board);
    if (result !== null) return result;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = "O";
          let score = minimax(board, depth + 1, false);
          board[i] = null;
          best = Math.max(score, best);
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = "X";
          let score = minimax(board, depth + 1, true);
          board[i] = null;
          best = Math.min(score, best);
        }
      }
      return best;
    }
  }

  function evaluate(board) {
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === "O" ? 1 : -1;
      }
    }
    if (!board.includes(null)) return 0;
    return null;
  }

  function handleClick(i) {
    if (cells[i] || checkWinner()) return;
    cells[i] = "X";
    render();
    if (!checkWinner()) setTimeout(aiMove, 400);
  }

  function render() {
    board.innerHTML = '';
    cells.forEach((cell, i) => {
      const div = document.createElement("div");
      div.className = "cell";
      div.textContent = cell || '';
      div.onclick = () => handleClick(i);
      board.appendChild(div);
    });
  }

  function checkWinner() {
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of winPatterns) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        document.getElementById("status").textContent = `${cells[a]} menang!`;
        return true;
      }
    }
    if (!cells.includes(null)) {
      document.getElementById("status").textContent = `Seri!`;
      return true;
    }
    document.getElementById("status").textContent = '';
    return false;
  }

  render();
}
