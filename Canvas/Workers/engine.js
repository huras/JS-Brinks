class Engine {
  constructor() {
    this.drawables = [];

    var canvas = document.getElementById("tutorial");
    if (canvas.getContext("2d")) {
      var ctx = canvas.getContext("2d");
      window.ctx = ctx;

      var myTimer = setInterval(this.loop, 20, this);
    }
  }

  insertDrawable(drawable) {
    this.drawables.push(drawable);
  }

  loop(engine) {
    for (let i = 0; i < engine.drawables.length; i++) {
      let drawable = engine.drawables[i];
      drawable.draw();
    }
  }

  static start() {
    let engine = new Engine();
    let arvore = new Tree();
    engine.insertDrawable(arvore);
    console.log(engine);
  }
}
