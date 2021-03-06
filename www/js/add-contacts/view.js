define(['jquery' ,
        'underscore' ,
        'backbone',
        'add-contacts/collections',
        'add-contacts/contact/view',
        'add-contacts/preview/view',
        'text!../../templates/get-all-contacts.html' ] ,
         function($ , _ , Backbone , ContactCollection , ContactView , Preview , getAllContactsTemplate){

    return Backbone.View.extend({

        el : '.workarea',

        template : _.template(getAllContactsTemplate),

        initialize : function(options){
            this.collection = new ContactCollection();

            this.collection.on('update' , this.updateContactList , this);

            this.render();

        },

        render : function(){

            this.$el.html(this.template());

            this.height = this.$el.height();

            this.$el.find('#contact').height(this.height * 0.1);
            this.$el.find('.contacts').height(this.height - this.$el.find('.input').outerHeight());
        },

        events : {
          'keyup input#contact' : 'getFilteredContacts' ,
          'click .contact'     : 'previewContact',
        },

        getFilteredContacts : function(event){
            var value = event.target.value;

            if(!value || value.length < 3)
              return;

            this.collection.fetch(value);
        },

        updateContactList : function(){
            this.$el.find('.contact').remove();

            for(i=0; i<this.collection.length; i++){
              new ContactView({model : this.collection.at(i)} , {height : this.height * 0.1});
            }
        },

        previewContact : function(event){
          new Preview({model : this.collection.get($(event.currentTarget).attr('id'))} , {height : this.height * 0.1});
        },

        remove : function(){
            // should be called automatically, dont know how to do it though
        }



    });

});
