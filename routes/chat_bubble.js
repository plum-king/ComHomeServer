const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");

//원래 소켓 코드 router.get 안에 썼었는데 중복 메시지 때문에 app.js에 작성
router.get("/:roomid", async (req,res)=>{
    const roomid=req.params.roomid;
    let roomName = 'Room_' + roomid;

    //await 이 있어야 함!!
    //채팅내역 불러오기
    const data= await pool.query(`SELECT * FROM b_chat WHERE roomid = ?`,[roomName]);
    const data_det=data[0];

    res.json({
      data_det: data_det,
  });
})

module.exports = router;