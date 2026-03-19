// ELEMENTS
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const playlist = document.getElementById("playlist");
const favoritesList = document.getElementById("favorites");
const historyList = document.getElementById("history");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const favBtn = document.getElementById("fav");

// SONG DATA
const songs = [
  {
    title: "Amanxeba",
    artist: "Sami Kay, Rox Roberson & Misokuhle",
    src: "assets/songs/Sami Kay, Rox Roberson & Misokuhle - Amanxeba (Official Audio) - Awakened Regal.mp3",
    cover: "assets/covers/Sami Kay, Rox Roberson & Misokuhle - Amanxeba (Official Audio) - Awakened Regal.jpg"
  },
  {
    title: "Vele Yena",
    artist: "Skyla Tylaa, Elaine, JAZZWRLD, Thukuthela, Solaariss",
    src: "assets/songs/Skyla Tylaa, Elaine, JAZZWRLD, Thukuthela, Solaariss - Vele Uyena (Risk It All) (Official Audio) - SkylaTylaaVEVO.mp3",
    cover: "assets/covers/Skyla Tylaa, Elaine, JAZZWRLD, Thukuthela, Solaariss - Vele Uyena (Risk It All) (Official Audio) - SkylaTylaaVEVO.jpg"
  },
  {
    title: "Song Three",
    artist: "Unknown Artist",
    src: "assets/songs/song3.mp3",
    cover: "assets/covers/cover3.jpg"
  }
];

// STATE
let songIndex = 0;
let isShuffle = false;
let isRepeat = false;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

// BUTTON STATE
function updatePlayButton() {
  playBtn.textContent = audio.paused ? "▶" : "⏸";
}

// LOAD SONG (with fade effect)
function loadSong(song) {
  cover.classList.add("fade");

  setTimeout(() => {
    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;
    cover.src = song.cover;
    cover.classList.remove("fade");
  }, 200);

  highlightPlaylist();
}

// PLAY / PAUSE
function playSong() {
  audio.play();
  addToHistory(songs[songIndex]);
}

function pauseSong() {
  audio.pause();
}

// NEXT / PREV
function nextSong() {
  songIndex = isShuffle ? Math.floor(Math.random() * songs.length) : (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

// PLAYLIST UI
songs.forEach((song, index) => {
  const li = document.createElement("li");
  li.textContent = `${song.title} - ${song.artist}`;
  li.addEventListener("click", () => {
    songIndex = index;
    loadSong(songs[songIndex]);
    playSong();
  });
  playlist.appendChild(li);
});

// HIGHLIGHT ACTIVE SONG
function highlightPlaylist() {
  [...playlist.children].forEach((li, index) => {
    li.classList.toggle("active", index === songIndex);
  });
}

// EVENTS
playBtn.addEventListener("click", () => audio.paused ? playSong() : pauseSong());
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
});

audio.addEventListener("ended", () => isRepeat ? playSong() : nextSong());

// SYNC UI WITH AUDIO EVENTS
audio.addEventListener("play", () => {
  updatePlayButton();
  cover.style.animationPlayState = "running";
});

audio.addEventListener("pause", () => {
  updatePlayButton();
  cover.style.animationPlayState = "paused";
});

// TIME UPDATE
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

// SEEK
progress.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// VOLUME
volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

// FAVORITES
favBtn.addEventListener("click", () => {
  const currentSong = songs[songIndex];
  if (!favorites.find(fav => fav.title === currentSong.title)) {
    favorites.push(currentSong);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
});

// HISTORY
function addToHistory(song) {
  history = history.filter(s => s.title !== song.title);
  history.unshift(song);
  if (history.length > 5) history.pop();
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

// RENDER
function renderFavorites() {
  favoritesList.innerHTML = "";
  favorites.forEach(song => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.addEventListener("click", () => {
      loadSong(song);
      playSong();
    });
    favoritesList.appendChild(li);
  });
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(song => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.addEventListener("click", () => {
      loadSong(song);
      playSong();
    });
    historyList.appendChild(li);
  });
}

// INIT
window.addEventListener("load", () => {
  loadSong(songs[songIndex]);
  // Uncomment if you want auto-play:
  // playSong();
});

renderFavorites();
renderHistory();
