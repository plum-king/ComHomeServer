const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const path = require("path");
const date_fns = require("date-fns");

router.get("/:review_no", async (req, res) => {
  const review_no = path.parse(req.params.review_no).base;
  let scrap = false;
  const data = await pool.query(`SELECT * FROM job_review where no = ?`, [
    review_no,
  ]);
  const scrap_det = await pool.query(`SELECT * FROM scrap where iduser =?`, [
    req.query.iduser,
  ]);

  for (let i = 0; i < scrap_det[0].length; i++) {
    if (
      scrap_det[0][i].type == "job_review" &&
      scrap_det[0][i].no == review_no
    ) {
      scrap = true;
      break;
    }
  }
  let data_det = data[0][0];

  try {
    const view = await pool.query(
      "UPDATE job_review set views=views+1 where no =? ",
      [review_no]
    );
  } catch (err) {
    console.error(err);
  }
  res.json({data_det: data_det, scrap: scrap});
});

module.exports = router;
