const express = require("express");
const router = express.Router();

// GET request for the home/index route
router.get("/", (req, res) => {
  res.send("Welcome to the Blog API!");
});

module.exports = router;
