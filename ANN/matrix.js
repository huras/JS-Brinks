class Matrix {
  constructor(rows = 1, cols = 1) {
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

  semelhanca(rivalMatrix) {
    let semelhancas = 0;
    let elements = this.rows * this.cols;

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.data[i][j] == rivalMatrix.data[i][j]) {
          semelhancas++;
        }
      }
    }

    return semelhancas / elements;
  }

  loadFromJSON(json) {
    this.rows = json.rows;
    this.cols = json.cols;
    this.data = json.data;
  }

  randomize(maxValue = 1) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = Math.random() * maxValue;
      }
    }
  }

  randomizeNegative(maxValue = 1, mutationChance = 1) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.random() <= mutationChance)
          this.data[i][j] = maxValue - Math.random() * maxValue * 2;
      }
    }
  }

  add(n) {
    if (n instanceof Matrix) {
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

  map(f) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = f(val, i, j, this.data);
      }
    }
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  to2DArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      arr.push([]);
      for (let j = 0; j < this.cols; j++) {
        arr[i][j] = this.data[i][j];
      }
    }
    return arr;
  }

  static multiply(m, n) {
    if (m.cols !== n.rows) {
      console.log("Matrizes incompatíveis");
      m.print();
      n.print();
      return undefined;
    }

    let result = new Matrix(m.rows, n.cols);
    let a = m.data;
    let b = n.data;

    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        let sum = 0;
        for (let k = 0; k < m.cols; k++) {
          sum += a[i][k] * b[k][j];
        }

        result.data[i][j] = sum;
      }
    }

    return result;
  }

  static subtract(m, n) {
    if (m.cols != n.cols || m.rows != n.rows) {
      console.log("Tamanhos diferentes na subtração das matrizes:");
      m.print();
      n.print();
      return undefined;
    }

    let result = new Matrix(m.rows, n.cols);
    let a = m.data;
    let b = n.data;

    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        result.data[i][j] = m.data[i][j] -= n.data[i][j];
      }
    }

    return result;
  }

  transposed() {
    let result = new Matrix(this.cols, this.rows);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.data[j][i] = this.data[i][j];
      }
    }

    return result;
  }

  print(text = null) {
    if (text) {
      console.log(text + " table:");
    }
    console.table(this.data);
  }

  static fromArray(array) {
    let retorno = new Matrix(array.length, 1);
    for (let i = 0; i < array.length; i++) {
      retorno.data[i][0] = array[i];
    }
    return retorno;
  }

  static fromArray2D(array) {
    let retorno = new Matrix(array.length, array[0].length);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        retorno.data[j][i] = array[i][j];
      }
    }

    return retorno;
  }

  clone() {
    let retorno = new Matrix(this.rows, this.cols);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        retorno.data[i][j] = this.data[i][j];
      }
    }

    return retorno;
  }
}
