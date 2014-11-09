(function (){

  $('body').on('showBackButton', function (){
      $('#logo').hide();
      $('#back').show();
  });

  $('body').on('hideBackButton', function (){
    $('#logo').show();
    $('#back').hide();
  });

  $('#back').on(configuartion.events.userselect , function(){
      $('body').trigger('triggerHistory');
  });

})();

// $('body').on('headerReady', function (event){
//     header();
//     $(this).off(event);
// });
