class World {
  constructor(xSize, zSize) {
    this.xSize = xSize;
    this.zSize = zSize;
    this.terrain = this.newEmptyTerrain(xSize, zSize);
    World.generateVillages(this);
  }

  newEmptyTerrain(xSize, zSize) {
    let terrain = [];
    for (let i = 0; i < xSize; i++) {
      terrain[i] = [];
      for (let j = 0; j < zSize; j++) {
        terrain[i][j] = " ";
      }
    }

    // console.log(World.generateVillages(terrain));
    return terrain;
  }

  static generateVillages(world) {
    let villageSize = Math.random() * 3 + 3;
    let villageI = Math.floor(Math.random() * (world.xSize - villageSize));
    let villageJ = Math.floor(Math.random() * (world.zSize - villageSize));

    for (
      let i = villageI;
      i <= villageI + villageSize && i < world.xSize;
      i++
    ) {
      for (
        let j = villageJ;
        j <= villageJ + villageSize && j < world.zSize;
        j++
      ) {
        world.terrain[i][j] = "v";
      }
    }
  }

  static spawnHero(world) {}
}

function start() {
  world = new World(25, 25);
  console.table(world.terrain);
}

start();
