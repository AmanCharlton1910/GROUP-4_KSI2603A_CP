function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\s]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?\s]+)/,
    /(?:https?:\/\/)?youtu\.be\/([^?\s]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?\s]+)/,
  ];

  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }
  }

  return null;
}

function renderVideoPlayers() {
  document.querySelectorAll('.video-player').forEach((container) => {
    const src = container.dataset.videoSrc;
    if (!src) return;

    const embedUrl = getYouTubeEmbedUrl(src);
    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.title = 'YouTube video player';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      container.appendChild(iframe);
      return;
    }

    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'metadata';
    video.src = src;
    video.innerHTML = 'Your browser does not support HTML5 video.';
    container.appendChild(video);
  });
}

window.addEventListener('DOMContentLoaded', renderVideoPlayers);
