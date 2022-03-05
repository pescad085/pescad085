<?php
//*Mail form by Mo Bahjat*/
$to = "jackbahjat@gmail.com"; /* <----add your e-mail*/
$Subject = "Email from my website";/*what subject you want to receive your email;*/

//Don't touch this please //
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];




 $comment = "<b> comment </b>  " . $_POST['comment']. "<br>" . " <b>Name</b> ". $name . "<br>" .  " <b> E-mail <b/> ". $email . "<br>" . " <b>Phone</b> " . "<br>" . $phone;


// this is the headers//
$headers .= "Content-type: text/html;\r\n";
$headers .= "From: $email"; 

//the mail Function
mail($to, $Subject, $comment, $headers);
//this message will show up when you hit Submit button//
echo "Email has been sent! Thank you $name";
?>


