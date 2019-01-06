


function showElement(elementId) { // elementId needs to be written in "#id".
    $(elementId).show();
}





// Create Game button on click, hides fist page and shows AdminPanel

var createGameButton = document.getElementById("buttonCreateGame");

createGameButton.addEventListener("click", function() {
    $("#firstPage").hide();
    $("#adminPanel").show();
});

// Join Game button on click, hides first page and shows Game Lobby

var joinGameButton = document.getElementById("buttonJoinGame");

joinGameButton.addEventListener("click", function() {
    $("#firstPage").hide();
    $("#gameLobby").show();
});

// Start Game button on click start the game

var startGameButton = document.getElementById("buttonStartGame");

startGameButton.addEventListener("click", function() {
    $("#gameLobby").hide();
    $("#adminPanel").hide();
    $("#showRoles").show();
    
        // $("#showRoles").hide();
        // $("#sleepCity").show();
});

// Show Roles screen OK button

var showRolesOkButton = document.getElementById("buttonOkRoles");

showRolesOkButton.addEventListener("click", function() {
    $("#showRoles").hide();
    // anropa JS funktion för SleepCity.
    $("#nightMode").show();
    setTimeout(function() {
     $("#nightMode").hide();  
     // Wake Maffia with JS command
     $("#mafiaScreen").show();   
     $("#mafiaBoss").show();  
    }, 5000)
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