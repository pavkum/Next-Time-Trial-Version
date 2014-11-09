action.preActions('registered-contacts' , ['view' , 'storage']);

action.on('settings-action' ,{

    action : function(){
      console.log('settings');
    }
});
