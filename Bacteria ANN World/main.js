const ENGINE_HEIGHT = 600;
const ENGINE_WIDTH = 800;
const ENGINE_FPS = 60 * (50 / 10);

function generateNewPopulation(bacteriaMaxPopulation = 1) {
  let bacterias = [];
  for (let i = 0; i < bacteriaMaxPopulation; i++) {
    bacterias.push(new Bacteria(i));
  }
  return bacterias;
}

class LifeSystems {
  constructor(maxPopulation = 1) {
    this.maxFoodPellets = 5;
    this.keepAlivePodium = Math.ceil(maxPopulation / 3);
    this.maxPopulation = maxPopulation;
    this.bacterias = generateNewPopulation(maxPopulation);
    this.bacterias.map(item => {
      item.x = ENGINE_WIDTH / 2 - item.radius; //Math.random() * ENGINE_WIDTH;
      item.y = ENGINE_HEIGHT / 2 - item.radius; //Math.random() * ENGINE_HEIGHT;
    });
    this.foodPieces = this.spawnFood();

    this.engine = new BacteriaWorldEngine(this.bacterias);
    this.engine.setFoodPieces(this.foodPieces);

    this.bestAge = 0;
    this.minimumMutation = 0;

    setInterval(() => {
      this.processGeneration();
    }, (1 / ENGINE_FPS) * 1000);

    this.setGeneration();
  }

  setGeneration() {
    this.engine.startLoop();
    this.processGeneration();
  }

  resetAmbient() {
    let maxAge = 0;
    let worstBacteriaIndex = 0;
    let bestBacteriaIndex = 0;

    // Get best bacterias of the generation
    const cloneBestdBacteriaSystem = true;
    const topThirdBacteriaSystem = false;
    const minimumMutationSystem = false;

    // Reset bacteria colors
    if (this.lastBestBacterias) {
      this.lastBestBacterias.map(bacBest => {
        bacBest.paint("black");
      });
    }
    this.lastBestBacterias = [];

    // PHASE 1 -
    if (topThirdBacteriaSystem) {
      this.bacterias.map((bacteria, index) => {
        if (this.lastBestBacterias.length < this.keepAlivePodium) {
          this.lastBestBacterias.push(bacteria);
        } else {
          let worstAmongTheBest = 0;
          this.lastBestBacterias.map((bacBest, indexj) => {
            if (bacBest.age <= this.lastBestBacterias[worstAmongTheBest].age) {
              worstAmongTheBest = indexj;
            }
          });

          this.lastBestBacterias[worstAmongTheBest] = bacteria;
        }

        // Get best age
        if (bacteria.age > maxAge) {
          maxAge = bacteria.age;
          bestBacteriaIndex = index;
        }

        //Get worst bacteria
        if (bacteria.age <= this.bacterias[worstBacteriaIndex].age)
          worstBacteriaIndex = index;
      });

      // Clone best bacteria and mutates it
      this.bacterias[worstBacteriaIndex].nn = this.bacterias[
        bestBacteriaIndex
      ].nn.clone();
      this.bacterias[worstBacteriaIndex].mutate(0.1, 0.1);

      // Paint the best bacterias
      this.lastBestBacterias.map(bacBest => {
        bacBest.paint("red");
        // if (bacBest.age != maxAge) bacBest.mutate(0.0005, 0.005);
      });
    } else if (cloneBestdBacteriaSystem) {
      // Get best bacteria
      bestBacteriaIndex = 0;
      maxAge = this.bacterias[bestBacteriaIndex].age;
      this.bacterias.map((bacteria, index) => {
        // Get best age
        if (bacteria.age > this.bacterias[bestBacteriaIndex].age) {
          maxAge = bacteria.age;
          bestBacteriaIndex = index;
        }
      });

      this.bacterias[bestBacteriaIndex].paint("red");
      this.lastBestBacterias.push(this.bacterias[bestBacteriaIndex]);

      //make (population - 1) clones of the bacteria
      this.bacterias.map((bacteria, index) => {
        if (index != bestBacteriaIndex) {
          this.bacterias[index] = this.bacterias[bestBacteriaIndex].clone(
            this.bacterias[index].id
          );
        }
      });
    }

    // PHASE 2 - CALCULATE FITNESS
    // Shows best age
    this.bestAge = maxAge;
    console.log("Max age = " + maxAge);
    // console.log("Best bacteria ID " + maxAge);

    // Increase the minimum mutation for bacterias if they aren't getting any better for a long time
    if (minimumMutationSystem) {
      if (this.bestAge) {
        if (this.bestAge == maxAge) {
          this.minimumMutation += 0.003;
        } else {
          this.minimumMutation = 0;
        }
      }
      if (this.minimumMutation > 0.1) this.minimumMutation = 0.1;
    }

    // PHASE - 3 APPLY MUTATION
    if (topThirdBacteriaSystem) {
      // Mutate bad bacterias and revive them
      this.bacterias.map(bacteria => {
        let fitness = bacteria.age / this.bestAge;
        // bacteria.mutate(0.001 + (fitness - 0.999));
        if (
          !this.lastBestBacterias.find(element => {
            return bacteria == element;
          })
        )
          bacteria.mutate(fitness - 1 + this.minimumMutation, 0.3);
        else {
          bacteria.mutate(fitness - 1, 0.01);
        }
      });
    } else if (cloneBestdBacteriaSystem) {
      this.bacterias.map((bacteria, index) => {
        if (index != bestBacteriaIndex) {
          this.bacterias[index].mutate(0.5, 0.33);
        }
      });
    }

    // PHASE 4 - Ressurection
    this.bacterias.map(bacteria => {
      bacteria.revive();
    });
  }

  spawnFood() {
    let foodPieces = [];

    while (foodPieces.length < this.maxFoodPellets) {
      foodPieces.push(new FoodPiece());
    }

    return foodPieces;
  }

  processGeneration() {
    this.spawnFood();
    this.engine.loop();
    this.killLosers();

    // Resets the game if everybody is dead
    let bacteriasAlive = this.getCurrentAlivePopulation();
    if (bacteriasAlive == 0) {
      this.resetAmbient();
    }
  }

  killLosers(force = false) {
    this.bacterias.map(bacteria => {
      if (
        bacteria.x - bacteria.radius > ENGINE_WIDTH ||
        bacteria.x + bacteria.radius < 0 ||
        bacteria.y - bacteria.radius > ENGINE_HEIGHT ||
        bacteria.y + bacteria.radius < 0 ||
        force
      ) {
        bacteria.die();
      }
    });
  }

  getCurrentAlivePopulation() {
    let count = 0;
    for (let i = 0; i < this.bacterias.length; i++) {
      if (this.bacterias[i].alive == true) {
        count++;
      }
    }

    return count;
  }

  // Interactive functions
  resetAliveBacteriaPositions() {
    lifeSystems.bacterias.map((item, index) => {
      if (item.alive) {
        item.x = ENGINE_WIDTH / 2;
        item.y = ENGINE_HEIGHT / 2;
      }
    });
  }
}

let lifeSystems = null;
function initLife(population = 1) {
  lifeSystems = new LifeSystems(population);
}
initLife(20);
