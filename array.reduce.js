let numbers = [1, 2, 3, 4, 5];

let sum = numbers.reduce((acumulador, item, index, array) => {
  return (acumulador += item);
}, 0);

let mult = numbers.reduce((acumulador, item, index, array) => {
  return (acumulador *= item);
}, 1);

let dif = numbers.reduce((acumulador, item, index, array) => {
  return (acumulador -= item);
}, 0);

console.log(sum, mult, dif);
console.log(-Infinity > Infinity);
