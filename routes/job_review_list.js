const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");

router.get("/job_review_list", async (req, res) => {
  const title = "취업 후기 게시판";
  const head = ``;
  let body = `게시글 순서 | 게시글 제목 | 작성 날짜 | 작성자 <br>`;
  let i = 0;
  const data = await pool.query(`SELECT * FROM job_review`);
  let data_det = data[0];
  //   console.log(data_det.length);

  while (i < data_det.length) {
    const data2 = await pool.query(`SELECT name FROM user where iduser = ?`, [
      data_det[i].iduser,
    ]);
    // console.log(data2[0][0].name);
    body += `<a href = "/job_review_detail/${data_det[i].review_no}">${data_det[i].review_no}</a> | ${data_det[i].review_title} | ${data_det[i].upload_time} | ${data2[0][0].name}} <br>`;
    i++;
  }
  body += `<a href = "/job_review_write">취업 후기글 작성하러 가기</a>`;
  var html = templates.HTML(title, head, body);
  res.send(html);
});

module.exports = router;
