define(['jquery',
        'underscore' ,
        'backbone' ,
        'utils/user/icon',
        'text!../../../templates/preview-contact.html'] , function($ , _ , Backbone , userIcon , previewContactTemplate){

      return Backbone.View.extend({

        el : '.preview',

        template : _.template(previewContactTemplate),

        initialize : function(model , option){
          this.render(option);
        },

        render : function(option){

          var self = this;

          var revisedHeight = option.height * 1.5;

          var data = this.model.attributes;
          data.firstLetter = this.model.get('displayName').charAt(0).toUpperCase();

          var template = $(this.template(data));
          this.$el.find('#preview').html(template);

          template = this.$el.find('#preview');

          var img = template.find('.img');

          img.height(revisedHeight);
          img.find('img').height(option.height).css('top' , option.height * 0.25 + 'px');

          this.$el.find('.footer').height(option.height);
          this.$el.find('button').width(revisedHeight);

          //.name
          template.find('.name').height(option.height).css('line-height' , option.height + 'px');

          img.find('img')[0].onerror = function(event){
            self.$el.find('.img').hide();

            // .first-letter
            var firstLetter = self.$el.find('.first-letter');
            firstLetter.height(revisedHeight);

            // .first-letter div
            var elem = firstLetter.find('div');

            elem.height(option.height).css('top' , option.height * 0.25 + 'px');
            elem.width(option.height).css('line-height' , option.height + 'px');

            userIcon.applyStyle(firstLetter.find('div'));
            firstLetter.show();

          };


          this.$el.show();
        },

      });
})
