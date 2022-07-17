const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");

function date_to_str(format) {
  var year = format.getFullYear();
  var month = format.getMonth() + 1;
  if (month < 10) month = "0" + month;
  var date = format.getDate();
  if (date < 10) date = "0" + date;
  var hour = format.getHours();
  if (hour < 10) hour = "0" + hour;
  var min = format.getMinutes();
  if (min < 10) min = "0" + min;
  var sec = format.getSeconds();
  if (sec < 10) sec = "0" + sec;
  return year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec;
}

router.get("/edu_contest_list", async (req, res) => {
  const title = "교육/공모전 게시판";
  const head = ``;
  let body = `게시글 제목 | 작성 날짜<br>`;
  //  | 작성자 <br>`;
  let i = 0;
  const data = await pool.query(
    `SELECT * FROM edu_contest ORDER BY upload_time DESC`
  );
  let data_det = data[0];

  while (i < data_det.length) {
    const data2 = await pool.query(`SELECT name FROM user where iduser = ?`, [
      data_det[i].iduser,
    ]);
    let timestamp = data_det[i].upload_time;
    let upload_time = date_to_str(timestamp);
    // console.log(upload_time);
    body += `<a href = "/edu_contest_detail/${data_det[i].edu_contest_no}"><div>${data_det[i].edu_contest_title}| ${upload_time}<br></div></a> `;
    //익명으로 얘기된 거면 제외 | ${data2[0][0].name}} <br>`;
    i++;
  }
  body += `<br><a href = "/edu_contest_write">교육/공모전 글 작성하러 가기</a> <br> <a href="/"> 홈으로 돌아가기 </a>`;
  var html = templates.HTML(title, head, body);
  res.send(html);
});

module.exports = router;
