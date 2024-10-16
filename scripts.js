const apiUrlCharacters = 'http://2.59.133.105:5000/rpg/api/136906771/characters';
const apiUrlMonsters = 'http://2.59.133.105:5000/rpg/api/136906771/monsters';
const applyUpdateFilter = true; // Filter characters whose 'updated_at' is within the last 1 minute
const defaultPicture = "https://static.wikia.nocookie.net/camp-halfblood-fanon/images/c/ca/Unknown.jpeg/revision/latest/thumbnail/width/360/height/450?cb=20200614091044";

function fetchCharacterData() {
    fetch(apiUrlCharacters)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const dataDiv = document.getElementById('data');
            dataDiv.innerHTML = '';  // Clear previous content

            let filteredData = data;
            if (applyUpdateFilter) {
                const now = new Date();
                const oneMinuteAgo = new Date((now.getTime() - 60 * 1000) - 60 * 1000 * 60 * 2);
                console.log("Current time (UTC):", now.toISOString());
                console.log("One minute ago (UTC):", oneMinuteAgo.toISOString());

                filteredData = data.filter(character => {
                    const updatedAt = new Date(character.updated_at);
                    console.log(`Character: ${character.displayname}, updated_at (UTC):`, updatedAt.toISOString());
                    return updatedAt >= oneMinuteAgo;
                });
            }

            let playerThreadSum = 0;
            for (let player of filteredData) {
                playerThreadSum += Number(player.threat);
            }

            filteredData.sort((a, b) => b.threat - a.threat);  // Sort characters by threat (highest first)
            filteredData.forEach(character => {
                const hpPercentage = (character.hp / character.hp_max) * 100;
                const threatPercentage = (character.threat / playerThreadSum) * 100;

                const characterDiv = document.createElement('div');
                characterDiv.classList.add('character');

                // Add default pic, if pic is missing
                let characterPicture = character.picture;
                if (characterPicture.length < 1) {
                    characterPicture = defaultPicture;
                }

                characterDiv.innerHTML = `
                <div class="character-container">
                    <div class="character-info">
                        <div class="attack-info">
                            <span>${character.displayname}</span>
                            <span></span>

                        </div>
                        <div class="stat">
                            <div class="bar-container">
                                <div class="bar" style="width: ${hpPercentage}%; display: flex; justify-content: flex-start; align-items: center; padding: 0 5px;">
                                    <span> HP:  ${character.hp}</span>
                                </div>
                            </div>
                        </div>
                        <div class="stat">
                            <div class="bar-container">
                                <div class="bar threat-bar" style="width: ${threatPercentage}%; display: flex; justify-content: space-between; padding: 0 5px;">
                                    <span>TR:  ${character.threat}</span>
                                </div>
                            </div>
                        </div>
                        <div class="stat">
                            <span class="attack-icon">❤️</span>
                            <span>${character.hp_max}</span>
                            <span class="attack-icon">⚔️</span>
                            <span>${character.atk}</span>
                            <span class="attack-icon">🔪</span>
                            <span> ${character.total_dmg}</span>
                        </div>
                    </div>
                    <div class="character-image">
                        <img src="${characterPicture}" alt="${character.displayname}" />
                    </div>
                </div>
            `;
                dataDiv.appendChild(characterDiv);
            });
        })
        .catch(error => {
            document.getElementById('data').textContent = 'Error fetching data: ' + error.message;
        });
}

function fetchMonsterData() {
    fetch(apiUrlMonsters)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const dataDiv = document.getElementById('monster-data');
            dataDiv.innerHTML = '';  // Clear previous content

            data.forEach(monster => {
                const monsterDetails = document.createElement('div');
                monsterDetails.classList.add('monster-details');
                monsterDetails.innerHTML = `
                    <div id="monster-data">
                        <div class="monster">
                            <div class="monster-image">
                                <img src=${monster.picture} alt="Monster Image">
                            </div>
                            <div class="monster-details">
                                <h3>Dark Dupomat</h3>
                                <div class="stats-row">
                                    <div class="stat">
                                        <label>HP:</label>
                                        <span id="monster-hp">${monster.hp}</span> / <span id="monster-hp-max">10000</span>
                                        <div class="bar-container">
                                            <div class="bar" style="width: 94.25%;">94%</div> <!-- Example for HP -->
                                        </div>
                                    </div>
                                    <div class="stat">
                                        <label>Attack:</label>
                                        <span>${monster.atk}</span>
                                    </div>
                                    <div class="stat">
                                        <label>Counter Attacks:</label>
                                        <span>${monster.counter_attacks}</span>
                                    </div>
                                </div>
                                <div class="attack-info">
                                    <span class="attack-icon">⚔️</span>
                                    <span>Damage Cap: ${monster.dmg_cap}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                `;
                dataDiv.appendChild(monsterDetails);
            });
        })
        .catch(error => console.error('Error fetching monster data:', error));
}



