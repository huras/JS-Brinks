
var coin,
    coinImage,
    canvas;					

function gameLoop () {

    window.requestAnimationFrame(gameLoop);

    coin.update();
    coin.render();
}

function sprite (options) {

    var that = {},
        frameIndex = 0,
        tickCount = 0,
        ticksPerFrame = options.ticksPerFrame || 0,
        numberOfFrames = options.numberOfFrames || 1,
        xGordura = options.xGordura || 0;
    
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    
    that.update = function () {

        tickCount += 1;

        if (tickCount > ticksPerFrame) {

            tickCount = 0;
            
            // If the current frame index is in range
            if (frameIndex < numberOfFrames - 1) {	
                // Go to the next frame
                frameIndex += 1;
            } else {
                frameIndex = 0;
            }
        }
    };
    
    that.render = function () {
    
        // Clear the canvas
        that.context.clearRect(0, 0, that.width, that.height);

        const tileScale = 4;
        
        // Draw the animation
        that.context.drawImage(
        that.image,
        frameIndex * (that.width / numberOfFrames + xGordura),
        0,
        that.width / numberOfFrames,
        that.height,
        0,
        0,
        that.width / numberOfFrames * tileScale,
        that.height * tileScale);
    };
    
    return that;
}

// Get canvas
canvas = document.getElementById("coinAnimation");
canvas.width = 100;
canvas.height = 100;

// Create sprite sheet
coinImage = new Image();	

// Create sprite
coin = sprite({
    context: canvas.getContext("2d"),
    width: 32,
    height: 20,
    image: coinImage,
    numberOfFrames: 2,
    ticksPerFrame: 10,
    xGordura: 0
});

// Load sprite sheet
coinImage.addEventListener("load", gameLoop);
coinImage.src = "img/mariow.png";


