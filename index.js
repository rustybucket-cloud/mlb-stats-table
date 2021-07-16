function fetchId() {
    const playerName = document.querySelector('#player_name').value;
    fetch(`https://mlb-data.p.rapidapi.com/json/named.search_player_all.bam?name_part='${playerName}%25'&sport_code='mlb'&active_sw='Y'`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
		"x-rapidapi-host": "mlb-data.p.rapidapi.com"
	}
        })
        .then(response => response.json())
        .then(data => {
            if (data.search_player_all.queryResults.totalSize === '0') {
                alert('Player not found. Check your spelling and try again');
                return;
            }
            const playerId = data.search_player_all.queryResults.row.player_id;
            const start = data.search_player_all.queryResults.row.pro_debut_date;
            const first_year = start.substr(0 ,4);
            const playerName = data.search_player_all.queryResults.row.name_display_first_last;
            const nickName = data.search_player_all.queryResults.row.name_nick;
            const birthCountry = data.search_player_all.queryResults.row.birth_country;
            const birthState = data.search_player_all.queryResults.row.birth_state;
            const birthCity = data.search_player_all.queryResults.row.birth_city;
            const primaryPosition = data.search_player_all.queryResults.row.primary_position_txt;
            const throws = data.search_player_all.queryResults.row.throws;
            const height = `${data.search_player_all.queryResults.row.height_feet}'${data.search_player_all.queryResults.row.height_inches}"`;
            const age = data.search_player_all.queryResults.row.age;

            loadInfo(playerName, nickName, birthCountry, birthState, birthCity, primaryPosition, throws, height, age);

            let years = 0;
            for (i=2020; i>=first_year; i--) {
                years++;
            }

            const playerPosition = data.search_player_all.queryResults.row.position;
            const position = document.querySelector('#position');
            if (playerPosition === 'P') {
                position.style.visibility = "visible";
            }else {
                position.value = 'hitter';
                position.style.visibility = "hidden";
            }

            let valueField;
            if (position.value === 'default') {
                valueField = playerPosition;
            } else {
                valueField = position.value;
            }

            if (valueField === 'P') {
                fetchStatsPitcher(playerId, years);
                careerStatsPitching(playerId, years);
            } else {
                fetchStatsPosition(playerId, years);
                careerStats(playerId, years);
            }
            
        })
        .catch(err => {
            console.error(err);
        });
}
document.querySelector('#submit').addEventListener('click', fetchId);
document.querySelector('#position').addEventListener('change', fetchId);
document.getElementById("player_name").onkeypress = function(e) {
    var key = e.charCode || e.keyCode || 0;     
    if (key == 13) {
      e.preventDefault();
      fetchId();
    }
  }

function loadInfo(name, nickName, birthCountry, birthState, birthCity, position, throws, height, age) {
    const div = document.querySelector('#playerInfo');
    div.innerHTML = '';
    const infoList = [
        {label:'Name', data:name},
        {label:'Nickname', data:nickName},
        {label:'Birth country', data:birthCountry},
        {label:'Birth state', data:birthState}, 
        {label:'Birth city', data:birthCity}, 
        {label:'Position', data:position}, 
        {label:'Throws', data:throws}, 
        {label:'Height', data:height}, 
        {label:'Age', data:age}
    ];
    infoList.forEach( stat => {
        if (stat.data !== undefined && stat.data !== '') {
            const p = document.createElement('p');
            p.innerText = `${stat.label}: ${stat.data}`;
            div.append(p);
        }
    });
}

function fetchStatsPosition(id, years) {
    let season = 2020;

    const statTable = document.querySelector('#table') 
            statTable.innerHTML = '';
            const headRow = document.createElement('tr');
            statTable.append(headRow);
            const s = document.createElement('th');
            s.innerText = 'Season';
            headRow.append(s);
            const team = document.createElement('th');
            team.innerText = 'Team';
            headRow.append(team);
            const ab = document.createElement('th');
            ab.innerText = 'AB';
            headRow.append(ab);
            const h = document.createElement('th');
            h.innerText = 'H';
            headRow.append(h);
            const hr = document.createElement('th');
            hr.innerText = 'HR';
            headRow.append(hr);
            const bb = document.createElement('th');
            bb.innerText = 'BB';
            headRow.append(bb);
            const hbp = document.createElement('th');
            hbp.innerText = 'HBP';
            headRow.append(hbp);
            const avg = document.createElement('th');
            avg.innerText = 'AVG';
            headRow.append(avg);
            const slg = document.createElement('th');
            slg.innerText = 'SLG';
            headRow.append(slg);

            for (let i=0; i < years; i++) {
                const tr = document.createElement('tr');
                for ( let x=0; x<9; x++) {
                    const td = document.createElement('td');
                    tr.append(td);
                }
                document.querySelector('#table').append(tr);
            }

    for (let i=0; i<years; i++) {
        fetch(`https://mlb-data.p.rapidapi.com/json/named.sport_hitting_tm.bam?league_list_id='mlb'&game_type='R'&season='${season}'&player_id='${id}'`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
            "x-rapidapi-host": "mlb-data.p.rapidapi.com"
        }
        })
            .then(response => response.json())
            .then(data => {
                if (data.sport_hitting_tm.queryResults.totalSize !== '0') {
                    //retrieving data from JSON document
                    const table = document.querySelector('#table');
                    const season = data.sport_hitting_tm.queryResults.row.season;
                    const team = data.sport_hitting_tm.queryResults.row.team_abbrev;
                    const ab = data.sport_hitting_tm.queryResults.row.ab;
                    const avg = data.sport_hitting_tm.queryResults.row.avg;
                    const h = data.sport_hitting_tm.queryResults.row.h;
                    const hr = data.sport_hitting_tm.queryResults.row.hr;
                    const bb = data.sport_hitting_tm.queryResults.row.bb;
                    const hbp = data.sport_hitting_tm.queryResults.row.hbp;
                    const slg = data.sport_hitting_tm.queryResults.row.slg;

                    if (season !== undefined) {
                    //inserting data into the table
                    const r = i+1;
                    table.rows[r].cells[0].innerText = season;
                    table.rows[r].cells[1].innerText = team;
                    table.rows[r].cells[2].innerText = ab;
                    table.rows[r].cells[3].innerText = h;
                    table.rows[r].cells[4].innerText = hr;   
                    table.rows[r].cells[5].innerText = bb;
                    table.rows[r].cells[6].innerText = hbp;
                    table.rows[r].cells[7].innerText = avg;
                    table.rows[r].cells[8].innerText = slg;
                    } 
                    else {
                    const r = i+1;
                    table.rows[r].cells[0].innerText = 2020 - i;
                    table.rows[r].cells[1].innerText = 'N/A';
                    table.rows[r].cells[2].innerText = 'N/A';
                    table.rows[r].cells[3].innerText = 'N/A';
                    table.rows[r].cells[4].innerText = 'N/A';   
                    table.rows[r].cells[5].innerText = 'N/A';
                    table.rows[r].cells[6].innerText = 'N/A';
                    table.rows[r].cells[7].innerText = 'N/A';
                    table.rows[r].cells[8].innerText = 'N/A';
                    }
                } else {
                    const r = i+1;
                    table.rows[r].cells[0].innerText = 2020 - i;
                    table.rows[r].cells[1].innerText = 'N/A';
                    table.rows[r].cells[2].innerText = 'N/A';
                    table.rows[r].cells[3].innerText = 'N/A';
                    table.rows[r].cells[4].innerText = 'N/A';   
                    table.rows[r].cells[5].innerText = 'N/A';
                    table.rows[r].cells[6].innerText = 'N/A';
                    table.rows[r].cells[7].innerText = 'N/A';
                    table.rows[r].cells[8].innerText = 'N/A';
                }
                
            })
            .catch(err => {
                console.error(err);
            });
            season--;
        }
}

function fetchStatsPitcher(id, years) {
    let season = 2020;

    const statTable = document.querySelector('#table') 
            statTable.innerHTML = '';
            const headRow = document.createElement('tr');
            statTable.append(headRow);
            const s = document.createElement('th');
            s.innerText = 'Season';
            headRow.append(s);
            const team = document.createElement('th');
            team.innerText = 'Team';
            headRow.append(team);
            const era = document.createElement('th');
            era.innerText = 'ERA';
            headRow.append(era);
            const ip = document.createElement('th');
            ip.innerText = 'IP';
            headRow.append(ip);
            const so = document.createElement('th');
            so.innerText = 'SO';
            headRow.append(so);
            const h = document.createElement('th');
            h.innerText = 'H';
            headRow.append(h);
            const bb = document.createElement('th');
            bb.innerText = 'BB';
            headRow.append(bb);
            const avg = document.createElement('th');
            avg.innerText = 'AVG';
            headRow.append(avg);
            const whip = document.createElement('th');
            whip.innerText = 'WHIP';
            headRow.append(whip);

            for (let i=0; i < years; i++) {
                const tr = document.createElement('tr');
                for ( let x=0; x<9; x++) {
                    const td = document.createElement('td');
                    tr.append(td);
                }
                document.querySelector('#table').append(tr);
            }

    for (let i=0; i<years; i++) {
        fetch(`https://mlb-data.p.rapidapi.com/json/named.sport_pitching_tm.bam?season='${season}'&player_id='${id}'&league_list_id='mlb'&game_type='R'`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
            "x-rapidapi-host": "mlb-data.p.rapidapi.com"
        }
        })
            .then(response => response.json())
            .then(data => {
                if (data.sport_pitching_tm.queryResults.totalSize !== '0') {//checking if the specified season exists
                    //retrieving data from JSON document
                    const table = document.querySelector('#table');
                    const season = data.sport_pitching_tm.queryResults.row.season;
                    const team = data.sport_pitching_tm.queryResults.row.team_abbrev;
                    const era = data.sport_pitching_tm.queryResults.row.era;
                    const ip = data.sport_pitching_tm.queryResults.row.ip;
                    const so = data.sport_pitching_tm.queryResults.row.so;
                    const h = data.sport_pitching_tm.queryResults.row.h;
                    const bb = data.sport_pitching_tm.queryResults.row.bb;
                    const avg = data.sport_pitching_tm.queryResults.row.avg;
                    const whip = data.sport_pitching_tm.queryResults.row.whip;

                        //inserting data into the table
                    if (season !== undefined) {
                        const r = i+1;
                        table.rows[r].cells[0].innerText = season;
                        table.rows[r].cells[1].innerText = team;
                        table.rows[r].cells[2].innerText = era;
                        table.rows[r].cells[3].innerText = ip;
                        table.rows[r].cells[4].innerText = so;   
                        table.rows[r].cells[5].innerText = h;
                        table.rows[r].cells[6].innerText = bb;
                        table.rows[r].cells[7].innerText = avg;
                        table.rows[r].cells[8].innerText = whip;
                    } else {
                        const r = i+1;
                        table.rows[r].cells[0].innerText = 2020 - i;
                        table.rows[r].cells[1].innerText = 'N/A';
                        table.rows[r].cells[2].innerText = 'N/A';
                        table.rows[r].cells[3].innerText = 'N/A';
                        table.rows[r].cells[4].innerText = 'N/A';   
                        table.rows[r].cells[5].innerText = 'N/A';
                        table.rows[r].cells[6].innerText = 'N/A';
                        table.rows[r].cells[7].innerText = 'N/A';
                        table.rows[r].cells[8].innerText = 'N/A';
                    }

                }
                else {
                    const r = i+1;
                    table.rows[r].cells[0].innerText = 2020 - i;
                    table.rows[r].cells[1].innerText = 'N/A';
                    table.rows[r].cells[2].innerText = 'N/A';
                    table.rows[r].cells[3].innerText = 'N/A';
                    table.rows[r].cells[4].innerText = 'N/A';   
                    table.rows[r].cells[5].innerText = 'N/A';
                    table.rows[r].cells[6].innerText = 'N/A';
                    table.rows[r].cells[7].innerText = 'N/A';
                    table.rows[r].cells[8].innerText = 'N/A';
                }
                
            })
            .catch(err => {
                console.error(err);
            });
            season--;
        }
}

function careerStats(id, years) {
    fetch(`https://mlb-data.p.rapidapi.com/json/named.sport_career_hitting.bam?player_id='${id}'&game_type='R'&league_list_id='mlb'`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
		"x-rapidapi-host": "mlb-data.p.rapidapi.com"
	}
    })
        .then(response => response.json())
        .then(data => {
            const tr = document.createElement('tr');
            for ( let x=0; x<9; x++) {
                const td = document.createElement('td');
                tr.append(td);
            }
            const table = document.querySelector('#table');
            table.append(tr);

            const ab = data.sport_career_hitting.queryResults.row.ab;
            const avg = data.sport_career_hitting.queryResults.row.avg;
            const h = data.sport_career_hitting.queryResults.row.h;
            const hr = data.sport_career_hitting.queryResults.row.hr;
            const bb = data.sport_career_hitting.queryResults.row.bb;
            const hbp = data.sport_career_hitting.queryResults.row.hbp;
            const slg = data.sport_career_hitting.queryResults.row.slg;

            const r = years + 1;
            table.rows[r].cells[0].innerText = 'Career';
            table.rows[r].cells[2].innerText = ab;
            table.rows[r].cells[3].innerText = h;
            table.rows[r].cells[4].innerText = hr;   
            table.rows[r].cells[5].innerText = bb;
            table.rows[r].cells[6].innerText = hbp;
            table.rows[r].cells[7].innerText = avg;
            table.rows[r].cells[8].innerText = slg;
        })
        .catch(err => {
            console.error(err);
        });
}

function careerStatsPitching(id, years) {
    fetch(`https://mlb-data.p.rapidapi.com/json/named.sport_career_pitching.bam?player_id='${id}'&league_list_id='mlb'&game_type='R'`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "c90b245b31msh46b59787848177ap15892cjsne103b05ba7a8",
		"x-rapidapi-host": "mlb-data.p.rapidapi.com"
	}
    })
        .then(response => response.json())
        .then(data => {
            const tr = document.createElement('tr');
            for ( let x=0; x<9; x++) {
                const td = document.createElement('td');
                tr.append(td);
            }
            const table = document.querySelector('#table');
            table.append(tr);

            const era = data.sport_career_pitching.queryResults.row.era;
            const ip = data.sport_career_pitching.queryResults.row.ip;
            const so = data.sport_career_pitching.queryResults.row.so;
            const h = data.sport_career_pitching.queryResults.row.h;
            const bb = data.sport_career_pitching.queryResults.row.bb;
            const avg = data.sport_career_pitching.queryResults.row.avg;
            const whip = data.sport_career_pitching.queryResults.row.whip;

            const r = years + 1;
            table.rows[r].cells[0].innerText = 'Career';
            table.rows[r].cells[2].innerText = era;
            table.rows[r].cells[3].innerText = ip;
            table.rows[r].cells[4].innerText = so;   
            table.rows[r].cells[5].innerText = h;
            table.rows[r].cells[6].innerText = bb;
            table.rows[r].cells[7].innerText = avg;
            table.rows[r].cells[8].innerText = whip;
        })
        .catch(err => {
            console.error(err);
        });
}