class BacteriaWorldEngine {
  constructor(bacterias, width = ENGINE_WIDTH, height = ENGINE_HEIGHT) {
    this.width = width;
    this.height = height;

    this.bacterias = bacterias;
    this.foodPieces = [];

    // Prepare SVG
    let svgContainer = document.getElementById("engine-screen");
    this.svgContainer = svgContainer;

    let svg = document.createElement("svg");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.setAttribute("version", "1.1");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    this.svg = svg;
    svgContainer.appendChild(this.svg);

    this.firstRender();
    this.startLoop();
  }

  setFoodPieces(pieces) {
    this.foodPieces = pieces;
  }

  startLoop() {
    // Set loop
    this.loop();
  }

  loop() {
    this.behaveAll();
    this.render();
    // console.log("loop");
  }

  // Behaviour control
  behaveAll() {
    this.bacterias.map(bacteria => {
      bacteria.behave();
    });
    this.foodPieces.map(item => {
      item.behave();
    });
  }

  // Rendering
  firstRender() {
    this.renderBacterias();
    this.render();
  }

  render() {
    for (let i = 0; i < this.bacterias.length; i++) {
      this.bacterias[i].render();
    }
    this.svgContainer.innerHTML += "";
  }

  renderBacterias() {
    for (let i = 0; i < this.bacterias.length; i++) {
      let bacteriaSVG = this.bacterias[i].createSVG();
      this.svg.appendChild(bacteriaSVG);
    }
  }
}
