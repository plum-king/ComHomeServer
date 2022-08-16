const express = require("express");
const router = express.Router();
const pool = require("../db.js");
//const http = require('http').createServer(app);
//const io = require('socket.io')(http);

router.get("/:roomid", async (req,res)=>{

    let rooms = [];
    const roomid=req.params.roomid;
    console.log(roomid);
    console.log(req.params);
    let roomName = 'Room_' + roomid;
    console.log(roomName);
    
    let io = req.app.get('socketio');

    io.on('connection', (socket)=>{

        // 채팅방에 채팅 요청
        socket.on('req_room_message', async (msg) => {
            socket.join(roomName);
            console.log("메시지:"+ msg);
            //io.to('Room_아이디').emit('noti_room_message', msg);
            io.to(roomName).emit('noti_room_message', msg);

            //
            const sql="INSERT INTO b_chat (roomid, senderid, message, date) VALUES(?,?,?,?)";
            const params=[roomName, req.user.id, msg, new Date()];
            try{
              const data= pool.query(sql,params);
            } catch(err){
              console.error(err);
            }

        });

        socket.on('disconnect', async () => {
            console.log('user disconnected');
        });
    });

    res.sendFile(__dirname + '/index.html');
})



// function getUserCurrentRoom(socket){
//     console.log("getUserCurentRoom 함수 왔니..?");
//     let currentRoom = '';
//     let socketRooms = Object.keys(socket.rooms);
//     console.log("socket.rooms:"+socket.rooms);
//     console.log(socketRooms);

//     for( let i = 0 ; i < socketRooms.length; i ++ ){
//         if(socketRooms[i].indexOf('Room_') !== -1){
//             currentRoom = socketRooms[i];
//             console.log(currentRoom);
//             break;
//         } 
//     }
//     console.log(currentRoom);
//     return currentRoom;
// }

module.exports = router;