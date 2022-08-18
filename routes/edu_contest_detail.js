const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const path = require("path");
const date_fns = require("date-fns");

router.get("/:edu_contest_no", async (req, res) => {
  const edu_contest_no = path.parse(req.params.edu_contest_no).base;
  let scrap = false;
  const data = await pool.query(`SELECT * FROM edu_contest where no = ?`, [
    edu_contest_no,
  ]);
  const scrap_det = await pool.query(`SELECT * FROM scrap where iduser =?`, [
    req.query.iduser,
  ]);
  // req.user.iduser 로 받을 수 있는지 확인하기

  for (let i = 0; i < scrap_det[0].length; i++) {
    if (
      scrap_det[0][i].type == "edu_contest" &&
      scrap_det[0][i].no == edu_contest_no
    ) {
      scrap = true;
      break;
    }
  }

  //조회수 +1
  try {
    const views = await pool.query(
      "UPDATE edu_contest set views=views+1 where no =? ",
      [edu_contest_no]
    );
  } catch (err) {
    console.error(err);
  }

  //댓글 조회
  let comment = await pool.query(
    `SELECT * FROM edu_contest_comment WHERE edu_contest_no = ?`,
    [edu_contest_no]
  );

  let i = 0;
  while (i < comment[0].length) {
    if (comment[0][i].secret_check) {
      comment[0][i].content = null;
    }
    if (comment[0][0].anon_check) {
      comment[0][i].iduser = null;
    }
    i++;
  }
  res.json({
    data_det: data[0][0],
    comment: comment[0],
    scrap: scrap,
  });
});

module.exports = router;
