const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const path = require("path");

router.get("/:edu_contest_no", async (req, res) => {
  const edu_contest_no = path.parse(req.params.edu_contest_no).base;
 
  const data = await pool.query(`SELECT * FROM edu_contest where no = ?`, [
    edu_contest_no,
  ]);
  const scrap = await pool.query(`SELECT * FROM scrap where iduser =?`, [
    req.user.id,
  ]);

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
    data: data[0][0],
    comment: comment[0],
  });
});

module.exports = router;
