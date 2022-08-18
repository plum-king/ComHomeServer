const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const path = require("path");
const {sendNotification} = require("./push.js");
const date_fns = require("date-fns");
const {Storage} = require('@google-cloud/storage');
const Multer = require('multer');
const {format} = require('util');
const templates = require("../lib/templates");
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

let newFileName;
let sc_notice_id;

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
    sc_notice_id = date % 10000;
    const fileinfo=req.files;
    const { img, file } = fileinfo;

    const post = req.body;

    let count;
    
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

    const title = post.title;
    const content = post.content;
    const sc_notice_img = fileinfo.img == undefined ? null : fileinfo.img[0].originalname;
    const sc_notice_file = fileinfo.file == undefined ? "" : fileinfo.file[0].path;
    const start_date = post.start_date;
    const end_date = post.end_date;
    const sql = `INSERT INTO student_council_notice(no, title, content, iduser, upload_time, edited_date, views, img, file_status, start_date, end_date) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
    const params = [
        sc_notice_id,
        title,
        content,
        req.body.iduser,
        date,
        date,
        0,
        sc_notice_img,
        count > 0 ? 1 : 0,
        start_date,
        end_date,
    ];

    try {
    const data = await pool.query(sql, params);

    const [subscribe_data] = await pool.query(
        `SELECT subscribe FROM subscriptions WHERE student_council_notice and subscribe is not null`
    );
    const message = {
        message: `학생회 공지가 새로 올라왔습니다!`,
    };
    subscribe_data.map((subscribe) => {
        try{
            sendNotification(JSON.parse(subscribe.subscribe), message);
        } catch(err) {
        console.error(err);
        }
    });

    let data_file;
    
    for (let i = 0; i < count; i++) {
        newFileName = `${fileinfo.file[i].originalname}`;
        data_file = await pool.query(
            `INSERT INTO file_sc(no, file_infoN, file_originN) VALUES(?,?,?)`,
            [
            sc_notice_id,
            newFileName, 
            fileinfo.file[i].originalname
            ]
        );
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
        `UPDATE student_council_notice SET imgAccessToken = ? WHERE no = ?`,
        [uuid, sc_notice_id]
    );
    const imgName_update = await pool.query(
        `UPDATE student_council_notice SET img = ? WHERE no = ?`,
        [newFileName, sc_notice_id]
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
            [uuid, sc_notice_id]
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