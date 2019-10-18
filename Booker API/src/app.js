const express = require("express");
const routes = require("./routes");

class App {
  constructor() {
    this.server = express();

    this.setMiddlewares();
    this.setRoutes();
  }

  setMiddlewares() {
    this.server.use(express.json());
  }

  setRoutes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
