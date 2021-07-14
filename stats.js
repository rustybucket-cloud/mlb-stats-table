function stats() {
    let playerName = prompt("What is the player's name?")
        fetch(`https://free-nba.p.rapidapi.com/players?search=${playerName}&per_page=25&page=0`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
                "x-rapidapi-host": "free-nba.p.rapidapi.com"
            }
        })
            .then(response => response.json())
            .then(info => {
                info.data.forEach(player => {
                    console.log(player.team);
                })
                /*Object.keys(data).forEach(player => {
                    console.log(player);
                })*/
            })
            .catch(err => {
                console.error(err);
            });
}
document.addEventListener('click', stats);