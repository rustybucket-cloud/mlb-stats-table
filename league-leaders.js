function loadLeagueLeaders() {
    const table = document.querySelector('#ll-table');
    table.innerHTML = '';
    const chosenStat = document.querySelector("#stat-select").value;
    const year = document.querySelector('#ll-year-select').value;
    const headerTr = document.createElement('tr');
    const playerName = document.createElement('td');
    playerName.innerText = "Player"
    headerTr.append(playerName);
    const stat = document.createElement('td');
    stat.innerText = chosenStat.toUpperCase();
    headerTr.append(stat);
    table.append(headerTr);

    if (chosenStat === 'h' || chosenStat === 'avg' || chosenStat === 'ab' || chosenStat === 'bb'){
        dataFetch('hitting');
    }
    else {
        dataFetch('pitching');
    }
    function dataFetch(position) {
        fetch(`https://mlb-data.p.rapidapi.com/json/named.leader_${position}_repeater.bam?game_type='R'&results='10'&sort_column='${chosenStat}'&sports_code='mlb'&season='${year}'&leader_hitting_repeater.col_in=${chosenStat}%2Cname_display_first_last`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
            "x-rapidapi-host": "mlb-data.p.rapidapi.com"
        }
        })
            .then(response => response.json())
            .then(data => {
                let row = (position === 'pitching') ? data.leader_pitching_repeater.leader_pitching_mux.queryResults.row : data.leader_hitting_repeater.leader_hitting_mux.queryResults.row;
                const table = document.querySelector('#ll-table');
                row.forEach( player => {
                    const name = player.name_display_first_last;
                    const stat = player[chosenStat];
                    const tr = document.createElement('tr');
                    const nameTd = document.createElement('td');
                    const statTd = document.createElement('td');
                    nameTd.innerText = name;
                    statTd.innerText = stat;
                    tr.append(nameTd);
                    tr.append(statTd);
                    table.append(tr);
                })
            })
            .catch(err => {
                console.error(err);
            });
    }
}
document.querySelector('#ll-search').addEventListener('click', loadLeagueLeaders);