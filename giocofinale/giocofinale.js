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

var myGamePiece = {
    speedX: 0,
    speedY: 0,
    width: 60,
    height: 60,
    x: 10,
    y: 120,
    imageList: [], // Array to store loaded images
    contaFrame: 0, // Frame counter
    actualFrame: 0, // Current frame to display
    image: null, // Current image
    tryX: 0,
    tryY: 0,
    gravity: 0.1, // forza della gravità
    gravitySpeed: 0, // velocità verticale influenzata dalla gravità


    update: function() {
        this.gravitySpeed += this.gravity;
        this.tryY = this.y + this.speedY + this.gravitySpeed;
        this.tryX = this.x + this.speedX;
        
        const collidesWithBlock = this.crashWith(blockObject);
        const collidesWithBush = this.crashWith(bushObject);
        const collidesWithCrate = this.crashWith(crateObject);
        const collidesWithfiveBlock = this.crashWith(fiveblockObject);
        const collidesWithdueBlock = this.crashWith(dueblockObject);
        const collidesWithtubouno = this.crashWith(tuboUnoObject);
    
        if (!collidesWithBush && !collidesWithCrate && !collidesWithBlock && !collidesWithfiveBlock && !collidesWithdueBlock && !collidesWithtubouno) {
            // Controlla bordi canvas
            if (this.tryX < 0) this.tryX = 0;
            if (this.tryX + this.width > myGameArea.canvas.width)
                this.tryX = myGameArea.canvas.width - this.width;
            if (this.tryY < 0) this.tryY = 0;
            if (this.tryY + this.height > myGameArea.canvas.height)
                this.tryY = myGameArea.canvas.height - this.height;
    
            this.x = this.tryX;
            this.y = this.tryY;
        } else {
            // Se c'è collisione con qualcosa sotto, azzera velocità verticale
            this.gravitySpeed = 0;
            this.x = this.tryX;
        }
    
        this.contaFrame++;
        if (this.contaFrame == 50) {
            this.contaFrame = 0;
            this.actualFrame = (this.actualFrame + 1) % this.imageList.length;
            this.image = this.imageList[this.actualFrame];
        }
    },
    

    loadImages: function(running) {
        for (let imgPath of running) {
            var img = new Image();
            img.src = imgPath;
            this.imageList.push(img);
        }
        this.image = this.imageList[this.actualFrame];
    },
    crashWith: function(otherobj) {
        var myleft = this.tryX;
        var myright = this.tryX + this.width;
        var mytop = this.tryY;
        var mybottom = this.tryY + this.height;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + otherobj.width;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + otherobj.height;
    
        if ((mybottom >= othertop) &&
            (mytop <= otherbottom) &&
            (myright >= otherleft) &&
            (myleft <= otherright)) {
            return true; // Collisione
        }
    
        return false; // Nessuna collisione
    }
    
};

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

// Control functions
function moveup() {
    myGamePiece.speedY -= 0.4; 
}

function movedown() {
    myGamePiece.speedY += 0.4; 
}

function moveleft() {
    myGamePiece.speedX -= 0.4; 
}

function moveright() {
    myGamePiece.speedX += 0.4; 
}

function clearmove() {
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}

function jump() {
    // Salto verso l'alto
    myGamePiece.gravitySpeed = -5;
}
