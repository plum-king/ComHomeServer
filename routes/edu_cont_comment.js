const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");

//댓글 저장
router.post("/edu_cont_comment_write", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const comment = post.edu_contest_comment_cont;
  const cont_no = post.edu_contest_no;

  try {
    const data = await pool.query(
      `INSERT INTO edu_contest_comment(edu_contest_comment_cont, iduser, edu_contest_no) VALUES(?, ?, ?)`,
      [comment, user, cont_no]
    );
    res.writeHead(302, {
      Location: "/edu_contest_detail/" + cont_no,
    });
    res.end();
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
