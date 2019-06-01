/*

Variable declaration

var userId;
var gameId;
var users = [];
var lastGameStatus;
var admin = true/false;
var role;
var dead = true/false;
var doctorDead = true/false;
var sheriffDead = true/false;

*/

//Variable declaration
var userId; //The current users userId
var userName; //The current users userName
var gameId; //The current games gameId
var admin; //If current user is admin true/false
var status; //Game status retrieved from db
var lastStatus; //Last recieved game status from db
var users = []; //The array of all the users in the game
var numMafia; //The number of mafia in the game
var numUsers; //The number of users in the game
var doctor; //If there is a doctor in the game true/false
var sheriff; //If there is a sheriff in the game true/false
var role; //The current users role
var alive = true; //The state of the current user
var mafiaLeader; //The userName of the first mafia found in db, this user will pick who to kill
var checkedUser; //The role of the person that was checked
var effectedUser; //The userName of user that was either healed or killed
var nightAction; //String with the action that was performed on effectedUser
var teamWon; //The name of the team that won
var mafia = []; //Array with the names of the mafias
var doctorName; //The name of the doctor
var sheriffName; //The name of the sheriff
var myTimeout; //A timeout var
var playersSeenRole = false; //Variable that determines if all players have seen their role

//HTML Elements
const input_name = document.getElementById("nameInput");
const select_mafia = document.getElementById("selectMafia");
const select_doctor = document.getElementById("selectDoctor");
const select_sheriff = document.getElementById("selectSheriff");
const role_h1 = document.getElementById("role_h1");
const effectedPerson_h1 = document.getElementById("effectedPerson_h1");
const nightAction_h1 = document.getElementById("nightAction_h1");
const teamWon_p = document.getElementById("teamWon_p");
const checkedPerson_h1 = document.getElementById("checkedPerson_h1");
const team_h1 = document.getElementById("team_h1");
const cityKilled_h1 = document.getElementById("cityKilled_h1");

//Audio files
audio_sleepCity = new Audio("audio/SleepCity.mp3");
audio_sleepDoctor = new Audio("audio/SleepDoctor.mp3");
audio_sleepMafia = new Audio("audio/SleepMafia.mp3");
audio_sleepSheriff = new Audio("audio/SleepSheriff.mp3");
audio_wakeCity = new Audio("audio/WakeCity.mp3");
audio_wakeDoctor = new Audio("audio/WakeDoctor.mp3");
audio_wakeMafia = new Audio("audio/WakeMafia.mp3");
audio_wakeSheriff = new Audio("audio/WakeSheriff.mp3");


function createGame() {
    
    //Get name from the input
    userName = input_name.value;

    if(userName != "") {

        //Hide/Show elemets
        $("#firstPage").hide();
        $("#adminPanel").show();

        console.log("Creating game...");
    
        //Create game and pass on userName
        $("#updater").load("updater.php", { "action" : "createGame", who : userName}, function() {
            
            console.log("Game created!");
            console.log("UserId: " + userId);
            console.log("UserName: " + userName);
            console.log("GameId: " + gameId);
            console.log("Admin:" + admin);
    
            waitForOrders();
        });
    }
}

function joinGame() {
    console.log("Joining game...");

    //Save userName
    userName = input_name.value;

    if(userName != "") {
        //Hide and show elements
        $("#firstPage").hide();
        $("#gameLobby").show();

        //Trying to join game
        $("#updater").load("updater.php", { action : "joinGame", who : userName }, function() {
            if(gameId) {
                console.log("Joined game!");
                console.log("GameId: " + gameId);

                waitForOrders();
            } else {
                console.log("Didn't find game. Trying again soon.");
            }
            
        });
    }
}

function waitForOrders() {
    //If there are any double timeouts going on then we clear them here
    clearTimeout(myTimeout);

    console.log("Checking game status...");

    //Checking game status
    $("#updater").load("updater.php", { action : "checkGameStatus" }, function() {
        
        console.log("Game status: " + status);

        //When check is completed

        //If game is still waiting to start
        if(status == 0) {

            //Clearing users from .php instead
            //users = [];

            //console.log("Cleared users array");
            console.log("Getting users from db...")

            //Get users
            $("#updater").load("updater.php", { action : "getUsers" }, function() {
                
                console.log("Users found!");
                console.log(users);
                updatePlayerList();

                myTimeout = setTimeout(waitForOrders, 2000);
            });

            //Save lastStatus
            lastStatus = status;
        }

        //If game is starting
        else if(status == 1 && lastStatus != 1 && !admin) {
            //Save lastStatus
            lastStatus = status;
            
            startGame();
        }

        //If roles are assigned
        else if(status == 2 && lastStatus != 2 && !admin) {
            //Save lastStatus
            lastStatus = status;

            getRole();
        }

        //If it's night time and we didn't know
        else if(status == 3 && lastStatus != 3 && !admin) {

            //If we came from day
            if(lastStatus == 7) {

                //Updating with roles since people might have died
                getAllRoles(function() {
                    //If no one won after that check then startNight()
                    startNight();
                });
            } 
            //Otherwise just start night
            else {
                startNight();
            }

            //Save lastStatus
            lastStatus = status;

            //Go back and wait for status to become 4
            //myTimeout = setTimeout(waitForOrders, 2000);
        }

        //If it's time for mafia to wake up and we didn't know and we aren't admin,
        // since admin initiated
        else if(status == 4) {
            //If admin then you wait for mafia to be done
            //If you are admin and mafia then you probably won't get here
            if(admin) {
                myTimeout = setTimeout(waitForOrders, 2000);
            } 

            //If not admin
            else {

                //If we didn't know it's time for mafia to wake up
                if(lastStatus != 3) {
                    wakeMafia();
                } else {
                    //If we knew then just wait for mafia to be done
                    myTimeout = setTimeout(waitForOrders, 2000);
                }
            }

            //Save lastStatus
            lastStatus = status;

        }

        //If it's time for doctor to wake up and we didn't know,
        // admin needs access to this since mafia initiates status 5
        else if(status == 5 && lastStatus != 5) {
            //Save lastStatus
            lastStatus = status;

            wakeDoctor();
        }

        //If it's time for sheriff to wake up and we didn't know,
        // admin needs access to this since doctor initiates status 6
        else if(status == 6 && lastStatus != 6) {
            //Save lastStatus
            lastStatus = status;

            wakeSheriff();
        }

        //If it's day and we are waiting for vote to happen
        else if(status == 7 && lastStatus != 7) {
            //Save lastStatus
            lastStatus = status;

            //See what happened during the night since it's a new day
            setTimeout(function() {nightReport()}, 5000);
        }

        else if(status == 8) {

            //Since game is over we will get them to do a check and find out who won
            getAllRoles();
        }

        else {
            myTimeout = setTimeout(waitForOrders, 2000);
        }
    });
}

function adminPanel() {
    //see who is in the game

    //decide number of each role

    //startGame()

    if(select_doctor.value == "0") {
        doctor = false;
    } else {
        doctor = true;
    }

    if(select_sheriff.value == "0") {
        sheriff = false;
    } else {
        sheriff = true;
    }

    numMafia = select_mafia.value;

    startGame();
}

function startGame() {
    

    //Hide/Show elements
    $("#gameLobby").hide();
    $("#adminPanel").hide();
    $("#loadScreen").show();

    console.log("Game is starting!");

    clearTimeout(myTimeout);

    //if admin then assignRoles()
    //else wait 2 seconds and getRole()
    if(admin) {
        $("#updater").load("updater.php", { action : "startGame" }, function() {
            assignRoles();
        });
    } else {
        myTimeout = setTimeout(waitForOrders, 2000);
    }
}

function assignRoles() {

    console.log("Assigning roles...");

    //MARVIN START
    var farmers = users.slice();
    var chosen;

    console.log("Users: " + users);
    console.log("Amount of Mafias this game: " + numMafia);
    console.log("Doctor: " + doctor);
    console.log("Sheriff: " + sheriff);

    // Assign Maffia 
    console.log("Time to assign Mafias ");
    for (i = 0; i < numMafia; i++) {
        chosen = Math.floor(Math.random() * (farmers.length));
        console.log("I just chose " + farmers[chosen]);
        console.log( farmers[chosen] + " was assigned to be a Mafia");
        mafia.push(farmers[chosen]);
        farmers.splice(chosen, 1);
    }

    console.log("These are the Mafias");
    console.log(mafia);

    // Assign Doctor 
    if (doctor) {
        console.log("Time to assign Doctor");
        chosen = Math.floor(Math.random() * (farmers.length));
        doctorName = farmers[chosen];
        farmers.splice(chosen, 1);
        console.log("Doctor: " + doctorName);
        }
        else {
            console.log("Not assigning Doctor this game.");
            
        }
        
    // Assign Sheriff 
    if (sheriff) {
        chosen = Math.floor(Math.random() * (farmers.length));
        console.log("Time to assign Sheriff");
        sheriffName = farmers[chosen];
        console.log("Just assigned " + farmers[chosen] + " as the Sheriff.");
        farmers.splice(chosen, 1);
        console.log("Sheriff: " + sheriff);
    }
    else {
        console.log("Not assigning Sheriff this game.");
        
    }
    // MARVIN END

    var jsonMafia = JSON.stringify(mafia);

    //updates database
    $("#updater").load("updater.php", { action : "assignRoles", sheriff : sheriffName, doctor : doctorName,
        mafia : jsonMafia }, function() {
        
        console.log("Roles assigned!");

        getRole();
    });
}

function getRole() {

    clearTimeout(myTimeout);

    //Make sure game lobby is hidden
    $("#gameLobby").hide();
    

    console.log("Getting your role...");

    //Get roles from db
    $("#updater").load("updater.php", { action : "getRole" }, function() {

        console.log("Your role: " + role);
        console.log("NumMafia: " + numMafia);
        console.log("NumUsers: " + numUsers);
        console.log("Doctor: " + doctor);
        console.log("Sheriff: " + sheriff);

        //Update h1 with our role
        role_h1.innerHTML = role;

        //Show and hide elements
        $("#loadScreen").hide();
        $("#showRoles").show();

        //When player says "ok" after seen role, night starts
    });
}

function seenRole() {
    $("#showRoles").hide();
    $("#loadScreen").show();

    console.log("Role seen!");

    if(admin) {
        waitPlayersSeeRole();
    }
    else {
        $("#updater").load("updater.php", { action : "seenRole" }, function() {

            console.log("Database updated with seenRole=true!");

            //Wait for night to start in waitForOrders()
            waitForOrders();
        
        });
    }
}

function waitPlayersSeeRole() {

    console.log("Checking if players have seen role...")

    $("#updater").load("updater.php", { action : "waitPlayersSeeRole" }, function() {

        console.log("PlayersSeenRole = " + playersSeenRole);
        //Check if players had seen their role
        if(playersSeenRole) {
            startNight();
        }
        else {
            myTimeout = setTimeout(waitPlayersSeeRole, 2000);
        }
        
    });
}

function startNight() {
    //night mode on

    //Hide/Show elements
    $("#gameLobby").hide();
    $("#showRoles").hide();
    $("#loadScreen").hide();
    $("#cityKilled").hide();
    $("#nightMode").show();

    clearTimeout(myTimeout);

    console.log("Night is starting...");

    if(admin) {
        $("#updater").load("updater.php", { action : "startNight" }, function() {
            //Night is on and mafia can wake up in 5 seconds
            setTimeout(function() {audio_sleepCity.play()}, 4000);
            myTimeout = setTimeout(wakeMafia, 7000);
        });
    } else {
        waitForOrders();
    }
}

function wakeMafia() {

    clearTimeout(myTimeout);

    //Hide show elements 

    console.log("Waking mafia...");
    
    //If admin then update status in db
    if(admin) {
        $("#updater").load("updater.php", { action : "wakeMafia" });

        setTimeout(function() {audio_wakeMafia.play()}, 5000);
    }

    //If you are a living mafia
    if(role == "mafia" && alive) {
  
        
        console.log("You are a living mafia!");

        $("#updater").load("updater.php", { action : "getMafiaLeader" }, function() {
            if(userName == mafiaLeader) {

                //Hide show elements
                $("#nightMode").hide();
                updateMafiaButtons();
                $("#mafiaBoss").show();

                console.log("You are the mafia leader!");
                console.log("Pick who you want to kill.");

            }
            else {

                //Hide show elements
                $("#nightMode").hide();
                $("#mafiaScreen").show();

                console.log(mafiaLeader + " is the mafia leader.");
                console.log("Point at the person you want to kill and " + mafiaLeader + " will pick on their phone.");

                myTimeout = setTimeout(waitForOrders, 2000);
            }
        });

    } else {
        myTimeout = setTimeout(waitForOrders, 2000);
    }

}

function markKill(person) {
    $("#updater").load("updater.php", { action : "markKill", who : person }, function() {
        
        console.log("Marked " + person + " to be killed.");
        
        $("#mafiaBoss").hide();
        $("#nightMode").show();

        waitForOrders();
    });
}

function wakeDoctor() {

    //Ends all mafia stuff
    $("#mafiaScreen").hide();
    $("#nightMode").show();
    if(admin) {
        audio_sleepMafia.play();
    }

    clearTimeout(myTimeout);

    console.log("Waking doctor...");

    //if there is a doctor in the game
    if(doctor) {

        if(admin) {
            setTimeout(function() {audio_wakeDoctor.play() }, 6000);
        }

        console.log("There is a doctor in the game.");

        //if we are the doctor and alive
        if(role == "doctor" && alive) {

            //Hide show elements
            updateDoctorButtons();
            $("#nightMode").hide();
            $("#doctorNight").show();

            console.log("You are the doctor!");

            //Waiting for button to be pressed by doctor to call markHeal(person)
        }

        //If we aren't the doctor
        else {
            myTimeout = setTimeout(waitForOrders, 2000);
        }
    } 

    //If there is no doctor in the game
    else {

        console.log("There is no living doctor in the game");

        //if admin then change game status to wakeSheriff (6) since the doctor can't
        if(admin) {
            $("#updater").load("updater.php", { action : "wakeSheriff" }, function () {
                wakeSheriff();
            });
        } else {
            myTimeout = setTimeout(waitForOrders, 2000);
        }
    }
}

function markHeal(person) {

    //Marking user to be healed
    $("#updater").load("updater.php", { action : "markHeal", who : person }, function() {

        console.log("Marked " + person + " to be healed.");

        //Hide show elements
        $("#nightMode").show();
        $("#doctorNight").hide();
            
        waitForOrders();
    });
}

function wakeSheriff() {

    if(admin && doctor) {
        audio_sleepDoctor.play();
    }

    clearTimeout(myTimeout);

    console.log("Waking sheriff...");

    //If there is a sheriff in the game
    if(sheriff) {

        if(admin) {
            setTimeout(function() {audio_wakeSheriff.play()}, 6000);
        }

        //if we are the sheriff and alive
        if(role == "sheriff" && alive) {

            //Hide show elements
            updateSheriffButtons();
            $("#nightMode").hide();
            $("#sheriffNight").show();

            console.log("You are the sheriff!");

            //Sheriff trigger checkPerson() with button
        }

            //If we aren't the sheriff
        else {
            console.log("You are not the sheriff");
            myTimeout = setTimeout(waitForOrders, 2000);
        }
    }

    //If there is no sheriff in the game
    else {

        console.log("There is no living sheriff in the game");

        //if admin then change game status to startDay (7) since the sheriff can't
        if(admin) {
            $("#updater").load("updater.php", { action : "startDay" }, function () {
                nightReport();
            });
        } else {
            myTimeout = setTimeout(waitForOrders, 2000);
        }
    }
}

function checkPerson(person) {
    $("#updater").load("updater.php", { action : "checkUser", who : person }, function() {

        console.log("Checked " + person);

        //See if good or bad
        var team;
        if(checkedUser == "mafia") {
            team = "bad";
        } else {
            team = "good";
        }

        console.log(person + " is " + team);

        team_h1.innerHTML = team;
        checkedPerson_h1.innerHTML = person;

        $("#sheriffChecked").show();

        $("#sheriffNight").hide();
            
        waitForOrders();
    });
}

function nightReport() {
    //This happened during the night

    //7 seconds later -> startDay()

    if(admin && sheriff) {
        audio_sleepSheriff.play();
    }

    if(admin) {
        setTimeout(function() { audio_wakeCity.play() }, 4000);
    }



    clearTimeout(myTimeout);

    console.log("Getting night report...")

    //Get night report
    $("#updater").load("updater.php", { action : "nightReport" }, function () {

        $("#sheriffChecked").hide();

        console.log("Night report received!");
        console.log(effectedUser + " was " + nightAction + " during the night.");

        effectedPerson_h1.innerHTML = effectedUser + " was ";
        nightAction_h1.innerHTML = nightAction;

        //HIDE SHOW elements
        $("#nightMode").hide();
        $("#nightReport").show();

        //If admin and someone died, then kill them in db
        if(admin && nightAction == "killed") {
            $("#updater").load("updater.php", { action : "kill", who : effectedUser }, function() {
                console.log(effectedUser + " is now dead in the db");

                //Check if a team won
                getAllRoles();
            });
        }

        //Start day after 7 seconds
        myTimeout = setTimeout(startDay, 7000);
    });
}

function startDay() {
    //check with server if dead or alive

    //if admin then clear all users with marked values and see if a team won
        //if team won -> change game status to 7

        //else
            //show vote/kill screen
            //if dead -> dead()
    
    //else
        //if alive
            //waitForOrders()

        //else dead()

    console.log("It's a new day!");

    $("#nightReport").hide();
    $("#gameLobby").show();

    //If we died during the night
    if(nightAction == "killed" && userName == effectedUser) {
        dead();
    } 

    //If we survived the night
    else {

        //If we are admin then get kill panel
        if(admin) {
            voteScreen();
        }

        //Else wait for orders
        else {
            myTimeout = setTimeout(waitForOrders, 5000);
        }
    }
}

function resetMarks(ready) {

    console.log("Reseting marks in db...");

    //Reseting marks in db
    $("#updater").load("updater.php", { action : "resetMarks" }, function () {
        
        console.log("Marks reset!");

        //Callback funciton
        if(ready) {
            ready();
        }
    });
}

function voteScreen() {
    console.log("Since you are admin, you get to pick someone to kill.");

    updateFarmersButtons();
    $("#gameLobby").hide();
    $("#adminDaymode").show();

    //Waiting for admin to click button to trigger voteOut
}

function voteOut(vote) {
    if(vote != "None") {

        console.log("You picked " + vote + " to be voted out");

        $("#adminDaymode").hide();

        $("#updater").load("updater.php", { action : "kill", who : vote }, function() {
            
            console.log(vote + " is now dead in the db");

            //Check if a team won
            getAllRoles(function () {
                //if no one won then reset marks and start night
                resetMarks(startNight);
            });

        });
    }

    //Else start night since day is over
    else {
        //Check if a team won
        getAllRoles(function () {
            //if no one won then reset marks and start night
            resetMarks(startNight);
        });
    }
}

function getAllRoles(ready) {

    clearTimeout(myTimeout);

    console.log("Getting all roles...");

    $("#updater").load("updater.php", { action : "getAllRoles" }, function() {
        
        console.log("Recieved all roles!");
        console.log("NumMafia: " + numMafia);
        console.log("NumUsers: " + numUsers);
        console.log("Doctor: " + doctor);
        console.log("Sheriff: " + sheriff);

        //See if anyone won
        //if mafia is half of the users
        if(numMafia == numUsers/2) {
            teamWon = "mafia";
            gameOver();
        } 

        //If all mafia are dead
        else if(numMafia == 0) {
            teamWon = "city";
            gameOver();
        }

        //If no one won then callback function
        else {
            if(ready) {
                ready();
            }
        }
    });
}

function aliveCheck() {
    
    console.log("Checking if we are alive...");

    $("#updater").load("updater.php", { action : "aliveCheck" }, function() {
            
        console.log("Alive: " + alive);

        if(alive) {
            myTimeout = setTimeout(waitForOrders, 2000);
        } else {
            dead();
        }

    });
}

function dead() {
    //if admin
        //dead but since admin you can still do things
   
    //else show something that says they died and then it all stops here.

    console.log("YOU DIED!!!");

    alive = false;

    if(admin) {
        voteScreen();
    }
}

function gameOver() {
    
    clearTimeout(myTimeout);
    
    console.log("GAME OVER");
    console.log(teamWon + " won!!");

    teamWon_p.innerHTML = teamWon;
    $("#gameOver").show();
    $("#gameLobby").hide();


    if(admin) {

        console.log("Changing status to game over (8) in db");
        $("#updater").load("updater.php", { action : "gameOver" }, function() {
            
            console.log("Status changed!");
    
        });
    }
}