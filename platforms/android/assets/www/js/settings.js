var settings = (function (){
    
    var elem = $('#workarea');

    var pauseEvent = false;
    
    var loadTemplate = function (def) {
        var promise = moduleLoader.loadModule('settings');
        
        promise.done(function (data){
            elem.html(data);
            def.resolve();
        });
        
        return def.promise();
    };
    
    var getSettingsSuccess = function (data) {
        
        if(data){
            for(var i=0; i<data.length; i++){
                var config = data[i];
                
                var name = config.name;
                var value = config.value;
                var id = config.id;
                
                if(value == 0){
                    elem.find('#' + id).removeAttr('checked');    
                }else{
                    elem.find('#' + id).attr('checked' , 'checked');    
                }
                
            }
        }
    };
    
    var getSettingsError = function (error) {
        notification('Error while loading settings'+error);
    };
    
    $('body').on('settings' , function (){
        
        var def = new $.Deferred();
        
        $('body').trigger('addToHistory',['showTechoContacts']);
        
        loadTemplate(def);
        
        def.done(function (){
            techoStorage.getSettings(getSettingsSuccess , getSettingsError , []);
        });
        
    });
    
    var updateSuccess = function (data) {
        pauseEvent = false;
        //notification('Updated...');
    };
    
    var updateError = function (error) {
        pauseEvent = false;
        notification('Error updating preferences');
    };
    
    var handleConfiguration = function (id , target) {
        // when clicked always getting opposite value, should investigate
        var val = target.find('input').attr('checked') ? 0 : 1;
        
        var setting = {
            id : id,
            value : val
        };
        pauseEvent = true;
        techoStorage.updateSettings(updateSuccess , updateError , [setting]);
    };
    
    var handleAbout = function () {
        var data = "<div>Version 1.0.0</div>" + 
                    "<div>techocall@gmail.com</div>";
        var title = "About Next Time";
        
        alert(data , title);
    };
    
    $('body').on(configuartion.events.userselect , '.item' , function (event){
        
        if(pauseEvent)
            return;
        
        var target = $(event.currentTarget);
        
        var id = target.attr('for');
        
        switch(id) {
                
            case 'about' : handleAbout();
                break;
            
            default : handleConfiguration(id , target)
                break;
                
            /*case 'autodelete' :
                break;
                
            case 'anonymoususage'
                break;*/
                
        }
    });
    
})();