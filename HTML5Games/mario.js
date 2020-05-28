class SpriteCell {
  constructor(x, y, width, height, sheet, delay = 10) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sheet = sheet;
    this.delay = delay;
  }
}

class SpriteAnimation {
  constructor(name, cells) {
    this.name = name;
    this.cells = cells;
  }
}

class SpritePlayer {
  constructor(animations, context, scale = 1) {
    this.animations = animations;
    this.animations.map((animation) => {
      this.animations[animation.name] = animation;
    });
    this.currentAnimation = undefined;
    this.context = context;
    this.scale = scale;
    this.isPlaying = false;
    this.lastPosition = undefined;
    this.playSpeed = 1;
  }

  playAnimation(newAnimation, newPlaySpeed = 1) {
    if (this.animations[newAnimation]) {
      if (this.currentAnimation != this.animations[newAnimation]) {
        this.currentAnimation = this.animations[newAnimation];
        this.delayCounted = 0;
        this.currentFrame = 0;
      }
      this.playSpeed = newPlaySpeed;
      this.isPlaying = true;
    } else {
      console.log("errow");
    }
  }

  render(position, direction) {
    if (this.currentAnimation && this.isPlaying) {
      const currentCell = this.currentAnimation.cells[this.currentFrame];

      this.context.scale(this.scale, this.scale);

      if (this.lastPosition) {
        // Clear the canvas
        this.context.clearRect(
          this.lastPosition.x - currentCell.width / 2,
          this.lastPosition.y - this.lastSize.height,
          this.lastSize.width,
          this.lastSize.height
        );
      }
      this.lastPosition = {
        x: position.x / this.scale,
        y: position.y / this.scale,
      };
      this.lastSize = { width: currentCell.width, height: currentCell.height };

      this.context.scale(-direction, 1);

      // Draw the animation
      this.context.drawImage(
        currentCell.sheet, //source image object
        currentCell.x, //source x
        currentCell.y, //source y
        currentCell.width,
        currentCell.height,
        (position.x / this.scale) * -direction - currentCell.width / 2, //destination x
        position.y / this.scale - currentCell.height, //destination y
        currentCell.width, //destination width
        currentCell.height
      ); //destination height

      // Reset current transformation matrix to the identity matrix
      this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  evolveAnimation() {
    if (this.isPlaying) {
      this.delayCounted += this.playSpeed;
      const currentCell = this.currentAnimation.cells[this.currentFrame];
      if (this.delayCounted >= currentCell.delay) {
        this.nextFrame();
      }
    }
  }

  nextFrame() {
    this.currentFrame++;

    if (this.currentFrame >= this.currentAnimation.cells.length) {
      this.currentFrame = 0;
    }

    this.delayCounted = 0;
  }

  play() {
    this.isPlaying = true;
  }

  pause() {
    this.isPlaying = false;
  }
}

class Koopa {
  idle() {}
  walk() {}
  getShell() {}
  dropShell() {}
  iaControl() {}
  playerControl() {}
}
let Mario = function (marioSheet, context, position = new Vector2(0, 0)) {
  let spriteCells = [
    new SpriteCell(1, 10, 16, 24, marioSheet, 7), //idle
    new SpriteCell(18, 10, 16, 25, marioSheet, 8), //walking
    new SpriteCell(35, 10, 16, 24, marioSheet, 1000), //lookup
    new SpriteCell(52, 18, 16, 16, marioSheet, 1000), //crouching
    new SpriteCell(154, 10, 16, 24, marioSheet, 500), //sliping
    new SpriteCell(69, 10, 16, 24, marioSheet, 500), //jump rising
    new SpriteCell(86, 10, 16, 24, marioSheet, 500), //jump fall
  ];

  let marioIdle = new SpriteAnimation("idle", [spriteCells[0]]);
  let marioWalk = new SpriteAnimation("walk", [spriteCells[0], spriteCells[1]]);
  let marioLookup = new SpriteAnimation("lookup", [spriteCells[2]]);
  let marioCrouch = new SpriteAnimation("crouch", [spriteCells[3]]);
  let marioSliping = new SpriteAnimation("slip", [spriteCells[4]]);
  let marioJumpRise = new SpriteAnimation("jumprise", [spriteCells[5]]);
  let marioJumpFall = new SpriteAnimation("jumpfall", [spriteCells[6]]);
  let animations = [
    marioIdle,
    marioWalk,
    marioLookup,
    marioCrouch,
    marioSliping,
    marioJumpRise,
    marioJumpFall,
  ];

  let spritePlayer = new SpritePlayer(animations, context, 4);

  this.character = new Character(spritePlayer, position);

  this.character.horizontalMovimentation = () => {};

  this.character.idle = () => {};
  this.character.walk = () => {};
  this.character.run = () => {};
  this.character.crouch = () => {};
  this.character.jump = () => {};
  this.character.iaControl = () => {};
  this.character.playerControl = () => {
    // let inputManager = this.character.inputManager;
    // if(inputManager.isPressed(this.keys.left)) {
    //     if(this.speed.x > 0)
    //         this.spritePlayer.playAnimation('slip', speedFactor);
    //     else
    //         this.spritePlayer.playAnimation('walk', speedFactor);
    //     this.speed.x -= accelToUse * (this.speed.x > 0 ? 1.45 : 1);
    //     this.direction = -1;
    // }
    // else if(inputManager.isPressed(this.keys.right)) {
    //     if(this.speed.x < 0)
    //         spritePlayer.playAnimation('slip', speedFactor);
    //     else
    //         spritePlayer.playAnimation('walk', speedFactor);
    //     this.speed.x += accelToUse * (this.speed.x < 0 ? 1.45 : 1);
    //     this.direction = 1;
    // }
  };

  return this.character;
};

const states = {
  IDLE: "idle",
  WALK: "walk",
  RUN: "run",
  JUMP: "jump",
};
class Character {
  constructor(spritePlayer, position, direction = 1) {
    this.spritePlayer = spritePlayer;
    this.position = position;
    this.direction = 1;
    this.speed = new Vector2(0, 0);
    this.accel = 0.045;
    this.maxSpeed = new Vector2(1, 30);
    this.maxSpeedRun = new Vector2(1.95, 3);
    this.isOnGround = false;

    this.inputManager = new InputManager();
    this.keys = this.inputManager.keys;
    this.scaleSpeed = true;
  }

  render() {
    this.control(); //pensar em lugar melhor

    this.spritePlayer.evolveAnimation();
    this.spritePlayer.render(this.position, this.direction);
  }

  control() {
    // Gravity
    if (this.position.y < 600) {
      this.speed.y += 0.2;
    } else {
      this.isOnGround = true;
      this.speed.y = 0;
      this.position.y = 600;
    }
    console.log(this.speed.y);

    if (this.inputManager.isPressed(this.keys.down)) {
      this.spritePlayer.playAnimation("crouch");
      this.speed.scale(0.95, "x");

      if (this.inputManager.isPressed(this.keys.left)) {
        this.direction = -1;
      } else if (this.inputManager.isPressed(this.keys.right)) {
        this.direction = 1;
      }
    } else if (this.inputManager.isPressed(this.keys.up)) {
      this.spritePlayer.playAnimation("lookup");
      this.speed.scale(0.9, "x");

      if (this.inputManager.isPressed(this.keys.left)) {
        this.direction = -1;
      } else if (this.inputManager.isPressed(this.keys.right)) {
        this.direction = 1;
      }
    } else {
      if (
        this.inputManager.isPressed(this.keys.left) ||
        this.inputManager.isPressed(this.keys.right)
      ) {
        let speedFactor = 1;
        let accelToUse = this.accel;

        if (this.inputManager.isPressed(this.keys.run)) {
          speedFactor = 1.6;
          // accelToUse += this.exAccel;
        }

        if (this.inputManager.isPressed(this.keys.left)) {
          if (this.speed.x > 0)
            this.spritePlayer.playAnimation("slip", speedFactor);
          else this.spritePlayer.playAnimation("walk", speedFactor);

          this.speed.x -= accelToUse * (this.speed.x > 0 ? 1.45 : 1);
          this.direction = -1;
        } else if (this.inputManager.isPressed(this.keys.right)) {
          if (this.speed.x < 0)
            this.spritePlayer.playAnimation("slip", speedFactor);
          else this.spritePlayer.playAnimation("walk", speedFactor);

          this.speed.x += accelToUse * (this.speed.x < 0 ? 1.45 : 1);
          this.direction = 1;
        }
      } else {
        this.spritePlayer.playSpeed = 1;
        if (Math.abs(this.speed.x) <= 0.1)
          this.spritePlayer.playAnimation("idle");
        this.speed.scale(0.9, "x");
      }
    }

    if (this.inputManager.isPressed(this.keys.run)) {
      this.speed.clamp(this.maxSpeedRun);
    } else {
      this.speed.clamp(this.maxSpeed);
    }

    this.speed.scale(this.spritePlayer.scale);
    this.position.sum(this.speed);
    this.speed.scale(1 / this.spritePlayer.scale);
  }
}

class SheetLoader {
  constructor(onLoadAllCallBack = undefined) {
    this.sheetsToLoad = [];
    this.sheetsLoaded = 0;
    this.loadAllCallBack = onLoadAllCallBack;
  }

  onLoadSheet() {
    this.sheetsLoaded++;
    if (this.sheetsLoaded >= this.sheetsToLoad.length) {
      if (this.loadAllCallBack) {
        this.loadAllCallBack();
      }
    }
  }

  loadSheet(filepath) {
    const newSheet = new Image();
    newSheet.addEventListener("load", () => {
      this.onLoadSheet();
    });
    newSheet.src = filepath;
    return newSheet;
  }
}

class InputManager {
  constructor(
    keys = { right: 39, left: 37, up: 38, down: 40, run: 88, jump: 67 }
  ) {
    this.keys = keys;

    this.keyData = [];
    this.maxTimeAmount = 5000;

    document.addEventListener("keydown", (event) => {
      if (this.keyData[event.keyCode.toString()]) {
        let keyData = this.keyData[event.keyCode.toString()];
        if (!keyData.isPressed) {
          keyData.time = 0;
          keyData.isPressed = true;
        }
      }
    });

    document.addEventListener("keyup", (event) => {
      if (this.keyData[event.keyCode.toString()]) {
        let keyData = this.keyData[event.keyCode.toString()];
        if (keyData.isPressed) {
          keyData.time = 0;
          keyData.isPressed = false;
        }
      }
    });

    Object.entries(this.keys).forEach(([key, value]) => {
      this.keyData[value.toString()] = {
        isPressed: false,
        last: 0,
        time: 0,
      };
    });

    setInterval(() => {
      this.timeCounter(10);
    }, 10);
  }

  checkKeysUpdate() {
    // this.keyDowns();
    // this.keyUps();
  }

  isPressed(key) {
    if (this.keyData[key.toString()])
      return this.keyData[key.toString()].isPressed;
    else return undefined;
  }

  timeCounter(deltaTime) {
    this.keyData = this.keyData.map((temp) => {
      if (!temp.isPressed) {
        if (temp.last < this.maxTimeAmount) {
          temp.last += deltaTime;
        } else {
          temp.time = this.maxTimeAmount;
        }
      } else {
        if (temp.time < this.maxTimeAmount) {
          temp.time += deltaTime;
        } else {
          temp.time = this.maxTimeAmount;
        }
      }
      return temp;
    });
  }
}

class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  sum(otherVector) {
    this.x += otherVector.x;
    this.y += otherVector.y;
  }

  scale(factor, axis = undefined) {
    if (axis == "x" || axis == undefined) this.x *= factor;
    if (axis == "y" || axis == undefined) this.y *= factor;
  }

  clamp(max) {
    if (Math.abs(this.x) > max.x) this.x = max.x * Math.sign(this.x);

    if (Math.abs(this.y) > max.y) this.y = max.y * Math.sign(this.y);
  }

  clamp(max) {
    if (Math.abs(this.x) > max.x) this.x = max.x * Math.sign(this.x);

    if (Math.abs(this.y) > max.y) this.y = max.y * Math.sign(this.y);
  }
}

class Engine {
  constructor() {
    this.context = canvas.getContext("2d");
    this.characters = [];

    this.teste1();

    window.requestAnimationFrame(() => {
      this.gameLoop();
    });
  }

  teste1() {
    let callBack = () => {
      let mario = new Mario(marioSheet, this.context, new Vector2(20, 32));
      this.characters.push(mario);
    };

    const sheetLoader = new SheetLoader(callBack);
    const marioSheet = sheetLoader.loadSheet("./img/mariotrans.png");
  }

  gameLoop() {
    // console.log('frame');

    this.characters = this.characters.map((character) => {
      character.render();
      return character;
    });

    window.requestAnimationFrame(() => {
      this.gameLoop();
    });
  }

  // onLoadAllSheet () {

  // }
}

// ============================  Tests

// Get canvas
canvas = document.getElementById("coinAnimation");
canvas.width = 800;
canvas.height = 600;

const engine = new Engine();
