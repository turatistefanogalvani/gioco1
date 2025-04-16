var myGamePiece = {
    speedX: 0,
    speedY: 0,
    width: 40,
    height: 50,
    x: 10,
    y: 120,
    imageList: [], // Array to store loaded images
    contaFrame: 0, // Frame counter
    actualFrame: 0, // Current frame to display
    image: null, // Current image
    tryX: 0,
    tryY: 0,
    gravity: 0.07, // forza della gravità
    gravitySpeed: 0, // velocità verticale influenzata dalla gravità


    crashWith: function(otherobj) {
        var myleft = this.tryX;
        var myright = this.tryX + this.width;
        var mytop = this.tryY;
        var mybottom = this.tryY + this.height;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + otherobj.width;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + otherobj.height;
    
        var crash = false;
        if ((mybottom > othertop) && (mytop < otherbottom) && (myright > otherleft) && (myleft < otherright)) {
            crash = true;
        }
        return crash;
    },
    
    update: function () {
        this.gravitySpeed += this.gravity;
    
        // Tentativo di movimento orizzontale
        this.tryX = this.x + this.speedX;
        let collisionX = false;
    
        const objects = [blockObject, bushObject, bushObjectdue, crateObject, fiveblockObject, dueblockObject, tuboUnoObject, tuboDueObject];
        for (const obj of objects) {
            const testX = {
                tryX: this.tryX,
                tryY: this.y, // usa y attuale
                width: this.width,
                height: this.height,
                crashWith: this.crashWith
            };
            if (this.crashWith.call(testX, obj)) {
                collisionX = true;
                break;
            }
        }
    
        if (!collisionX) {
            this.x = this.tryX;
        } else {
            this.speedX = 0;
        }
    
        // Tentativo di movimento verticale
        this.tryY = this.y + this.speedY + this.gravitySpeed;
        let collisionY = false;
    
        for (const obj of objects) {
            const testY = {
                tryX: this.x, // usa x aggiornata
                tryY: this.tryY,
                width: this.width,
                height: this.height,
                crashWith: this.crashWith
            };
            if (this.crashWith.call(testY, obj)) {
                collisionY = true;
                break;
            }
        }
    
        if (!collisionY) {
            this.y = this.tryY;
        } else {
            this.gravitySpeed = 0;
        }
    
        // Controlla bordi canvas
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > myGameArea.canvas.width)
            this.x = myGameArea.canvas.width - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > myGameArea.canvas.height) {
            this.y = myGameArea.canvas.height - this.height;
            this.gravitySpeed = 0;
        }
    
        // Gestione animazione
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
    }
};