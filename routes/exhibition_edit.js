const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const multer = require("multer");
const path = require("path");
const {sendNotification} = require("./push.js");
const date_fns = require("date-fns");

//작품전시 글 수정하기
router.post("/", async (req, res, next) => {
  const no = req.body.no;
  const data = await pool.query(`SELECT * FROM exhibition WHERE no=${no}`);
  const data_det = data[0][0];
  res.json({data_det: data_det});
});

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

//수정한 글 db에 저장
router.post("/update", upload.single("img"), async (req, res) => {
  const post = req.body;
  const exh_id = post.no;
  const exh_title = post.title;
  const exh_content = post.content;
  const exh_award = post.award;
  const exh_contestName = post.contestName;
  const stack = post.stack;
  const keyword = post.keyword;
  const team = post.team;  
  const link_github = post.link_github;
  const link_service = post.link_service;
  const exh_img = req.file == undefined ? "" : req.file.path;
  let status = 404;

  const sql1 =
    "UPDATE exhibition SET title=?, content=?, img=?, award=?, stack=?, keyword=?, team=?, contestName=?, link_github=? , link_service=? WHERE no=?";
  const params1 = [
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
    exh_id,
  ];

  //수정할때 이미지 추가 안한경우에는 update문에서 img 속성은 뺴야함
  const sql2 =
    "UPDATE exhibition SET title=?, content=?, award=?, stack=?, keyword=?, team=?, contestName=?, link_github=? , link_service=? WHERE no=?";
  const params2 = [
    exh_title,
    exh_content,
    exh_award,
    stack,
    keyword,
    team,
    exh_contestName,
    link_github,
    link_service,
    exh_id,
  ];

  //이미지 없으면 sql2 쿼리, 이미지 있으면 sql1 쿼리
  let sql = req.file == undefined ? sql2 : sql1;
  let params = req.file == undefined ? params2 : params1;

  try {
    const data = await pool.query(sql, params);

    //작품 전시 알람 ON한 사용자들
    const exhibition_data = await pool.query(
      `SELECT subscribe FROM subscriptions WHERE exhibition and subscribe is not null`
    );

    const message = {
      message: `작품 전시 글이 수정되었습니다!`,
    };
    exhibition_data.map((subscribe) => {
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
  const exh_id = req.body.no;
  let status = 404;

  try {
    const data = await pool.query("DELETE FROM exhibition WHERE no=?", [
      exh_id,
    ]);
    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });
});

module.exports = router;
