const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
require("dotenv").config();
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

// GET all comments for a specific post
router.get("/posts/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET a specific comment by ID for a specific post
router.get("/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      postId: req.params.postId,
    });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST a new comment for a specific post
router.post("/posts/:id/comments", authenticateToken, async (req, res) => {
  try {
    // Verify the token
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      // Token is valid, proceed to create a new comment
      const newComment = new Comment({
        content: req.body.content,
        postId: req.params.id,
      });
      const savedComment = await newComment.save();
      res.json(savedComment);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PUT update a specific comment by ID for a specific post
router.put(
  "/posts/:postId/comments/:commentId",
  authenticateToken,
  async (req, res) => {
    try {
      // Verify the token
      jwt.verify(req.token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }
        // Token is valid, proceed to update the comment
        const updatedComment = await Comment.findByIdAndUpdate(
          req.params.commentId,
          { content: req.body.content },
          { new: true }
        );
        if (!updatedComment) {
          return res.status(404).json({ message: "Comment not found" });
        }
        res.json(updatedComment);
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE a specific comment by ID for a specific post
router.delete(
  "/posts/:postId/comments/:commentId",
  authenticateToken,
  async (req, res) => {
    try {
      // Verify the token
      jwt.verify(req.token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }
        // Token is valid, proceed to delete the comment
        const deletedComment = await Comment.findByIdAndDelete(
          req.params.commentId
        );
        if (!deletedComment) {
          return res.status(404).json({ message: "Comment not found" });
        }
        res.json({ message: "Comment deleted successfully" });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
