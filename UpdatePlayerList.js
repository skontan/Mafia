

users = ["Skont", "Marvin", "Holy Ghost", "Anton", "Drew", "Mighty Anointing", "Praise"];


function updatePlayerList() {
    for (let i = 0; i < users.length; i++) {
        var playerName = users[i];
    
        createPlayerListItem = document.createElement("li");   
        createPlayerListItem.appendChild(document.createTextNode(playerName));
        createPlayerListItem.classList.add("list-group-item", "shadow-sm");
        document.getElementById("playerList1").appendChild(createPlayerListItem);
        document.getElementById("playerList2").appendChild(createPlayerListItem.cloneNode(true));
        console.log(playerName);
        console.log(createPlayerListItem);
    } 
};

updatePlayerList();



















