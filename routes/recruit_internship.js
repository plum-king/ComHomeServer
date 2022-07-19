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
    <form action="/recruit_internship/post" method ="post" enctype="multipart/form-data" accept-charset="UTF-8">
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
      <label> 파일: 
      <input type='file' name='file' multiple/></label>

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

const fileFields = upload.fields([
  { name: 'img', maxCount: 1 },
  { name: 'file', maxCount: 8 },
])
  router.post("/post", fileFields, async (req, res) => {

    //req.setCharacterEncoding("utf-8");
    const { img, file } = req.files;
    console.log(req.files);
    //console.log(img);
    //console.log(file);

    let count;
    if(req.files.file){
      count=Object.keys(file).length;
    }

    const post = req.body;
    const date=new Date();
    const notice_id=date % 10000;
    const title = post.notice_title;
    const cont = post.notice_cont;
    const notice_img = req.files.img == undefined ? '' : req.files.img[0].path;
    const notice_file = req.files.file == undefined ? '' : req.files.file[0].path;

    console.log('74행');
    //console.log(notice_img);
    //console.log(req.files.file[0].path);
    //console.log(req.files.file[1].path);

    const sql=`INSERT INTO recruit_intern(notice_id, user_id, not_title, not_content, not_created_date, not_edited_date, not_views, not_img) VALUES(?,?,?,?,?,?,?,?)`
    const params=[notice_id, req.user.id, title, cont, date, date, 0, notice_img];

    try {
        const data = await pool.query(sql,params);
        res.write(`<script type="text/javascript">alert('Recruit Internship post Success !!')</script>`);
        res.write(`<script>window.location="/recruit_internship_list"</script>`);
        res.end();
    } catch (err) {
        console.error(err);
        res.write('<script>window.location="/"</script>');
    }
    //첨부파일 여러개 table에 저장
    for(let i=0;i<count;i++){
      try {
        const data = await pool.query(`INSERT INTO file_intern(notice_id, file_infoN, file_originN) VALUES(?,?,?)`,[notice_id, req.files.file[i].path, file_originN]);
      } catch (err) {
        console.error(err);
      }
    }
  });
  
  module.exports = router;