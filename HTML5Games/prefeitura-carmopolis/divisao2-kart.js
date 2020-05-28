//External Methods
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
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
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
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

//==================================================================================================

// Get canvas
canvas = document.getElementById("canvas");
canvas.width -= 4;
canvas.height -= 4;

//load resources
let allImagesLoaded = () => {
  // let mario = new Mario(marioSheet, this.context, new Vector2(20, 32));
  // this.characters.push(mario);
};
const sheetLoader = new SheetLoader(allImagesLoaded);
const skybox = sheetLoader.queueSheet("./img/skybox.png");
const nuvem1 = sheetLoader.queueSheet("./img/nuvem1.png");
const nuvem2 = sheetLoader.queueSheet("./img/nuvem2.png");
const nuvem3 = sheetLoader.queueSheet("./img/nuvem3.png");
const mountains = sheetLoader.queueSheet("./img/mountains.png");
const racer = sheetLoader.queueSheet("./img/kart-racer.png");
const roadZebra = sheetLoader.queueSheet("./img/road-zebra.png");
const roadLine = sheetLoader.queueSheet("./img/faixa.png");
const ui_certo = sheetLoader.queueSheet("./img/ui_certo.png");
const ui_errado = sheetLoader.queueSheet("./img/ui_errado.png");
sheetLoader.loadSheetQueue();

// ===================================== Coisas desse jogo em questão

class KartGame {
  static engineStates = {
    START: "start",
    PLAYING: "load-question",
    RESULT: "wait-answer",
  };

  static gameStates = {
    RESETING: "reseting",
    LOAD_QUESTION: "load-question",
    WAIT_ANSWER: "wait-answer",
    WRONG_ANSWER: "wrong-answer",
    RIGHT_ANSWER: "right-answer",
  };

  constructor(inputQuestions, ctx, canvas) {
    this.racerMobileScale = 0.45;
    this.originalWidth = 1024;
    this.originalHeight = 720;
    this.ctx = ctx;
    this.engineState = KartGame.engineStates.START;
    this.questions = inputQuestions;
    this.inputQuestions = inputQuestions;
    this.mayClick = false;
    this.soundMotor = new sound("./audio/ronco-motor.mp3");
    canvas.addEventListener(
      "click",
      (event) => {
        this.clickCanvas(event);
      },
      false
    );
  }

  start() {
    this.gameLoop();
  }

  clickCanvas(event) {
    var x = event.pageX - canvas.offsetLeft,
      y = event.pageY - canvas.offsetTop;

    // Collision detection between clicked offset and element.
    if (this.kartRacers && this.racerScale) {
      for (let i = 0; i < this.kartRacers.length; i++) {
        let element = this.kartRacers[i];
        let tempRect = {
          left: element.position.x,
          top: element.position.y - (element.size.y * this.racerScale) / 2,
          width: element.size.x * this.racerScale,
          height: element.size.y * this.racerScale,
        };
        let collided =
          y > tempRect.top &&
          y < tempRect.top + tempRect.height &&
          x > tempRect.left &&
          x < tempRect.left + tempRect.width;

        if (collided) {
          if (
            this.gameState == KartGame.gameStates.WAIT_ANSWER ||
            // this.gameState == KartGame.gameStates.RIGHT_ANSWER ||
            this.gameState == KartGame.gameStates.WRONG_ANSWER
          ) {
            let respostaDoAluno = element.valorBandeira.toString();
            let repostaCorreta = this.currentQuestion.answer.toString();

            if (!this.studentResults[this.currentQuestion.question])
              this.studentResults[this.currentQuestion.question] = [];

            this.studentResults.push({
              question: this.currentQuestion.question,
              studentAnswer: respostaDoAluno,
              success: respostaDoAluno == repostaCorreta,
            });

            if (respostaDoAluno == repostaCorreta) {
              this.soundMotor.play();
              this.gameState = KartGame.gameStates.RIGHT_ANSWER;
              this.winnerKart = this.kartRacers[i];

              setTimeout(() => {
                this.respawnRacers();
                this.gameState = KartGame.gameStates.LOAD_QUESTION;
              }, 5000);
            } else {
              this.gameState = KartGame.gameStates.WRONG_ANSWER;

              setTimeout(() => {
                if (this.gameState == KartGame.gameStates.WRONG_ANSWER)
                  this.gameState = KartGame.gameStates.WAIT_ANSWER;
              }, 2000);
            }
          }
          break;
        }
      }
    }
  }

  gameLoop = () => {
    this.layout = canvas.width > 768 ? "desktop" : "mobile";

    window.requestAnimationFrame(() => {
      this.gameLoop();
    });

    switch (this.engineState) {
      case KartGame.engineStates.START:
        {
          this.renderBG();
          this.engineState = KartGame.engineStates.PLAYING;
          this.gameState = KartGame.gameStates.RESETING;
          this.studentResults = [];
        }
        break;
      case KartGame.engineStates.PLAYING:
        {
          switch (this.gameState) {
            case KartGame.gameStates.RESETING:
              {
                this.winnerKart = undefined;
                this.mayClick = false;
                this.renderBG();
                this.respawnRacers();
                this.gameState = KartGame.gameStates.LOAD_QUESTION;
                this.activeQuestions = [...this.questions];
                this.pistaSpeed = 8;
              }
              break;
            case KartGame.gameStates.LOAD_QUESTION:
              {
                this.mayClick = false;

                if (this.currentQuestion) {
                  this.activeQuestions.splice(
                    this.activeQuestions.indexOf(this.currentQuestion),
                    1
                  );
                  this.currentQuestion = undefined;
                }

                if (this.activeQuestions.length > 0) {
                  this.currentQuestion = this.activeQuestions[
                    (Math.random() * this.activeQuestions.length) | 0
                  ];
                  shuffle(this.currentQuestion.options);

                  this.gameState = KartGame.gameStates.WAIT_ANSWER;
                } else {
                  this.engineState = KartGame.engineStates.RESULT;
                }
              }
              break;
            case KartGame.gameStates.WAIT_ANSWER:
              {
                this.mayClick = true;
                this.renderBG();
                this.renderRacers();
                this.renderQuestion(this.currentQuestion);
              }
              break;
            case KartGame.gameStates.WRONG_ANSWER:
              {
                this.mayClick = true;
                this.renderBG();
                this.renderRacers();
                this.renderQuestion(this.currentQuestion);
                this.renderWrongAnswer();
              }
              break;
            case KartGame.gameStates.RIGHT_ANSWER:
              {
                this.mayClick = false;
                this.renderBG();
                this.renderRacers();
                this.renderQuestion(this.currentQuestion);
                this.renderRightAnswer();
              }
              break;
          }
        }
        break;
      case KartGame.engineStates.RESULT:
        {
          this.renderBG();
          this.renderResults();
        }
        break;
    }
    // console.log("frame");
  };

  // ============================================ Game logic

  respawnRacers() {
    const estradaInicio = canvas.height / 2;
    const estradaFim = estradaInicio + canvas.height / 2;
    let getEstradaCoordinates = (y = 1) => {
      return estradaInicio + y * (estradaFim - estradaInicio);
    };

    //Cria tipo corredor
    this.kartRacers = [];
    let kartRacer = (
      valorBandeira = 0,
      position = {
        x: Math.random() * window.innerWidth * 1.25,
        y: Math.random() * 200,
      }
    ) => {
      let novoRacer = {};
      novoRacer.valorBandeira = valorBandeira;
      novoRacer.position = position;
      novoRacer.size = { x: 351, y: 305 };
      return novoRacer;
    };

    // Cria corredores
    this.racerScale = canvas.width > 768 ? 0.7 : this.racerMobileScale;
    this.kartRacers.push(
      kartRacer(6, {
        x: -401,
        y: getEstradaCoordinates(this.layout == "desktop" ? 0.05 : 0.1),
      })
    );
    this.kartRacers.push(
      kartRacer(66, {
        x: -351 + 125,
        y: getEstradaCoordinates(0.4),
      })
    );
    this.kartRacers.push(
      kartRacer(999, {
        x: -201,
        y: getEstradaCoordinates(0.68),
      })
    );
  }

  // ============================================ Rendering

  renderBG() {
    this.renderCeu();
    this.renderNuvens();
    this.renderMontanhas();
    this.renderRoad();
  }

  renderCeu() {
    this.ctx.drawImage(
      skybox,
      0,
      0,
      1024,
      720,

      0,
      0,
      canvas.width,
      canvas.height / 2
    );
  }

  renderNuvens() {
    this.nuvemScale = canvas.width > 768 ? 0.8 : 0.5;

    if (!this.nuvens) {
      this.nuvens = [];
      this.maxNuvemHeight = 200 * this.nuvemScale;

      let nuvemTipoA = (
        speed = Math.random() * 1 + 0.2,
        position = {
          x: Math.random() * window.innerWidth * 1.25,
          y: Math.random() * 200,
        }
      ) => {
        let novaNuvem = {};
        novaNuvem.img = nuvem1;
        novaNuvem.position = position;
        novaNuvem.size = { x: 137, y: 70 };
        novaNuvem.speed = speed;
        return novaNuvem;
      };
      let nuvemTipoB = (
        speed = Math.random() * 1 + 0.2,
        position = {
          x: Math.random() * window.innerWidth * 1.25,
          y: Math.random() * 200,
        }
      ) => {
        let novaNuvem = {};
        novaNuvem.img = nuvem2;
        novaNuvem.position = position;
        novaNuvem.size = { x: 220, y: 146 };
        novaNuvem.speed = speed;
        return novaNuvem;
      };
      let nuvemTipoC = (
        speed = Math.random() * 1 + 0.2,
        position = {
          x: Math.random() * window.innerWidth * 1.25,
          y: Math.random() * this.maxNuvemHeight,
        }
      ) => {
        let novaNuvem = {};
        novaNuvem.img = nuvem3;
        novaNuvem.position = position;
        novaNuvem.size = { x: 229, y: 99 };
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

    this.nuvens = this.nuvens.map((nuvem) => {
      this.ctx.drawImage(
        nuvem.img,
        0,
        0,
        nuvem.size.x,
        nuvem.size.y,

        nuvem.position.x,
        nuvem.position.y,
        nuvem.size.x * this.nuvemScale,
        nuvem.size.y * this.nuvemScale
      );

      nuvem.position.x -= nuvem.speed;

      if (nuvem.position.x + nuvem.size.x < 0) {
        nuvem.position.x = window.innerWidth;
        nuvem.position.y = Math.random() * this.maxNuvemHeight;
        nuvem.speed = Math.random() * 1 + 0.1;
      }

      return nuvem;
    });
  }

  renderMontanhas() {
    this.ctx.drawImage(
      mountains,
      0,
      0,
      1024,
      215,

      0,
      canvas.height / 2 - 100,
      canvas.width,
      215
    );
  }

  renderRoad() {
    // Asfalto
    const asfaltoHeight = canvas.height / 2;

    if (!this.pistaSpeed) {
      this.pistaSpeed = 6;
    }

    this.ctx.fillStyle = "#3A3B3C";
    this.ctx.fillRect(0, canvas.height / 2, canvas.width, asfaltoHeight);

    // Zebra Asfalto
    if (!this.roadZebra) {
      this.roadZebra = {
        img: roadZebra,
        position: { x: 0, y: canvas.height / 2 },
        size: { x: 2048, y: 16 },
      };
    }

    this.roadZebra.position.x -= this.pistaSpeed;
    if (this.roadZebra.position.x < -145) {
      this.roadZebra.position.x = 0;
    }

    this.ctx.drawImage(
      roadZebra,
      0,
      0,
      this.roadZebra.size.x,
      this.roadZebra.size.y,

      this.roadZebra.position.x,
      canvas.height / 2,
      this.roadZebra.size.x,
      this.roadZebra.size.y
    );

    // Faixa asfalto
    if (!this.roadLine) {
      this.roadLine = {
        img: roadLine,
        position: { x: 0, y: canvas.height / 2 },
        size: { x: 2048, y: 16 },
      };
    }

    this.roadLine.position.x -= this.pistaSpeed * 1.85;
    if (this.roadLine.position.x < -125) {
      this.roadLine.position.x = 0;
    }

    this.ctx.drawImage(
      roadLine,
      0,
      0,
      this.roadLine.size.x,
      this.roadLine.size.y,

      this.roadLine.position.x,
      canvas.height - (7 * canvas.height) / 24,
      this.roadLine.size.x,
      this.roadLine.size.y
    );
  }

  renderRacers() {
    const showHitBoxes = false;

    if (
      this.gameState == KartGame.gameStates.WAIT_ANSWER ||
      this.gameState == KartGame.gameStates.WRONG_ANSWER
    ) {
      let carsInPosition = 0;
      let targetPositions = [2, 185, 2];

      if (this.layout == "desktop") {
        targetPositions = [2, 255, 2];
      }

      // Avança todos os carros até a posição deles
      this.kartRacers.map((item, i, arr) => {
        let speedToMove = 8 * Math.sign(targetPositions[i] - item.position.x);
        if (Math.abs(targetPositions[i] - item.position.x) < 8)
          speedToMove = targetPositions[i] - item.position.x;

        if (item.position.x != targetPositions[i]) {
          arr[i].position.x += speedToMove;
        } else {
          carsInPosition++;
        }
      });

      if (carsInPosition == targetPositions.length) {
        this.pistaSpeed = 6;
      }
    } else if (this.gameState == KartGame.gameStates.RIGHT_ANSWER) {
      let carsInPosition = 0;
      let targetPositions = { loser: -400, winner: 400 };
      this.racerScale = canvas.width > 768 ? 0.7 : this.racerMobileScale;

      this.kartRacers.map((item, i, arr) => {
        let targetPosition = -400;

        if (this.winnerKart == item) {
          targetPosition =
            canvas.width / 2 - (item.size.x * this.racerScale) / 2;

          let speedToMove = 4 * Math.sign(targetPosition - item.position.x);
          if (Math.abs(targetPosition - item.position.x) < 4)
            speedToMove = targetPosition - item.position.x;

          if (item.position.x != targetPosition) {
            arr[i].position.x += speedToMove;
          } else {
            carsInPosition++;
          }
        } else {
          if (item.position.x > targetPosition) {
            arr[i].position.x -= 7;
          } else {
            carsInPosition++;
          }
        }
      });

      if (carsInPosition == targetPositions.length) {
        this.pistaSpeed = 6;
      }
    }

    this.kartRacers.map((item) => {
      this.racerScale = canvas.width > 768 ? 0.7 : this.racerMobileScale;
      this.ctx.drawImage(
        racer,
        0,
        0,
        item.size.x,
        item.size.y,

        item.position.x,
        item.position.y - (item.size.y / 2) * this.racerScale,
        item.size.x * this.racerScale,
        item.size.y * this.racerScale
      );

      if (showHitBoxes) {
        this.ctx.fillStyle = "#FF00005C";
        this.ctx.fillRect(
          item.position.x,
          item.position.y - (item.size.y * this.racerScale) / 2,
          item.size.x * this.racerScale,
          item.size.y * this.racerScale
        );
      }
    });
  }
  renderRacerFlags(question) {
    let questionOptinIndex = 0;
    this.kartRacers.map((item, index) => {
      this.ctx.drawImage(
        racer,
        0,
        0,
        item.size.x,
        item.size.y,

        item.position.x,
        item.position.y - (item.size.y / 2) * this.racerScale,
        item.size.x * this.racerScale,
        item.size.y * this.racerScale
      );

      item.valorBandeira = question.options[index].toString();
      this.ctx.font = "bold 24px sans-serif";
      this.ctx.fillStyle = "#000000";
      this.ctx.fillText(
        item.valorBandeira,
        item.position.x +
          165 * this.racerScale -
          (item.valorBandeira.toString().length - 1) * 8,
        item.position.y - 95 * this.racerScale,
        140
      );
    });
  }
  renderMathOperation(question) {
    let rect = {
      x: canvas.width / 2 - 80,
      y: 100,
      w: 160,
      h: 70,
      borderSize: 2,
    };

    // BG
    canvasContext.strokeStyle = "#9FD37C";
    canvasContext.fillStyle = "#003300CC";
    roundRect(
      canvasContext,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      5,
      true,
      rect.borderSize
    );

    // Operation
    this.ctx.font = "36px sans-serif";
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      question.question,
      rect.x + rect.w / 2,
      rect.y + rect.h / 2 + rect.borderSize * 2,
      1000
    );

    //Retorna valores ao normal
    this.ctx.textAlign = "start";
    this.ctx.textBaseline = "alphabetic";
  }

  renderQuestionLabel2() {
    //Set sizes
    let fontSize = 18;
    let labelRect = {
      x: 50,
      y: 5,
      w: 300,
      h: undefined,
      padding: { x: 10, y: 10 },
      borderSize: 4,
    };
    labelRect.h =
      fontSize * 2 + labelRect.padding.y * 2 + labelRect.borderSize * 2;

    if (this.layout == "desktop") {
      labelRect.w *= 2;
    }

    // BG
    canvasContext.strokeStyle = "#9FD37C";
    canvasContext.fillStyle = "#FFFFFF";
    roundRect(
      canvasContext,
      labelRect.x,
      labelRect.y,
      labelRect.w,
      labelRect.h,
      5,
      true,
      labelRect.borderSize
    );

    //Texto
    this.ctx.font = fontSize + "px sans-serif";
    this.ctx.fillStyle = "black";

    if (this.layout == "desktop") {
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "center";

      this.ctx.fillText(
        "Clique no carro que apresenta o resultado da divisão.",
        labelRect.x + labelRect.w / 2 + labelRect.borderSize * 2 - fontSize / 2,
        labelRect.y + labelRect.h / 2 + labelRect.borderSize * 2 - fontSize / 2,
        1000
      );

      //Retorna valores ao normal
      this.ctx.textAlign = "start";
      this.ctx.textBaseline = "alphabetic";
    } else {
      this.ctx.fillText(
        "Clique no carro que apresenta o",
        labelRect.x + labelRect.padding.x + 20,
        labelRect.y + labelRect.padding.y + fontSize,
        canvas.width - labelRect.x
      );

      this.ctx.fillText(
        "resultado da divisão.",
        labelRect.x + labelRect.padding.x + 20,
        labelRect.y + labelRect.padding.y + fontSize * 2,
        canvas.width - labelRect.x
      );
    }

    //Circle with number
    let circleRadius =
      (fontSize * 2 + labelRect.padding.y * 2 + labelRect.borderSize * 2) / 2;
    this.ctx.beginPath();
    this.ctx.arc(
      labelRect.x - circleRadius + 20,
      labelRect.y + circleRadius,
      circleRadius,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.fillStyle = "#75C043";
    this.ctx.fill();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "#9FD37C";
    this.ctx.stroke();

    this.ctx.font = "bold 42px sans-serif";
    this.ctx.strokeStyle = "#FFFFFF";
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillText(
      "6",
      labelRect.x - circleRadius + 20 - 12,
      labelRect.y + circleRadius + 14,
      canvas.width - labelRect.x
    );
  }

  renderQuestion(question) {
    this.renderQuestionLabel2();
    this.renderRacerFlags(question);
    this.renderMathOperation(question);
  }

  renderRightAnswer() {
    this.ctx.drawImage(
      ui_certo,
      0,
      0,
      108,
      108,

      canvas.width / 2 - 54,
      canvas.height / 2 - 54,
      108,
      108
    );
  }

  renderWrongAnswer() {
    this.ctx.drawImage(
      ui_errado,
      0,
      0,
      108,
      108,

      canvas.width / 2 - 54,
      canvas.height / 2 - 54,
      108,
      108
    );
  }

  renderResults() {
    //Set sizes
    let fontSize = 42;
    let labelRect = {
      x: 0.025 * canvas.width,
      y: 0.25 * canvas.height,
      w: 0.95 * canvas.width,
      h: 0.5 * canvas.height,
      padding: { x: 50, y: 50 },
      borderSize: 4,
    };

    // BG
    canvasContext.strokeStyle = "#7D3F00";
    canvasContext.fillStyle = "#003333FC";
    roundRect(
      canvasContext,
      labelRect.x,
      labelRect.y,
      labelRect.w,
      labelRect.h,
      5,
      true,
      labelRect.borderSize
    );

    // FRAG
    //Texto
    this.ctx.font = fontSize + "px sans-serif";
    this.ctx.fillStyle = "#FFFFFF";

    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";

    let frag = { respostas: 0, acertos: 0 };

    for (let a = 0; a < this.studentResults.length; a++) {
      const question = this.studentResults[a];
      frag.respostas++;
      if (question.success) frag.acertos++;
    }

    this.ctx.fillText(
      "Nota: " + ((frag.acertos / frag.respostas) * 100).toFixed(0) + "%",
      labelRect.x + labelRect.w / 2 + labelRect.borderSize * 2 - fontSize / 2,
      labelRect.y +
        labelRect.h / 2 +
        labelRect.borderSize * 2 -
        fontSize / 2 -
        fontSize,
      1000
    );

    fontSize = 24;
    this.ctx.font = fontSize + "px sans-serif";
    this.ctx.fillText(
      "Acertos: " + frag.acertos,
      labelRect.x + labelRect.w / 2 + labelRect.borderSize * 2 - fontSize / 2,
      labelRect.y +
        labelRect.h / 2 +
        labelRect.borderSize * 2 -
        fontSize / 2 +
        fontSize * 2,
      1000
    );
    this.ctx.fillText(
      "Tentativas: " + frag.respostas,
      labelRect.x + labelRect.w / 2 + labelRect.borderSize * 2 - fontSize / 2,
      labelRect.y +
        labelRect.h / 2 +
        labelRect.borderSize * 2 -
        fontSize / 2 +
        fontSize * 3.5,
      1000
    );
    this.ctx.fillText(
      "Total de perguntas: " + this.inputQuestions.length,
      labelRect.x + labelRect.w / 2 + labelRect.borderSize * 2 - fontSize / 2,
      labelRect.y +
        labelRect.h / 2 +
        labelRect.borderSize * 2 -
        fontSize / 2 +
        fontSize * 5,
      1000
    );

    //Retorna valores ao normal
    this.ctx.textAlign = "start";
    this.ctx.textBaseline = "alphabetic";
  }
}

class ImagemObject {
  constructor() {
    this.img = roadZebra;
    this.position = { x: 0, y: canvas.height / 2 };
    this.size = { x: 2048, y: 16 };
    this.speed = 3;
  }
}

let resizeCanvas = () => {
  canvas.width = window.innerWidth - 4;
  if (canvas.width > this.engine.originalWidth)
    canvas.width = this.engine.originalWidth;

  canvas.height = window.innerHeight - 4;
  if (canvas.height > this.engine.originalHeight)
    canvas.height = this.engine.originalHeight;
};
window.addEventListener("resize", () => {
  resizeCanvas();
});

const questions = [];
for (let i = 1; i <= 10; i++) {
  questions.push({
    question: i * 2 + " ÷ 2",
    answer: i,
    options: i == 1 ? [1, 2, 3] : [i - 1, i, i + 1],
  });
}
const canvasContext = canvas.getContext("2d");
this.engine = new KartGame(questions, canvasContext, canvas);
resizeCanvas();
this.engine.start();
// ===================================== FIM
