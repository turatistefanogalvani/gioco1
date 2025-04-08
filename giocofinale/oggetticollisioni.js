var myGameArea = {
    canvas: document.createElement("canvas"),
    context: null,
    interval: null,

    start: function() {
        this.canvas.width = 1900;
        this.canvas.height = 570;
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
var bushObject = {
    width: 950,
    height: 50,
    x: 0,
    y: 350,
    image : null,
    loadImages: function() {
        
      this.image = new Image(this.width, this.height);
      this.image.src = "immagini/pavimentogioco.png";
    }
  };

  var bushObjectdue = {
    width: 1050,
    height: 50,
    x: 950,
    y: 350,
    image : null,
    loadImages: function() {
        
      this.image = new Image(this.width, this.height);
      this.image.src = "immagini/pavimentogioco.png";
    }
  };

var crateObject = {
    width: window.innerWidth,
    height: 300,
    x: 0,
    y: 400,
  
    loadImages: function() {
      this.image = new Image(this.width, this.height);
      this.image.src = "immagini/acquafinale.png";
    }
  };

var blockObject = {
    width: 30,
    height: 30,
    x: 400,
    y: 270 - 80,
    image: null,
    loadImages: function() {
        this.image = new Image(this.width, this.height);
        this.image.src = "immagini/bloccogiallo.png"; // Esempio immagine
    }
};

var dueblockObject = {
    width: 30,
    height: 30,
    x: 560,
    y: 150 - 80,
    image: null,
    loadImages: function() {
        this.image = new Image(this.width, this.height);
        this.image.src = "immagini/bloccogiallo.png"; // Esempio immagine
    }
};

var fiveblockObject = {
    width: 150,
    height: 30,
    x: 500,
    y: 270 - 80,
    image: null,
    loadImages: function() {
        this.image = new Image(this.width, this.height);
        this.image.src = "immagini/5_blocchi.png"; // Esempio immagine
    }
};

var tuboUnoObject = {
    width: 50,
    height: 80,
    x: 750,
    y: 350 - 80,
    image: null,
    loadImages: function() {
        this.image = new Image(this.width, this.height);
        this.image.src = "immagini/tubo1.png"; // Esempio immagine
    }
};

var tuboDueObject = {
    width: 50,
    height: 150,
    x: 1150,
    y: 200,
    image: null,
    loadImages: function() {
        this.image = new Image(this.width, this.height);
        this.image.src = "immagini/tubo1.png"; // Esempio immagine
    }
};