const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const multer = require('multer');
const path = require('path');

//채용인턴십 글 작성하기
router.get("/post", async (req, res) => {
    if(!req.user) {
      res.write(`<script type="text/javascript">alert('Please Login First !!')</script>`);
      res.write(`<script>window.location="/auth/login"</script>`);
      res.end();
    }
    const title = "채용인턴십 글 작성";
    const head = ``;
    const body = `
    <form action="/recruit_internship/post" method ="post" enctype="multipart/form-data">
    <b>채용인턴십 공지 작성</b>
    <br>
    <label> 제목: 
      <input type = "text" name = "notice_title" placeholder = "제목을 작성하세요" /> </label>
      <br>
      <br>
      <label> 내용: 
      <textarea name="notice_cont" placeholder = "내용을 작성하세요"></textarea></label>
      <br>
      <label> 사진: 
      <input type='file' name='img' accept='image/jpg, image/png, image/jpeg' /></label>
      <br>
      <button type="submit"><b>등록</b></button>
      </form>
    `;
  
    var html = templates.HTML(title, head, body);
    res.send(html);
  }); 

//이미지 업로드를 위한 multer
const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, 'uploads/')
      },
      filename: function (req, file, callback) {
        callback(null, new Date().valueOf() + path.extname(file.originalname))
      }
    }),
});


  router.post("/post", upload.single('img'), async (req, res) => {

    const post = req.body;
    const title = post.notice_title;
    const cont = post.notice_cont;
    const notice_img = req.file == undefined ? '' : req.file.path;
    const date=new Date();

    const sql=`INSERT INTO recruit_intern(notice_id, user_id, not_title, not_content, not_created_date, not_edited_date, not_views, not_img) VALUES(?,?,?,?,?,?,?,?)`
    const params=[date % 10000, req.user.id, title, cont, date, date, 0, notice_img];
    try {
        const data = await pool.query(sql,params);
        res.write(`<script type="text/javascript">alert('Recruit Internship post Success !!')</script>`);
        res.write(`<script>window.location="/recruit_internship_list"</script>`);
        res.end();
    } catch (err) {
        console.error(err);
        res.write('<script>window.location="/"</script>');
    }
  });
  
  module.exports = router;