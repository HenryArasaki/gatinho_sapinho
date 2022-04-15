const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const gatinho_sprite = new Image()
gatinho_sprite.src = './assets/sprite_gatinho.png'
gatinho_sprite.onload = loadImages
let playerSprite_cols = 4
let playerSprite_rows = 2
let playerSprite_height = gatinho_sprite.height / playerSprite_rows
let playerSprite_width = gatinho_sprite.width / playerSprite_cols
let totalFrames = 4
let currentFrame = 0
let playerSprite_positionX = 0
let playerSprite_positionY = 0



let numOfImages = 1
function loadImages() {
    if (--numOfImages > 0) return
}

let frameContador = 0

canvas.height = 900
canvas.width = 1800
c.imageSmoothingEnabled = false

let plataforms = []

const gravity = 1
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
        c.drawImage(gatinho_sprite, playerSprite_positionX + (playerSprite_width * currentFrame), playerSprite_positionY, playerSprite_width, playerSprite_height, this.position.x, this.position.y, 100, 100)
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
        if (keys.left.pressed == true) playerSprite_positionY = playerSprite_height
        if (keys.right.pressed == true) playerSprite_positionY = 0
        if (frameContador == 10) {
            currentFrame += 1
            currentFrame = currentFrame % totalFrames
            frameContador = 0
        }
        frameContador += 1
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
    constructor(positionx, positiony) {
        this.position = {
            x: positionx,
            y: positiony
        }
        this.width = 400
        this.height = 100

    }
    draw() {
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

let chargeJump = () => {
    if (jump <= 38) jump += 10
}



document.addEventListener('keydown', e => {
    if (e.key == "a" && !keys.down.pressed) {
        keys.left.pressed = true
    }
    if (e.key == "d" && !keys.down.pressed) {
        keys.right.pressed = true
    }
    if (e.key == "s") {
        player.velocity.x = 0
        keys.down.pressed = true
        setTimeout(chargeJump, 50)
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




function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    plataforms.forEach(e => {
        e.draw()
        //colisor parte de cima
        if ((player.position.y + player.height <= e.position.y) && (player.position.y + player.height + player.velocity.y >= e.position.y) && (player.position.x + player.width >= e.position.x) && (player.position.x <= e.position.x + e.width)) {
            player.velocity.y = 0
        }
        if (player.position.x + player.width >= e.position.x && player.position.x < e.position.x + e.width && player.position.y >= e.position.y && player.position.y <= e.position.y + e.height) {
            player.velocity.x = 0
        }
        if (player.position.y >= e.position.y + e.height && player.position.y + player.velocity.y <= e.position.y + e.height && player.position.x + player.width >= e.position.x && player.position.x < e.position.x + e.width) {
            player.velocity.y = 0
        }
    })
    player.position.y += player.velocity.y
    player.position.x += player.velocity.x
    requestAnimationFrame(animate)
}

const player = new Player()

plataforms.push(new Plataform(400, 600))
plataforms.push(new Plataform(100, 300))
animate()
