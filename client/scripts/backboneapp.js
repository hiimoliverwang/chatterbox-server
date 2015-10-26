var Chat = Backbone.Model.extend({
  
  initialize: function(message, user, room){
    this.set('message', message);
    this.set('user', user);
    this.set('room', room);
  }
});

var ChatView = Backbone.View.extend({
  initialize:function(){
    this.model.on('change', this.render,this);
  },

  render: function(){
    var html = [
    '<div class = chat>',
      '<span class = "username">',
      this.model.get('user'),
      '</span>',
      " : ",
      '<span class = "message">',
        this.model.get('message'),
      '</span>',
    '</div>'
    ].join('');
    console.log(html);

    return this.$el.html(html);
  }
  // this.model.on('change:')

});

var Chats = Backbone.Collection.extend({
  model:Chat
});

ChatsView = Backbone.View.extend({
  initialize: function(){
    this.collection.on('change', this.render, this);
  },

  render: function(){



    var listOfChats = this.collection.map(function(chat){
      return $('<div class = "chat">' + '<span class = "username">' + 
        chat.get('user') + '</span>' + ' : ' 
        + '<span class = "message">' + chat.get('message') + '</span>' + 
        '</div>');
    });
    if(this.$el.children().length !==0){
      this.$el.children().remove();
    }

    _.each( listOfChats ,function(item){
        this.$el.prepend(item);
    }.bind(this)); 

    return this.$el;
  }
})


var chatList = [
  new Chat('hello','oliver', 'lobby'),
  new Chat('hi','oliver', 'lobby'),
  new Chat('greetings!','oliver', 'lobby'),
  new Chat('hey!','oliver', 'lobby')
];

var chats = new Chats(chatList);

var chatsView = new ChatsView({ collection: chats});

// var chatView = new

// $('body').append(chatsView.render());

var newChat = function(message){
  var user = "oliver";
  var room = 'lobby';
  console.log(message);
  chats.push(new Chat(message, user, room));
  console.log(chatList);
}


var updateScreen = function(messages){
  if($('#chats').children().length !== 0){
    $('#chats').children().remove()
  }
  $('#chats').append(messages);

}

// var chat = new Chat('hello','oliver', 'lobby');

// var chatView = new ChatView({ model: chat});

$(document).ready(function(){

  updateScreen(chatsView.render());

  $('#send').on('submit',function(event){
    event.preventDefault();
    newChat($('#message').val());
    updateScreen(chatsView.render());
    newChat($('#message').val(''));

  });
  
})















