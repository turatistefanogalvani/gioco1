var myGameArea = {
    canvas: document.createElement("canvas"),
    context: null,
    interval: null,
    keys: [],
    backgroundX: 0,
    backgroundSpeed: 1,

    start: function() {
        this.canvas.width = 1900;
        this.canvas.height = 570;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 1); // Update game every 20ms
        window.addEventListener("keydown", function(e) {
            myGameArea.keys[e.key] = true;
        });
        window.addEventListener("keyup", function(e) {
            myGameArea.keys[e.key] = false;
        });
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