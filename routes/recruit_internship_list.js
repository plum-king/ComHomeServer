const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const multer = require('multer');
const path = require('path');

//채용/인턴십 목록보기
router.get("/", async (req, res) => {
    let i = 0;
    const data = await pool.query(`SELECT * FROM recruit_intern ORDER BY not_created_date DESC`);
    const time_data = await pool.query(`SELECT date_format(not_created_date, '%Y-%m-%d') FROM recruit_intern ORDER BY not_created_date DESC`);
    let data_det = data[0];

    res.json({data_det: data_det});
  });

  module.exports = router;