const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const multer = require("multer");
const path = require("path");

//교육 공모전 댓글 수정하기
router.post("/", async (req, res, next) => {
  const no = req.body.no;
  const data = await pool.query(
    `SELECT * FROM edu_contest_comment WHERE no=${no}`
  );
  const title = "교육/공모전 댓글 수정";
  const head = ``;
  let body = `
    <form action="/api/edu_contest_comment_edit/update" method ="post" accept-charset="UTF-8">
    <table>
    <tr>
    <td>댓글 내용 수정</td>
    <td><input type="text" name="content" value="${data[0][0].content}"></td>
    </tr>
    <tr>
    <input type="hidden" name="no" value="${data[0][0].no}">
    </tr>
  <td><input type="submit" value="수정"></td>
  </table>
  </form>`;

  var html = templates.HTML(title, head, body);
  res.send(html);
});

//수정한 댓글 db에 저장
router.post("/update", async (req, res) => {
  const no = Number(req.body.no);
  const content = req.body.content;

  const sql1 = await pool.query(
    `UPDATE edu_contest_comment SET content=? WHERE no=?`,
    [content, no]
  );

  const sql2 = await pool.query(
    `SELECT edu_contest_no FROM edu_contest_comment WHERE no =?`,
    [no]
  );

  try {
    res.write(
      `<script type="text/javascript">alert('Comment Edit Success !!')</script>`
    );
    res.write(
      `<script>window.location="/api/edu_contest_detail/${sql2[0][0].edu_contest_no}"</script>`
    );
    res.end();
  } catch (err) {
    console.error(err);
    res.write('<script>window.location="/"</script>');
  }
});

//작품전시 글 삭제하기
router.post("/delete", async (req, res) => {
  const no = Number(req.body.no);
  const post_no = req.body.post_no;
  const sql = "DELETE FROM edu_contest_comment WHERE no=?";
  try {
    const data = await pool.query(sql, [no]);
    res.write(
      `<script type="text/javascript">alert('Comment Delete Success !!')</script>`
    );
    res.write(
      `<script>window.location="/api/edu_contest_detail/${post_no}"</script>`
    );
    res.end();
  } catch (err) {
    console.error(err);
    res.write('<script>window.location="/"</script>');
  }
});

module.exports = router;
