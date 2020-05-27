// ===============================================================================
// ===============================================================================
// ===============================================================================

class Slot {
  constructor(x, y, slotSize) {
    this.slotSize = slotSize;
    this.x = x;
    this.y = y;
    this.zoneCards = [];
    this.areaCards = [];
    this.characterCards = [];
    this.cardsGraphics = [];
  }

  drawSlot() {
    const newSlot = document.createElement("div");
    newSlot.classList.add("slot");
    newSlot.style.position = "absolute";
    newSlot.style.left = this.x * this.slotSize + "px";
    newSlot.style.top = this.y * this.slotSize + "px";
    newSlot.style.width = this.slotSize + "px";
    newSlot.style.height = this.slotSize + "px";
    newSlot.style.borderStyle = "solid";
    newSlot.style.borderColor = "black";
    newSlot.style.borderWidth = "1px";

    const slotContents = document.createElement("div");
    slotContents.classList.add("slot-contents");
    slotContents.style.position = "relative";
    newSlot.appendChild(slotContents);
    this.slotContents = slotContents;

    const hoverInfo = document.createElement("div");
    hoverInfo.style.display = "none";
    hoverInfo.classList.add("slot-hoverInfo");
    hoverInfo.style.position = "absolute";
    hoverInfo.style.left = "calc(50px + 4px)";
    hoverInfo.style.top = "calc(50px + 4px)";
    slotContents.appendChild(hoverInfo);

    // Mouse hover
    newSlot.addEventListener("mouseenter", () => {
      hoverInfo.style.display = "flex";
      let infoString =
        "<div class='total'> Cards: " +
        (this.characterCards.length +
          this.areaCards.length +
          this.zoneCards.length) +
        "</div>";

      infoString += '<div class="card-details"> ';
      this.characterCards.map(card => {
        infoString += '<div class="slot"> ';
        infoString += card.card.name;
        infoString += "</div>";
      });
      this.areaCards.map(card => {
        infoString += '<div class="slot"> ';
        infoString += card.card.name;
        infoString += "</div>";
      });
      this.zoneCards.map(card => {
        infoString += '<div class="slot"> ';
        infoString += card.card.name;
        infoString += "</div>";
      });
      infoString += "</div>";

      hoverInfo.innerHTML = infoString;
    });
    newSlot.addEventListener("mouseleave", () => {
      hoverInfo.style.display = "none";
    });

    newSlot.addEventListener("click", () => {
      console.log(this);
    });
    document.getElementById("world").appendChild(newSlot);
    this.graphics = newSlot;

    this.updateGraphics();
  }

  updateGraphics() {
    if (this.cardsGraphics.length > 0) {
      this.cardsGraphics.map(item => {
        item.parentElement.remove(item);
      });
    }

    this.characterCards.map((card, i) => {
      const element = document.createElement("div");
      element.classList.add("creature-card");
      element.style.left = 8 + i * 5 + "px";
      element.style.top = "16px";
      element.style.zIndex = "12";
      this.slotContents.appendChild(element);
    });

    if (this.areaCards.length > 0) {
      const element = document.createElement("div");
      element.classList.add("area-card");
      element.style.width = "50px";
      element.style.height = "50px";
      element.style.backgroundColor = "#fba9a9";
      element.style.zIndex = "11";
      this.slotContents.appendChild(element);
    }

    if (this.zoneCards.length > 0) {
      const element = document.createElement("div");
      element.classList.add("zone-card");
      element.style.width = "50px";
      element.style.height = "50px";
      element.style.backgroundColor = "#c0efc0";
      element.style.zIndex = "10";
      this.slotContents.appendChild(element);
    }
  }

  setCard(cardInstance) {
    switch (cardInstance.card.type) {
      case "creature":
        {
          this.characterCards.push(cardInstance);
        }
        break;
      case "area":
        {
          this.areaCards.push(cardInstance);
        }
        break;
      case "zone":
        {
          this.zoneCards.push(cardInstance);
        }
        break;
    }
  }
}

class World {
  constructor(width, height, slotSize) {
    this.slots = [];
    for (let i = 0; i < worldHeight; i++) {
      this.slots.push([]);
      for (let j = 0; j < worldHeight; j++) {
        this.slots[i].push(new Slot(j, i, slotSize));
      }
    }

    this.slotSize = slotSize;
  }

  placeCard(x, y, cardInstance) {
    for (let i = 0; i < cardInstance.card.height; i++) {
      for (let j = 0; j < cardInstance.card.width; j++) {
        this.slots[i + y][j + x].setCard(cardInstance);
      }
    }
  }

  drawWorld() {
    // const c = document.getElementById("myCanvas");
    // const ctx = c.getContext("2d");
    // for (let i = 0; i < worldHeight; i++) {
    //   for (let j = 0; j < worldHeight; j++) {
    //     ctx.beginPath();
    //     ctx.rect(
    //       j * this.slotSize,
    //       i * this.slotSize,
    //       this.slotSize,
    //       this.slotSize
    //     );
    //     ctx.stroke();
    //   }
    // }

    for (let i = 0; i < worldHeight; i++) {
      for (let j = 0; j < worldHeight; j++) {
        this.slots[i][j].drawSlot();
      }
    }
  }
}

// ===============================================================================
// ===============================================================================
// ===============================================================================

class Card {
  constructor(name = "-", description = "", picture = "", type, w = 1, h = 1) {
    this.name = name;
    this.description = description;
    this.picture = picture;
    this.type = type;
    this.width = w;
    this.height = h;
  }
}

let masterDeck = {};

let createCardLibrary = () => {
  masterDeck.forestCard = new Card("Forest", "Uma floresta.", "", "zone");

  masterDeck.villageCard = new Card(
    "Village",
    "Uma área controlada por um prefeito, contendo casas e um castelo.",
    "",
    "zone"
  );

  masterDeck.houseCard = new Card(
    "House",
    "Uma área que fornece conforto e segurança de médio nível para um certo número de criaturas.",
    "",
    "area",
    2,
    2
  );

  masterDeck.playerCard = new Card(
    "Player",
    "O jogador. The chosen one",
    "",
    "creature"
  );

  masterDeck.farmerCard = new Card(
    "Farmer",
    "Knows how to create and cultivate plantations, harvest plants and domesticate animals.",
    "",
    "creature"
  );
};

createCardLibrary();

// ===============================================================================
// ===============================================================================
// ===============================================================================

class CardInstance {
  constructor(card, w = null, h = null) {
    this.card = card;
    if (w != null) {
      this.card.width = w;
    }
    if (h != null) {
      this.card.height = h;
    }
  }
}

let runGameTurn = () => {};
