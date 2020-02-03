function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

class NeuralNetwork {
  constructor(input_nodes, hidden_nodes, output_nodes) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(hidden_nodes, 1);
    this.bias_o = new Matrix(output_nodes, 1);
    this.bias_h.randomize();
    this.bias_o.randomize();
  }

  feedforward(input_array) {
    let input = Matrix.fromArray(input_array);

    //Lots of matrix math
    let hidden = Matrix.multiply(this.weights_ih, input);
    hidden.add(this.bias_h);
    hidden.map(sigmoid);

    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(sigmoid);

    // output.print();
    return output.toArray();
  }

  train(input, answer) {
    let output = this.feedforward(input);
    output = Matrix.fromArray(output);
    output.print("output");

    // Calculate the error
    answer = Matrix.fromArray(answer);
    let outputError = Matrix.subtract(answer, output);
    outputError.print("error");

    // this.weights_ho.print("weights");
    // this.weights_ho.transposed().print("weights transposed");
    let hiddenError = Matrix.multiply(
      this.weights_ho.transposed(),
      outputError
    );
    hiddenError.print("hidden error");

    // let inputError = Matrix.multiply(this.weights_ih.transposed(), hiddenError);
    // inputError.print("input error");
  }
}
