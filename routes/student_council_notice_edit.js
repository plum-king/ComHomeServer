const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const multer = require('multer');
const path = require('path');

// 글 수정하기
router.post("/", async (req, res, next) => {
    console.log(req.body.no);
    const data = await pool.query(`SELECT * FROM student_council_notice WHERE no=${req.body.no}`);
    const title = "학생회 공지 수정";
    const head = ``;
    let body = `
    <form action="/api/student_council_notice_edit/update" method ="post" enctype="multipart/form-data" accept-charset="UTF-8">  
    <b>학생회 공지 작성</b>
        <br>
        <label> 제목: 
            <input type = "text" name = "title" value="${data[0][0].title}" /> </label>
        <br>
        <br>
        <label> 내용: 
            <textarea name="content">${data[0][0].content}</textarea></label>
        <br>
        <label> 파일: 
            <input type='file' name='file' multiple/></label>
            <br>
    `
    if(data[0][0].img !=''){
        body+=`
        <script type="text/javascript">
            function div_hide() {
                document.getElementById("showImage").style.display = "none";
                document.getElementById("deleteBtn").style.display = "none";
                document.getElementById("addImage").style.display = "block";}
        </script>
        <img id='showImage' src="${data[0][0].img}"/>
        <label> 사진: 
        <input type="button" id="deleteBtn" value="X(이미지삭제)" onclick="div_hide();"/>
        <input style="display:none;" type='file' id='addImage' name='img' accept='image/jpg, image/png, image/jpeg'/>
        </br>
        `
    }else{
        body+=`
        <label> 사진: 
            <input type='file' name='img' accept='image/jpg, image/png, image/jpeg' /></label>
            <br>
        `
    }

    body+=`
        <input type="hidden" name="no" value="${data[0][0].no}">
        <input type="submit" value="수정">
        </form>
    `;

    var html = templates.HTML(title, head, body);
    res.send(html);
}); 

//이미지 업로드를 위한 multer
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, img, callback) {
        callback(null, 'uploads/')
    },
    filename: function (req, file, callback) {
        callback(null, new Date().valueOf() + path.extname(file.originalname))
    }
    }),
});

//수정한 글 db에 저장
router.post("/update", upload.single('img'), async (req, res) => {

    // let count;
    // if(req.file){
    //     count=Object.keys(file).length;
    // }
    // console.log(count);
    const no=Number(req.body.no);
    const title=req.body.title;
    const content=req.body.content;
    const date=new Date();
    const img = req.file == undefined ? '' : req.file.path;
    // const file = req.file == undefined ? '' : req.file.originalname;

    //, file_status=? 
    const sql1 = "UPDATE student_council_notice SET title=?, content=?, edited_date=? WHERE no=?";
    const params1 = [title, content, date, no];
    //, file_status=? 
    const sql2 = "UPDATE student_council_notice SET title=?, content=?, img=?, edited_date=? WHERE no=?";
    const params2 = [title, content, img, date, no];

    //이미지 없으면 sql2 쿼리, 이미지 있으면 sql1 쿼리
    let sql=req.file==undefined? sql2 : sql1;
    let params=req.file==undefined? params2 : params1;

    try {
        const data = await pool.query(sql,params);
        res.write(
            `<script type="text/javascript">alert('student_council_notice Edit Success !!')</script>`
        );
        res.write(`<script>window.location="/api/student_council_notice_list"</script>`);
        res.end();
    } catch (err) {
        console.error(err);
        res.write('<script>window.location="/"</script>');
    }

});

  //작품전시 글 삭제하기
router.post("/delete", async (req, res) => {
    //console.log(req.body);
    const no=Number(req.body.no);
    const file_status=await pool.query(`SELECT file_status FROM student_council_notice WHERE no=${no}`);

    if(file_status[0][0].file_status==1){
        const data = await pool.query(`DELETE FROM file_sc WHERE no=?`,[no]);
    }  

    const sql = "DELETE FROM student_council_notice WHERE no=?";
    try {
        const data = await pool.query(sql,[no]);
        res.write(
            `<script type="text/javascript">alert('student_council_notice Delete Success !!')</script>`
        );
        res.write(`<script>window.location="/api/student_council_notice_list"</script>`);
        res.end();
    } catch (err) {
        console.error(err);
        res.write('<script>window.location="/"</script>');
    }
});

module.exports = router;