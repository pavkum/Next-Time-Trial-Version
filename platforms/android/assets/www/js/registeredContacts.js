var registeredContacts = (function (){
    
    var elem = $('#workarea');

    var template = $('<div class="contact"> ' +
                    '<div class="image"> <img id="photo" /> </div> ' +
                    '<div class="name"> </div> ' +
                     '<div id="deleteContact" class="delete"><img src="img/delete.png" /></div>' +
                    '<div style="clear:both"> </div> ' +
                   '</div>');
    
    var loadTemplate = function (def) {
        var promise = moduleLoader.loadModule('registeredContacts');
        
        promise.done(function (data){
            
            elem.html(data);
            elem.hide();
            def.resolve();
        });
        
        return def.promise();
    };
    
    
    
    var loadContactInfoSuccess = function (data){
        
        $('#count').text(data.contacts.length);
        
        var contacts = elem.find('#contacts');
        
        for(var i=0; i<data.contacts.length; i++){
            
            var clone = template.clone();
            
            var contact = data.contacts[i];
            
            clone.attr('id',contact.id);
            
            var name = clone.find('.name');
            contact.displayName = contact.displayName.split(' ')[0];
            name.text(contact.displayName);
            
            var photo = clone.find('#photo');
            photo.attr('src',contact.photo);
            
            clone.data('phoneNumber' , contact.phoneNumber);
            
            contacts.append(clone);
            
        }
        
    };
    
    var loadContactInfoError = function (error){
        notification('Error loading contacts');
    };
    
    var loadContactInfo = function () {
        techoStorage.getAllContacts(loadContactInfoSuccess,loadContactInfoError,[]);
    };

    var deleteSuccess = function (contactIds) {
        
        
        var length = $('#count').text() - contactIds.length;
        
        $('#count').text(length);
        
        for(var i=0; i<contactIds.length; i++){
            $('#' + contactIds[i]).remove();
        }
        
        
    };
    
    var deleteError = function (error) {
        notification('An error occured while deleting contacts : ' + error); 
    };
    
    var updateSidebar = function () {
        
        var template = $('<div><img height="70%"  style="position:relative;top:15%"/></div>');

        var addNewContact , deleteSelectedContacts;
        
        addNewContact = template.clone().find('img').attr('src' , 'img/contacts.png');
        addNewContact.on(configuartion.events.userselect , function (event){
            $('body').trigger('getAllContacts');
        });
        
        deleteSelectedContacts = template.clone().clone().find('img').attr('src' , 'img/trash.png');//.css('background-color' , '#D91E18');
        deleteSelectedContacts.on(configuartion.events.userselect , function (event){
            var selectedElements = $('.contact[selected=selected]');
            
            if(selectedElements.length === 0){
                notification('No elements selected to delete'); 
                return;
            }
            
            var contactIds = {};
            contactIds.contactIds = [];
            
            for(var i=0; i<selectedElements.length; i++){
                contactIds.contactIds.push(selectedElements.eq(i).attr('id'));
            }
            
            techoStorage.deleteContacts(deleteSuccess , deleteError , [contactIds]);
        });
/*
    
        var triggerEvent = function (eventName){
            addNewContact.unbind(configuartion.events.userselect);
            deleteSelectedContacts.unbind(configuartion.events.userselect);
            
            $('body').trigger(eventName);
            
        };
*/
        
        var settings = template.clone().find('img').attr('src' , 'img/settings.png');//.css('background-color' , '#1E8BC3');
        settings.on(configuartion.events.userselect , function (){
            $('body').trigger('settings');
        });
        
        var quit = template.clone().find('img').attr('src' , 'img/shutdown.png');//.css('background-color' , '#F22613');
        quit.on(configuartion.events.userselect , function (){
            navigator.app.exitApp();
        });
        
        var upperStack = [addNewContact , deleteSelectedContacts];
        var bottomStack = [settings , quit];
        
        $('body').trigger('updateTopStack' , [upperStack]);
        $('body').trigger('updateBottomStack' , [bottomStack]);
    };
    
    var attachEventHandlers = function () {
        
        $('body').on(configuartion.events.userselect , '.contact' , function (event){
            
            var target = $(event.currentTarget);
            
            var id = target.attr('id');
            var name = target.find('.name').text();
            
            var photo = target.find('img').attr('src');
            
            var phoneNumber = target.data('phoneNumber');
            phoneNumber = JSON.parse(phoneNumber);
            //$('body').trigger('showUser' , [id,name , photo]);
            
            $('body').trigger('addToHistory',['showTechoContacts']);
            
            var user = {};
            
            user.id = id;
            user.name = name;
            user.photo = photo;
            user.phoneNumber = phoneNumber;
            
            $('body').trigger('showRemainders', [JSON.stringify(user)]);
            
        });
    };
    
    
    var layoutFix = function (){
        //elem.find('#contacts').height((elem.height() - elem.find('.total').outerHeight()) * 0.85);
    };
    
    $('body').on('showTechoContacts',function (){
        
        $('body').trigger('clearHistory');
        
        var def = new $.Deferred();
        loadTemplate(def);
        def.done(function (){
            layoutFix();
            elem.show();
            loadContactInfo();
            //attachEventHandlers();

            if(window.location.hash == '#true'){
                var data = "<div>Your trial period has expired...!!!</div>"
                var title = "Next Time - Trial Period";
                alert(data , title , navigator.app.exitApp);
            }
            
            
        });
        
    });
    
    $('body').on(configuartion.events.userselect , '#getAllContacts' , function (){
        $('body').trigger('getAllContacts');
    });
    
    $('body').on(configuartion.events.userselect , '#settings' , function (){
        $('body').trigger('settings');
    });
    
    $('body').on(configuartion.events.userselect , '#deleteContact' , function (event){
        var target = event.currentTarget;
        target = $(target).parent();
        
        var contactIds = {};
        contactIds.contactIds = [];
            
        contactIds.contactIds.push(target.attr('id'));
        
        techoStorage.deleteContacts(deleteSuccess , deleteError , [contactIds]);
        
        event.stopPropagation();
    });
    
    $('body').on('taphold' , '.contact' , function (event){
        var target = event.currentTarget;
        target = $(target);
            
        var selected = target.attr('selected');
        
        if(selected){
            target.removeAttr('selected');
            target.removeClass('selected');  
        }else{
            target.attr('selected' , 'selected');
            target.addClass('selected');
        }
        
        var selectedElements = $('.contact[selected=selected]');
        
        if(selectedElements.length === 0){
            $('body').trigger('hideSidebar'); 
        }else{
            $('body').trigger('showSidebar');  
        }

        
    });
    
    $('body').on(configuartion.events.userselect , '.contact' , function (event){
            
        var target = $(event.currentTarget);
            
        var id = target.attr('id');
        var name = target.find('.name').text();
        
        var photo = target.find('img').attr('src');
            
        var phoneNumber = target.data('phoneNumber');
        phoneNumber = JSON.parse(phoneNumber);
            //$('body').trigger('showUser' , [id,name , photo]);
        var user = {};
            
        user.id = id;
        user.name = name;
        user.photo = photo;
        user.phoneNumber = phoneNumber;
            
        $('body').trigger('showRemainders', [JSON.stringify(user)]);
            
    });
    
});

$('body').on('RegisteredContactsReady',function(event){
    registeredContacts();
    
    $('body').trigger('showTechoContacts');
    
    $( this ).off( event ); // similar jquery one event
});