$(document).ready(function(){
   $("#files-table").tablesorter({
        headers: {
            0: {
                sorter: false
            }
        }
   });
    $("#check-all").change(function() {
        if($(this).is(':checked')) {
            $(".checkbox-file").attr('checked', true);
            $(".download-button").removeAttr("disabled");
        } else {
            $(".checkbox-file").attr('checked', false);
            $(".download-button").attr("disabled", "disabled");
        }
    });

   $(".checkbox-file").change(function() {
       if ($(".checkbox-file:checked").length > 0) {
           $(".download-button").removeAttr("disabled");
       } else {
           $(".download-button").attr("disabled", "disabled");
       }
   });
});


