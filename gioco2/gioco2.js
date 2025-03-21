function startGame() {
    myGameArea.start();
    myGameArea.draw(redSquare);
    animatedObject.loadImages();
    };

var animatedObject = {
    speedX: 0,
    speedY: 0,
    width: 60,
    height: 60,
    x: 10,
    y: 120,
    imageList: [], //Vettore che conterrà tutte le immagini caricate
    contaFrame: 0, //Tiene conto di quanti frame sono passati
    actualFrame: 0, //Specifica quale frame disegnare
    update: function() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.contaFrame++;
      if (this.contaFrame == 50) {
        this.contaFrame = 0;
        this.actualFrame = (1 + this.actualFrame) % this.imageList.length;
        //console.log(this.actualFrame);
              this.image = this.imageList[this.actualFrame];
    }
  },

  loadImages: function() {
     for (imgPath of running) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.imageList.push(img);
      //console.log(img);
    }
    this.image = this.imageList[this.actualFrame];
  },

  loadImages: function() {
    this.image = new Image(this.width, this.height);
    this.image.src = "gioco2/sprite/Run1"; //Qui metti una tua immagine
    }
};
      


function updateGameArea() {
    myGameArea.clear();
    myGameArea.draw(redSquare);
    myGameArea.drawGameObject(animatedObject);
    //myGameArea.drawGameObject(animatedObject);
  };

var redSquare = {
    width: 20,
    height: 20,
    x: 10,
    y: 120,
    color: "red"
};

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    draw: function(component) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fillStyle = component.color;
        this.context.fillRect(component.x, component.y, component.width, component.height);
    },
    drawGameObject: function(gameObject) {
        this.context.drawImage(
          gameObject.image,
          gameObject.x,
          gameObject.y,
          gameObject.width,
          gameObject.height
        );
    }
};

function moveup() {
    redSquare.y -= 30;
}
  
function movedown() {
    redSquare.y += 30;
}
  
function moveleft() {
    redSquare.x -= 30;
}
  
function moveright() {
    redSquare.x += 30;
}
