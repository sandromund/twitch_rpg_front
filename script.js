document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://2.59.133.105:5000/rpg/api/136906771/characters';
    const fullUrl = apiUrl;

    const characterTableBody = document.getElementById('character-tbody');
    const errorMessage = document.getElementById('error-message');

    function fetchCharacterData() {
        fetch(fullUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    errorMessage.textContent = 'No character data found.';
                    errorMessage.classList.remove('hidden');
                    return;
                }

                data.forEach(character => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${character.id}</td>
                        <td>${character.displayname}</td>
                        <td>${character.hp}</td>
                        <td>${character.hp_max}</td>
                        <td>${character.atk}</td>
                        <td>${character.threat}</td>
                        <td>${character.total_dmg}</td>
                        <td>${new Date(character.cooldown).toLocaleString()}</td>
                    `;
                    characterTableBody.appendChild(row);
                });
            })
            .catch(error => {
                errorMessage.textContent = 'Failed to fetch data: ' + error.message;
                errorMessage.classList.remove('hidden');
            });
    }

    fetchCharacterData();
});
