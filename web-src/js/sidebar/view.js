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
            'swipeleft .sidebar' : 'hide'
        },
        
        initialize : function(){
            this.setElement('.sidebar');
            this.render();
            
            var self = this;
            
            $('.sidebar').on('swipeleft' , function(){
                self.hide();
            });
            
            $('.overlay-sidebar').on('swipeleft' , function(){
                self.hide();
            });
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
            
            this.$el.show().animate({width:'75%'} , 200 );
            
            return this;
        },
        
        hide : function(){
            $('.overlay-sidebar').hide();
            this.$el.animate({width:'0%'} , 200 );
            //this.$el.find('div').hide();
            this.$el.css('box-shadow' , '');
            
            var self = this;
            
            setTimeout(function(){
                self.$el.hide();
            },201);
        }
        
    });
    
});