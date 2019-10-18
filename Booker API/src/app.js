const express = require("express");
const routes = require("./routes");

class App {
  constructor() {
    this.server = express();

  }
}

module.exports = new App().server;
