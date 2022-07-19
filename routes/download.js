const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const mime = require('mime');
const pool = require("../db.js");

router.get('/:file_name', async(req, res, next) => {
  const upload_folder = 'uploads/';
  const file = upload_folder + req.params.file_name;
  //console.log('11행');
  //console.log(file);
  
  try {
    if (fs.existsSync(file)) { // 파일이 존재하는지 체크
      const filename = path.basename(file); // 파일 경로에서 파일명(확장자포함)만 추출
      //console.log(filename);
      const mimetype = mime.getType(file); // 파일의 타입(형식)을 가져옴
      const file_infoN='uploads\\'+filename;

      try {
        data = await pool.query(`SELECT * FROM file_intern WHERE file_infoN= ? `,[file_infoN]);
        console.log(data[0][0].file_originN);
      } catch (err) {
        console.error(err);
      }
    
      res.setHeader('Content-disposition', 'attachment; filename=' + data[0][0].file_originN); // 다운받아질 파일명 설정
      res.setHeader('Content-type', mimetype); // 파일 형식 지정
    
      const filestream = fs.createReadStream(file);
      filestream.pipe(res);
    } else {
      res.send('해당 파일이 없습니다.');  
      return;
    }
  } catch (e) { // 에러 발생시
    console.log(e);
    res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
    return;
  }
});

module.exports = router;