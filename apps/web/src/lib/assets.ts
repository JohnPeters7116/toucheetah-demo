export function assetUrl(path: string) {
  // GitHub Pages serves under a repo subpath; BASE_URL points at that subpath.
  // Ensure callers can pass either "/images/x.png" or "images/x.png".
  const base = import.meta.env.BASE_URL ?? '/'
  const p = path.startsWith('/') ? path.slice(1) : path
  return `${base}${p}`
}
