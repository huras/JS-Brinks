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

  let input = [1, 0];
  let output = nn.feedforward(input);
  console.log(output);
}

setup();
