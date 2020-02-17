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

  loadFromJSONString(jsonString) {
    this.loadFromJSON(JSON.parse(jsonString));
  }

  loadFromJSON(obj) {
    this.input_nodes = obj.input_nodes;
    this.hidden_nodes = obj.hidden_nodes;
    this.output_nodes = obj.output_nodes;

    this.weights_ih.loadFromJSON(obj.weights_ih);
    this.weights_ho.loadFromJSON(obj.weights_ho);

    this.bias_h.loadFromJSON(obj.bias_h);
    this.bias_o.loadFromJSON(obj.bias_o);
  }

  semelhanca(rival) {
    return rival.weights_ih.semelhanca(this.weights_ih);
  }

  baixar(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  download(filename = undefined) {
    if (!filename) {
      filename = "NN-" + new Date().getTime();
    }
    this.baixar(JSON.stringify(this), filename + ".txt", "text/plain");
  }

  clone() {
    let retorno = new NeuralNetwork(
      this.input_nodes,
      this.hidden_nodes,
      this.output_nodes
    );
    retorno.weights_ih = this.weights_ih.clone();
    retorno.weights_ho = this.weights_ho.clone();
    retorno.bias_h = this.bias_h.clone();
    retorno.bias_o = this.bias_o.clone();
    return retorno;
  }

  mutate(maxFactor = 1, mutationChance = 1) {
    let weights_ih_mutations = new Matrix(this.hidden_nodes, this.input_nodes);
    let weights_ho_mutations = new Matrix(this.output_nodes, this.hidden_nodes);
    let bias_h_mutations = new Matrix(this.hidden_nodes, 1);
    let bias_o_mutations = new Matrix(this.output_nodes, 1);

    weights_ih_mutations.randomizeNegative(maxFactor, mutationChance);
    weights_ho_mutations.randomizeNegative(maxFactor, mutationChance);
    bias_h_mutations.randomizeNegative(maxFactor, mutationChance);
    bias_o_mutations.randomizeNegative(maxFactor, mutationChance);

    this.weights_ih.add(weights_ih_mutations);
    this.weights_ho.add(weights_ho_mutations);
    this.bias_h.add(bias_h_mutations);
    this.bias_o.add(bias_o_mutations);
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
