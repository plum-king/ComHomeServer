const express = require('express');
const router   = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

//작품전시
router.get('/', async (req, res) => {
  if(req.user){
    let data;
    try {
      data = await pool.query("select * from exhibition");
      console.log(data[0]);
    } catch (err) {
      console.error(err);
      res.write('<script>window.location="/"</script>');
    }
    
    const temp = getPage('Comhome','exhibition-project',getBtn(req.user), data[0]);
    console.log(temp);
    res.send(temp);
  }
  else{
    res.write(`<script type="text/javascript">alert('Please Login First !!')</script>`);
    res.write('<script>window.location="/"</script>');
  }

});

router.get('/post', async (req, res) => {   //이거 나중에 없애기...지금은 임시프론트땜에 get사용.
  //const userid=req.user.id
  const temp = postPage('exhibition-project 작품전시 작성하기');
  res.send(temp);
});

//이미지 업로드를 위한 multer
const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, 'uploads/')
      },
      filename: function (req, file, callback) {
        callback(null, new Date().valueOf() + path.extname(file.originalname))
      }
    }),
  });

router.post('/post', upload.single('img'), async (req, res) => {
    const userid=req.user.id;
    const exh_title=req.body.exh_title;
    const exh_content=req.body.exh_content;
    const exh_img = req.file == undefined ? '' : req.file.path;

    const sql = "INSERT INTO exhibition (userid, exh_title, exh_content, exh_img) VALUES (?, ?, ?, ? )";
    const params = [userid, exh_title, exh_content, exh_img];

    try {
        const data = await pool.query(sql,params);
        res.write(
            `<script type="text/javascript">alert('Exhibition Post Success !!')</script>`
          );
        res.write(`<script>window.location="/exhibition"</script>`);
        res.end();
      } catch (err) {
        console.error(err);
        res.write('<script>window.location="/"</script>');
      }
});


//exhibiton 프론트 임시
const getBtn = (user) =>{
    return `${user.name} | <a href="/exhibition/post">작품전시작성</a>` ;
}

const getPage = (title, description,auth,data)=>{
  let htmlbody;
  htmlbody=` <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
  </head>
  <body>
      ${auth}
      <h1>${title}</h1>
      <p>${description}</p>
      <hr>`

      console.log(data.length);
      for(let i=0; i < data.length; i++) {
        //console.log('여기 들어오긴 하냐>???');
        console.log(data[i]);
        htmlbody +=`<p><b>프로젝트이름: ${data[i].exh_title}</b></p><br>
        <img src="${data[i].exh_img}" />
        <p>프로젝트 소개: ${data[i].exh_content}</p>
        <hr>`;
      }

  console.log(htmlbody)
	return htmlbody+`</body></html>`;
}

//exhibition-post 프론트 임시
const postPage=(description)=>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <p>${description}</p>
    <form action="/exhibition/post" method="post" enctype="multipart/form-data">
    <table>
        <tr>
        <td>프로젝트 제목: </td>
        <td><input type="text" name="exh_title"></td>
        </tr>
        <tr>
        <td>프로젝트 소개(내용) :</td>
        <td><textarea name="exh_content"></textarea></td>
        </tr>
        <tr>
        <td>프로필 이미지</td>
        <td><input type='file' name='img' accept='image/jpg, image/png, image/jpeg' /></td>
        </tr>
        <br>
        <br>
        <tr>
        <td><input type="submit" value="등록"></td>
        </tr>
    </table>
    </form>
    </body>
    </html>
    `;
}

module.exports = router;