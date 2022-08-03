const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const multer = require("multer");
const templates = require("../lib/templates");
const path = require("path");

//글 조회 및 작성
router.get("/", async (req, res) => {
  const title = "교육/공모전 글 모아보기";
  const head = ``;
  const body = `
    <form action="/api/edu_contest_write" method ="post" enctype="multipart/form-data">
    <p>${req.user.name}</p>
    <label> 제목: 
      <input type = "text" name = "title" placeholder = "제목을 작성하세요" /> </label>
      <br>
      <br>
      <label> 내용: 
      <input type = "textarea" name = "content" placeholder = "내용을 작성하세요" /> </label>
      <br>
      <label> 사진: 
      <input type='file' name='img' accept='image/jpg, image/png, image/jpeg' /></label>
      <br>
      <button type="submit"><b>입력</b></button>
      </form>
    `;

  var html = templates.HTML(title, head, body);
  res.send(html);
});

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

router.post("/", upload.single("img"), async (req, res) => {
  const post = req.body;
  const title = post.title;
  const content = post.content;
  const img = req.file == undefined ? "" : req.file.path;
  try {
    const data = await pool.query(
      `INSERT INTO edu_contest(title, content, img, iduser) VALUES(?, ?, ?, ?)`,
      [title, content, img, req.user.id]
    );
    const head = ``;
    const body = `
      <h3>${title}</h3>
      <p>${content}</p>
  
      <a href="/api/edu_contest_list">목록으로 돌아가기</a>
      `;

    var html = templates.HTML(title, head, body);
    res.send(html);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
