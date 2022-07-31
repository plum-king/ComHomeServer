const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");

function date_to_str(format) {
    var year = format.getFullYear();
    var month = format.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = format.getDate();
    if (date < 10) date = "0" + date;
    var hour = format.getHours();
    if (hour < 10) hour = "0" + hour;
    var min = format.getMinutes();
    if (min < 10) min = "0" + min;
    var sec = format.getSeconds();
    if (sec < 10) sec = "0" + sec;
    return year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec;
}

router.get("/student_council_notice_list", async (req, res) => {
    const title = "학생회 공지";
    const head = ``;
    let body = `게시글 제목 | 작성 날짜<br>`;

    let i = 0;
    const data = await pool.query(
    `SELECT * FROM student_council_notice ORDER BY upload_time DESC`
    );
    let data_det = data[0];

    while (i < data_det.length) {
        const data2 = await pool.query(`SELECT name FROM user where iduser = ?`, [
        data_det[i].iduser,
        ]);
        let timestamp = data_det[i].upload_time;
        let upload_time = date_to_str(timestamp);
        body += `<a href = "/student_council_notice_detail/${data_det[i].sc_notice_no}"><div>${data_det[i].sc_notice_title}| ${upload_time}<br></div></a> `;
        i++;
    }
    body += `<br><a href = "/student_council_notice_check">학생회 공지 작성하기</a> <br> <a href="/"> 홈으로 돌아가기 </a>`;
    var html = templates.HTML(title, head, body);
    res.send(html);
});

module.exports = router;
