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

const fileFields = upload.fields([
  {name: "img", maxCount: 1},
  {name: "file", maxCount: 8},
]);

router.post("/post", fileFields, async (req, res) => {
  const post = req.body;
  const {img, file} = req.files;

  let count; //파일개수
  if (req.files.file) {
    count = Object.keys(file).length;
  }

  const date = new Date();
  const notice_id = date % 10000;
  const title = post.title;
  const content = post.content;
  const notice_img = req.files.img == undefined ? "" : req.files.img[0].path;
  const notice_file = req.files.file == undefined ? "" : req.files.file[0].path;

  const sql = `INSERT INTO cs_notice(no, iduser, title, content, upload_time, edited_date, views, img, file_status) VALUES(?,?,?,?,?,?,?,?,?)`;
  const params = [
    notice_id,
    req.body.iduser,
    title,
    content,
    date,
    date,
    0,
    notice_img,
    count > 0 ? 1 : 0,
  ]; //count >0 ? 1 :0 -> 첨부파일 여부확인

  try {
    const data = await pool.query(sql, params);

    //알람
    //채용인턴십 알람 ON한 사용자들
    const [cs_data] = await pool.query(
      `SELECT subscribe FROM subscriptions WHERE cs_notice and subscribe is not null`
    );
    const message = {
      message: `학과 공지글이 새로 올라왔습니다!`,
    };
    cs_data.map((subscribe) => {
      sendNotification(JSON.parse(subscribe.subscribe), message);
    });

    let data_file;
    //첨부파일 table에 저장
    for (let i = 0; i < count; i++) {
      const data_file = await pool.query(
        `INSERT INTO file_cs(no, file_infoN, file_originN) VALUES(?,?,?)`,
        [notice_id, req.files.file[i].path, req.files.file[i].originalname]
      );
    }
    let no = data[0].insertId;

    res.json({no: no, data_file: data_file});
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
