const audio = document.getElementById('audioPlayer');
const source = document.getElementById('sourceMusic');

const music = [
    'sounds/Beast Ganon Battle - The Legend of Zelda Twilight Princess.mp3',
    'sounds/Boss Defeated - The Legend of Zelda Twilight Princess.mp3',
    'sounds/Death Mountain - The Legend of Zelda Twilight Princess.mp3',
    'sounds/Faron Woods - The Legend of Zelda Twilight Princess.mp3',
    'sounds/Ganondorf - The Legend of Zelda Twilight Princess.mp3',
    'sounds/Hidden Skill Training - The Legend of Zelda Twilight Princess.mp3',
    'sounds/Hidden Village - The Legend of Zelda Twilight Princess.mp3',
    'sounds/Horseback Ganondorf Fight - The Legend of Zelda Twilight Princess.mp3',
    'sounds/Lake Hylia - The Legend of Zelda Twilight Princess.mp3',
    'sounds/Midna\'s Lament - The Legend of Zelda Twilight Princess.mp3',
    'sounds/Puppet Zelda - The Legend of Zelda Twilight Princess.mp3',
    'sounds/Temple of Time - The Legend of Zelda Twilight Princess.mp3',
    'sounds/Zant Battle - The Legend of Zelda Twilight Princess.mp3'
];

let currentTrackIndex = 0;

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % music.length;
    source.src = music[currentTrackIndex];
    audio.load(); // This will load the new audio source
    audio.play(); // This will start playing the new audio
    console.log(currentTrackIndex);
}

source.src = music[currentTrackIndex]; // Set initial source
audio.load(); // Load the initial audio source

audio.addEventListener('ended', playNextTrack());
