const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
require("dotenv").config();
const Post = require("../models/post");
const Comment = require("../models/comment");

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the spaceaut
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(401);
  }
}

// GET all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET a specific post by ID
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST a new post
router.post("/posts", authenticateToken, async (req, res) => {
  try {
    // Verify the token
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      // Token is valid, proceed to create a new post
      const newPost = new Post({
        title: req.body.title,
        author: decoded.userId, // Set author from decoded userId
        content: req.body.content,
        published: req.body.published || false,
      });
      const savedPost = await newPost.save();
      res.json(savedPost);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PUT update a specific post by ID
router.put("/posts/:id", authenticateToken, async (req, res) => {
  try {
    // Verify the token
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      // Token is valid, proceed to update the post
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          author: decoded.userId, // Set author from decoded userId
          content: req.body.content,
          published: req.body.published,
        },
        { new: true }
      );
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(updatedPost);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE a specific post by ID
router.delete("/posts/:id", authenticateToken, async (req, res) => {
  try {
    // Verify the token
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      // Check if there are any comments associated with the post
      const comments = await Comment.find({ postId: req.params.id });
      if (comments.length > 0) {
        return res.status(400).json({
          message:
            "Cannot delete post with associated comments. Delete comments first.",
        });
      }

      // If no comments associated, proceed with post deletion
      const deletedPost = await Post.findByIdAndDelete(req.params.id);
      if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post deleted successfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
