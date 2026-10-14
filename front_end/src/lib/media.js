const backendOrigin = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000/api'
).replace(/\/api\/?$/, '').replace(/\/$/, '');

export function mediaUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${backendOrigin}/${path.replace(/^\//, '')}`;
}
