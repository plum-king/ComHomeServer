const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");

//글 조회 및 작성
router.get("/edu_contest_write", async (req, res) => {
  const title = "교육/공모전 글 모아보기";
  const head = ``;
  const body = `
    <form action="/edu_contest_write" method ="post">
    <p>${req.user.name}</p>
    <label> 제목: 
      <input type = "text" name = "edu_contest_title" placeholder = "제목을 작성하세요" /> </label>
      <br>
      <br>
      <label> 내용: 
      <input type = "textarea" name = "edu_contest_cont" placeholder = "내용을 작성하세요" /> </label>
      <br>
      <button type="submit"><b>입력</b></button>
      </form>
    `;

  var html = templates.HTML(title, head, body);
  res.send(html);
});

router.post("/edu_contest_write", async (req, res) => {
  const post = req.body;
  const title = post.edu_contest_title;
  const cont = post.edu_contest_cont;
  try {
    const data = await pool.query(
      `INSERT INTO edu_contest(edu_contest_title, edu_contest_cont, iduser) VALUES(?, ?, ?)`,
      [title, cont, req.user.id]
    );
    const head = ``;
    const body = `
      <h3>${title}</h3>
      <p>${cont}</p>
  
      <a href="/edu_contest_list">목록으로 돌아가기</a>
      `;

    var html = templates.HTML(title, head, body);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
