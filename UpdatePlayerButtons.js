

users = ["Skont", "Marvin", "Holy Ghost", "Anton", "Drew", "Mighty Anointing", "Praise"];


function updateMafiaButtons() {
    for (let i = 0; i < users.length; i++) {
        var playerName = users[i];
    
        createMafiaButton = document.createElement("button");   
        createMafiaButton.appendChild(document.createTextNode(playerName));
        createMafiaButton.classList.add("btn", "btn-danger", "btn-lg", "mb-3", "mx-1", "buttonMaffiaKills");
        createMafiaButton.setAttribute("type", "button");
        document.getElementById("buttonListMafia").appendChild(createMafiaButton);
        console.log(playerName);
        console.log(createMafiaButton);
    } 
};

function updateDoctorButtons() {
    for (let i = 0; i < users.length; i++) {
        var playerName = users[i];
    
        createDoctorButton = document.createElement("button");   
        createDoctorButton.appendChild(document.createTextNode(playerName));
        createDoctorButton.classList.add("btn", "btn-success", "btn-lg", "mb-3", "mx-1");
        createDoctorButton.setAttribute("type", "button");
        document.getElementById("buttonListDoctor").appendChild(createDoctorButton);
        console.log(playerName);
        console.log(createDoctorButton);
    } 
};

function updateSheriffButtons() {
    for (let i = 0; i < users.length; i++) {
        var playerName = users[i];
    
        createSheriffButton = document.createElement("button");   
        createSheriffButton.appendChild(document.createTextNode(playerName));
        createSheriffButton.classList.add("btn", "btn-info", "btn-lg", "mb-3", "mx-1");
        createSheriffButton.setAttribute("type", "button");
        document.getElementById("buttonListSheriff").appendChild(createSheriffButton);
        console.log(playerName);
        console.log(createSheriffButton);
    } 
};

function updateSheriffButtons() {
    for (let i = 0; i < users.length; i++) {
        var playerName = users[i];
    
        createSheriffButton = document.createElement("button");   
        createSheriffButton.appendChild(document.createTextNode(playerName));
        createSheriffButton.classList.add("btn", "btn-info", "btn-lg", "mb-3", "mx-1");
        createSheriffButton.setAttribute("type", "button");
        document.getElementById("buttonListSheriff").appendChild(createSheriffButton);
        console.log(playerName);
        console.log(createSheriffButton);
    } 
};

function updateFarmersButtons() {
    for (let i = 0; i < users.length; i++) {
        var playerName = users[i];
    
        createFarmersButton = document.createElement("button");   
        createFarmersButton.appendChild(document.createTextNode(playerName));
        createFarmersButton.classList.add("btn", "btn-secondary", "btn-lg", "mb-3", "mx-1");
        createFarmersButton.setAttribute("type", "button");
        document.getElementById("buttonListFarmers").appendChild(createFarmersButton);
        console.log(playerName);
        console.log(createFarmersButton);
    } 
};





updateMafiaButtons();
updateDoctorButtons();
updateSheriffButtons();
updateFarmersButtons();