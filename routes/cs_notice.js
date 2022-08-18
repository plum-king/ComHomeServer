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

let notice_id;
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
  { name: 'file', maxCount: 8 },
])

router.post("/post", fileFields, async (req, res) => {
  const date = new Date();
  const post = req.body;
  notice_id = date % 10000;
  const fileinfo=req.files;
  const { img, file } = fileinfo;

  let count; //파일개수
    
  if (fileinfo.img) {
      uploadImageToStorage(fileinfo.img[0]).then((success) => {
      }).catch((error) => {
      console.error(error);
      });
  }

  if (fileinfo.file) {
    count = Object.keys(file).length;
    for (let i=0;i<count;i++){
    uploadFileToStorage(fileinfo.file[i]).then((success) => {
    }).catch((error) => {
        console.error(error);
    });
    }
  }

  const notice_id = date % 10000;
  const title = post.title;
  const content = post.content;
  const notice_img = req.files.img == undefined ? "" : req.files.img[0].path;
  const notice_file = req.files.file == undefined ? "" : req.files.file[0].path;

  const sql = `INSERT INTO cs_notice(no, iduser, title, content, upload_time, edited_date, views, img, file_status) VALUES(?,?,?,?,?,?,?,?,?)`;
  const params = [
    notice_id,
    req.body.iduser,
    title,
    content,
    date,
    date,
    0,
    notice_img,
    count > 0 ? 1 : 0,
  ]; //count >0 ? 1 :0 -> 첨부파일 여부확인

  try {
    const data = await pool.query(sql, params);

    //알람
    //채용인턴십 알람 ON한 사용자들
    const [cs_data] = await pool.query(
      `SELECT subscribe FROM subscriptions WHERE cs_notice and subscribe is not null`
    );
    const message = {
      message: `학과 공지글이 새로 올라왔습니다!`,
    };
    cs_data.map((subscribe) => {
      sendNotification(JSON.parse(subscribe.subscribe), message);
    });

    let data_file;
    
    for (let i = 0; i < count; i++) {
        newFileName = `${fileinfo.file[i].originalname}`;
        data_file = await pool.query(
            `INSERT INTO file_cs(no, file_infoN, file_originN) VALUES(?,?,?)`,
            [
            notice_id,
            newFileName, 
            fileinfo.file[i].originalname
            ]
        );
    }

    res.json({no: no, data_file: data_file});
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

const uploadFileToStorage = (file) => {
    return new Promise(async (resolve, reject) => {
        if (!file) {
            reject('No image file');
        }

        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

        newFileName = `${file.originalname}`;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
            firebaseStorageDownloadTokens: uuid
            }
        });
        
            const fileToken_update = await pool.query(
            `UPDATE file_sc set file_accessToken = ? WHERE no = ?`,
            [uuid, notice_id]
            );

        blobStream.on('error', (error) => {
            reject('Something is wrong! Unable to upload at the moment.');
        });
    
        blobStream.on('finish', () => {
            const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
            resolve(url);
        });
        
        blobStream.end(file.buffer);
    });
}

module.exports = router;
