<?php 
require("class.phpmailer.php"); //Importamos la función PHP class.phpmailer 
 
$mail = new PHPMailer(); 
 
//Luego tenemos que iniciar la validación por SMTP: 
$mail->IsSMTP(); 
$mail->SMTPAuth = true; // True para que verifique autentificación de la cuenta 
$mail->Username = "jheduart@gmail.com"; // Cuenta de e-mail 
$mail->Password = ""; // Password 
 
$mail->Host = "smtp.gmail.com"; 
$mail->From = "jheduart@gmail.com"; 
$mail->FromName = "Nombre a mostrar del Remitente"; 
$mail->Subject = "Asunto"; 
$mail->AddAddress("jaime.tm8@gmail.com","Nombre a mostrar del Destinatario"); 
 
$mail->WordWrap = 50; 
 
$body  = "Hola, este es un…"; 
$body .= "<font color='red'> mensaje de prueba</font>"; 
 
$mail->Body = $body; 
 
$mail->Send(); 
 
 
// Notificamos al usuario del estado del mensaje 
 
if(!$mail->Send()){ 
   echo "No se pudo enviar el Mensaje."; 
}else{ 
   echo "Mensaje enviado"; 
} 
 
?>