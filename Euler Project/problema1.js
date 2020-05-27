let num = 1;
let sum = 0;

for(; num < 1000; num++){
    if (num % 3 == 0 || num % 5 == 0) {
        sum += num;
    }
}

console.log(sum);