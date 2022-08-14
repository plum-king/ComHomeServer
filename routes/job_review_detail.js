const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");

router.get("/:review_no", async (req, res) => {
  const review_no = path.parse(req.params.review_no).base;
  const data = await pool.query(`SELECT * FROM job_review where no = ?`, [
    review_no,
  ]);
  const scrap = await pool.query(`SELECT * FROM scrap where iduser =?`, [
    req.user.id,
  ]);
  let data_det = data[0][0];

  //아래 코드는 필요해서 남겨둠 + 스크랩 버튼 추가
  let body = `<p>${data[0][0].title}</p>
  <p>${data[0][0].content}</p>
  ${
    data[0][0].id != req.user.id
      ? scrap[0][0] == undefined
        ? `<form action="/api/scrap/edu_contest" method="post">
  <input type="hidden" name="no" value="${data[0][0].no}" />
  <input type="submit" name="scrap" value="스크랩" />
  </form>`
        : `<form action="/api/scrap/edu_contest_cancel" method="post">
  <input type="hidden" name="no" value="${data[0][0].no}" />
  <input type="submit" name="scrap" value="스크랩 취소" />
  </form>`
      : ``
  }`;
  if (req.user.id == data[0][0].iduser) {
    body += `<form action="/api/job_review_edit/${review_no}" method="post">
    <input type="hidden" name="no" value="${review_no}">
    <input type="submit" name="edit" value="수정하기">
    </form>
    <form action="/api/job_review_edit/delete/${review_no}" method="post">
    <input type="hidden" name="no" value="${review_no}">
    <input type="submit" name="delete" value="삭제하기"
    onClick="return confirm('Are you sure you want to delete this job_review?')">
    </form>`;
  }
  body += `<a href = "/api/job_review_list">목록으로 돌아가기</a>`;
  var html = templates.HTML(title, head, body);
  res.send(html);

  try {
    const view = await pool.query(
      "UPDATE job_review set views=views+1 where no =? ",
      [review_no]
    );

    //if문 추후 필요
    // res.json({data_det: data_det});
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
