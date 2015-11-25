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
                equalTo: "Email must be equal"
              }

    }}
  );
})

