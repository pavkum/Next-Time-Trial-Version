define(['jquery' ,
        'underscore' ,
        'backbone' ,
        'registered-contacts/model' ,
        'registered-contacts/collection' ,
        'registered-contacts/contacts/view',
        'text!registered-contacts/templates/registered-contacts.html'], 
       
       function($ , _ , Backbone , registeredContactModel , RegisteredCollection , RegisteredContactView , viewTemplate){

          return Backbone.View.extend({

              el : '.workarea' ,

              template : _.template(viewTemplate),

              events : {
                'click .add-icon' : 'addContact'
              },

              initialize : function(){

                var self = this;
                  
                self.collection = new RegisteredCollection();
                self.collection.fetch({
                    success : function(){ self.contactFetchSuccess.apply(self , arguments) },
                    error : function(){ self.contactFetchError.apply(self , arguments) }
                });

                self.render();
              },

              render : function(){
                this.$el.html(this.template());
                
                this.height = this.$el.height();

                this.$el.find('.items').css('height' , this.height + 'px');
                // set width and height of plus button
                var size = 0.15 * this.$el.width();
                this.$el.find('.add-icon').width(size).height(size).css('line-height' , size + 'px');
              },

              addContact : function(){
                var router = require('router');
                router.navigate('get-all-contacts' , {trigger : true});
              },
              
              contactFetchSuccess : function(collection , response){
                  
                  this.$el.find('.contacts').empty();
                  
                  for(var i=0; i<collection.length; i++){
                    new RegisteredContactView({model : collection.at(i)} , {height : this.height * 0.1});
                  }
              },
              
              contactFetchError : function(errorMessage){
                  console.log(errorMessage);
              }

          });
});
