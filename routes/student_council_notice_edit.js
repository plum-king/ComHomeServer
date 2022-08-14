const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const multer = require("multer");
const path = require("path");
const {sendNotification} = require("./push.js");
const date_fns = require("date-fns");

//이미지 업로드를 위한 multer
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, img, callback) {
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
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const date = new Date(); //start_date랑 end_date
  const img = req.file == undefined ? "" : req.file.path;
  let status = 404;

  //, file_status=?
  const sql1 =
    "UPDATE student_council_notice SET title=?, content=?, edited_date=?, start_date=?, end_date=? WHERE no=?";
  const params1 = [title, content, date, date, date, no];
  //, file_status=?
  const sql2 =
    "UPDATE student_council_notice SET title=?, content=?, img=?, edited_date=?, start_date=?, end_date=? WHERE no=?";
  const params2 = [title, content, img, date, date, date, no];

  //이미지 없으면 sql2 쿼리, 이미지 있으면 sql1 쿼리
  let sql = req.file == undefined ? sql2 : sql1;
  let params = req.file == undefined ? params2 : params1;

  try {
    const data = await pool.query(sql, params);

    // //학생회 공지 알람 ON한 사용자들
    // const subscribe_data = await pool.query(
    //   `SELECT subscribe FROM subscriptions WHERE student_council_notice and subscribe is not null`
    // );

    // const message = {
    //   message: `학생회 공지가 수정되었습니다!`,
    // };
    // subscribe_data.map((subscribe) => {
    //   sendNotification(JSON.parse(subscribe.subscribe), message);
    // });

    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

//작품전시 글 삭제하기
router.post("/delete", async (req, res) => {
  const no = req.body.no;
  console.log(no);
  let status = 404;

  const file_status = await pool.query(
    `SELECT file_status FROM student_council_notice WHERE no=${no}`
  );

  if (file_status[0][0].file_status == 1) {
    const data = await pool.query(`DELETE FROM file_sc WHERE no=?`, [no]);
  }

  try {
    const data = await pool.query(
      `DELETE FROM student_council_notice WHERE no=?`,
      [no]
    );
    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

module.exports = router;
