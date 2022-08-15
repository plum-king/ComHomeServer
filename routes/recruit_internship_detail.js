const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const path = require("path");
const date_fns = require("date-fns");

router.get("/:notice_id", async (req, res) => {
  const notice_id = path.parse(req.params.notice_id).base;
  let scrap = false;
  const scrap_det = await pool.query(`SELECT * FROM scrap where iduser =?`, [
    req.body.iduser,
  ]);
  for (let i = 0; i < scrap_det[0].length; i++) {
    if (
      scrap_det[0][i].type == "recruit_intern" &&
      scrap_det[0][i].no == notice_id
    ) {
      scrap = true;
      break;
    }
  }
  //조회수 +1
  try {
    const views = await pool.query(
      "UPDATE recruit_intern set views=views+1 where no =? ",
      [notice_id]
    );

    const data = await pool.query(`SELECT * FROM recruit_intern where no = ?`, [
      notice_id,
    ]);

    const data_file = await pool.query(
      `SELECT * FROM file_intern where no = ?`,
      [notice_id]
    );
    res.json({
      data_det: data[0][0],
      data_file: data_file,
      scrap: scrap,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
