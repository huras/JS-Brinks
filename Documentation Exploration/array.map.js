let array = [10, 11, 12, 13, 14, undefined];

// const callback = () => {

// };

array.map((valorAtual, indice, arrayOrigem) => {
  console.log(valorAtual, indice, arrayOrigem);
});

let roots = array.map(Math.pow);
console.log(roots);

//Inverte string
var str = "12345";
console.log(str);
str = [].map
  .call(str, function(x) {
    return x;
  })
  .reverse()
  .join("");
console.log(str);

function returnInt(element) {
  return parseInt(element, 2);
}
console.log(array.map(returnInt));
