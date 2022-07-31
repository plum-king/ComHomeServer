const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const multer = require('multer');
const path = require('path');

//채용/인턴십 목록보기
router.get("/", async (req, res) => {
    const title = "공지사항-채용인턴십";
    const head = ``;
    let body = `게시글 넘버 | 게시글 제목 | 조회수 | 작성 날짜 <br>`;
    let i = 0;
    const data = await pool.query(`SELECT * FROM recruit_intern ORDER BY not_created_date DESC`);
    const time_data = await pool.query(`SELECT date_format(not_created_date, '%Y-%m-%d') FROM recruit_intern ORDER BY not_created_date DESC`);
    let data_det = data[0];
    //console.log(data_det);
  
    while (i < data_det.length) {
      const data2 = await pool.query(`SELECT name FROM user where iduser = ?`, [
        data_det[i].user_id,
      ]);
      // console.log(data2[0][0].name);
      body += `<a href = "/api/recruit_internship_detail/${data_det[i].notice_id}">${data_det.length-i}</a> | ${data_det[i].not_title} | ${data_det[i].not_views} | ${time_data[0][i]["date_format(not_created_date, '%Y-%m-%d')"]} <br>`;
      i++;
    }
    body += `<br><a href = "/api/recruit_internship/post">채용인턴십 글 작성하기</a>`;
    var html = templates.HTML(title, head, body);
    res.send(html);
  });

  module.exports = router;