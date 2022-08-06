const express = require('express');
const socket = require('socket.io');
//const upload = require('./multer');

const app = express(); 
app.set('port', process.env.PORT || 4000);

const http = require('http');
const server = http.createServer(app);
const io = socket(server); 

let socketList = [];

app.use(express.static(__dirname + '/public'));

server.listen(4000, function() {
    console.log('Server On !');
});
 
io.on('connection', function(socket) {
    socketList.push(socket);
    console.log('User Join');
 
    socket.on('SEND', function(msg) {
        socketList.forEach(function(item, i) {
            console.log(item.id);
            if (item != socket) {
                item.emit('SEND', msg);
                console.log("상대: ", msg);   //
            }
            console.log("나: ", msg);
        }); 
    });
    socket.on('image', (data)=>{
        socketList.forEach(function(item, i) {
            console.log(item.id);
            if (item != socket) {
                item.emit('image', data);
            }
        }); 
    })
    socket.on('disconnect', function() {
        socketList.splice(socketList.indexOf(socket), 1);
    });
});