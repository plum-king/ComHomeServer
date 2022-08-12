const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");

router.get("/:review_no", async (req, res) => {
  const review_no = path.parse(req.params.review_no).base;
  const title = review_no + "번 게시글";
  const head = ``;
  const data = await pool.query(`SELECT * FROM extra_review where no = ?`, [
    review_no,
  ]);
  const scrap = await pool.query(`SELECT * FROM scrap where iduser =?`, [
    req.user.id,
  ]);
  //조회수 +1
  try {
    const data = await pool.query(
      "UPDATE recruit_intern set views=views+1 where no =? ",
      [review_no]
    );
  } catch (err) {
    console.error(err);
  }

  //스크랩 버튼 추가
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
    body += `<form action="/api/extra_review_edit/${review_no}" method="post">
    <input type="hidden" name="no" value="${review_no}">
    <input type="submit" name="edit" value="수정하기">
    </form>
    <form action="/api/extra_review_edit/delete/${review_no}" method="post">
    <input type="hidden" name="no" value="${review_no}">
    <input type="submit" name="delete" value="삭제하기"
    onClick="return confirm('Are you sure you want to delete this extra_review?')">
    </form>`;
  }

  body += `<a href = "/api/extra_review_list">목록으로 돌아가기</a>
  `;
  var html = templates.HTML(title, head, body);
  res.send(html);
});

module.exports = router;
