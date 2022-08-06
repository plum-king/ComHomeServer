const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");

router.get("/", async (req, res) => {
  const title = "취업 후기 게시판";
  const head = ``;
  let body = `게시글 제목 | 작성 날짜<br>`;
  //  | 작성자 <br>`;
  let i = 0;
  const data = await pool.query(
    `SELECT * FROM job_review ORDER BY upload_time DESC`
  );
  let data_det = data[0];

  while (i < data_det.length) {
    const data2 = await pool.query(`SELECT name FROM user where iduser = ?`, [
      data_det[i].iduser,
    ]);
    body += `<a href = "/api/job_review_detail/${data_det[i].no}"><div>${data_det[i].title}| ${data_det[i].upload_time}<br></div></a> `;
    i++;
  }
  body += `<br><a href = "/api/job_review_write">취업 후기글 작성하러 가기</a> <br> <a href="/"> 홈으로 돌아가기 </a>`;
  var html = templates.HTML(title, head, body);
  res.send(html);
});

module.exports = router;
