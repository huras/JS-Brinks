class Unit {
  constructor(ctx, x, y, fill, size, accel) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.fill = fill;
    this.size = size;
    this.accel = accel;

    this.speed = { x: 0, y: 0 };
    this.bouncyness = 0.0;
    this.fome = 40;
    this.state = "idle";
  }

  draw() {
    var circle = new Path2D();
    circle.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.fill;
    this.ctx.fill(circle);

    ctx.font = "12px Arial";
    ctx.fillText(this.fome.toFixed(2), this.x - 15, this.y + this.size + 15);

    ctx.font = "12px Arial";
    this.ctx.fillStyle = "#fff";
    ctx.fillText(this.size, this.x - this.size + 5, this.y + this.size / 3);
  }

  findClosestUnit(units) {
    let closerD = 1000000,
      closestUnit = null;
    for (let i = 0; i < units.length; i++) {
      let item = units[i];
      if (item != this) {
        let d = this.twoPointDistance(this.x, this.y, item.x, item.y);
        if (d < closerD) {
          closerD = d;
          closestUnit = item;
        }
      }
    }

    return { closestUnit: closestUnit, distance: closerD };
  }

  findClosestFoodpiece(foods) {
    let closerD = 1000000,
      closestUnit = null;
    for (let i = 0; i < foods.length; i++) {
      let item = foods[i];
      let d = this.twoPointDistance(this.x, this.y, item.x, item.y);
      if (d < closerD) {
        closerD = d;
        closestUnit = item;
      }
    }

    return { closestUnit: closestUnit, distance: closerD };
  }

  twoPointDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  walk(xSteps, ySteps) {
    this.speed = {
      x: this.speed.x + xSteps * this.accel,
      y: this.speed.y + ySteps * this.accel
    };
  }

  inertia(steps) {
    let maxSpeed = 3;
    if (this.speed.x > maxSpeed) {
      this.speed.x = maxSpeed;
    } else if (this.speed.x < -maxSpeed) {
      this.speed.x = -maxSpeed;
    }

    if (this.speed.y > maxSpeed) {
      this.speed.y = maxSpeed;
    } else if (this.speed.y < -maxSpeed) {
      this.speed.y = -maxSpeed;
    }

    this.x += steps * this.speed.x;
    this.y += steps * this.speed.y;

    this.speed.x *= 0.9;
    this.speed.y *= 0.9;
  }

  runSystems(steps, world) {
    if (this.state == "hungry") {
      let closestUnitData = this.findClosestFoodpiece(world.foods);
      if (closestUnitData.closestUnit) {
        let xSteps = 0,
          ySteps = 0;

        if (closestUnitData.closestUnit.x < this.x) {
          xSteps--;
        } else if (closestUnitData.closestUnit.x > this.x) {
          xSteps++;
        }

        if (closestUnitData.closestUnit.y < this.y) {
          ySteps--;
        } else if (closestUnitData.closestUnit.y > this.y) {
          ySteps++;
        }

        this.walk(xSteps, ySteps);
      }

      this.checkFoodCollision(world.foods);
    }

    this.inertia(steps);
    this.checkScreenColision(width, height);
    this.draw();

    this.fome += 0.1;

    if (this.fome > 20) {
      this.state = "hungry";
    } else {
      this.state = "idle";
    }

    this.state = "hungry";
  }

  checkUnitCollision(units) {
    let closestUnitData = this.findClosestUnit(units);
    if (closestUnitData.closestUnit) {
      if (
        closestUnitData.distance <=
        this.size / 2 + closestUnitData.closestUnit.size / 2
      ) {
        this.speed.x *= -this.bouncyness;
        this.x -= this.size;
        closestUnit.speed.x *= -this.bouncyness;
        closestUnit.x += closestUnit.size;

        this.speed.y *= -this.bouncyness;
        this.y -= this.size;
        closestUnit.speed.y *= -this.bouncyness;
        closestUnit.y += closestUnit.size;
      }
    }
  }

  checkFoodCollision(foods) {
    let closestUnitData = this.findClosestFoodpiece(foods);
    if (closestUnitData) {
      // console.log(closestUnitData.distance);
      if (closestUnitData.distance <= this.size) {
        window.mundo.consumeFood(closestUnitData.closestUnit, this);
      }
    }
  }

  ingerirNutrientes(valorNutricional) {
    this.fome -= valorNutricional * 5;
    this.size += valorNutricional / 10;
  }

  checkScreenColision(w, h) {
    let jitter = 3;

    if (this.x > w) {
      this.speed.x *= -this.bouncyness;
      this.x = w - Math.random() * jitter;
    }
    if (this.x < 0) {
      this.speed.x *= -this.bouncyness;
      this.x = 0 + Math.random() * jitter;
    }

    if (this.y > h) {
      this.speed.y *= -this.bouncyness;
      this.y = h - Math.random() * jitter;
    }
    if (this.y < 0) {
      this.speed.y *= -this.bouncyness;
      this.y = 0 + Math.random() * jitter;
    }
  }
}

class Food {
  constructor(ctx, x, y, fill, size) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.fill = fill;
    this.size = size;

    this.bouncyness = 0.9;
    this.speed = { x: 0, y: 0 };
  }

  draw() {
    var circle = new Path2D();
    circle.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.fill;
    this.ctx.fill(circle);

    // this.x += (Math.random() - 0.5) * 5;
    // this.y += (Math.random() - 0.5) * 5;
  }

  checkScreenColision(w, h) {
    let jitter = 0;

    if (this.x > w) {
      this.speed.x *= -this.bouncyness;
      this.x = w - Math.random() * jitter;
    }
    if (this.x < 0) {
      this.speed.x *= -this.bouncyness;
      this.x = 0 + Math.random() * jitter;
    }

    if (this.y > h) {
      this.speed.y *= -this.bouncyness;
      this.y = h - Math.random() * jitter;
    }
    if (this.y < 0) {
      this.speed.y *= -this.bouncyness;
      this.y = 0 + Math.random() * jitter;
    }
  }
}

class Mundo {
  constructor(individuos, foods) {
    this.units = this.generateUnits(individuos);
    this.foods = this.generateInitialFood(foods);
  }

  generateUnits(amount) {
    let units = [];
    for (let i = 0; i < amount; i++) {
      const u = new Unit(
        ctx,
        Math.random() * width,
        Math.random() * height,
        "rgb(" +
          Math.random() * 255 +
          "," +
          Math.random() * 255 +
          "," +
          Math.random() * 255 +
          ")",
        5,
        0.5 + Math.random() / 4
      );
      units.push(u);
    }

    return units;
  }

  generateInitialFood(amount) {
    let foods = [];
    for (let i = 0; i < amount; i++) {
      foods.push(this.createNewFood());
    }

    return foods;
  }

  createNewFood() {
    const u = new Food(
      ctx,
      Math.random() * width,
      Math.random() * height,
      "rgb(34, 177, 76)",
      1 + Math.random()
    );
    return u;
  }

  spawnNewFood() {
    this.foods.push(this.createNewFood());
  }

  consumeFood(food, unit) {
    this.foods.map((item, index) => {
      if (item == food) {
        this.foods.splice(index, 1);
        this.spawnNewFood();
        unit.ingerirNutrientes(item.size);
        // unit.size += 0.5;
      }
    });
  }

  step() {
    this.runFood();
    this.runUnits();
  }

  runUnits() {
    let lala = 0;
    this.units.map(item => {
      item.runSystems(1, window.mundo);
    });
  }
  runFood() {
    this.foods.map(item => {
      item.checkScreenColision();
      item.draw();
    });
  }
}

let width = 1024,
  height = 600;
function loop() {
  window.ctx.fillStyle = "#fff";
  window.ctx.fillRect(0, 0, width, height);

  if (mundo) mundo.step();
}

let mundo = null;
function start() {
  var canvas = document.getElementById("tutorial");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    window.ctx = ctx;

    mundo = new Mundo(5, 30);
    window.mundo = mundo;

    var myTimer = setInterval(loop, 20);
  }
}
