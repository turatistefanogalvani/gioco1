const immaginiTerreno = {
    0: null,
    1: "immagini/pavimento.png",
    2: "immagini/bloccogiallo.png",
    3: "immagini/acquafinale.png",
}

function drawTerreno() {
    const tileSize = 25; // Dimensione di ogni cella della matrice in pixel
    const offsetX = myGameArea.backgroundX; // Usa lo scorrimento dello sfondo come offset

    for (let row = 0; row < terreno.length; row++) {
        for (let col = 0; col < terreno[row].length; col++) {
            const numero = terreno[row][col];
            const immagineSrc = immaginiTerreno[numero];
            if (immagineSrc) {
                const img = new Image();
                img.src = immagineSrc;
                // Disegna il blocco con in orizzontale
                myGameArea.context.drawImage(img, col * tileSize + offsetX,  row * tileSize, tileSize, tileSize);
                 
            }
        }
    }
};

// avvio il gioco
function startGame() {
    myGamePiece.loadImages(running);
    myGameArea.start();
}

var specchia_immagine = false; 

var myGamePiece = {
    speedX: 0,
    speedY: 0,
    width: 60,
    height: 60,
    x: 10,
    y: 174,
    gravity: 0.5, // Forza di gravità
    gravitySpeed: 0, // Velocità verticale influenzata dalla gravità
    jumpStrength: -11, // Forza del salto
    isJumping: false, // Stato del salto
    imageList: [],
    imageListRunning: [],
    imageListIdle: [],
    imageListDead: [],
    contaFrame: 0,
    actualFrame: 0,
    image: null,

    update: function () {
        // Aggiorna la posizione orizzontale
        if (this.x + this.speedX > 0 && this.x + this.speedX < myGameArea.canvas.width - this.width) {
            this.x += this.speedX;
        }

        // Applica la gravità
        this.gravitySpeed += this.gravity;
        this.y += this.speedY + this.gravitySpeed;

        // Impedisce al personaggio di cadere oltre il terreno
        if (this.y > 174) { // 174 è la posizione del terreno
            this.y = 174;
            this.gravitySpeed = 0;
            this.isJumping = false; // Il personaggio non è più in salto
        }

        this.contaFrame++;
        if (this.contaFrame == 5) {
            this.contaFrame = 0;
            this.actualFrame = (this.actualFrame + 1) % this.imageList.length;
            this.image = this.imageList[this.actualFrame];
        }
    },

    jump: function () {
        if (!this.isJumping) { // Permetti il salto solo se non è già in salto
            this.gravitySpeed = this.jumpStrength; // Applica la forza del salto
            this.isJumping = true;
        }
    },

    loadImages: function (running) {
        let loadedCount = 0;
    
        for (let imgPath of running) {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === running.length) {
                    this.imageListRunning = [...this.imageListRunning];
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

var myGameArea = {
    canvas: document.getElementById("myCanvas"),
    context: null,
    interval: null,
    keys: [], // Array per tenere traccia dei tasti premuti
    backgroundX: 0, // Posizione orizzontale dello sfondo
    backgroundSpeed: 1, // Velocità dello sfondo

    start: function () {
        this.canvas.width = 1080;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d"); // <--- AGGIUNGI QUESTA RIGA
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 1); // Impostato a 1ms per migliorare il controllo
        window.addEventListener('keydown', function (e) {
            myGameArea.keys[e.key] = true;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.key] = false;
        });

        maxBackgroundX = (terreno[0].length * 25 - 2*(myGameArea.canvas.width)); // Limite massimo verso destra del terreno
    },

    clear: function () {
        // Cancella l'intera canvas senza disegnare lo sfondo
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    drawGameObject: function (gameObject) {
        if (!gameObject.image) return; // ⛔ Evita drawImage se l'immagine non è pronta
    
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
var maxBackgroundX = 0; 

function collisioni() {
    const tileSize = 25; // Dimensione di ogni cella della matrice in pixel
    const offsetX = myGameArea.backgroundX; // Usa lo scorrimento dello sfondo come offset

    // Calcola la posizione del personaggio nella matrice
    const col = Math.floor((myGamePiece.x - offsetX + myGamePiece.width / 2) / tileSize);
    const row = Math.floor((myGamePiece.y + myGamePiece.height) / tileSize);

    // Verifica se il personaggio è sopra un blocco solido
    if (row < terreno.length && col >= 0 && col < terreno[row].length) {
        const numero = terreno[row][col];
        if (numero == 1 || numero == 2) { // pavimento o blocco giallo
            myGamePiece.y = row * tileSize - myGamePiece.height;
            myGamePiece.gravitySpeed = 0;
            myGamePiece.isJumping = false;
        } else if (numero == 3) { // acqua finale
            alert("Hai vinto!");
            clearInterval(myGameArea.interval); // Ferma il gioco
        }
    }
}

// 🔄 Ora la funzione è globale, visibile anche a setInterval
function updateGameArea() {
    myGameArea.clear(); // Cancella la canvas
    drawTerreno(); // Disegna il terreno sopra la canvas

    myGamePiece.speedX = 0;

    if (myGameArea.keys["ArrowUp"]) {
        myGamePiece.jump();
    }

    if (myGamePiece.x >= (myGameArea.canvas.width / 2)) {
        myGamePiece.x = myGameArea.canvas.width / 2;

        if (myGameArea.keys["ArrowLeft"]) {
            if (myGameArea.backgroundX < minBackgroundX) {
                myGamePiece.speedX = -1;
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
                    myGamePiece.speedX = -1;
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
                myGamePiece.speedX = 1;
                myGamePiece.imageList = myGamePiece.imageListRunning;
                specchia_immagine = false;
            }
        }
    }

    if (!myGameArea.keys["ArrowLeft"] && !myGameArea.keys["ArrowRight"]) {
        myGamePiece.speedX = 0;
        myGamePiece.imageList = myGamePiece.imageListIdle;
    }

    myGamePiece.update(); // Aggiorna la posizione del personaggio
    collisioni(); // Verifica le collisioni
    myGameArea.drawGameObject(myGamePiece); // Disegna il personaggio
}

// Avvia il gioco quando il DOM ha finito di caricar
document.addEventListener("DOMContentLoaded", function () {
    startGame();
});
