


function updateMafiaButtons() {

    const buttonMafiaList = document.getElementById("buttonListMafia");

    while(buttonMafiaList.firstChild) {
        buttonMafiaList.removeChild(buttonMafiaList.firstChild);
    }

    for (let i = 0; i < users.length; i++) {
        var playerName = users[i];
    
        createMafiaButton = document.createElement("button");   
        createMafiaButton.appendChild(document.createTextNode(playerName));
        createMafiaButton.classList.add("btn", "btn-danger", "btn-lg", "mb-3", "mx-1", "buttonMaffiaKills");
        createMafiaButton.setAttribute("type", "button");
        createMafiaButton.addEventListener("click", function () { markKill(this.textContent) } );
        buttonMafiaList.appendChild(createMafiaButton);
    } 
};

function updateDoctorButtons() {
    const buttonDoctorList = document.getElementById("buttonListDoctor");

    while(buttonDoctorList.firstChild) {
        buttonDoctorList.removeChild(buttonDoctorList.firstChild);
    }

    for (let i = 0; i < users.length; i++) {
        var playerName = users[i];
    
        createDoctorButton = document.createElement("button");   
        createDoctorButton.appendChild(document.createTextNode(playerName));
        createDoctorButton.classList.add("btn", "btn-success", "btn-lg", "mb-3", "mx-1");
        createDoctorButton.setAttribute("type", "button");
        createDoctorButton.addEventListener("click", function () { markHeal(this.textContent) } );
        buttonDoctorList.appendChild(createDoctorButton);
    } 
};

function updateSheriffButtons() {

    const buttonSheriffList = document.getElementById("buttonListSheriff");

    while(buttonSheriffList.firstChild) {
        buttonSheriffList.removeChild(buttonSheriffList.firstChild);
    }

    for (let i = 0; i < users.length; i++) {
        var playerName = users[i];
    
        createSheriffButton = document.createElement("button");   
        createSheriffButton.appendChild(document.createTextNode(playerName));
        createSheriffButton.classList.add("btn", "btn-info", "btn-lg", "mb-3", "mx-1");
        createSheriffButton.setAttribute("type", "button");
        createSheriffButton.addEventListener("click", function () { checkPerson(this.textContent) } );
        document.getElementById("buttonListSheriff").appendChild(createSheriffButton);
    } 
};


function updateFarmersButtons() {

    const buttonListFarmers = document.getElementById("buttonListFarmers");

    while(buttonListFarmers.firstChild) {
        buttonListFarmers.removeChild(buttonListFarmers.firstChild);
    }

    for (let i = 0; i < users.length; i++) {
        var playerName = users[i];
    
        createFarmersButton = document.createElement("button");   
        createFarmersButton.appendChild(document.createTextNode(playerName));
        createFarmersButton.classList.add("btn", "btn-secondary", "btn-lg", "mb-3", "mx-1");
        createFarmersButton.setAttribute("type", "button");
        createFarmersButton.addEventListener("click", function () { voteOut(this.textContent) } );
        buttonListFarmers.appendChild(createFarmersButton);
    } 

    //Create none button
        createFarmersButton = document.createElement("button");   
        createFarmersButton.appendChild(document.createTextNode("None"));
        createFarmersButton.classList.add("btn", "btn-secondary", "btn-lg", "mb-3", "mx-1");
        createFarmersButton.setAttribute("type", "button");
        createFarmersButton.addEventListener("click", function () { voteOut(this.textContent) } );
        buttonListFarmers.appendChild(createFarmersButton);
};
