//shift & pop
var array = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]];
console.log(array);

let first = array.shift();
let last = array.pop();

console.log(array);
console.log(first);
console.log(last);

//===========================
var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

array.map(() => {
  array.shift();
});

console.log(array);
