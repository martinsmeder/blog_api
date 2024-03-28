const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");

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
router.post("/posts/:id/comments", async (req, res) => {
  try {
    const newComment = new Comment({
      content: req.body.content,
      postId: req.params.id,
    });
    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PUT update a specific comment by ID for a specific post
router.put("/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE a specific comment by ID for a specific post
router.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(
      req.params.commentId
    );
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
