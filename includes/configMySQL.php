<?php
//Define connection variables
$servername = "localhost";
$username = "root";
$password = "Noppejonta111p";
$dbname = "ropasc";

//Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

//Check connection
if(!$conn) {
	die("Connection failed: " . mysqli_connect_error());
}
?>