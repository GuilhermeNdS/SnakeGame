const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final_score > span");
const menu = document.querySelector(".menu_screen");
const buttonPlay = document.querySelector(".btn_play");

const audio = new Audio('../assets/assets_audio.mp3');

//definido o tamanho padrão dos quadrados 
const size = 30

//criando a cobra que sera um array

const initialPosition = { x: 270, y: 240 }

let snake = [initialPosition]

const incrementScore = () => {
    score.innerText = parseInt(score.innerText) + 10
}

const randowNumber = (max, min) => {
    return Math.round(Math.random() * (max - min) + min)
}

//posicionamento aleatorio dentro do canva
const randowPosition = () => {
    const number = randowNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

//gera uma cor aleatoria e retorna em um rgb
const randowColor = () => {
    const red = randowNumber(0, 255)
    const green = randowNumber(0, 255)
    const blue = randowNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

//food
const food = {
    x: randowPosition(),
    y: randowPosition(),
    color: randowColor()
}

//armazena a direção que a cobra irá percorrer
let direction, loopid

//food
const drawFood = () => {

    const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 20
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

//função responsavel por desenhar a cobra na tela
const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => {

        //sempre que o index for o ultimo do array, sera a cabeça da cobra com uma cor diferente
        if (index == snake.length - 1) {
            ctx.fillStyle = "white"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

//função para mover a cobra 
const moverSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }

    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }

    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }

    //remove o primeiro elemento do array
    snake.shift()

}

//um grid para fazer uma separação da movimentação da snake e a pocisão do food
const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

//verifica se a snake esta no mesmo posicionamento que o food e caso esteja, adiciona um size em seu tamanho
const chackEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randowPosition()
        let y = randowPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
             x = randowPosition()
             y = randowPosition()
        }

        food.x = x
        food.y = y
        food.color = randowColor()
    
    }
}

//gera uma colisão entre a snake e a borda ou contra ela mesma, fazendo assim que o jogador perca
const chackCollision = () =>{
    const head = snake[snake.length - 1]
    const canvasLimite = canvas.width - size
    const nackIndex = snake.length - 2

    const wallCollision = head.x < 0 || head.x > canvasLimite || head.y < 0 || head.y > canvasLimite

    const selfColision = snake.find((position, index) => {
        return index < nackIndex && position.x == head.x && position.y == head.y
    })

    if(wallCollision || selfColision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(6px)"
}

const gameLoop = () => {

    clearInterval(loopid)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moverSnake()
    drawSnake()
    chackEat()
    chackCollision()

    loopid = setTimeout(() => {
        gameLoop()
    }, 100);
}

gameLoop()

//criando um evento para que quando seja precionado uma tecla a cobra siga a direção orientada

document.addEventListener("keydown", ({ key }) => {
    if (key === "ArrowRight" && direction != "left") {
        direction = "right"
    }

    if (key === "ArrowLeft" && direction != "right") {
        direction = "left"
    }

    if (key === "ArrowDown" && direction != "up") {
        direction = "down"
    }

    if (key === "ArrowUp" && direction != "down") {
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () =>{
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})

