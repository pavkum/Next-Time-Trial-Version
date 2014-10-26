action.on('view' , {

  async_wait : true,

  priority : 1,

  action :function(data , scope , async){

          var template = scope.get('template');

          var ajax = $.ajax({
              url : 'templates/' + moduleName + '.html',
              method : 'GET'
          }).done(function (resp) {
              scope.set('template' , resp);
              async.done();
          }).fail(function () {
              async.error();
          });
  }

});
