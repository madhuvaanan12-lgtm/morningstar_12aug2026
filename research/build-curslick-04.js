/* Builds Curslick collection 04 and rewrites the Morningstar data payload. */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO = path.resolve(__dirname, "..");
const DATA_DIR = path.join(REPO, "data");

/* ---------- cover art (same visual language as the other Curslick collections) ---------- */

function motif(kind, accent) {
  const bits = [];
  if (kind === "city") {
    for (let i = 0; i < 9; i++) {
      const w = 22 + (i % 3) * 12, h = 60 + ((i * 47) % 130);
      bits.push(`<rect x="${i * 34 - 6}" y="${300 - h}" width="${w}" height="${h + 10}" fill="${accent}" opacity=".13"/>`);
    }
    for (let i = 0; i < 26; i++) {
      bits.push(`<rect x="${12 + (i * 41) % 276}" y="${190 + (i * 29) % 100}" width="4" height="5" fill="${accent}" opacity=".5"/>`);
    }
  } else if (kind === "waves") {
    for (let i = 0; i < 7; i++) {
      const y = 250 + i * 17;
      bits.push(`<path d="M-10 ${y} q 40 -13 80 0 t 80 0 t 80 0 t 80 0" fill="none" stroke="${accent}" stroke-width="2" opacity="${(0.34 - i * 0.03).toFixed(2)}"/>`);
    }
  } else if (kind === "rain") {
    for (let i = 0; i < 44; i++) {
      const x = (i * 53) % 310, y = (i * 97) % 300;
      bits.push(`<line x1="${x}" y1="${y}" x2="${x - 6}" y2="${y + 26}" stroke="${accent}" stroke-width="1.4" opacity=".26"/>`);
    }
  } else if (kind === "petals") {
    for (let i = 0; i < 22; i++) {
      const x = (i * 71) % 300, y = (i * 113) % 310, r = 4 + (i % 4) * 2.5;
      bits.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${accent}" opacity="${(0.16 + (i % 3) * 0.07).toFixed(2)}"/>`);
    }
  } else if (kind === "rays") {
    for (let i = -5; i <= 5; i++) {
      bits.push(`<path d="M150 130 L${150 + i * 46} -40 L${150 + i * 46 + 22} -40 Z" fill="${accent}" opacity=".08"/>`);
    }
  } else if (kind === "arch") {
    bits.push(`<path d="M60 320 L60 150 a90 90 0 0 1 180 0 L240 320" fill="none" stroke="${accent}" stroke-width="2.5" opacity=".35"/>`);
    bits.push(`<path d="M84 320 L84 158 a66 66 0 0 1 132 0 L216 320" fill="none" stroke="${accent}" stroke-width="1.2" opacity=".22"/>`);
  } else if (kind === "dots") {
    for (let i = 0; i < 40; i++) {
      bits.push(`<circle cx="${(i * 43) % 300}" cy="${(i * 67) % 300}" r="2.6" fill="${accent}" opacity=".28"/>`);
    }
  }
  return bits.join("");
}

const FIGURES = `
  <circle cx="118" cy="286" r="19" fill="#0A0E10"/>
  <path d="M84 450 L84 344 q0 -30 34 -30 q34 0 34 30 L152 450 Z" fill="#0A0E10"/>
  <path d="M150 352 q14 6 20 34" fill="none" stroke="#0A0E10" stroke-width="6" stroke-linecap="round"/>
  <circle cx="186" cy="368" r="12" fill="#0A0E10"/>
  <path d="M164 450 L164 402 q0 -20 22 -20 q22 0 22 20 L208 450 Z" fill="#0A0E10"/>`;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(title, max) {
  const words = title.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max && line) { lines.push(line); line = w; }
    else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function coverArt(show) {
  // The app crops this art to a variable aspect ratio (object-fit: cover), so every
  // legible element stays inside a centre-safe band rather than hugging an edge.
  const { a, b, accent, motif: kind } = show.art;
  const lines = wrap(show.title, 15);
  const base = 360 - (lines.length - 1) * 12;
  const text = lines
    .map((l, i) => `<text x="150" y="${base + i * 24}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="#F4F1EC">${esc(l)}</text>`)
    .join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="300" height="450">` +
    `<defs>` +
    `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${b}"/><stop offset="100%" stop-color="${a}"/></linearGradient>` +
    `<radialGradient id="r" cx="50%" cy="30%" r="55%"><stop offset="0%" stop-color="${accent}" stop-opacity=".55"/><stop offset="100%" stop-color="${accent}" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#060A0B" stop-opacity="0"/><stop offset="100%" stop-color="#060A0B" stop-opacity=".82"/></linearGradient>` +
    `</defs>` +
    `<rect width="300" height="450" fill="url(#g)"/>` +
    `<circle cx="150" cy="130" r="58" fill="${accent}" opacity=".85"/>` +
    `<rect width="300" height="450" fill="url(#r)"/>` +
    motif(kind, accent) +
    `<rect x="0" y="240" width="300" height="210" fill="url(#s)"/>` +
    FIGURES +
    `<rect width="300" height="450" fill="${a}" opacity=".14"/>` +
    text +
    `<text x="150" y="${base + (lines.length - 1) * 24 + 26}" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="10" letter-spacing="1.4" fill="#F4F1EC" fill-opacity=".72">${esc(show.country.toUpperCase())} · ${show.year}</text>` +
    `</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/* ---------- editorial exclusives (titles absent from the catalogue) ---------- */

const findUrl = (t, y) =>
  `https://www.imdb.com/find/?q=${encodeURIComponent(t + " " + y)}&s=tt&ttype=tv`;

function exclusive(o) {
  const show = {
    id: `curslick-${o.slug}`,
    title: o.title,
    originalTitle: o.originalTitle || o.title,
    year: o.year,
    endYear: o.endYear,
    episodes: o.episodes,
    episodeRuntime: o.episodeRuntime,
    runtimeHours: Math.round((o.episodes * o.episodeRuntime) / 60 * 10) / 10,
    genres: o.genres,
    country: o.country,
    language: o.language,
    format: o.format,
    imdbId: o.imdbId || null,
    imdbUrl: o.imdbId ? `https://www.imdb.com/title/${o.imdbId}/` : findUrl(o.title, o.year),
    image: o.image || null,
    shortPlot: o.shortPlot,
    longPlot: o.longPlot,
    watched: false,
    imdbRating: null,
    imdbVotes: 0,
    rank: null,
    status: o.status || "Ended",
    sourceName: o.sourceName,
    sourceUrl: o.sourceUrl,
    curslickExclusive: true,
  };
  show.art = o.art;
  show.image = o.image || coverArt(show);
  delete show.art;
  return show;
}

const EXCLUSIVES = {
  wentworth: exclusive({
    slug: "wentworth-2013", title: "Wentworth",
    year: 2013, endYear: 2021, episodes: 100, episodeRuntime: 44,
    genres: ["Drama", "Crime", "Romance"],
    country: "Australia", language: "English", format: "Live action",
    imdbId: "tt2433738",
    image: "https://static.tvmaze.com/uploads/images/original_untouched/158/396176.jpg",
    shortPlot: "A reimagining of Prisoner: inside Wentworth Correctional Centre, inmate-turned-crime-boss Franky Doyle and prison psychologist Bridget Westfall keep finding their way back to each other across eight seasons.",
    longPlot: "Franky and Bridget break up, get back together, and lose years to Franky's sentence before the series finale gives them a release-day reunion. Foxtel's longest-running one-hour drama, and the rare entry on this list with no genre trappings at all — just an adult prison drama that lands its central couple safely on the outside.",
    sourceName: "Wikipedia", sourceUrl: "https://en.wikipedia.org/wiki/Wentworth_(TV_series)",
    art: { a: "#1B1F24", b: "#3A4552", accent: "#E4A13C", motif: "rain" },
  }),
  fosters: exclusive({
    slug: "the-fosters-2013", title: "The Fosters",
    year: 2013, endYear: 2018, episodes: 104, episodeRuntime: 42,
    genres: ["Drama", "Family", "Romance"],
    country: "United States", language: "English", format: "Live action",
    imdbId: "tt2262532",
    image: "https://static.tvmaze.com/uploads/images/original_untouched/116/292055.jpg",
    shortPlot: "Stef Foster and Lena Adams Foster are already married and raising five kids — two biological, one adopted, two fostered — when the series opens; the whole show is their marriage surviving everything thrown at it.",
    longPlot: "Unlike almost everything else on this list, Stef and Lena aren't a will-they-won't-they arc: they're the stable center a very unstable found family orbits for five seasons. The series finale has Stef propose again anyway — 'will you marry me for a third time?' — and Lena says yes, again, on her way out the door of the house they're leaving behind.",
    sourceName: "Wikipedia", sourceUrl: "https://en.wikipedia.org/wiki/The_Fosters_(2013_TV_series)",
    art: { a: "#132A2E", b: "#2E6B63", accent: "#F0B86B", motif: "waves" },
  }),
  the100: exclusive({
    slug: "the-100-2014", title: "The 100",
    year: 2014, endYear: 2020, episodes: 100, episodeRuntime: 43,
    genres: ["Action", "Drama", "Sci-Fi"],
    country: "United States", language: "English", format: "Live action",
    imdbId: "tt2661044",
    image: "https://static.tvmaze.com/uploads/images/original_untouched/477/1194981.jpg",
    shortPlot: "Post-apocalyptic survival drama built around Clarke Griffin — whose relationship with Commander Lexa became one of the most-cited 'bury your gays' cases in modern television.",
    longPlot: "Lexa is shot dead in season 3, minutes after she and Clarke sleep together for the first time — a death timed so badly against the romance that it sparked a public apology from the showrunner and years of discourse about the trope. The show runs four more seasons afterward and never gives Clarke another ending with a woman. Included here only as the warning it has become.",
    sourceName: "Wikipedia", sourceUrl: "https://en.wikipedia.org/wiki/The_100_(TV_series)",
    art: { a: "#1A2410", b: "#39471F", accent: "#C4472B", motif: "city" },
  }),
  pllOriginal: exclusive({
    slug: "pretty-little-liars-2010", title: "Pretty Little Liars",
    year: 2010, endYear: 2017, episodes: 160, episodeRuntime: 42,
    genres: ["Drama", "Mystery", "Romance", "Thriller"],
    country: "United States", language: "English", format: "Live action",
    imdbId: "tt1578873",
    image: "https://static.tvmaze.com/uploads/images/original_untouched/125/314775.jpg",
    shortPlot: "The original teen-mystery series ends its own run with Alison proposing to Emily and the two of them raising twins together — a genuinely sweet finale that a later spinoff quietly undoes.",
    longPlot: "Alison proposes with Emily's grandmother's ring in the series finale, and the two are shown co-parenting twin girls. They never marry on screen, and the 2019 sequel Pretty Little Liars: The Perfectionists reveals the relationship didn't survive — they're written as split up and living on opposite coasts. The original finale qualifies on its own; the franchise as a whole doesn't.",
    sourceName: "IMDb", sourceUrl: "https://www.imdb.com/title/tt1578873/",
    art: { a: "#1C1830", b: "#3A2E5C", accent: "#D94F70", motif: "dots" },
  }),
  greysAnatomy: exclusive({
    slug: "greys-anatomy-2005", title: "Grey's Anatomy",
    year: 2005, endYear: null, episodes: 452, episodeRuntime: 43,
    genres: ["Drama", "Romance", "Medical"],
    country: "United States", language: "English", format: "Live action",
    imdbId: "tt0413573",
    image: "https://static.tvmaze.com/uploads/images/original_untouched/600/1501061.jpg",
    status: "Ongoing",
    shortPlot: "Callie Torres and Arizona Robbins were, for years, the show's flagship lesbian couple — but Grey's Anatomy fails this list twice over: they broke up years before the finish line, and there is no finish line yet.",
    longPlot: "Callie leaves for New York with a new partner, Arizona wins a custody battle for their daughter, and the show only gestures at a possible reconciliation via an unanswered text. That would already be a soft exclusion. The harder one: the show is still airing, renewed for a 23rd season for fall 2026, so there is no series ending to evaluate in the first place.",
    sourceName: "Variety", sourceUrl: "https://variety.com/2026/tv/news/greys-anatomy-renewed-season-23-abc-1236702833/",
    art: { a: "#101820", b: "#274156", accent: "#D9484A", motif: "arch" },
  }),
};

/* ---------- the collection ---------- */

const COLLECTION = {
  id: "lesbian-tv-happy-endings",
  number: "04",
  title: "Best lesbian TV shows that end with the couple together",
  shortTitle: "Lesbian happy endings",
  referenceTitle: "Wynonna Earp",
  referenceYear: 2016,
  summary:
    "A curated, closed list rather than an open genre browse: every show below centers a lesbian couple who are still alive, still together, and clearly a couple in the show's own final scene — married, engaged or an established relationship, on screen, not implied off it. Ranked from the cleanest, most literal happy endings out to the famous, constantly-recommended titles that fail the test, with the specific reason named for each.",
  matchingStandard:
    "Two conditions, both mandatory. First, the show has an actual ending — not an ongoing run, not a cancellation with the plot left hanging. Second, the central lesbian couple is alive and together in the finale itself: married, engaged, or a clearly established couple on screen. A couple that got a happy finale but was later broken up by a spinoff is flagged, not silently included — read the entry.",
  researchNote:
    "Two failure modes account for most of why 'best lesbian TV shows' lists are shorter than people expect. One is 'bury your gays': a queer woman is killed shortly after the romance finally lands, a pattern common enough to have its own Wikipedia entry. The other is cancellation before any real ending exists. The first eleven entries below pass both tests cleanly. Entries 12 through 18 are the shows that come up constantly in this search anyway, each with the specific reason it doesn't qualify — useful to know before you start one expecting a happy ending.",
  sources: [
    { label: "Wynonna Earp series finale recap — TVLine", url: "https://www.tvline.com/news/wynonna-earp-recap-season-4-series-finale-wayhaught-wedding-doc-leaves-1234659231/" },
    { label: "Sense8 series finale wedding explained — The Hollywood Reporter", url: "https://www.hollywoodreporter.com/tv/tv-news/sense8-series-finale-wedding-orgy-ending-explained-1118748/" },
    { label: "She-Ra series finale kiss — Noelle Stevenson interview, CBR", url: "https://www.cbr.com/noelle-stevenson-she-ra-finale-hordak-kiss/" },
    { label: "Carmilla Season 3 finale recap — Autostraddle", url: "https://www.autostraddle.com/carmilla-season-three-act-three-recap-happily-ever-after-355196/" },
    { label: "Steven Universe wedding episode — Autostraddle", url: "https://www.autostraddle.com/steven-universe-end-of-an-era-reveals-how-hard-rebecca-sugar-fought-for-our-queer-gem-wedding/" },
    { label: "Legend of Korra ending — Korrasami confirmed canon, ScreenCrush", url: "https://screencrush.com/legend-of-korra-korrasami-canon-confirmed-series-finale/" },
    { label: "The Owl House series finale explained — Collider", url: "https://collider.com/the-owl-house-series-finale-explained/" },
    { label: "The L Word: Generation Q finale explained — The Hollywood Reporter", url: "https://www.hollywoodreporter.com/tv/tv-news/l-word-generation-q-finale-explained-1272818/" },
    { label: "Motherland: Fort Salem series finale recap — Autostraddle", url: "https://www.autostraddle.com/motherland-fort-salem-series-finale-recap/" },
    { label: "Bury your gays — Wikipedia", url: "https://en.wikipedia.org/wiki/Bury_your_gays" },
    { label: "Killing Eve series finale ending explained — Bustle", url: "https://www.bustle.com/entertainment/villanelle-death-killing-eve-series-finale-ending-explained" },
    { label: "The 100 creator apologizes over Lexa's death — The Hollywood Reporter", url: "https://www.hollywoodreporter.com/tv/tv-news/100-creator-pens-apology-controversial-878165/" },
    { label: "Pretty Little Liars: The Perfectionists undoes Emison — ScreenRant", url: "https://screenrant.com/pretty-little-liars-alison-emily-divorce-sasha-pieterse-response/" },
    { label: "Warrior Nun cancelled after season 2 — ScreenRant", url: "https://screenrant.com/warrior-nun-season-3-ava-beatrice-plans-cancellation-worse/" },
    { label: "Gentleman Jack cancelled after season 2 — TVLine", url: "https://www.tvline.com/news/gentleman-jack-cancelled-season-3-hbo-full-statement-1234849332/" },
    { label: "Grey's Anatomy renewed for season 23 — Variety", url: "https://variety.com/2026/tv/news/greys-anatomy-renewed-season-23-abc-1236702833/" },
  ],
  entries: [
    {
      position: 1, label: "The gold standard",
      matchTags: ["Central couple, not subplot", "On-screen wedding", "Series-ending vows"],
      why: "Wynonna Earp built an entire fandom around deputy Nicole Haught's slow, patient courtship of Waverly Earp — a couple at the center of the show, not its margins, for four seasons. The series finale, 'Old Souls,' ends with their wedding on the Earp homestead: vows, rings, a cursed dress causing chaos, and the two of them staying exactly where they want to be. No ambiguity, no epilogue text card — they marry on screen, and the story ends with them married.",
      showId: "tt4878326",
    },
    {
      position: 2, label: "The biggest wedding",
      matchTags: ["Ensemble finale", "On-screen wedding", "Feature-length send-off"],
      why: "When Netflix cancelled Sense8, the show got a rare gift: a two-and-a-half-hour finale film to close every arc properly. Nomi Marks and Amanita Caplan — together since the pilot — marry at the Eiffel Tower in the closing act, full vows, with the rest of the cluster watching. It's the largest, least ambiguous wedding send-off on this list.",
      showId: "tt2431438",
    },
    {
      position: 3, label: "Confirmed queer canon",
      matchTags: ["Enemies to lovers", "On-screen kiss", "Ending went exactly as planned"],
      why: "Five seasons of Catra and Adora — childhood best friends turned enemies turned the only two people who can save the world — end with a kiss that is the literal plot mechanism restoring magic to the planet, not subtext and not a blink-and-miss-it gesture. Creator Noelle Stevenson got to end the show exactly as planned, and the closing minutes confirm them as a couple.",
      showId: "tt7745956",
    },
    {
      position: 4, label: "The one that set the template",
      matchTags: ["Vampire romance", "Web series", "Multi-season arc plus a film"],
      why: "Before most of the shows on this list existed, this YouTube web series took the toxic-vampire-girlfriend trope and gave it an actual happy ending: Laura dies, Carmilla is offered a return to humanity in exchange for staying dead, and instead the two of them get Laura back and walk out of the finale together, alive and staying. Three seasons plus a follow-up film, all pointed at the same ending.",
      showId: "tt4127260",
    },
    {
      position: 5, label: "The wedding that changed a rating",
      matchTags: ["Kids' animation", "On-screen wedding", "Franchise-spanning couple"],
      why: "Ruby and Sapphire's wedding — the fused, permanent form of both is the character Garnet — was a fight to get on air; Cartoon Network initially blocked a same-sex proposal, and it became one of the most-cited queer-representation moments in kids' television. The pair are already married by the time the franchise's true ending, Steven Universe Future, closes the story out in 2020, and they're still together.",
      showId: "tt3061046",
    },
    {
      position: 6, label: "Fought for, then made explicit",
      matchTags: ["Understated on air", "Confirmed by creators immediately", "Made canon in the follow-up comics"],
      why: "Nickelodeon's finale shows Korra and Asami holding hands, walking into a spirit portal together and turning to face each other — about as far as Standards & Practices would allow in 2014. Creators Bryan Konietzko and Mike DiMartino confirmed within days that the moment was intended as romantic, and the licensed comics continuing the story show them as a couple on the page. Included because the show's own ending, plus the creators' follow-through, leaves no real doubt.",
      showId: "tt1695360",
    },
    {
      position: 7, label: "Not animation, not genre TV",
      matchTags: ["Prison drama", "Grounded, adult tone", "Release-day reunion"],
      why: "This Australian prison drama's central couple — inmate-turned-crime-boss Franky Doyle and prison psychologist Bridget Westfall — break up, reunite, and lose years to Franky's sentence before the series finale gives them a release-day reunion and a life together on the outside. No animation, no genre trappings, just an eight-season drama that lands its couple safely.",
      show: EXCLUSIVES.wentworth,
    },
    {
      position: 8, label: "Shortened, not broken",
      matchTags: ["Cancelled and compressed", "Relationship confirmed on screen", "Time-skip epilogue"],
      why: "Disney declined to give this one a full third season — creator Dana Terrace has said the reason given was that the show didn't fit the 'Disney brand' — and season 3 was compressed into three specials. Even compressed, the finale still lands its ending on purpose: Luz and Amity are confirmed a couple on screen, and the closing time-skip shows them still together. A full ending, just a shorter one than intended.",
      showId: "tt8050756",
    },
    {
      position: 9, label: "The reunion the original never gave",
      matchTags: ["Revival series", "On-screen wedding", "Closes a 20-year arc"],
      why: "The original L Word ended in 2009 on a genuine cliffhanger, Bette and Tina's future unresolved. This 2019 continuation spends three seasons rebuilding their relationship from scratch and ends its own run — and the characters' twenty-year arc — with the two of them married. Technically a different show's finale doing the job the original series never got to.",
      showId: "tt7661384",
    },
    {
      position: 10, label: "Healed in the last ten minutes",
      matchTags: ["Cancelled, but wrapped up on purpose", "War-drama stakes", "Full unit reunited"],
      why: "Freeform cancelled this one after three seasons, but the writers knew in advance and built season 3 as a genuine series finale rather than a cliffhanger. Witch-soldiers Raelle Collar and Scylla Ramshorn spend most of the show on opposite sides of a war before the literal magic that ends the story heals them both, side by side, in the last scene.",
      showId: "tt9900092",
    },
    {
      position: 11, label: "Together before the pilot even ends",
      matchTags: ["Married before the story starts", "Foster-family drama", "No breakup arc, ever"],
      why: "Unlike everything else on this list, Stef Foster and Lena Adams Foster aren't a will-they-won't-they arc — they're already married and raising five kids when the show opens, and the whole series is their marriage surviving everything thrown at it. The finale has Stef propose again anyway ('will you marry me for a third time?'), and Lena says yes, again.",
      show: EXCLUSIVES.fosters,
    },
    {
      position: 12, label: "Ending warning · bury your gays",
      matchTags: ["Ended, but not together", "Partner killed minutes after reunion", "Widely criticized finale"],
      why: "Eve and Villanelle spend four seasons circling each other before the finale finally gives them one clean, happy scene together — a kiss, a dance, real tenderness — and then Villanelle is shot dead crossing a bridge minutes later. One of the most-cited modern examples of 'bury your gays,' criticized heavily on release (a 30% Rotten Tomatoes finale score) for exactly this reason.",
      showId: "tt7016936",
    },
    {
      position: 13, label: "Ending warning · the case study for the trope",
      matchTags: ["Character killed mid-season", "Never resolved afterward", "Sparked the modern backlash"],
      why: "Commander Lexa is shot dead in season 3, immediately after she and Clarke sleep together for the first time — timed badly enough against the romance that it became the central 'bury your gays' case study and prompted a public apology from the showrunner. The series runs four more seasons afterward and never gives Clarke another ending with a woman.",
      show: EXCLUSIVES.the100,
    },
    {
      position: 14, label: "Ending warning · undone by the spinoff",
      matchTags: ["Engaged, not married, at the finale", "Wedding never shown on screen", "Reversed by the sequel series"],
      why: "The original series finale is genuinely sweet: Alison proposes to Emily with Emily's grandmother's ring, and the two are shown parenting twins together. But they never marry on screen, and the 2019 sequel Pretty Little Liars: The Perfectionists reveals the relationship didn't survive — written as split up, living on opposite coasts. If you stop at the original finale it qualifies; if you know what came after, it doesn't.",
      show: EXCLUSIVES.pllOriginal,
    },
    {
      position: 15, label: "Ending warning · cancelled on a cliffhanger",
      matchTags: ["Cancelled after 2 seasons", "Couple separated, not together", "No finished story"],
      why: "Ava and Beatrice finally admit their feelings for each other in the season 2 finale — right before Ava is thrown into another dimension and the two are left apart. Netflix cancelled the show a month later. A crowdfunded film trilogy has since been announced, but without the original showrunner, and nothing has been released to actually finish this story.",
      showId: "tt9059350",
    },
    {
      position: 16, label: "Ending warning · cancelled after one season",
      matchTags: ["Vampire teen romance", "Cliffhanger finale", "No resolution"],
      why: "Juliette and Calliope's relationship survives a full season of monster-hunter-versus-vampire family warfare, but Netflix cancelled the show after eight episodes and the season ends mid-story, on a death in the family and an unresolved threat. Included as a warning because it gets recommended for this exact list constantly, and it doesn't have an ending at all.",
      showId: "tt13315156",
    },
    {
      position: 17, label: "Ending warning · cut off, not concluded",
      matchTags: ["Cancelled after 2 seasons", "No finale was ever written", "Together where the show happens to stop"],
      why: "The closest call on this list. HBO axed the show a month after season 2 aired, and nobody involved got to write an actual finale — but the last episode does leave Anne Lister and Ann Walker married and settled at Shibden Hall together, which happens to match the real historical record the show is based on. Flagged as a warning only because 'the network stopped filming' is not the same thing as 'the story ended.'",
      showId: "tt7211618",
    },
    {
      position: 18, label: "Ending warning · fails on two counts",
      matchTags: ["Still airing", "Couple broke up years earlier", "No ending to evaluate"],
      why: "Callie Torres and Arizona Robbins were, for years, the show's flagship lesbian couple — and this list excludes them twice over. Callie leaves for New York with a new partner and loses a custody battle for their daughter; the show only gestures at a possible reconciliation through an unanswered text. And regardless of that, there's no finale to check against: the show is still airing, renewed for a 23rd season for fall 2026.",
      show: EXCLUSIVES.greysAnatomy,
    },
  ],
};

/* ---------- rewrite the payload ---------- */

const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "manifest.json"), "utf8"));
const data = JSON.parse(manifest.parts.map((p) => fs.readFileSync(path.join(DATA_DIR, p), "utf8")).join(""));

data.curslick.collections = data.curslick.collections.filter((c) => c.id !== COLLECTION.id);
data.curslick.collections.push(COLLECTION);
data.curslick.generatedAt = new Date().toISOString();

/* sanity: every showId must resolve */
const known = new Set([
  ...data.catalogue.shows.map((s) => s.id),
  ...data.catalogue.watchedArchive.map((s) => s.id),
  ...data.kDramaArchive.shows.map((s) => s.id),
]);
const unresolved = COLLECTION.entries.filter((e) => e.showId && !known.has(e.showId));
if (unresolved.length) throw new Error("Unresolved showIds: " + unresolved.map((e) => e.showId).join(", "));

const serialized = JSON.stringify(data);
JSON.parse(serialized); // parse check

const PART_SIZE = 600000;
const chunks = [];
for (let i = 0; i < serialized.length; i += PART_SIZE) chunks.push(serialized.slice(i, i + PART_SIZE));

for (const old of manifest.parts) fs.unlinkSync(path.join(DATA_DIR, old));

const parts = chunks.map((chunk, i) => {
  const hash = crypto.createHash("sha256").update(chunk).digest("hex").slice(0, 12);
  const name = `morningstar-data-${String(i + 1).padStart(2, "0")}-${hash}.txt`;
  fs.writeFileSync(path.join(DATA_DIR, name), chunk);
  return name;
});

const next = {
  ...manifest,
  generatedAt: new Date().toISOString(),
  curslickCollections: data.curslick.collections.length,
  dataSha256: crypto.createHash("sha256").update(serialized).digest("hex"),
  dataBytes: Buffer.byteLength(serialized),
  parts,
};
fs.writeFileSync(path.join(DATA_DIR, "manifest.json"), JSON.stringify(next, null, 2) + "\n");

console.log("collections:", data.curslick.collections.map((c) => `${c.number} ${c.shortTitle} (${c.entries.length})`).join(" | "));
console.log("entries:", COLLECTION.entries.length, "exclusives:", COLLECTION.entries.filter((e) => e.show).length);
console.log("parts:", parts.length, "bytes:", next.dataBytes);
