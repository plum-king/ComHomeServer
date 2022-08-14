const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const multer = require("multer");
const path = require("path");
const date_fns = require("date-fns");
const {sendNotification} = require("./push.js");

//이미지 업로드를 위한 multer
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "uploads/");
    },
    filename: function (req, file, callback) {
      callback(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
});

// 글 작성하기
router.post("/post", upload.single("img"), async (req, res) => {
  const post = req.body;
  const iduser = post.iduser;
  const title = post.title;
  const content = post.content;
  const end_date = post.end_date;
  const img = post.files.img == undefined ? "" : post.files.img[0].path;
  const now = new Date();
  try {
    const data = await pool.query(
      `INSERT INTO edu_contest(title, content, edited_date, img, views, iduser, end_date) VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [title, content, now, img, 0, iduser, end_date] //iduser 나중에 바꾸기
    );
    let no = data[0].insertId;
    res.json({
      no: no,
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/expire", async (req, res) => {
  const post = req.body;
  const post_no = post.no;
  const end_date = post.end_date;
  try {
    const data = await pool.query(
      `UPDATE edu_contest SET end_date=? WHERE no = ?`,
      [end_date, post_no]
    );
    //알람
    //교육 공모전 알람 ON한 사용자들
    const edu_data = await pool.query(
      `SELECT subscribe FROM subscriptions WHERE edu_contest and subscribe is not null`
    );
    const message = {
      message: `교육 공모전 글이 새로 올라왔습니다!`,
    };
    console.log(edu_data);
    edu_data.map((subscribe) => {
      sendNotification(JSON.parse(subscribe.subscribe), message);
    });
    res.json({
      no: no,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
