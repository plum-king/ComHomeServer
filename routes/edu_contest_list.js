const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");

router.get("/", async (req, res) => {
  const title = "교육/공모전 게시판";
  const head = ``;
  let body = `게시글 제목 | 작성 날짜<br>`;
  let i = 0;
  const data = await pool.query(
    `SELECT * FROM edu_contest ORDER BY upload_time DESC`
  );
  let data_det = data[0];

  while (i < data_det.length) {
    const now = new Date();
    const deadline = new Date(data_det[i].end_date);
    if (now > deadline) {
      //모집 마감 후
      body += `<a onclick="return confirm('이미 모집이 마감된 글입니다.')"><span>${data_det[i].title}| ${data_det[i].upload_time}<br></span></a> `;
    } else {
      //모집 마감 전
      body += `<a href = "/api/edu_contest_detail/${data_det[i].no}"><div>${data_det[i].title}| ${data_det[i].upload_time}<br></div></a> `;
    }
    i++;
  }
  body += `<br><a href = "/api/edu_contest_write">교육/공모전 글 작성하러 가기</a> <br> <a href="/"> 홈으로 돌아가기 </a>`;
  var html = templates.HTML(title, head, body);
  res.send(html);
});

module.exports = router;
