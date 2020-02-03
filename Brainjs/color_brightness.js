//input: red, green, blue
//output: light, neutral, dark
const colors = [
  { green: 0.2, blue: 0.4 },
  { green: 0.4, blue: 0.6 },
  { red: 0.2, green: 0.2, blue: 0.4 },
  { green: 1, blue: 1 },
  { red: 1, green: 1, blue: 1 },
  { red: 1, green: 0.8, blue: 0.8 },
  { red: 1, green: 0.6, blue: 0.6 },
  { red: 1, green: 0.4, blue: 0.4 },
  { red: 1, green: 0.31, blue: 0.31 },
  { red: 0.8 },
  { red: 0.6, green: 0.2, blue: 0.2 }
];

const brightness = [
  { dark: 0.8 },
  { neutral: 0.8 },
  { light: 0.7 },
  { light: 0.8 },
  { light: 0.9 },
  { light: 1 },
  { light: 0.8 },
  { neutral: 0.7, dark: 0.5 },
  { dark: 0.5, neutral: 0.5 },
  { dark: 0.6, neutral: 0.3 },
  { dark: 0.85 },
  { dark: 0.9 }
];

let trainingData = colors.map((item, index) => {
  return {
    input: item,
    output: brightness[index]
  };
});

const net = new brain.NeuralNetwork({ hiddenLayers: [3] });

const stats = net.train(trainingData);

console.log(stats);

console.log(
  net.run({
    red: 0.5
  })
);

//bonus
const invertedTrainingData = colors.map((item, index) => {
  return {
    input: brightness[index],
    output: item
  };
});

const invertedNet = new brain.NeuralNetwork({ hiddenLayers: [3] });

const invertedStatus = invertedNet.train(invertedTrainingData);

console.log(invertedStatus);
