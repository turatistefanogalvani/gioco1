function startGame() {
    myGamePiece.loadImages(running);
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

    update: function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.contaFrame++;
        if (this.contaFrame == 50) { // Change frame every 50 frames
            this.contaFrame = 0;
            this.actualFrame = (this.actualFrame + 1) % this.imageList.length;
            this.image = this.imageList[this.actualFrame];
        }
    },

    loadImages: function(running) {
        console.log("prova");
        for (let imgPath of running) {
            var img = new Image();
            img.src = imgPath;
            this.imageList.push(img);
        }
        this.image = this.imageList[this.actualFrame];
    }
};

var myGameArea = {
    canvas: document.createElement("canvas"),
    context: null,
    interval: null,

    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 1); // Update game every 20ms
    },

    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    drawGameObject: function (gameObject) {
        this.context.drawImage(
            gameObject.image,
            gameObject.x,
            gameObject.y,
            gameObject.width,
            gameObject.height
        );
    }
};

var running = ['spirite/Run1.png', 'spirite/Run2.png', 'spirite/Run3.png']; // Example paths for images



function updateGameArea() {
    myGameArea.clear();
    myGamePiece.update();
    myGameArea.drawGameObject(myGamePiece);
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
