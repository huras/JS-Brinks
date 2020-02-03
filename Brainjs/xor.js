// console.log("brain", brain);

const net = new brain.NeuralNetwork({ hiddenLayers: [3] });

console.log("net", net);

const trainingData = [
  { input: [0, 0], output: [0] },
  { input: [0, 1], output: [1] },
  { input: [1, 0], output: [1] },
  { input: [1, 1], output: [0] }
];

let train = net.train(trainingData, {
  log: error => console.log(error),
  logPeriod: 100
});

console.log(net.run([1, 0]));
console.log(net.toJSON());
