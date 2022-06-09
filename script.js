const canvas = document.querySelector('#game')
const c = canvas.getContext('2d')

const canvasUI = document.querySelector('#ui')
const ui = canvasUI.getContext('2d')

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

const frog_sprite1 = new Image()
frog_sprite1.src = './assets/sprite_frog1.png'


const enemy_sprite = new Image()
enemy_sprite.src = './assets/sprite_enemy.png'


let enemy_sprite_cols = 12
let enemy_sprite_rows = 2
let enemy_sprite_height = enemy_sprite.height / enemy_sprite_rows
let enemy_sprite_width = enemy_sprite.width / enemy_sprite_cols
let enemy_sprite_totalFrames = 12
let enemy_sprite_currentFrame = 0
let enemy_sprite_positionX = 0
let enemy_sprite_positionY = 0



const plataform_sprite = new Image()
plataform_sprite.src = './assets/sprite_plataform.png'


const ground_sprite = new Image()
ground_sprite.src = './assets/sprite_ground.png'


const bg_sprite = new Image()
bg_sprite.src = './assets/sprite_bg.png'
var pat = c.createPattern(bg_sprite, "repeat-x")


const morango_sprite = new Image()
morango_sprite.src = './assets/sprite_morango.png'
let morango_sprite_cols = 7
let morango_sprite_rows = 1
let morango_sprite_height = morango_sprite.height / morango_sprite_rows
let morango_sprite_width = morango_sprite.width / morango_sprite_cols
let morango_sprite_totalFrames = 7
let morango_sprite_currentFrame = 0
let morango_sprite_positionX = 0
let morango_sprite_positionY = 0

const morango_sprite1 = new Image()
morango_sprite1.src = './assets/sprite_morango1.png'






let tipoFPS = 0

canvas.height = 900
canvas.width = 1800
c.imageSmoothingEnabled = false
canvasUI.height = 900
canvasUI.width = 1800
ui.imageSmoothingEnabled = false

let alive = true


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



//-------------------------------------------------------------------------------------------------------------



class Player {
    constructor() {
        this.position = {
            x: 200,
            y: 550
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
        this.velocity.y += gravity
        if (keys.right.pressed) this.velocity.x = 7
        if (keys.left.pressed) {
            this.velocity.x = -7
        }
        if (this.velocity.x == -7 && this.position.x <= 150) {

            moveLeft()
        }

        if (this.velocity.x == 7 && this.position.x >= 650) {

            moveRight()
        }
        if (this.velocity.y <= 0 && this.position.y <= 550) {

            moveUp()
        }
        if (this.velocity.y >= 0 && this.position.y <= 550) {

            moveDown()
        }
        if ((!keys.left.pressed && !keys.right.pressed) || keys.down.pressed) this.velocity.x = 0
        if (keys.left.pressed && keys.right.pressed) this.velocity.x = 0



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
const player = new Player()



let jumpBar = {
    position: {
        x: player.position.x - 100,
        y: player.position.y - 100
    },
    width: 100,
    height: 50,
    update: function () {
        this.position = {
            x: player.position.x - 50,
            y: player.position.y - 50
        }
        this.width = jump * 2
        c.fillStyle = '#140333'
        c.fillRect(this.position.x, this.position.y, 200, this.height)
        c.fillStyle = '#94cc47'
        c.fillRect(this.position.x + 5, this.position.y + 5, this.width - 10, this.height - 10)
    }


}

let plataforms = []
class Plataform {
    constructor(positionx, positiony, sx, sy) {
        this.position = {
            x: positionx,
            y: positiony
        }
        this.sx = sx
        this.sy = sy
        this.width = 100
        this.height = 100

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
        this.width = 100
        this.height = 100
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
        c.drawImage(enemy_sprite, enemy_sprite_positionX + (enemy_sprite_width * enemy_sprite_currentFrame), enemy_sprite_positionY, enemy_sprite_width, enemy_sprite_height, this.position.x, this.position.y, 100, 100)
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

        this.animation()
        this.draw()

    }
    animation() {
        if (this.looking == 'right') enemy_sprite_positionY = 0
        else enemy_sprite_positionY = enemy_sprite_height
        // if (tipoFPS == 3 || tipoFPS == 6 || tipoFPS == 10) {
        if (tipoFPS == 10) {
            enemy_sprite_currentFrame += 1
            enemy_sprite_currentFrame = enemy_sprite_currentFrame % enemy_sprite_totalFrames
        }
    }
}

let mortes = []
class Morte {
    constructor(positionx, positiony) {
        this.position = {
            x: positionx,
            y: positiony
        }
        this.width = 100
        this.height = 100
    }

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




let vida = {
    initialValue: 3,
    currentValue: 3,
    update: function () {
        if (this.currentValue > 3) this.currentValue = 3
        for (let i = 0; i < this.currentValue; i++) {
            ui.drawImage(morango_sprite1, 0, 0, morango_sprite1.width, morango_sprite1.height, i * 75, 0, 75, 75)
        }
        if (this.currentValue <= 0) {
            alive = false
            document.removeEventListener('keydown', keysFunctionDown)
            document.removeEventListener('keyup', keysFunctionUp)
            setTimeout(startGame, 1000)
        }
    }
}

let score = {
    initialValue: 0,
    currentValue: 0,
    update: function () {

        for (let i = 0; i < this.currentValue; i++) {
            ui.drawImage(frog_sprite1, 0, 0, frog_sprite1.width, frog_sprite1.height, i * 75, 100, 75, 75)
        }
    }
}


let morangos = []
class Morango {
    constructor(positionX, positionY) {
        this.width = 100
        this.height = 100
        this.position = {
            x: positionX,
            y: positionY
        }
    }
    draw() {
        c.drawImage(morango_sprite, morango_sprite_positionX + (morango_sprite_width * morango_sprite_currentFrame), morango_sprite_positionY, morango_sprite_width, morango_sprite_height, this.position.x, this.position.y, 100, 100)
    }
    animation() {
        if (tipoFPS == 10) {
            morango_sprite_currentFrame += 1
            morango_sprite_currentFrame = morango_sprite_currentFrame % morango_sprite_totalFrames
        }
    }
}




























function keysFunctionDown(e) {

    if (e.key == "a" && !keys.down.pressed) {
        keys.left.pressed = true
        looking = 'left'
    }
    if (e.key == "d" && !keys.down.pressed) {
        keys.right.pressed = true
        looking = 'right'

    }
    if (e.key == "s") {
        keys.down.pressed = true
        if (jump < 100) jump += 5
    }

}

function keysFunctionUp(e) {
    if (e.key == "a") {
        keys.left.pressed = false
        if (player.velocity.x == -7) player.velocity.x = 0
    }
    if (e.key == "d") {
        keys.right.pressed = false
        if (player.velocity.x == 7) player.velocity.x = 0
    }
    if (e.key == "s") {
        if (player.velocity.y == 0) {
            if (jump < 16) {
                player.velocity.y -= 16
            }
            else player.velocity.y -= jump / 3

        }
        jump = 10
        keys.down.pressed = false
    }
}



document.addEventListener('keydown', keysFunctionDown)


document.addEventListener('keyup', keysFunctionUp)
















function colliderGround() {
    grounds.forEach(e => {
        e.draw()
        //parte de cima
        if (player.position.x + player.width > e.position.x && player.position.x < e.position.x + e.width && player.position.y + player.height + player.velocity.y > e.position.y && player.position.y < e.position.y + e.height) {
            player.velocity.y = 0
        }
        if (player.position.x + player.velocity.x < e.position.x + e.width && player.position.x + player.width > e.position.x && player.position.y + player.height > e.position.y && player.position.y < e.position.y + e.height) {
            player.velocity.x = 0
        }
        //lado direito
        if (player.position.x < e.position.x + e.width && player.position.x + player.width + player.velocity.x > e.position.x && player.position.y + player.height > e.position.y && player.position.y < e.position.y + e.height) {
            player.velocity.x = 0
        }
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
            score.currentValue += 1
            score.update()
        }
    }
}



let canTakeDamage = true
function colliderEnemy() {
    enemies.forEach(e => {
        e.update()
        if (canTakeDamage && player.position.y + player.height >= e.position.y && player.position.y <= e.position.y + e.height && player.position.x + player.width >= e.position.x && player.position.x <= e.position.x + e.width) {
            vida.currentValue -= 1
            updateUI()
            canTakeDamage = false
            let invincibility = setTimeout(() => canTakeDamage = true, 1000)
        }
    }
    )
}




function colliderMorango() {
    if (morangos.length > 0) {
        morangos[0].animation()
    }
    for (let i = 0; i < morangos.length; i++) {

        morangos[i].draw()
        if (player.position.y + player.height >= morangos[i].position.y && player.position.y <= morangos[i].position.y + morangos[i].height && player.position.x + player.width >= morangos[i].position.x && player.position.x <= morangos[i].position.x + morangos[i].width) {
            vida.currentValue += 1
            morangos.splice(i, 1)
            updateUI()
        }
    }
}


function colliderMorte() {

    for (let i = 0; i < mortes.length; i++) {
     

        if (player.position.y + player.height >= mortes[i].position.y && player.position.y <= mortes[i].position.y + mortes[i].height && player.position.x + player.width >= mortes[i].position.x && player.position.x <= mortes[i].position.x + mortes[i].width) {
            console.log('collidermorte')
            alive = false
            document.removeEventListener('keydown', keysFunctionDown)
            document.removeEventListener('keyup', keysFunctionUp)
            setTimeout(startGame, 1000)
        }
    }
}


function updateUI() {
    ui.clearRect(0, 0, canvasUI.width, canvasUI.height)
    vida.update()
    score.update()
}

























let canMoveLeft = 0
function moveLeft() {
    grounds.forEach(element => {

        if (player.position.x + player.velocity.x < element.position.x + element.width && player.position.x + player.width > element.position.x && player.position.y + player.height > element.position.y && player.position.y < element.position.y + element.height) {
            canMoveLeft += 1
        }

    }
    )
    if (canMoveLeft == 0) {
        player.velocity.x = 0
        bgD += 3
        plataforms.forEach(e =>
            e.position.x += 7
        )
        enemies.forEach(e => {
            e.position.x += 7
            e.initialPosition.x += 7
        })
        frogs.forEach(e =>
            e.position.x += 7)
        grounds.forEach(e =>
            e.position.x += 7)
        morangos.forEach(e =>
            e.position.x += 7)
        mortes.forEach(e =>
            e.position.x += 7)

    }
    else canMoveLeft = 0
}


let canMoveRight = 0
function moveRight() {
    grounds.forEach(element => {

        if (player.position.x < element.position.x + element.width && player.position.x + player.width + player.velocity.x > element.position.x && player.position.y + player.height > element.position.y && player.position.y < element.position.y + element.height) {
            canMoveRight += 1
        }

    }
    )
    if (canMoveRight == 0) {
        player.velocity.x = 0
        bgD -= 3
        plataforms.forEach(e =>
            e.position.x -= 7
        )
        enemies.forEach(e => {
            e.position.x -= 7
            e.initialPosition.x -= 7
        })
        frogs.forEach(e =>
            e.position.x -= 7)
        grounds.forEach(e =>
            e.position.x -= 7)
        morangos.forEach(e =>
            e.position.x -= 7)
        mortes.forEach(e =>
            e.position.x -= 7)

    }
    else canMoveRight = 0
}


let canMoveUp = 0
let moovingUp = false
function moveUp() {
    // console.log('up')


    grounds.forEach(element => {

        if (player.position.x + player.width > element.position.x && player.position.x < element.position.x + element.width && player.position.y + player.height + player.velocity.y > element.position.y + element.height && player.position.y < element.position.y + element.height) {
            canMoveUp += 1
            moovingUp = false


            plataforms.forEach(e =>
                e.position.y += player.velocity.y
            )
            enemies.forEach(e => {
                e.position.y += player.velocity.y
                e.initialPosition.y += player.velocity.y
            })
            frogs.forEach(e =>
                e.position.y += player.velocity.y)
            grounds.forEach(e =>
                e.position.y += player.velocity.y)
            morangos.forEach(e =>
                e.position.y += player.velocity.y)


            player.velocity.y = 3

        }

    }
    )
    if (canMoveUp == 0) {
        plataforms.forEach(e =>
            e.position.y -= player.velocity.y
        )
        enemies.forEach(e => {
            e.position.y -= player.velocity.y
            e.initialPosition.y -= player.velocity.y
        })
        frogs.forEach(e =>
            e.position.y -= player.velocity.y)
        grounds.forEach(e =>
            e.position.y -= player.velocity.y)
        morangos.forEach(e =>
            e.position.y -= player.velocity.y)
        mortes.forEach(e =>
            e.position.y -= player.velocity.y)
        moovingUp = true
    }
    else {
        canMoveUp = 0
        moovingUp = false

    }
}



let canMoveDown = 0
let moovingDown = false
function moveDown() {
    grounds.forEach(element => {

        if (player.position.x + player.width > element.position.x && player.position.x < element.position.x + element.width && player.position.y + player.height + player.velocity.y > element.position.y && player.position.y < element.position.y + element.height) {
            canMoveDown += 1
            moovingDown = false
        }
    }
    )

    if (canMoveDown == 0) {
        plataforms.forEach(e =>
            e.position.y -= player.velocity.y
        )
        enemies.forEach(e => {
            e.position.y -= player.velocity.y
            e.initialPosition.y -= player.velocity.y
        })
        frogs.forEach(e =>
            e.position.y -= player.velocity.y)
        grounds.forEach(e =>
            e.position.y -= player.velocity.y)
        morangos.forEach(e =>
            e.position.y -= player.velocity.y)
        mortes.forEach(e =>
            e.position.y -= player.velocity.y)
        moovingDown = true

    }
    else {
        canMoveDown = 0
        moovingDown = false
    }

}


















function startGame() {
    alive = true
    document.addEventListener('keydown', keysFunctionDown)
    document.addEventListener('keyup', keysFunctionUp)
    vida.currentValue = vida.initialValue
    score.currentValue = score.initialValue
    player.position.x = 200
    deleteAll()
    loadLevel()
    updateUI()
}













let bgD = 0
function animate() {
    if (alive) {
        for (let i = -1; i < 5; i++) {
            c.drawImage(bg_sprite, 0 + i * canvas.width + bgD, 0, canvas.width, canvas.height)
        }
        player.update()
        colliderGround()

        colliderFrog()
        colliderEnemy()
        colliderMorango()
        colliderMorte()
        if (keys.down.pressed) jumpBar.update()
        player.position.x += player.velocity.x
        console.log(alive)
        updateUI()
        requestAnimationFrame(animate)
    }
    else {
        c.fillStyle = 'rgba(0, 0, 0, 0.03)'
        c.fillRect(0, 0, canvas.width, canvas.height)
        requestAnimationFrame(animate)
    }
}














//chao fica no 800
function loadLevel() {


    // chao
    for (let i = 0; i < 14; i++) {
        grounds.push(new Ground(i * 100 + 100, canvas.height - 100, 1, 1))
    }

    grounds.push(new Ground(1500, canvas.height - 100, 2, 5))


    grounds.push(new Ground(1500, canvas.height - 200, 1, 3))
    grounds.push(new Ground(1500, canvas.height - 300, 1, 3))
    grounds.push(new Ground(1500, canvas.height - 400, 1, 3))
    grounds.push(new Ground(1500, canvas.height - 500, 4, 4))

    grounds.push(new Ground(1600, canvas.height - 500, 1, 1))
    grounds.push(new Ground(1700, canvas.height - 500, 1, 1))
    grounds.push(new Ground(1800, canvas.height - 500, 1, 1))
    grounds.push(new Ground(1900, canvas.height - 500, 1, 1))
    grounds.push(new Ground(2000, canvas.height - 500, 5, 4))
    grounds.push(new Ground(2000, canvas.height - 400, 1, 2))
    grounds.push(new Ground(2000, canvas.height - 300, 1, 2))
    grounds.push(new Ground(2000, canvas.height - 200, 1, 2))
    grounds.push(new Ground(2000, canvas.height - 100, 3, 5))

    for (let i = 0; i < 9; i++) {
        grounds.push(new Ground(i * 100 + 2100, canvas.height - 100, 1, 1))
    }

    for (let i = 0; i < 6; i++) {
        grounds.push(new Ground(3000, canvas.height - 100 * i - 200, 1, 3))
    }

    grounds.push(new Ground(3000, 800, 2, 5))
    grounds.push(new Ground(3000, 100, 4, 4))

    grounds.push(new Ground(2400, 400, 3, 3))
    grounds.push(new Ground(2500, 400, 3, 4))
    grounds.push(new Ground(2600, 400, 3, 7))



    grounds.push(new Ground(3100, 100, 1, 1))
    grounds.push(new Ground(3200, 100, 1, 1))
    grounds.push(new Ground(3300, 100, 1, 1))
    grounds.push(new Ground(3400, 100, 1, 1))
    grounds.push(new Ground(3500, 100, 5, 4))

    grounds.push(new Ground(3500, 200, 1, 7))
    grounds.push(new Ground(3500, 300, 1, 7))
    grounds.push(new Ground(3500, 400, 1, 7))
    grounds.push(new Ground(3500, 500, 1, 7))

    grounds.push(new Ground(3500, 600, 3, 5))

    grounds.push(new Ground(3600, 600, 1, 1))
    grounds.push(new Ground(3700, 600, 1, 1))
    grounds.push(new Ground(3800, 600, 5, 4))
    grounds.push(new Ground(3800, 700, 1, 7))
    grounds.push(new Ground(3800, 800, 3, 5))


    for (let i = 0; i < 26; i++) {
        grounds.push(new Ground(3900 + i * 100, 800, 1, 1))
    }

    grounds.push(new Ground(6400, 800, 2, 5))

    for (let i = 0; i < 16; i++) {
        grounds.push(new Ground(6400, 700 - i * 100, 1, 3))
    }

    grounds.push(new Ground(6400, -900, 4, 4))

    for (let i = 0; i < 14; i++) {
        grounds.push(new Ground(6500 + i * 100, -900, 1, 1))
    }

    grounds.push(new Ground(7900, -900, 5, 4))

    for (let i = 0; i < 23; i++) {
        grounds.push(new Ground(7900, -800 + i * 100, 1, 2))
    }

    grounds.push(new Ground(12800, -500, 4, 4))

    for (let i = 0; i < 19; i++) {
        grounds.push(new Ground(12800, -500 + i * 100, 1, 3))
    }

    for (let i = 0; i < 13; i++) {
        grounds.push(new Ground(12900 + i * 100, -500, 1, 1))
    }

    grounds.push(new Ground(14200, -500, 5, 4))

    for (let i = 0; i < 19; i++) {
        grounds.push(new Ground(14200, -400 + i * 100, 1, 2))
    }
    for (let i = 0; i < 19; i++) {
        grounds.push(new Ground(14900, -400 + i * 100, 1, 3))
    }
    grounds.push(new Ground(14900, -500, 1, 3))

    for (let i = 0; i < 13; i++) {
        grounds.push(new Ground(15000 + i *100, -500, 1, 1))
    }




    //plataformas
    grounds.push(new Ground(3700, -200, 5, 6))
    grounds.push(new Ground(3800, -200, 4, 6))
    grounds.push(new Ground(3900, -200, 5, 5))

    grounds.push(new Ground(4200, -500, 5, 6))
    grounds.push(new Ground(4300, -500, 4, 6))
    grounds.push(new Ground(4400, -500, 5, 5))


    grounds.push(new Ground(4600, -900, 5, 6))
    grounds.push(new Ground(4700, -900, 4, 6))
    grounds.push(new Ground(4800, -900, 5, 5))


    grounds.push(new Ground(5200, -900, 5, 6))
    grounds.push(new Ground(5300, -900, 5, 5))

    grounds.push(new Ground(5800, -900, 5, 6))
    grounds.push(new Ground(5900, -900, 5, 5))

    grounds.push(new Ground(8400, -1100, 5, 6))
    grounds.push(new Ground(8500, -1100, 4, 6))
    grounds.push(new Ground(8600, -1100, 4, 6))
    grounds.push(new Ground(8700, -1100, 5, 5))

    grounds.push(new Ground(9200, -1300, 5, 6))
    grounds.push(new Ground(9300, -1300, 4, 6))
    grounds.push(new Ground(9400, -1300, 5, 5))

    grounds.push(new Ground(10000, -1300, 5, 6))
    grounds.push(new Ground(10100, -1300, 4, 6))
    grounds.push(new Ground(10200, -1300, 5, 5))

    grounds.push(new Ground(10800, -1100, 5, 6))
    grounds.push(new Ground(10900, -1100, 4, 6))
    grounds.push(new Ground(11000, -1100, 5, 5))

    grounds.push(new Ground(11400, -900, 5, 6))
    grounds.push(new Ground(11500, -900, 5, 5))

    grounds.push(new Ground(11900, -800, 5, 6))
    grounds.push(new Ground(12000, -800, 5, 5))

    grounds.push(new Ground(12300, -700, 5, 6))
    grounds.push(new Ground(12400, -700, 5, 5))

    grounds.push(new Ground(13400, -1000, 5, 6))
    grounds.push(new Ground(13500, -1000, 4, 6))
    grounds.push(new Ground(13600, -1000, 5, 5))



    //sapos
    frogs.push(new Frog(2500, 300))
    frogs.push(new Frog(7700, -1000))
    frogs.push(new Frog(13500, -1100))

    //enemy
    enemies.push(new Enemy(6900, -1000, 600, 3))
    enemies.push(new Enemy(12900, -600, 600, 3))
    enemies.push(new Enemy(13500, -600, 600, 3))


    for (let i = 0; i < 170; i++) {
        mortes.push(new Morte(-200 + i * 100, 1300))
    }

}

function deleteAll() {
    bgD = 0
    plataforms = []
    enemies = []
    frogs = []
    grounds = []
    morangos = []
    mortes = []
}



gatinho_sprite.onload = animate()
startGame()



