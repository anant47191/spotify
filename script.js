console.log('lets write javascript');

const songNames = [
    { name: 'Afsos', artist: 'Anup Jain', file: 'songs/Afsos - Afsos (320 kbps).mp3', image: 'https://i.pinimg.com/736x/8b/ae/ce/8baecee2efd3dfa9b00e79b01b9e317c.jpg' },
    { name: 'Bairan', artist: 'Sumit and Anuj', file: 'songs/Bairan - Bairan (320 kbps).mp3', image: 'https://i.pinimg.com/736x/8b/ae/ce/8baecee2efd3dfa9b00e79b01b9e317c.jpg' },
    { name: 'Dard Dilo Ke', artist: 'Mohammed Irfan', file: 'songs/Dard Dilo Ke - The Xpose (320 kbps).mp3', image: 'https://i.pinimg.com/736x/8b/ae/ce/8baecee2efd3dfa9b00e79b01b9e317c.jpg' },
    { name: 'Destiny', artist: 'Shashwat Sachdev', file: 'songs/Destiny - Mann Atkeya .mp3', image: 'https://i.pinimg.com/736x/8b/ae/ce/8baecee2efd3dfa9b00e79b01b9e317c.jpg' },
    { name: 'Aari Aari', artist: 'Shashwat Sachdev', file: 'songs/Dhurandhar The Revenge - Aari Aari .mp3', image: 'https://i.pinimg.com/736x/8b/ae/ce/8baecee2efd3dfa9b00e79b01b9e317c.jpg' },
    { name: 'Ez-Ez', artist: 'Shashwat Sachdev', file: 'songs/Ez-Ez - Dhurandhar (320 kbps).mp3', image: 'https://i.pinimg.com/736x/8b/ae/ce/8baecee2efd3dfa9b00e79b01b9e317c.jpg' },
    { name: 'Gehra Hua', artist: 'Shashwat Sachdev', file: 'songs/Gehra Hua - Dhurandhar (320 kbps) (1).mp3', image: 'https://i.pinimg.com/736x/8b/ae/ce/8baecee2efd3dfa9b00e79b01b9e317c.jpg' },
    { name: 'Khat', artist: 'Navjot Ahuja', file: 'songs/Khat - Khat (320 kbps).mp3', image: 'https://i.pinimg.com/736x/8b/ae/ce/8baecee2efd3dfa9b00e79b01b9e317c.jpg' }
];

const songList = document.getElementById('songList');
const audio = new Audio();
audio.preload = 'metadata';

const songInfo = document.querySelector('.songinfo');
const songTime = document.querySelector('.songtime-text');
const songButtons = document.querySelector('.song-button');
const playBtn = songButtons ? songButtons.querySelectorAll('img')[1] : null;

let currentSongIndex = -1;

function formatTime(seconds) {
    if (!seconds || Number.isNaN(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

function updatePlaybar(song) {
    if (songInfo) {
        songInfo.textContent = `${song.name} - ${song.artist}`;
    }

    if (songTime) {
        songTime.textContent = '0:00';
    }
}

function updatePlayBtn() {
    if (playBtn) {
        playBtn.src = audio.paused ? 'play.svg' : 'pause.svg';
    }
}

function playSong(index, autoplay = true) {
    const selectedSong = songNames[index];
    if (!selectedSong) return;

    currentSongIndex = index;
    audio.src = selectedSong.file;
    if (autoplay) audio.play().catch(() => console.log('Audio play was blocked until user interaction.'));
    updatePlaybar(selectedSong);
    updatePlayBtn();

    if (songList) {
        [...songList.querySelectorAll('li')].forEach((item, itemIndex) => {
            item.classList.toggle('selected', itemIndex === index);
        });
    }
}

if (songList) {
    songNames.forEach(({ name, artist }, index) => {
        const listItem = document.createElement('li');
        listItem.dataset.index = String(index);

        const musicIcon = document.createElement('img');
        musicIcon.className = 'invert';
        musicIcon.src = 'music.svg';
        musicIcon.alt = '';

        const info = document.createElement('div');
        info.className = 'info';

        const songName = document.createElement('div');
        songName.textContent = name;

        const songArtist = document.createElement('div');
        songArtist.textContent = artist;

        info.appendChild(songName);
        info.appendChild(songArtist);

        const playNow = document.createElement('div');
        playNow.className = 'playnow';

        const playNowText = document.createElement('span');
        playNowText.textContent = 'Play Now';

        const playIcon = document.createElement('img');
        playIcon.className = 'invert';
        playIcon.src = 'play.svg';
        playIcon.alt = 'play';

        playNow.appendChild(playNowText);
        playNow.appendChild(playIcon);

        listItem.appendChild(musicIcon);
        listItem.appendChild(info);
        listItem.appendChild(playNow);

        listItem.addEventListener('click', () => playSong(index));
        songList.appendChild(listItem);
    });
}

const seekbar = document.querySelector('.seekbar');
const circle = document.querySelector('.circle');

audio.addEventListener('timeupdate', () => {
    if (currentSongIndex < 0) return;
    if (songTime) songTime.textContent = formatTime(audio.currentTime);
    if (seekbar && circle && audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        circle.style.left = `${Math.min(percent, 100)}%`;
    }
});

if (seekbar) {
    seekbar.addEventListener('click', (e) => {
        if (!audio.duration) return;
        const rect = seekbar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        if (currentSongIndex === -1) playSong(0);
        else if (audio.paused) audio.play();
        else audio.pause();
    }
});

const volumeSlider = document.querySelector('.volume-slider');
if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
    });
}

audio.addEventListener('play', updatePlayBtn);
audio.addEventListener('pause', updatePlayBtn);

if (songButtons) {
    const [prevBtn, playBtnEl, nextBtn] = songButtons.querySelectorAll('img');

    playBtnEl.addEventListener('click', () => {
        if (currentSongIndex === -1) {
            playSong(0);
        } else if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSongIndex <= 0) {
            playSong(songNames.length - 1);
        } else {
            playSong(currentSongIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        playSong((currentSongIndex + 1) % songNames.length);
    });
}

const hamburger = document.querySelector('.hamburger');
const left = document.querySelector('.left');
const playbar = document.querySelector('.playbar');
const closeBtn = document.querySelector('.close');

function toggleLibrary(forceClose = false) {
    const isOpen = left.style.left === '0px';
    const shouldClose = forceClose || isOpen;
    left.style.left = shouldClose ? '-100%' : '0px';
    if (playbar) {
        playbar.style.left = shouldClose ? '12px' : '292px';
        playbar.style.width = shouldClose ? 'calc(100vw - 24px)' : 'calc(100vw - 304px)';
    }
}

if (hamburger) hamburger.addEventListener('click', () => toggleLibrary());
if (closeBtn) closeBtn.addEventListener('click', () => toggleLibrary(true));

document.querySelectorAll('.card .play').forEach((btn, index) => {
    btn.addEventListener('click', () => playSong(index));
});

playSong(0, false);

audio.addEventListener('ended', () => {
    if (currentSongIndex >= 0) {
        const nextIndex = (currentSongIndex + 1) % songNames.length;
        playSong(nextIndex);
    }

    
});

