// Plockar ut video-id:t (11 tecken) ur en YouTube-länk eller ett rent id.
// Klarar youtube.com/watch?v=, youtu.be/, /embed/, /shorts/ och /live/.
const ID = /^[A-Za-z0-9_-]{11}$/;

export function youtubeId(input) {
  const value = (input || '').trim();
  if (ID.test(value)) return value;

  let url;
  try {
    url = new URL(value.startsWith('http') ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, '');
  let candidate = null;
  if (host === 'youtu.be') {
    candidate = url.pathname.slice(1).split('/')[0];
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    candidate = url.searchParams.get('v') ||
      url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/)?.[1] || null;
  }
  return candidate && ID.test(candidate) ? candidate : null;
}

// youtube-nocookie sätter inga spårningskakor förrän videon spelas.
export function youtubeEmbedUrl(id) {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}

export function youtubeThumbUrl(id) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
