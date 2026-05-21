export const ensureHttps = (url: string | undefined): string => {
  if (!url || url.trim() === '') return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

export const formatDriveImage = (url: string | undefined): string => {
  if (!url) return '';
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      // Chuyển đổi link xem của Drive thành link thumbnail độ phân giải cao
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
  }
  return url;
};

export const formatDriveVideo = (url: string | undefined): string => {
  if (!url) return '';
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      // Chuyển đổi link xem của Drive thành link stream trực tiếp (Direct Link)
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  return url;
};
