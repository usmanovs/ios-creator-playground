export const isYouTube = (url: string) => /youtube\.com|youtu\.be/.test(url);

export const getYouTubeId = (url: string): string | null => {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
};

export const toYouTubeEmbed = (url: string) => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url;
};

export const getYouTubeThumb = (url: string) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};
