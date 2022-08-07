const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");

router.get("/", async (req, res) => {
  // const title = "취업 후기 게시판";
  // const head = ``;
  // let body = `게시글 제목 | 작성 날짜<br>`;
  // //  | 작성자 <br>`;
  // let i = 0;
  const data = await pool.query(
    `SELECT * FROM job_review ORDER BY upload_time DESC`
  );
  let data_det = data[0];
  res.json({
    data_det: data_det,
  });
});

module.exports = router;
