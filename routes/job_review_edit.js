const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const {sendNotification} = require("./push.js");
const date_fns = require("date-fns");

//수정한 글 db에 저장
router.post("/update", async (req, res) => {
  const post = req.body;
  const no = post.no;
  const title = post.title;
  const content = post.content;
  let status = 404;

  try {
    const sql1 = await pool.query(
      "UPDATE job_review SET title=?, content=? WHERE no=?",
      [title, content, no]
    );

    //취업 후기 알람 ON한 사용자들
    const job_data = await pool.query(
      `SELECT subscribe FROM subscriptions WHERE job_review and subscribe is not null`
    );

    const message = {
      message: `취업 후기 글이 수정되었습니다!`,
    };
    job_data.map((subscribe) => {
      sendNotification(JSON.parse(subscribe.subscribe), message);
    });

    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

//작품전시 글 삭제하기
router.post("/delete", async (req, res) => {
  const no = req.body.no;
  let status = 404;

  try {
    const data = await pool.query("DELETE FROM job_review WHERE no=?", [no]);
    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

module.exports = router;
