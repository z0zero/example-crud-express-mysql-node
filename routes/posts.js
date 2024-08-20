const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

//import database
const connection = require("../lib/db");

/**
 * INDEX POSTS
 */
router.get("/", function (req, res, next) {
  connection.query(
    "SELECT * FROM posts ORDER BY id desc",
    function (err, rows) {
      if (err) {
        req.flash("error", err);
        res.render("posts/index", { data: "" });
      } else {
        res.render("posts/index", { data: rows });
      }
    }
  );
});

/**
 * CREATE POST
 */
router.get("/create", function (req, res, next) {
  res.render("posts/create", {
    title: "",
    content: "",
  });
});

/**
 * STORE POST
 */
router.post("/", upload.none(), function (req, res, next) {
  let title = req.body.title ? req.body.title.trim() : "";
  let content = req.body.content ? req.body.content.trim() : "";
  let errors = false;

  if (title.length === 0 || content.length === 0) {
    errors = true;
    req.flash("error", "Silahkan Masukkan Title dan Konten");
    res.render("posts/create", {
      title: title,
      content: content,
    });
  }

  if (!errors) {
    let formData = { title: title, content: content };
    connection.query(
      "INSERT INTO posts SET ?",
      formData,
      function (err, result) {
        if (err) {
          req.flash("error", err);
          res.render("posts/create", {
            title: formData.title,
            content: formData.content,
          });
        } else {
          req.flash("success", "Post Berhasil Disimpan!");
          res.redirect("/posts");
        }
      }
    );
  }
});

/**
 * EDIT POST - GET
 */
router.get("/:id", function (req, res, next) {
  let id = req.params.id;
  connection.query(
    "SELECT * FROM posts WHERE id = ?",
    [id],
    function (err, rows) {
      if (err) throw err;
      if (rows.length <= 0) {
        req.flash("error", "Post tidak ditemukan");
        res.redirect("/posts");
      } else {
        res.render("posts/edit", {
          id: rows[0].id,
          title: rows[0].title,
          content: rows[0].content,
        });
      }
    }
  );
});

/**
 * UPDATE POST - POST
 */
router.post("/:id", upload.none(), function (req, res, next) {
  let id = req.params.id;
  let title = req.body.title ? req.body.title.trim() : "";
  let content = req.body.content ? req.body.content.trim() : "";
  let errors = false;

  if (title.length === 0 || content.length === 0) {
    errors = true;
    req.flash("error", "Silahkan Masukkan Title dan Konten");
    res.render("posts/edit", {
      id: id,
      title: title,
      content: content,
    });
  }

  if (!errors) {
    let formData = { title: title, content: content };
    connection.query(
      "UPDATE posts SET ? WHERE id = ?",
      [formData, id],
      function (err, result) {
        if (err) {
          req.flash("error", err);
          res.render("posts/edit", {
            id: id,
            title: formData.title,
            content: formData.content,
          });
        } else {
          req.flash("success", "Post Berhasil Diperbarui!");
          res.redirect("/posts");
        }
      }
    );
  }
});

/**
 * DELETE POST
 */
router.get("/:id/delete", function (req, res, next) {
  let id = req.params.id;
  connection.query(
    "DELETE FROM posts WHERE id = ?",
    [id],
    function (err, result) {
      if (err) {
        req.flash("error", err);
      } else {
        req.flash("success", "Post Berhasil Dihapus!");
      }
      res.redirect("/posts");
    }
  );
});

module.exports = router;
