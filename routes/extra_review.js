const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const { sendNotification } = require("./push.js");

router.post("/post", async (req, res) => {
  const post = req.body;
  const title = post.title;
  const content = post.content;

  try {
    const data = await pool.query(
      `INSERT INTO extra_review(title, content, iduser) VALUES(?, ?, ?)`,
      [title, content, req.body.iduser]
    );

    //알람
    //대외 활동 후기 알람 ON한 사용자들
    const extra_data = await pool.query(
      `SELECT subscribe FROM subscriptions WHERE extra_review and subscribe is not null`
    );
    const message = {
      message: `대외 활동 후기 글이 새로 올라왔습니다!`,
    };
    extra_data.map((subscribe) => {
        sendNotification(JSON.parse(subscribe.subscribe), message);
    })
    
  } catch (err) {
    console.error(err);
  }
  let no = data[0].insertId;
  res.json({no: no});
});

module.exports = router;
