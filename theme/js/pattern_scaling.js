$(document).ready(function(){
    $(".checkbox-resource").change(function() {
        if ($(".checkbox-resource:checked").length > 0) {
            $("#download-button").removeAttr("disabled");
        } else {
            $("#download-button").attr("disabled", "disabled");
        }
    });
    
    $(".checkbox-resourceR").change(function() {
        if ($(".checkbox-resourceR:checked").length > 0) {
            $("#download-buttonR").removeAttr("disabled");
        } else {
            $("#download-buttonR").attr("disabled", "disabled");
        }
    });
});

