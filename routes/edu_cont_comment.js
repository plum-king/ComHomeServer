const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");

//댓글 저장
router.post("/", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const comment = post.content;
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

//대댓글 저장
router.post("/rec_update", async (req, res) => {
  let post = req.body;
  const comment_no = post.no;
  const cont_no = post.edu_contest_no;
  const content = post.content;
  const my_secret_checkbox = post.my_secret_checkbox ? 1 : 0;

  try {
    const comment_update = await pool.query(
      `UPDATE edu_contest_comment SET recomment = ?, re_secret_check =? WHERE no = ?`,
      [content, my_secret_checkbox, comment_no]
    );
    res.writeHead(302, {
      Location: "/api/edu_contest_detail/" + cont_no,
    });
    res.end();
  } catch (err) {
    console.error(err);
  }
});

//대댓글 삭제
router.post("/rec_delete", async (req, res) => {
  let post = req.body;
  const comment_no = post.no;
  const cont_no = post.edu_contest_no;

  try {
    const comment_delete = await pool.query(
      `UPDATE edu_contest_comment SET recomment = null WHERE no = ?`,
      [comment_no]
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
