const immaginiTerreno = {
    0: null,
    1: "immagini/pavimento.png",
    2: "immagini/bloccogiallo.png",
    3: "immagini/acquafinale.png",
    4: "immagini/bloccogiallo.png",
    5: "immagini/bloccomattone.png",
};

function drawTerreno() {
    const tileSize = 25;
    const offsetX = myGameArea.backgroundX;
    for (let row = 0; row < terreno.length; row++) {
        for (let col = 0; col < terreno[row].length; col++) {
            const numero = terreno[row][col];
            const immagineSrc = immaginiTerreno[numero];
            if (immagineSrc) {
                const img = new Image();
                img.src = immagineSrc;
                myGameArea.context.drawImage(img, col * tileSize + offsetX, row * tileSize, tileSize, tileSize);
            }
        }
    }
}

let specchia_immagine = false;

var myGamePiece = {
    speedX: 0,
    speedY: 0,
    width: 60,
    height: 60,
    x: 10,
    y: 174,
    gravity: 0.3,
    gravitySpeed: 0,
    jumpStrength: -9,
    isJumping: false,
    imageList: [],
    imageListRunning: [],
    contaFrame: 0,
    actualFrame: 0,
    image: null,
    tryX: 0,
    tryY: 0,

    update: function () {
        this.gravitySpeed += this.gravity;

        this.tryX = this.x + this.speedX;
        if (!this.checkCollision(this.tryX, this.y)) {
            this.x = this.tryX;
        } else {
            this.speedX = 0;
        }

        this.tryY = this.y + this.speedY + this.gravitySpeed;
        if (!this.checkCollision(this.x, this.tryY)) {
            this.y = this.tryY;
        } else {
            this.gravitySpeed = 0;
            this.isJumping = false;
        }

        if (this.speedX !== 0) {
            this.contaFrame++;
            if (this.contaFrame == 5) {
                this.contaFrame = 0;
                this.actualFrame = (this.actualFrame + 1) % this.imageList.length;
                this.image = this.imageList[this.actualFrame];
            }
        } else {
            this.image = this.imageList[0];
        }
    },

    jump: function () {
        if (!this.isJumping) {
            this.gravitySpeed = this.jumpStrength;
            this.isJumping = true;
        }
    },

    checkCollision: function (nextX, nextY) {
        const tileSize = 25;
        const offsetX = myGameArea.backgroundX;

        const left = Math.floor((nextX - offsetX) / tileSize);
        const right = Math.floor((nextX + this.width - offsetX) / tileSize);
        const top = Math.floor(nextY / tileSize);
        const bottom = Math.floor((nextY + this.height) / tileSize);

        for (let row = top; row <= bottom; row++) {
            for (let col = left; col <= right; col++) {
                if (
                    row >= 0 && row < terreno.length &&
                    col >= 0 && col < terreno[0].length
                ) {
                    const tile = terreno[row][col];
                    if (tile === 1 || tile === 2 || tile === 4 || tile === 5) return true;
                    if (tile === 3) {
                        alert("Hai vinto!");
                        clearInterval(myGameArea.interval);
                        return false;
                    }
                }
            }
        }
        return false;
    },

    loadImages: function (running) {
        let loadedCount = 0;
        for (let imgPath of running) {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === running.length) {
                    this.imageList = this.imageListRunning;
                    this.image = this.imageList[0];
                    myGameArea.start();
                }
            };
            img.src = imgPath;
            this.imageListRunning.push(img);
        }
    }
};

const myGameArea = {
    canvas: document.getElementById("myCanvas"),
    context: null,
    interval: null,
    keys: [],
    backgroundX: 0,
    backgroundSpeed: 1,
    backgroundX: 0,         // manteniamo questo a 0
    backgroundSpeed: 0,

    start: function () {
        this.canvas.width = 1080;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

        window.addEventListener("keydown", function (e) {
            myGameArea.keys[e.key] = true;
        });
        window.addEventListener("keyup", function (e) {
            myGameArea.keys[e.key] = false;
        });

        maxBackgroundX = (terreno[0].length * 25 - 2 * (myGameArea.canvas.width));
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    drawGameObject: function (gameObject) {
        if (!gameObject.image) return;
        if (specchia_immagine) {
            this.context.save();
            this.context.scale(-1, 1);
            this.context.drawImage(
                gameObject.image,
                -gameObject.x - gameObject.width,
                gameObject.y,
                gameObject.width,
                gameObject.height
            );
            this.context.restore();
        } else {
            this.context.drawImage(
                gameObject.image,
                gameObject.x,
                gameObject.y,
                gameObject.width,
                gameObject.height
            );
        }
    }
};

let minBackgroundX = 0;
let maxBackgroundX = 0;

function updateGameArea() {
    myGameArea.clear();
    drawTerreno();

    myGamePiece.speedX = 0;

    if (myGameArea.keys["ArrowLeft"]) {
        myGamePiece.speedX = -3;
        specchia_immagine = true;
        myGamePiece.imageList = myGamePiece.imageListRunning;
    }
    if (myGameArea.keys["ArrowRight"]) {
        myGamePiece.speedX = 3;
        specchia_immagine = false;
        myGamePiece.imageList = myGamePiece.imageListRunning;
    }
    if (myGameArea.keys["ArrowUp"] && !myGamePiece.isJumping) {
        myGamePiece.jump();
    }

    // Aggiungiamo dei limiti per non far uscire il personaggio dal canvas
    if (myGamePiece.tryX < 0) myGamePiece.tryX = 0;
    if (myGamePiece.tryX > myGameArea.canvas.width - myGamePiece.width) {
        myGamePiece.tryX = myGameArea.canvas.width - myGamePiece.width;
    }

    myGamePiece.update();
    myGameArea.drawGameObject(myGamePiece);
}

function startGame() {
    var running = [
        "spirite2/a.png",
        "spirite2/b.png",
        "spirite2/c.png",
        "spirite2/d.png",
        "spirite2/e.png",
        "spirite2/f.png",
    ];
    myGamePiece.loadImages(running);
}

document.addEventListener("DOMContentLoaded", function () {
    startGame();
});