const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const path = require("path");

router.get("/:notice_id", async (req, res) => {
  const notice_id = path.parse(req.params.notice_id).base;

  let data_file;
  //조회수 +1
  try {
    const views = await pool.query(
      "UPDATE cs_notice set views=views+1 where no =? ",
      [notice_id]
    );

    const data = await pool.query(`SELECT * FROM cs_notice where no = ?`, [
      notice_id,
    ]);
    data_file = await pool.query(`SELECT * FROM file_cs where no = ?`, [
      notice_id,
    ]);

    res.json({
      data_det: data[0][0],
      data_file: data_file
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
