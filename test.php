<?php

//Connect with mysql
require_once 'includes/configMySQL.php';

$gameId = 118;

//See if players have seen role
$sql = "SELECT userId FROM users WHERE gameId=? AND seenRole=false";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $gameId);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $playersNotSeenRole);
mysqli_stmt_fetch($stmt);

echo "playersNotSeenRole = " . $playersNotSeenRole;

//If players have seen roles
if(!$playersNotSeenRole) {
    echo "Players have seen their roles!";
}
else {
    echo "Players have NOT seen their roles!";
}

//Close stmt
mysqli_stmt_close($stmt);

echo "WORKING";

?>