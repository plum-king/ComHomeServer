const express = require("express");
const router = express.Router();
const pool = require("../db.js");

router.post("/post", async (req, res) => {
  const post = req.body;
  const title = post.title;
  const content = post.content;
  let status = 404;
  const now = new Date();

  try {
    const data = await pool.query(
      `INSERT INTO job_review(title, content, edited_date, iduser) VALUES(?, ?, ?, ?)`,
      [title, content, now, iduser]
    );
    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

module.exports = router;
