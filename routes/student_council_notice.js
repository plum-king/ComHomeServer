const express = require("express");
const router = express.Router();
const pool = require("../db.js");
// const multer = require("multer");
const path = require("path");
const {request} = require("http");
const {sendNotification} = require("./push.js");
const date_fns = require("date-fns");
const {Storage} = require('@google-cloud/storage');
const Multer = require('multer');
const {format} = require('util');
const templates = require("../lib/templates");
// const uuidv4 = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
// const imguuid = uuidv4();

let newFileName;
let sc_notice_id;

const file_date = Date.now();

//테스트용
router.get("/post", async (req, res) => {
  // if(!req.user) {
  //     res.write(`<script type="text/javascript">alert('Please Login First !!')</script>`);
  //     res.write(`<script>window.location="/api/auth/login"</script>`);
  //     res.end();
  // }
  //
  const title = "학생회 공지글 작성";
  const head = ``;
  const body = `
  <form action="/api/student_council_notice/post" method ="post" enctype="multipart/form-data" accept-charset="UTF-8">
      <b>학생회 공지 작성</b>
      <br>
      <label> 제목: 
          <input type = "text" name = "title" placeholder = "제목을 작성하세요" /> </label>
      <br>
      <br>
      <label> 내용: 
          <textarea name="content" placeholder = "내용을 작성하세요"></textarea></label>
      <br>
      <label> 시작 날짜: 
        <input type = "date" name = "start_date"/> </label>
        <br>
        <label> 종료 날짜: 
        <input type = "date" name = "end_date"/> </label>
        <br>
      <label> 사진: 
          <input type='file' name='img' accept='image/jpg, image/png, image/jpeg'/></label>
          <br>
      <label> 파일: 
          <input type='file' name='file' multiple/></label>
      <button type="submit"><b>등록</b></button>
  </form>
  `;
  
  var html = templates.HTML(title, head, body);
  res.send(html);
});

const storage = new Storage({
  projectId: "comhome-7cab0",
  keyFilename: "../ComHomeServer/config/comhome-7cab0-firebase-adminsdk-dc7ia-e24746dcd5.json",
});

const bucket = storage.bucket("comhome-7cab0.appspot.com");

// //이미지 업로드를 위한 multer
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, callback) {
//       callback(null, "uploads/");
//     },
//     filename: function (req, file, callback) {
//       callback(null, new Date().valueOf() + path.extname(file.originalname));
//     },
//   }),
// });


const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

// const fileFields = upload.fields([
//   {name: "img", maxCount: 1},
//   {name: "file", maxCount: 8},
// ]);

const fileFields = multer.fields([
  { name: 'img', maxCount: 1 },
  { name: 'file', maxCount: 8 },
])

//let count;

// const uploadFile = async() => {
//   await storage.bucket(bucketName).upload(filename, {
//       gzip: true,
//       metadata: {
//           cacheControl: 'public, max-age=31536000',
//       },
//   });
//   console.log(`${filename} uploaded to ${bucketName}.`);
// }


router.post("/post", fileFields, async (req, res) => {
  const date = new Date();
  sc_notice_id = date % 10000;

  // let {img, file} = req.files;
  const fileinfo=req.files;
  const { img, file } = fileinfo;
  console.log("req.body : ", req.body);
  console.log("req.files : ", req.files);

  const post = req.body;

  let count;
  // if (fileinfo.file) {
  //   count = Object.keys(file).length;
  // }
  
  if (fileinfo.img) {
    uploadImageToStorage(fileinfo.img[0]).then((success) => {
      // res.status(200).send({
      //   status: 'success'
      // });
    }).catch((error) => {
      console.error(error);
    });
  }

  if (fileinfo.file) {
    count = Object.keys(file).length;
    console.log("count : ",count);
    for (let i=0;i<count;i++){
      // console.log(fileinfo.file[0]);
      console.log("-------");
      uploadFileToStorage(fileinfo.file[i]).then((success) => {
        // console.log("uploadFileToStorage success")
        // res.status(200).send({
        //   status: 'success'
        // });
      }).catch((error) => {
        console.error(error);
      });
      console.log("upload storage 끝");
    }
  }

  const title = post.title;
  const content = post.content;

  //user 조심~~ html에서 하느라 명시적으로 줌~~
  const sc_notice_img = fileinfo.img == undefined ? null : fileinfo.img[0].originalname;
  const sc_notice_file = fileinfo.file == undefined ? "" : fileinfo.file[0].path;
  const start_date = post.start_date;
  const end_date = post.end_date;
  const sql = `INSERT INTO student_council_notice(no, title, content, iduser, upload_time, edited_date, views, img, file_status, start_date, end_date) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
  const params = [
    sc_notice_id,
    title,
    content,
    "111865899156782818991",
    date,
    date,
    0,
    sc_notice_img,
    count > 0 ? 1 : 0,
    start_date,
    end_date,
  ];
  //111865899156782818991->req.body.iduser
  
  // uploadFile();

  try {
    console.log("student_council_notice INSERT 실행");
    const data = await pool.query(sql, params);
    console.log("data : ", data);

    // // 알람 테스트하려면 홈페이지 들어갈때마다 권한 설정해야해서 귀찮으니까 주석
    // //알람
    // //학생회 공지 알람 ON한 사용자들
    // const [subscribe_data] = await pool.query(
    //   `SELECT subscribe FROM subscriptions WHERE student_council_notice and subscribe is not null`
    // );
    // const message = {
    //   message: `학생회 공지가 새로 올라왔습니다!`,
    // };
    // subscribe_data.map((subscribe) => {
    //   try{
    //     sendNotification(JSON.parse(subscribe.subscribe), message);
    //   } catch(err) {
    //     console.error(err);
    //   }
    // });

    let data_file;
    //첨부파일 table에 저장
    for (let i = 0; i < count; i++) {
      console.log("첨부파일 table에 저장 ", i,"번째");
      newFileName = `${file_date}_${fileinfo.file[i].originalname}`;
      console.log("newFileName : ", newFileName);
      data_file = await pool.query(
        `INSERT INTO file_sc(no, file_infoN, file_originN) VALUES(?,?,?)`,
        [
          sc_notice_id,
          newFileName, 
          fileinfo.file[i].originalname
        ]
      );
      console.log("에러체크 -> data_file", data_file);
    }

    let no = data[0].insertId;
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
    console.log("file.originalname : ", file.originalname);
    if (!file) {
      reject('No image file');
    }

    //한글파일 이름
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

    newFileName = `${file_date}_${file.originalname}`;
    console.log("newFileName : ", newFileName);

    let fileUpload = bucket.file('images/'+newFileName);

    console.log("img uuid : ", uuid);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
    });

    const imgToken_update = await pool.query(
      `UPDATE student_council_notice SET imgAccessToken = ? WHERE no = ?`,
      [uuid, sc_notice_id]
    );
    const imgName_update = await pool.query(
      `UPDATE student_council_notice SET img = ? WHERE no = ?`,
      [newFileName, sc_notice_id]
    );
    console.log("sc_notice_id : ", sc_notice_id);
    console.log("imgToken_update : ", imgToken_update);

    blobStream.on('error', (error) => {
      console.log(error);
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

      //한글파일 이름
      //file.originalname = Buffer.from(JSON.stringify(file.originalname), 'latin1').toString('utf8');
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

      newFileName = `${file_date}_${file.originalname}`;
      console.log("newFileName : ", newFileName);

      let fileUpload = bucket.file('files/'+newFileName);
      
      console.log("uuid", uuid);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          firebaseStorageDownloadTokens: uuid
        }
      });
      
      // const [file, meta] = bucket.upload(newFileName,{
      //   destination: newFileName,
      //   resumable: false,
      //   public: true,
      //   metadata: {
      //     contentType: file.mimetype,
      //     metadata : {
      //       firebaseStorageDownloadTokens: uuidV4(),
      //     },
      //   },
      // });

      // try {
        const fileToken_update = await pool.query(
          `UPDATE file_sc SET file_accessToken = ? WHERE no = ?`,
          [uuid, sc_notice_id]
        );
        console.log("file_sc fileToken_update~~");
        console.log("sc_notice_id : ", sc_notice_id);
        console.log("file_accessToken : ", uuid);
        console.log("fileToken_update : ", fileToken_update);
      // } catch (err) {
      //   console.error(err);
      // }

      blobStream.on('error', (error) => {
        console.log(error);
        reject('Something is wrong! Unable to upload at the moment.');
      });
  
      blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const url = format(`https://storage.googleapis.com/${bucket.name}/files/${fileUpload.name}`);
        resolve(url);
      });
  
      blobStream.end(file.buffer);


      
      // const [metadata, response] = fileUpload.getMetadata();
      // console.log("metadata : ", metadata)
      // console.log("metadata.mediaLink", metadata.mediaLink)
      // // return metadata.mediaLink;

    });
}

module.exports = router;
