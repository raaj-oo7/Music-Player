let now_playing = document.querySelector('.now-playing');
const previousButtons = document.querySelectorAll("#prev"),
    nextButtons = document.querySelectorAll("#next");
const musicArtist = document.querySelector(".song-details .artist"),
    musicName = document.querySelector(".song-details .name");
const musicImg = document.querySelector(".img-area img"),
    playPauseBtn = document.querySelector(".play-pause"),
    mainAudio = document.querySelector("#main-audio"),
    progressArea = document.querySelector(".progress-area"),
    progressBar = document.querySelector(".progress-bar");

let recent_volume = document.querySelector('#volume');
let volume_show = document.querySelector('#volume_show');
let wave = document.getElementById('wave');

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingSong();
});

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `Assets/images/${allMusic[indexNumb - 1].src}.jpg`;
    mainAudio.src = `Assets/songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// play music function
function playMusic() {
    playPauseBtn.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
    wave.classList.add('loader');
    musicImg.classList.add('rotate');
}

//pause music function
function pauseMusic() {
    playPauseBtn.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
    wave.classList.remove('loader');
    musicImg.classList.remove('rotate');
}

//prev music function
function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//next music function
function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// play or pause button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = playPauseBtn.classList.contains("paused");
    isMusicPlay ? pauseMusic() : playMusic();
    playingSong();
});


// previous button
previousButtons.forEach(button => {
    button.addEventListener("click", () => {
        prevMusic();
    });
});

// next button
nextButtons.forEach(button => {
    button.addEventListener("click", () => {
        nextMusic();
    });
});

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = document.querySelector(".current-time"),
        musicDuration = document.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", () => {
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song currentTime on according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
    playingSong();
});

//change loop, shuffle, repeat icon onclick
const repeatBtn = document.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

//code for what to do after song ended
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex);
            musicIndex = randomIndex;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
});

const ulTag = document.querySelector(".music-list");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}" class="${allMusic[i].isFavorite ? 'favorite' : ''}"> <!-- Add class if it's a favorite -->
                    <div class="row">
                        <img src="./Assets/images/${allMusic[i].src}.jpg" alt="${allMusic[i].name}" class="album-img">
                        <div class="song-info">
                            <span>${allMusic[i].name}</span>
                            <p>${allMusic[i].artist}</p>
                            <button class="favorite-btn">${allMusic[i].isFavorite ? 'Remove from Favorite' : 'Add to Favorite'}</button> <!-- Change text based on favorite status -->
                        </div>
                    </div>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                    <audio class="${allMusic[i].src}" src="./Assets/songs/${allMusic[i].src}.mp3"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", () => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
        liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

function playingSong() {
    const allLiTag = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration");

        if (allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        if (allLiTag[j].getAttribute("li-index") == musicIndex) {
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }

        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

function mute_sound() {
    mainAudio.volume = 0;
    volume.value = 0;
    volume_show.innerHTML = 0;
}

function volume_change() {
    volume_show.innerHTML = recent_volume.value;
    mainAudio.volume = recent_volume.value / 100;
}


// Function to handle adding/removing songs from favorites
function toggleFavorite(element) {
    const liElement = element.closest("li");
    const isFavorite = liElement.classList.contains("favorite");

    if (isFavorite) {
        // Remove from favorites
        liElement.classList.remove("favorite");
        element.innerText = "Add to Favorite";
        ulTag.appendChild(liElement);
    } else {
        // Add to favorites
        liElement.classList.add("favorite");
        element.innerText = "Remove from Favorite";
        ulTag.prepend(liElement);
    }
}

const favoriteButtons = document.querySelectorAll(".favorite-btn");
favoriteButtons.forEach(button => {
    button.addEventListener("click", () => {
        toggleFavorite(button);
    });
});
