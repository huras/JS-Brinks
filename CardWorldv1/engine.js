const worldWidth = 10;
const worldHeight = 10;
const slotSize = 50;
let world = new World(worldWidth, worldHeight, slotSize);

let player = new CardInstance(masterDeck.playerCard);
world.placeCard(1, 0, player);

let farmer = new CardInstance(masterDeck.farmerCard);
world.placeCard(3, 4, farmer);

let house = new CardInstance(masterDeck.houseCard, 3, 2);
world.placeCard(3, 3, house);

let village = new CardInstance(masterDeck.villageCard, 7, 7);
world.placeCard(0, 0, village);

let forest = new CardInstance(masterDeck.forestCard, 9, 9);
world.placeCard(0, 0, forest);

world.drawWorld();
