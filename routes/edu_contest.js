const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const multer = require("multer");
const path = require("path");
const date_fns = require("date-fns");
const {sendNotification} = require("./push.js");
const {Storage} = require('@google-cloud/storage');
const Multer = require('multer');
const {format} = require('util');
const templates = require("../lib/templates");
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const file_date = Date.now();

const storage = new Storage({
  projectId: "comhome-7cab0",
  keyFilename: "../ComHomeServer/config/comhome-7cab0-firebase-adminsdk-dc7ia-e24746dcd5.json",
});

const bucket = storage.bucket("comhome-7cab0.appspot.com");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
      fileSize: 20 * 1024 * 1024
  }
});

const fileFields = multer.fields([
  { name: 'img', maxCount: 1 },
])


// 글 작성하기
router.post("/post", upload.single("img"), async (req, res) => {
  const now = new Date();
  const post = req.body;
  const iduser = post.iduser;
  const title = post.title;
  const content = post.content;
  const end_date = post.end_date;
  const fileinfo=req.files;
  const { img } = fileinfo;
    
  if (fileinfo.img) {
      uploadImageToStorage(fileinfo.img[0]).then((success) => {
      }).catch((error) => {
      console.error(error);
      });
  }

  const edu_img = req.files.img == undefined ? "" : req.files.img[0].path;
  try {
    const data = await pool.query(
      `INSERT INTO edu_contest(title, content, edited_date, img, views, iduser, end_date) VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [title, content, now, img, 0, iduser, end_date] //iduser 나중에 바꾸기
    );
    let no = data[0].insertId;
    //알람
    //교육 공모전 알람 ON한 사용자들
    const [edu_data] = await pool.query(
      `SELECT subscribe FROM subscriptions WHERE edu_contest and subscribe is not null`
    );
    const message = {
      message: `교육 공모전 글이 새로 올라왔습니다!`,
    };
    edu_data.map((subscribe) => {
      sendNotification(JSON.parse(subscribe.subscribe), message);
    });
    res.json({
      no: no,
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/expire", async (req, res) => {
  const post = req.body;
  const post_no = post.no;
  const end_date = post.end_date;
  try {
    const data = await pool.query(
      `UPDATE edu_contest SET end_date=? WHERE no = ?`,
      [end_date, post_no]
    );
    res.json({
      no: no,
    });
  } catch (err) {
    console.error(err);
  }
});

//추가
/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */

 const uploadImageToStorage = (file) => {
  return new Promise(async (resolve, reject) => {
  if (!file) {
      reject('No image file');
  }

  //한글파일 이름
  file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

  newFileName = `${file_date}_${file.originalname}`;

  let fileUpload = bucket.file('images/'+newFileName);

  const blobStream = fileUpload.createWriteStream({
      metadata: {
          firebaseStorageDownloadTokens: uuid
      }
  });

  const imgToken_update = await pool.query(
      `UPDATE cs_notice SET imgAccessToken = ? WHERE no = ?`,
      [uuid, notice_id]
  );
  const imgName_update = await pool.query(
      `UPDATE cs_notice SET img = ? WHERE no = ?`,
      [newFileName, ]
  );

  blobStream.on('error', (error) => {
      reject('Something is wrong! Unable to upload at the moment.');
  });

  blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = format(`https://storage.googleapis.com/${bucket.name}/images/${fileUpload.name}`);
      resolve(url);
  });

  blobStream.end(file.buffer);
  });
}
module.exports = router;
