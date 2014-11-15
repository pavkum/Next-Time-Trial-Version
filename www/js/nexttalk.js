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
        'utils/backbone/NextTalkSync'] , function($ , Backbone , FastClick , router , header , Sync){

        // we are just calling sync so that it overrides backbones default sync

  //$(document).on('deviceready',function (){

      FastClick.attach(document.body);

      var height = $(window).height();

      $('header').height(height * 0.125);
      header.render();
       
      $('.workarea').height(height * 0.875).show();

      router.navigate('registered-contacts' , {trigger : true});

  //});


});
