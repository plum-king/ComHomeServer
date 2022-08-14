const express = require("express");
const router = express.Router();
const pool = require("../db.js");

//수정한 글 db에 저장
router.post("/update", async (req, res) => {
  const post = req.body;
  const no = post.no;
  const title = post.title;
  const content = post.content;
  let status = 404;

  try {
    const sql1 = await pool.query(
      "UPDATE job_review SET title=?, content=? WHERE no=?",
      [title, content, no]
    );
    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

//작품전시 글 삭제하기
router.post("/delete", async (req, res) => {
  const no = req.body.no;
  let status = 404;

  try {
    const data = await pool.query("DELETE FROM job_review WHERE no=?", [no]);
    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

module.exports = router;
