<?php 
include($_SERVER['DOCUMENT_ROOT']."/classes/access_user/ext_user_profile.php"); 
error_reporting (E_ALL); // I use this only for testing

$update_profile = new Users_profile(false); // need to be false otherwise the redirect to this page will not work
$update_profile->access_page($_SERVER['PHP_SELF'], $_SERVER['QUERY_STRING']); // protect this page too.



if (isset($_POST['Submit'])) {
	if ($_POST['user_email'] == "" || $_POST['address'] == "" || $_POST['postcode'] == "" || $_POST['city'] == "") {
		$update_profile->the_msg = "Please fill the required fields.";
	} else { 
		$update_profile->update_user($_POST['password'], $_POST['confirm'], $_POST['user_full_name'], $_POST['user_info'], $_POST['user_email']); // the update method
	
		$eu_date_field = (!empty($_POST['field_two'])) ? $_POST['field_two']."##eu_date" : $_POST['field_two']; 
		// add the eu date field information ONLY if the field is not empty
		
		$update_profile->save_profile_date($_POST['id'], $_POST['language'], $_POST['address'], 
		$_POST['postcode'], $_POST['city'], $_POST['country'], "", "", 
		$_POST['homepage'], $_POST['notes'], $_POST['field_one'], $eu_date_field, $_POST['field_three']); 
	}
}  
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<title>Update page example</title>
<style type="text/css">
<!--
body {
	font:0.85em Arial, Helvetica, sans-serif;
	text-align:center;
	margin:0;
}
label {
	display: block;
	float: left;
	width: 160px;
	margin-right:5px;
}
form div {
	clear:both;
	padding-top:5px;
}
#container {
	padding:5px 10px;
	text-align:left;
	margin:10px auto;
	width:640px;
	border:1px solid #CCCCCC;
}
-->
</style>
</head>

<body>
  <div id="container">
	<h2>Update user/profile information:</h2>
	<p>This forms is an example how to update the user and user-profile information, 
	fields with a * are required and keep the paasword field(s) empty if you don't want to change it.</p>
	<p style="color:#FF0000;font-weight:bold;"><?php echo $update_profile->the_msg; ?>&nbsp;</p>
	
	<form name="form1" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
	  <div>
		<label for="login">Login:</label>
		<input type="text" disabled="disabled" size="10" value="<?php echo $update_profile->user; ?>" style="font-weight:bold;">
	  </div>
	  <div>
		<label for="password">Password:</label>
		<input name="password" type="password" value="" size="6">
		* (min. 4 chars.)
	  </div>
	  <div>
		<label for="confirm">Confirm password:</label>
		<input name="confirm" type="password" value="" size="6">
		*
	  </div>
	  <?php 
	  echo "<div>".$update_profile->create_form_field("user_full_name", "Real name:", 30)."</div>";
	  echo "<div>".$update_profile->create_form_field("user_email", "E-mail:", 30, true)."</div>";
	  echo "<div>".$update_profile->create_form_field("user_info", "Extra info:", 20)."</div>";
	  // start fields from the profile table
	  echo "<div>".$update_profile->create_form_field("field_one", "Company name <br>(user field 1")."</div>";
	  echo "<div>".$update_profile->create_form_field("address", "Address", 20, true)."</div>";
	  echo "<div>".$update_profile->create_form_field("postcode", "Postcode", 10, true)."</div>";
	  echo "<div>".$update_profile->create_form_field("city", "City", 20, true)."</div>";
	  echo "<div>".$update_profile->create_country_menu("Country")."</div>";
	  echo "<div>".$update_profile->create_form_field("homepage", "Homepage")."</div>";
	  echo "<div>".$update_profile->create_text_area("notes", "Signature or comment...")."</div>";
	  // You have to use the same field like the variable in the class 
	  echo "<div>".$update_profile->create_form_field("field_two", "Euro Date dd/mm/yyyy<br>(user field 2)", 10, false, false, true)."</div>";
	  echo "<div>".$update_profile->create_form_field("field_three", "US Date yyyy-mm-dd<br>(user field 3)", 10)."</div>";
	  echo "<div>".$update_profile->language_menu("Language")."</div>";
	  ?>
	  <div>
		<label for="Submit">&gt;&gt;</label>
		<input type="hidden" name="id" value="<?php echo  $update_profile->profile_id; ?>">
		<input type="submit" name="Submit" value="Update">
	  </div>
	</form>
 </div>
 <p><a href="<?php echo $update_profile->main_page; ?>">Main</a></p>
</body>
</html>
