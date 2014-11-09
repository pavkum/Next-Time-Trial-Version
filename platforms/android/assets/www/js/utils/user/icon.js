define([] , function(){

    var colors = ['EF4836' , 'E26A6A' , '8E44AD' , '3A539B' , '00B16A' , 'D35400' , '6C7A89' ];
    var length = 7;

    var applyStyle = function(elem){
        var position = Math.floor((Math.random() * length) );

        var color = '#' + colors[position];

        elem.css('background-color' , color).css('border-color' , color);

    };

    return {applyStyle : applyStyle};

});
