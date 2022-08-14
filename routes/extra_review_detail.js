const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const path = require("path");

router.get("/:review_no", async (req, res) => {
  const review_no = path.parse(req.params.review_no).base;

  const data = await pool.query(`SELECT * FROM extra_review where no = ?`, [
    review_no,
  ]);
  const scrap = await pool.query(`SELECT * FROM scrap where iduser =?`, [
    req.body.iduser,
  ]);
  //조회수 +1
  try {
    const views = await pool.query(
      "UPDATE extra_review set views=views+1 where no =? ",
      [review_no]
    );

    const data_det = data[0][0];
    res.json({data_det: data_det});
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
