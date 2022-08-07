const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");

//댓글 저장
router.post("/", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const comment = post.edu_contest_comment_cont;
  const cont_no = post.edu_contest_no;
  const my_secret_checkbox = post.my_secret_checkbox ? 1 : 0;
  const my_anon_checkbox = post.my_anon_checkbox ? 1 : 0;

  try {
    const data = await pool.query(
      `INSERT INTO edu_contest_comment(content, iduser, edu_contest_no, secret_check, anon_check) VALUES(?, ?, ?, ?, ?)`,
      [comment, user, cont_no, my_secret_checkbox, my_anon_checkbox]
    );
    res.writeHead(302, {
      Location: "/api/edu_contest_detail/" + cont_no,
    });
    res.end();
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
