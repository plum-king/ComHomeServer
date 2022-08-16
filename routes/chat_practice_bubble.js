const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");

//원래 소켓 코드 router.get 안에 썼었는데 중복 메시지 때문에 app.js에 작성
router.get("/:roomid", async (req,res)=>{

    const roomid=req.params.roomid;
    let roomName = 'Room_' + roomid;

    //await 이 있어야 함!!
    const data= await pool.query(`SELECT * FROM b_chat WHERE roomid = ?`,[roomName]);
    const data_det=data[0];
    //console.log(data_det);


    //html 코드
    const title = "버블 채팅";
    const head = `<meta charset="utf-8">
    <title>Socket Tester</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <style>
    #messages { list-style-type: none; margin: 0; padding: 0; }
    #messages li { padding: 5px 10px; }
    #messages li:nth-child(odd) { background: #eee; }

    </style>`
    let body = `
    <div class="row">

    <!-- 방선택 -->
    <div class="col-lg-8">
      <div class="card">
        <div class="card-header">
          방선택
        </div>
        <div class="card-body">
          <form action="">
            <div class="input-group mb-1">
              <input type="text" class="form-control" id="room-message" autocomplete="off" />
              <input type = "hidden" id = 'sender' value = ${req.user.id}>
              <input type = "hidden" id = 'room' value = ${roomName}>
              <div class="input-group-append">
                <button id="room-msg-send" class="btn btn-primary" placeholder="message">Send</button>
              </div>
            </div>
          </form>
        </div>
        <div class="card-footer">
          <ul id="room-messages">`
          for(let i=0;i<data_det.length;i++){
            body+=`<li>${data_det[i].senderid} : ${data_det[i].message}</li>`
          }
          body+=`
          </ul>
          <ul id="room-messagesRes">
          
          </ul>
        </div>
      </div>
    </div>
  </div>
  
  <script src="/socket.io/socket.io.js"></script>
  <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
  <script>
    $(() => {
      /** Socket Starts **/
      const socket = io();

      /**
      console.log('방번호:'+room);
      socket.emit('room',${roomName}); **/

      //채팅방 메시지 보내기
      $('#room-msg-send').click(() => {
        socket.emit('req_room_message', $('#room').val(),$('#sender').val(),$('#room-message').val());
        $('#room-message').val('');
        return false;
      });

      //대기실 메시지 보이기
      // socket.on('response_message', (res) => {
      //   $('#messages').prepend($('<li>').text(res));
      // });

      // socket.on('noti_join_room', (res) => {
      //     console.log(res);
      //   $('#room-messages').prepend($('<li>').text(res));
      // });

      //채팅방 메시지 보이기
      socket.on('noti_room_message', (res) => {
        console.log(res);
        $('#room-messagesRes').prepend($('<li>').text(res));
      });

    });
  </script>
        `;

    var html = templates.HTML(title, head, body);
    res.send(html);
})

module.exports = router;