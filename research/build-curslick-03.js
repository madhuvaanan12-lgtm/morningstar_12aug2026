/* Builds Curslick collection 03 and rewrites the Morningstar data payload. */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO = path.resolve(__dirname, "..");
const DATA_DIR = path.join(REPO, "data");

/* ---------- cover art (same visual language as the research page) ---------- */

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
  karadeniz: exclusive({
    slug: "sen-anlat-karadeniz", title: "Sen Anlat Karadeniz", originalTitle: "Sen Anlat Karadeniz / Lifeline",
    year: 2018, endYear: 2019, episodes: 64, episodeRuntime: 135,
    genres: ["Drama", "Romance", "Thriller", "Family"],
    country: "Turkey", language: "Turkish", format: "Live action",
    imdbId: "tt7932896",
    image: "https://static.tvmaze.com/uploads/images/original_untouched/142/357411.jpg",
    shortPlot: "A woman fleeing a violent husband hides in a Black Sea village, where a hot-tempered local man makes himself the wall between her small son and everything hunting them.",
    longPlot: "Nefes escapes her abusive husband with her son Yigit and lands in a Black Sea village where Tahir Kaleli appoints himself her protector, marrying her first to shield her name and falling in love with her long after. Yigit spends most of a season deciding whether this loud stranger is a threat or a father. The series became one of Turkey's most-exported dramas for its portrayal of a woman rebuilding a life after abuse, and it ends with the family intact and Nefes on her way to law school.",
    sourceName: "Wikipedia", sourceUrl: "https://en.wikipedia.org/wiki/Sen_Anlat_Karadeniz",
    art: { a: "#0B2B2E", b: "#17544F", accent: "#E4762C", motif: "waves" },
  }),
  amoresVerdaderos: exclusive({
    slug: "amores-verdaderos", title: "Amores Verdaderos", originalTitle: "Amores verdaderos",
    year: 2012, endYear: 2013, episodes: 181, episodeRuntime: 44,
    genres: ["Drama", "Romance", "Melodrama"],
    country: "Mexico", language: "Spanish", format: "Live action",
    imdbId: "tt2320524",
    image: "https://static.tvmaze.com/uploads/images/original_untouched/544/1360526.jpg",
    shortPlot: "A wealthy businesswoman survives a kidnapping attempt, hires her gardener as her personal bodyguard, and finds the only decent man in her house is the one she pays.",
    longPlot: "Victoria Balvanera is not a widow but a wife, held in a marriage of convenience to an unfaithful businessman, when she hires former policeman Jose Angel Arriaga to protect her. Her grown children treat him as staff before they start treating him as the only adult in the household. The Televisa remake of Amor en Custodia runs 181 episodes and lands on a divorce, an exoneration and a wedding.",
    sourceName: "IMDb", sourceUrl: "https://www.imdb.com/title/tt2320524/",
    art: { a: "#2B1030", b: "#6D1F45", accent: "#E8B44A", motif: "rays" },
  }),
  amorEnCustodia: exclusive({
    slug: "amor-en-custodia", title: "Amor en Custodia", originalTitle: "Amor en custodia",
    year: 2005, endYear: 2005, episodes: 175, episodeRuntime: 45,
    genres: ["Drama", "Romance", "Melodrama"],
    country: "Argentina", language: "Spanish", format: "Live action",
    imdbId: null,
    image: "https://static.tvmaze.com/uploads/images/original_untouched/90/226374.jpg",
    shortPlot: "The telenovela that invented this whole genre: two bodyguards arrive at a wealthy estate, and the one assigned to the lady of the house falls in love with her.",
    longPlot: "Paz Achaval Urien is a powerful landowner trapped in a hollow marriage, with two daughters and a household that runs on appearances, when bodyguard Juan Manuel Aguirre is hired to protect her. The format was remade across Latin America, most successfully as Mexico's Amores Verdaderos. It swept the 2005 Martin Fierro awards and ends with the couple together and raising twins.",
    sourceName: "Wikipedia", sourceUrl: "https://es.wikipedia.org/wiki/Amor_en_custodia_(telenovela_argentina)",
    art: { a: "#171029", b: "#3E2A63", accent: "#D9A03C", motif: "rays" },
  }),
  japanBodyguard: exclusive({
    slug: "the-bodyguard-1997", title: "The Bodyguard (1997)", originalTitle: "ボディガード",
    year: 1997, endYear: 1997, episodes: 11, episodeRuntime: 46,
    genres: ["Action", "Drama", "Crime", "Romance"],
    country: "Japan", language: "Japanese", format: "Asian drama",
    imdbId: "tt33312057",
    image: "https://i.mydramalist.com/v84Vp_4f.jpg",
    shortPlot: "A widowed florist witnesses a murder in a car park and hires a karate-master bodyguard to stand between her small son and the corrupt officer who did it.",
    longPlot: "Megumi Kyoda runs a flower shop and is raising her son Tsutomu alone when she sees a policeman kill a colleague underground. Through an old acquaintance she hires Shin Enjoji, an international bodyguard, who moves into their small domestic life while hunting the man hunting them. It is the cleanest statement of this premise anyone has put on television, and the hardest to actually watch: a 1997 TV Asahi series with no subtitled release.",
    sourceName: "MyDramaList", sourceUrl: "https://mydramalist.com/688065-the-bodyguard",
    art: { a: "#131A2C", b: "#3C3350", accent: "#DE6A78", motif: "petals" },
  }),
  naBoleTum: exclusive({
    slug: "na-bole-tum", title: "Na Bole Tum Na Maine Kuch Kaha", originalTitle: "ना बोले तुम ना मैंने कुछ कहा",
    year: 2012, endYear: 2013, episodes: 370, episodeRuntime: 22,
    genres: ["Drama", "Romance", "Family"],
    country: "India", language: "Hindi", format: "Live action",
    imdbId: "tt2192156",
    image: "https://upload.wikimedia.org/wikipedia/en/f/f2/Na_bole_tum_na_maine_kuch_kaha.jpg",
    shortPlot: "A blunt local reporter takes up a young widow's fight for justice, and then takes up her family — over the loud objections of her son.",
    longPlot: "Megha Vyas is a widow with two children and no explanation for how her husband died. Mohan Bhatnagar, a crime reporter, fights her case, her in-laws and the town, and eventually her own reluctance to let anyone stand near her children. Her daughter comes around quickly; her son Aditya holds out almost to the end, which is the show's strongest thread.",
    sourceName: "Wikipedia", sourceUrl: "https://en.wikipedia.org/wiki/Na_Bole_Tum_Na_Maine_Kuch_Kaha",
    art: { a: "#3A1206", b: "#7E2A11", accent: "#EBA82B", motif: "arch" },
  }),
  ekVivah: exclusive({
    slug: "ek-vivah-aisa-bhi", title: "Ek Vivah Aisa Bhi", originalTitle: "एक विवाह ऐसा भी",
    year: 2017, endYear: 2017, episodes: 164, episodeRuntime: 22,
    genres: ["Drama", "Romance", "Family"],
    country: "India", language: "Hindi", format: "Live action",
    imdbId: "tt6505716",
    image: "https://static.tvmaze.com/uploads/images/original_untouched/502/1255956.jpg",
    shortPlot: "A careless rich man fights a town, a family and a young widow's own reluctance for the right to look after her and her small son.",
    longPlot: "Suman is a young widow raising her son Veer under the weight of everyone's opinion; Ranveer Mittal is the man she cannot stand and cannot get rid of. The show runs the full arc in a single season and ends on the beat that defines this whole premise: the child ties the knot at their wedding, binding the couple together himself.",
    sourceName: "Wikipedia", sourceUrl: "https://en.wikipedia.org/wiki/Ek_Vivah_Aisa_Bhi_(TV_series)",
    art: { a: "#161036", b: "#3B2E7A", accent: "#F2B227", motif: "arch" },
  }),
  beCareful: exclusive({
    slug: "be-careful-with-my-heart", title: "Be Careful with My Heart",
    year: 2012, endYear: 2014, episodes: 622, episodeRuntime: 30,
    genres: ["Drama", "Romance", "Family", "Comedy"],
    country: "Philippines", language: "Filipino", format: "Asian drama",
    imdbId: "tt2256248",
    image: "https://static.tvmaze.com/uploads/images/original_untouched/521/1302879.jpg",
    shortPlot: "A cheerful nobody is hired as nanny to the youngest daughter of a widowed airline owner — a little girl who has stopped speaking.",
    longPlot: "Maya dela Rosa takes the job because she has no other option, and the Lim household treats her as help long after she has become its centre of gravity. One of the most successful daytime teleseryes ever made in the Philippines, it runs the protector-and-hostile-children arc with the roles reversed and finishes with a full happily-ever-after: marriage, the older children won over, and twins.",
    sourceName: "Wikipedia", sourceUrl: "https://en.wikipedia.org/wiki/Be_Careful_with_My_Heart",
    art: { a: "#0E2A33", b: "#1F6A72", accent: "#F2B85C", motif: "waves" },
  }),
  cuteBodyguard: exclusive({
    slug: "cute-bodyguard", title: "Cute Bodyguard", originalTitle: "那小子不可爱",
    year: 2022, endYear: 2022, episodes: 24, episodeRuntime: 45,
    genres: ["Romance", "Comedy", "Action"],
    country: "China", language: "Mandarin", format: "Asian drama",
    imdbId: "tt14090166",
    image: "https://1.vikiplatform.com/c/38881c/0499d9633d.jpg?x=b",
    shortPlot: "A father hires a female bodyguard to protect his son, and the son sets out to humiliate her off the job.",
    longPlot: "Wu Shiyi saves a wealthy man during an attack and is hired to protect his heir, who wants nothing to do with her. The straight gender-flip of the bodyguard-and-hostile-charge dynamic, played as light comedy. There is no child-bonding thread here — the charge is an adult — but the antagonism-to-devotion arc is the same one.",
    sourceName: "IMDb", sourceUrl: "https://www.imdb.com/title/tt14090166/",
    art: { a: "#1A1230", b: "#4A2A6B", accent: "#F09A5B", motif: "city" },
  }),
  lovelyBodyguard: exclusive({
    slug: "my-lovely-bodyguard", title: "My Lovely Bodyguard", originalTitle: "บอดี้การ์ดที่รัก",
    year: 2022, endYear: 2022, episodes: 12, episodeRuntime: 60,
    genres: ["Action", "Romance", "Drama"],
    country: "Thailand", language: "Thai", format: "Asian drama",
    imdbId: "tt19759788",
    image: "https://static.tvmaze.com/uploads/images/original_untouched/407/1018213.jpg",
    shortPlot: "A stuntwoman takes a close-protection job guarding a businessman and the young niece in his care.",
    longPlot: "A short, action-forward lakorn that runs the trope in the usual order of operations: the child accepts the bodyguard first and the adult argues about it for another eight episodes. The child is a niece rather than a son or daughter, so the family-formation beat is softer than in the core matches here.",
    sourceName: "MyDramaList", sourceUrl: "https://mydramalist.com/695729-my-lovely-bodyguard",
    art: { a: "#151C33", b: "#3B3E7A", accent: "#EE8C6E", motif: "rays" },
  }),
  lovingNever: exclusive({
    slug: "loving-never-forgetting", title: "Loving, Never Forgetting", originalTitle: "恋恋不忘",
    year: 2014, endYear: 2014, episodes: 34, episodeRuntime: 45,
    genres: ["Drama", "Romance", "Melodrama"],
    country: "China", language: "Mandarin", format: "Asian drama",
    imdbId: null,
    image: "https://static.tvmaze.com/uploads/images/original_untouched/149/374673.jpg",
    shortPlot: "A tycoon discovers the injured boy in the hospital is his son, sues the single mother raising him, and then has to earn his way into the family he tried to take apart.",
    longPlot: "The closest well-known Chinese title to this premise, and the one that breaks it: Li Zhongmou is the boy's biological father rather than a hired protector, so the conflict is a custody fight instead of a guarding job. What survives is the shape you came for — a hostile child who decides the outcome, and a mother who is the last to give in. They marry.",
    sourceName: "Wikipedia", sourceUrl: "https://en.wikipedia.org/wiki/Loving,_Never_Forgetting",
    art: { a: "#211026", b: "#5A2A55", accent: "#E8A0A8", motif: "dots" },
  }),
  gunsOfParadise: exclusive({
    slug: "guns-of-paradise", title: "Guns of Paradise", originalTitle: "Paradise",
    year: 1988, endYear: 1991, episodes: 56, episodeRuntime: 47,
    genres: ["Western", "Drama", "Family"],
    country: "United States", language: "English", format: "Live action",
    imdbId: null,
    image: "https://static.tvmaze.com/uploads/images/original_untouched/276/691345.jpg",
    shortPlot: "A gunfighter inherits his dead sister's four children in a mining town and hangs up the guns badly.",
    longPlot: "The nearest American network television gets to this premise. Ethan Allen Cord takes in four children who want a different life than the one he can give them, rents a farm from the town banker Amelia Lawson, and slowly becomes both a father and a marshal. The children are his own kin rather than the love interest's, so the winning-over-her-kids beat never quite exists — but the protector-becomes-family engine is the same one.",
    sourceName: "Wikipedia", sourceUrl: "https://en.wikipedia.org/wiki/Paradise_(1988_TV_series)",
    art: { a: "#2A1A0E", b: "#6B4423", accent: "#E4A845", motif: "rays" },
  }),
};

/* ---------- the collection ---------- */

const COLLECTION = {
  id: "protector-family-romance",
  number: "03",
  title: "Closest TV shows to the hired-protector romance",
  shortTitle: "Protector romance",
  referenceTitle: "The Bodyguard",
  referenceYear: 1992,
  summary:
    "For when the premise matters more than the genre: a dangerous, competent man is hired into a woman's household as bodyguard, minder or nanny; her children want him gone; something tries to hurt them and he stands in the way; and the mother — or the wife — is the last one to admit what has happened. Ranked from the series that hit every beat, including the happy ending, out to the famous ones that break it.",
  matchingStandard:
    "Five beats decide placement. A protector figure installed in a household with children. Children who resist him before they claim him. A real threat that makes the guarding matter. Romance with the mother or wife of that household. And an ending that keeps the family together. Titles that miss a beat are still listed, with the missing beat named in the entry.",
  researchNote:
    "This is a closeness order for one specific fantasy, not a quality ranking. The first ten hit every beat and end happily. Then come the versions with the roles reversed — a woman takes the protector or carer job in a widower's house — which play identically, beat for beat. Last are the famous titles that surface in every search for this premise and break one beat, almost always the last one. Read those warnings before you start a sixty-episode commitment.",
  sources: [
    { label: "Morningstar research — Hired to Protect Them (illustrated edition)", url: "/research/hired-to-protect-them.html" },
    { label: "My Secret, Terrius — AsianWiki", url: "https://asianwiki.com/My_Secret,_Terrius" },
    { label: "Sen Anlat Karadeniz — Wikipedia", url: "https://en.wikipedia.org/wiki/Sen_Anlat_Karadeniz" },
    { label: "Amores Verdaderos — IMDb plot summary", url: "https://www.imdb.com/title/tt2320524/plotsummary/" },
    { label: "Amor en custodia — Wikipedia (Argentina)", url: "https://es.wikipedia.org/wiki/Amor_en_custodia_(telenovela_argentina)" },
    { label: "The Bodyguard (1997) — MyDramaList", url: "https://mydramalist.com/688065-the-bodyguard" },
    { label: "Na Bole Tum Na Maine Kuch Kaha — Wikipedia", url: "https://en.wikipedia.org/wiki/Na_Bole_Tum_Na_Maine_Kuch_Kaha" },
    { label: "Marriage Contract finale — Dramabeans", url: "https://dramabeans.com/2016/04/marriage-contract-episode-16-final/" },
    { label: "Be Careful with My Heart — Wikipedia", url: "https://en.wikipedia.org/wiki/Be_Careful_with_My_Heart" },
    { label: "Bodyguard (BBC) — Wikipedia", url: "https://en.wikipedia.org/wiki/Bodyguard_(British_TV_series)" },
  ],
  entries: [
    {
      position: 1, label: "Closest overall",
      matchTags: ["Bodyguard turned carer", "Hostile children", "Widow romance"],
      why: "The purest version of the premise on television. A widowed office worker hires the unemployed neighbour across the hall to babysit her five-year-old twins; he is a black-ops agent in hiding, and her husband was murdered by the conspiracy he has been chasing. He minds the children by day and dismantles an arms plot by night, and the twins go from testing him to refusing to sleep without him. The romance is deliberately understated — no wedding — but the finale plants the four of them as a family.",
      showId: "mdl-27703",
    },
    {
      position: 2, label: "Closest long-form epic",
      matchTags: ["Self-appointed protector", "Son to win over", "Happy ending"],
      why: "Nefes escapes a violent husband with her son Yigit and lands in a Black Sea village, where Tahir makes himself her wall — marrying her first to protect her name and falling in love with her long after. Yigit spends most of a season deciding whether this loud stranger is a threat or a father. Season one is the great one and the later seasons stretch, but the ending is unambiguous: they survive, they have a daughter, she goes to law school.",
      show: EXCLUSIVES.karadeniz,
    },
    {
      position: 3, label: "Closest telenovela",
      matchTags: ["Hired bodyguard", "Wife, not widow", "Marriage ending"],
      why: "The one where the woman is not a widow but a wife, which is a harder and rarer version of this story. Victoria survives a kidnapping attempt, hires her gardener as her personal bodyguard, and discovers the man she pays is the only decent adult in her house. Her grown children treat him as staff for a long time. Budget 181 episodes; it pays off with a divorce, an exoneration and a wedding.",
      show: EXCLUSIVES.amoresVerdaderos,
    },
    {
      position: 4, label: "Closest origin story",
      matchTags: ["Hired bodyguard", "Lady of the house", "Format original"],
      why: "The telenovela that created this entire genre and was remade across Latin America. Two bodyguards arrive at a wealthy estate; the one assigned to Paz, the landowner trapped in a hollow marriage, falls in love with her, and her two daughters make him work for his place. It swept the 2005 Martin Fierro awards. Watch this for the original, or the Mexican remake above for the more polished version.",
      show: EXCLUSIVES.amorEnCustodia,
    },
    {
      position: 5, label: "Closest literal bodyguard",
      matchTags: ["Professional bodyguard", "Widow and son", "Crime thriller"],
      why: "The most literal statement of the premise ever filmed for television: a widowed florist witnesses a murder, fears for her small son, and hires a karate-master international bodyguard who moves into their domestic life while hunting the man hunting them. The catch is availability — a 1997 TV Asahi series with no subtitled release. Listed because nothing else states the shape this plainly.",
      show: EXCLUSIVES.japanBodyguard,
    },
    {
      position: 6, label: "Closest Indian match",
      matchTags: ["Protector", "Son refuses him", "Remarriage"],
      why: "A blunt crime reporter takes up a young widow's fight for justice and then takes up her family, over the loud objections of her son. The daughter comes around fast; Aditya holds out almost to the end, which is both the show's best thread and its longest. Daily-soap pacing, but the arc you asked for is the spine of the whole series.",
      show: EXCLUSIVES.naBoleTum,
    },
    {
      position: 7, label: "Best-reviewed match",
      matchTags: ["Village policeman", "Son vets him", "Serial-killer threat"],
      why: "A single mother running a bar in a town that has decided to despise her, a serial killer who has decided she is next, and a village policeman who installs himself as her bodyguard, bouncer and public defender. Her son Pilgu vets him ruthlessly before granting approval. The funniest title on this list and the most acclaimed — the guarding is real, and so is the happy ending.",
      showId: "tt10826064",
    },
    {
      position: 8, label: "Closest melodrama",
      matchTags: ["Contract marriage", "Daughter warms up", "Illness, not guns"],
      why: "A rich man needs a liver for his mother; a single mother with a brain tumour needs money for the daughter she will leave behind. He starts as a buyer and becomes the man standing between this family and everything coming for it, while Eunseong watches him earn it. The danger here is illness and his own family rather than a gunman, and the ending is hopeful rather than tidy.",
      showId: "tt5525778",
    },
    {
      position: 9, label: "Closest kids-hate-him comedy",
      matchTags: ["Male nanny", "Sabotage campaign", "Divorcee romance"],
      why: "A divorced fashion-industry mother whose two children have driven off every nanny in Seoul hires Korea's top male nanny out of desperation. The sabotage campaign is the first four episodes; the demolition of his professional distance is the rest. No bodyguard element — the threat is a hostile aunt — but this is the most explicit children-hate-him-then-need-him arc in the collection.",
      showId: "mdl-1444",
    },
    {
      position: 10, label: "Closest widow-remarriage match",
      matchTags: ["Protector", "Small son", "Child blesses it"],
      why: "A careless rich man fights a town, a family and a young widow's own reluctance for the right to look after her and her small son. Short-run and hard to stream outside India, but it lands the exact arc and finishes on the beat that defines this premise: the boy ties the knot at their wedding himself.",
      show: EXCLUSIVES.ekVivah,
    },
    {
      position: 11, label: "Roles reversed · closest overall",
      matchTags: ["Carer, not guard", "Children freeze her out", "Happily ever after"],
      why: "The same story with the roles swapped, and one of the most successful daytime teleseryes ever made. Maya is hired as nanny to the youngest daughter of a widowed airline owner — a little girl who has stopped speaking — and the household treats her as help long after she has become its centre. Beat for beat identical to the core matches, all the way to marriage and twins.",
      show: EXCLUSIVES.beCareful,
    },
    {
      position: 12, label: "Roles reversed · sharpest child conflict",
      matchTags: ["Housekeeper", "Four hostile children", "Not a romance"],
      why: "A silent, unnervingly capable housekeeper arrives at the home of a newly widowed father of four and does exactly what she is told, no more. The children try everything to break her, and the show is about what they find when they do. The warning matters: this is not a romance and it is not warm. It is here because no other series does the children-wage-war-on-the-newcomer arc this well.",
      showId: "tt3362414",
    },
    {
      position: 13, label: "Roles reversed · comedy",
      matchTags: ["Female bodyguard", "Hostile charge", "Light watch"],
      why: "A father hires a female bodyguard to protect his son, and the son sets out to humiliate her off the job and fails, repeatedly. The straight gender-flip of the bodyguard-and-hostile-charge dynamic. The charge is an adult, so there is no child-bonding thread — take this one for the antagonism and the comedy.",
      show: EXCLUSIVES.cuteBodyguard,
    },
    {
      position: 14, label: "Roles reversed · guardian and nanny",
      matchTags: ["Sudden guardian", "Orphaned children", "Idol comfort watch"],
      why: "A cold divorce lawyer inherits guardianship of his brother's two orphaned children and hires a nanny to absorb the problem. The children arrive already hostile to everyone, and she is the one who refuses to leave. The roles are split rather than flipped — he guards, she cares — but the ending is as clean as the genre gets.",
      showId: "tt5852764",
    },
    {
      position: 15, label: "Roles reversed · action lakorn",
      matchTags: ["Close protection", "Child accepts her first", "Short run"],
      why: "A stuntwoman takes a close-protection job guarding a businessman and the young niece in his care, and the child accepts her long before the adult does. Twelve episodes, action-forward. The child is a niece rather than a son or daughter, so the family-formation beat is softer than the core matches.",
      show: EXCLUSIVES.lovelyBodyguard,
    },
    {
      position: 16, label: "Ending warning · the famous one",
      matchTags: ["Real bodyguard", "No happy ending", "Watch for the thriller"],
      why: "The show everyone names first when you describe this premise, and the wrong answer to the question. A war-veteran protection officer is assigned to a Home Secretary and falls into an affair with her. The children are his own rather than hers, the protectee does not survive the series, and there is no family ending. Superb thriller; do not start it expecting comfort.",
      showId: "tt7493974",
    },
    {
      position: 17, label: "Ending warning · unfinished",
      matchTags: ["Bodyguard romance", "Cancelled", "No resolution"],
      why: "The best-looking bodyguard romance Turkish television has made: Adem is hired by a dangerous man to watch his wife, who is planning to run, and she uses his devotion as cover until she means it. It was cancelled after one season, so the story stops rather than ends, and the children are not the emotional centre. Beautiful, unresolved.",
      showId: "tt11896074",
    },
    {
      position: 18, label: "Ending warning · wrong premise, right feeling",
      matchTags: ["Custody fight", "Hostile son", "Marriage ending"],
      why: "The closest well-known Chinese title, and the one that swaps the engine: the man is the boy's biological father rather than a hired protector, so the conflict is a custody fight instead of a guarding job. What survives is the shape you came for — a hostile child who decides the outcome, a mother who gives in last, and a marriage at the end.",
      show: EXCLUSIVES.lovingNever,
    },
    {
      position: 19, label: "Ending warning · kin, not hers",
      matchTags: ["Gunfighter guardian", "Four children", "Western"],
      why: "The nearest American network television gets to this premise. A gunfighter inherits his dead sister's four children, rents a farm from the town banker, and slowly becomes a father and a marshal. The children are his own kin rather than the love interest's, so the winning-over-her-kids beat never quite exists — but the protector-becomes-family engine is the same one.",
      show: EXCLUSIVES.gunsOfParadise,
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
