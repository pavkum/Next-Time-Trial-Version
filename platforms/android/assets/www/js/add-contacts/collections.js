define(['require' ,
        'jquery' ,
        'underscore' ,
        'backbone' ,
        'add-contacts/model' ] , function(require, $ , _ , Backbone , ContactsModel){


    return Backbone.Collection.extend({

      model : ContactsModel,

      fetch : function(search){

        if( !(this.isValid(search) && search.length > 2)){
          return;
        }

        var contacts = navigator.contacts;

        var ContactFindOptions = cordova.require('org.apache.cordova.contacts.ContactFindOptions');

        var options      = new ContactFindOptions();
        options.filter = search;
        options.multiple = true;
        var fields       = ['id' , 'displayName', 'photos' , 'phoneNumbers'];

        this.lastQuery = new Date().getTime();

        var self = this;

        var onsuccess = function(){
            self.getFilteredContactsSuccess.apply(self , arguments);
        };

        var onerror = function(){
          self.getFilteredContactsError.apply(self , arguments);
        };

        contacts.find(fields, onsuccess , onerror, options , this.lastQuery);

      },

      isValid : function(elem){
        return !(_.isNull(elem) || _.isUndefined(elem));
      },

      getFilteredContactsSuccess : function(contacts , timestamp){

        if(this.lastQuery !== timestamp)
          return;

        if(!this.isValid(contacts))
          return;

        this.reset();

        for(var i=0; i<contacts.length; i++){
          if( this.isValid(contacts[i].displayName) && this.isValid(contacts[i].phoneNumbers) )
            this.add(new ContactsModel(contacts[i]));
        }

        this.trigger('update');

      },

      getFilteredContactsError : function(){
        this.reset();

        this.trigger('update');
      }


    });

});
