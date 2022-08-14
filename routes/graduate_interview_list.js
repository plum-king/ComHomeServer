const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");

router.get("/", async (req, res) => {
    const title = "졸업생 인터뷰 list";
    const head = ``;
    let name;
    let body = `선배이름 | 선배아이디 | 직업 | 학번 | 간단자기소개<br>`;
    let i = 0;
    const data = await pool.query(
      `SELECT * FROM graduate_interview`
    );
    let data_det = data[0];

    while (i < data_det.length) {
      name= await pool.query( `SELECT name FROM user where iduser=${data_det[i].graduateId}`)
      body += `<div>${name[0][0].name} 선배님 | ${data_det[i].graduateId}| ${data_det[i].job} | ${data_det[i].schoolId} | ${data_det[i].content}<br></div><hr> `;
      i++;
    }
    body += `<br><a href = "/api/graduate_interview/post">졸업생 인터뷰 등록하기</a> <br> <a href="/"> 홈으로 돌아가기 </a>`;
    var html = templates.HTML(title, head, body);
    res.send(html);

     //client로 보내기
     //중복확인은 프론트에서
    //name=name[0];
    // res.json({
    //     data_det: data_det,
    //     graduate_name:name
    // });
  });

  module.exports = router;