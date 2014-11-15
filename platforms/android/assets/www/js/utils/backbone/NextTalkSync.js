define(['require' , 'backbone' ] , function(require , Backbone){


    Backbone.sync = function(model , options){
        if(!model.url)
          error();

        //var techoStorage = require('techoStorage');
        techoStorage[model.url].call(this , options.success , options.error , [model.toJSON()]);
    };


    var error = function(){
        throw new Error("URL is empty");
    };


    /*var NextTalkModel = Backbone.NextTalkModel = function(options){
        Backbone.Model.call(this , options);
    };



    var cordovaSync = function(method , model , options){
        if(!model.url)
          error();

        var techoStorage = require('techoStorage');

        techoStorage[model.url].call(null , options.success , options.error , [model.toJSON()]);

        /*switch(model.url){
          case 'getAllContacts'           : syncMethod = techoStorage.getAllContacts;
                                            break;

          case 'addContact'               : syncMethod = techoStorage.addContact;
                                            break;

          case 'deleteContacts'           : syncMethod = techoStorage.deleteContacts;
                                            break;

          case 'addRemainder'             : syncMethod = techoStorage.addRemainder;
                                            break;

          case 'updateRemainder'          : syncMethod = techoStorage.updateRemainder;
                                            break;

          case 'getAllRemaindersById'     : syncMethod = tec
        }

        //syncMethod(options.success , options.error , [model.toJSON()]);

    };

    _.extend(NextTalkModel.prototype , Backbone.Model.prototype , {

        sync : function(){
          cordovaSync.call(this , arguments);
        }

    });*/

    //return CordovaModel;

});
