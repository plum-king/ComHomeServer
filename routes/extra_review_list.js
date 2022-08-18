const express = require("express");
const router = express.Router();
const pool = require("../db.js");

router.get("/", async (req, res) => {
  const data = await pool.query(`SELECT * FROM extra_review ORDER BY no DESC`);
  let data_det = data[0];
  res.json({data_det: data_det});
});

module.exports = router;
