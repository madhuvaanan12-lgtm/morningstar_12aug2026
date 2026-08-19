# TMDB runtime method

For a TMDB TV match, Morningstar estimates total duration using the first available method:

1. median value of TMDB `episode_run_time` × TMDB `number_of_episodes`;
2. TMDB last-aired episode runtime × episode count;
3. IMDb series runtime × TMDB episode count.

The result is stored only as an estimate and rendered with `≈` in the archive UI.
