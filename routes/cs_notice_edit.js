const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const multer = require("multer");
const path = require("path");
const date_fns = require("date-fns");
const {sendNotification} = require("./push.js");

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

const fileFields = upload.fields([
  {name: "img", maxCount: 1},
  {name: "file", maxCount: 8},
]);

//수정한 글 db에 저장
router.post("/update", fileFields, async (req, res) => {
  const edit = req.body;
  const notice_id = edit.no;
  const date = new Date();
  const title = edit.title;
  const cont = edit.content;
  const notice_img = req.files.img == undefined ? "" : req.files.img[0].path;
  let status = 404;
  const sql1 =
    "UPDATE cs_notice SET title=?, content=?, edited_date=?, img=? WHERE no=?";
  const params1 = [title, cont, date, notice_img, notice_id];

  //수정할때 이미지 추가 안한경우에는 update문에서 img 속성은 빼야함
  const sql2 =
    "UPDATE cs_notice SET title=?, content=?, edited_date=? WHERE no=?";
  const params2 = [title, cont, date, notice_id];

  //이미지 없으면 sql2 쿼리, 이미지 있으면 sql1 쿼리
  let sql = req.file == undefined ? sql2 : sql1;
  let params = req.file == undefined ? params2 : params1;

  try {
    const data = await pool.query(sql, params);

    //학과 공지 알람 ON한 사용자들
    const [cs_data] = await pool.query(
      `SELECT subscribe FROM subscriptions WHERE cs_notice and subscribe is not null`
    );
    const message = {
      message: `학과 공지 글이 수정되었습니다!`,
    };
    cs_data.map((subscribe) => {
      sendNotification(JSON.parse(subscribe.subscribe), message);
    });

    status = 200;
  } catch (err) {
    console.error(err);
  }
  res.json({
    status: status,
  });

  //첨부파일 수정-->> 여러개 table에 저장 (추후 구현예정)
  /*
    for(let i=0;i<count;i++){
      try {
        const data = await pool.query(`INSERT INTO file_intern(notice_id, file_infoN, file_originN) VALUES(?,?,?)`,[notice_id, req.files.file[i].path, req.files.file[i].originalname]);
      } catch (err) {
        console.error(err);
      }
    }
    */
});

//채용인턴십 글 삭제하기
router.post("/delete", async (req, res) => {
  const notice_id = req.body.no;
  let status = 404;
  const file_status = await pool.query(
    `SELECT file_status FROM cs_notice WHERE no=${notice_id}`
  );

  if (file_status[0][0].not_file_status == 1) {
    //console.log('첨부파일 존재함.->삭제하기');
    const data = await pool.query(`DELETE FROM file_cs WHERE no=?`, [
      notice_id,
    ]);
  }

  try {
    const data = await pool.query(`DELETE FROM cs_notice WHERE no=?`, [
      notice_id,
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
