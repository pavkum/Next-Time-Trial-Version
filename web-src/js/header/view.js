define([
    'jquery',
    'underscore',
    'backbone',
    'sidebar/view',
    'text!header/templates/header.html'
    ] , function($ , _ , Backbone , Sidebar, headerTemplate){
    
    var Header = Backbone.View.extend({
        
        el : 'header' ,
        
        events : {
            'click #hamburger' : 'hamburger',
            'click #back'      : 'history'
        },
        
        template : _.template(headerTemplate),
        
        initialize : function(){
            console.log('how many times???');    
        },
        
        render : function(){
            this.$el.html(this.template());
            
            this.title = this.$el.find('#title');
            this.hamburger = this.$el.find('#hamburger');
            this.back = this.$el.find('#back');
            
            this.$el.show();
            
            return this;
        },
        
        hamburger : function(){
            this.sidebar = new Sidebar();
            
            this.toggleButton();
        },
        
        toggleButton : function(){
            this.hamburger.fadeToggle();
            this.back.fadeToggle();
        },
        
        
        updateTitle : function(title){
            this.title.text(title);
        }
        
    });
    
    return new Header();
    
});