// Handles the home page video showcase play behavior
(function(){
  function setupVideoShowcase(){
    const video = document.getElementById('collectionVideo');
    const playBtn = document.getElementById('playButton');
    const poster = document.getElementById('videoPoster');
    const thumb = document.getElementById('videoThumbnail');

    if (!video || !playBtn || !poster || !thumb) return;

    const startPlayback = (e) => {
      if (e) e.stopPropagation();
      poster.style.display = 'none';
      playBtn.style.display = 'none';
      video.style.display = 'block';
      // Attempt autoplay muted to satisfy browser policies
      video.muted = true;
      video.play().catch(() => {
        // If autoplay blocked, unmute and show controls for manual play
        video.muted = false;
      });
    };

    playBtn.addEventListener('click', startPlayback);
    thumb.addEventListener('click', startPlayback);

    video.addEventListener('ended', () => {
      video.pause();
      video.currentTime = 0;
      video.style.display = 'none';
      poster.style.display = 'block';
      playBtn.style.display = 'flex';
    });
  }

  // Expose and auto-run if script.js calls it
  window.setupVideoShowcase = setupVideoShowcase;
})();
