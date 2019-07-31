window.addEventListener('DOMContentLoaded', function() {

  var tokenWs = 'token=' + $('#token').html();

  var socket = io({query: tokenWs});

  $('#chat-submit').on('click', function () {

    var message = $('#chat-input').val();
    var pattern = /(<([^>]+)>)/ig;
    message = message.replace(pattern, "");

    socket.emit('chat-message', {message: message});

    $('#chat-input').val('').focus();

  });

  socket.emit('need-data');

  socket.on('new-message', function (data) {

    console.log(data.user + 'a envoyé le message suivant : ' + data.message);
    var newMessage = '<div class="event"><div class="label"><img src="/upload/' + data.profilePic + '" /></div><div class="content"><div class="summary"><a class="user" href"/profile/' + data.user + '">' + data.user + '</a></div><div class="meta"><p>' + data.message + '</p></div></div></div>';

    $('.ui.feed').append(newMessage);

  });

  socket.on('actual-conv', function (data) {

    data.forEach(element => {
      var newMessage = '<div class="event"><div class="label"><img src="/upload/' + element.profilePic + '" /></div><div class="content"><div class="summary"><a class="user" href"/profile/' + element.user + '">' + element.user + '</a></div><div class="meta"><p>' + element.message + '</p></div></div></div>';
      $('.ui.feed').append(newMessage);
    });
  })

  socket.on('connected-users', function (data) {

    $('.users-in-chat').text(data.connected);

  })


});
