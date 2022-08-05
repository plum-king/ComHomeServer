const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");

router.get("/:no", async (req, res) => {
    const no = Number(path.parse(req.params.no).base);

    //조회수 +1
    try {
        const data = await pool.query("UPDATE student_council_notice set views=views+1 where no =? ",[no]);
    } catch (err) {
        console.error(err);
    }

    const sc_title = no + "번 게시글";
    const head = `<meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">`;
    const data = await pool.query(`SELECT * FROM student_council_notice where no = ?`, [no]);
    const file_data = await pool.query(`SELECT * FROM file_sc where no = ?`,[no]);
    const time_data = await pool.query(`SELECT date_format(upload_time, '%Y-%m-%d') FROM student_council_notice where no = ?`, [no]);
    const time_data2 = await pool.query(`SELECT date_format(edited_date, '%Y-%m-%d') FROM student_council_notice where no = ?`, [no]);
    
    let body = `<p>제목: ${data[0][0].title}</p>
    <p>작성일: ${time_data[0][0]["date_format(upload_time, '%Y-%m-%d')"]}</p>
    <p>수정일: ${time_data2[0][0]["date_format(edited_date, '%Y-%m-%d')"]}</p>
    <p>조회수: ${data[0][0].views}</p>
    <p>글번호: ${no}</p>
    <p>시작날짜: ${data[0][0].start_date}</p>
    <p>종료날짜: ${data[0][0].end_date}</p>
    <p><b>=첨부파일=</b></p>
    `

    if(file_data[0].length > 0){
        for(let i=0; i < file_data[0].length; i++) {
            let filename=file_data[0][i].file_infoN.substr(8);
            body +=`<a href = "/api/download/${filename}">${file_data[0][i].file_originN}</a><br>`;
        }
    }else{
        body +=`<p>첨부파일이(가) 없습니다.</p>`
    }

    if (req.user.id == data[0][0].iduser) {
        body += `<form action="/api/student_council_notice_edit" method="post">
        <input type="hidden" name="no" value="${no}">
        <input type="submit" name="edit" value="수정하기">
        </form>
        <form action="/api/student_council_notice_edit/delete" method="post">
        <input type="hidden" name="no" value="${no}">
        <input type="submit" name="delete" value="삭제하기"
        onClick="return confirm('Are you sure you want to delete this student_council_notice?')">
        </form>`;
    }
    
    body+=`
    <hr>
    <div>
    <img src="${data[0][0].img}" />
    </div>
    <p>내용: ${data[0][0].content}</p>
    <a href = "/api/student_council_notice_list">목록으로 돌아가기</a>
    `;
    var html = templates.HTML(sc_title, head, body);
    res.send(html);
});

module.exports = router;
