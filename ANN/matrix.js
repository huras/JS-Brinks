
class Matrix {

    constructor(rows = 1, cols = 1){
        this.rows = rows;
        this.cols = cols;
        this.data = [];

        for (let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    randomize (max = 10){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.floor(Math.random() * 10);
            }
        }
    }

    add (n) {
        if( n instanceof Matrix){
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n.data[i][j];
                }
            }
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n;
                }
            }
        }
    }

    map (f) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let val = this.data[i][j];
                this.data[i][j] = f(val, i, j, this.data);
            }
        }
    }

    static multiply(m,n){
        if(m.cols !== n.rows){
            console.log('Matrizes incompatíveis');
            return undefined;
        }

        let result = new Matrix(m.rows, n.cols);
        let a = m.data;
        let b = n.data;

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                let sum = 0;
                for (let k = 0; k < m.rows; k++) {
                    sum += a[i][k] * b[k][j];
                }

                result.data[i][j] = sum;
            }
        }

        return result;
    }

    transposed () {
        let result = new Matrix(this.cols, this.rows);

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                result.data[j][i] = this.data[i][j];
            }
        }

        return result;
    }

    print()
    {
        console.table(this.data);
    }


}