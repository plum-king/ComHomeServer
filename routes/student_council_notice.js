const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const pool = require("../db.js");
const templates = require("../lib/templates");

router.get("/student_council_notice_write", async (req, res) => {
    const title = "학생회 공지 작성";
    const head = ``;
    const body = `
    <form action="/student_council_notice_write" method ="post">
    <p>${req.user.name}</p>
    <label> 제목: 
        <input type = "text" name = "sc_notice_title" placeholder = "제목을 작성하세요" /> </label>
        <br>
        <br>
        <label> 내용: 
        <input type = "textarea" name = "sc_notice_cont" placeholder = "내용을 작성하세요" /> </label>
        <br>
        <button type="submit"><b>입력</b></button>
        </form>
    `;

    var html = templates.HTML(title, head, body);
    res.send(html);
});

router.post("/student_council_notice_write", async (req, res) => {
    const post = req.body;
    const title = post.sc_notice_title;
    const cont = post.sc_notice_cont;
    
    try {
        const data = await pool.query(
        `INSERT INTO student_council_notice(sc_notice_title, sc_notice_cont, iduser) VALUES(?, ?, ?)`,
        [title, cont, req.user.id]
        );
        
        res.redirect(`/student_council_notice_detail/${data[0].insertId}`);
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
