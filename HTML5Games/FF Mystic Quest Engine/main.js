var canvas = document.querySelector('#canvas');
canvas.width = 800;
canvas.height = 600;
var ctx = canvas.getContext("2d");

var resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
};
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
});

// =================================== Collision

// POLYGON/POLYGON
function polyPoly(p1, p2) {
  // go through each of the vertices, plus the next
  // vertex in the list
  var next = 0;
  for (var current = 0; current < p1.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == p1.length) next = 0;

    // get the PVectors at our current position
    // this makes our if statement a little cleaner
    var vc = p1[current]; // c for "current"
    var vn = p1[next]; // n for "next"

    // now we can use these two points (a line) to compare
    // to the other polygon's vertices using polyLine()
    var collision = polyLine(p2, vc.x, vc.y, vn.x, vn.y);
    if (collision) return true;

    // optional: check if the 2nd polygon is INSIDE the first
    // collision = polyPoint(p1, p2[0].x, p2[0].y);
    // if (collision) return true;
  }

  return false;
}

// POLYGON/LINE
function polyLine(vertices, x1, y1, x2, y2) {
  // go through each of the vertices, plus the next
  // vertex in the list
  var next = 0;
  for (var current = 0; current < vertices.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == vertices.length) next = 0;

    // get the PVectors at our current position
    // extract X/Y coordinates from each
    var x3 = vertices[current].x;
    var y3 = vertices[current].y;
    var x4 = vertices[next].x;
    var y4 = vertices[next].y;

    // do a Line/Line comparison
    // if true, return 'true' immediately and
    // stop testing (faster)
    const hit = lineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (hit) {
      return true;
    }
  }

  // never got a hit
  return false;
}

// LINE/LINE
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  // calculate the direction of the lines
  var uA =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  var uB =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  }
  return false;
}

// POLYGON/POINT
// used only to check if the second polygon is
// INSIDE the first
function polyPoint(vertices, px, py) {
  var collision = false;

  // go through each of the vertices, plus the next
  // vertex in the list
  var next = 0;
  for (var current = 0; current < vertices.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == vertices.length) next = 0;

    // get the PVectors at our current position
    // this makes our if statement a little cleaner
    var vc = vertices[current]; // c for "current"
    var vn = vertices[next]; // n for "next"

    // compare position, flip 'collision' variable
    // back and forth
    if (
      ((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
      px < ((vn.x - vc.x) * (py - vc.y)) / (vn.y - vc.y) + vc.x
    ) {
      collision = !collision;
    }
  }
  return collision;
}

// RECTANGLE/RECTANGLE
function rectRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
  // are the sides of one rectangle touching the other?

  if (
    r1x + r1w >= r2x && // r1 right edge past r2 left
    r1x <= r2x + r2w && // r1 left edge past r2 right
    r1y + r1h >= r2y && // r1 top edge past r2 bottom
    r1y <= r2y + r2h
  ) {
    // r1 bottom edge past r2 top
    return true;
  }
  return false;
}

// =================================== Engine Classes

class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

// =================================== Funções

function DegToRad(d) {
  // Converts degrees to radians
  return d * 0.01745;
}

var loadTextFile = function (fileName, callbackFunction) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status !== 200) {
      alert("loading failed ");
    }
  };
  req.onload = function () {
    var fileContent = null;
    fileContent = req.responseText;

    if (callbackFunction !== null && callbackFunction !== undefined) {
      callbackFunction(fileContent);
    }
  };

  req.open("GET", fileName, true);
  req.setRequestHeader("Content-Type", "text/xml");
  req.send();
};

// ==================================== Desenhar quadradinhos

// class Tile{
//   constructor(width, height, data){
//     this.width = width;
//     this.height = height;
//     this.data = data;
//   }

//   get
// }

this.rectColliderObbjects = [
  "chest",
  "rock",
  "obstacle-tree",
  "save-crystal",
  "quest-chest",
  "sprite-collider",
];
class MapReader {
  constructor() { }

  load(filepath) {
    this.filepath = filepath;
    this.read();
  }

  read() {
    // For reading .txt file code block
    loadTextFile(this.filepath, (fileString) => {
      var parser, xmlDoc;

      parser = new DOMParser();
      xmlDoc = parser.parseFromString(fileString, "text/xml");

      this.layers = [];
      for (var layer of xmlDoc.querySelectorAll("layer")) {
        var props = layer.querySelectorAll("properties");
        var properties = {};
        for (var prop of props) {
          var tempProps = prop.querySelectorAll("property");

          for (var tProp of tempProps) {
            const key = tProp.getAttribute("name");
            const value = JSON.parse(tProp.getAttribute("value"));

            properties[key] = value;
          }
        }

        var newLayer = {
          width: parseInt(layer.getAttribute("width")),
          height: parseInt(layer.getAttribute("height")),
          data: JSON.parse("[" + layer.querySelector("data").innerHTML + "]"),
          properties: properties,
        };
        this.layers.push(newLayer);
      }

      this.layers = this.layers.sort((a, b) => {
        if (a.properties["z-index"] && b.properties["z-index"]) {
          if (a.properties["z-index"] < b.properties["z-index"]) return -1;
          else if (a.properties["z-index"] > b.properties["z-index"]) return 1;
          else return 0;
        } else {
          return 0;
        }
      });

      this.tilesets = [];
      for (var tileset of xmlDoc.querySelectorAll("tileset")) {
        var image = tileset.querySelector("image");
        var newTileset = {
          width: parseInt(image.getAttribute("width")),
          height: parseInt(image.getAttribute("height")),
          columns: parseInt(tileset.getAttribute("columns")),
          tileSize: new Vector2(
            parseInt(tileset.getAttribute("tilewidth")),
            parseInt(tileset.getAttribute("tileheight"))
          ),
          image: new Image(),
          imageLoaded: false,
          firstgid: parseInt(tileset.getAttribute("firstgid")),
          tilecount: parseInt(tileset.getAttribute("tilecount")),
        };
        newTileset.image.addEventListener("load", () => {
          newTileset.imageLoaded = true;
        });
        newTileset.image.src = "./res/" + image.getAttribute("source");

        this.tilesets.push(newTileset);
      }

      this.objectgroups = [];
      for (var objectgroup of xmlDoc.querySelectorAll("objectgroup")) {
        var newObjectGroup = [];

        for (var object of objectgroup.querySelectorAll("object")) {
          var tempType = object.getAttribute("type");
          var tempX = parseInt(object.getAttribute("x"));
          var tempY = parseInt(object.getAttribute("y"));
          var tempW = parseInt(object.getAttribute("width"));
          var tempH = parseInt(object.getAttribute("height"));
          var newPolyColider = [];

          if (tempType == "poly-collider") {
            var polyline = object.querySelector("polyline");
            var polyLinePoints = polyline
              .getAttribute("points")
              .split(" ")
              .map((point) => {
                const values = point.split(",");
                return {
                  x: tempX + parseFloat(values[0]),
                  y: tempY + parseFloat(values[1]),
                };
              });
            polyLinePoints.splice(polyLinePoints.length - 1, 1);
            newPolyColider = polyLinePoints;
          } else if (
            tempType == "rect-collider" ||
            rectColliderObbjects.indexOf(tempType) != -1
          ) {
            var specialIndex = rectColliderObbjects.indexOf(tempType) != -1;
            var yOffset = 0;
            if (specialIndex) {
              yOffset = 6;
            }

            var topLeft = { x: tempX, y: tempY };
            var topRight = { x: tempX + tempW, y: tempY };
            var bottomRight = {
              x: tempX + tempW,
              y: tempY + (tempH - yOffset) * (specialIndex ? -1 : 1),
            };
            var bottomLeft = {
              x: tempX,
              y: tempY + (tempH - yOffset) * (specialIndex ? -1 : 1),
            };
            newPolyColider = [topLeft, topRight, bottomRight, bottomLeft];
          }

          var newObject = {
            gid: parseInt(object.getAttribute("gid")),
            type: tempType,
            x: tempX,
            y: tempY,
            w: tempW,
            h: tempH,
            name: object.getAttribute("name"),
            collider: newPolyColider,
          };

          newObjectGroup.push(newObject);
        }

        this.objectgroups.push(newObjectGroup);
      }

      // console.log(this.layers);
      // console.log(xmlDoc);
    });
  }

  drawTile(gid, x, y, w = undefined, h = undefined) {
    this.tilesets.map((tileset) => {
      if (tileset.imageLoaded) {
        const currentTileID = gid - 1;
        if (
          tileset.firstgid <= gid &&
          gid <= tileset.firstgid + (tileset.tilecount - 1)
        ) {
          const sourceTilePos = {
            i: Math.floor(currentTileID / tileset.columns),
            j: currentTileID % tileset.columns,
          };

          ctx.save();

          const sourceRect = {
            x: sourceTilePos.j * tileset.tileSize.x,
            y: sourceTilePos.i * tileset.tileSize.y,
            w: tileset.tileSize.x,
            h: tileset.tileSize.y,
          };

          const targetRect = {
            x: x,
            y: y,
            w: w != undefined ? w : tileset.tileSize.x,
            h: h != undefined ? h : tileset.tileSize.y,
          };
          ctx.translate(targetRect.x, targetRect.y);

          ctx.drawImage(
            tileset.image,
            sourceRect.x,
            sourceRect.y,
            sourceRect.w,
            sourceRect.h,
            0,
            0,
            targetRect.w,
            targetRect.h
          );

          ctx.restore();
        }
      }
    });
  }

  render(
    offset = { x: 0, y: 0 },
    scale = 1,
    layerSpan = { min: -999, max: 999 }
  ) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    ctx.scale(scale, scale);

    if (this.layers)
      this.layers.map((layer) => {
        if (
          layer.properties["z-index"] >= layerSpan.min &&
          layer.properties["z-index"] <= layerSpan.max
        ) {
          for (var i = 0; i < layer.height; i++) {
            for (var j = 0; j < layer.width; j++) {
              const currentTilePosition = i * layer.width + j;

              const currentTileGID = layer.data[currentTilePosition];

              this.drawTile(
                currentTileGID,
                j * 16 + offset.x,
                i * 16 + offset.y
              );
              // ctx.translate(j * layer.tileSize.x, i * layer.tileSize.y);
            }
          }
        }
      });

    if (this.objectgroups) {
      this.objectgroups.map((objectGroup) => {
        objectGroup.map((object) => {
          this.drawTile(
            object.gid,
            object.x + offset.x,
            object.y - object.h + offset.y,
            object.w,
            object.h
          );
        });
      });
    }
    ctx.restore();
  }
}
var mapReader = new MapReader();
mapReader.load("./res/FFMQ-test-mapa1.tmx");

const tiles = {
  871: {
    //fence
    id: 871,
    x: 112,
    y: 768,
  },
  908: {
    //grass
    id: 908,
    x: 128,
    y: 800,
  },
};
const meuMapa = [
  [
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
  ],
  [
    { id: 908, collider: false },
    { id: 871, collider: true },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
  ],
  [
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
  ],
  [
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
  ],
  [
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
  ],
  [
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
    { id: 908, collider: false },
  ],
];

const charTileset = new Image();
charTileset.src =
  "./res/Final Fantasy Mystic Quest - Friendly Characters - Characters.png";

// const mapTileset = new Image();
// mapTileset.src = "./res/FF Mystic Quest Tiles.png";

class Engine {
  constructor() {
    this.lastCrystalBallOffset = 0;
    this.countedDelay = 0;
    this.CVdirection = 1;
    this.CBanimationDelay = 16;
    this.CBrotation = 0;
    this.spriteScale = canvas.width > 768 ? 3 : 2;
  }

  desenhaChao() {
    // var x = 0,
    //   y = 0;
    // for (var linha of meuMapa) {
    //   x = 0;
    //   for (var tileID of linha) {
    //     const tileToDraw = tiles[tileID.id];
    //     ctx.save();
    //     ctx.scale(this.spriteScale, this.spriteScale);
    //     ctx.drawImage(
    //       mapTileset,
    //       tileToDraw.x,
    //       tileToDraw.y,
    //       16,
    //       16,
    //       x,
    //       y,
    //       16,
    //       16
    //     );
    //     ctx.restore();
    //     x += 16;
    //   }
    //   y += 16;
    // }
  }

  desenhaBolaCristal() {
    // this.countedDelay++;
    // if (this.CVdirection > 0) {
    //   if (this.countedDelay > this.CBanimationDelay) {
    //     this.lastCrystalBallOffset += 16;
    //     if (this.lastCrystalBallOffset > 48) {
    //       this.CVdirection = -1;
    //       this.lastCrystalBallOffset = 48 - 16;
    //     }
    //     this.countedDelay = 0;
    //   }
    // } else {
    //   if (this.countedDelay > this.CBanimationDelay * 1.5) {
    //     this.lastCrystalBallOffset -= 16;
    //     if (this.lastCrystalBallOffset < 0) {
    //       this.CVdirection = 1;
    //       this.lastCrystalBallOffset = 0 + 16;
    //     }
    //     this.countedDelay = 0;
    //   }
    // }
    // var bolaCristalInicial = {
    //   x: 96 + this.lastCrystalBallOffset,
    //   y: 752,
    //   w: 16,
    //   h: 16,
    // };
    // var numeroDeFrames = 4;
    // ctx.save();
    // ctx.scale(this.spriteScale, this.spriteScale);
    // ctx.translate(32, 32);
    // ctx.drawImage(
    //   mapTileset,
    //   bolaCristalInicial.x,
    //   bolaCristalInicial.y,
    //   16,
    //   16,
    //   0,
    //   0,
    //   16,
    //   16
    // );
    // ctx.restore();
  }

  clearScreen(color = "#000000") {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  loop() {
    this.clearScreen();
    // console.log("frame");

    // ====================== Desenha Terreno
    // this.desenhaChao();

    // ====================== Desenha Objetos
    // this.desenhaBolaCristal();

    // ====================== Desenha Carinha
    if (!this.protagonista) {
      this.protagonista = {
        posicao: { x: 0 * 16, y: 0 * 16 },
        estado: "idle",
        rota: [],
        targetToWalk: undefined,
        speed: 1.5,
      };

      if (!this.touchDirection) this.touchDirection = false;

      var moverProtagonista = (direction) => {
        var target = {
          x: Math.floor(direction.x / (16 * this.spriteScale)),
          y: Math.floor(direction.y / (16 * this.spriteScale)),
        };

        var screenSize = { x: canvas.width, y: canvas.height };
        var screenCenter = { x: screenSize.x / 2, y: screenSize.y / 2 };
        var touchDirection = {
          x: (direction.x - screenCenter.x) / screenCenter.x,
          y: (direction.y - screenCenter.y) / screenCenter.y,
        };

        this.touchDirection = touchDirection;

        if ("so comentarios" != false) {
          // var tile = meuMapa[target.x][target.y];
          // if (tile.collider == false) {
          //   var criaRota = (posicaoAtual, alvo, rotaAtual = []) => {
          //     var tileNorte = {
          //       tile:
          //         posicaoAtual.y - 1 >= 0
          //           ? meuMapa[posicaoAtual.x][posicaoAtual.y - 1]
          //           : undefined,
          //       offset: { x: 0, y: -1 },
          //     };
          //     var tileSul = {
          //       tile:
          //         posicaoAtual.y + 1 < tileMapSize.h
          //           ? meuMapa[posicaoAtual.x][posicaoAtual.y + 1]
          //           : undefined,
          //       offset: { x: 0, y: +1 },
          //     };
          //     var tileEsquerda = {
          //       tile:
          //         posicaoAtual.x - 1 >= 0
          //           ? meuMapa[posicaoAtual.x][(1, posicaoAtual.y)]
          //           : undefined,
          //       offset: { x: -1, y: 0 },
          //     };
          //     var tileDireita = {
          //       tile:
          //         posicaoAtual.x + 1 < tileMapSize.w
          //           ? meuMapa[posicaoAtual.x][(1, posicaoAtual.y)]
          //           : undefined,
          //       offset: { x: 1, y: 0 },
          //     };
          //     var tilesToTest = [tileNorte, tileEsquerda, tileDireita, tileSul];
          //     tilesToTest.map((item) => {
          //       if (item.tile.collider == false) {
          //         var novaCoordenada = {
          //           x: posicaoAtual.x + item.offset.x,
          //           y: posicaoAtual.x + item.offset.x,
          //         };
          //         var distanciaAtualObjetivo =
          //           Math.pow(Math.pow(alvo.x - posicaoAtual.x, 2), 0.5) +
          //           Math.pow(Math.pow(alvo.y - posicaoAtual.y, 2), 0.5);
          //         var novaDistanciaObjetivo =
          //           Math.pow(Math.pow(alvo.x - novaCoordenada.x, 2), 0.5) +
          //           Math.pow(Math.pow(alvo.y - novaCoordenada.y, 2), 0.5);
          //         if (novaDistanciaObjetivo < distanciaAtualObjetivo) {
          //           rotaAtual.push(item.offset);
          //           if (
          //             posicaoAtual.x + item.offset.x != alvo.x &&
          //             posicaoAtual.y + item.offset.y != alvo.y
          //           )
          //             criaRota(
          //               {
          //                 x: posicaoAtual.x + item.offset.x,
          //                 y: posicaoAtual.y + item.offset.y,
          //               },
          //               alvo,
          //               rotaAtual
          //             );
          //         }
          //       }
          //     });
          //     return rotaAtual;
          //   };
          //   // this.protagonista.rota = criaRota(
          //   // {
          //   //   x: Math.floor(this.protagonista.posicao.x / 16),
          //   //   y: Math.floor(this.protagonista.posicao.y / 16),
          //   // },
          //   //   target,
          //   //   []
          //   // );
          //   this.protagonista.targetToWalk = {
          //     x: target.x * 16,
          //     y: target.y * 16,
          //   };
          //   // this.protagonista.posicao = {
          //   //   x: target.x * 16,
          //   //   y: target.y * 16,
          //   // };
          // }
        }
      };

      canvas.addEventListener("touchstart", (event) => {
        var direction = {
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
        };

        moverProtagonista(direction);
      });

      canvas.addEventListener("touchmove", (event) => {
        var direction = {
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
        };

        moverProtagonista(direction);
      });

      canvas.addEventListener("touchend", (event) => {
        this.touchDirection = undefined;
      });
    } else {
      // ====================================== Colide TUDO
      const xOffset = 3,
        yOffset = 8;
      var carinhaColliderX = [
        {
          x: this.protagonista.posicao.x + xOffset,
          y: this.protagonista.posicao.y + yOffset,
        },
        {
          x: this.protagonista.posicao.x + 12,
          y: this.protagonista.posicao.y + yOffset,
        },
        {
          x: this.protagonista.posicao.x + 12,
          y: this.protagonista.posicao.y + 16,
        },
        {
          x: this.protagonista.posicao.x + xOffset,
          y: this.protagonista.posicao.y + 16,
        },
      ];
      var carinhaColliderY = [
        {
          x: this.protagonista.posicao.x + xOffset,
          y: this.protagonista.posicao.y + yOffset,
        },
        {
          x: this.protagonista.posicao.x + 12,
          y: this.protagonista.posicao.y + yOffset,
        },
        {
          x: this.protagonista.posicao.x + 12,
          y: this.protagonista.posicao.y + 16,
        },
        {
          x: this.protagonista.posicao.x + xOffset,
          y: this.protagonista.posicao.y + 16,
        },
      ];

      // console.log(carinhaColliderX);
      var deltaX = 0,
        deltaY = 0;
      if (this.touchDirection) {
        deltaX =
          this.protagonista.speed * this.spriteScale * this.touchDirection.x;
        deltaY =
          this.protagonista.speed * this.spriteScale * this.touchDirection.y;

        carinhaColliderX = carinhaColliderX.map((myPoint) => {
          return {
            x: myPoint.x + deltaX,
            y: myPoint.y,
          };
        });
        carinhaColliderX = carinhaColliderX.map((myPoint) => {
          return {
            x:
              myPoint.x * this.spriteScale +
              canvas.width / 2 -
              this.protagonista.posicao.x * this.spriteScale,
            y:
              myPoint.y * this.spriteScale +
              canvas.height / 2 -
              this.protagonista.posicao.y * this.spriteScale,
          };
        });

        carinhaColliderY = carinhaColliderY.map((myPoint) => {
          return {
            x: myPoint.x,
            y: myPoint.y + deltaY,
          };
        });
        carinhaColliderY = carinhaColliderY.map((myPoint) => {
          return {
            x:
              myPoint.x * this.spriteScale +
              canvas.width / 2 -
              this.protagonista.posicao.x * this.spriteScale,
            y:
              myPoint.y * this.spriteScale +
              canvas.height / 2 -
              this.protagonista.posicao.y * this.spriteScale,
          };
        });
      }

      const drawColliders = true;
      var colidiu = { x: false, y: false };
      var CollidersTouse = [];
      // Atualiza posição dos colisores
      if (mapReader.objectgroups) {
        mapReader.objectgroups.map((objectGroup) => {
          objectGroup.map((object) => {
            if (object.collider.length > 0) {
              var newCollider = [];
              object.collider.map((point) => {
                var newPoint = {
                  x:
                    point.x * this.spriteScale +
                    canvas.width / 2 -
                    this.protagonista.posicao.x * this.spriteScale,
                  y:
                    point.y * this.spriteScale +
                    canvas.height / 2 +
                    this.protagonista.posicao.y * this.spriteScale,
                };
                newCollider.push(newPoint);
              });

              newCollider.object = object;
              CollidersTouse.push(newCollider);
            }
          });
        });
      }

      // Checa colisões
      if (CollidersTouse.length > 0) {
        CollidersTouse.map((collider) => {
          if (collider.length > 0) {
            if (polyPoly(collider, carinhaColliderX)) {
              console.log("colidiu ", collider.object.name);
              colidiu.x = true;
            }
            if (polyPoly(collider, carinhaColliderY)) {
              console.log("colidiu ", collider.object.name);
              colidiu.y = true;
            }
          }
        });
      }

      if (this.touchDirection) {
        if (!colidiu.x) this.protagonista.posicao.x += deltaX;
        if (!colidiu.y) this.protagonista.posicao.y -= deltaY;
      }

      // ====================================== Renderiza td
      // Renderiza terreno

      mapReader.render(
        {
          x: -this.protagonista.posicao.x,
          y: this.protagonista.posicao.y,
        },
        this.spriteScale,
        { min: -999, max: -1 }
      );

      // Renderiza protagonista
      const speedCarinha = 1;
      if (this.protagonista.targetToWalk && false) {
        const currPos = {
          x: Math.floor(this.protagonista.posicao.x / 16),
          y: Math.floor(this.protagonista.posicao.y / 16),
        };
        const currentTile = meuMapa[currPos.x][currPos.y];

        if (!this.lastTile) {
          this.lastTile = currentTile;
          console.log(currentTile);
        } else {
          if (this.lastTile != this.currentTile) {
            console.log(currentTile);
            this.lastTile = currentTile;
          }
        }

        if (
          this.protagonista.posicao.x > this.protagonista.targetToWalk.x &&
          currentTile.tileEsquerda.tile.collider == false
        ) {
          this.protagonista.posicao.x -= speedCarinha;
        } else if (
          this.protagonista.posicao.x < this.protagonista.targetToWalk.x &&
          currentTile.tileDireita.tile.collider == false
        ) {
          this.protagonista.posicao.x += speedCarinha;
        } else if (
          this.protagonista.posicao.y < this.protagonista.targetToWalk.y &&
          currentTile.tileSul.tile.collider == false
        ) {
          this.protagonista.posicao.y += speedCarinha;
        } else if (
          this.protagonista.posicao.y > this.protagonista.targetToWalk.y &&
          currentTile.tileNorte.tile.collider == false
        ) {
          this.protagonista.posicao.y -= speedCarinha;
        }
      }
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(this.spriteScale, this.spriteScale);
      ctx.drawImage(charTileset, 104, 31, 16, 16, 0, 0, 16, 16);
      ctx.restore();

      // Rederiza sobre terrano

      mapReader.render(
        {
          x: -this.protagonista.posicao.x,
          y: this.protagonista.posicao.y,
        },
        this.spriteScale,
        { min: 1, max: 999 }
      );

      if (drawColliders) {
        if (mapReader.objectgroups) {
          mapReader.objectgroups.map((objectGroup) => {
            objectGroup.map((object) => {
              if (object.collider.length > 0) {
                ctx.save();
                ctx.fillStyle = "#f006";
                ctx.beginPath();

                ctx.moveTo(
                  object.collider[0].x * this.spriteScale +
                  canvas.width / 2 -
                  this.protagonista.posicao.x * this.spriteScale,
                  object.collider[0].y * this.spriteScale +
                  canvas.height / 2 +
                  this.protagonista.posicao.y * this.spriteScale
                );
                object.collider.map((point) => {
                  var newPoint = {
                    x:
                      point.x * this.spriteScale +
                      canvas.width / 2 -
                      this.protagonista.posicao.x * this.spriteScale,
                    y:
                      point.y * this.spriteScale +
                      canvas.height / 2 +
                      this.protagonista.posicao.y * this.spriteScale,
                  };

                  // console.log(point);
                  ctx.lineTo(newPoint.x, newPoint.y);
                });

                ctx.closePath();
                ctx.fill();
                ctx.restore();
              }
            });
          });
        }
        var drawHeroCollider = () => {
          ctx.save();
          ctx.fillStyle = "#f006";
          ctx.beginPath();

          ctx.moveTo(carinhaColliderX[0].x, carinhaColliderX[0].y);
          carinhaColliderX.map((point) => {
            // console.log(point);
            ctx.lineTo(point.x, point.y);
          });

          ctx.closePath();
          ctx.fill();
          ctx.restore();
        };
        drawHeroCollider();
      }
    }

    window.requestAnimationFrame(() => {
      this.loop();
    });
  }
}

var engine = new Engine();
engine.loop();

// mapTileset.addEventListener("load", () => {
//   engine.loop();
// });
