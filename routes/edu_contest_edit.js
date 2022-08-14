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

//수정한 글 db에 저장
router.post("/update", upload.single("img"), async (req, res) => {
  const no = req.body.no;
  const title = req.body.title;
  const content = req.body.content;
  const end_date = req.body.end_date;
  const now = new Date();
  const end = new Date(end_date);
  const img = req.file == undefined ? "" : req.file.path;
  let status = 404;

  try {
    let sql =
      req.file == undefined
        ? await pool.query(
            "UPDATE edu_contest SET title=?, content=?, edited_date=?, end_date=? WHERE no=?",
            [title, content, now, end, no]
          )
        : await pool.query(
            `UPDATE edu_contest SET title=?, content=?, img=?, edited_date=?, end_date=? WHERE no=?`,
            [title, content, img, now, end, no]
          );

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
