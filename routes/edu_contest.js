const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const multer = require("multer");
const path = require("path");

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
  const img = req.file == undefined ? "" : req.file.path;
  try {
    const data = await pool.query(
      `INSERT INTO edu_contest(title, content, img, iduser, end_date) VALUES(?, ?, ?, ?, ?)`,
      [title, content, img, iduser, end_date] //iduser 나중에 바꾸기
    );
    let no = data[0].insertId;
    res.json({
      no: no,
      // data: data[0][0],
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
    res.json({
      no: no,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
