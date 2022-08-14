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

//수정한 글 db에 저장
router.post("/update", upload.single("img"), async (req, res) => {
  const no = req.body.no;
  const title = req.body.title;
  const content = req.body.content;
  const end_date = req.body.end_date;
  const now = new Date();
  const end = new Date(end_date);
  const img = req.body.files.img == undefined ? "" : req.body.files.img[0].path;
  let status = 404;

  try {
    let sql =
      req.body.files.img == undefined
        ? await pool.query(
            "UPDATE edu_contest SET title=?, content=?, edited_date=?, end_date=? WHERE no=?",
            [title, content, now, end, no]
          )
        : await pool.query(
            `UPDATE edu_contest SET title=?, content=?, img=?, edited_date=?, end_date=? WHERE no=?`,
            [title, content, img, now, end, no]
          );
    //교육 공모전 알람 ON한 사용자들
    const edu_data = await pool.query(
      `SELECT subscribe FROM subscriptions WHERE edu_contest and subscribe is not null`
    );

    const message = {
      message: `교육 공모전 글이 수정되었습니다!`,
    };
    edu_data.map((subscribe) => {
      sendNotification(JSON.parse(subscribe.subscribe), message);
    });

    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

//교육 공모전 글 삭제하기
router.post("/delete", async (req, res) => {
  const no = req.body.no;
  let status = 404;
  try {
    const data = await pool.query("DELETE FROM edu_contest WHERE no=?", [no]);
    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

module.exports = router;
