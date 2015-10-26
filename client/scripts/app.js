// YOUR CODE HERE:
var app = {
  currentRoom : 'all',
  init: function(){
    this.fetch();
  },
  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  fetch: function(){
    // should we get rooms when we fetch as well?
      // if so, then call getRooms(data) here for the success callback
    var context = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      context: context,
      data: {username:window.location.search.substr(10)},
      contentType: 'application/json',  
      success: function (data) {
        console.log(data);
          // console.log(this);
        this.clearMessages();

        this.addMessage(data.results);
        
        this.getRooms(data.results);
        
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Cannot fetch');
      }
    });
  },
  server: 'http://127.0.0.1:3000/classes/messages',
  clearMessages: function() {
    $('#chats').children().remove();
  },
  addMessage: function(message) {
    if ( this.currentRoom !== 'all'){
      message = _.filter(message, function(item){
        return item.roomname === this.currentRoom;
      }.bind(this))
    }
    for (var i = 0; i < message.length; i++) {
      var newMessage = $('<div class="chat"></div>');
      var username = $('<span class = "username"></span>');
      username.text(message[i].username);
      var mes = $('<span class = "message"></span>');
      mes.text(' : ' + message[i].text);

      newMessage.append(username);
      newMessage.append(mes);

      $('#chats').append(newMessage);
    }
  },
  addRoom: function(room) {

  },
  addFriend: function() {
  
  },
  handleSubmit: function(message) {
    var obj = {
      username : window.location.search.substr(10),
      text: message,
      roomname:this.currentRoom
    };
    this.addMessage(obj);
    this.send(obj);
    this.fetch();
  
  },
  getRooms: function (results) {
    // remove existing rooms
    $('#rooms').children().remove();
    // get unique rooms from all of the messages
    var roomsList = _.uniq(_.pluck(results, 'roomname'));
    roomsList[0]='all';
    console.log(roomsList);

    // for each unique room, set this as an option for the select dropdown
    for ( var i = 0; i < roomsList.length; i ++ ) {
      //console.log(roomsList)
      var room = $('<option></option>');
      room.val(roomsList[i]);
      room.text(roomsList[i]);
      //console.log(room.text());
      $('#rooms').append(room);
    }

    $('#rooms').val(this.currentRoom);


  },
  enterRoom: function(room) {
    console.log(room.val());

    this.currentRoom = room.val();
    this.fetch();
  },
  createRoom: function() {
    //read text box for new roomname
    this.currentRoom = $('#newRoom').val();

    // create message object with new room with message saying 'x user created a new room _______'
        // set current room variable
    // send this new object 
    this.handleSubmit('User ' + window.location.search.substr(10) + ' created a new room ' + this.currentRoom );
    this.enterRoom(this.currentRoom);

      
  }

};

$(document).ready(function() {
  $('#main').on('click','.username', function(event) {
    // console.log('hello!!');
    app.addFriend();
  });

  $('#send').on('submit',function(event){

    event.preventDefault();
    app.handleSubmit($('#message').val());
    $('#message').val('');
  });

  $('#rooms').on('change', function(){
    app.enterRoom($(this));
  })

  $('#createRoom').on('submit',function(event){

    event.preventDefault();
    app.createRoom();
    $('#newRoom').val('');  
  });


  setInterval(app.fetch.bind(app), 5000);
});
