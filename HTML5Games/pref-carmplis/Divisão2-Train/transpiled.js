"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() { }; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

if (!window.requestAnimationFrame) {
  (function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  })();
} //External Methods


function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === "undefined") {
    stroke = true;
  }

  if (typeof radius === "undefined") {
    radius = 5;
  }

  if (typeof radius === "number") {
    radius = {
      tl: radius,
      tr: radius,
      br: radius,
      bl: radius
    };
  } else {
    var defaultRadius = {
      tl: 0,
      tr: 0,
      br: 0,
      bl: 0
    };

    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }

  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();

  if (fill) {
    ctx.fill();
  }

  if (stroke) {
    ctx.stroke();
  }
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex; // While there remain elements to shuffle...

  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1; // And swap it with the current element.

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);

  this.play = function () {
    this.sound.play();
  };

  this.stop = function () {
    this.sound.pause();
  };
}

var SheetLoader = /*#__PURE__*/function () {
  function SheetLoader() {
    var onLoadAllCallBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

    _classCallCheck(this, SheetLoader);

    this.sheetsToLoad = [];
    this.sheetsLoaded = 0;
    this.loadAllCallBack = onLoadAllCallBack;
    this.queue = [];
  }

  _createClass(SheetLoader, [{
    key: "onLoadSheet",
    value: function onLoadSheet() {
      this.sheetsLoaded++;

      if (this.sheetsLoaded >= this.queue.length) {
        if (this.loadAllCallBack) {
          this.loadAllCallBack();
        }
      }
    }
  }, {
    key: "queueSheet",
    value: function queueSheet(filepath) {
      var newSheet = new Image();
      this.queue.push({
        filepath: filepath,
        image: newSheet
      });
      newSheet.src = filepath;
      return newSheet;
    }
  }, {
    key: "loadSheetQueue",
    value: function loadSheetQueue() {
      var _this = this;

      var onLoadAllCallBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (onLoadAllCallBack) {
        this.loadAllCallBack = onLoadAllCallBack;
      }

      this.queue.map(function (item) {
        item.image.addEventListener("load", function () {
          _this.onLoadSheet();
        });
      });
    }
  }]);

  return SheetLoader;
}();

var Rect = /*#__PURE__*/function () {
  function Rect(x, y, w, h, padding, margin, border) {
    _classCallCheck(this, Rect);

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.padding = padding;
    this.margin = margin;
    this.border = border;
  }

  _createClass(Rect, [{
    key: "points",
    value: function points() {
      return [{
        x: this.x,
        y: this.y
      }, {
        x: this.x + this.w,
        y: this.y
      }, {
        x: this.x + this.w,
        y: this.y + this.h
      }, {
        x: this.x,
        y: this.y + this.h
      }];
    }
  }]);

  return Rect;
}();

var Frame = /*#__PURE__*/function () {
  function Frame(image, sourceRect, transform) {
    _classCallCheck(this, Frame);

    this.image = image;
    this.sourceRect = sourceRect;
    this.transform = transform;
    this.showPivot = false;
  }

  _createClass(Frame, [{
    key: "currentLogicWidth",
    value: function currentLogicWidth() {
      return this.sourceRect.w * this.transform.scale.x;
    }
  }, {
    key: "currentLogicHeight",
    value: function currentLogicHeight() {
      return this.sourceRect.h * this.transform.scale.y;
    }
  }, {
    key: "draw",
    value: function draw(ctx, canvas) {
      // Save the current context
      ctx.save(); // ctx.imageSmoothingEnabled = false;
      // ctx.msImageSmoothingEnabled = false;
      // ctx.mozImageSmoothingEnabled = false;

      var originPoint = {
        x: canvas.width * this.transform.screenOrigin.x,
        y: canvas.height * this.transform.screenOrigin.y
      };
      var finalWidth = this.currentLogicWidth();
      var finalHeight = this.currentLogicHeight();
      var positionOffset = {
        x: this.transform.position.left ? this.transform.position.left : canvas.width - this.transform.position.right,
        y: this.transform.position.top ? this.transform.position.top : canvas.height - this.transform.position.bottom
      };
      var pivotPosition = {
        x: originPoint.x + positionOffset.x,
        y: originPoint.y + positionOffset.y
      };
      ctx.translate(pivotPosition.x, pivotPosition.y);
      var adjustedPosition = {
        x: -finalWidth * this.transform.pivot.x,
        y: -finalHeight * this.transform.pivot.y
      };
      ctx.save();
      ctx.rotate(DegToRad(this.transform.rotation));
      var finalRect = {
        x: adjustedPosition.x,
        y: adjustedPosition.y,
        w: finalWidth,
        h: finalHeight
      };
      ctx.drawImage(this.image, finalRect.x, finalRect.y, finalRect.w, finalRect.h);
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
  }]);

  return Frame;
}();

var Transform = /*#__PURE__*/function () {
  function Transform() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Transform);

    this.position = options.position ? options.position : {
      x: 0,
      y: 0
    };
    this.rotation = options.rotation ? options.rotation : 0;
    this.scale = options.scale ? options.scale : {
      x: 1,
      y: 1
    };
    this.pivot = options.pivot ? options.pivot : {
      x: 0,
      y: 0
    };
    this.screenOrigin = options.screenOrigin ? options.screenOrigin : {
      x: 0,
      y: 0
    };
    this.parent = undefined;
    this.children = [];
    this.JogoObjecto = undefined;
  }

  _createClass(Transform, [{
    key: "addChild",
    value: function addChild(child) {
      if (child.parent) {
        // Desconecta com o parent anterior
        var tempChildOldIndex = child.parent.children.indexOf(child);
        if (tempChildOldIndex >= 0) child.parent.children.slice(tempChildOldIndex); // Conecta com o parent novo

        child.parent = this;
        if (this.children.indexOf(child) == -1) this.children.push(child);
      }
    }
  }]);

  return Transform;
}();

function DegToRad(d) {
  // Converts degrees to radians
  return d * 0.01745;
} // POLYGON/POLYGON


function polyPoly(p1, p2) {
  // go through each of the vertices, plus the next
  // vertex in the list
  var next = 0;

  for (var current = 0; current < p1.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == p1.length) next = 0; // get the PVectors at our current position
    // this makes our if statement a little cleaner

    var vc = p1[current]; // c for "current"

    var vn = p1[next]; // n for "next"
    // now we can use these two points (a line) to compare
    // to the other polygon's vertices using polyLine()

    var collision = polyLine(p2, vc.x, vc.y, vn.x, vn.y);
    if (collision) return true; // optional: check if the 2nd polygon is INSIDE the first

    collision = polyPoint(p1, p2[0].x, p2[0].y);
    if (collision) return true;
  }

  return false;
} // POLYGON/LINE


function polyLine(vertices, x1, y1, x2, y2) {
  // go through each of the vertices, plus the next
  // vertex in the list
  var next = 0;

  for (var current = 0; current < vertices.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == vertices.length) next = 0; // get the PVectors at our current position
    // extract X/Y coordinates from each

    var x3 = vertices[current].x;
    var y3 = vertices[current].y;
    var x4 = vertices[next].x;
    var y4 = vertices[next].y; // do a Line/Line comparison
    // if true, return 'true' immediately and
    // stop testing (faster)

    var hit = lineLine(x1, y1, x2, y2, x3, y3, x4, y4);

    if (hit) {
      return true;
    }
  } // never got a hit


  return false;
} // LINE/LINE


function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  // calculate the direction of the lines
  var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)); // if uA and uB are between 0-1, lines are colliding

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  }

  return false;
} // POLYGON/POINT
// used only to check if the second polygon is
// INSIDE the first


function polyPoint(vertices, px, py) {
  var collision = false; // go through each of the vertices, plus the next
  // vertex in the list

  var next = 0;

  for (var current = 0; current < vertices.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1;
    if (next == vertices.length) next = 0; // get the PVectors at our current position
    // this makes our if statement a little cleaner

    var vc = vertices[current]; // c for "current"

    var vn = vertices[next]; // n for "next"
    // compare position, flip 'collision' variable
    // back and forth

    if ((vc.y > py && vn.y < py || vc.y < py && vn.y > py) && px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x) {
      collision = !collision;
    }
  }

  return collision;
} //==================================================================================================
// Get canvas


var canvas = document.getElementById("canvas");
canvas.width -= 4;
canvas.height -= 4; //load resources

var allImagesLoaded = function allImagesLoaded() {
  // var mario = new Mario(marioSheet, this.context, new Vector2(20, 32));
  // this.characters.push(mario);
  // console.log(engine);
  engine.this.engineState = engineStates.START;
};

var sheetLoader = new SheetLoader(function () {
  allImagesLoaded();
});
var skybox = sheetLoader.queueSheet("./img/skybox.png");
var nuvem1 = sheetLoader.queueSheet("./img/nuvem1.png");
var nuvem2 = sheetLoader.queueSheet("./img/nuvem2.png");
var nuvem3 = sheetLoader.queueSheet("./img/nuvem3.png");
var mountains = sheetLoader.queueSheet("./img/bg trem.png");
var trem = sheetLoader.queueSheet("./img/trem-completo.png");
var ui_certo = sheetLoader.queueSheet("./img/ui_certo.png");
var ui_errado = sheetLoader.queueSheet("./img/ui_errado.png"); // const soundMotor = new sound("./audio/ronco-motor.mp3");
// ===================================== Coisas desse jogo em questão

var TrainManager = /*#__PURE__*/function () {
  function TrainManager() {
    _classCallCheck(this, TrainManager);

    this.currentVagao = 0;
    this.vagoes = [];
  }

  _createClass(TrainManager, [{
    key: "nextVagao",
    value: function nextVagao() {
      if (this.currentVagao + 1 < this.vagoes.length) {
        this.currentVagao++;
      }
    }
  }, {
    key: "render",
    value: function render() { }
  }]);

  return TrainManager;
}();

var engineStates = {
  LOADING: "loading",
  START: "start",
  PLAYING: "load-question",
  RESULT: "wait-answer"
};
var gameStates = {
  RESETING: "reseting",
  LOAD_QUESTION: "load-question",
  WAIT_ANSWER: "wait-answer",
  WRONG_ANSWER: "wrong-answer",
  RIGHT_ANSWER: "right-answer"
};
var boost = 1;
window.maxTrainSpeed = 3.9 * boost;
window.trainSpeed = 1.5 * boost;
window.trainAccel = 0.035 * boost;

var TrainGame = /*#__PURE__*/function () {
  function TrainGame(inputQuestions, ctx, canvas) {
    var _this2 = this;

    _classCallCheck(this, TrainGame);

    this.ctx = ctx;
    this.questions = inputQuestions;
    this.inputQuestions = inputQuestions;
    this.mayDrag = false;
    this.drawColliders = false;
    canvas.addEventListener("mousedown", function (event) {
      _this2.clickCanvas(event, true);
    }, false);
    canvas.addEventListener("touchstart", function (event) {
      _this2.clickCanvas(event, true);
    }, false);
    canvas.addEventListener("mouseup", function (event) {
      _this2.clickCanvas(event, false);
    }, false);
    canvas.addEventListener("touchend", function (event) {
      _this2.clickCanvas(event, false);
    }, false);
    canvas.addEventListener("mousemove", function (event) {
      _this2.moveOptions(event);
    }, false);
    canvas.addEventListener("touchmove", function (event) {
      _this2.moveOptions(event);
    }, false);
  }

  _createClass(TrainGame, [{
    key: "moveOptions",
    value: function moveOptions(event) {
      if (!this.mayDrag) {
        return;
      }

      if (this.numerosOptions) {
        this.numerosOptions.map(function (option) {
          var x = event.touches ? event.touches.length > 0 ? event.touches[0].pageX : event.pageX : event.pageX;
          var y = event.touches ? event.touches.length > 0 ? event.touches[0].pageY : event.pageY : event.pageY;

          if (option.beingDraged) {
            option.screenLocation.x = x - canvas.offsetLeft - option.screenLocation.w / 2;
            option.screenLocation.y = y - canvas.offsetTop - option.screenLocation.h / 2;
          }
        });
      }
    }
  }, {
    key: "start",
    value: function start() {
      this.engineState = engineStates.START;
      this.gameLoop();
    }
  }, {
    key: "drawAllColliders",
    value: function drawAllColliders() {
      var _this3 = this;

      if (this.numerosOptions) {
        for (var i = 0; i < this.numerosOptions.length; i++) {
          var element = this.numerosOptions[i];
          var tempRect = {
            left: element.screenLocation.x,
            top: element.screenLocation.y,
            width: element.screenLocation.w,
            height: element.screenLocation.h
          };
          this.ctx.save();
          this.ctx.fillStyle = "#f006";
          this.ctx.beginPath();
          var rectCol = [{
            x: tempRect.left,
            y: tempRect.top
          }, {
            x: tempRect.left + tempRect.width,
            y: tempRect.top
          }, {
            x: tempRect.left + tempRect.width,
            y: tempRect.top + tempRect.height
          }, {
            x: tempRect.left,
            y: tempRect.top + tempRect.height
          }];
          this.ctx.moveTo(tempRect.left, tempRect.top);
          rectCol.map(function (point) {
            var newPoint = {
              x: point.x,
              y: point.y
            };

            _this3.ctx.lineTo(newPoint.x, newPoint.y);
          });
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.restore();
        }
      }

      if (this.activeQuestions) {
        var _iterator = _createForOfIteratorHelper(this.activeQuestions),
          _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var question = _step.value;

            if (question.collider) {
              var tempRectB = new Rect(question.collider.x, question.collider.y, question.collider.w, question.collider.h);
              this.ctx.save();
              this.ctx.fillStyle = "#f006";
              this.ctx.beginPath();
              var rectCol = tempRectB.points();
              this.ctx.moveTo(rectCol[0].x, rectCol[0].y);
              rectCol.map(function (point) {
                var newPoint = {
                  x: point.x,
                  y: point.y
                };

                _this3.ctx.lineTo(newPoint.x, newPoint.y);
              });
              this.ctx.closePath();
              this.ctx.fill();
              this.ctx.restore();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }, {
    key: "clickCanvas",
    value: function clickCanvas(event) {
      var _this4 = this;

      var clickValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!this.mayDrag) {
        return;
      }

      if (clickValue) {
        var x = event.touches ? event.touches.length > 0 ? event.touches[0].pageX : event.pageX : event.pageX;
        var y = event.touches ? event.touches.length > 0 ? event.touches[0].pageY : event.pageY : event.pageY;
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop; // Collision detection between clicked offset and element.

        if (this.numerosOptions) {
          for (var i = 0; i < this.numerosOptions.length; i++) {
            var element = this.numerosOptions[i];
            var tempRect = {
              left: element.screenLocation.x,
              top: element.screenLocation.y,
              width: element.screenLocation.w,
              height: element.screenLocation.h
            };
            var collided = y > tempRect.top && y < tempRect.top + tempRect.height && x > tempRect.left && x < tempRect.left + tempRect.width;

            if (collided) {
              if (this.gameState == gameStates.WAIT_ANSWER || // this.gameState == gameStates.RIGHT_ANSWER ||
                this.gameState == gameStates.WRONG_ANSWER) {
                element.beingDraged = true;
              }

              break;
            }
          }
        }
      } else {
        if (this.numerosOptions) {
          if (this.gameState == gameStates.WAIT_ANSWER || // this.gameState == gameStates.RIGHT_ANSWER ||
            this.gameState == gameStates.WRONG_ANSWER) {
            for (var i = 0; i < this.numerosOptions.length; i++) {
              var element = this.numerosOptions[i];
              var tempRectA = {
                left: element.screenLocation.x,
                top: element.screenLocation.y,
                width: element.screenLocation.w,
                height: element.screenLocation.h
              };

              if (element.beingDraged) {
                var tempRectA = new Rect(element.screenLocation.x, element.screenLocation.y, element.screenLocation.w, element.screenLocation.h);

                var _iterator2 = _createForOfIteratorHelper(this.activeQuestions),
                  _step2;

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var question = _step2.value;
                    var tempRectB = new Rect(question.collider.x, question.collider.y, question.collider.w, question.collider.h);

                    if (polyPoly(tempRectA.points(), tempRectB.points())) {
                      var respostaDoAluno = parseInt(element.option);
                      var repostaCorreta = question.answer;
                      this.currentQuestion = this.activeQuestions[this.currentVagao - 1]; // if (!this.studentResults[this.currentQuestion.question])
                      //   this.studentResults[this.currentQuestion.question] = [];

                      this.studentResults.push({
                        question: this.currentQuestion.question,
                        studentAnswer: respostaDoAluno,
                        success: respostaDoAluno == repostaCorreta
                      });

                      if (respostaDoAluno == repostaCorreta) {
                        this.gameState = gameStates.RIGHT_ANSWER;
                        question.answered = true;
                        element.mustDraw = false;
                        setTimeout(function () {
                          _this4.gameState = gameStates.WAIT_ANSWER;
                          if (_this4.currentVagao + 1 <= _this4.questions.length) _this4.currentVagao++; else {
                            _this4.engineState = engineStates.RESULT;
                          }
                        }, 2250);
                      } else {
                        this.gameState = gameStates.WRONG_ANSWER;
                        setTimeout(function () {
                          _this4.gameState = gameStates.WAIT_ANSWER;
                        }, 2250);
                      }
                    } else {
                      element.beingDraged = false;

                      if (!clickValue) {
                        element.screenLocation.x = element.originalLocation.x;
                        element.screenLocation.y = element.originalLocation.y;
                        element.screenLocation.w = element.originalLocation.w;
                        element.screenLocation.h = element.originalLocation.h;
                      }
                    }
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }
              }
            }
          }
        }
      }
    }
  }, {
    key: "gameLoop",
    value: function gameLoop() {
      var _this5 = this;

      // console.log(this.gameState);
      this.layout = canvas.width > 768 ? "desktop" : "mobile";
      window.requestAnimationFrame(function () {
        if (_this5.gameLoop) _this5.gameLoop();
      });

      switch (this.engineState) {
        case engineStates.START:
          {
            this.renderBG();
            this.engineState = engineStates.PLAYING;
            this.gameState = gameStates.RESETING;
            this.studentResults = [];
          }
          break;

        case engineStates.PLAYING:
          {
            switch (this.gameState) {
              case gameStates.RESETING:
                {
                  this.mayDrag = false;
                  this.renderBG();
                  this.respawnTrain();
                  this.gameState = gameStates.LOAD_QUESTION;
                  this.activeQuestions = _toConsumableArray(this.questions);
                  shuffle(this.activeQuestions);
                  this.answeredQuestions = [];
                }
                break;

              case gameStates.LOAD_QUESTION:
                {
                  this.mayDrag = false;
                  this.gameState = gameStates.WAIT_ANSWER; // if (this.currentQuestion) {
                  //   this.answeredQuestions.push(this.currentQuestion);
                  //   this.activeQuestions.splice(
                  //     this.activeQuestions.indexOf(this.currentQuestion),
                  //     1
                  //   );
                  //   this.currentQuestion = undefined;
                  // }
                  // if (this.activeQuestions.length > 0) {
                  //   this.currentQuestion = this.activeQuestions[
                  //     (Math.random() * this.activeQuestions.length) | 0
                  //   ];
                  //   shuffle(this.currentQuestion.options);
                  //   this.gameState = gameStates.WAIT_ANSWER;
                  // } else {
                  //   this.engineState = engineStates.RESULT;
                  // }
                }
                break;

              case gameStates.WAIT_ANSWER:
                {
                  this.mayDrag = true;
                  this.renderBG();
                  this.renderEnunciado();
                  this.renderQuestionLabel2();
                  this.renderTrain(this.activeQuestions);
                  this.renderNumeros();
                }
                break;

              case gameStates.WRONG_ANSWER:
                {
                  this.mayDrag = true;
                  this.renderBG();
                  this.renderEnunciado(); // this.renderQuestionLabel2();

                  this.renderTrain(this.activeQuestions);
                  this.renderNumeros();
                  this.renderWrongAnswer();
                }
                break;

              case gameStates.RIGHT_ANSWER:
                {
                  this.mayDrag = false;
                  this.renderBG();
                  this.renderEnunciado();
                  this.renderQuestionLabel2();
                  this.renderTrain(this.activeQuestions);
                  this.renderNumeros();
                  this.renderRightAnswer();
                }
                break;
            }
          }
          break;

        case engineStates.RESULT:
          {
            this.renderBG();
            this.renderResults();
          }
          break;
      }

      if (this.drawColliders) {
        this.drawAllColliders();
      }
    }
  }, {
    key: "getEstradaCoordinates",
    // ============================================ Game logic
    value: function getEstradaCoordinates() {
      var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var estradaInicio = canvas.height / 2;
      var estradaFim = estradaInicio + canvas.height / 2;
      return estradaInicio + y * (estradaFim - estradaInicio);
    }
  }, {
    key: "respawnTrain",
    value: function respawnTrain(questions) {
      if (!this.train) {
        var trainHeight = 137;
        this.train = {
          position: {
            x: 0,
            y: canvas.height - trainHeight
          },
          focusedPart: -1
        };
      }
    } // ============================================ Rendering

  }, {
    key: "renderBG",
    value: function renderBG() {
      this.renderCeu();
      this.renderNuvens();
      this.renderMontanhas();
    }
  }, {
    key: "renderCeu",
    value: function renderCeu() {
      this.ctx.drawImage(skybox, 0, 0, 1024, 720, 0, 0, canvas.width, canvas.height);
    }
  }, {
    key: "renderNuvens",
    value: function renderNuvens() {
      var _this6 = this;

      this.nuvemScale = canvas.width > 768 ? 1 : 0.5;

      if (!this.nuvens) {
        this.nuvens = [];
        this.maxNuvemHeight = canvas.height * (8 / 13);

        var nuvemTipoA = function nuvemTipoA() {
          var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.random() * 1 + 0.2;
          var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
            x: Math.random() * window.innerWidth * 1.25,
            y: Math.random() * 200
          };
          var novaNuvem = {};
          novaNuvem.img = nuvem1;
          novaNuvem.position = position;
          novaNuvem.size = {
            x: 137,
            y: 70
          };
          novaNuvem.speed = speed;
          return novaNuvem;
        };

        var nuvemTipoB = function nuvemTipoB() {
          var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.random() * 1 + 0.2;
          var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
            x: Math.random() * window.innerWidth * 1.25,
            y: Math.random() * 200
          };
          var novaNuvem = {};
          novaNuvem.img = nuvem2;
          novaNuvem.position = position;
          novaNuvem.size = {
            x: 220,
            y: 146
          };
          novaNuvem.speed = speed;
          return novaNuvem;
        };

        var nuvemTipoC = function nuvemTipoC() {
          var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.random() * 1 + 0.2;
          var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
            x: Math.random() * window.innerWidth * 1.25,
            y: Math.random() * _this6.maxNuvemHeight
          };
          var novaNuvem = {};
          novaNuvem.img = nuvem3;
          novaNuvem.position = position;
          novaNuvem.size = {
            x: 229,
            y: 99
          };
          novaNuvem.speed = speed;
          return novaNuvem;
        };

        this.nuvens.push(nuvemTipoA());
        this.nuvens.push(nuvemTipoA());
        this.nuvens.push(nuvemTipoB());
        this.nuvens.push(nuvemTipoB());
        this.nuvens.push(nuvemTipoC());
        this.nuvens.push(nuvemTipoC());

        if (canvas.width > 768) {
          this.nuvens.push(nuvemTipoA());
          this.nuvens.push(nuvemTipoA());
          this.nuvens.push(nuvemTipoB());
          this.nuvens.push(nuvemTipoB());
          this.nuvens.push(nuvemTipoC());
          this.nuvens.push(nuvemTipoC());
        }
      }

      this.nuvens = this.nuvens.map(function (nuvem) {
        _this6.ctx.drawImage(nuvem.img, 0, 0, nuvem.size.x, nuvem.size.y, nuvem.position.x, nuvem.position.y, nuvem.size.x * _this6.nuvemScale, nuvem.size.y * _this6.nuvemScale);

        nuvem.position.x -= nuvem.speed;

        if (nuvem.position.x + nuvem.size.x * _this6.nuvemScale < 0) {
          nuvem.position.x = canvas.width;
          nuvem.position.y = Math.random() * _this6.maxNuvemHeight - Math.random() * nuvem.size.y * _this6.nuvemScale;
          nuvem.speed = Math.random() * 1 + 0.1;
        }

        return nuvem;
      });
    }
  }, {
    key: "renderMontanhas",
    value: function renderMontanhas() {
      var rect = new Rect(0, canvas.height - (this.layout == "desktop" ? 512 : 300), canvas.width, this.layout == "desktop" ? 512 : 300);
      this.ctx.drawImage(mountains, 0, 0, 1026, 512, rect.x, rect.y, rect.w, rect.h);
    }
  }, {
    key: "renderTrain",
    value: function renderTrain(questions) {
      if (!this.currentVagao) {
        this.currentVagao = 1;
      }

      var trainsScale = this.layout == "desktop" ? 1 : 0.85;
      this.carroChefeWidth = 334 * trainsScale;
      this.vagaoWidth = 346 * trainsScale;
      this.vagaoHeight = 342 * trainsScale;
      var initialX = this.carroChefeWidth * 0.1 + 0 * this.vagaoWidth;
      var targetX = this.carroChefeWidth + this.currentVagao * this.vagaoWidth;

      if (canvas.width <= 320) {
        targetX -= this.currentVagao * 6;
      }

      if (!this.trainX) this.trainX = initialX;
      targetX;
      if (!this.myRot) this.myRot = 0;
      if (!this.lastVagao) this.lastVagao = this.currentVagao;
      var targetXDistance = targetX - this.trainX;
      var thisFrameSpeed = window.trainSpeed;

      if (this.trainX < targetX) {
        window.trainSpeed += window.trainAccel;
      } else if (this.trainX > targetX) {
        window.trainSpeed -= window.trainAccel;
      }

      var meuSign = window.trainSpeed >= 0 ? 1 : -1;

      if (Math.abs(window.trainSpeed) > window.maxTrainSpeed) {
        window.trainSpeed = meuSign * window.maxTrainSpeed;
      }

      if (window.trainSpeed > 0) {
        if (targetXDistance < window.trainSpeed) {
          window.trainSpeed = 0;
          this.trainX += targetXDistance;
        }
      } else if (window.trainSpeed < 0) {
        if (targetXDistance > window.trainSpeed) {
          window.trainSpeed = 0;
          this.trainX += targetXDistance;
        }
      }

      this.trainX += window.trainSpeed * trainsScale; // Desenha todo o trem

      var spriteTrem = new Frame(trem, new Rect(0, 0, 3658, 342), new Transform({
        position: {
          left: this.trainX,
          bottom: -5
        },
        rotation: this.myRot,
        scale: {
          x: trainsScale,
          y: trainsScale
        },
        pivot: {
          x: 1,
          y: 1
        }
      }));
      spriteTrem.showPivot = false;
      var retorno = spriteTrem.draw(this.ctx, canvas); // ============================ Render
      // Desenha operações

      var fontSize = 36;
      this.ctx.font = fontSize + "px sans-serif";
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "center";

      for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        var fX = this.trainX - (this.carroChefeWidth + i * this.vagaoWidth + this.vagaoWidth / 2 + trainsScale * 50) + i * 12 * trainsScale;
        var fY = canvas.height - 5 - this.vagaoHeight / 2;
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText(question.question, fX, fY, this.vagaoWidth);
        questions[i].collider = {
          x: fX + 67.5,
          y: fY - (15 + fontSize / 2),
          h: 60,
          w: 60
        }; // BG

        canvasContext.strokeStyle = "#FFFFFF";
        canvasContext.fillStyle = "rgba(255,255,255,0.1)";
        this.ctx.lineWidth = 1;
        roundRect(canvasContext, questions[i].collider.x, questions[i].collider.y, questions[i].collider.w, questions[i].collider.h, 5, true, true);
        canvasContext.fillStyle = "#FFFFFF";

        if (questions[i].answered) {
          this.ctx.fillText(question.answer.toString(), questions[i].collider.x + questions[i].collider.w / 2, questions[i].collider.y + questions[i].collider.h / 2, fontSize * 2);
        }
      }
    }
  }, {
    key: "renderWrongAnswer",
    value: function renderWrongAnswer() {
      this.ctx.drawImage(ui_errado, 0, 0, 106, 106, canvas.width / 2 - 106 / 2, canvas.height / 2 - 106 / 2, 106, 106);
    }
  }, {
    key: "renderRightAnswer",
    value: function renderRightAnswer() {
      this.ctx.drawImage(ui_certo, 0, 0, 108, 108, canvas.width / 2 - 54, canvas.height / 2 - 54, 108, 108);
    }
  }, {
    key: "renderQuestionLabel2",
    value: function renderQuestionLabel2() {
      //Set sizes
      var fontSize = 18;
      var labelRect = {
        x: 45,
        y: 65,
        w: 340,
        h: undefined,
        padding: {
          x: 10,
          y: 10
        },
        borderSize: 4
      };
      labelRect.h = fontSize * 2 + labelRect.padding.y * 2 + labelRect.borderSize * 2;

      if (this.layout == "mobile") {
        fontSize = 16;
        labelRect.w -= 40;

        if (canvas.width <= 320) {
          fontSize = 14;
          labelRect.w = 270;
        }
      } // BG


      canvasContext.strokeStyle = "#9FD37C";
      canvasContext.fillStyle = "#FFFFFF";
      roundRect(canvasContext, labelRect.x, labelRect.y, labelRect.w, labelRect.h, 5, true, labelRect.borderSize); //Texto

      this.ctx.font = "bold " + fontSize + "px sans-serif";
      this.ctx.fillStyle = "#333333";
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "left";
      this.ctx.fillText("Arraste até aos vagões o resultado", labelRect.x + labelRect.padding.x + 20, labelRect.y + labelRect.padding.y + fontSize - 2, canvas.width - labelRect.x);
      this.ctx.fillText("correto das operações indicadas.", labelRect.x + labelRect.padding.x + 20, labelRect.y + labelRect.padding.y + fontSize * 2 - 2, canvas.width - labelRect.x); //Circle with number

      var circleRadius = (fontSize * 2 + labelRect.padding.y * 2 + labelRect.borderSize * 2 + 5) / 2;
      this.ctx.beginPath();
      this.ctx.arc(labelRect.x - circleRadius + 25, labelRect.y + circleRadius, circleRadius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = "#75C043";
      this.ctx.fill();
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = "#9FD37C";
      this.ctx.stroke();
      this.ctx.font = "bold 42px sans-serif";
      this.ctx.strokeStyle = "#FFFFFF";
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.fillText("?", labelRect.x - circleRadius + 25 - 12, labelRect.y + circleRadius + 1, canvas.width - labelRect.x);
    }
  }, {
    key: "renderEnunciado",
    value: function renderEnunciado() {
      // BG
      //Set sizes
      var fontSize = 18;
      var labelRect = {
        x: 10,
        y: 15,
        w: 442,
        h: 38,
        padding: {
          x: 5,
          y: 5
        },
        borderSize: 5
      }; // Responsividade

      if (this.layout == "mobile") {
        fontSize = 16;
        labelRect.padding.x = 3;
        labelRect.w = canvas.width - (labelRect.padding.x * 2 + labelRect.borderSize * 2);
      } else if (this.layout == "desktop") {
        fontSize = 18;
      }

      canvasContext.strokeStyle = "#7FD37C";
      canvasContext.fillStyle = "#75C043";
      roundRect(canvasContext, labelRect.x, labelRect.y, labelRect.w, labelRect.h, 5, true, labelRect.borderSize); //Texto

      this.ctx.font = fontSize + "px sans-serif";
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "center";
      this.ctx.fillText("ATIVIDADE: Efetuar as operações da divisão por 2", labelRect.x + labelRect.w / 2 + labelRect.borderSize / 2, labelRect.y + labelRect.h / 2 + labelRect.borderSize / 2, canvas.width - (labelRect.padding.x * 8 + labelRect.borderSize * 2));
    }
  }, {
    key: "renderResults",
    value: function renderResults() {
      //Set sizes
      var fontSize = 42;
      var labelRect = {
        x: 0.025 * canvas.width,
        y: 0.25 * canvas.height,
        w: 0.95 * canvas.width,
        h: 0.5 * canvas.height,
        padding: {
          x: 50,
          y: 50
        },
        borderSize: 4
      }; // BG

      canvasContext.strokeStyle = "#7D3F00";
      canvasContext.fillStyle = "rgba(0,51,51, 0.8)";
      roundRect(canvasContext, labelRect.x, labelRect.y, labelRect.w, labelRect.h, 5, true, labelRect.borderSize); // FRAG
      //Texto

      this.ctx.font = fontSize + "px sans-serif";
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "center";
      var frag = {
        respostas: 0,
        acertos: 0
      };

      for (var a = 0; a < this.studentResults.length; a++) {
        var question = this.studentResults[a];
        frag.respostas++;
        if (question.success) frag.acertos++;
      }

      this.ctx.fillText("Nota: " + (frag.acertos / frag.respostas * 100).toFixed(0) + "%", labelRect.x + labelRect.w / 2 + labelRect.borderSize * 2 - fontSize / 2, labelRect.y + labelRect.h / 2 + labelRect.borderSize * 2 - fontSize / 2 - fontSize, 1000);
      fontSize = 24;
      this.ctx.font = fontSize + "px sans-serif";
      this.ctx.fillText("Acertos: " + frag.acertos, labelRect.x + labelRect.w / 2 + labelRect.borderSize * 2 - fontSize / 2, labelRect.y + labelRect.h / 2 + labelRect.borderSize * 2 - fontSize / 2 + fontSize * 2, 1000);
      this.ctx.fillText("Tentativas: " + frag.respostas, labelRect.x + labelRect.w / 2 + labelRect.borderSize * 2 - fontSize / 2, labelRect.y + labelRect.h / 2 + labelRect.borderSize * 2 - fontSize / 2 + fontSize * 3.5, 1000);
      this.ctx.fillText("Total de perguntas: " + this.inputQuestions.length, labelRect.x + labelRect.w / 2 + labelRect.borderSize * 2 - fontSize / 2, labelRect.y + labelRect.h / 2 + labelRect.borderSize * 2 - fontSize / 2 + fontSize * 5, 1000); //Retorna valores ao normal

      this.ctx.textAlign = "start";
      this.ctx.textBaseline = "alphabetic";
    }
  }, {
    key: "renderNumeros",
    value: function renderNumeros() {
      var _this7 = this;

      // ---------------------------- BG
      //============= Set sizes
      var fontSize = 18;
      var labelRect = {
        x: 10,
        y: 145,
        w: 635,
        h: 68,
        padding: {
          x: 5,
          y: 5
        },
        borderSize: 5
      }; // ================== Responsividade

      if (this.layout == "mobile") {
        fontSize = 16;
        labelRect.w = canvas.width - (labelRect.padding.x * 2 + labelRect.borderSize * 2);
        labelRect.h = 68 * 2;

        if (canvas.width <= 768) {
          if (labelRect.w > 405) {
            labelRect.w = 405;
          }
        }
      } else if (this.layout == "desktop") {
        fontSize = 18;
        labelRect.x = 38;
        labelRect.y = 160;
      } // ============================ Render


      canvasContext.strokeStyle = "#7FD37C";
      canvasContext.fillStyle = "rgba(0,51,51,0.95)";
      roundRect(canvasContext, labelRect.x, labelRect.y, labelRect.w, labelRect.h, 5, true, labelRect.borderSize); // ---------------------------- Number options
      // set values

      fontSize = 30;
      this.ctx.font = fontSize + "px sans-serif";
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "center";

      if (!this.numerosOptions) {
        this.desenhaCollisionBoxes = true; // Crias as opções

        this.numerosOptions = [];

        for (var i = 0; i < 10; i++) {
          var optionText = (i + 1).toString();
          this.numerosOptions.push({
            option: optionText,
            screenLocation: {
              x: 0,
              y: 0,
              w: 45 + (optionText.length - 1) * 10,
              h: 45
            },
            beingDraged: false,
            mustDraw: true
          });
        } // Embaralha
        // this.numerosOptions = shuffle(this.numerosOptions);
        // Define posições após embaralhar


        var tempI = 0;
        this.numerosOptions = this.numerosOptions.map(function (nOpt) {
          var i = tempI;
          var tempX = labelRect.x + i * (fontSize * 2) + fontSize + 10;
          var tempY = labelRect.y + fontSize + 8; // Responsivity

          if (_this7.layout == "mobile") {
            tempY = labelRect.y + 5 + fontSize + 2.2 * fontSize * Math.floor(i / 5);
            tempX = labelRect.x + i % 5 * (fontSize * 2) + fontSize + 15;

            if (canvas.width <= 320) {
              tempX = labelRect.x + i % 5 * (fontSize * 1.9) + fontSize + 5;
              nOpt.screenLocation.w = 45 + (nOpt.option.length - 1) * 10;
              nOpt.screenLocation.h = 45;
            } else if (canvas.width <= 375) {
              tempX = labelRect.x + i % 5 * (fontSize * 2.35) + fontSize + 5;
              nOpt.screenLocation.w = 50 + (nOpt.option.length - 1) * 10;
              nOpt.screenLocation.h = 50;
            } else if (canvas.width <= 768) {
              tempX = labelRect.x + i % 5 * (fontSize * 2.75) + fontSize + 5;
              nOpt.screenLocation.w = 55 + (nOpt.option.length - 1) * 10;
              nOpt.screenLocation.h = 55;
            }
          }

          nOpt.screenLocation.x = tempX - nOpt.screenLocation.w / 2;
          nOpt.screenLocation.y = tempY - nOpt.screenLocation.h / 2;
          nOpt.originalLocation = {
            x: nOpt.screenLocation.x,
            y: nOpt.screenLocation.y,
            w: nOpt.screenLocation.w,
            h: nOpt.screenLocation.h
          };
          tempI++;
          return nOpt;
        });
      } else {
        // Desenha as opções
        this.numerosOptions.map(function (nOpt) {
          if (nOpt.mustDraw) {
            _this7.ctx.save();

            if (_this7.desenhaCollisionBoxes) {
              canvasContext.strokeStyle = "#FF000099";
              canvasContext.fillStyle = "rgba(255,255,255,0.1)";
              roundRect(canvasContext, nOpt.screenLocation.x, nOpt.screenLocation.y, nOpt.screenLocation.w, nOpt.screenLocation.h, 5, true, 0);
            }

            _this7.ctx.fillStyle = "#FFFFFF"; // Render

            _this7.ctx.fillText(nOpt.option, nOpt.screenLocation.x + nOpt.screenLocation.w / 2, nOpt.screenLocation.y + nOpt.screenLocation.h / 2, 100);

            _this7.ctx.restore();
          }
        });
      }
    }
  }]);

  return TrainGame;
}();

var ImagemObject = function ImagemObject() {
  _classCallCheck(this, ImagemObject);

  this.img = roadZebra;
  this.position = {
    x: 0,
    y: canvas.height / 2
  };
  this.size = {
    x: 2048,
    y: 16
  };
  this.speed = 3;
};

var resizeCanvas = function resizeCanvas() {
  if (engine) {
    canvas.width = window.innerWidth;
    canvas.width > engine.originalWidth; // width = engine.originalWidth;

    canvas.height = window.innerHeight;
    canvas.height > engine.originalHeight; // height = engine.originalHeight;

    if (canvas.width > 1024) canvas.width = 1024;
    if (canvas.width > 768) if (canvas.height > 720) canvas.height = 720;
  }
};

window.addEventListener("resize", function () {
  resizeCanvas();
});
var questions = [];

for (var i = 1; i <= 10; i++) {
  questions.push({
    question: i * 2 + " ÷ 2 =",
    answer: i,
    answered: false
  });
}

var canvasContext = canvas.getContext("2d");
var engine = new TrainGame(questions, canvasContext, canvas);
sheetLoader.loadSheetQueue(function () {
  engine.start();
});
resizeCanvas(); // ===================================== FIM