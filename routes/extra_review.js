const express = require("express");
const router = express.Router();
const pool = require("../db.js");

router.post("/post", async (req, res) => {
  const post = req.body;
  const title = post.title;
  const content = post.content;

  try {
    const data = await pool.query(
      `INSERT INTO extra_review(title, content, iduser) VALUES(?, ?, ?)`,
      [title, content, req.user.id]
    );
  } catch (err) {
    console.error(err);
  }
  let no = data[0].insertId;
  res.json({no: no});
});

module.exports = router;
