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
    title: "Song One",
    artist: "Elethu",
    src: "assets/songs/song1.mp3",
    cover: "assets/covers/cover1.jpg"
  },
  {
    title: "Song Two",
    artist: "Unknown Artist",
    src: "assets/songs/song2.mp3",
    cover: "assets/covers/cover2.jpg"
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

// LOAD SONG
function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  cover.src = song.cover;
  highlightPlaylist();
}

// PLAY / PAUSE
function playSong() {
  audio.play();
  playBtn.textContent = "⏸";
  cover.style.animationPlayState = "running";
  addToHistory(songs[songIndex]);
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶";
  cover.style.animationPlayState = "paused";
}

// NEXT / PREV
function nextSong() {
  songIndex = isShuffle
    ? Math.floor(Math.random() * songs.length)
    : (songIndex + 1) % songs.length;

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
playBtn.addEventListener("click", () =>
  audio.paused ? playSong() : pauseSong()
);

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "#00ff88" : "#fff";
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? "#00ff88" : "#fff";
});

audio.addEventListener("ended", () =>
  isRepeat ? playSong() : nextSong()
);

// TIME UPDATE
audio.addEventListener("timeupdate", () => {
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

// HISTORY (NO DUPLICATES)
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
loadSong(songs[songIndex]);
renderFavorites();
renderHistory();
