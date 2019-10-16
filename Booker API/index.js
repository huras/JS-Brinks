const express = require("express");

const server = express();

server.get("/teste", (req, res) => {
  return res.send("<h1> kole </h1>");
});

server.listen(3000);
