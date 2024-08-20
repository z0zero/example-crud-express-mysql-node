const connection = require("../lib/db");

class PostController {
  static async index(req, res) {
    try {
      const [rows] = await connection
        .promise()
        .query("SELECT * FROM posts ORDER BY id DESC");
      res.render("posts/index", { data: rows });
    } catch (err) {
      req.flash("error", err.message);
      res.render("posts/index", { data: [] });
    }
  }

  static createForm(req, res) {
    res.render("posts/create", { title: "", content: "" });
  }

  static async store(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("posts/create", {
        title: req.body.title,
        content: req.body.content,
        errors: errors.array(),
      });
    }

    const { title, content } = req.body;
    try {
      await connection
        .promise()
        .query("INSERT INTO posts SET ?", { title, content });
      req.flash("success", "Post Berhasil Disimpan!");
      res.redirect("/posts");
    } catch (err) {
      req.flash("error", err.message);
      res.render("posts/create", { title, content });
    }
  }

  static async editForm(req, res) {
    const { id } = req.params;
    try {
      const [rows] = await connection
        .promise()
        .query("SELECT * FROM posts WHERE id = ?", [id]);
      if (rows.length === 0) {
        req.flash("error", "Post tidak ditemukan");
        return res.redirect("/posts");
      }
      res.render("posts/edit", rows[0]);
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/posts");
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("posts/edit", {
        id,
        title: req.body.title,
        content: req.body.content,
        errors: errors.array(),
      });
    }

    const { title, content } = req.body;
    try {
      await connection
        .promise()
        .query("UPDATE posts SET ? WHERE id = ?", [{ title, content }, id]);
      req.flash("success", "Post Berhasil Diperbarui!");
      res.redirect("/posts");
    } catch (err) {
      req.flash("error", err.message);
      res.render("posts/edit", { id, title, content });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;
    try {
      await connection.promise().query("DELETE FROM posts WHERE id = ?", [id]);
      req.flash("success", "Post Berhasil Dihapus!");
    } catch (err) {
      req.flash("error", err.message);
    }
    res.redirect("/posts");
  }
}

module.exports = PostController;
