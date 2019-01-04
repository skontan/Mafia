<?php
//Connect with mysql
require_once 'includes/configMySQL.php';

/* 
createGame() {
    sql insert into games(status) values(0)
    return adminPanel()
}

tables: users(id, name, gameId, role, markKill, markHeal), games(gameId, status)

statuses:
0 - waiting for players
1 - game has started
2 - night time
3 - mafia is killing
4 - doctor is healing
5 - sheriff is investigating
6 - it's a new day


*/

function createGame() {
    //sql insert into games(status) values(0)
    //return adminPanel()
}

function joinGame() {
    //sql select * from games where status=0;

    //if found game then
    //sql update users set gameId=? where userId=? 
    //return waitForGameToStart()

    //else call joinGame again in 2 seconds
}

function waitForGameToStart() {
    //sql select * from games where gameId=? and status=1

    //if found then startGame()

    //else call waitForGameToStart in 2 seconds()
}

function startGame() {
    //sql update games set status=1 where gameId=?
}

function getRole() {
    //sql select role from users where userId=?

    //if role not null then
    //set session value with role
    //set javascript variable with role
    //showRole()

    //else ask for role again in 2 seconds

}

function markKill() {
    //sql update users set markKill=true where userId=?

    //sql update games set status=4 where gameId=?
}

function markHeal() {
    //sql update users set markHeal=true where userId=?

    //sql update games set status=5 where gameId=?
}

function kill() {
    //delete from users where userId=?
}

function checkGameStatus() {
    //sql select status from games where gameId=?

}


?>