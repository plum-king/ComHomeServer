const express = require("express");
const router = express.Router();
const pool = require("../db.js");

//마이페이지 띄우기
router.get("/", async (req, res) => {
  const user = req.body.iduser;

  try {
    // 내 정보 보이기
    const info = await pool.query(`SELECT * FROM user WHERE iduser=?`, [user]);
    let email = info[0][0].email;
    let student_id = email.substr(0, 8);

    //내가 쓴 대외활동 글 모아보기
    const extra_review = await pool.query(
      `SELECT * FROM extra_review where iduser = ?`,
      [user]
    );

    //내가 쓴 취업후기 글 모아보기
    const job_review = await pool.query(
      `SELECT * FROM job_review where iduser = ?`,
      [user]
    );

    //내가 쓴 교육/공모전 글 모아보기
    const edu_contest = await pool.query(
      `SELECT * FROM edu_contest where iduser = ?`,
      [user]
    );

    //내가 쓴 작품전시 글 모아보기 -> 경로 확인해보기
    const exhibition = await pool.query(
      `SELECT * FROM exhibition where iduser = ?`,
      [user]
    );

    //내가 쓴 교육/공모전 댓글 모아보기
    const edu_contest_comment = await pool.query(
      `SELECT * FROM edu_contest_comment where iduser = ?`,
      [user]
    );

    //스크랩 추가하기

    res.json({
      student_id: student_id,
      extra_review: extra_review[0],
      job_review: job_review[0],
      edu_contest: edu_contest[0],
      exhibition: exhibition[0],
      edu_contest_comment: edu_contest_comment[0],
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
