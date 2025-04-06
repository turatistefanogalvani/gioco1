function startGame() {
    myGamePiece.loadImages(running);
    bushObject.loadImages();
    crateObject.loadImages();
    blockObject.loadImages();
    dueblockObject.loadImages();
    fiveblockObject.loadImages();
    tuboUnoObject.loadImages();
    myGameArea.start();
}


var running = ['spirite2/mario1.png', 'spirite2/mario2.png', 'spirite2/mario3.png']; // Example paths for images

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.update();
    myGameArea.drawGameObject(myGamePiece);
    myGameArea.drawGameObject(bushObject);
    myGameArea.drawGameObject(crateObject);
    myGameArea.drawGameObject(blockObject);
    myGameArea.drawGameObject(fiveblockObject);
    myGameArea.drawGameObject(dueblockObject);
    myGameArea.drawGameObject(tuboUnoObject);
}
/*
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
}); */
// Funzioni di controllo
function moveleft() {
    myGamePiece.speedX = -2; // Velocità a sinistra
}

function moveright() {
    myGamePiece.speedX = 2; // Velocità a destra
}

function clearmove() {
    myGamePiece.speedX = 0; // Ferma il movimento orizzontale
}

function jump() {
        myGamePiece.gravitySpeed = -4; // Forza del salto
    }
