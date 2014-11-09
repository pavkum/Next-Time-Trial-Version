var appData = {
    'registered-contact' : 'registered-contact'
};

action.router(appData);


$(document).on('deviceready',function (){

    FastClick.attach(document.body);

    // initialize header and workarea

    var height = $(window).height();

    $('header').height(height * 0.125);
    $('.workarea').height(height * 0.875);


    //action.navigate('registered-contact' , {'template' : 'registered-contact' , 'storage-api' : 'getAllContacts'});

});
