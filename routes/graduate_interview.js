const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");
const path = require("path");

router.get("/post", async (req, res) => {
  //const review_no = path.parse(req.params.review_no).base;
  //console.log(review_no);
  const title = "졸업생 인터뷰 작성";
  const head = ``;
  const body = `
    <form action="/api/graduate_interview/post" method ="post">
    <label> 직업: 
    <input type = "text" name = "job" placeholder = "ex) 00기업 개발자" /> </label>
    <br>
    <label> 학번:
    <input type = "text" name = "schoolId" placeholder = "ex)20180000" /> </label>
    <br>
    <label> (간단 자기소개)내용: 
    <textarea name="content"></textarea>
    <br>
    <button type="submit"><b>등록</b></button>
    </form>
    `;

  var html = templates.HTML(title, head, body);
  res.send(html);
});

router.post("/post", async (req, res) => {
    //const review_no = path.parse(req.params.review_no).base;
    //console.log(review_no);
    const job=req.body.job;
    const schoolId=req.body.schoolId;
    const content=req.body.content;

    try {
        const data = await pool.query(
          `INSERT INTO graduate_interview (graduateId, job, schoolId, content) VALUES(?, ?, ?, ?)`,
          [req.user.id, job, schoolId,content]
        );
        res.write('<script>window.location="/api/graduate_interview_list"</script>');
      } catch (err) {
        console.error(err);
        res.write('<script>window.location="/api/graduate_interview_list"</script>');
      }
  });

module.exports = router;