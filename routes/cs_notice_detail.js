const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");

router.get("/:notice_id", async (req, res) => {

    const notice_id = path.parse(req.params.notice_id).base;
    console.log(notice_id);

    //조회수 +1
    try {
        const data = await pool.query("UPDATE cs_notice set views=views+1 where no =? ",[notice_id]);
    } catch (err) {
        console.error(err);
    }

    const title = notice_id + "번 게시글";
    const head = `<meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">`;

    const data = await pool.query(`SELECT * FROM cs_notice where no = ?`,[notice_id]);
    const file_data = await pool.query(`SELECT * FROM file_cs where no = ?`,[notice_id]);
    const time_data = await pool.query(`SELECT date_format(upload_time, '%Y-%m-%d') FROM cs_notice`);
    const time_data2 = await pool.query(`SELECT date_format(edited_date, '%Y-%m-%d') FROM cs_notice`);
    //console.log(data[0][0].not_img);

    let body = `<p>제목: ${data[0][0].title}</p>
    <p>작성일: ${time_data[0][0]["date_format(upload_time, '%Y-%m-%d')"]}</p>
    <p>수정일: ${time_data2[0][0]["date_format(edited_date, '%Y-%m-%d')"]}</p>
    <p>조회수: ${data[0][0].views}</p>
    <p>글번호: ${notice_id}</p>
    <p><b>=첨부파일=</b></p>
    `
    console.log(file_data[0]);
    if(file_data[0].length>0){
     for(let i=0; i < file_data[0].length; i++) {   //file_data[0].length [0]을 하자!!
        let filename=file_data[0][i].file_infoN.substr(8);

        const file = 'uploads/' + filename;

        body +=`<a href = "/api/download/${filename}">${file_data[0][i].file_originN}</a><br>`;
        }
    }else{
        body +=`<p>첨부파일이(가) 없습니다.</p>`
    }
        //수정하기 + 삭제하기 버튼
        if(req.user){
            if(req.user.id==data[0][0].user_id){
                body +=`
                <form action="/api/cs_notice_edit" method="post">
                <input type="hidden" name="id" value="${notice_id}">
                <input type="submit" name="edit" value="수정하기">
                </form>
    
                <form action="/api/cs_notice_edit/delete" method="post">
                <input type="hidden" name="id" value="${notice_id}">
                <input type="submit" name="edit" value="삭제하기"
                onClick="return confirm('Are you sure you want to delete this notice?')">
                </form>
                `
            }
        }

    body+=`
    <hr>
    <div>
    <img src="${data[0][0].img}" />
    </div>
    <p>내용: ${data[0][0].content}</p>
    <a href = "/api/cs_notice_list">목록으로 돌아가기</a>
    `;
    var html = templates.HTML(title, head, body);
    res.send(html);
});

module.exports = router;