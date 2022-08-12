const express = require("express");
const router = express.Router();
const pool = require("../db.js");

//댓글 저장
router.post("/", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const comment = post.content;
  const cont_no = post.edu_contest_no;
  const my_secret_checkbox = post.my_secret_checkbox ? 1 : 0;
  const my_anon_checkbox = post.my_anon_checkbox ? 1 : 0;
  let status = 404;

  try {
    const data = await pool.query(
      `INSERT INTO edu_contest_comment(content, iduser, edu_contest_no, secret_check, anon_check) VALUES(?, ?, ?, ?, ?)`,
      [comment, user, cont_no, my_secret_checkbox, my_anon_checkbox]
    );
    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

//대댓글 저장
router.post("/rec_update", async (req, res) => {
  let post = req.body;
  const comment_no = post.no;
  const content = post.content;
  let status = 404;

  try {
    const comment_update = await pool.query(
      `UPDATE edu_contest_comment SET recomment = ? WHERE no = ?`,
      [content, comment_no]
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
