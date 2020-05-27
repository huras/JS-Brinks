function setup() {
  // let a = new Matrix(2,3);
  // let b = new Matrix(3,2);

  // a.randomize();
  // b.randomize();

  // console.table(a.data);
  // console.table(b.data);

  // let c = a.multiply(b);
  // console.table(c.data);

  // console.table(c.transposed().data);

  let nn = new NeuralNetwork(2, 2, 1);

  let inputs = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
  ];
  let answers = [[0], [1], [1], [0]];

  for (let i = 0; i < 1; i++) {
    let input = inputs[i];
    let answer = answers[i];
    console.log(input, "input");
    console.log(answer, "answer");
    nn.train(input, answer);
  }
}

setup();
