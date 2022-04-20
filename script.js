const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

let sprites = ['sprite_gatinho.png',]

const gatinho_sprite = new Image()
gatinho_sprite.src = './assets/sprite_gatinho.png'

let gatinho_sprite_cols = 4
let gatinho_sprite_rows = 8
let gatinho_sprite_height = gatinho_sprite.height / gatinho_sprite_rows
let gatinho_sprite_width = gatinho_sprite.width / gatinho_sprite_cols
let gatinho_sprite_totalFrames = 4
let gatinho_sprite_currentFrame = 0
let gatinho_sprite_positionX = 0
let gatinho_sprite_positionY = 0

const coin_sprite = new Image()
coin_sprite.src = './assets/sprite_coin.png'

let coin_sprite_cols = 6
let coin_sprite_rows = 1
let coin_sprite_height = coin_sprite.height / coin_sprite_rows
let coin_sprite_width = coin_sprite.width / coin_sprite_cols
let coin_sprite_totalFrames = 6
let coin_sprite_currentFrame = 0
let coin_sprite_positionX = 0
let coin_sprite_positionY = 0

let coins = []


const plataform_sprite = new Image()
plataform_sprite.src = './assets/sprite_plataform.png'


const ground_sprite = new Image()
ground_sprite.src = './assets/sprite_ground.png'


let tipoFPS = 0

canvas.height = 900
canvas.width = 1800
c.imageSmoothingEnabled = false

let plataforms = []

const gravity = 0.8
let jump = 0
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    down: {
        pressed: false
    }
}

let looking = 'right'



class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 100
        this.height = 100
    }
    draw() {
        c.drawImage(gatinho_sprite, gatinho_sprite_positionX + (gatinho_sprite_width * gatinho_sprite_currentFrame), gatinho_sprite_positionY, gatinho_sprite_width, gatinho_sprite_height, this.position.x, this.position.y, 100, 100)
    }
    update() {
        if (this.position.y <= canvas.height - this.height - this.velocity.y) {
            this.velocity.y += gravity
        }
        else this.velocity.y = 0

        if (keys.left.pressed) this.velocity.x = -7
        if (keys.right.pressed) this.velocity.x = 7
        if ((!keys.left.pressed && !keys.right.pressed) || keys.down.pressed) this.velocity.x = 0

        this.draw()
        this.animation()

    }
    animation() {
        if (this.velocity.y == 0 || this.velocity.y == gravity) {
            if (keys.left.pressed == true) gatinho_sprite_positionY = gatinho_sprite_height
            if (keys.right.pressed == true) gatinho_sprite_positionY = 0
            if (keys.right.pressed == false && keys.left.pressed == false) {
                if (looking == 'right') gatinho_sprite_positionY = gatinho_sprite_height * 2
                else gatinho_sprite_positionY = gatinho_sprite_height * 3
            }
        }
        else if (this.velocity.y < 0) {
            if (looking == "right") gatinho_sprite_positionY = gatinho_sprite_height * 4
            else gatinho_sprite_positionY = gatinho_sprite_height * 5
        }
        else if (this.velocity.y > 0) {
            if (looking == "right") gatinho_sprite_positionY = gatinho_sprite_height * 6
            else gatinho_sprite_positionY = gatinho_sprite_height * 7
        }


        if (tipoFPS == 10) {
            gatinho_sprite_currentFrame += 1
            gatinho_sprite_currentFrame = gatinho_sprite_currentFrame % gatinho_sprite_totalFrames
            tipoFPS = 0
        }
        tipoFPS += 1
    }
}

class JumpBar {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.width
    }
}

class Plataform {
    constructor(positionx, positiony, sx, sy) {
        this.position = {
            x: positionx,
            y: positiony
        }
        this.sx = sx
        this.sy = sy
        this.height = 100
        this.width = 100

    }
    draw() {
        c.drawImage(plataform_sprite, 32 * (this.sx - 1), 32 * (this.sy - 1), 32, 32, this.position.x, this.position.y, this.height,this.width)
    }
}


let grounds = []
class Ground{
    constructor(positionX,positionY,sx,sy){
        this.position={
            x:positionX,
            y:positionY
        }
        this.sx = sx
        this.sy = sy
        this.height = 100
        this.width = 100
    }
    draw(){
        c.drawImage(ground_sprite,32*(this.sx-1),32*(this.sy-1),32,32,this.position.x,this.position.y,this.height,this.width)
    }
}


class Coin {
    constructor(positionX, positionY) {
        this.position = {
            x: positionX,
            y: positionY
        }
        this.width = 100
        this.height = 100
    }
    draw() {
        c.drawImage(coin_sprite, coin_sprite_positionX + (coin_sprite_width * coin_sprite_currentFrame), coin_sprite_positionY, coin_sprite_width, coin_sprite_height, this.position.x, this.position.y, 100, 100)
    }
    animation() {
        if (tipoFPS == 10) {
            coin_sprite_currentFrame += 1
            coin_sprite_currentFrame = coin_sprite_currentFrame % coin_sprite_totalFrames
        }
    }
}


let chargeJump = () => {
    if (jump <= 30) jump += 8
}



document.addEventListener('keydown', e => {
    if (e.key == "a" && !keys.down.pressed) {
        keys.left.pressed = true
        looking = 'left'
    }
    if (e.key == "d" && !keys.down.pressed) {
        keys.right.pressed = true
        looking = 'right'
    }
    if (e.key == "s") {
        player.velocity.x = 0
        keys.down.pressed = true
        setTimeout(chargeJump, 50)
    }
    if (e.key == "w") {
        console.log(player.velocity)
    }
})

document.addEventListener('keyup', e => {
    if (e.key == "a") {
        keys.left.pressed = false

    }
    if (e.key == "d") {
        keys.right.pressed = false

    }
    if (e.key == "s") {
        player.velocity.y -= jump
        jump = 0
        clearTimeout(chargeJump)
        keys.down.pressed = false
    }

})


function coliderPlataforma() {
    plataforms.forEach(e => {
        e.draw()
        //colisor parte de cima
        if ((player.position.y + player.height <= e.position.y) && (player.position.y + player.height + player.velocity.y >= e.position.y) && (player.position.x + player.width >= e.position.x) && (player.position.x <= e.position.x + e.width)) {
            player.velocity.y = 0
        }
        //colisor lado
        // if (player.position.x + player.width >= e.position.x && player.position.x < e.position.x + e.width && player.position.y >= e.position.y && player.position.y <= e.position.y + e.height) {
        //     player.velocity.x = 0
        // }
        // //colisor baixo
        // if (player.position.y >= e.position.y + e.height + 30 && player.position.y + player.velocity.y <= e.position.y + e.height && player.position.x + player.width >= e.position.x && player.position.x < e.position.x + e.width) {
        //     player.velocity.y = 0
        // }
    })
}

function coliderGround() {
    grounds.forEach(e => {
        e.draw()
        //colisor parte de cima
        if ((player.position.y + player.height <= e.position.y) && (player.position.y + player.height + player.velocity.y >= e.position.y) && (player.position.x + player.width >= e.position.x) && (player.position.x <= e.position.x + e.width)) {
            player.velocity.y = 0
        }
        //colisor lado
        // if (player.position.x + player.width >= e.position.x && player.position.x < e.position.x + e.width && player.position.y >= e.position.y && player.position.y <= e.position.y + e.height) {
        //     player.velocity.x = 0
        // }
        // //colisor baixo
        // if (player.position.y >= e.position.y + e.height + 30 && player.position.y + player.velocity.y <= e.position.y + e.height && player.position.x + player.width >= e.position.x && player.position.x < e.position.x + e.width) {
        //     player.velocity.y = 0
        // }
    })
}

function coliderCoin() {
    if (coins.length > 0) {
        coins[0].animation()
    }
    for (let i = 0; i < coins.length; i++) {

        coins[i].draw()
        if (player.position.y + player.height >= coins[i].position.y && player.position.y <= coins[i].position.y + coins[i].height && player.position.x + player.width >= coins[i].position.x && player.position.x <= coins[i].position.x + coins[i].width) {
            coins.splice(i, 1)
        }
    }
}


function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    coliderPlataforma()
    coliderCoin()
    coliderGround()
    player.position.y += player.velocity.y
    player.position.x += player.velocity.x
    requestAnimationFrame(animate)
}

const player = new Player()

plataforms.push(new Plataform(400, 600, 1, 1))
plataforms.push(new Plataform(500, 600, 2, 1))
plataforms.push(new Plataform(600, 600, 2, 1))
plataforms.push(new Plataform(700, 600, 2, 1))
plataforms.push(new Plataform(800, 600, 3, 1))
coins.push(new Coin(400, 400))
coins.push(new Coin(600, 400))
coins.push(new Coin(700, 500))


for(let i=0;i<=canvas.width/100;i++){
    grounds.push(new Ground(i*100,canvas.height-100,3,4))
}


gatinho_sprite.onload = animate()

