var showAndRemainders = (function (){
    var elem = $('#workarea');
    
    var user = {};
    
    var template = $("<div class='remainderItem'> <div class='remainderInfo'> " +
                    "<div class='remainderMessagePreview'> </div> " +
                     "<div class='lastShown'>(Last shown : <span id='lastShown'></span>)</div> </div>" +
                     "<div class='remainderControls'>" +
                     "<div class='edit'><img src='img/edit.png' /> </div>" + 
                     "<div id='deleteRemainder' class='delete'><img src='img/delete.png' /></div>" + 
                     "</div>" +
                    "<div style='clear:both'> </div>" + 
                    "</div>");
    
    var loadTemplate = function (def ) {
        //if(elem.length === 0) elem = $('#content');
        elem = $('#workarea');
        var promise = moduleLoader.loadModule('showRemainders');
        
        promise.done(function (data){
            elem.html(data);
            def.resolve();
        });
    };
    
    var loadRemaindersSuccess = function (data){
        
        if(data && data.userRemainders){
            
            
            if(data.userRemainders.length == 0){
                $('#nodata').show();
                return;
            }
            
            var remainderWrapper = $('.remainders').show();
            
            for(var i=0; i<data.userRemainders.length; i++){
                var remainder = data.userRemainders[i];
                var clone = template.clone();
                
                clone.data('remainder' , JSON.stringify(remainder));
                clone.attr('id' , remainder.remainderId);
                clone.find('.remainderMessagePreview').text(remainder.remainderMessage);
                
                
                
                if(remainder.isRemainded){
                    
                    //clone.find('.statusIcon').addClass('done').text('D'); 
                    var date = new Date(remainder.remaindedOn);
            
                    var remaindedOn = date.getHours() + ' : ' + date.getMinutes() + ' : ' + date.getSeconds () + ' - ' + date.toDateString();
            
                    clone.find('#lastShown').text(remaindedOn);
                }else{
                    clone.find('#lastShown').text('Never!');
                }
                
                remainderWrapper.append(clone);
                
            }
        }else{
            loadRemaindersError('Nothing to display');   
        }
    };
    
    var loadRemaindersError = function (error){
        
        $('#error').show();  
    };
    
    var loadRemainders = function (contactID) {
        
        techoStorage.getAllRemaindersById(loadRemaindersSuccess, loadRemaindersError, [contactID]);
    };
    
    var deleteSuccess = function (remainderIds) {
        for(var i=0; i<remainderIds.length; i++){
            $('#' + remainderIds[i]).remove();
        }
        //notification('Delete successfull'); 
    };
    
    var deleteError = function () {
        notification('An error occured while deleting remainders'); 
    };
    
    var updateSidebar = function () {
        
        var template = $('<div><img height="70%"  style="position:relative;top:15%"/></div>');
        
        var addNewRemainder = template.clone().find('img').attr('src' , 'img/notepad.png');
        addNewRemainder.on(configuartion.events.userselect , function (){
            $('#dummyInput').trigger(configuartion.events.userselect);
        });
        
        var showUserInfo = template.clone().find('img').attr('src' , 'img/userinfo.png');
        showUserInfo.on(configuartion.events.userselect , function (){
            $('body').trigger('toUserInfo' , [user]);
        });
        
        var deleteSelectedRemainder = template.clone().find('img').attr('src' , 'img/trash.png');
        deleteSelectedRemainder.on(configuartion.events.userselect , function (){
            
            var selectedElements = $('.remainderItem[selected=selected]');
            
            if(selectedElements.length === 0){
                notification('No elements selected to delete'); 
                return;
            }
            
            var remainderIds = {};
            remainderIds.remainderIds = [];
            
            for(var i=0; i<selectedElements.length; i++){
                remainderIds.remainderIds.push(selectedElements.eq(i).attr('id'));
            }
            
            techoStorage.deleteRemainder(deleteSuccess , deleteError , [remainderIds]);
        });
        
        var upperStack = [addNewRemainder , showUserInfo , deleteSelectedRemainder];
                
        $('body').trigger('updateTopStack' , [upperStack]);
        
        
    };
    
    var keyboardFix = function () {
        var user = elem.find('.user');
        user.height(user.height());
        
        var remainderItem = elem.find('.remainderItem');
        remainderItem.height(remainderItem.height());
        
        var addNewLineHeight = elem.find('#newLine').height();
        
        elem.find('.remainders').height((elem.height() - (user.height() + elem.find('.userMessage').height() )) * 0.8);
        
    };
    
    $('body').on('showRemainders',function (event , registeredUser){
        
        var def = new $.Deferred();
        
        $('body').trigger('addToHistory',['showTechoContacts']);
        
        user = JSON.parse(registeredUser);
        
        loadTemplate(def);
        
        def.done(function (){
            
            elem.find('#profile').attr('src' , user.photo);
            elem.find('#name').text(user.name);
            
            loadRemainders(user.id);
            
            keyboardFix();
            
        });
        
    });
    
    var saveSuccess = function (remainder) {
        var remainderWrapper = $('.remainders').show();
        var clone = template.clone();
                
                clone.data('remainder' , JSON.stringify(remainder));
                clone.attr('id' , remainder.remainderId);
                clone.find('.remainderMessagePreview').text(remainder.remainderMessage);
                
                
                
                if(remainder.isRemainded){
                    
                    //clone.find('.statusIcon').addClass('done').text('D'); 
                    var date = new Date(remainder.remaindedOn);
            
                    var remaindedOn = date.getHours() + ' : ' + date.getMinutes() + ' : ' + date.getSeconds () + ' - ' + date.toDateString();
            
                    clone.find('#lastShown').text(remaindedOn);
                }else{
                    clone.find('#lastShown').text('Never!');
                }
                
                remainderWrapper.append(clone);
        
       
        
        //$('body').trigger('showRemainders' , [JSON.stringify(user)]);
    };
    
    var saveError = function (error) {
        notification('Error creating...');
    };
    
    var updateSuccess = function (remainder) {
        elem.find('#' + remainder.remainderId).find('.remainderMessagePreview').text(remainder.remainderMessage);
    };
    
    var updateError = function (error) {
        notification('Error updating...');
    };
    
    var showRemainder = function (remainder){
        console.log('heeeee');
        var note = elem.find('#note').clone();
        
        var textarea = note.find('textarea');
        
        // stupid logic
        var save = false;
        
        if(!remainder){
            remainder = {};
        
            remainder.remainderId = new Date().getTime();
            remainder.contactId = user.id;    
            //only call or only message or both - 0 : all, 1 - only call, 2 - only message
            remainder.remainderType = 0;
            
            remainder.isRemainded = false;
            remainder.remaindedOn = 0;
            remainder.remaindedUsing = -1;
            
            save = true;
            
        }else{
            remainder = JSON.parse(remainder);
            textarea.val(remainder.remainderMessage);    
        }
        
        var ok = note.find('#ok');
        
        ok.data('remainder' , JSON.stringify(remainder));
        ok.data('remainder' , save);

        ok.on(configuartion.events.userselect , function (event){
            
            console.log('eeevent');
            
            remainder.remainderMessage = textarea.val();
            
            /*if(!remainder.remainderMessage || remainder.remainderMessage == "")
                return false;*/
            
            $(this).off(event);
            
            ok.focus();
            
            note.hide();
            $(window).unbind('scroll');
            
            $('body').trigger('triggerHistory');
            
            if(save)
                techoStorage.addRemainder(saveSuccess , saveError , [remainder]);
            else
                techoStorage.updateRemainder(updateSuccess , updateError , [remainder]);
            
            
        });
        
        note.show();
        
        confirm(note , elem , '' , 'modalClass' );
        
         $(window).on('scroll' , function (eve){
            $(window).scrollTop(0);
        });
        
        $('body').trigger('addToHistory',['confirmClose']);
        setTimeout(function(){textarea.height(textarea.height());textarea.focus()} , 1000);
    };
    
    // events
    
    $('body').on(configuartion.events.userselect , '#newLine' , function (){
        showRemainder();
    });
    
    $('body').on(configuartion.events.userselect , '.edit' , function (event){
        var target = $(event.currentTarget).parent().parent();
        
        var remainder = target.data('remainder');
        
        showRemainder(remainder);
    });
    
    $('body').on(configuartion.events.userselect , '#deleteRemainder' , function (event){
        var target = $(event.currentTarget).parent().parent();
        
        var remainderIds = {};
        remainderIds.remainderIds = [];
        
        remainderIds.remainderIds.push(target.attr('id'));
        
            
        techoStorage.deleteRemainder(deleteSuccess , deleteError , [remainderIds]);
        
        event.stopPropagation();
    });
    
     
    $('body').on(configuartion.events.userselect , '#dummyInput' , function (event ){
        $('body').trigger('addToHistory',['showRemainders' [JSON.stringify(user)]]);
         
        user.readOnly = false;
         
        $('body').trigger('note', [JSON.stringify(user)]);
            
        //$(this).off(event);
        
    });
    
    $('body').on('toUserInfo' , function (){
            
        $('body').trigger('addToHistory',['showRemainders' [JSON.stringify(user)]]);
            
        $('body').trigger('userInfo' , [JSON.stringify(user)]);
    });
    
    /*$('body').on('taphold' , '.remainderItem' , function (event){
        
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
        
        var selectedElements = $('.remainderItem[selected=selected]');
        
        
        if(selectedElements.length === 0){
            $('body').trigger('hideSidebar'); 
        }else{
            $('body').trigger('showSidebar');  
        }
        
    });*/
    
    
    /*var registerEvents = function (contactID , displayName , photo , phoneNumber) {
        $('body').on('showNote',function (event , contactID , displayName , photo , isNew , remainderObj){ // proxy to be called from other areas as per screen so that required info can be passed
        
            $('#list').hide();
            $('#text').show();
            
            $('body').trigger('note', [contactID , displayName , photo , isNew , remainderObj]);
            
            $(this).off(event);
            
        });
        
        $('#dummyInput').on(configuartion.events.userselect , function (){
            
            $('body').trigger('addToHistory',['showRemainders' [contactID , displayName , photo , phoneNumber]]);
            
            $('body').trigger('showNote' , [contactID , displayName , photo , true]);
        });
        
        $('.remainderItem').on(configuartion.events.userselect , function (event){
            var remainder = JSON.parse( $(event.currentTarget).data('remainder') );
            
            //$('body').trigger('addToHistory',['showRemainders' [contactID , displayName , photo , phoneNumber]]);
            
            //$('body').trigger('showNote' , [contactID , displayName , photo , false , remainder]);
        });
        
        $('body').on('toUserInfo' , function (){
            
            $('body').trigger('addToHistory',['showRemainders' [contactID , displayName , photo , phoneNumber]]);
            
            $('body').trigger('userInfo' , [contactID , displayName , photo , phoneNumber]);
        });
        
        $('.remainderItem').on('taphold' ,  function (event){
            var target = event.currentTarget;
            
            
            var selected = target.attr('selected');
            
            if(selected && selected == '1'){
                target.attr('selected' , 0);

            }else{
                
                target.attr('selected' , 1);
                
                target.css('background' , '#C5EFF7'); 
            }
            
            event.preventDefault();
            event.stopPropagation();
            
            return false;
        });
        
    };*/
    
    
    
})();