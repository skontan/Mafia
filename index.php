<?php
// Initialize the session
session_start();

//Connect with mysql
require_once 'includes/configMySQL.php';


?>
 
<!DOCTYPE html>
<html lang="en">
<head>
	<meta name="viewport" charset="UTF-8" content="width=device-width, initial-scale=1.0">
    <title>Mafia</title>
    <!-- <link rel="stylesheet" style type="text/css" href="styles.css"> -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
</head>

<body>
	<div class="main">
		<h1>Template</h1>
	</div>

    <div id="updater">
    </div>
	
	<script src="app.js"></script>
</body>
</html>