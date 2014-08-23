var techocall = (function (){
    /*var $console = $("<div style='position: fixed; bottom: 0; left: 0; width: 100%; background-color: #dddddd; max-height: 50px; overflow: scroll;'></div>").appendTo($("body"));

    var console = console || {};

    console.log = function(mesg){
        $("<p style='color: blue;'>"+mesg+"</p>").appendTo($console);
    };

    console.error = function(mesg){
        $("<p style='color: red;'>"+mesg+"</p>").appendTo($console);
    };

    window.onerror = function(errorMsg){
        console.error(errorMsg);
    };*/

    var historyList = [];
    
    var headerHeight = 0;
    
    var initialize = function () {
        
        var width = $(window).width();
        var height = $(window).height();
        
        $('.header > img').height(height * 0.1);
        
        var displayHeight = $('.header').outerHeight();
        
        headerHeight = $('.header').height();
        
        var workarea = $('#workarea');
        
        workarea.outerHeight(height - displayHeight);
        
    };
    
    $('body').on('addToHistory' , function (event, eventName, eventArgs){
        var historyObj = {};
        historyObj.eventName = eventName;
        historyObj.eventArgs = eventArgs ? eventArgs : [];
                
        historyList.push(historyObj);

    });
    
    $('body').on('triggerHistory' , function (){
        
        if(historyList.length > 0){
            var historyObj = historyList.pop();
            
            $('body').trigger(historyObj.eventName , historyObj.eventArgs);    
            
            if(historyList.length === 0) {
                $('body').trigger('hideBackButton');   
            }
        }
    });
    
    $('body').on('clearHistory' , function (){
        historyList = [];
    });
    
    
    $(document).on('backbutton' , function (event){
        
        if(historyList.length != 0) {
            $('body').trigger('triggerHistory');    
            event.stopPropagation();
        }else{
            navigator.app.exitApp();   
        }
    });
    
    initialize();
    
});
//$(document).ready(function (){
$(document).on('deviceready',function (){
    
    FastClick.attach(document.body);
    
    //Logger.off();
    
    techocall();
    // load all at once - no AMD
    $('body').trigger('headerReady');
    $('body').trigger('RegisteredContactsReady');
    //$('body').trigger('RegisteredUserReady');
    $('body').trigger('ContactsReady');
    
    $('body').trigger('initializeSidebar');
    
    //alert(window.devicePixelRatio + " : " + window.height + " : " + $('header').height());
});
