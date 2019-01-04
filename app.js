/*

2 buttons that either lead to:
    createGame();
    or
    joinGame();


    function createGame() {
        $("#updater").load(updater.php, { action : "createGame"})
    }

*/

function createGame() {
    $("#updater").load(updater.php, { action : "createGame"});
}

function joinGame() {
    $("#updater").load(updater.php, { action : "joinGame"});
}

function waitForGametoStart() {
    $("#updater").load(updater.php, { action : "waitForGameToStart"});
}

function adminPanel() {
    //see who is in the game

    //decide number of each role

    $("#updater").load(updater.php, { action : "startGame"});
    //startGame()
}

function startGame() {
    //if admin then assignRoles()
    //else wait 2 seconds and getRole()
}

function assignRoles() {
    //assigns every player a role and updates database
    
    //getRole()
}

function getRole() {
    //
    $("#updater").load(updater.php, { action : "getRole"});
}

function showRole() {
    //You are a XXX!

    //waitForOrders()
}

function startNight() {
    //if admin then
    //wakeMafia()
    //wakeDoctor()
    //wakeSheriff()
    //startDay()

    //else waitForOrders()
}

function wakeMafia() {
    //if mafia
    //who do you want to kill?
    $("#updater").load(updater.php, { action : "markKill", who : person });

    //else waitForOrders in 2 seconds

}

function wakeDoctor() {
    //if doctor
    //who do you want to heal?
    $("#updater").load(updater.php, { action : "markHeal", who : person });

    //else waitForOrders in 2 seconds
}

function waitForOrders() {
    $("#updater").load(updater.php, { action : "checkGameStatus" });
}

function startDay() {
    //nightReport()
    //if admin then say who d
}