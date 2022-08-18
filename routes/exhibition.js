const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const {sendNotification} = require("./push.js");
const Multer = require('multer');
const {format} = require('util');
const date_fns = require("date-fns");
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

let no;
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

//작품전시 list 보이기
router.get("/", async (req, res) => {
  if (req.user) {
    let data;
    try {
      data = await pool.query("select * from exhibition");
    } catch (err) {
      console.error(err);
    }
    let data_det = data[0];
    res.json({data_det: data_det});
  }
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

router.post("/post", upload.single("img"), async (req, res) => {

  const fileinfo=req.files;
  const { img, file } = fileinfo;
  
  if (fileinfo.img) {
    uploadImageToStorage(fileinfo.img[0]).then((success) => {
    }).catch((error) => {
    console.error(error);
    });
}

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

  const exh_img = req.files.img == undefined ? "" : req.files.img[0].path;

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
  const [exhibition_data] = await pool.query(
    `SELECT subscribe FROM subscriptions WHERE exhibition and subscribe is not null`
  );
  const message = {
    message: `작품 전시 글이 새로 올라왔습니다!`,
  };
  exhibition_data.map((subscribe) => {
    sendNotification(JSON.parse(subscribe.subscribe), message);
  });

  try {
    const data = await pool.query(sql, params);
    let no = data[0].insertId;
    res.json({no: no});
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
      `UPDATE exhibition SET imgAccessToken = ? WHERE no = ?`,
      [uuid, no]
  );
  const imgName_update = await pool.query(
      `UPDATE exhibition SET img = ? WHERE no = ?`,
      [newFileName, no]
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
