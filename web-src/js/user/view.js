define(['jquery' ,
        'underscore' ,
        'backbone',
         ] ,
         function($ , _ , Backbone ){

    return Backbone.View.extend({

        el : '.workarea',

        initialize : function(options){
            
            this.userId = options.userId;    
            this.render();

        },

        render : function(){
            this.$el.html(this.userId);

        },

        

    });

});
