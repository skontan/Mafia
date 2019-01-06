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

function createGame() {
    //Temporary way
    userName = prompt("What's your name?");

    console.log("Creating game...");

    //Create game and pass on userName
    $("#updater").load("updater.php", { "action" : "createGame", who : userName}, function() {
        
        console.log("Game created!");
        console.log("UserId: " + userId);
        console.log("UserName: " + userName);
        console.log("GameId: " + gameId);
        console.log("Admin:" + admin);

        adminPanel();
        waitForOrders();
    });
}

function joinGame() {
    console.log("Joining game...");

    //Temprary fix
    userName = prompt("What is your name?");

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

function waitForOrders() {
    console.log("Checking game status...");

    //Checking game status
    $("#updater").load("updater.php", { action : "checkGameStatus"}, function() {
        
        console.log("Game status: " + status);

        //When check is completed
        //If game is still waiting to start
        if(status == 0) {
            //Clearing users array
            users = [];

            console.log("Cleared users array");
            console.log("Getting users from db...")

            //Get users
            $("#updater").load("updater.php", { action : "getUsers" }, function() {
                
                console.log("Users found!");
                console.log(users);

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
                getAllRoles();
            }

            //Save lastStatus
            lastStatus = status;

            startNight();
        }

        //If it's time for mafia to wake up and we didn't know and we aren't admin,
        // since admin initiated
        else if(status == 4) {
            //If admin then you wait for mafia to be done
            //If you are admin and mafia then you probably won't get here
            if(admin) {
                setTimeout(waitForOrders, 2000);
            } 

            //If not admin
            else {

                //If we didn't know it's time for mafia to wake up
                if(lastStatus != 3) {
                    wakeMafia();
                } else {
                    //If we knew then just wait for mafia to be done
                    setTimeout(waitForOrders, 2000);
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
        else if(status == 7 && lastStatus != 7 && alive && !admin) {
            //Save lastStatus
            lastStatus = status;

            //See if we died
            aliveCheck();
        }

        else if(status == 8) {
            gameOver();
        }

        else if(!admin) {
            setTimeout(waitForOrders, 2000);
        }
    });

    //if 0 -> ask again since we want game to start

    //if 1 -> startGame()

    //if 2 -> startNight()

    //if 3 -> wakeMafia()

    //if 4 -> wakeDoctor()

    //if 5 -> wakeSheriff()

    //if 6 -> nightReport()

    //if 7 -> gameOver()
}

function adminPanel() {
    //see who is in the game

    //decide number of each role

    //startGame()

    numMafia = prompt("How many mafia?");
    doctor = confirm("Is there a doctor in the game?");
    sheriff = confirm("Is there a sheriff in the game?");
}

function startGame() {
    //if admin then assignRoles()
    //else wait 2 seconds and getRole()

    console.log("Game is starting!");

    clearTimeout(myTimeout);

    if(admin) {
        $("#updater").load("updater.php", { action : "startGame" });
        assignRoles();
    } else {
        setTimeout(waitForOrders, 2000);
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
    });
    
    //getRole()
    getRole();
}

function getRole() {

    console.log("Getting your role...");

    //Get roles from db
    $("#updater").load("updater.php", { action : "getRole" }, function() {

        console.log("Your role: " + role);
        console.log("NumMafia: " + numMafia);
        console.log("NumUsers: " + numUsers);
        console.log("Doctor: " + doctor);
        console.log("Sheriff: " + sheriff);

        //Start night and since we know it's night we can change lastStatus
        lastStatus = 3;
        setTimeout(startNight, 7000);
    });
}

function showRole() {
    //You are a XXX!

    //waitForOrders()
}

function startNight() {
    //night mode on

    console.log("Night is starting...");

    if(admin) {
        $("#updater").load("updater.php", { action : "startNight" }, function() {
            //Night is on and mafia can wake up
            wakeMafia();
        });
    } else {
        waitForOrders();
    }
}

function wakeMafia() {

    console.log("Waking mafia...");
    
    //If admin then update status in db
    if(admin) {
        $("#updater").load("updater.php", { action : "wakeMafia" });
    }

    //If you are a living mafia
    if(role == "mafia" && alive) {
        
        console.log("You are a living mafia!");

        $("#updater").load("updater.php", { action : "getMafiaLeader" }, function() {
            if(userName == mafiaLeader) {

                console.log("You are the mafia leader!");
                console.log("Pick who you want to kill.");

                var person = prompt("Who do you want to kill?");
                $("#updater").load("updater.php", { action : "markKill", who : person }, function() {
                    
                    console.log("Marked " + person + " to be killed.");

                    waitForOrders();
                });

            }
            else {

                console.log(mafiaLeader + " is the mafia leader.");
                console.log("Point at the person you want to kill and " + mafiaLeader + " will pick on their phone.");

                setTimeout(waitForOrders, 2000);
            }
        });

    } else {
        setTimeout(waitForOrders, 2000);
    }

}

function wakeDoctor() {

    console.log("Waking doctor...");

    //if there is a doctor in the game
    if(doctor) {

        console.log("There is a doctor in the game.");

        //if we are the doctor and alive
        if(role == "doctor" && alive) {

            console.log("You are the doctor!");

            var person = prompt("Who do you want to heal?");
            $("#updater").load("updater.php", { action : "markHeal", who : person }, function() {

                console.log("Marked " + person + " to be healed.");
                    
                waitForOrders();
            });
        }

        //If we aren't the doctor
        else {
            setTimeout(waitForOrders, 2000);
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
            setTimeout(waitForOrders, 2000);
        }
    }
}

function wakeSheriff() {

    console.log("Waking sheriff...");

    //If there is a sheriff in the game
    if(sheriff) {
        //if we are the doctor and alive
        if(role == "sheriff" && alive) {

            console.log("You are the sheriff!");

            var person = prompt("Who do you want to check?");
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
                    
                waitForOrders();
            });
        }

            //If we aren't the sheriff
        else {
            console.log("You are not the sheriff");
            setTimeout(waitForOrders, 2000);
        }
    }

    //If there is no sheriff in the game
    else {

        console.log("There is no living sheriff in the game");

        //if admin then change game status to startDay (7) since the doctor can't
        if(admin) {
            $("#updater").load("updater.php", { action : "startDay" }, function () {
                nightReport();
            });
        } else {
            setTimeout(waitForOrders, 2000);
        }
    }
}

function nightReport() {
    //This happened during the night

    //7 seconds later -> startDay()

    console.log("Getting night report...")

    //Get night report
    $("#updater").load("updater.php", { action : "nightReport" }, function () {

        console.log("Night report received!");
        console.log(effectedUser + " was " + nightAction + " during the night.");

        //If admin and someone died, then kill them in db
        if(admin && nightAction == "killed") {
            $("#updater").load("updater.php", { action : "kill", who : effectedUser }, function() {
                console.log(effectedUser + " is now dead in the db");
            });
        }

        //Start day after 7 seconds
        setTimeout(startDay, 7000);
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

    //If admin then reset marks in db
    if(admin) {
        resetMarks();
    }

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
            setTimeout(waitForOrders, 5000);
        }
    }
}

function resetMarks() {

    console.log("Reseting marks in db...");

    //Reseting marks in db
    $("#updater").load("updater.php", { action : "resetMarks" }, function () {
        
        console.log("Marks reset!");
    });
}

function voteScreen() {
    console.log("Since you are admin, you get to pick someone to kill.");

    var vote = prompt("Who do you want to vote out?");

    if(vote != "none") {

        console.log("You picked " + vote + " to be voted out");

        $("#updater").load("updater.php", { action : "kill", who : vote }, function() {
            
            console.log(vote + " is now dead in the db");

            //Check if a team won
            whoWon();

        });
    }

    //When voting is done, night begins
    startNight();
}

function getAllRoles() {

    console.log("Getting all roles...");

    $("#updater").load("updater.php", { action : "getAllRoles" }, function() {
        
        console.log("Recieved all roles!");
        console.log("NumMafia: " + numMafia);
        console.log("NumUsers: " + numUsers);
        console.log("Doctor: " + doctor);
        console.log("Sheriff: " + sheriff);

        //if admin then see if anyone won
        if(admin) {
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
        }

    });
}

function aliveCheck() {
    
    console.log("Checking if we are alive...");

    $("#updater").load("updater.php", { action : "aliveCheck" }, function() {
            
        console.log("Alive: " + alive);

        if(alive) {
            setTimeout(waitForOrders, 2000);
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
    
    console.log("GAME OVER");
    console.log(teamWon + " won!!");

    if(admin) {

        console.log("Changing status to game over (8) in db");
        $("#updater").load("updater.php", { action : "gameOver" }, function() {
            
            console.log("Status changed!");
    
        });
    }
}