$(document).ready(function(){

    function getFilesInfo($element) {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/ajax/data-file-info.php",
            data: {
                methodId: $("#id_method").val(),
                scenarioId: $("#id_scenario").val(),
                modelId: $("#id_model").val(),
                periodId: $("#id_period").val(),
                variableId: $("#id_variable").val(),
                resolutionId: $("#id_resolution").val(),
                formatId: $("#id_format").val(),
                //tileId: $("#id_tile").val(),
                section: $element.attr("name")
            },
            beforeSend: function() {
                $("#help_icon_"+$element.attr("name")).hide();
                $("#help_icon_"+$element.attr("name")).next(".loader").show();
                $("#file-count").text("Calculating...");
            },
            success: function(data) {
                $("#help_icon_"+$element.attr("name")).next(".loader").hide();
                if(data.filesFound < 0) {
                    $("#file-count").text("");
                    $("#searchSubmit").attr("disabled", "disabled");
                } else {
                    if(data.filesFound == 0) {
                        $("#searchSubmit").attr("disabled", "disabled");
                    } else {
                        $("#searchSubmit").removeAttr("disabled");
                    }
                    // update files found text
                    if (data.filesFound == 1) {
                        $("#file-count").text("1 file found");
                    }else {
                        $("#file-count").text(data.filesFound+" files found");
                    }
                    if($element.val() != "") {
                        // show help icon with description
                        $("#help_icon_"+$element.attr("name")).attr("title", data.description);
                        $("#help_icon_"+$element.attr("name")).tipTip({
                            activation: "click",
                            keepAlive: true,
                            maxWidth: "400px",
                            defaultPosition: "right"
                        });
                        $("#help_icon_"+$element.attr("name")).show();
                    } else {
                        $("#help_icon_"+$element.attr("name")).hide();
                    }
                }
            }
        });
    }
    $("#id_method").change(function() {
        getFilesInfo($(this));
    });

    $("#id_scenario").change(function() {
        getFilesInfo($(this));
    });

    $("#id_model").change(function() {
        getFilesInfo($(this));
    });

    $("#id_period").change(function() {
        getFilesInfo($(this));
    });

    $("#id_variable").change(function() {
        getFilesInfo($(this));
    });

    $("#id_resolution").change(function() {
        getFilesInfo($(this));
    });

    $("#id_format").change(function() {
        getFilesInfo($(this));
    });
});


