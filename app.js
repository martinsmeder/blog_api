const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => console.log("App listening on port 3000!"));
