$(document).ready(function(){
    $(".checkbox-resource").change(function() {
        if ($(".checkbox-resource:checked").length > 0) {
            $("#download-button").removeAttr("disabled");
        } else {
            $("#download-button").attr("disabled", "disabled");
        }
    });
});

