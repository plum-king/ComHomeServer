const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");

router.get("/:sc_notice_no", async (req, res) => {
  const sc_notice_no = path.parse(req.params.sc_notice_no).base;

  //조회수 +1
  try {
    const data = await pool.query(
      "UPDATE student_council_notice set views=views+1 where no =? ",
      [sc_notice_no]
    );
  } catch (err) {
    console.error(err);
  }

  const data = await pool.query(
    `SELECT * FROM student_council_notice where no = ?`,
    [sc_notice_no]
  );
  const file_data = await pool.query(`SELECT * FROM file_sc where no = ?`, [
    sc_notice_no,
  ]);
  const data_det = data[0][0];
  res.json({data_det:data_det, file_data:file_data});
});

module.exports = router;
