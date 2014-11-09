var displayData = function (data , openClosed ){
    
    data = JSON.parse(data);
    
    FastClick.attach(document.body);
    
    $('#name').text(data.name.split(' ')[0]);
    $('#name').attr('src' , data.photo);
    
    var messages = data.remainders;
    
    var messagesElem = $('.messages');
    
    var template = $('<div class="message"></div>');
    var clear = $('#clear');
    var container = $('.container');
    var header = $('header');
    
    for(var i=0; i<messages.length; i++){
        var remainder = messages[i];
    
        var clone = template.clone();
        clone.text(remainder.message);
        clone.attr('id' , remainder.id);
        
        messagesElem.append(clone);
    }
    
    
    
    if(openClosed){
        container.hide();
        clear.text('Click to open');
    }else{
        container.show();   
        clear.text('Swipe to clear');
    }
    
    
    
    header.on(configuartion.events.userselect , function (){
        if(container.is(':visible')){
            container.hide();
            clear.text('Swipe to clear');
        }else{
            container.show();
            clear.text('Click to open');
        }
    });
    
    /*$('body').on('swipeleft' , '.message' , function (event){
        var target = $(event.currentTarget);
        
        var remainder = {};
        remainder.id = target.attr('id');
        
        Android.markSelectedRead(JSON.stringify([remainder]));
        
        target.remove();
    
    });*/
    
    if(messages.length == 1){
        
        //$('.img').height(header.height() * 1);  
        //$('.img').height(header.height() * 1);  
        
        
        //$('.img').css( 'line-height' , header.height() * 1 + 'px'); 
        
        var imgHeight = $('.img > img').height();  
        //var messageHeight = $('.messages').height();
        
       // $('.message').css('margin-top' , (imgHeight - messageHeight) / 2 );
        
        $('#scrolltoshow').hide();
        
    }else if(messages.length == 2){
        
        var imgHeight = $('.img > img').height();  
        //var messageHeight = $('.messages').height();
        
        //$('.messages').css('margin-top' , (imgHeight - messageHeight) / 2 );
        
        $('#scrolltoshow').hide();
    }else{
        //$('.messages').height(header.height() * 3);
        $('.img').height(header.height() * 3);    
        $('.img').css( 'line-height' , header.height() * 3 + 'px');    
    }
    
    var minimumSwipeLength = 10;
    
    var touchHandler = {};
    touchHandler.startX = undefined;
    touchHandler.curX = undefined;
    touchHandler.timer = undefined;
    
    $('header').on('touchmove' , function (event){
            var x = event.originalEvent.changedTouches[0].clientX;
            //var x = event.clientX;
            touchHandler.curX = x;
            
            if( touchHandler.timer){
                clearTimeout(touchHandler.timer);
                touchHandler.timer = undefined;
            }
            
            if(!touchHandler.startX){
                touchHandler.startX = x;
            }
            
            touchHandler.timer = setTimeout(function(){
                touchHandler.curX = undefined;
                touchHandler.startX = undefined;
                touchHandler.timer = undefined;
            },500);
            
            if(touchHandler.curX && touchHandler.startX){
                var diff = touchHandler.curX - touchHandler.startX;
                
                if(diff > 0 && diff >= minimumSwipeLength){
                    
                    var remainders = [];
                    
                    for(var i=0; i<messages.length; i++){
                        var remainder = messages[i];
                        var rem = {};
                        rem.id = remainder.id;
                        rem.message = remainder.message;
                        
                        remainders.push(rem);
                    }

                    
                    Android.finish(JSON.stringify(remainders));
                    
                    //showSidebar();
                }else{
                    event.preventDefault();        
                }
                
            }else{
                event.preventDefault();   
            }
        
            //event.preventDefault();
    });
    
        
    $('.message').on('touchmove' , function (event){
            var x = event.originalEvent.changedTouches[0].clientX;
            //var x = event.clientX;
            touchHandler.curX = x;
            
            if( touchHandler.timer){
                clearTimeout(touchHandler.timer);
                touchHandler.timer = undefined;
            }
            
            if(!touchHandler.startX){
                touchHandler.startX = x;
            }
            
            touchHandler.timer = setTimeout(function(){
                touchHandler.curX = undefined;
                touchHandler.startX = undefined;
                touchHandler.timer = undefined;
            },500);
            
            if(touchHandler.curX && touchHandler.startX){
            
                var diff = touchHandler.curX - touchHandler.startX;
                
                if(diff > 0 && diff >= minimumSwipeLength){
                    
                    var target = $(event.currentTarget);
                    
                    var remainders = [];
                    var remainder = {};
            
                    remainder.id = target.attr('id');
                    remainder.message = target.text();

                    remainders.push(remainder);   
                    Android.markSelectedRead(JSON.stringify(remainders));
                    
                    target.remove();
                    
                    var messageLength = $('.message').length;
                    
                    if(messageLength === 0){
                        Android.finish("");
                    }
                    
                    //showSidebar();
                }else{
                    event.preventDefault();        
                }
                
            }else{
                event.preventDefault();   
            }
        
            //event.preventDefault();
    });
    
    container.show();
    
    
};

var data = {};

data.name = "Pavan";
data.photo = "img/profile.png";

data.remainders = [];

for(var i=0; i<5; i++){
    var remainder = {};
    
    remainder.id = i;
    remainder.message = "yo yo " + i;
    
    data.remainders.push(remainder);
}


//displayData(JSON.stringify(data) , false);

