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

const frog_sprite = new Image()
frog_sprite.src = './assets/sprite_frog.png'

let frog_sprite_cols = 7
let frog_sprite_rows = 1
let frog_sprite_height = frog_sprite.height / frog_sprite_rows
let frog_sprite_width = frog_sprite.width / frog_sprite_cols
let frog_sprite_totalFrames = 7
let frog_sprite_currentFrame = 0
let frog_sprite_positionX = 0
let frog_sprite_positionY = 0

let frogs = []


const enemy_sprite = new Image()
// enemy_sprite.src = ''



const plataform_sprite = new Image()
plataform_sprite.src = './assets/sprite_plataform.png'


const ground_sprite = new Image()
ground_sprite.src = './assets/sprite_ground.png'


const bg_sprite = new Image()
bg_sprite.src = './assets/sprite_bg.png'
var pat = c.createPattern(bg_sprite, "repeat-x")


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

        if (keys.left.pressed) {
            this.velocity.x = -7
        }
        if (this.velocity.x == -7 && this.position.x <= 200) {
            this.velocity.x = 0
            moveRight()
        }

        if (keys.right.pressed) this.velocity.x = 7
        if (this.velocity.x == 7 && this.position.x >= 700) {
            this.velocity.x = 0
            moveLeft()
        }
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
        c.drawImage(plataform_sprite, 32 * (this.sx - 1), 32 * (this.sy - 1), 32, 32, this.position.x, this.position.y, this.height, this.width)
    }
}


let grounds = []
class Ground {
    constructor(positionX, positionY, sx, sy) {
        this.position = {
            x: positionX,
            y: positionY
        }
        this.sx = sx
        this.sy = sy
        this.height = 100
        this.width = 100
    }
    draw() {
        c.drawImage(ground_sprite, 32 * (this.sx - 1), 32 * (this.sy - 1), 32, 32, this.position.x, this.position.y, this.height, this.width)
    }
}


class Frog {
    constructor(positionX, positionY) {
        this.position = {
            x: positionX,
            y: positionY
        }
        this.width = 100
        this.height = 100
    }
    draw() {
        c.drawImage(frog_sprite, frog_sprite_positionX + (frog_sprite_width * frog_sprite_currentFrame), frog_sprite_positionY, frog_sprite_width, frog_sprite_height, this.position.x, this.position.y, 100, 100)
    }
    animation() {
        if (tipoFPS == 10) {
            frog_sprite_currentFrame += 1
            frog_sprite_currentFrame = frog_sprite_currentFrame % frog_sprite_totalFrames
        }
    }
}


let enemies = []
class Enemy {
    constructor(positionX, positionY, walkDistance, walkSpeed) {
        this.position = {
            x: positionX,
            y: positionY
        }
        this.initialPosition = {
            x: positionX,
            y: positionY
        }
        this.walkDistance = walkDistance
        this.walkSpeed = walkSpeed
        this.width = 100
        this.height = 100
        this.looking = 'right'

    }
    draw() {
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        if (this.looking == 'right') {
            if (this.position.x < this.initialPosition.x + this.walkDistance) {
                this.position.x += this.walkSpeed
            }
            else this.looking = 'left'
        }
        else {
            if (this.position.x > this.initialPosition.x) {
                this.position.x -= this.walkSpeed
            }
            else this.looking = 'right'
        }

    }
}


let chargeJump = () => {
    if (jump <= 30) jump += 8
}


class Bg {
    constructor() {
        this.width = canvas.width
        this.height = canvas.height
    }
    draw() {
        c.drawImage(bg_sprite, this.width, this.height)
    }
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


function colliderPlataforma() {
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

function colliderGround() {
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

function colliderFrog() {
    if (frogs.length > 0) {
        frogs[0].animation()
    }
    for (let i = 0; i < frogs.length; i++) {

        frogs[i].draw()
        if (player.position.y + player.height >= frogs[i].position.y && player.position.y <= frogs[i].position.y + frogs[i].height && player.position.x + player.width >= frogs[i].position.x && player.position.x <= frogs[i].position.x + frogs[i].width) {
            frogs.splice(i, 1)
        }
    }
}


function colliderEnemy() {
    enemies.forEach(e => {
        e.update()
        e.draw()
    }
    )
}


function moveLeft() {
    bgD -= 3
    plataforms.forEach(e =>
        e.position.x -= 7
    )
    enemies.forEach(e => {
        e.position.x -= 7
        e.initialPosition.x -=7
    })
    frogs.forEach(e =>
        e.position.x -= 7)
    grounds.forEach(e =>
        e.position.x -= 7)

}
function moveRight() {
    bgD += 3
    plataforms.forEach(e =>
        e.position.x += 7
    )
    enemies.forEach(e => {
        e.position.x += 7
        e.initialPosition.x +=7
    })
    frogs.forEach(e =>
        e.position.x += 7)
    grounds.forEach(e =>
        e.position.x += 7)

}

let bgD = 0
function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = -1; i < 5; i++) {
        c.drawImage(bg_sprite, 0 + i * canvas.width + bgD, 0, canvas.width, canvas.height)
    }
    // c.rect(0, 0, canvas.width, canvas.height)
    // c.fillStyle = c.createPattern(bg_sprite,"repeat")
    // c.fill()
    player.update()
    colliderPlataforma()
    colliderFrog()
    colliderGround()
    colliderEnemy()
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
frogs.push(new Frog(400, 400))
frogs.push(new Frog(600, 400))
frogs.push(new Frog(700, 500))
enemies.push(new Enemy(700, 700, 500, 6))



for (let i = 0; i <= canvas.width * 3 / 100; i++) {
    grounds.push(new Ground(i * 100, canvas.height - 100, 3, 4))
}


gatinho_sprite.onload = animate()

