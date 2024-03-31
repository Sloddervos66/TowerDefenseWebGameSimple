document.addEventListener('DOMContentLoaded', function() {
    var audio = document.querySelector('audio');
    var playButton = document.getElementById('playButton');

    playButton.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            playButton.textContent = 'Pause';
        } else {
            audio.pause();
            playButton.textContent = 'Play';
        }
    });
});