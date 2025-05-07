const immaginiTerreno = {
    0: null,
    1: "immagini/pavimento.png",
    2: "immagini/bloccogiallo.png",
    3: "immagini/acquafinale.png",
    4: "immagini/bloccogiallo.png",
    5: "immagini/bloccomattone.png",
    6: "immagini/tubo1.png",
    7: "immagini/tubo2.png",
    8: "immagini/tubo3.png",
    9: "immagini/tubo4.png",
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
    x: 0,
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
                    if (tile === 1 || tile === 2 || tile === 4 || tile === 5 || tile === 6 || tile === 7 || tile === 8 || tile === 9) return true;
                    if (tile === 3) {
                        this.respawn();
                         // Rigenera il personaggio
                        return false;
                    }
                }
            }
        }
        return false;
    },
    
    respawn: function () {
        // Mostra un overlay con il messaggio e il pulsante
        const overlay = document.createElement("div");
        overlay.id = "game-over-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.color = "white";
        overlay.style.fontSize = "24px";
        overlay.style.zIndex = "1000";
    
        const message = document.createElement("p");
        message.textContent = "Hai perso!";
        overlay.appendChild(message);
    
        const button = document.createElement("button");
        button.textContent = "Respawn";
        button.style.padding = "10px 20px";
        button.style.fontSize = "18px";
        button.style.cursor = "pointer";
        button.addEventListener("click", () => {
            document.body.removeChild(overlay); // Rimuove l'overlay
            location.reload(); // Riavvia il gioco
        });
        overlay.appendChild(button);
    
        document.body.appendChild(overlay);
    },

    loadImages: function (running) {
        let self = this;
        let loadedCount = 0;
        for (let imgPath of running) {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === running.length) {
                    self.imageList = self.imageListRunning;
                    self.image = self.imageList[0];
                    myGameArea.start();
                }
            };
            img.src = imgPath;
            self.imageListRunning.push(img);
        }
    }
}; // <- CHIUSURA dell'oggetto myGamePiece

const myGameArea = {
    canvas: document.getElementById("myCanvas"),
    context: null,
    interval: null,
    keys: [],
    backgroundX: 0,
    backgroundSpeed: 2.5,

    start: function () {
        this.canvas.width = 1080;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 30);

        window.addEventListener("keydown", function (e) {
            myGameArea.keys[e.key] = true;
        });
        window.addEventListener("keyup", function (e) {
            myGameArea.keys[e.key] = false;
        });
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

var minBackgroundX = 0; // Limite massimo verso sinistra del terreno
var maxBackgroundX = -(terreno[0].length * 25 - 2*(myGameArea.canvas.width)); // Limite massimo verso destra del terreno

function updateGameArea() {
    myGameArea.clear();
    drawTerreno();

    myGamePiece.speedX = 0;

    if (myGameArea.keys["ArrowUp"]) {
        myGamePiece.jump();
    }

    // Controlla il movimento orizzontale
    if (myGamePiece.x >= (myGameArea.canvas.width / 2)) {
        myGamePiece.x = myGameArea.canvas.width / 2; // Blocca il personaggio a metà canvas
        myGamePiece.imageList = myGamePiece.imageListRunning;

        if (myGameArea.keys["ArrowLeft"]) {
            if (myGameArea.backgroundX < minBackgroundX) {
                myGamePiece.speedX = -3;
                myGamePiece.imageList = myGamePiece.imageListRunning;
                specchia_immagine = true;
                myGameArea.backgroundX += myGameArea.backgroundSpeed;
            }
        } else if (myGameArea.keys["ArrowRight"]) {
            if (myGameArea.backgroundX > maxBackgroundX) {
                myGamePiece.imageList = myGamePiece.imageListRunning;
                specchia_immagine = false;
                myGameArea.backgroundX -= myGameArea.backgroundSpeed;
            }
        }
    } else {
        if (myGameArea.keys["ArrowLeft"]) {
            if (myGamePiece.x > 0 || myGameArea.backgroundX < minBackgroundX) {
                if (!(myGamePiece.x == 80 && specchia_immagine == true)) {
                    myGamePiece.speedX = -3;
                }
                if ((myGamePiece.x <= 80 && specchia_immagine == true)) {
                    myGamePiece.speedX = 0;
                    if (myGameArea.backgroundX < minBackgroundX) {
                        myGameArea.backgroundX += myGameArea.backgroundSpeed;
                    }
                }
                myGamePiece.imageList = myGamePiece.imageListRunning;
                specchia_immagine = true;
            }
        }
        if (myGameArea.keys["ArrowRight"]) {
            if (myGameArea.backgroundX > maxBackgroundX) {
                myGamePiece.speedX = 3;
                myGamePiece.imageList = myGamePiece.imageListRunning;
                specchia_immagine = false;
            }
        }
    }

    if (myGamePiece.tryX < 0) myGamePiece.tryX = 0;
    if (myGamePiece.tryX > myGameArea.canvas.width - myGamePiece.width) {
        myGamePiece.tryX = myGameArea.canvas.width - myGamePiece.width;
    }

    const canvasCenter = myGameArea.canvas.width / 2;
    if (myGamePiece.x > canvasCenter && myGameArea.backgroundX > -maxBackgroundX) {
        myGameArea.backgroundX -= myGamePiece.speedX;
        myGamePiece.x = canvasCenter;
    } else if (myGamePiece.x < canvasCenter && myGameArea.backgroundX < minBackgroundX) {
        myGameArea.backgroundX -= myGamePiece.speedX;
        myGamePiece.x = canvasCenter;
    }

    myGamePiece.update();
    myGameArea.drawGameObject(myGamePiece);
}

function startGame() {
    myGamePiece.loadImages(running);
}

document.addEventListener("DOMContentLoaded", function () {
    startGame();
});
