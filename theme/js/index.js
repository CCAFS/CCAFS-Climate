$(document).ready(function(){

    $(".color").hover(
        function() {
            $(this).stop().css({'z-index' : '10'}).animate({
                "width": "151.68px",
                "height": "336px",
                "top": "-23px",
                "left": "-8px"
            }, "fast");
        },
        function() {
            $(this).stop().css({'z-index' : '1'}).animate({
                "width": "126.4px",
                "height": "280px",
                "top": "0",
                "left": "0"
            }, "fast");
        });
});