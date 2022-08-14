const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

//이미지 업로드를 위한 multer
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "uploads/");
    },
    filename: function (req, file, callback) {
      callback(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
});

router.post("/post", upload.single("img"), async (req, res) => {
  const userid = req.user.id;
  const post = req.body;
  const exh_title = post.title;
  const exh_content = post.content;
  const exh_award = post.award;
  const exh_contestName = post.contestName;
  //8월7일 추가
  const link_github = post.link_github;
  const link_service = post.link_service;
  const exh_img = req.file == undefined ? "" : req.file.path;
  let status = 404;

  const sql =
    "INSERT INTO exhibition (iduser, title, content, img, award, contestName, link_github, link_service) VALUES (?, ?, ?, ?, ?, ? ,? ,?)";
  const params = [
    userid,
    exh_title,
    exh_content,
    exh_img,
    exh_award,
    exh_contestName,
    link_github,
    link_service,
  ];

  //알람
  //작품 전시 알람 ON한 사용자들
  const exhibition_data = await pool.query(
    `SELECT subscribe FROM subscriptions WHERE exhibition and subscribe is not null`
  );
  const message = {
    message: `작품 전시 글이 새로 올라왔습니다!`,
  };
  exhibition_data.map((subscribe) => {
    sendNotification(JSON.parse(subscribe.subscribe), message);
  })

  try {
    const data = await pool.query(sql, params);
    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

module.exports = router;
