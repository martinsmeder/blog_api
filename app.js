const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const routes = require("./routes");

const app = express();

// Set up mongoose connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.DATABASE_URL;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Parse JSON bodies
app.use(express.json());

// Initialize routes
app.use("/", routes.home); // home page
app.use("/", routes.post); // found on /posts
app.use("/", routes.comment); // found on /posts/postId/comments

app.listen(3000, () => console.log("App listening on port 3000!"));
