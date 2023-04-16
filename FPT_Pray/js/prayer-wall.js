var expandStatus = "closing";
var templeStatus = "closing";
function expand() {
    var arrow = document.getElementById('expand-arrow');
    var content = document.getElementById('pray-content');
    var wall = document.getElementById('prayer-wall');
    if (expandStatus == "opening") {
        expandStatus = "closing";
        arrow.style.transform = "rotate(0deg)";
        wall.style.width = "0px"
        content.style.opacity = 0;
    } else {
        expandStatus = "opening";
        arrow.style.transform = "rotate(180deg)";
        wall.style.width = "50%"
        content.style.opacity = 1;
    }

}

function openingTemple() {
    var closingDiv = document.getElementById('closing-temple-box');
    var button = document.getElementById('wish-button');
    var area = document.getElementById('expand-area');
    if (templeStatus == "opening") {
        templeStatus = "closing";
        closingDiv.style.height = '0px';
        button.innerHTML = 'Cầu Nguyện';
        area.style.left = '-100px';

    } else {
        templeStatus = "opening";
        closingDiv.style.height = '380px';
        button.innerHTML = 'Đóng';
        area.style.left = '0';
    }
}

function wish() {
    var nickname = document.getElementById('nickname');
    var wishes = document.getElementById('wishes');

    if (wishes.value != "" && wishes.value != null) {

        changeTrack();
        nickname.style.animation = 'Color 4s linear infinite';
        wishes.style.animation = 'Color 4s linear infinite';
        const pot = document.getElementById('pot');
        const span = document.createElement('span');
        const img = document.createElement('img');
        img.src = 'images/incense.png';
        const rotation = (Math.random() * 8) - 4;
        img.style.transform = `rotate(${rotation}deg)`;
        img.classList.add('incense');
        span.appendChild(img);
        for (let i = 0; i < 3; i++) {
            const div = document.createElement('div');
            div.classList.add('smoke');
            const delay = Math.floor(Math.random() * 1000) + 2000;
            div.style.animationDelay = `${delay}ms`;
            span.appendChild(div);
        }
        pot.appendChild(span)
    }
}

var audioIndex = 0;
var audioFiles = ["audio/level1.mp3", "audio/level1.mp3", "audio/level1.mp3", "audio/level1.mp3", "audio/level1.mp3",
    "audio/level2.mp3", "audio/level3.mp3", "audio/level4.mp3", "audio/level5.mp3",
    "audio/level6.mp3", "audio/level7.mp3", "audio/level8.mp3"];

function changeTrack() {
    
    if (audioIndex < audioFiles.length) {
        var audio = document.getElementById("myAudio");
        var source = document.getElementById("audioSource");
        source.src = audioFiles[audioIndex];
        audio.load();
        audio.play();
        if (audioIndex == 0) {
            savePrayer();
        }
        audioIndex++;
    }
    if (audioIndex == audioFiles.length) {
        var fog = document.getElementById('fog');
        fog.style.display = 'block';
    }
}


function loadCard() {
    fetch('data/data.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const prayContent = document.getElementById('pray-content');
            const prayers = [];

            lines.forEach(line => {
                const parts = line.split(';');
                if (parts.length >= 2) {
                    const [name, ...descriptionParts] = parts;
                    const description = descriptionParts.join(';');
                    prayers.push({
                        name: name.trim(),
                        description: description.trim()
                    });
                }
            });

            if (prayers.length > 4) {
                const randomPrayers = getRandomItems(prayers, 4);
                randomPrayers.forEach(prayer => {
                    const prayCard = createPrayCard(prayer);
                    prayContent.appendChild(prayCard);
                });
            } else {
                prayers.forEach(prayer => {
                    const prayCard = createPrayCard(prayer);
                    prayContent.appendChild(prayCard);
                });
            }
        })
        .catch(error => console.error(error));

}

function getRandomItems(array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function createPrayCard(prayer) {
    const prayCard = document.createElement('div');
    prayCard.classList.add('pray-card');

    const descriptionElem = document.createElement('p');
    descriptionElem.textContent = prayer.description;
    const nameElem = document.createElement('h3');
    nameElem.textContent = prayer.name;
    prayCard.appendChild(descriptionElem);
    prayCard.appendChild(nameElem);
    return prayCard;
}

function savePrayer() {
    const nameInput = document.getElementById('nickname');
    const descriptionInput = document.getElementById('wishes');
    const name = nameInput.value.trim() || 'anonymous';
    const description = descriptionInput.value.trim();

    if (!description || description.length < 4) {
        return;
    }

    const prayer = `${name};${description}\n`;

    fetch('data/data.txt', {
        method: 'POST',
        body: prayer,
        headers: {
            'Content-Type': 'text/plain'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save prayer.');
            }
        })
        .catch(error => {
            console.error(error);
        });
}
