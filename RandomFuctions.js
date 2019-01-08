


function showElement(elementId) { // elementId needs to be written in "#id".
    $(elementId).show();
}





// Create Game button on click, hides fist page and shows AdminPanel

var createGameButton = document.getElementById("buttonCreateGame");

createGameButton.addEventListener("click", function() {
    createGame();
});

// Join Game button on click, hides first page and shows Game Lobby

var joinGameButton = document.getElementById("buttonJoinGame");

joinGameButton.addEventListener("click", function() {
    joinGame();
});

// Start Game button on click start the game

var startGameButton = document.getElementById("buttonStartGame");

startGameButton.addEventListener("click", function() {
    adminPanel();
    
        // $("#showRoles").hide();
        // $("#sleepCity").show();
});

// Show Roles screen OK button

var showRolesOkButton = document.getElementById("buttonOkRoles");

showRolesOkButton.addEventListener("click", function() {
    startNight();
});

// MafiaBoss on click kill button go to next step


function mafiaKill() {
    $("#mafiaScreen").hide();
    $("#mafiaBoss").hide();
    $("#mafiaKilled").show();
    // setTimeout(function(){
    //     $("#mafiaKilled").hide(); 
    //     // SleepMaffia sound from JS
    //     // WakeDoctor sound from JS
    //     $("#doctorNight").show(); 
    //     }, 3000);

}