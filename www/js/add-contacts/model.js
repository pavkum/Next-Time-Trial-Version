define(['jquery' ,
        'underscore' ,
        'backbone'
         ] , function( $ , _ , Backbone ){


    return Backbone.Model.extend({

      url : 'addContact',
        
      save : function(options){
          
          var phoneNumbers = this.get('phoneNumbers');
          
          for(var i=0; i<phoneNumbers.length; i++){
              var phoneNumber = phoneNumbers[i];
            
              var array = phoneNumber.value.replace(/\D/g , "").match(/\d{10}$/);
              phoneNumber.value = (array && array[0]) ? array[0] : "0000000000";
          }
          
          var photos = this.get('photos');
          
          if(photos && photos[0] && photos[0].value)
              this.set('photo' , photos[0].value);
          else
              this.set('photo' , 'error-image');
          
          Backbone.sync.call(this , this , options);
      },

    });

});
