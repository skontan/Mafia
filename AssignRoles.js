

var users = ["Marvin", "Skontan", "Jesus", "Bert", "Drew", "Anton", "Holy Spirit"];
var farmers = users.slice();
var mafia = [];
var doctor = [];
var sheriff = [];
var numMafia = 2;
var doctorState = true;
var sheriffState = true;
var chosenMafia;

console.log("Users: " + users);
console.log("Amount of Mafias this game: " + numMafia);

console.log("doctor: " + doctorState);
console.log("sheriff: " + sheriffState);

// Assign Maffia 
function assignMafia() {
    console.log("Time to assign Maffias ");
    for (i = 0; i < numMafia; i++) {
        chosenMafia = Math.floor(Math.random() * (farmers.length)); // Makes a random number based on user.length and puts it in var chosenMafia
        console.log("I just chose " + farmers[chosenMafia]);
        console.log( farmers[chosenMafia] + " was assigned to be a Mafia");
        mafia.push(farmers[chosenMafia]);
        farmers.splice(chosenMafia, 1);
    }

    console.log("These are the Mafia at the moment");
    console.log(mafia);
    console.log("Farmers: " + farmers);
};


// Assign Doctor 
function assignDoctor() {
    if (doctorState == true) {
        console.log("Time to assign Doctor");
        chosenMafia = Math.floor(Math.random() * (farmers.length));
        doctor = farmers[chosenMafia];
        farmers.splice(chosenMafia, 1);
        console.log("Doctor: " + doctor);
        console.log("Farmers: " + farmers);
        }
        else {
            console.log("Not assigning Doctor this game.");
            
        }
};
    
// Assign Sheriff 
function assignSheriff() {
    if (sheriffState == true) {
        chosenMafia = Math.floor(Math.random() * (farmers.length));
        console.log("Time to assign Sheriff");
        sheriff = farmers[chosenMafia];
        console.log("Just assigned " + farmers[chosenMafia] + " as the Sheriff.");
        farmers.splice(chosenMafia, 1);
        console.log("Sheriff: " + sheriff);
        console.log("Farmers: " + farmers);
       }
       else {
           console.log("Not assigning Sheriff this game.");
           
       }
};


    assignMafia();
    assignDoctor();
    assignSheriff();

    console.log("All assigned roles are");
    console.log("Maffia: " + mafia);
    console.log("Doctor: " + doctor);
    console.log("Sheriff: " + sheriff );
    console.log("Farmers: " + farmers);
    
    


