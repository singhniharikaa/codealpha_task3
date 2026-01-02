const musicContainer = document.querySelector(".player-container");
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const audio = document.querySelector("#audio");
const progress = document.querySelector("#progress");
const progressContainer = document.querySelector("#progress-container");
const title = document.querySelector("#title");
const artist = document.querySelector("#artist");
const cover = document.querySelector("#cover");
const currTime = document.querySelector("#curr-time");
const durTime = document.querySelector("#dur-time");
const seekSlider = document.querySelector("#seek-slider");
const volumeSlider = document.querySelector("#volume-slider");
const favBtn = document.querySelector("#fav-btn");

// Playlist
const playlistPanel = document.querySelector('#playlist-panel');
const playlistItems = document.querySelector('#playlist-items');

// Song titles and data (Using copyright-free music samples)
const songs = [
  {
    name: 'ukulele',
    displayName: 'Ukulele',
    artist: 'Benjamin Tissot',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    path: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3'
  },
  {
    name: 'hey',
    displayName: 'Hey',
    artist: 'Benjamin Tissot',
    cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', // This one might be okay, but let's assume it was the broken one or just update
    path: 'https://www.bensound.com/bensound-music/bensound-hey.mp3'
  },
  {
    name: 'summer',
    displayName: 'Summer',
    artist: 'Benjamin Tissot',
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    path: 'https://www.bensound.com/bensound-music/bensound-summer.mp3'
  },
  {
    name: 'energy',
    displayName: 'Energy',
    artist: 'Benjamin Tissot',
    cover: 'https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    path: 'https://www.bensound.com/bensound-music/bensound-energy.mp3'
  },
  {
    name: 'jazz',
    displayName: 'Jazz',
    artist: 'Benjamin Tissot',
    cover: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    path: 'https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3'
  },
  {
    name: 'epic',
    displayName: 'Epic',
    artist: 'Benjamin Tissot',
    cover: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    path: 'https://www.bensound.com/bensound-music/bensound-epic.mp3'
  },
  {
    name: 'memories',
    displayName: 'Memories',
    artist: 'Benjamin Tissot',
    cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    path: 'https://www.bensound.com/bensound-music/bensound-memories.mp3'
  }
];

// Keep track of song
let songIndex = 0;
// Favorites array
let favorites = JSON.parse(localStorage.getItem('musicFavorites')) || [];

// Initially load song details into DOM
loadSong(songs[songIndex]);
renderPlaylist();
updateFavoriteBtn();

// Load song details
function loadSong(song) {
  title.innerText = song.displayName;
  artist.innerText = song.artist;
  audio.src = song.path;
  cover.src = song.cover;
  
  updateFavoriteBtn();

  // Highlight in playlist
  const allItems = document.querySelectorAll("#playlist-items li");
  allItems.forEach((item, index) => {
    if (index === songIndex) {
      item.classList.add("active-song");
    } else {
      item.classList.remove("active-song");
    }
  });
}

// Play song
function playSong() {
  musicContainer.classList.add("play");
  playBtn.querySelector("i.fas").classList.remove("fa-play");
  playBtn.querySelector("i.fas").classList.add("fa-pause");

  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove("play");
  playBtn.querySelector("i.fas").classList.add("fa-play");
  playBtn.querySelector("i.fas").classList.remove("fa-pause");

  audio.pause();
}

// Previous song
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]);
  playSong();
}

// Next song
function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);
  playSong();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  seekSlider.value = progressPercent || 0;

  // Calculate display time
  updateTimeDisplay(currentTime, duration);
}

function updateTimeDisplay(current, duration) {
  // Current Time
  const currentMinutes = Math.floor(current / 60);
  const currentSeconds = Math.floor(current % 60);
  currTime.innerText = `${currentMinutes}:${
    currentSeconds < 10 ? "0" + currentSeconds : currentSeconds
  }`;

  // Duration Time
  if (duration) {
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);
    durTime.innerText = `${durationMinutes}:${
      durationSeconds < 10 ? "0" + durationSeconds : durationSeconds
    }`;
  }
}

// Set video progress via slider
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

function setSeek(e) {
  const seekTo = audio.duration * (seekSlider.value / 100);
  audio.currentTime = seekTo;
}

// Set Volume
function setVolume(e) {
  audio.volume = e.target.value;
}

// Playlist Rendering
function renderPlaylist() {
  playlistItems.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <span>${song.displayName} - <small>${song.artist}</small></span>
            <span>
                ${favorites.includes(song.name) ? '<i class="fas fa-heart" style="color: var(--accent-color); font-size: 0.8rem; margin-right: 5px;"></i>' : ''}
                ${index === songIndex ? '<i class="fas fa-music"></i>' : ''}
            </span>
        `;
    li.addEventListener("click", () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    });
    playlistItems.appendChild(li);
  });
}

// Event Listeners
playBtn.addEventListener("click", () => {
  const isPlaying = musicContainer.classList.contains("play");

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Change song
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// Time/Song update
audio.addEventListener("timeupdate", updateProgress);

// Click on progress bar
progressContainer.addEventListener("click", setProgress);
seekSlider.addEventListener("input", setSeek);

// Song ends
audio.addEventListener("ended", nextSong);

// Volume
volumeSlider.addEventListener('input', setVolume);

// Favorite Button
favBtn.addEventListener('click', toggleFavorite);

function toggleFavorite() {
    const songName = songs[songIndex].name;
    
    if (favorites.includes(songName)) {
        favorites = favorites.filter(fav => fav !== songName);
        favBtn.classList.remove('active');
        favBtn.classList.remove('fas');
        favBtn.classList.add('far');
    } else {
        favorites.push(songName);
        favBtn.classList.add('active');
        favBtn.classList.add('fas');
        favBtn.classList.remove('far');
    }
    
    localStorage.setItem('musicFavorites', JSON.stringify(favorites));
    renderPlaylist(); // Re-render to show heart icons
}

function updateFavoriteBtn() {
    const songName = songs[songIndex].name;
    if (favorites.includes(songName)) {
        favBtn.classList.add('active');
        favBtn.classList.add('fas');
        favBtn.classList.remove('far');
    } else {
        favBtn.classList.remove('active');
        favBtn.classList.remove('fas');
        favBtn.classList.add('far');
    }
}
