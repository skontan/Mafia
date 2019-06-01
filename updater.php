<?php
//Connect with mysql
require_once 'includes/configMySQL.php';

//Start session
session_start();

/* 
createGame() {
    sql insert into games(status) values(0)
    return adminPanel()
}

tables: users(userId, userName, gameId, admin, role, markKill, markHeal, alive), games(gameId, status)

statuses:
0 - waiting for players
1 - game has started
2 - roles are assigned
3 - night time
4 - mafia is killing
5 - doctor is healing
6 - sheriff is investigating
7 - it's a new day
8 - game over


*/

function saveJSVariable($varName, $value, $string) {
    if($string) {
        echo "<script> " . $varName . " = '" . $value . "'; </script>";
    } else {
        echo "<script> " . $varName . " = " . $value . "; </script>";
    }
}

function callJS($code) {
    echo "<script> " . $code . " </script>";
}

function createGame() {
    global $conn;
    //sql insert into games(status) values(0)
    //return adminPanel()

    //Create game
    $sql = "INSERT INTO games(status) VALUES(0)";
    mysqli_query($conn, $sql);

    //Save gameId
    $gameId = mysqli_insert_id($conn);
    $_SESSION["gameId"] = $gameId;
    saveJSVariable("gameId", $gameId, false);

    //Save userName
    $userName = $_POST["who"];

    //Create user
    $sql = "INSERT INTO users(userName, gameId, admin) VALUES(?, ?, true)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "si", $userName, $gameId);
    mysqli_stmt_execute($stmt);

    //Save userId and as admin
    $userId = mysqli_stmt_insert_id($stmt);
    $_SESSION["userId"] = $userId;
    saveJSVariable("userId", $userId, false);
    saveJSVariable("admin", true, false);

    //Close mysqli_stmt
    mysqli_stmt_close($stmt);
}

function getUsers() {
    global $conn;

    //Clear users array
    callJS("users = [];");

    //Get all users in the game
    $sql = "SELECT userName FROM users WHERE gameId=? AND alive=true";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $users);
    for($i = 0; mysqli_stmt_fetch($stmt); $i++) {
        saveJSVariable("users[".$i."]", $users, true);
    }
    mysqli_stmt_close($stmt);
}

function joinGame() {
    global $conn;
    //sql select * from games where status=0;

    //if found game then
    //sql update users set gameId=? where userId=? 
    //return waitForGameToStart()

    //else call joinGame again in 2 seconds

    //Save userName
    $userName = $_POST["who"];
    $_SESSION["userName"] = $userName;

    //Look for an open game
    $sql = "SELECT gameId FROM games WHERE status=0";
    $result = mysqli_query($conn, $sql);
    $gameId = mysqli_fetch_assoc($result)["gameId"];

    //If open game found
    if($gameId) {
        //Save gameId
        $_SESSION["gameId"] = $gameId;
        saveJSVariable("gameId", $gameId, false);

        //Create user in db with gameId
        $sql = "INSERT INTO users(userName, gameId, admin) VALUES(?, ?, false)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "si", $userName, $gameId);
        mysqli_stmt_execute($stmt);

        //Save userId
        $userId = mysqli_stmt_insert_id($stmt);
        $_SESSION["userId"] = $userId;
        saveJSVariable("userId", $userId, false);

        //Close mysqli_stmt
        mysqli_stmt_close($stmt);
    } 

    //If we didn't find an open game
    else {
        //Call joinGame() in 2 seconds
        callJS("setTimeout(joinGame, 2000);");
    }




}

function startGame() {
    global $conn;

    //Updating status to startGame (1)
    $sql = "UPDATE games SET status=1 WHERE gameId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function assignRoles() {
    global $conn;

    //Assign roles

    //Save variables
    $mafia = json_decode(stripslashes($_POST["mafia"]));
    $doctor = $_POST["doctor"];
    $sheriff = $_POST["sheriff"];

    //Set mafia roles
    foreach($mafia as $name) {
        $sql = "UPDATE users SET role='mafia' WHERE gameId=? AND userName=?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "is", $_SESSION["gameId"], $name);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }

    //If doctor then set doctor role
    if($doctor) {
        $sql = "UPDATE users SET role='doctor' WHERE gameId=? AND userName=?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "is", $_SESSION["gameId"], $doctor);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }
    
    //If sheriff then set sheriff role
    if($sheriff) {
        $sql = "UPDATE users SET role='sheriff' WHERE gameId=? AND userName=?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "is", $_SESSION["gameId"], $sheriff);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }
    //done

    //When finished, change status
    //Updating status to roles are assigned (2)
    $sql = "UPDATE games SET status=2 WHERE gameId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function getRole() {
    global $conn;

    //Get my role from db
    $sql = "SELECT role FROM users WHERE userId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["userId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $role);
    mysqli_stmt_fetch($stmt);

    //Save role
    $_SESSION["role"] = $role;
    saveJSVariable("role", $role, true);

    //Close stmt
    mysqli_stmt_close($stmt);

    //Get the other roles
    getAllRoles();
}

function getAllRoles() {
    global $conn;

    //Getting all roles from our game where users are alive
    $sql = "SELECT role FROM users WHERE gameId=? AND alive=true";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $roles);

    //Creating vars and reseting values
    $numMafia = 0;
    $numUsers = 0;
    $doctor = "false";
    $sheriff = "false";

    //Fetching values
    while(mysqli_stmt_fetch($stmt)) {
        if($roles == "mafia") {
            $numMafia++;
        }

        else if ($roles == "doctor") {
            $doctor = "true";
        }

        else if ($roles == "sheriff") {
            $sheriff = "true";
        }

        $numUsers++;
    }

    //Save role variables
    saveJSVariable("numMafia", $numMafia, false);
    saveJSVariable("numUsers", $numUsers, false);
    saveJSVariable("doctor", $doctor, false);
    saveJSVariable("sheriff", $sheriff, false);

    //Close stmt
    mysqli_stmt_close($stmt);

    //Clear users array
    callJS("users = [];");

    //Get all users in the game
    $sql = "SELECT userName FROM users WHERE gameId=? AND alive=true";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $users);
    for($i = 0; mysqli_stmt_fetch($stmt); $i++) {
        saveJSVariable("users[".$i."]", $users, true);
    }
    mysqli_stmt_close($stmt);
}

function startNight() {
    global $conn;

    //Updating status to night (3)
    $sql = "UPDATE games SET status=3 WHERE gameId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function wakeMafia() {
    global $conn;

    //Updating status to wakeMafia (4)
    $sql = "UPDATE games SET status=4 WHERE gameId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function markKill() {
    global $conn;
    //sql update users set markKill=true where userId=?

    //sql update games set status=4 where gameId=?


    //Save userName of user that is to be marked killed
    $userName = $_POST["who"];

    //Update user that is marked to be killed by mafia
    $sql = "UPDATE users SET markKill=true WHERE gameId=? AND userName=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "is", $_SESSION["gameId"], $userName);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    //Since mafia is done, we can move on in the game and change status to wakeDoctor (5)
    $sql = "UPDATE games SET status=5 WHERE gameId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function markHeal() {
    global $conn;
    //sql update users set markHeal=true where userId=?

    //sql update games set status=5 where gameId=?

    //Save userName of user that is to be marked healed
    $userName = $_POST["who"];

    //Update user that is marked to be healed by doctor
    $sql = "UPDATE users SET markHeal=true WHERE gameId=? AND userName=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "is", $_SESSION["gameId"], $userName);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    //Since doctor is done, we can move on in the game and change status to wakeSheriff (6)
    wakeSheriff();
}

function wakeSheriff() {
    global $conn;

    //Changing game status to wakeSheriff (6)
    $sql = "UPDATE games SET status=6 WHERE gameId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function checkUser() {
    global $conn;

    //Save userName of user that is being checked
    $userName = $_POST["who"];

    //Get checked users role from db
    $sql = "SELECT role FROM users WHERE userName=? AND gameId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "si", $userName, $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $role);
    mysqli_stmt_fetch($stmt);

    //Save role
    saveJSVariable("checkedUser", $role, true);

    //Close stmt
    mysqli_stmt_close($stmt);

    //Since sheriff is done we can start day (7)
    $sql = "UPDATE games SET status=7 WHERE gameId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function nightReport() {
    global $conn;

    //Getting all user that where either marked to kill or heal
    $sql = "SELECT userName, markKill, markHeal FROM users WHERE gameId=? AND markKill=true";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $userName, $markKill, $markHeal);
    mysqli_stmt_fetch($stmt);

    //See if person was killed or saved
    if($markHeal) {
        $nightAction = "saved";
    } else {
        $nightAction = "killed";
    }

    //Save nightAction and effectedUser variables
    saveJSVariable("nightAction", $nightAction, true);
    saveJSVariable("effectedUser", $userName, true);

    //Close stmt
    mysqli_stmt_close($stmt);
}

function kill() {
    global $conn;

    //Save userName
    $userName = $_POST["who"];
    
    //Update user that is to be killed
    $sql = "UPDATE users SET alive=false WHERE gameId=? AND userName=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "is", $_SESSION["gameId"], $userName);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function checkGameStatus() {
    global $conn;

    //Checking game status
    $sql = "SELECT status FROM games where gameId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $status);
    mysqli_stmt_fetch($stmt);

    //Save status to JS
    saveJSVariable("status", $status, false);

    //Close mysql_stmt
    mysqli_stmt_close($stmt);

}

function getMafiaLeader() {
    global $conn;

    //Checking who is the mafia leader
    $sql = "SELECT userName FROM users WHERE gameId=? AND role='mafia'";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $mafiaLeader);
    mysqli_stmt_fetch($stmt);

    //Save mafiaLeader to JS
    saveJSVariable("mafiaLeader", $mafiaLeader, true);

    //Close mysql_stmt
    mysqli_stmt_close($stmt);
}

function resetMarks() {
    global $conn;

    //Reset marks on users
    $sql = "UPDATE users SET markKill=false, markHeal=false WHERE gameId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function aliveCheck() {
    global $conn;

    //Checking if we are alive
    $sql = "SELECT alive FROM users WHERE userId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["userId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $alive);
    mysqli_stmt_fetch($stmt);

    //Changing $alive into true/false
    if($alive == 1) {
        $alive = "true";
    } else {
        $alive = "false";
    }

    //Save status to JS
    saveJSVariable("alive", $alive, false);

    //Close mysql_stmt
    mysqli_stmt_close($stmt);
}

function gameOver() {
    global $conn;

    //Game is over changing status to 8
    $sql = "UPDATE games SET status=8 WHERE gameId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function startDay() {
    global $conn;

    //Set status to new day (7)
    $sql = "UPDATE games SET status=7 WHERE gameId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function seenRole() {
    global $conn;

    //Set seenRole=true on user
    $sql = "UPDATE users SET seenRole=true WHERE userId=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["userId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
}

function waitPlayersSeeRole() {
    global $conn;

    //Mark self as seen
    seenRole();

    //See if players have seen role
    $sql = "SELECT userId FROM users WHERE gameId=? AND seenRole=false";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $_SESSION["gameId"]);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $playersNotSeenRole);
    mysqli_stmt_fetch($stmt);

    //If players have seen roles
    if(!$playersNotSeenRole) {
        saveJSVariable("playersSeenRole", "true", false);
    }
    else {
        saveJSVariable("playersSeenRole", "false", false);
    }

    //Close stmt
    mysqli_stmt_close($stmt);
    
}


//Main
if($_POST["action"] == "createGame") {
    createGame();
}

else if($_POST["action"] == "joinGame") {
    joinGame();
} 

else if($_POST["action"] == "startGame") {
    startGame();
} 

else if($_POST["action"] == "checkGameStatus") {
    checkGameStatus();
}

else if($_POST["action"] == "getUsers") {
    getUsers();
}

else if($_POST["action"] == "assignRoles") {
    assignRoles();
}

else if($_POST["action"] == "getRole") {
    getRole();
}

else if($_POST["action"] == "startNight") {
    startNight();
}

else if($_POST["action"] == "getMafiaLeader") {
    getMafiaLeader();
}

else if($_POST["action"] == "markKill") {
    markKill();
}

else if($_POST["action"] == "markHeal") {
    markHeal();
}

else if($_POST["action"] == "wakeSheriff") {
    wakeSheriff();
}

else if($_POST["action"] == "checkUser") {
    checkUser();
}

else if($_POST["action"] == "wakeMafia") {
    wakeMafia();
}

else if($_POST["action"] == "getAllRoles") {
    getAllRoles();
}

else if($_POST["action"] == "nightReport") {
    nightReport();
}

else if($_POST["action"] == "kill") {
    kill();
}

else if($_POST["action"] == "resetMarks") {
    resetMarks();
}

else if($_POST["action"] == "aliveCheck") {
    aliveCheck();
}

else if($_POST["action"] == "gameOver") {
    gameOver();
}

else if($_POST["action"] == "startDay") {
    startDay();
}

else if($_POST["action"] == "seenRole") {
    seenRole();
}

else if($_POST["action"] == "waitPlayersSeeRole") {
    waitPlayersSeeRole();
}

//Close mysql
mysqli_close($conn);


?>