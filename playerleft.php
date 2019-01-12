<?php

//Connect with mysql
require_once 'includes/configMySQL.php';

//Save values
$userId = $_POST["userId"];
$gameId = $_POST["gameId"];

//Killing player who left
$sql = "UPDATE users SET alive=0 WHERE userId=? AND gameId=?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "ii", $userId, $gameId);
mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);

echo "WORKING";

?>