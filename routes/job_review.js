const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");

router.post("/", async (req, res) => {
  const post = req.body;
  const title = post.title;
  const content = post.content;
  const now = new Date();
  try {
    const data = await pool.query(
      `INSERT INTO job_review(title, content, edited_date, iduser) VALUES(?, ?, ?, ?)`,
      [title, content, now, iduser]
    );
    res.json({
      title: title,
      content: content,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
