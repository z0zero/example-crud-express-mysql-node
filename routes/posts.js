const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { body } = require("express-validator");
const PostController = require("../controllers/PostController");

// Middleware validasi
const validatePost = [
  body("title").trim().notEmpty().withMessage("Judul tidak boleh kosong"),
  body("content").trim().notEmpty().withMessage("Konten tidak boleh kosong"),
];

// Index Posts
router.get("/", PostController.index);

// Create Post Form
router.get("/create", PostController.createForm);

// Store Post
router.post("/", upload.none(), validatePost, PostController.store);

// Edit Post Form
router.get("/:id", PostController.editForm);

// Update Post
router.post("/:id", upload.none(), validatePost, PostController.update);

// Delete Post
router.get("/:id/delete", PostController.delete);

module.exports = router;
