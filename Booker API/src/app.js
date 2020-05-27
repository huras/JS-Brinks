import express from "express";
import routes from "./routes";

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

export default new App().server;
