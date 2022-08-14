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

  // //아래 코드는 필요해서 남겨둠 + 스크랩 버튼 추가
  // let body = `<p>${data[0][0].title}</p>
  // <p>${data[0][0].content}</p>
  // ${
  //   data[0][0].id != req.user.id
  //     ? scrap[0][0] == undefined
  //       ? `<form action="/api/scrap/edu_contest" method="post">
  // <input type="hidden" name="no" value="${data[0][0].no}" />
  // <input type="submit" name="scrap" value="스크랩" />
  // </form>`
  //       : `<form action="/api/scrap/edu_contest_cancel" method="post">
  // <input type="hidden" name="no" value="${data[0][0].no}" />
  // <input type="submit" name="scrap" value="스크랩 취소" />
  // </form>`
  //     : ``
  // }`;

  try {
    const view = await pool.query(
      "UPDATE job_review set views=views+1 where no =? ",
      [review_no]
    );
  } catch (err) {
    console.error(err);
  }
  res.json({data_det: data_det});
});

module.exports = router;
