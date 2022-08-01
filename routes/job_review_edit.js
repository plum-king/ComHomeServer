const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const multer = require("multer");
const path = require("path");

//작품전시 글 수정하기
router.post("/:id", async (req, res, next) => {
  const no = req.body.no;
  const data = await pool.query(`SELECT * FROM job_review WHERE no=${no}`);

  const title = "취업후기 글 수정";
  const head = ``;
  let body = `
    <form action="/api/job_review_edit/update/${no}" method ="post" accept-charset="UTF-8">

    <table>
    <tr>
    <td>취업후기글 제목: </td>
    <td><input type="text" name="title" value="${data[0][0].title}"></td>
    </tr>
    <tr>
    <td>취업후기글 소개(내용) :</td>
    <td><textarea name="cont">${data[0][0].cont}</textarea></td>
    </tr>
    <tr>
    <input type="hidden" name="no" value="${data[0][0].no}">
    <td><input type="submit" value="수정"></td>
    </tr>
    </table>

    </form>
    `;

  var html = templates.HTML(title, head, body);
  res.send(html);
});

//수정한 글 db에 저장
router.post("/update/:id", async (req, res) => {
  const no = req.body.no;
  const title = req.body.title;
  const cont = req.body.cont;

  try {
    const sql1 = await pool.query(
      "UPDATE job_review SET title=?, cont=? WHERE no=?",
      [title, cont, no]
    );

    res.write(
      `<script type="text/javascript">alert('Job_review Edit Success !!')</script>`
    );
    res.write(
      `<script>window.location="/api/job_review_detail/${no}"</script>`
    );
    res.end();
  } catch (err) {
    console.error(err);
    res.write('<script>window.location="/"</script>');
  }
});

//작품전시 글 삭제하기
router.post("/delete/:review_no", async (req, res) => {
  const no = req.body.no;

  try {
    const data = await pool.query("DELETE FROM job_review WHERE no=?", [no]);
    res.write(
      `<script type="text/javascript">alert('Job_review Delete Success !!')</script>`
    );
    res.write(`<script>window.location="/api/job_review_list"</script>`);
    res.end();
  } catch (err) {
    console.error(err);
    res.write('<script>window.location="/"</script>');
  }
});

module.exports = router;
