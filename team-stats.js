import teams from "./teams-list.js";

//loads team names to a select when searching by team
function loadTeams() {
    const byTeam = document.querySelector('#by-team');
    byTeam.classList.toggle("notActive");
    const div = document.querySelector('#team-search');
    div.innerHTML = '';
    const h2 = document.createElement('h2');
    h2.innerText = "Select Team";
    div.append(h2);
    const select = document.createElement('select');
    select.id = "team-select";
    select.addEventListener('change', loadTeamStats);
    const selectOne = document.createElement('option');
    selectOne.textContent = "Select One";
    select.append(selectOne);
    teams.forEach( team => {
        const option = document.createElement('option');
        const teamName = document.createTextNode(team.name);
        option.value = team.id;
        option.append(teamName);
        select.append(option);
    });
    div.append(select);
}
document.addEventListener('DOMContentLoaded', loadTeams);

function loadTeamStats() {
    const teamSelect = document.querySelector('#team-select').value;
    const table = document.querySelector('#team-stats');
    table.classList.toggle("notActive");
    fetchStats(2021);

    function fetchStats(selectedYear) {
        fetch(`https://api-baseball.p.rapidapi.com/teams/statistics?league=1&season=${selectedYear}&team=${teamSelect}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
            "x-rapidapi-host": "api-baseball.p.rapidapi.com"
        }
        })
            .then(response => response.json())
            .then( year => {
                    if (year.response.games.played.all !== 0) {
                        const wins = year.response.games.wins.all.total;
                        const losses = year.response.games.loses.all.total;
                        const avgRuns = year.response.points.for.average.all;
                        const eraStat = year.response.points.against.average.all;
                        const tr = document.createElement('tr');
                        const season = document.createElement('td');
                        season.innerText = selectedYear;
                        tr.append(season);
                        const record = document.createElement('td');
                        record.innerText = `${wins}-${losses}`;
                        tr.append(record);
                        const avg = document.createElement('td');
                        avg.innerText = avgRuns;
                        tr.append(avg);
                        const era = document.createElement('td');
                        era.innerText = eraStat;
                        tr.append(era);
                        table.append(tr);
                        fetchStats(selectedYear - 1);
                    } 
                    else {
                        return;
                    }
            })
            .catch(err => {
                console.error(err);
            });
    }
    
    
}
