const now_playing = document.querySelector('.now-playing');
const previousButtons = document.querySelectorAll("#prev");
const nextButtons = document.querySelectorAll("#next");
const musicArtist = document.querySelector(".song-details .artist");
const musicName = document.querySelector(".song-details .name");
const musicImg = document.querySelector(".img-area img");
const playPauseBtn = document.querySelector(".play-pause");
const mainAudio = document.querySelector("#main-audio");
const progressArea = document.querySelector(".progress-area");
const progressBar = document.querySelector(".progress-bar");
const recent_volume = document.querySelector('#volume');
const volume_show = document.querySelector('#volume_show');
const wave = document.getElementById('wave');
const repeatBtn = document.querySelector("#repeat-plist");
const ulTag = document.querySelector(".music-list");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;
let favoriteSongs = {};

window.addEventListener("load", () => {
    loadPlayerState();
    loadMusic(musicIndex);
    playingSong();
    loadFavoriteSongs();
    displayFavoriteSongs();
});

window.addEventListener("beforeunload", () => {
    savePlayerState();
});

// Load music player state 
function loadPlayerState() {
    const playerState = JSON.parse(localStorage.getItem("playerState"));
    if (playerState) {
        musicIndex = playerState.musicIndex;
        isMusicPaused = playerState.isMusicPaused;
        mainAudio.currentTime = playerState.currentTime;
        mainAudio.volume = playerState.volume;
        recent_volume.value = playerState.volume * 100;
        volume_show.innerHTML = recent_volume.value;

        // Load favorite status
        const favoriteIndexes = JSON.parse(localStorage.getItem("favoriteIndexes"));
        if (favoriteIndexes) {
            const allLiTag = ulTag.querySelectorAll("li");
            allLiTag.forEach((li, index) => {
                if (favoriteIndexes.includes(index + 1)) {
                    li.classList.add("favorite");
                    const favoriteBtn = li.querySelector(".favorite-btn");
                    favoriteBtn.innerText = "Remove from Favorite";
                    const starIcon = li.querySelector(".star-icon");
                    starIcon.style.display = "block";
                    ulTag.prepend(li);
                }
            });
        }
    }
}

// Save player state function
function savePlayerState() {
    const playerState = {
        musicIndex: musicIndex,
        isMusicPaused: isMusicPaused,
        currentTime: mainAudio.currentTime,
        volume: mainAudio.volume,
    };
    localStorage.setItem("playerState", JSON.stringify(playerState));
}

// Load favorite songs from localStorage
function loadFavoriteSongs() {
    const storedFavoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs"));
    if (storedFavoriteSongs) {
        favoriteSongs = storedFavoriteSongs;
    }
}

// Display favorite songs
function displayFavoriteSongs() {
    const allLiTag = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLiTag.length; j++) {
        const songId = allLiTag[j].getAttribute("li-index");

        if (favoriteSongs[songId]) {
            allLiTag[j].classList.add("favorite");
            const favoriteBtn = allLiTag[j].querySelector(".favorite-btn");
            favoriteBtn.innerText = "Remove from Favorite";
            const starIcon = allLiTag[j].querySelector(".star-icon");
            starIcon.style.display = "block";
            ulTag.prepend(allLiTag[j]);
        }
    }
}

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `asset/images/${allMusic[indexNumb - 1].src}.jpg`;
    mainAudio.src = `asset/songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// play music function
function playMusic() {
    playPauseBtn.classList.add("paused");
    playPauseBtn.querySelector("span").innerText = "pause";
    mainAudio.play();
    wave.classList.add('loader');
}

//pause music function
function pauseMusic() {
    playPauseBtn.classList.remove("paused");
    playPauseBtn.querySelector("span").innerText = "play_arrow";
    mainAudio.pause();
    wave.classList.remove('loader');
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
            } while (musicIndex == randomIndex);
            musicIndex = randomIndex;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
});

function playListSongs() {
    for (let i = 0; i < allMusic.length; i++) {
        let liTag = `<li li-index="${i + 1}" class="${allMusic[i].isFavorite ? 'favorite' : ''}"> 
                        <div class="row">
                            <div class="image-favorite-icon">
                                <img src="./asset/images/${allMusic[i].src}.jpg" alt="${allMusic[i].name}" class="album-img">
                                <div class="star-icon">
                                  <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill="#ffd700" stroke="#ffd700">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="#FFd700394240" d="M31.998,2.478c0.279,0,0.463,0.509,0.463,0.509l8.806,18.759l20.729,3.167l-14.999,15.38l3.541,21.701 l-18.54-10.254l-18.54,10.254l3.541-21.701L2,24.912l20.729-3.167l8.798-18.743C31.527,3.002,31.719,2.478,31.998,2.478 M31.998,0 c-0.775,0-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343 c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957 c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719 c0.302,0.166,0.636,0.25,0.968,0.25c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704 l14.294-14.657c0.523-0.537,0.703-1.321,0.465-2.031c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15 C33.479,0.448,32.773,0,31.998,0L31.998,0z"></path> <path fill="#FFd700" d="M31.998,2.478c0.279,0,0.463,0.509,0.463,0.509l8.806,18.759l20.729,3.167l-14.999,15.38l3.541,21.701 l-18.54-10.254l-18.54,10.254l3.541-21.701L2,24.912l20.729-3.167l8.798-18.743C31.527,3.002,31.719,2.478,31.998,2.478"></path> </g> </g>
                                  </svg>
                                </div>
                            </div>  
                            <div class="song-info">
                                <span>${allMusic[i].name}</span>
                                <p>${allMusic[i].artist}</p>
                                <button class="favorite-btn">${allMusic[i].isFavorite ? 'Remove from Favorite' : 'Add to Favorite'}</button>
                            </div>
                            <audio class="${allMusic[i].src}" src="./asset/songs/${allMusic[i].src}.mp3"></audio>
                        </div>
                    </li>`;
        ulTag.insertAdjacentHTML("beforeend", liTag);

        let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
        liAudioTag.addEventListener("loadeddata", () => {
            let duration = liAudioTag.duration;
            let totalSec = Math.floor(duration % 60);
            if (totalSec < 10) {
                totalSec = `0${totalSec}`;
            }
        });
    }
}
playListSongs()

function playingSong() {
    const allLiTag = ulTag.querySelectorAll("li");

    for (let j = 0; j < allLiTag.length; j++) {

        if (allLiTag[j].getAttribute("li-index") == musicIndex) {
            allLiTag[j].classList.add("playing");

            // Update Now Playing section
            const nowPlayingName = document.querySelector('.now-playing .song_name');
            const nowPlayingImage = document.querySelector('.now-playing-image img');

            nowPlayingName.innerText = allMusic[musicIndex - 1].name;
            nowPlayingImage.src = `asset/images/${allMusic[musicIndex - 1].src}.jpg`;
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
    savePlayerState();
}

// Function to handle adding/removing songs from favorites
function toggleFavorite(element) {
    event.stopPropagation();
    const liElement = element.closest("li");
    const starIcon = liElement.querySelector(".star-icon");
    const songId = liElement.getAttribute("li-index");

    if (favoriteSongs[songId]) {
        // Remove from favorites
        delete favoriteSongs[songId];
        element.innerText = "Add to Favorite";
        ulTag.appendChild(liElement);
        starIcon.style.display = "none";
    } else {
        // Add to favorites
        favoriteSongs[songId] = true;
        element.innerText = "Remove from Favorite";
        ulTag.prepend(liElement);
        starIcon.style.display = "block";
    }

    // Sort music list by favorite status and then by musicIndex
    const allLiTag = Array.from(ulTag.querySelectorAll("li"));
    allLiTag.sort((a, b) => {
        const indexA = parseInt(a.getAttribute("li-index"));
        const indexB = parseInt(b.getAttribute("li-index"));
        const favoriteA = favoriteSongs[a.getAttribute("li-index")] ? 1 : 0;
        const favoriteB = favoriteSongs[b.getAttribute("li-index")] ? 1 : 0;

        if (favoriteA !== favoriteB) {
            return favoriteB - favoriteA;
        } else {
            return indexA - indexB;
        }
    });

    ulTag.innerHTML = "";
    allLiTag.forEach(li => ulTag.appendChild(li));

    // Update local storage and display favorite songs
    localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongs));
}

function addToFavorites() {
    const currentLi = document.querySelector(`li[li-index="${musicIndex}"]`);
    const favoriteButton = currentLi.querySelector(".favorite-btn");
    toggleFavorite(favoriteButton);

    // change text of list for add and remove from favorite
    if (isFavorite) {
        favoriteButton.innerText = "Add to Favorite";
    } else {
        favoriteButton.innerText = "Remove from Favorite";
    }
}

const favoriteButtons = document.querySelectorAll(".favorite-btn");
favoriteButtons.forEach(button => {
    button.addEventListener("click", () => {
        toggleFavorite(button);
    });
});

function toggleOptions() {
    var optionsBox = document.getElementById('options-box');
    if (optionsBox.style.display === 'none') {
        optionsBox.style.display = 'flex';
    } else {
        optionsBox.style.display = 'none';
    }
}

// Close options box if clicked outside
document.addEventListener('click', function (event) {
    var optionsBox = document.getElementById('options-box');
    var optionsIcon = document.getElementById('options');
    if (!optionsBox.contains(event.target) && event.target !== optionsIcon) {
        optionsBox.style.display = 'none';
    }
});