# Why TMDB is a fallback rather than the first bulk pass

TMDB supports finding a TV show from an IMDb ID and then reading TV-series details, but that requires authenticated API requests per title. The IMDb Archive contains hundreds of thousands of titles, so doing that for every title on every Netlify build would be wasteful and slow.

Morningstar therefore uses bulk/local information first and TMDB only for the remainder. This preserves the full archive while keeping builds bounded and auditable.
