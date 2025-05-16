const immaginiTerreno = {
    0: null,
    1: "immagini/pavimento.png",
    2: "immagini/bloccogiallo.png",
    3: "immagini/acquafinale.png",
    4: "immagini/postbloccogiallo.png",
    5: "immagini/bloccomattone.png",
    6: "immagini/tubo1.png",
    7: "immagini/tubo2.png",
    8: "immagini/tubo3.png",
    9: "immagini/tubo4.png",
    10: "immagini/blg.png",
    11: "immagini/filo vittoria.png",
    12: "immagini/bandiera.png",
    13: "immagini/bild1.png",
    14: "immagini/bild2.png",
    15: "immagini/bild3.png",
    16: "immagini/bild4.png",
    17: "immagini/moneta.png",
    18: "immagini/bloccooo.png",
};

function drawTerreno() {
    const tileSize = 25;
    const offsetX = myGameArea.backgroundX;
    for (let row = 0; row < terreno.length; row++) {
        for (let col = 0; col < terreno[row].length; col++) {
            const numero = terreno[row][col];

            // Salta le monete, le disegneremo dopo
            if (numero === 17) continue;

            const immagineSrc = immaginiTerreno[numero];
            if (immagineSrc) {
                const img = new Image();
                img.src = immagineSrc;
                myGameArea.context.drawImage(img, col * tileSize + offsetX, row * tileSize, tileSize, tileSize);
            }
        }
    }

    // Poi disegna tutte le monete (sopra tutto il resto)
    for (let row = 0; row < terreno.length; row++) {
        for (let col = 0; col < terreno[row].length; col++) {
            if (terreno[row][col] === 17) {
                console.log("Disegno moneta in posizione:", row, col);
                const img = new Image();
                img.src = immaginiTerreno[17];

                // Disegna la moneta con dimensioni leggermente più grandi per assicurarsi che sia visibile
                myGameArea.context.drawImage(
                    img,
                    col * tileSize + offsetX - 2,
                    row * tileSize - 2,
                    tileSize + 0,
                    tileSize + 0
                );
            }
        }
    }

    // Disegna la bandiera
    const bandieraImg = new Image();
    bandieraImg.src = "immagini/bandiera.png"; // Sostituisci con il percorso corretto
    const fineTerrenoX = terreno[0].length * tileSize + offsetX - tileSize; // Ultima colonna
    const fineTerrenoY = (terreno.length - 2) * tileSize; // Penultima riga (ad esempio)
    myGameArea.context.drawImage(bandieraImg, fineTerrenoX, fineTerrenoY, tileSize, tileSize * 2);
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

    // Aggiorna questa parte di myGamePiece per gestire meglio le collisioni
    update: function () {
        // Aggiorniamo prima la gravità
        this.gravitySpeed += this.gravity;

        // Gestiamo separatamente i movimenti X e Y per risolvere le collisioni correttamente

        // 1. Movimento orizzontale
        this.tryX = this.x + this.speedX;
        if (!this.checkCollision(this.tryX, this.y)) {
            this.x = this.tryX;
        } else {
            this.speedX = 0; // Blocca il movimento orizzontale
        }

        // 2. Movimento verticale (inclusa la gravità)
        this.tryY = this.y + this.speedY + this.gravitySpeed;
        if (!this.checkCollision(this.x, this.tryY)) {
            this.y = this.tryY;
        } else {
            // Se colpisce qualcosa verso il basso, è sul pavimento
            if (this.gravitySpeed > 0) {
                this.isJumping = false;
            }
            this.gravitySpeed = 0; // Blocca la gravità
        }

        // Aggiorniamo l'animazione
        if (this.speedX !== 0 || myGameArea.keys["ArrowLeft"] || myGameArea.keys["ArrowRight"]) {
            this.contaFrame++;
            if (this.contaFrame == 5) {
                this.contaFrame = 0;
                this.actualFrame = (this.actualFrame + 1) % this.imageList.length;
                this.image = this.imageList[this.actualFrame];
            }
        } else {
            this.image = this.imageList[0]; // Immagine fermo
        }
    },

    jump: function () {
        if (!this.isJumping) {
            this.gravitySpeed = this.jumpStrength;
            this.isJumping = true;
        }
    },

    // Sostituisci la funzione checkCollision con questa versione corretta
    // Sostituisci la funzione checkCollision con questa versione corretta
checkCollision: function (nextX, nextY) {
    const tileSize = 25;
    const offsetX = myGameArea.backgroundX;

    // Nel mondo del gioco, la posizione del personaggio è relativa al background
    // Quindi dobbiamo convertire la posizione dello schermo in posizione mondo
    const worldNextX = nextX - offsetX;
    const worldCurrentX = this.x - offsetX;
    
    // Determina la direzione del movimento
    const isHorizontalMovement = (nextX !== this.x);
    const isVerticalMovement = (nextY !== this.y);
    
    // Calcola gli indici dei tile nella posizione futura
    const left = Math.floor(worldNextX / tileSize);
    const right = Math.floor((worldNextX + this.width - 1) / tileSize);
    const top = Math.floor(nextY / tileSize);
    const bottom = Math.floor((nextY + this.height - 1) / tileSize);
    
    let collisionDetected = false;
    
    for (let row = top; row <= bottom; row++) {
        for (let col = left; col <= right; col++) {
            // Verifica che gli indici siano validi
            if (row >= 0 && row < terreno.length && col >= 0 && col < terreno[0].length) {
                const tile = terreno[row][col];
                console.log(`Checking tile at [${row}][${col}] = ${tile}`);
                
                // Controlla se è una moneta (tile 17)
                if (tile === 17) {
                    // Rimuovi la moneta
                    terreno[row][col] = 0;
                    console.log("Moneta raccolta!");
                    continue; // La moneta non blocca il movimento
                }
                
                // Gestione speciale per il blocco 2 (blocco giallo)
                if (tile === 2) {
                    // Verifica se il personaggio sta colpendo dal basso
                    if (this.gravitySpeed < 0 && isVerticalMovement) { // Sta saltando
                        // Fai apparire una moneta sopra il blocco
                        if (row - 1 >= 0) {
                            terreno[row - 1][col] = 17;
                            
                            // Forza aggiornamento immediato del rendering
                            setTimeout(function() {
                                drawTerreno();
                            }, 50);
                        }
                        
                        // Dopo mezzo secondo, sostituisci il blocco giallo
                        setTimeout(function() {
                            terreno[row][col] = 4;
                            drawTerreno();
                        }, 500);
                        
                        collisionDetected = true;
                    } else {
                        // Collisione normale con il blocco
                        collisionDetected = true;
                    }
                }
                
                if (tile === 18) {
                    // Verifica se il personaggio sta colpendo dal basso
                    if (this.gravitySpeed < 0 && isVerticalMovement) { // Sta saltando
                        // Dopo mezzo secondo, sostituisci il blocco
                        setTimeout(function() {
                            terreno[row][col] = 0;
                            drawTerreno();
                        }, 500);
                        
                        collisionDetected = true;
                    } else {
                        // Collisione normale con il blocco
                        collisionDetected = true;
                    }
                }
                
                // Collisione con blocchi solidi
                if (tile === 1 || tile === 4 || tile === 5 ||
                    tile === 6 || tile === 7 || tile === 8 ||
                    tile === 9 || tile === 10) {
                    
                    // Per movimento orizzontale
                    if (isHorizontalMovement && !isVerticalMovement) {
                        // Se si sta muovendo a destra
                        if (nextX > this.x) {
                            // Calcola il bordo destro del personaggio in coordinate mondo
                            const rightEdge = worldCurrentX + this.width;
                            // Calcola il bordo sinistro del tile in coordinate mondo
                            const tileLeftEdge = col * tileSize;
                            
                            if (rightEdge <= tileLeftEdge && worldNextX + this.width > tileLeftEdge) {
                                console.log("Collisione destra rilevata!");
                                collisionDetected = true;
                                break;
                            }
                        }
                        // Se si sta muovendo a sinistra
                        else if (nextX < this.x) {
                            // Calcola il bordo sinistro del personaggio in coordinate mondo
                            const leftEdge = worldCurrentX;
                            // Calcola il bordo destro del tile in coordinate mondo
                            const tileRightEdge = (col + 1) * tileSize;
                            
                            if (leftEdge >= tileRightEdge && worldNextX < tileRightEdge) {
                                console.log("Collisione sinistra rilevata!");
                                collisionDetected = true;
                                break;
                            }
                        }
                    }
                    // Per movimento verticale o diagonale
                    else {
                        collisionDetected = true;
                        break;
                    }
                }
                
                // Gestione morte del personaggio
                if (tile === 3) {
                    this.respawn();
                    return false;
                }
                
                // Gestione vittoria
                if (tile === 11) {
                    this.vittoria();
                    return false;
                }
            }
        }
        if (collisionDetected) break;
    }
    
    return collisionDetected; // Restituisce true se è stata rilevata una collisione
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

    vittoria: function () {
        // Mostra un overlay con il messaggio e il pulsante
        const overlay = document.createElement("div");
        overlay.id = "victory-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.color = "white";
        overlay.style.fontSize = "32px";
        overlay.style.zIndex = "1000";
        overlay.style.animation = "fadeIn 1s ease-in-out";

        const message = document.createElement("h1");
        message.textContent = "🎉 Complimenti! Hai Vinto! 🎉";
        message.style.marginBottom = "20px";
        message.style.textShadow = "2px 2px 5px rgba(0, 0, 0, 0.7)";
        overlay.appendChild(message);

        const button = document.createElement("button");
        button.textContent = "Rigioca";
        button.style.padding = "15px 30px";
        button.style.fontSize = "20px";
        button.style.cursor = "pointer";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.backgroundColor = "#28a745";
        button.style.color = "white";
        button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        button.style.transition = "background-color 0.3s ease";
        button.addEventListener("mouseover", () => {
            button.style.backgroundColor = "#218838";
        });
        button.addEventListener("mouseout", () => {
            button.style.backgroundColor = "#28a745";
        });
        button.addEventListener("click", () => {
            document.body.removeChild(overlay); // Rimuove l'overlay
            location.reload(); // Riavvia il gioco
        });
        overlay.appendChild(button);

        // Aggiungi un'animazione di sfondo
        overlay.style.backgroundImage = "radial-gradient(circle, rgba(255,215,0,1) 0%, rgba(255,140,0,1) 100%)";
        overlay.style.backgroundSize = "cover";

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
};

const myGameArea = {
    canvas: document.getElementById("myCanvas"),
    context: null,
    interval: null,
    keys: [],
    backgroundX: 0,
    backgroundSpeed: 3.5,

    start: function () {
        this.canvas.width = 1080;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        //this.interval = setInterval(updateGameArea, 30);
        requestAnimationFrame(updateGameArea);
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
var maxBackgroundX = -(terreno[0].length * 25 - 2 * (myGameArea.canvas.width)); // Limite massimo verso destra del terreno
var fpsInterval = 1000 /  120; // 25 FPS

var then = Date.now();
function updateGameArea() {
    requestAnimationFrame(updateGameArea);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        myGameArea.context.save();
        myGameArea.clear();
        drawTerreno();

        myGamePiece.speedX = 0;

        if (myGameArea.keys["ArrowUp"]) {
            myGamePiece.jump();
        }

        // Controlla il movimento orizzontale
        if (myGamePiece.x >= (myGameArea.canvas.width / 2)) {
            myGamePiece.x = myGameArea.canvas.width / 2; // Blocca il personaggio a metà canvas

            if (myGameArea.keys["ArrowLeft"]) {
                if (myGameArea.backgroundX < minBackgroundX) {
                    // Simuliamo il movimento per verificare se ci sarebbero collisioni
                    const testX = myGameArea.backgroundX + myGameArea.backgroundSpeed;
                    myGameArea.backgroundX += myGameArea.backgroundSpeed; // Spostiamo temporaneamente per il test

                    if (myGamePiece.checkCollision(myGamePiece.x, myGamePiece.y)) {
                        // Se c'è collisione, ripristiniamo la posizione originale
                        myGameArea.backgroundX -= myGameArea.backgroundSpeed;
                    }

                    myGamePiece.imageList = myGamePiece.imageListRunning;
                    specchia_immagine = true;
                }
            } else if (myGameArea.keys["ArrowRight"]) {
                if (myGameArea.backgroundX > maxBackgroundX) {
                    // Simuliamo il movimento per verificare se ci sarebbero collisioni
                    const testX = myGameArea.backgroundX - myGameArea.backgroundSpeed;
                    myGameArea.backgroundX -= myGameArea.backgroundSpeed; // Spostiamo temporaneamente per il test

                    if (myGamePiece.checkCollision(myGamePiece.x, myGamePiece.y)) {
                        // Se c'è collisione, ripristiniamo la posizione originale
                        myGameArea.backgroundX += myGameArea.backgroundSpeed;
                    }

                    myGamePiece.imageList = myGamePiece.imageListRunning;
                    specchia_immagine = false;
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
                            // Simuliamo il movimento per verificare se ci sarebbero collisioni
                            const testX = myGameArea.backgroundX + myGameArea.backgroundSpeed;
                            myGameArea.backgroundX += myGameArea.backgroundSpeed; // Spostiamo temporaneamente per il test

                            if (myGamePiece.checkCollision(myGamePiece.x, myGamePiece.y)) {
                                // Se c'è collisione, ripristiniamo la posizione originale
                                myGameArea.backgroundX -= myGameArea.backgroundSpeed;
                            }
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

        // Assicuriamoci che il personaggio non esca dai limiti del canvas
        if (myGamePiece.x < 0) myGamePiece.x = 0;
        if (myGamePiece.x > myGameArea.canvas.width - myGamePiece.width) {
            myGamePiece.x = myGameArea.canvas.width - myGamePiece.width;
        }

        myGamePiece.update();
        myGameArea.drawGameObject(myGamePiece);
        myGameArea.context.restore();

    }
}



function startGame() {
    myGamePiece.loadImages(running);
}

document.addEventListener("DOMContentLoaded", function () {
    startGame();
});