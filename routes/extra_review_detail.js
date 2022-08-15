const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const path = require("path");

router.get("/:review_no", async (req, res) => {
  const review_no = path.parse(req.params.review_no).base;
  let scrap = false;

  const data = await pool.query(`SELECT * FROM extra_review where no = ?`, [
    review_no,
  ]);

  const scrap_det = await pool.query(`SELECT * FROM scrap where iduser =?`, [
    req.query.iduser,
  ]);

  for (let i = 0; i < scrap_det[0].length; i++) {
    if (
      scrap_det[0][i].type == "extra_review" &&
      scrap_det[0][i].no == review_no
    ) {
      scrap = true;
      break;
    }
  }
  //조회수 +1
  try {
    const views = await pool.query(
      "UPDATE extra_review set views=views+1 where no =? ",
      [review_no]
    );

    const data_det = data[0][0];
    res.json({data_det: data_det, scrap: scrap});
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
