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
    }

    draw() {
        var circle = new Path2D();
        circle.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.fill;
        this.ctx.fill(circle);
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
        return Math.sqrt(Math.pow(x1 - x2, 2), Math.pow(y1 - y2, 2));
    }

    walk(xSteps, ySteps) {
        this.speed = {
            x: this.speed.x + xSteps * this.accel,
            y: this.speed.y + ySteps * this.accel
        };
    }

    inertia(steps) {
        let maxSpeed = 5;
        if(this.speed.x > maxSpeed){
            this.speed.x = maxSpeed;
        } else if(this.speed.x < -maxSpeed){
            this.speed.x = -maxSpeed;
        }

        if(this.speed.y > maxSpeed){
            this.speed.y = maxSpeed;
        } else if(this.speed.y < -maxSpeed){
            this.speed.y = -maxSpeed;
        }

        this.x += steps * this.speed.x;
        this.y += steps * this.speed.y;
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
            console.log(closestUnitData.distance);
            if (
                closestUnitData.distance <=
                this.size / 2
            ) {
                window.mundo.consumeFood(closestUnitData.closestUnit);
            }
        }
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
    }

    draw() {
        var circle = new Path2D();
        circle.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.fill;
        this.ctx.fill(circle);
    }
}

class Mundo{
    constructor(individuos){
        this.units = this.generateUnits(individuos);
        this.foods = [];
        
        this.createFood();
    }

    generateUnits(amount){
        let units = [];
        for (let i = 0; i < amount; i++) {
            const u = new Unit(
              ctx,
              Math.random() * 800,
              Math.random() * 600,
              "rgb(" +
                Math.random() * 255 +
                "," +
                Math.random() * 255 +
                "," +
                Math.random() * 255 +
                ")",
              15 + Math.random() * 18,
              0.25 + Math.random() / 2
            );
            units.push(u);
          }
        
        return units;
    }

    createFood(){
        for (let i = 0; i < 10; i++) {
            const u = new Food(
              ctx,
              Math.random() * 800,
              Math.random() * 600,
              "rgb(34, 177, 76)",
              5 + Math.random() * 1,
            );
            this.foods.push(u);
          }
    }

    consumeFood(food){
        this.foods.map((item, index) => {
            if (item == food){
                this.foods.splice(index, 1);
            }
        })
    }

    step(){
        this.runFood();
        this.runUnits();
    }

    runUnits(){
        let lala = 0;
        this.units.map(item => {
            lala++;
            let closestUnitData = item.findClosestFoodpiece(this.foods);
            if (closestUnitData.closestUnit && (lala % 2) != 0) {
                let xSteps = 0,
                ySteps = 0;

                if (closestUnitData.closestUnit.x < item.x) {
                    xSteps--;
                } else if (closestUnitData.closestUnit.x > item.x) {
                    xSteps++;
                }

                if (closestUnitData.closestUnit.y < item.y) {
                    ySteps--;
                } else if (closestUnitData.closestUnit.y > item.y) {
                    ySteps++;
                }

                item.walk(xSteps, ySteps);
            }
            item.inertia(1);
            item.checkScreenColision(800, 600);
            item.checkUnitCollision(this.units);
            item.checkFoodCollision(this.foods);
            item.draw();
        });
    }
    runFood(){
        this.foods.map(item => {
            item.draw();
        });
    }
}

function loop() {
    window.ctx.fillStyle = "#fff";
    window.ctx.fillRect(0, 0, 800, 600);

    if(mundo)
        mundo.step();
}

let mundo = null;
function start() {
    var canvas = document.getElementById("tutorial");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        window.ctx = ctx;          

        mundo = new Mundo(1);
        window.mundo = mundo;

        var myTimer = setInterval(loop, 20);
    }
}