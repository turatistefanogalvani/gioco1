function startGame() {
    myGamePiece.loadImages(running);
    myGameArea.start();
    drawTerreno();
    suono();
}  

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.update();
    myGameArea.drawGameObject(myGamePiece);
    drawTerreno();
    if (myGamePiece.x >= (myGameArea.canvas.width / 2)) {
        myGamePiece.x = myGameArea.canvas.width / 2;   // Blocca il personaggio a metà canvas

        if (myGameArea.keydown["a"]) {
            myGamePiece.speedX = -1;
            myGamePiece.imageList = myGamePiece.imageListRunning;
            specchia_immagine = true;
            myGameArea.backgroundX += myGameArea.backgroundSpeed; // Scorri il terreno a destra
        } else if (myGameArea.keydown["s"]) {
            myGamePiece.imageList = myGamePiece.imageListRunning;
            specchia_immagine = false;
            myGameArea.backgroundX -= myGameArea.backgroundSpeed; // Scorri il terreno a sinistra
        }
    } else {
        // Se il personaggio non ha raggiunto metà canvas
        if (myGameArea.keys["ArrowLeft"]) {
            if (!(myGamePiece.x == 80 && specchia_immagine == true)) {
                myGamePiece.speedX = -1;
            }
            if ((myGamePiece.x <= 80 && specchia_immagine == true)) {
                myGamePiece.speedX = 0;
                myGameArea.backgroundX += myGameArea.backgroundSpeed; // Scorri il terreno a destra
            }
            myGamePiece.imageList = myGamePiece.imageListRunning;
            specchia_immagine = true;
        }
        if (myGameArea.keys["ArrowRight"]) {
            myGamePiece.speedX = 1;
            myGamePiece.imageList = myGamePiece.imageListRunning;
            specchia_immagine = false;
        }
    }
}

// Control functions
document.addEventListener('keydown', function(event) {
    switch (event.key.toLowerCase()) {
        case 'w': // Salto
            jump();
            break;
        case 'a': // Movimento a sinistra
            moveleft();
            break;
        case 'd': // Movimento a destra
            moveright();
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.key.toLowerCase()) {
        case 'a': // Ferma il movimento a sinistra
        case 'd': // Ferma il movimento a destra
            clearmove();
            break;
    }
}); 
// Funzioni di controllo
function moveleft() {
    myGamePiece.speedX = -1; // Velocità a sinistra
}

function moveright() {
    myGamePiece.speedX = 1; // Velocità a destra
}

function clearmove() {
    myGamePiece.speedX = 0; // Ferma il movimento orizzontale
}

function jump() {
        myGamePiece.gravitySpeed = -4; // Forza del salto
    }

function suono() {
    const audio = new Audio('canzonesottofondo.mp3');
    audio.volume = 0.1; // Imposta il volume a 10%
    audio.loop = true; // Ripeti il suono
    audio.play();
    };

const oggetti = {
    0: "immagini/cielo.jpg",
    1: "immagini/pavimento.png",
    2: "immagini/bloccogiallo.png",
    3: "immagini/acquafinale.png",
}

function drawTerreno() {
    const quadsize = 30
    const offsetX = myGameArea.backgroundX;

    for (let i = 0; i < terreno.length; i++) {
        for (let j = 0; j < terreno[i].length; j++) {
            const tile = terreno[i][j];
            const img = new Image();
            const imgsrc = oggetti[tile];
            if (imgsrc) {
                img.src = new Image();
                img.src = imgsrc;
                myGameArea.context.drawImage(
                    img,
                    j * quadsize + offsetX,
                    i * quadsize,
                    quadsize,
                    quadsize
                );
            }
        }
    }
}