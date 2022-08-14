const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const date_fns = require("date-fns");

//수정한 댓글 db에 저장
router.post("/update", async (req, res) => {
  const no = req.body.no;
  const content = req.body.content;
  let status = 404;

  try {
    const sql1 = await pool.query(
      `UPDATE edu_contest_comment SET content=? WHERE no=?`,
      [content, no]
    );
    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

//댓글 삭제하기
router.post("/delete", async (req, res) => {
  const no = req.body.no;
  let status = 404;

  try {
    const data = await pool.query(
      "DELETE FROM edu_contest_comment WHERE no=?",
      [no]
    );
    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

//대댓글 삭제
router.post("/rec_delete", async (req, res) => {
  let post = req.body;
  const comment_no = post.no;
  let status = 404;

  try {
    const comment_delete = await pool.query(
      `UPDATE edu_contest_comment SET recomment = null, recomment_check =? WHERE no = ?`,
      [0, comment_no]
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
