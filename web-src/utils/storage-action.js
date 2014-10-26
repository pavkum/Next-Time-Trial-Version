action.on('storage' , {

  async_wait : true,

  priority : 1,

  action : function(data , scope , async){

      var storage = scope.get('storage-api');

      var success = function(data){
          scope.set('data' , data);
          async.resolve();
      };

      var error = function(error){
          async.error();
      };

      switch(storage){

        case 'getAllContacts' : techoStorage.getAllContacts(success,error,[]);
                                break;

        case 'addContact' : techoStorage.addContact(addContactSuccess,addContactError,[scope.get('data')]);
                            break;

        case 'getAllRemaindersById' : techoStorage.getAllRemaindersById(loadRemaindersSuccess, loadRemaindersError, [scope.get('data')]);
                                      break;

        default : // do nothing


      }

      return true;
  }

});
