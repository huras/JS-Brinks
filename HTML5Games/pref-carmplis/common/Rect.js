// ======================================================= Math
class Rect {
  constructor(x, y, w, h, padding, margin, border) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.padding = padding;
    this.margin = margin;
    this.border = border;
  }
}

class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

function DegToRad(d) {
  // Converts degrees to radians
  return d * 0.01745;
}

class Transform {
  constructor(options = {}) {
    this.position = options.position ? options.position : { x: 0, y: 0 };
    this.rotation = options.rotation ? options.rotation : 0;
    this.scale = options.scale ? options.scale : { x: 1, y: 1 };
    this.pivot = options.pivot ? options.pivot : { x: 0, y: 0 };
    this.screenOrigin = options.screenOrigin
      ? options.screenOrigin
      : { x: 0, y: 0 };

    this.parent = undefined;
    this.children = [];
    this.JogoObjecto = undefined;
  }

  addChild(child) {
    if (child.parent) {
      // Desconecta com o parent anterior
      const tempChildOldIndex = child.parent.children.indexOf(child);
      if (tempChildOldIndex >= 0)
        child.parent.children.slice(tempChildOldIndex);

      // Conecta com o parent novo
      child.parent = this;
      if (this.children.indexOf(child) == -1) this.children.push(child);
    }
  }
}

// ================================================== Game Logic

class JogoObjecto {
  constructor(renderer = undefined, transform = new Transform()) {
    this.transform = transform;
    this.transform.JogoObjecto = this;

    this.rederer = renderer;
  }

  render() {
    if (this.renderer) this.renderer.render();
    this.transform.children.map((child) => {
      if (child.JogoObjecto) {
        child.JogoObjecto.render();
      }
    });
  }
}

class SpriteRenderer {
  constructor(frames = []) {
    this.frames = frames;
    this.currentFrame = 0;
  }
  // Handles sprite sheets, capable of animation
  render() {}
}

class Frame {
  constructor(image, sourceRect, transform) {
    this.image = image;
    this.sourceRect = sourceRect;
    this.transform = transform;

    this.showPivot = false;
  }

  currentLogicWidth() {
    return this.sourceRect.w * this.transform.scale.x;
  }

  currentLogicHeight() {
    return this.sourceRect.h * this.transform.scale.y;
  }

  draw(ctx, canvas) {
    // Save the current context
    ctx.save();
    // ctx.imageSmoothingEnabled = false;
    // ctx.msImageSmoothingEnabled = false;
    // ctx.mozImageSmoothingEnabled = false;

    const originPoint = {
      x: canvas.width * this.transform.screenOrigin.x,
      y: canvas.height * this.transform.screenOrigin.y,
    };

    const finalWidth = this.currentLogicWidth();
    const finalHeight = this.currentLogicHeight();

    const positionOffset = {
      x: this.transform.position.left
        ? this.transform.position.left
        : canvas.width - this.transform.position.right,
      y: this.transform.position.top
        ? this.transform.position.top
        : canvas.height - this.transform.position.bottom,
    };

    const pivotPosition = {
      x: originPoint.x + positionOffset.x,
      y: originPoint.y + positionOffset.y,
    };

    ctx.translate(pivotPosition.x, pivotPosition.y);

    const adjustedPosition = {
      x: -finalWidth * this.transform.pivot.x,
      y: -finalHeight * this.transform.pivot.y,
    };

    ctx.save();

    ctx.rotate(DegToRad(this.transform.rotation));

    let finalRect = {
      x: adjustedPosition.x,
      y: adjustedPosition.y,
      w: finalWidth,
      h: finalHeight,
    };

    ctx.drawImage(
      this.image,
      finalRect.x,
      finalRect.y,
      finalRect.w,
      finalRect.h
    );

    ctx.restore();

    if (this.showPivot) {
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#FF00FF";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();
    }

    ctx.restore();

    return finalRect;
  }
}
