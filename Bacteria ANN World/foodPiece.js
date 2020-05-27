class FoodPiece {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.respawnDelay = 75;
    this.respawnCount;
    this.alive = true;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  behave() {
    if (this.alive) {
    }
  }

  respawn() {}

  getEated() {
    this.respawnCount = 0;
  }
}
