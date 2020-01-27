
class Matrix {

    constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;
        this.matrix = [];

        for (let i = 0; i < this.rows; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = 0;
            }
        }
    }

    randomize (max = 10){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = Math.floor(Math.random() * 10);
            }
        }
    }

    add (n) {
        if( n instanceof Matrix){
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.matrix[i][j] += n.matrix[i][j];
                }
            }
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.matrix[i][j] += n;
                }
            }
        }
    }

    multiply (n){
        if( n instanceof Matrix){ // Matrix multiplication
            if(this.cols !== n.rows){
                console.log('Matrizes incompatíveis');
                return undefined;
            }

            let result = new Matrix(this.rows, n.cols);
            let a = this.matrix;
            let b = n.matrix;

            for (let i = 0; i < result.rows; i++) {
                for (let j = 0; j < result.cols; j++) {
                    let sum = 0;
                    for (let k = 0; k < this.rows; k++) {
                        sum += a[i][k] * b[k][j];
                    }

                    result.matrix[i][j] = sum;
                }
            }

            return result;
        } else { //Scalar multiplication
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.matrix[i][j] *= n;
                }
            }
        }
    }

    transposed () {
        let result = new Matrix(this.cols, this.rows);

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                result.matrix[j][i] = this.matrix[i][j];
            }
        }

        return result;
    }
}