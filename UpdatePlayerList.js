


function updatePlayerList() {
    const playerList1 = document.getElementById("playerList1");
    const platerList2 = document.getElementById("playerList2");

    while(playerList1.firstChild) {
        playerList1.removeChild(playerList1.firstChild);
    }

    while(platerList2.firstChild) {
        platerList2.removeChild(platerList2.firstChild);
    }

    for (let i = 0; i < users.length; i++) {
        var playerName = users[i];
    
        createPlayerListItem = document.createElement("li");   
        createPlayerListItem.appendChild(document.createTextNode(playerName));
        createPlayerListItem.classList.add("list-group-item", "shadow-sm");
        playerList1.appendChild(createPlayerListItem);
        playerList2.appendChild(createPlayerListItem.cloneNode(true));
        console.log(playerName);
        console.log(createPlayerListItem);
    } 
};



















