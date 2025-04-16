function startGame() {
    myGamePiece.loadImages(running);
    bushObject.loadImages();
    bushObjectdue.loadImages();
    crateObject.loadImages();
    blockObject.loadImages();
    dueblockObject.loadImages();
    fiveblockObject.loadImages();
    tuboUnoObject.loadImages();
    tuboDueObject.loadImages();
    myGameArea.start();
    update1();
    suono();
}  

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.update();
    myGameArea.drawGameObject(myGamePiece);
    myGameArea.drawGameObject(bushObject);
    myGameArea.drawGameObject(bushObjectdue);
    myGameArea.drawGameObject(crateObject);
    myGameArea.drawGameObject(blockObject);
    myGameArea.drawGameObject(fiveblockObject);
    myGameArea.drawGameObject(dueblockObject);
    myGameArea.drawGameObject(tuboUnoObject);
    myGameArea.drawGameObject(tuboDueObject);
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