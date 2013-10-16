$(document).ready(function(){
    $("#methods img").hover(
        function() {
            $(this).stop().css({'z-index' : '10'}).animate({
                "width": "418px",
                "height": "188.1",
                "top": "-7px",
                "left": "-19px"
            }, "fast");
        },
        function() {
            $(this).stop().css({'z-index' : '1'}).animate({
                "width": "380px",
                "height": "171px",
                "top": "0",
                "left": "0"
            }, "fast");
        });
});