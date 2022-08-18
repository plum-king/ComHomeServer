const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const path = require("path");
const {request} = require("http");
const {sendNotification} = require("./push.js");
const date_fns = require("date-fns");
const {Storage} = require('@google-cloud/storage');
const Multer = require('multer');
const {format} = require('util');
const templates = require("../lib/templates");
const admin = require('firebase-admin');

//sc_notice_no -> no
router.get("/:no", async (req, res) => {
  const no = path.parse(req.params.no).base;

  //조회수 +1
  try {
    const data = await pool.query(
      "UPDATE student_council_notice set views=views+1 where no =? ",
      [no]
    );
  } catch (err) {
    console.error(err);
  }

  const data = await pool.query(
    `SELECT * FROM student_council_notice where no = ?`,
    [no]
  );
  const data_file = await pool.query(`SELECT * FROM file_sc where no = ?`, [
    no,
  ]);
  const data_det = data[0][0];
  res.json({data_det: data_det, data_file: data_file});
  
});

// //firebase Admin초기화
// const firebaseAdmin = admin.initializeApp({
//   credential: admin.credential.cert({
//   }),
// }, "storage");

// router.get('/read', function(req, res, next){
//   firebaseAdmin.firestore().collection('posts')
// });

module.exports = router;