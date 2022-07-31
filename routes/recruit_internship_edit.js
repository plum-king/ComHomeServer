const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const multer = require('multer');
const path = require('path');

//채용인턴십 글 수정하기
router.post("/", async (req, res) => {

    const notice_id=req.body.notice_id;
    console.log(notice_id);
    const data = await pool.query(`SELECT * FROM recruit_intern where notice_id=${notice_id}`);
    console.log(data[0][0]);

    const title = "채용인턴십 글 수정";
    const head = ``;
    const body = `
    <form action="/api/recruit_internship_edit/post" method ="post" enctype="multipart/form-data" accept-charset="UTF-8">
    <b>채용인턴십 공지 작성</b>
    <br>
    <label> 제목: 
      <input type = "text" name = "notice_title" value="${data[0][0].not_title}"/> </label>
      <br>
      <br>
      <label> 내용: 
      <textarea name="notice_cont">${data[0][0].not_content}</textarea></label>
      <br>
      <input type="hidden" name="notice_id" value="${data[0][0].notice_id}">
      <button type="submit"><b>수정</b></button>
      </form>
    `;
  
    var html = templates.HTML(title, head, body);
    res.send(html);
  }); 

//------이미지와 파일들은 수정UPDATE는 추후 구현할 예정 

/*이미지 업로드를 위한 multer
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
*/

//수정한 글 db에 저장
  router.post("/post", async (req, res) => {

    console.log("공지번호");
    //const notice_id=req.body.notice_id;
    const edit = req.body;
    console.log(edit);
    const date=new Date();
    const title = edit.notice_title;
    const cont = edit.notice_cont;
    const notice_id=edit.notice_id;
    console.log(notice_id);
    //const notice_img = req.files.img == undefined ? '' : req.files.img[0].path;
    //const notice_file = req.files.file == undefined ? '' : req.files.file[0].path;

    console.log('74행');

    const sql=`UPDATE recruit_intern SET not_title=?, not_content=?, not_edited_date=? WHERE notice_id=?`
    const params=[title, cont, date, notice_id];

    try {
        const data = await pool.query(sql,params);
        console.log(data);
        res.write(`<script type="text/javascript">alert('Recruit Internship Edit Success !!')</script>`);
        res.write(`<script>window.location="/api/recruit_internship_list"</script>`);
        res.end();
    } catch (err) {
        console.error(err);
        res.write('<script>window.location="/"</script>');
    }

    //첨부파일 수정-->> 여러개 table에 저장 (추후 구현예정)
    /*
    for(let i=0;i<count;i++){
      try {
        const data = await pool.query(`INSERT INTO file_intern(notice_id, file_infoN, file_originN) VALUES(?,?,?)`,[notice_id, req.files.file[i].path, req.files.file[i].originalname]);
      } catch (err) {
        console.error(err);
      }
    }
    */
  });
  
  module.exports = router;