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

  const data_det = data[0][0];
  res.json({data_det: data_det});
});

module.exports = router;
