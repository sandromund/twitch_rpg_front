const apiUrl = 'http://2.59.133.105:5000/rpg/api/136906771/characters';

function fetchCharacterData() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const dataDiv = document.getElementById('data');
            dataDiv.innerHTML = '';  // Clear previous content
            data.sort((a, b) => b.threat - a.threat);  // Sort characters by threat (highest first)

            data.forEach(character => {
                const hpPercentage = (character.hp / character.hp_max) * 100;
                const threatPercentage = character.threat;

                const characterDiv = document.createElement('div');
                characterDiv.classList.add('character');

                characterDiv.innerHTML = `
                    <div class="attack-info">
                        <span>${character.displayname}</span>
                        <span></span>
                        <span class="attack-icon">⚔️</span>
                        <span>${character.atk}</span>
                    </div>
                    <div class="stat">
                        <div class="bar-container">
                            <div class="bar" style="width: ${hpPercentage}%; display: flex; justify-content: flex-start; align-items: center; padding: 0 5px;">
                                <span>HP</span>
                                <span style="margin-left: auto;">${character.hp} / ${character.hp_max}</span>
                            </div>
                        </div>
                    </div>
                    <div class="stat">
                        <div class="bar-container">
                            <div class="bar threat-bar" style="width: ${threatPercentage}%; display: flex; justify-content: space-between; padding: 0 5px;">
                                <span>Threat</span>
                                <span></span> <!-- Empty span to keep text on the right -->
                                <span>${character.threat}</span>
                            </div>
                        </div>
                    </div>
                    <div class="stat">
                        <label>Total Damage:</label>
                        <span>${character.total_dmg}</span>
                    </div>
                `;

                dataDiv.appendChild(characterDiv);
            });
        })
        .catch(error => {
            document.getElementById('data').textContent = 'Error fetching data: ' + error.message;
        });
}

fetchCharacterData();  // Fetch on page load
