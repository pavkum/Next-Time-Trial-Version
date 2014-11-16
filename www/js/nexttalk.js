require.config({
    paths : {
      'jquery'    : 'lib/jquery',
      'underscore': 'lib/underscore',
      'backbone'  : 'lib/backbone',
      'text'      : 'lib/text',
      'fastclick' : 'lib/fastclick'

      // custom
      
    }
});

define(['jquery' ,
        'backbone' ,
        'fastclick' ,
        'router' ,
        'header/view',
        'utils/backbone/NextTalkSync',
        'lib/jquery.event.move',
        'lib/jquery.event.swipe'
       ] , function($ , Backbone , FastClick , router , header , 
                     Sync , move , swipe){

        // we are just calling sync so that it overrides backbones default sync
       // just loading move and swipe

  //$(document).on('deviceready',function (){

      FastClick.attach(document.body);

      var height = $(window).height();

      $('header').height(height * 0.125);
      header.render();
       
      $('.workarea').height(height * 0.875).show();

      router.navigate('registered-contacts' , {trigger : true});

  //});


});
