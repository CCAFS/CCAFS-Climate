$(document).ready(function() { 
 $('#sentform').validate({
    rules: {
      email: {
        required: true,
        equalTo: '#email_ver'
      }

    },
    messages: {
      email:
              {
                required: "Please insert a correct email",
                equalTo: "Please enter the same email."//"Email must be equal"
              }

    }}
  );
   id=$(".error_file").attr('id')
   if(id==0){
 		$("#download-button-bottom").removeAttr("disabled");
		$("#download-button-bottom").removeClass("disable");    
   }else{
	  $("#download-button-bottom").attr("disabled", "disabled");
	  $("#download-button-bottom").addClass("disable");    		
   }
 
})

