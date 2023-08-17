const modeSelection = document.querySelector(".mode-selection");

const showGameOver = () => {
    alert("Game over!");

    location.reload();
}

const startSnakeGame = (mode, duration) => {
    modeSelection.remove();

    const game = document.createElement("div");
    const food = document.createElement("div");
    const snakeHead = document.createElement("div");

    game.classList.add("game");
    food.classList.add("food");
    snakeHead.classList.add("snake-head");

    game.append(food);
    game.append(snakeHead);

    document.body.append(game);

    const GRID_SIZE = 20;

    let foodY;
    let foodX;

    let changeForX = 0;
    let changeForY = 1;

    let x = GRID_SIZE / 2;
    let y = 1;

    const gameLogic = () => {
        food.style.gridArea = `${foodY} / ${foodX}`;

        x += changeForX;
        y += changeForY;

        const snakeBodies = Array.from(document.querySelectorAll(".snake-body"));

        const isInterceptBody = snakeBodies.some(body => {
            const area = body.style.gridArea.split("/");

            return +area[0] === y && +area[1] === x;
        });

        let isGameOver = false;

        if (mode === "easy") {
            if (x > GRID_SIZE) x = 0;
            else if (x < 0) x = GRID_SIZE

            if (y > GRID_SIZE) y = 0;
            else if (y < 0) y = GRID_SIZE

            if (isInterceptBody) isGameOver = true;
        }
        else if (x < 1 || y < 1 || Math.abs(x) > GRID_SIZE || Math.abs(y) > GRID_SIZE || isInterceptBody) isGameOver = true;

        if (isGameOver) {
            showGameOver();
            clearInterval(gameInterval);
        }

        if (y === foodY && x === foodX) {
            game.insertAdjacentHTML("beforeend", `<div style="grid-area: ${y} / ${x}" class="snake-body"></div>`)

            changeFoodPosition();
        }

        snakeBodies.forEach((body, i) => {
            if (i === snakeBodies.length - 1) body.style.gridArea = snakeHead.style.gridArea;
            else body.style.gridArea = snakeBodies[i + 1].style.gridArea;
        });

        snakeHead.style.gridArea = `${y} / ${x}`;
    }

    const handleMovement = (e) => {
        const newMovement = {
            "ArrowDown": {
                x: 0,
                y: 1
            },
            "down": {
                x: 0,
                y: 1
            },
            "ArrowUp": {
                x: 0,
                y: -1
            },
            "up": {
                x: 0,
                y: -1
            },
            "ArrowLeft": {
                x: -1,
                y: 0
            },
            "left": {
                x: -1,
                y: 0
            },
            "ArrowRight": {
                x: 1,
                y: 0
            },
            "right": {
                x: 1,
                y: 0
            }
        }

        // Checking for opposite directions
        if (
            !newMovement[e.code] ||
            changeForX + newMovement[e.code].x === 0 ||
            changeForY + newMovement[e.code].y === 0
        ) return;

        changeForX = newMovement[e.code].x;
        changeForY = newMovement[e.code].y;
    }

    const changeFoodPosition = () => {
        foodY = Math.round(Math.random() * (GRID_SIZE - 1)) + 1;
        foodX = Math.round(Math.random() * (GRID_SIZE - 1)) + 1;
    }

    changeFoodPosition();
    document.body.addEventListener('swiped', (e) => handleMovement({ code: e.detail.dir }));
    window.addEventListener("keydown", handleMovement);
    const gameInterval = setInterval(gameLogic, duration);
}

const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");

easyBtn.addEventListener("click", () => startSnakeGame("easy", 300));
mediumBtn.addEventListener("click", () => startSnakeGame("medium", 300));
hardBtn.addEventListener("click", () => startSnakeGame("hard", 100));