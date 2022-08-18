const express = require("express");
const router = express.Router();
const pool = require("../db.js");

router.get("/", async (req, res) => {
  const data = await pool.query(
    `SELECT no, title, upload_time, img, views, end_date FROM edu_contest ORDER BY upload_time DESC`
  );
  let i = 0;
  while (data[0].length > i) {
    if (data[0][i].img != "") {
      data[0][i].img = true;
    } else {
      data[0][i].img = false;
    }
    i++;
  }
  let data_det = data[0];
  res.json({data_det: data_det});
});

module.exports = router;
