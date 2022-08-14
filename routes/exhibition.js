const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const {sendNotification} = require("./push.js");
const date_fns = require("date-fns");

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

// router.post("/", upload.single("img"), async (req, res) => {
//   const data = await pool.query(`SELECT * FROM exhibition desc limit 10`);
//   res.json({
//     data_det: data[0],
//   });
// });

router.post("/post", upload.single("img"), async (req, res) => {
  const userid = req.body.iduser;
  const post = req.body;
  const exh_title = post.title;
  const exh_content = post.content;
  const exh_award = post.award;
  const stack = post.stack;
  const keyword = post.keyword;
  const team = post.team;
  const exh_contestName = post.contestName;
  const link_github = post.link_github;
  const link_service = post.link_service;

  const exh_img = post.files.img == undefined ? "" : post.files.img[0].path;

  const sql =
    "INSERT INTO exhibition (iduser, title, content, img, award, stack, keyword, team, contestName, link_github, link_service) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,?)";
  const params = [
    userid,
    exh_title,
    exh_content,
    exh_img,
    exh_award,
    stack,
    keyword,
    team,
    exh_contestName,
    link_github,
    link_service,
  ];

  //알람
  //작품 전시 알람 ON한 사용자들
  // const exhibition_data = await pool.query(
  //   `SELECT subscribe FROM subscriptions WHERE exhibition and subscribe is not null`
  // );
  // const message = {
  //   message: `작품 전시 글이 새로 올라왔습니다!`,
  // };
  // exhibition_data.map((subscribe) => {
  //   sendNotification(JSON.parse(subscribe.subscribe), message);
  // });

  try {
    const data = await pool.query(sql, params);
    let no = data[0].insertId;
    res.json({no: no});
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
