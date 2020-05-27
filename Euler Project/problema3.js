let n = 600851475143;

let p = 2;

let factors = [];

function isPrime(num) {
    // console.log('checking ',num);
    for (let i = 2; i < num; i++) {
        if(num % i == 0)
            return false;
    }

    return true;
}
function nextPrime(num){
    let r = num + 1;
    
    while(!isPrime(r)){
        r = r + 1;
    }

    return r;
}

while(n > 1){
    while(n % p == 0){
        factors.push(p);
        console.log(factors);
        n = n / p;
    }
    // console.log('searching new prime');
    p = nextPrime(p);
    // console.log('found ', p);
}


console.log(n);