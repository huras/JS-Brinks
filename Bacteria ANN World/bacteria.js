class Bacteria {
  constructor(id) {
    this.id = id;
    this.nn = new NeuralNetwork(11, 4, 3);

    this.radius = 5;
    this.x = 0;
    this.y = 0;
    this.rotation = 180;
    this.alive = true;
    this.age = 0;

    this.lastTurnSide = 0;
    this.rightTurningStrenght = 1;
    this.leftTurningStrenght = 1;
    this.lastInput = undefined;

    this.initialFood = 120;
    this.food = this.initialFood;
  }

  clone(id = undefined) {
    if (id == undefined) id = this.id;
    let retorno = new Bacteria(id);
    retorno.nn = this.nn.clone();
    return retorno;
  }

  die() {
    this.alive = false;
    this.svg = document.querySelector("[bacteriaid=b" + this.id + "]");
    this.svg.style.display = "none";
  }

  revive() {
    this.age = 0;
    this.alive = true;
    this.x = this.radius * 4; // + this.radius + this.radius * 3 * this.id;
    this.y = this.radius * 4; // + this.radius;
    this.svg = document.querySelector("[bacteriaid=b" + this.id + "]");
    this.svg.style.display = "flex";
    this.rightTurningStrenght = 1;
    this.leftTurningStrenght = 1;
    this.rotation = 0;
    this.food = this.initialFood;
  }

  createSVG(svg) {
    let circle = document.createElement("circle");
    circle.setAttribute("bacteriaid", "b" + this.id);

    this.svg = circle;
    return this.svg;
  }

  mutate(maxFactor = 0.2, mutationChance = 1) {
    this.nn.mutate(maxFactor);
  }

  behave() {
    if (!this.alive) return;

    this.age++;

    let input = this.getInput();
    let output = this.nn.feedforward(input);
    this.lastInput = input;
    this.readOutput(output);
    this.lastOutput = output;
  }

  checkFoodLevels() {
    if (this.food <= 1) {
      this.die();
    }
  }

  paint(color) {
    let svg = document.querySelector("[bacteriaid=b" + this.id + "]");
    svg.style.fill = color;
  }

  getInput() {
    let input = [];

    let maximumDistancePossible = Math.pow(
      Math.pow(ENGINE_WIDTH, 2) + Math.pow(ENGINE_HEIGHT, 2),
      0.5
    );
    let topLeftCornerDist = Math.pow(
      Math.pow(this.x, 2) + Math.pow(this.y, 2),
      0.5
    );
    let bottomLeftCornerDist = Math.pow(
      Math.pow(this.x, 2) + Math.pow(ENGINE_HEIGHT - this.y, 2),
      0.5
    );
    let topRightCornerDist = Math.pow(
      Math.pow(ENGINE_WIDTH - this.x, 2) + Math.pow(this.y, 2),
      0.5
    );
    let bottomRightCornerDist = Math.pow(
      Math.pow(ENGINE_WIDTH - this.x, 2) + Math.pow(ENGINE_HEIGHT - this.y, 2),
      0.5
    );

    input.push(this.rotation / 360);
    input.push(1 - topLeftCornerDist / maximumDistancePossible);
    input.push(1 - bottomLeftCornerDist / maximumDistancePossible);
    input.push(1 - topRightCornerDist / maximumDistancePossible);
    input.push(1 - bottomRightCornerDist / maximumDistancePossible);
    input.push(topLeftCornerDist / maximumDistancePossible);
    input.push(bottomLeftCornerDist / maximumDistancePossible);
    input.push(topRightCornerDist / maximumDistancePossible);
    input.push(bottomRightCornerDist / maximumDistancePossible);
    input.push(this.rightTurningStrenght);
    input.push(this.leftTurningStrenght);

    return input;
  }
  readOutput(output) {
    const canAccelerate = false;

    if (output[0] > output[1]) {
      if (output[0] >= 0.5) {
        this.rotation += this.rightTurningStrenght * 3;
        if (this.lastTurnSide == 1) {
          this.rightTurningStrenght -= 0.006;
        }
        this.lastTurnSide = 1;
        this.leftTurningStrenght += 0.0002;
      }
    } else {
      if (output[1] >= 0.5) {
        this.rotation -= this.leftTurningStrenght * 3;
        if (this.lastTurnSide == -1) {
          this.leftTurningStrenght -= 0.006;
        }
        this.lastTurnSide = -1;
        this.rightTurningStrenght += 0.002;
      }
    }

    if (this.rightTurningStrenght > 1) {
      this.rightTurningStrenght = 1;
    } else if (this.rightTurningStrenght < 0) {
      this.rightTurningStrenght = 0;
    }
    if (this.leftTurningStrenght > 1) {
      this.leftTurningStrenght = 1;
    } else if (this.leftTurningStrenght < 0) {
      this.leftTurningStrenght = 0;
    }

    if (this.rotation > 360) {
      this.rotation = 360 - this.rotation;
    } else if (this.rotation < 0) {
      this.rotation = 360 + this.rotation;
    }

    let degreesInRadians = (this.rotation * Math.PI) / 180;

    if (!canAccelerate) {
      output[1] = 1;
    } else {
      output[1] = 0.5 + output[1] / 2;
    }

    if (this.consumeFood(output[1] / 15)) {
      this.x += Math.sin(degreesInRadians) * output[1];
      this.y += Math.cos(degreesInRadians) * output[1];
    } else {
      this.consumeFood(1 / 30);
    }
  }

  consumeFood(amount) {
    let retorno = false;

    if (this.food >= amount) {
      retorno = true;
    }

    if (retorno) {
      this.food -= amount;
    } else {
      this.die();
    }

    return retorno;
  }

  render() {
    this.svg = document.querySelector("[bacteriaid=b" + this.id + "]");

    this.svg.setAttribute("cx", this.x);
    this.svg.setAttribute("cy", this.y);
    this.svg.setAttribute("r", this.radius);
  }
}
