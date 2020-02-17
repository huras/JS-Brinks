class Tree {
  constructor() {
    this.transform = new Transform();
  }

  draw() {
    var circle = new Path2D();
    circle.arc(
      this.transform.position.x,
      this.transform.position.y,
      5,
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = "red";
    this.ctx.fill(circle);
  }
}
