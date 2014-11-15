define([
    'jquery',
    'underscore',
    'backbone',
    'text!sidebar/templates/sidebar.html'
    ] , function($ , _ , Backbone , sidebarTemplate){

    return Backbone.View.extend({
        
        el : '.sidebar',
        
        template : _.template(sidebarTemplate),
        
        events : {
            
        },
        
        initialize : function(){
            this.setElement('.sidebar');
            this.render();
        },
        
        render : function(){
            this.$el.html(this.template());
            $('.overlay-sidebar').show();

            var headerHeight = $('header').height();
            var elementHeight = $('.workarea').height() * 0.1;
            
            this.$el.find('.header').height(headerHeight);
            this.$el.find('.header').css('line-height' , headerHeight + 'px');
            
            this.$el.find('.option').height(elementHeight);
            this.$el.find('.option').css('line-height' , elementHeight + 'px');
            
            this.$el.find('.footer').height(elementHeight);
            this.$el.find('.footer').css('line-height' , elementHeight + 'px');
            
            this.$el.show();
            
            return this;
        }
        
    });
    
});