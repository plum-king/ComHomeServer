const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const mime = require('mime');
const pool = require("../db.js");

router.get('/:file_name', async(req, res, next) => {
  const upload_folder = 'uploads/';
  const file = upload_folder + req.params.file_name;
  try {
    if (fs.existsSync(file)) { 
      const filename = path.basename(file);
      const mimetype = mime.getType(file); 
      const file_infoN='uploads\\'+filename;

      try {
        data = await pool.query(`SELECT * FROM file_sc WHERE file_infoN= ? `, [file_infoN]);
        console.log(data[0][0].file_originN);
      } catch (err) {
        console.error(err);
      }
    
      res.setHeader('Content-disposition', 'attachment; filename=' + data[0][0].file_originN); 
      res.setHeader('Content-type', mimetype); 
    
      const filestream = fs.createReadStream(file);
      filestream.pipe(res);
    } else {
      res.send('해당 파일이 없습니다.');  
      return;
    }
  } catch (e) { 
    console.log(e);
    res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
    return;
  }
});

module.exports = router;