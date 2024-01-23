const iframe = document.getElementById('iframe');
const video = document.getElementById('video');
const source = document.getElementById('source');
const withads = document.querySelectorAll('.withAds');
const noads = document.querySelectorAll('.noAds');
console.log(iframe, video, withads, noads)
withads.forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('ads ')
        const value = btn.getAttribute('data');
        if (iframe) {
            iframe.style.display = 'block';
            video.style.display = 'none';
            iframe.setAttribute('src', value);
        }
    });
});

noads.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        console.log('no ads')
        const value = btn.getAttribute('data');
        if (iframe) {
            iframe.style.display = 'none';
            video.style.display = 'block';
            source.setAttribute('src', value);
        }
    })
})

const body = document.body;

        // Get the .back element
const backElement = document.querySelector('.back');

        // Set the height of .back to match the body height
backElement.style.height = `${body.offsetHeight}px`;

document.addEventListener('DOMContentLoaded', function () {
    var videoPlayer = videojs('video');

    // Listen for the error event on the video element
    videoPlayer.on('error', function (e) {
        // Prevent the default error handling (removing this message)
        e.preventDefault();

        // Log the error to the console
        console.error('An error occurred during video playback:', e);

        // Log additional information about the video element
        console.log('Video element:', videoPlayer);
    });
});