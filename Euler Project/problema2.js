let limite = 4000000;
console.log(limite);

let nextFib = (currentFib, previousFib) => {
    return previousFib + currentFib;
}


let lastFib = 1;
let fib = 2;
let soma = 0;

while(fib < limite){
    

    if(fib % 2 == 0){
        soma += fib;
    }

    nxtFib = fib + lastFib;
    lastFib = fib;
    fib = nxtFib;
}

console.log("soma", soma);