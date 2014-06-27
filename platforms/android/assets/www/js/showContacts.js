var contacts = (function (){
    var elem = $('#workarea');
    var search = undefined;
    var userInfo = undefined;
    
    var lastQuery = undefined;
    
    // result structure
    //var result = {};
    /*result.name;
    result.id;
    result.photo;
    result.phoneNumber;
    */
    var resultTemplate = $("<div class='row'><img height='100%' /> <span id='name'></span> </div>");
    
    var loadTemplate = function (def) {
        var promise = moduleLoader.loadModule('allContacts');
        
        promise.done(function (data){
            elem.html(data);
            search = elem.find('#search');
            userInfo = elem.find('#userInfo');
            def.resolve();
        });
        
        return def.promise();
    };
    
    var keyboardFix = function () {
        
        var height = $('header').height();
        
        var subHeader = $('header > div');
        subHeader.height(height);
        subHeader.css('line-height' , height + 'px');
        
        $('#contact').height($('#contact').height());
        
        resultTemplate.height($('#contact').height());
        resultTemplate.css('line-height' , $('#contact').height() + 'px');
        
        $('.message').height($('.message').height());
        $('.message').css('line-height' , $('.message').height() + 'px');
        
    };
    
    $('body').on('getAllContacts', function () {
        var def = new $.Deferred ();
        
        $('body').trigger('addToHistory',['showTechoContacts']);
        
        $('body').trigger('headerMiddle',['Add Contact']);
        $('body').trigger('headerRight',['<img src="img/next.png" />','toUser']);// local event
        
        
        loadTemplate(def);
        
        def.done(function (){
        
            keyboardFix();
            elem.find('.message').show();
            
            $('#contact').focus();
            
            setTimeout(function (){
                $('#contact').focus();
            },1000);
            
        
        });
    });
    
    $('body').on('focus' , '#contact' , function (){
        
        clearResults(); 
        
        search.show();
        //userInfo.hide();
    });
    
    // fetch search
    $('body').on('keyup' , '#contact' , function (event){
        var val = event.target.value;
        
        if(val.length != 0 && val.length >= 3){
            getAllContacts(val);
        }else{
            // do nothing, let search retain old results
        }
    });
    
    // Get contacts to display
    
    var getAllContacts = function(search) {
        var options      = new ContactFindOptions();
        options.filter = search;
        options.multiple = true;
        var fields       = ['id' , 'displayName', 'photos' , 'phoneNumbers'];
        
        lastQuery = new Date().getTime();
        
        $('#load').css('visibility' , 'visible').width('25%');  
        
        navigator.contacts.find(fields, onSuccess, onError, options , lastQuery);    
    };
    
    var onSuccess = function(contacts , timeStamp) {
        
        var load = $('#load');
        
        if(timeStamp == lastQuery){
            load.width('50%');
        }else{
            return;   
        }
        
        //$('#contact').removeClass('loadinggif');
        
        clearResults(); 
        
        var lastResult = [];
        
        if(!contacts || contacts.length === 0){
            var result = {};
            result.name = 'No Result';
            
            lastResult.push(result);
            
        }else{
            
            var step = 50 / contacts.length;
            
            for(var i=0; i<contacts.length; i++){
                
                if(contacts[i].displayName && contacts[i].displayName != 'null')
                    var result = {};
                    result.name = contacts[i].displayName;
                    result.id = contacts[i].id;
                    result.photo = contacts[i].photos;
                
                    var phoneNumbers = [];
                
                    var contactPhoneNumbers = contacts[i].phoneNumbers;
                
                    for(var j=0; j<contactPhoneNumbers.length; j++){
                        
                        var phoneNumber = contactPhoneNumbers[j];
                        
                        var phone = {};
                        phone.number = phoneNumber.value.replace("(" , "").replace(")" , "").replace(" " , "").replace("-" , "");
                        phone.type = phoneNumber.type;
                        phoneNumbers.push(phone);
                    }
                
                    result.phoneNumber = phoneNumbers; 
                
                    lastResult.push(result);
                
            }
            
            load.width( 50 + (step * i) + '%' );  
            
        }
        filterResult(lastResult);
        
        load.width( '100%' );  
        
        setTimeout(function(){load.css('visibility' , 'hidden')} , 500);
        
    };
    
    var onError = function(contacts , timestamp) {
        if(timeStamp == lastQuery){
            load.css('visibility' , 'hidden');
        }else{
            return;   
        }
        
        
        //$('#contact').removeClass('loadinggif');
        clearResults(); 
        
        notification('Error fetching contacts');
    };
    
    
    // update search stream
    var filterResult = function (results) {
        
        for(var i=0; i< results.length; i++) {
            var result = results[i];

            var clone = resultTemplate.clone();
            
            if(result.id) {
            
                clone.attr('id' , result.id);
            
                if(result.photo && result.photo[0]){
                    result.photo =  result.photo[0].value;
                }else{
                    result.photo =  "img/photo.jpg";
                }
   
                clone.data('json' , JSON.stringify(result))
                clone.find('img').attr('src' , result.photo); 
            }
            
            clone.find('#name').text(result.name);
            
            search.append(clone);
            
        }
        
    };
    
    // clear search stream
    
    var clearResults = function () {
        search.empty();  
    };
    
    // register user
    $('body').on('toUser',function (){
        
        /*var name = $('#contact').val();
        var id = $('#contact').data('contactID');
        var photo = $('#contact').data('photo');
        var phoneNumber = $('#contact').data('phoneNumber');
        
        if(!photo){
            photo = 'img/photo.jpg';
        }
        
        var contact = {
            'id' : id,
            'name' : name,
            'photo' : photo,
            'phoneNumber' : phoneNumber
        };*/
        
        var contact = $('#contact').data('json');
        
        techoStorage.addContact(addContactSuccess,addContactError,[contact]);
        
    });
    
    var addContactSuccess = function (contact) {
        
        console.log('success'+contact);
        
        $('body').trigger('showRemainders',[JSON.stringify(contact)]);
    };
    
    var addContactError = function (error) {
        clearResults();// handle message
        filterResult('Error creating');
    };

    // update select$ion
    $('body').on(configuartion.events.userselect, '.row' ,function (event){
        var target = $(event.currentTarget);
        
        if(target.attr('id')){
            
            $('#contact').val(target.text());
            
            var json = target.data('json');
            
            $('#contact').data('json' , JSON.parse(json));
            
            //search.hide();
            
            var userObj = JSON.parse(json);
            
            var contactOverlay = elem.find('#addContact').clone();
            $('#contact').blur();
            
            var addTickUser = contactOverlay.find('#addTickUser');
            
            addTickUser.text(userObj.name);
            
            contactOverlay.show();
            
            confirm(contactOverlay , elem , 'contactOverlay');
            
            // bad coding, ask giri
            $('body').on('confirmClose' , function (){
                contactOverlay.hide();
            });
            
            addTickUser.on(configuartion.events.userselect , function (event){
                contactOverlay.hide();
                $('body').trigger('confirmClose');
                
                var contact = $('#contact').data('json');
        
                techoStorage.addContact(addContactSuccess,addContactError,[contact]);
            });
            
            /*userInfo.find('.name').text(userObj.name);
            userInfo.find('img').attr('src' , userObj.photo);
        
            var number = userInfo.find('.number');
        
            var numberClone = number.find('#numberClone');
            number.empty();
            
            number.append(numberClone);
            
            for(var i=0; i<userObj.phoneNumber.length ; i++){
                var phoneNumber = userObj.phoneNumber[i];
                
                var clone = numberClone.clone();
                
                clone.find('.msisdn').text(phoneNumber.number);
                clone.find('.type').text(phoneNumber.type);
                
                clone.show();
                
                number.append(clone);
            }
            
            userInfo.show();
            */
            
        }
    });
    
})();

$('body').on('ContactsReady',function (event){
    //contacts();
    //$( this ).off( event ); // similar jquery one event
});