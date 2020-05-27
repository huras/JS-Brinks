// Tile
class Tile {
  constructor(cost = 1, content = " ", contentObject = null) {
    this.cost = cost;
    this.content = content;
    this.contentObject = contentObject;
  }

  setContent(newContentObject) {
    if (newContentObject) this.content = newContentObject.character;
    else this.content = " ";

    this.contentObject = newContentObject;
  }
}

let width = 10;
let height = 10;

let tiles = [];
for (let i = 0; i < height; i++) {
  tiles.push([]);
  for (let j = 0; j < width; j++) {
    tiles[i].push(new Tile());
  }
}

// Units
class Unit {
  constructor(x, y, character = "♠") {
    this.x = x;
    this.y = y;
    this.character = character;
  }
}

class Mapa {
  constructor(tiles, units) {
    this.width = tiles[0].length;
    this.height = tiles.length;
    this.tiles = tiles;
    this.units = units;

    this.initTiles();
  }

  initTiles() {
    this.units.map(unit => {
      this.tiles[unit.y][unit.x].content = unit.character;
      this.tiles[unit.y][unit.x].setContent(unit);
    });
  }

  moveUnit(unit, direction) {
    let moved = false;
    let distanceWalked = { x: 0, y: 0 };
    if (direction == "up") {
      distanceWalked.y--;
    } else if (direction == "down") {
      distanceWalked.y++;
    } else if (direction == "left") {
      distanceWalked.x--;
    } else if (direction == "right") {
      distanceWalked.x++;
    }

    let newPosition = {
      x: unit.x + distanceWalked.x,
      y: unit.y + distanceWalked.y
    };
    if (
      newPosition.x >= 0 &&
      newPosition.x < this.width &&
      newPosition.y >= 0 &&
      newPosition.y < this.height &&
      tiles[newPosition.y][newPosition.x].content == " "
    ) {
      moved = true;
    }

    if (moved) {
      // tiles[unit.y][unit.x] = " ";
      tiles[unit.y][unit.x].setContent(null);

      unit.x += distanceWalked.x;
      unit.y += distanceWalked.y;

      tiles[unit.y][unit.x].setContent(unit);
    }
  }

  draw() {
    let desenho = [];
    for (let i = 0; i < height; i++) {
      desenho.push([]);
      for (let j = 0; j < width; j++) {
        desenho[i].push(tiles[i][j].content);
      }
    }

    console.table(desenho);
  }

  loop() {
    this.moveUnit(units[0], "down");
    this.moveUnit(units[1], "left");
    this.moveUnit(units[2], "left");
    this.draw();
  }
}

let unit1 = new Unit(1, 0, "▲");
let unit2 = new Unit(9, 3);
let unit3 = new Unit(8, 8);

let units = [unit1, unit2, unit3];

let map = new Mapa(tiles, units);

function test1() {
  // Tests
  let inicio = { x: 0, y: 3 };
  for (let i = inicio.y; i < inicio.y + 3; i++) {
    for (let j = inicio.x; j < inicio.x + 3; j++) {
      tiles[i][j].content = "■";
    }
  }
}

function myLoop() {
  map.loop();
}

test1();

setInterval(() => {
  myLoop();
}, 1000);

map.draw();
// map.moveUnit(unit1, "down");
// map.draw();
