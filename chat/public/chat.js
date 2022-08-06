//오늘 날짜 구하는 함수
// function show_date(){
//   var today = new Date();
//   var year = today.getFullYear();
//   var month = today.getMonth()+1;
//   var date = today.getDate();
//   $("#spandate").html(year+"."+month+"."+date);
// }

var chatView = document.getElementById('msg');
var chatForm = document.getElementById('chatform');

chatForm.addEventListener('submit', function() {
  var msgText = $('#input_box');
  
  if (msgText.val() == '') {
      return;
  } else {
    socket.emit('SEND', msgText.val());
      var msgLine = $('<div class="msgLine">');
      var msgBox = $('<div class="me">');
 
      msgBox.append(msgText.val());
      msgBox.css('display', 'inline-block');
      msgLine.css('text-align', 'right');
      msgLine.append(msgBox);
 
      $('#msg').append(msgLine);
      msgText.val('');
      chatView.scrollTop = chatView.scrollHeight;
    }
  });
  socket.on('SEND', function(msg) {
    var msgLine = $('<div class="msgLine">');
    var msgBox = $('<div class="msgBox">');

    msgBox.append(msg);
    msgBox.css('display', 'inline-block');

    msgLine.append(msgBox);
    $('#msg').append(msgLine);

    chatView.scrollTop = chatView.scrollHeight;
});