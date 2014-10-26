window.defaultAlert = alert;
window.defaultConfirm = confirm;

window.confirm = function (data , container , overlayClass , modalClass){
    var modal = $('#modal');
    var overlay = $('#overlay');

    var def = new $.Deferred ();
    
    var promise = moduleLoader.loadModule('confirm');

    promise.done(function (resp){
        modal.html(resp);
        def.resolve();
    });

    def.promise().done(function (){
        var top , left = 0;
        if(container){
            var position = container.position();

            top = position.top;
            left = position.left;

            overlay.height(container.height());
        }

        modal.find('#content').html(data);

        overlay.css('top' , top + 'px');
        overlay.css('left' , left + 'px');



       if(modalClass)
            modal.addClass(modalClass);

        if(overlayClass)
            overlay.addClass(overlayClass);

        modal.find('.confirmWrapper').css('top' , modal.find('.confirmWrapper').css('top'));


        var close = modal.find('#close');

        close.height(close.height());

        close.css('top' , close.css('top'));

        $('body').on('confirmClose' , function (){
            modal.hide();
            overlay.hide();
        });

        close.on(configuartion.events.userselect , function (event){
            $(this).off(event);
            $('body').trigger('triggerHistory');
        });

        modal.show();

        var left = modal.width() - close.height() / 2;

         // adjust close icon
        close.css('left' , left );

        overlay.show();

    });
};

window.alert = function (data , title ){

    var modal = $('#modal');
    var overlay = $('#overlay');

    var def = new $.Deferred ();

    var promise = moduleLoader.loadModule('alert');

    promise.done(function (data){
        modal.html(data);
        def.resolve();
    });

    def.promise().done(function (){
        if(title){
            modal.find('#modalTitle').html(title);
        }

        modal.find('#modalBody').html(data);

        overlay.show();
        modal.show(500);

        $('body').on('modalClose' , function (){
            modal.hide();
            overlay.hide();
        });

        $('#modalClose').on(configuartion.events.userselect , function (event){
            $(this).off(event);

            $('body').trigger('triggerHistory');

        });


    });

};

window.notification = function (msg) {

    if(msg){
        var notification = $('#notification');

        notification.text(msg);

        notification.show(250);

        setTimeout(function (){
            notification.hide(250);
        },2500);
    }


};
