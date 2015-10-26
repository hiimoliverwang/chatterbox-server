var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox/',
  defaults: {
    username: '',
    text: ''
  }
  
});

var Messages = Backbone.Collection.extend({
  model: Message,
  url:'https://api.parse.com/1/classes/chatterbox/',
  loadMsgs: function(){
    this.fetch({data: {order: '-createdAt'}});
  },
  parse: function(response, options){
    return response.results;
  }
});

var FormView = Backbone.View.extend({
  initialize:function() {
    this.collection.on('sync', this.stopSpinner, this);
  },
  events: {
    'submit #send': 'handleSubmit'
  },

  handleSubmit: function(e) {
    e.preventDefault();

    this.startSpinner();

    var $text = this.$('#message');
    this.collection.create({
      username:window.location.search.substr(10),
      text: $text.val()
    })
    $text.val('');
  },

  startSpinner: function() {
    this.$('.spinner img').show();
    this.$('form input[type=submit]').attr('disabled', "true");
  },

  stopSpinner: function() {
    this.$('.spinner img').fadeOut('fast');
    this.$('form input[type=submit]').attr('disabled', null);
  }
})


var MessagesView = Backbone.View.extend({
  initialize: function(){
    this.collection.on('sync', this.render, this);
    this.onscreenMessages = {};
  },

  render: function(){
    this.collection.forEach(this.renderMessage, this);
  },

  renderMessage: function(message){
    if(!this.onscreenMessages[message.get('objectId')]){
      var messageView = new MessageView({model:message});
      this.$el.prepend(messageView.render());
      this.onscreenMessages[message.get('objectId')] = true; 
    }
  }

});


var MessageView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change', this.render, this);
  },

  template: _.template('<div class="chat" data-id="<%- objectId %>"> \
                          <div class="username"><%- username %></div> \
                          <div class="text"><%- text %></div> \
                        </div>'),

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el
  }
})