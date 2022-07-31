const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");

router.get("/student_council_notice_detail/:sc_notice_no", async (req, res) => {
    const sc_notice_no = path.parse(req.params.sc_notice_no).base;
    console.log(sc_notice_no);
    const title = sc_notice_no + "번 게시글";
    const head = ``;
    const data = await pool.query(
    `SELECT * FROM student_council_notice where sc_notice_no = ?`,
    [sc_notice_no]
    );
    const body = `<p>${data[0][0].sc_notice_title}</p> 
    <p>${data[0][0].sc_notice_cont}</p>
    <a href = "/student_council_notice_list">목록으로 돌아가기</a>
    `;
    var html = templates.HTML(title, head, body);
    res.send(html);
});

module.exports = router;
