const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");

//마이페이지 띄우기
router.get("/", async (req, res) => {
  let post = req.body;
  const user = req.user.id;
  const title = `마이페이지`;
  const head = ``;
  let body = ``;

  try {
    // 내 정보 보이기
    const info = await pool.query(`SELECT * FROM user WHERE iduser=?`, [user]);
    let email = info[0][0].email;
    let personal_no = email.substr(0, 8);
    body += `<strong>이름: </strong> ${info[0][0].name}<br> <strong>학번: </strong>${personal_no}<br> <br>`;
    //내가 쓴 대외활동 글 모아보기
    const extra_review = await pool.query(
      `SELECT * FROM extra_review where iduser = ?`,
      [user]
    );
    body += `<strong>내가 쓴 대외활동 글 모아보기</strong><br>`;
    for (let i = 0; i < extra_review[0].length; i++)
      body += `<a href="/api/extra_review_detail/${extra_review[0][i].no}"><p>${extra_review[0][i].title}</p></a></p>`;

    //내가 쓴 취업후기 글 모아보기
    const job_review = await pool.query(
      `SELECT * FROM job_review where iduser = ?`,
      [user]
    );
    body += `<strong>내가 쓴 취업후기 글 모아보기</strong><br>`;
    for (let i = 0; i < job_review[0].length; i++)
      body += `<a href="/api/job_review_detail/${job_review[0][i].no}"><p>${job_review[0][i].title}</p></a></p>`;

    //내가 쓴 교육/공모전 글 모아보기
    const edu_contest = await pool.query(
      `SELECT * FROM edu_contest where iduser = ?`,
      [user]
    );
    body += `<strong>내가 쓴 교육/공모전 글 모아보기</strong><br>`;
    for (let i = 0; i < edu_contest[0].length; i++)
      body += `<a href="/api/edu_contest_detail/${edu_contest[0][i].no}"><p>${edu_contest[0][i].title}</p></a></p>`;

    //내가 쓴 작품전시 글 모아보기 -> 경로 확인해보기
    const exhibition = await pool.query(
      `SELECT * FROM exhibition where iduser = ?`,
      [user]
    );
    body += `<strong>내가 쓴 작품전시 글 모아보기</strong><br>`;
    for (let i = 0; i < exhibition[0].length; i++)
      body += `<a href="/api/exhibition/${exhibition[0][i].no}"><p>${exhibition[0][i].title}</p></a></p>`;

    //내가 쓴 교육/공모전 댓글 모아보기
    const edu_contest_comment = await pool.query(
      `SELECT * FROM edu_contest_comment where iduser = ?`,
      [user]
    );
    body += `<strong>내가 쓴 교육/공모전 댓글 모아보기</strong><br>`;
    for (let i = 0; i < edu_contest_comment[0].length; i++)
      body += `<a href="/api/edu_contest_detail/${edu_contest_comment[0][i].edu_contest_no}"><p>${edu_contest_comment[0][i].content}</p></a></p>`;

    body += `<br><br> <a href="/"> 홈으로 돌아가기 </a>`;
    var html = templates.HTML(title, head, body);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
