const express = require("express");
const router = express.Router();
const pool = require("../db.js");
const templates = require("../lib/templates");

router.get("/", async (req, res) => {   //    /:userid 하기

    //채팅 룸 넘버 가져오기
    let room;
    let userid=req.user.id;
    let receiver='선배id';

    try {
      room = await pool.query("select * from room where myid=? and yourid=?",[userid,receiver]);
      console.log(room[0][0]);
    } catch (err) {
      console.error(err);
      res.write('<script>window.location="/"</script>');
    }

    if(room[0][0]==null){ //룸넘버 없으면 insert하기
        try {
            const roomid=new Date()%1000;
            const data = await pool.query("INSERT INTO room (myid,yourid,room) VALUES (?,?,?)",[userid,receiver,roomid]);
          } catch (err) {
            console.error(err);
            res.write('<script>window.location="/"</script>');
          }
          room = await pool.query("select * from room where myid=? and yourid=?",[userid,receiver]);
    }
    room=room[0][0].room;

    //소켓
    let io = req.app.get('socketio');
    
    io.on("connection", (socket) => {
        console.log('User connected',socket.id);
        console.log(socket.rooms);

        socket.on("room",(room) => {
            socket.join(room); //join으로 room연결
            console.log("유저 입장")
        });

        socket.on("new_message", (data, senderId, receiverId , room, socketId) => {
            console.log("채팅방번호 : " + room);
            io.emit("message", data);
            io.to(room).emit('new_message',data, socketId); //to client 전달

            const sql="INSERT INTO chat (receiver, sender, date, message) VALUES(?,?,?,?)";
            const params=[receiverId, senderId, new Date(), data];
            try{
              const data= pool.query(sql,params);
            } catch(err){
              console.error(err);
            }
      
        });
      });
      
    //html 코드
    const title = "일대일 채팅";
    const head = `<meta charset="UTF-8">
    <title>simple chat</title>`
    const body = `
    <script src="/socket.io/socket.io.js"></script>

    <h1>Simple Chat</h1>
    
    <input name ='messageContent' id='message' placeholder="Enter message">
    <input type = "hidden" id ='receiver' value = ${receiver}>
    <input type = "hidden" id = 'sender' value = ${userid}>
    <input type = "hidden" id = 'room' value = ${room}>
    console.log(${receiver},${userid},${room});
    <button onclick="sendMessage()">보내기</button>
    <hr />
    <script>
        let socket;
        window.onload = () => {
            // socket 연결
            socket = io.connect('/');
            let room=document.getElementById('room').value;
            console.log('방번호:'+room);
            socket.emit('room',room);
        }

        // 버튼 클릭 시 메시지 송신
        function sendMessage(){
            console.log("sendMessage()여기 왔냐??");
            let message = document.getElementById('message').value;
            let senderId = document.getElementById('sender').value;
            let receiverId = document.getElementById('receiver').value;
            let room = document.getElementById('room').value;

            console.log(receiverId,senderId,room,message);

            document.getElementById('message').value = '';
            socket.emit('new_message',message, senderId, receiverId, room, socket.id);// emit으로 server에게 전송
        }
        `;

    var html = templates.HTML(title, head, body);
    res.send(html);

});

module.exports = router;
