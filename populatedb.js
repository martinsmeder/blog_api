#!/usr/bin/env node
// "Shebang" to ensure that the script will be interpreted using the Node.js interpreter
// Run the script: node populatedb <your MongoDB connection string>

// Get and store command-line arguments passed to the script, excluding the first
// two elements (Node.js executable and script path)
const userArgs = process.argv.slice(2);

// Get models
const Post = require("./models/post");
const Comment = require("./models/comment");

// Import Mongoose
const mongoose = require("mongoose");

// Disable strict mode to allow for more flexible queries
mongoose.set("strictQuery", false);

// Retrieve the MongoDB connection string from command-line arguments
const mongoDB = userArgs[0];

// Define functions to create posts and comments
async function createPost(title, author, date, content, published) {
  const newPost = new Post({
    title,
    author,
    date,
    content,
    published,
  });
  await newPost.save();
  console.log(`Post created: ${title}`);
  return newPost;
}

async function createComment(date, content, postId) {
  const newComment = new Comment({
    date,
    content,
    postId,
  });
  await newComment.save();
  console.log(`Comment created: ${content}`);
}

// Call functions to create posts and comments
async function createPosts() {
  const posts = [
    ["First Post", "Your Name", new Date(), "Content of the first post", false],
    [
      "Second Post",
      "Your Name",
      new Date(),
      "Content of the second post",
      false,
    ],
  ];

  const createdPosts = await Promise.all(
    posts.map(([title, author, date, content, published]) =>
      createPost(title, author, date, content, published)
    )
  );
  return createdPosts;
}

async function createComments(posts) {
  const comments = [
    [new Date(), "Comment on the first post", posts[0]._id],
    [new Date(), "Comment on the second post", posts[1]._id],
  ];

  await Promise.all(
    comments.map(([date, content, postId]) =>
      createComment(date, content, postId)
    )
  );
}

// Define the main function
async function main() {
  console.log("Connecting to the database...");
  await mongoose.connect(mongoDB);

  console.log("Creating posts...");
  const createdPosts = await createPosts();

  console.log("Creating comments...");
  await createComments(createdPosts);

  console.log("Closing database connection...");
  mongoose.connection.close();
}

// Call the main function
main().catch((err) => console.error(err));
