define(['jquery' ,
        'underscore' ,
        'backbone' ,
        'registered-contacts/model' ,
        'text!../../templates/registered-contacts.html'], function($ , _ , Backbone , registeredContactModel , viewTemplate){

  return Backbone.View.extend({

      el : '.workarea' ,

      template : _.template(viewTemplate),

      events : {
        'click .add-icon' : 'addContact'
      },

      initialize : function(){

        this.render();
      },

      render : function(){
        this.$el.html(this.template());

        // set width and height of plus button
        var size = 0.15 * this.$el.width();
        this.$el.find('.add-icon').width(size).height(size).css('line-height' , size + 'px');
      },

      addContact : function(){
        var router = require('router');
        router.navigate('get-all-contacts' , {trigger : true});
      }

  });

});
