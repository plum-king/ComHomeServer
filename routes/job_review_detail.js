const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const path = require("path");
const date_fns = require("date-fns");

router.get("/:review_no", async (req, res) => {
  const review_no = path.parse(req.params.review_no).base;
  const data = await pool.query(`SELECT * FROM job_review where no = ?`, [
    review_no,
  ]);
  const scrap = await pool.query(`SELECT * FROM scrap where iduser =?`, [
    req.body.iduser,
  ]);
  let data_det = data[0][0];

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
