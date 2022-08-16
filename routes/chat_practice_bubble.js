const express = require("express");
const router = express.Router();
const pool = require("../db.js");
//const http = require('http').createServer(app);
//const io = require('socket.io')(http);

router.get("/", async (req,res)=>{

    let rooms = [];
    let io = req.app.get('socketio');

    io.on('connection', (socket)=>{
        // socket.on('request_message', (msg) => {
        //     // response_message로 접속중인 모든 사용자에게 msg 를 담은 정보를 방출한다.
        //     io.emit('response_message', msg);
        // });

        // 방참여 요청
        socket.on('req_join_room', async (msg) => {
            let roomName = 'Room_' + msg;
            if(!rooms.includes(roomName)) {
                rooms.push(roomName);
            }else{
                
            }
            //console.log("roomName:"+ roomName);
            socket.join(roomName);
            io.to(roomName).emit('noti_join_room', "방에 입장하였습니다.");
        });

        // 채팅방에 채팅 요청
        socket.on('req_room_message', async (msg) => {
            //console.log(socket.rooms);

            let currentRoom = '';
            let socketRooms = socket.rooms;
            console.log(socket.rooms.size); //socket.rooms은 set 속성 >> size

            let arr = Array.from(socketRooms);
        
            for( let i = 0 ; i < socketRooms; i ++ ){
                if(arr[i].indexOf('Room_') !== -1){
                    currentRoom = arr[i];
                    console.log(currentRoom);
                    break;
                } 
            }
            console.log("메시지:"+ msg);
            //io.to('Room_아이디').emit('noti_room_message', msg);
            io.to(currentRoom).emit('noti_room_message', msg);

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