define(['backbone' ,
        'registered-contacts/view' ,
        'add-contacts/view' ,
        'user/view' ,
        'settings/view' ] , function(Backbone , RegisteredContacts , AllContacts , User , Settings){

    var Router = Backbone.Router.extend({

        routes : {
          'registered-contacts' : 'registeredContacts' ,
          'get-all-contacts'    : 'getAllContacts',
          'user/:userId'        : 'user',
          'settings'            : 'settings'
        },

        registeredContacts : function(){
          new RegisteredContacts();
        },

        getAllContacts : function(){
          new AllContacts();
        },

        user : function(userId){
          new User({userId : userId});
        },

        settings : function(){
          new Settings();
        }

    });

    var router = new Router();

    Backbone.history.start();

    return router;

});
