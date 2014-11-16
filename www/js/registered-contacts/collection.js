define([
    'jquery',
    'underscore',
    'backbone',
    'registered-contacts/model',
    ] , function($ , _ , Backbone , RegisteredContactsModel){

    return Backbone.Collection.extend({
    
        url : 'getAllContacts',
        
        model : RegisteredContactsModel,
        
        fetch : function(options){
            var self = this;
            
            var success = options.success;
            
            options.success = function(response){
                if(response && response.contacts){
                    
                    for(var i=0; i< response.contacts.length; i++){
                        self.add(new self.model(response.contacts[i]));   
                    }
                    
                    if(success) success.call(self , self , response);
                    
                }else{
                    if(options.error) options.error.call(self , "Error Loading");   
                }
            };
            
            Backbone.sync.call(self , self , options);
        }
    
    });
    
});