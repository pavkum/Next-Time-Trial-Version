define(['jquery',
        'underscore' ,
        'backbone' ,
        'utils/user/icon',
        'text!../../../templates/raw-contact.html'] , function($ , _ , Backbone , userIcon , rawContactTemplate){

      return Backbone.View.extend({

        el : '.contacts',

        template : _.template(rawContactTemplate),

        events : {
            'error .img>img' : 'imageLoadError'
        },

        initialize : function(model , option){
          this.render(option);
        },

        render : function(option){

          var self = this;

          var data = this.model.attributes;
          data.firstLetter = this.model.get('displayName').charAt(0).toUpperCase();

          var template = $(this.template(data));
          template.height(option.height).css('line-height' , option.height + 'px');

          var firstLetter = template.find('.first-letter > div');
          firstLetter.height(option.height);
          firstLetter.width(option.height);
          userIcon.applyStyle(firstLetter);

          var img = template.find('img');
          img.height(option.height);

          img[0].onerror = function(){
              var elem = self.$el.find('#' + self.model.get('id'));

              elem.find('.img').hide();
              elem.find('.first-letter').height(option.height).show();

          };

          this.$el.append(template.get(0).outerHTML);

        },

        imageLoadError : function(){
          var elem = this.$el.find('#' + this.model.get('id'));

          elem.find('img').hide();
          elem.find('first-letter').show();
        }

      });
})
