$(document).ready(function(){
    $("#email-button").on("click", function(event) {
        event.preventDefault();
        $("#email-button").next(".error").hide();
        // validate email
        if(validateEmail($("#email"))) {
            $("#email").attr("disabled", "disabled");
            $("#email-button").attr("disabled", "disabled");
            $(".input-form .error").attr("disabled", "disabled");
            // figure out if user is already registered into our database.
            loadUser($("#email").val());
        } else {
            $(".input-form .error").css("display", "block");
        }
    });

    // Submitting user information.
    $("#submit-user-info").on("click", function(event) {
        event.preventDefault();
        // validate fields.
        if(validateFields()) {
            arrayInstituteRegions = new Array();
            $("input[name^='institute-regions']:checked").each(function(index) {
                arrayInstituteRegions[index] = $(this).val();
            });
            arrayResearchRegions = new Array();
            $("input[name^='research-regions']:checked").each(function(index) {
                arrayResearchRegions[index] = $(this).val();
            });

            $.ajax({
                type: "POST",
                dataType: "text",
                url: "/ajax/user-info.php",
                data: {
                    context: "submit-user",
                    userId: $("#user-id").val(),
                    email: $("#email").val(),
                    firstName: $("#first-name").val(),
                    lastName: $("#last-name").val(),
                    instituteName: $("#institute-name").val(),
                    instituteRegions: arrayInstituteRegions,
                    researchRegions: arrayResearchRegions,
                    use: $("#use").val()
                },
                beforeSend: function(){
                    $("#submit-user-info").attr("disabled", "disabled");
                    $(".submit-button #ajax-loader").show();
                    $(".submit-button #message").text("Saving...");
                },
                success: function(downloadId) {
                    if($.isNumeric(downloadId)) {
                        // information saved successfully!
                        // next step, generate links.
                        generateLinks(downloadId);
                    } else {
                        $("#message").css("color", "red");
                        $("#message").text(downloadId);
                        $(".submit-button #ajax-loader").hide();
                    }
                }
            });
        };
    });


    // Submitting anonymous user information.
    $("#skip-form").on("click", function(event) { 
        event.preventDefault();
        // validate fields. 
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/ajax/user-info.php",
            data: {
                context: "submit-user-anonymous",
                userId: "-1",
                instituteName: "Anonymous",
                use: "unknown"
            },
            beforeSend: function(){
                $("#submit-user-info").attr("disabled", "disabled");
                $(".skip-button #ajax-loader").show();
                $(".skip-button #message").text("Generating links...");
            },
            success: function(downloadId) {
                if($.isNumeric(downloadId)) {
                    // information saved successfully!
                    // next step, generate links.
                     $("#skip-form").unbind('click');
                     $("#email").attr("disabled", "disabled");
                     // $("#email-button").attr("disabled", "disabled");
                    generateLinksSkip(downloadId);
					
                } else {
                    $("#message").css("color", "red");
                    $("#message").text(downloadId);
                    $(".skip-button #ajax-loader").hide();
                }
            }
        });
        
    });

    function generateLinksSkip(downloadId) {
        // variable $selectedFiles is initialized in form.tpl.
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/ajax/links-generator.php",
            data: {
                files: $selectedFiles,
                downloadId: downloadId,
                fileType: $("#file-type").val(),
				fileSet: $("#fileSet").val(),
				tileName: $("#tile_name").val()
            },
            beforeSend: function(){
                $(".skip-button #message").text("Generating links...");
            },
            success: function(data) {
                $(".skip-button #message").text("DONE!");
                 $(".skip-button #ajax-loader").attr("src", "/theme/images/ok-icon.png");
                $.each(data, function(index, file){
                    $htmlContent = "<tr><td>"+index+"</td><td><a href='"+file.reference+"'>"+file.name+"</a></td></tr>"; 
                    $("#download-table tbody").append($htmlContent);
                });
                $("#download-table").tablesorter();
                $("#download-files").slideDown("slow");
            }
        });
    }
    function generateLinks(downloadId) {
        // variable $selectedFiles is initialized in form.tpl.
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/ajax/links-generator.php",
            data: {
                files: $selectedFiles,
                downloadId: downloadId,
                fileType: $("#file-type").val(),
                fileSet: $("#fileSet").val(),
				tileName: $("#tile_name").val()
            },
            beforeSend: function(){
                $(".submit-button #message").text("Generating links...");
            },
            success: function(data) {
                $(".submit-button #message").text("DONE!");
                 $(".submit-button #ajax-loader").attr("src", "/theme/images/ok-icon.png");
                $.each(data, function(index, file){
                    $htmlContent = "<tr><td>"+index+"</td><td><a href='"+file.reference+"'>"+file.name+"</a></td></tr>"; 
                    $("#download-table tbody").append($htmlContent);
                });
                $("#download-table").tablesorter();
                $("#download-files").slideDown("slow");
            }
        });
    }

    function validateFields() {
        $isValid = true;
        // Validate first name.
        if($("#first-name").is(":visible") && $("#first-name").val() == "") {
            $isValid = false;
            $("#first-name").css("background-color", "#FF9999");
        } else {
            $("#first-name").css("background-color", "");
        }
        // Validate last name.
        if($("#last-name").is(":visible") && $("#last-name").val() == "") {
            $isValid = false;
            $("#last-name").css("background-color", "#FF9999");
        } else {
            $("#last-name").css("background-color", "");
        }
        // Validate institute name.
        if($("#institute-name").val() == "") {
            $isValid = false;
            $("#institute-name").css("background-color", "#FF9999");
        } else {
            $("#institute-name").css("background-color", "");
        }
        // Validate institute locations.
        if($("input[name^='institute-regions']:checked").length == 0) {
            $isValid = false;
            $(".institute-regions .group-label").css("color", "red");
        } else {
            $(".institute-regions .group-label").css("color", "");
        }
        // Validate research locations.
        if($("input[name^='research-regions']:checked").length == 0) {
            $isValid = false;
            $(".research-regions .group-label").css("color", "red");
        } else {
            $(".research-regions .group-label").css("color", "");
        }
        // Validate intended use.
        if($("#use").val() == "") {
            $isValid = false;
            $("#use").css("background-color", "#FF9999");
        } else {
            $("#use").css("background-color", "");
        }
        return $isValid;
    }

    function validateEmail($emailField) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if($emailField.val() == "" || !emailReg.test($emailField.val())) {
            return false;
        } else {
            return true;
        }
    }

    function loadUser($email) {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/ajax/user-info.php",
            data: {
                context: "user-info",
                email: $email
            },
            beforeSend: function(){
                $("#email-button").next(".ajax-loader").show();
            },
            success: function(data) {
                $("#email-button").next(".ajax-loader").hide();
                if(data.email == null) {
                    // is new user
                    $("#existing-user").attr("checked", false);
                    $("#user-id").val("-1");
                } else {
                    // is registered user
                    $("#user-id").val(data.userId);
                    $("#existing-user").attr("checked", true);
                    $(".user-name").hide();
                    $("#welcome-message").html("Welcome back "+data.firstName+" "+data.lastName+"<br>Your last download was on "+data.lastDownloadDate);
                    $("#first-name").attr("disabled", "disabled");
                    $("#first-name").val(data.firstName);
                    $("#last-name").attr("disabled", "disabled");
                    $("#last-name").val(data.lastName);
                    $("#institute-name").val(data.lastInstitute);
                    // Institute Locations
                    if(data.instituteLocations.africa == 1) $("#i_africa").attr('checked', true);
                    if(data.instituteLocations.asia == 1) $("#i_asia").attr('checked', true);
                    if(data.instituteLocations.oceania == 1) $("#i_oceania").attr('checked', true);
                    if(data.instituteLocations.centralAmericaCaribbean == 1) $("#i_central_america_caribbean").attr('checked', true);
                    if(data.instituteLocations.europe == 1) $("#i_europe").attr('checked', true);
                    if(data.instituteLocations.middleEasthNorthAfrica == 1) $("#i_middle_east_north_africa").attr('checked', true);
                    if(data.instituteLocations.northAmerica == 1) $("#i_north_america").attr('checked', true);
                    if(data.instituteLocations.southAmerica == 1) $("#i_south_america").attr('checked', true);
                // Research Locations
                //if(data.researchLocations.africa == 1) $("#r_africa").attr('checked', true);
                //if(data.researchLocations.asia == 1) $("#r_asia").attr('checked', true);
                //if(data.researchLocations.oceania == 1) $("#r_oceania").attr('checked', true);
                //if(data.researchLocations.centralAmericaCaribbean == 1) $("#r_central_america_caribbean").attr('checked', true);
                //if(data.researchLocations.europe == 1) $("#r_europe").attr('checked', true);
                //if(data.researchLocations.middleEasthNorthAfrica == 1) $("#r_middle_east_north_africa").attr('checked', true);
                //if(data.researchLocations.northAmerica == 1) $("#r_north_america").attr('checked', true);
                //if(data.researchLocations.southAmerica == 1) $("#r_south_america").attr('checked', true);

                }
                $("#additional-information").slideDown("slow");

            }
        });
    }
});
