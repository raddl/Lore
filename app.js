const { useState, useEffect, useRef } = React;

const ICON_NAMES = ['Send', 'ChevronLeft', 'Sparkles', 'Shield', 'Users', 'BookOpen', 'Network', 'BarChart3', 'AlertCircle', 'TrendingUp', 'Eye', 'MessageCircle', 'Flame', 'Heart', 'Lightbulb', 'Radio', 'MessagesSquare', 'Search', 'User', 'Home', 'Star', 'Plus', 'X', 'CalendarDays', 'List', 'Bookmark', 'UserPlus', 'Mic', 'MicOff', 'Volume2', 'VolumeX', 'Keyboard', 'Brain', 'Trophy', 'CheckCircle2', 'XCircle'];

const toKebab = (s) => s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/(\d+)/g, '-$1').toLowerCase().replace(/^-/, '');

// Lucide UMD exposes icons as either lucide.icons[KebabName] or lucide[PascalName].
// Each icon is either an array [[tag, attrs], ...] or { __iconNode: [...] } depending on version.
const lookupIcon = (name) => {
  if (!window.lucide) return null;
  const kebab = toKebab(name);
  // Try multiple locations
  const candidates = [
    window.lucide.icons && window.lucide.icons[kebab],
    window.lucide.icons && window.lucide.icons[name],
    window.lucide[name],
    window.lucide[kebab],
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    // Direct array of nodes
    if (Array.isArray(candidate)) return candidate;
    // Object with __iconNode (newer versions)
    if (candidate.__iconNode) return candidate.__iconNode;
    // Some versions use iconNode
    if (candidate.iconNode) return candidate.iconNode;
  }
  return null;
};

const Icons = {};
ICON_NAMES.forEach(function(name) {
  const iconData = lookupIcon(name);
  Icons[name] = function IconComp(props) {
    const p = props || {};
    const className = p.className || "";
    const style = p.style;
    const size = p.size || 24;
    const strokeWidth = p.strokeWidth || 2;
    if (!iconData || !Array.isArray(iconData) || iconData.length === 0) {
      return React.createElement('span', { className: className, style: Object.assign({ display: 'inline-block', width: size, height: size }, style || {}) });
    }
    const children = iconData.map(function(node, i) {
      // Each node is [tag, attrs] or [tag, attrs, children]
      const tag = node[0];
      const attrs = node[1] || {};
      return React.createElement(tag, Object.assign({ key: i }, attrs));
    });
    return React.createElement('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      className: className,
      style: style,
    }, children);
  };
});

const Send = Icons.Send;
const ChevronLeft = Icons.ChevronLeft;
const Sparkles = Icons.Sparkles;
const Shield = Icons.Shield;
const Users = Icons.Users;
const BookOpen = Icons.BookOpen;
const Network = Icons.Network;
const BarChart3 = Icons.BarChart3;
const AlertCircle = Icons.AlertCircle;
const TrendingUp = Icons.TrendingUp;
const Eye = Icons.Eye;
const MessageCircle = Icons.MessageCircle;
const Flame = Icons.Flame;
const Heart = Icons.Heart;
const Lightbulb = Icons.Lightbulb;
const Radio = Icons.Radio;
const MessagesSquare = Icons.MessagesSquare;
const Search = Icons.Search;
const User = Icons.User;
const Home = Icons.Home;
const Star = Icons.Star;
const Plus = Icons.Plus;
const X = Icons.X;
const CalendarDays = Icons.CalendarDays;
const List = Icons.List;
const Bookmark = Icons.Bookmark;
const UserPlus = Icons.UserPlus;
const Mic = Icons.Mic;
const MicOff = Icons.MicOff;
const Volume2 = Icons.Volume2;
const VolumeX = Icons.VolumeX;
const Keyboard = Icons.Keyboard;
const Brain = Icons.Brain;
const Trophy = Icons.Trophy;
const CheckCircle2 = Icons.CheckCircle2;
const XCircle = Icons.XCircle;

// ============ DEMO MODE (canned responses — no API calls) ============
const CANNED_CHAT_RESPONSES = {
  loki: {
    sylvie: "**Sylvie** is another Loki variant, but she has had a very different life. Unlike our Loki, she has been on the run from the TVA since she was a kid — which means she has developed tricks he has not, like **enchantment** (taking over someone's mind with a touch). Her whole identity is built around surviving, not ruling.",
    mobius: "**Mobius** is a TVA analyst who studies dangerous variants — and he has made Loki his personal project. He is patient, sharp, and genuinely seems to enjoy the chaos. Fun detail: the show's director has said Mobius was designed to feel like a world-weary cop who has seen it all.",
    tva: "The **Time Variance Authority** is a bureaucratic agency that polices the timeline. If you stray from what they call the 'Sacred Timeline,' they either reset you or prune you out of existence. Everything about their design — the beige walls, manila folders, waiting rooms — is meant to feel oppressive.",
    apocalypse: "Loki's big realization is that **apocalypses are safe to mess with** — because everyone dies anyway, nothing branches off. So if you are hiding from the TVA, you hide on a dying planet. That is literally the plot of episode 3.",
    train: "The **train scene on Lamentis-1** is a fan favorite — two Lokis, one bottle of Asgardian wine, singing a folk song in a constructed language that fans translated within hours. It is the emotional turning point of the season.",
    cooper: "**D.B. Cooper** was the 1971 skyjacker who parachuted from a plane with 200,000 dollars and vanished — one of the FBI's most famous unsolved cases. In episode 1, Loki reveals he did it on a bet with Thor.",
    enchant: "**Enchantment** is Sylvie's signature move — she touches someone and takes over their mind, seeing their memories and controlling their actions. Our Loki does not have this ability, which is one of the show's biggest hints that variants diverge in weirder ways than the TVA admits.",
    default: "Good question. In this episode, the emotional core is really about identity — who you are when stripped of your purpose. The writers have been clear this is the 'redemption-or-not' question at the heart of Loki's arc."
  },
  wandavision: {
    wanda: "**Wanda** is holding the entire town of Westview inside a reality she has constructed — but the show is careful not to confirm that right away. What you are seeing is a grieving woman building a sitcom around herself because it is the only reality where her pain does not exist.",
    vision: "**Vision** died in Infinity War — and the version you are watching is something Wanda brought back. But 'how' and 'what that means' is exactly what the show is slowly unpacking.",
    agnes: "**Agnes** is... suspicious. She knows things she should not. She shows up at just the right moments. The show is deliberately making her feel like a sitcom neighbor who is hiding something huge.",
    monica: "**Monica Rambeau** is a SWORD agent — and yes, she is the little girl from Captain Marvel, all grown up. Her being pulled into Westview and pushed back out is one of the key reveals of episode 4.",
    sitcom: "The **sitcom structure** is not just a gimmick — each episode is styled after a different era of American TV (1950s, 60s, 70s) because Wanda grew up watching these shows on smuggled American broadcasts in Sokovia. Comfort TV is literally her defense mechanism.",
    default: "WandaVision is playing a long game — every sitcom homage, every commercial break, every detail is a clue. The show rewards patience. What specifically caught your attention?"
  },
  moonknight: {
    steven: "**Steven Grant** is a gift-shop clerk with a quiet life and a lot of questions. He is losing time, waking up in strange places, and hearing a voice. That voice — and the violence that follows it — is the show's central mystery.",
    marc: "**Marc Spector** is the other voice Steven hears. Comics fans know exactly what is happening: Moon Knight has Dissociative Identity Disorder, and Marc is Steven's other identity. The show handles it with real care.",
    harrow: "**Arthur Harrow** is a cult leader who used to serve Khonshu — the Egyptian moon god Marc Spector is bound to. He is soft-spoken, philosophical, and completely terrifying. Ethan Hawke is incredible here.",
    khonshu: "**Khonshu** is an ancient Egyptian god of the moon. In the show, he has been speaking to Marc Spector for years — demanding vengeance in exchange for keeping him alive. Think: abusive boss, but divine.",
    scarab: "The **scarab** in episode 1 is a golden beetle artifact that both Harrow and Marc want. In Egyptian mythology, scarabs symbolized rebirth — which is very on the nose for a show about a man who was brought back from the dead by a moon god.",
    default: "Moon Knight is doing something no other MCU show has tried — it is a psychological thriller dressed as a superhero story. Every scene is asking you to question what is real."
  }
};

const findCannedResponse = function(showId, question) {
  const lower = question.toLowerCase();
  const showResponses = CANNED_CHAT_RESPONSES[showId] || CANNED_CHAT_RESPONSES.loki;
  const keys = Object.keys(showResponses);
  for (let i = 0; i < keys.length; i++) {
    const keyword = keys[i];
    if (keyword !== "default" && lower.indexOf(keyword) >= 0) {
      return showResponses[keyword];
    }
  }
  return showResponses.default;
};

const CANNED_RECAPS = {
  loki: {
    1: "**The story so far:** **Loki** escaped New York in 2012 with the Tesseract, got arrested by a cosmic bureaucracy called the TVA, and is now working with analyst **Mobius** to hunt a dangerous variant of himself.\n\n**Key beats:**\n- The TVA resets or 'prunes' anyone who deviates from the Sacred Timeline\n- Loki learns he has no real future — his file shows his own death at the hands of Thanos\n- **Miss Minutes** explains the rules; **Ravonna Renslayer** runs the show\n\n**Watch for:** Who is the mysterious variant killing TVA agents? And why do they look familiar?",
    3: "**The story so far:** Loki escaped the TVA with **Sylvie**, another Loki variant who has been hiding in apocalypses for years. They are now stranded on the dying moon Lamentis-1, trying to escape before it is destroyed.\n\n**Key beats:**\n- Sylvie can **enchant people** — a power Loki does not have\n- They share a moment on a train, singing in Asgardian over stolen wine\n- Sylvie's memories reveal she was taken by the TVA as a child\n\n**Watch for:** What are the TVA actually hiding about their own origins? And can two Lokis really trust each other?"
  },
  wandavision: {
    1: "**The story so far:** **Wanda Maximoff** and **Vision** appear to be living a black-and-white sitcom life in the suburbs of Westview. Something is wrong — but nobody inside the show seems to notice.\n\n**Key beats:**\n- Their nosy neighbor **Agnes** shows up with suspicious timing\n- Vision has a job at 'Computational Services' but does not know what the company does\n- A strange commercial for a Stark Industries toaster breaks the fourth wall\n\n**Watch for:** Who is watching them? And why can no one remember their own backstory?",
    4: "**The story so far:** We now know Westview is a reality Wanda has constructed, and the outside world — SWORD, the FBI, **Monica Rambeau** — is trying to figure out how to get her out.\n\n**Key beats:**\n- **Monica** gets pulled into Westview and then pushed back out\n- **Darcy Lewis** and **Jimmy Woo** identify the 'hex' surrounding the town\n- Vision died before this — so what is Wanda holding onto?\n\n**Watch for:** The line between what Wanda wants and what Wanda knows is about to collapse."
  },
  moonknight: {
    1: "**The story so far:** **Steven Grant**, a mild-mannered gift-shop clerk in London, is losing time, talking in his sleep, and finding himself in dangerous situations he does not remember starting.\n\n**Key beats:**\n- Steven cuffs himself to the bed every night to keep from sleepwalking\n- A stranger in a village calls him 'Marc' and hands him a scarab\n- **Arthur Harrow**, a soft-spoken cult leader, is hunting him\n\n**Watch for:** Who is the other voice in Steven's head? And why does everyone else seem to know him?"
  }
};

const getCannedRecap = function(showId, epNum) {
  const showRecaps = CANNED_RECAPS[showId] || {};
  const available = Object.keys(showRecaps).map(Number).sort(function(a, b) { return b - a; });
  const match = available.find(function(e) { return e <= epNum; });
  return match ? showRecaps[match] : "**The story so far:** You are early in the series — plenty of mystery still to unfold.\n\n**Key beats:**\n- Characters are being introduced\n- The central mystery is being set up\n- Keep watching for more\n\n**Watch for:** More context as you progress.";
};

const fakeAIDelay = function() { return new Promise(function(r) { setTimeout(r, 900 + Math.random() * 700); }); };
// ============ END DEMO MODE ============

const SHOWS = {
  loki: {
    id: "loki",
    title: "Loki",
    year: "2021",
    accent: "#D4AF37",
    gradient: "from-amber-900/40 via-green-900/20 to-slate-900",
    tagline: "A Marvel Studios Series",
    watchingNow: 12847,
    members: "2.4M",
    seasons: [{ number: 1, episodes: [
      { num: 1, title: "Glorious Purpose" },
      { num: 2, title: "The Variant" },
      { num: 3, title: "Lamentis" },
      { num: 4, title: "The Nexus Event" },
      { num: 5, title: "Journey Into Mystery" },
      { num: 6, title: "For All Time. Always." },
    ]}],
  },
  wandavision: {
    id: "wandavision",
    title: "WandaVision",
    year: "2021",
    accent: "#E63946",
    gradient: "from-red-900/40 via-purple-900/20 to-slate-900",
    tagline: "A Marvel Studios Series",
    watchingNow: 8231,
    members: "1.9M",
    seasons: [{ number: 1, episodes: [
      { num: 1, title: "Filmed Before a Live Studio Audience" },
      { num: 2, title: "Don't Touch That Dial" },
      { num: 3, title: "Now in Color" },
      { num: 4, title: "We Interrupt This Program" },
      { num: 5, title: "On a Very Special Episode..." },
      { num: 6, title: "All-New Halloween Spooktacular!" },
      { num: 7, title: "Breaking the Fourth Wall" },
      { num: 8, title: "Previously On" },
      { num: 9, title: "The Series Finale" },
    ]}],
  },
  moonknight: {
    id: "moonknight",
    title: "Moon Knight",
    year: "2022",
    accent: "#C9B37E",
    gradient: "from-stone-800/60 via-amber-950/30 to-slate-900",
    tagline: "A Marvel Studios Series",
    watchingNow: 5412,
    members: "1.3M",
    seasons: [{ number: 1, episodes: [
      { num: 1, title: "The Goldfish Problem" },
      { num: 2, title: "Summon the Suit" },
      { num: 3, title: "The Friendly Type" },
      { num: 4, title: "The Tomb" },
      { num: 5, title: "Asylum" },
      { num: 6, title: "Gods and Monsters" },
    ]}],
  },
};

// Community posts (theories/reactions from fake users)
const COMMUNITY_POSTS = {
  loki: {
    1: [
      { id: "l1-1", author: "tesseract_theorist", avatar: "🦚", badge: "Lore Scholar", time: "2h", type: "theory", title: "The TVA knows more about Loki than they're letting on", body: "The way Mobius just *smiles* when Loki reveals his plans... this isn't his first rodeo with variants.", likes: 1247, replies: 89 },
      { id: "l1-2", author: "mischief_maker", avatar: "🐍", badge: "New Member", time: "5h", type: "reaction", title: "I was NOT emotionally ready for the D.B. Cooper scene", body: "Loki being D.B. Cooper because he lost a bet with Thor is peak MCU comedy.", likes: 3402, replies: 214 },
    ],
    3: [
      { id: "l3-1", author: "sylvie_stan", avatar: "🗡️", badge: "Day-One Fan", time: "1h", type: "reaction", title: "The train scene. That's it. That's the post.", body: "Two Lokis, one train, one bottle of wine, singing in Asgardian. Every frame is cinema.", likes: 5821, replies: 412 },
      { id: "l3-2", author: "tesseract_theorist", avatar: "🦚", badge: "Lore Scholar", time: "3h", type: "theory", title: "Sylvie isn't like other variants", body: "She enchants people. Original Loki can't do that. She's been hiding from the TVA for YEARS.", likes: 2103, replies: 267 },
    ],
  },
  wandavision: {
    1: [{ id: "w1-1", author: "scarlet_witch_99", avatar: "🔮", badge: "Lore Scholar", time: "2h", type: "theory", title: "That 'For the children' line is NOT just a gag", body: "Wanda pausing. The look on her face. Something happened to her kids in a reality she's burying.", likes: 4102, replies: 331 }],
    4: [{ id: "w4-1", author: "westview_watcher", avatar: "📡", badge: "Theory Crafter", time: "45m", type: "theory", title: "Wanda is the one broadcasting", body: "Monica's line — 'it's Wanda, it's all Wanda' — was the whole reveal.", likes: 6241, replies: 503 }],
  },
  moonknight: {
    1: [{ id: "mk1-1", author: "khonshu_listener", avatar: "🪨", badge: "Lore Scholar", time: "3h", type: "theory", title: "Steven has DID and the 'voice' is Marc Spector", body: "The pillow cuffed to ankles. Sand in the shoe. He's losing time.", likes: 3401, replies: 287 }],
  },
};

// Seed "other users" reviews (power the community feel and activity feed)
const SEED_REVIEWS = [
  { id: "r1", user: "mischief_maker", avatar: "🐍", showId: "loki", epNum: 1, rating: 5, text: "loki being d.b. cooper because he lost a bet with thor is peak cinema", likes: 3402, time: "2h" },
  { id: "r2", user: "sylvie_stan", avatar: "🗡️", showId: "loki", epNum: 3, rating: 5, text: "two lokis, one train, one bottle of wine. every frame is gold.", likes: 5821, time: "4h" },
  { id: "r3", user: "tesseract_theorist", avatar: "🦚", showId: "loki", epNum: 3, rating: 4, text: "sylvie enchants people. that's not a loki trick. we need answers.", likes: 2103, time: "6h" },
  { id: "r4", user: "scarlet_witch_99", avatar: "🔮", showId: "wandavision", epNum: 1, rating: 4, text: "the 'for the children' line hit way too hard for a sitcom pilot", likes: 4102, time: "3h" },
  { id: "r5", user: "westview_watcher", avatar: "📡", showId: "wandavision", epNum: 4, rating: 5, text: "it's wanda. it's all wanda. goosebumps.", likes: 6241, time: "1h" },
  { id: "r6", user: "london_lurker", avatar: "🎭", showId: "moonknight", epNum: 1, rating: 5, text: "OSCAR. ISAAC. BRITISH. ACCENT.", likes: 4102, time: "5h" },
  { id: "r7", user: "khonshu_listener", avatar: "🪨", showId: "moonknight", epNum: 1, rating: 4, text: "sand in the shoe. cuffed to the bed. they told us everything in 5 minutes.", likes: 3401, time: "7h" },
];

// Seed "friends" activity — things other users are doing besides reviewing
const SEED_ACTIVITY = [
  { id: "a1", user: "tesseract_theorist", avatar: "🦚", action: "posted a theory", target: "The TVA knows more than they're letting on", showId: "loki", epNum: 1, time: "2h" },
  { id: "a2", user: "sylvie_stan", avatar: "🗡️", action: "added to list", target: "MCU Train Scenes Ranked", time: "4h" },
  { id: "a3", user: "mischief_maker", avatar: "🐍", action: "started following", target: "you", time: "6h" },
  { id: "a4", user: "scarlet_witch_99", avatar: "🔮", action: "created a list", target: "Grief in the MCU — A Syllabus", time: "8h" },
  { id: "a5", user: "westview_watcher", avatar: "📡", action: "liked your review", target: "", time: "1d" },
];

// Full user profiles — what friends have watched. Powers the "visit someone's profile" feature.
const USER_PROFILES = {
  tesseract_theorist: {
    username: "tesseract_theorist",
    displayName: "Bea Lindqvist",
    avatar: "🦚",
    bio: "Time is a flat circle. So is my watchlist.",
    badge: "Lore Scholar",
    followers: 14200,
    following: 312,
    episodesWatched: [
      { showId: "loki", epNum: 1, rating: 5, date: Date.now() - 86400000 * 2, text: "mobius knows more than he's showing. rewatching." },
      { showId: "loki", epNum: 2, rating: 5, date: Date.now() - 86400000 * 2 },
      { showId: "loki", epNum: 3, rating: 4, date: Date.now() - 86400000 * 1, text: "sylvie enchants people. that's not a loki trick. we need answers." },
      { showId: "wandavision", epNum: 1, rating: 5, date: Date.now() - 86400000 * 9 },
      { showId: "wandavision", epNum: 2, rating: 4, date: Date.now() - 86400000 * 9 },
      { showId: "wandavision", epNum: 3, rating: 5, date: Date.now() - 86400000 * 8 },
      { showId: "wandavision", epNum: 4, rating: 5, date: Date.now() - 86400000 * 7 },
      { showId: "moonknight", epNum: 1, rating: 4, date: Date.now() - 86400000 * 14 },
    ],
  },
  sylvie_stan: {
    username: "sylvie_stan",
    displayName: "Jess Moreno",
    avatar: "🗡️",
    bio: "Nexus events are my love language.",
    badge: "Day-One Fan",
    followers: 8700,
    following: 189,
    episodesWatched: [
      { showId: "loki", epNum: 1, rating: 4, date: Date.now() - 86400000 * 3 },
      { showId: "loki", epNum: 2, rating: 5, date: Date.now() - 86400000 * 3 },
      { showId: "loki", epNum: 3, rating: 5, date: Date.now() - 86400000 * 1, text: "two lokis, one train, one bottle of wine. every frame is gold." },
      { showId: "wandavision", epNum: 1, rating: 3, date: Date.now() - 86400000 * 12 },
    ],
  },
  mischief_maker: {
    username: "mischief_maker",
    displayName: "Ravi Patel",
    avatar: "🐍",
    bio: "Chaotic good. Mostly chaotic.",
    badge: "New Member",
    followers: 420,
    following: 88,
    episodesWatched: [
      { showId: "loki", epNum: 1, rating: 5, date: Date.now() - 86400000 * 2, text: "loki being d.b. cooper because he lost a bet with thor is peak cinema" },
    ],
  },
  scarlet_witch_99: {
    username: "scarlet_witch_99",
    displayName: "Maya Thompson",
    avatar: "🔮",
    bio: "Grief writes better plot than most showrunners.",
    badge: "Lore Scholar",
    followers: 22100,
    following: 445,
    episodesWatched: [
      { showId: "wandavision", epNum: 1, rating: 4, date: Date.now() - 86400000 * 4, text: "the 'for the children' line hit way too hard for a sitcom pilot" },
      { showId: "wandavision", epNum: 2, rating: 4, date: Date.now() - 86400000 * 4 },
      { showId: "wandavision", epNum: 3, rating: 5, date: Date.now() - 86400000 * 3 },
      { showId: "wandavision", epNum: 4, rating: 5, date: Date.now() - 86400000 * 2 },
      { showId: "wandavision", epNum: 5, rating: 5, date: Date.now() - 86400000 * 2 },
      { showId: "loki", epNum: 1, rating: 4, date: Date.now() - 86400000 * 20 },
    ],
  },
  westview_watcher: {
    username: "westview_watcher",
    displayName: "Kai Nakamura",
    avatar: "📡",
    bio: "It was Agatha all along, probably.",
    badge: "Theory Crafter",
    followers: 5400,
    following: 267,
    episodesWatched: [
      { showId: "wandavision", epNum: 4, rating: 5, date: Date.now() - 86400000 * 1, text: "it's wanda. it's all wanda. goosebumps." },
      { showId: "wandavision", epNum: 3, rating: 4, date: Date.now() - 86400000 * 2 },
    ],
  },
  khonshu_listener: {
    username: "khonshu_listener",
    displayName: "Sam Ortega",
    avatar: "🪨",
    bio: "The body remembers. So do I.",
    badge: "Lore Scholar",
    followers: 9100,
    following: 203,
    episodesWatched: [
      { showId: "moonknight", epNum: 1, rating: 4, date: Date.now() - 86400000 * 7, text: "sand in the shoe. cuffed to the bed. they told us everything in 5 minutes." },
    ],
  },
  london_lurker: {
    username: "london_lurker",
    displayName: "Alex Fielding",
    avatar: "🎭",
    bio: "British accents are a personal attack.",
    badge: "Casual Viewer",
    followers: 1100,
    following: 412,
    episodesWatched: [
      { showId: "moonknight", epNum: 1, rating: 5, date: Date.now() - 86400000 * 5, text: "OSCAR. ISAAC. BRITISH. ACCENT." },
    ],
  },
};

// Pre-made lists from the community (seed content for discovery)
const SEED_LISTS = [
  { id: "sl1", title: "MCU Watch Order (Phase 4 TV)", author: "mcu_completionist", avatar: "🎬", count: 7, likes: 12400, description: "The definitive chronological order for all Disney+ series." },
  { id: "sl2", title: "Shows That Play With Reality", author: "meta_maven", avatar: "🌀", count: 5, likes: 8200, description: "WandaVision, Moon Knight, Legion — when TV bends the rules." },
  { id: "sl3", title: "Grief in the MCU — A Syllabus", author: "scarlet_witch_99", avatar: "🔮", count: 4, likes: 15600, description: "Wanda, Steve, Tony. The saddest shows and movies." },
];

// TRIVIA — episode-scoped easter eggs, references, and nerd-bait facts.
// Each trivia card has a minEpisode gate so spoiler rules stay intact.
// "card" entries are browsable. "quiz" entries are Q&A pairs for voice quiz mode.
const TRIVIA = {
  loki: [
    // Episode 1 trivia — safe for anyone who started the show
    {
      id: "l-t1",
      minEp: 1,
      category: "Easter Egg",
      icon: "🥤",
      title: "D.B. Cooper was Loki",
      body: "The 1971 plane hijacker who vanished with $200k? Loki reveals he did it because he lost a bet to Thor. In real life, it's still one of the FBI's most famous unsolved cases.",
      source: "Episode 1",
    },
    {
      id: "l-t2",
      minEp: 1,
      category: "Design",
      icon: "⏱️",
      title: "The TVA's aesthetic is 1970s bureaucracy on purpose",
      body: "Director Kate Herron drew inspiration from Mad Men, Brazil (1985), and the IRS. Those fluorescent lights and manila folders? Deliberately oppressive.",
      source: "Behind the scenes",
    },
    {
      id: "l-t3",
      minEp: 1,
      category: "Comics Ref",
      icon: "📚",
      title: "Miss Minutes is an original creation",
      body: "She doesn't exist in the comics. Loki creators invented her specifically to explain the TVA's rules — and she's voiced by Tara Strong (Bubbles from Powerpuff Girls, Harley Quinn).",
      source: "Episode 1",
    },
    {
      id: "l-t4",
      minEp: 1,
      category: "Mythology",
      icon: "🗿",
      title: "The Time-Keepers' three-headed design",
      body: "In Norse myth, the Norns — three goddesses of fate — weave the threads of destiny. The Time-Keepers' trinity is a direct echo of that. Plus a wink at the Doctor Strange cut from 2016.",
      source: "Episode 1",
    },
    // Episode 2
    {
      id: "l-t5",
      minEp: 2,
      category: "Easter Egg",
      icon: "🏛️",
      title: "The Renaissance Faire reference",
      body: "When Mobius finds Loki at the Renaissance Faire in Oshkosh, Wisconsin — real place, real annual festival. The location is so specific it's almost a Coen Brothers setup.",
      source: "Episode 2",
    },
    {
      id: "l-t6",
      minEp: 2,
      category: "Comics Ref",
      icon: "📜",
      title: "The Pompeii volcano gag is deep lore",
      body: "Loki confirming apocalypses are 'safe' branches by causing chaos in Pompeii isn't just a joke — it's based on a comics plot point where time travelers routinely use disasters as cover.",
      source: "Episode 2",
    },
    // Episode 3
    {
      id: "l-t7",
      minEp: 3,
      category: "Character",
      icon: "🗡️",
      title: "Sylvie is inspired by two comics characters",
      body: "She's part Sylvie Lushton (Enchantress II from Dark Reign comics) and part Lady Loki (Journey Into Mystery #5). The show blended them into something new.",
      source: "Episode 3",
    },
    {
      id: "l-t8",
      minEp: 3,
      category: "Music",
      icon: "🎵",
      title: "The train song is in Asgardian",
      body: "Loki and Sylvie sing a folk song on the train to Lamentis-1. It was written specifically for the show in a constructed Asgardian dialect — fans made full translations within hours.",
      source: "Episode 3",
    },
    {
      id: "l-t9",
      minEp: 3,
      category: "Hidden Joke",
      icon: "🌙",
      title: "Lamentis-1's name is a clue",
      body: "'Lamentis' comes from the Latin *lamentari* — to lament, to mourn. The planet's entire purpose in the plot is to be a place where doom is certain. The writers named it after grief.",
      source: "Episode 3",
    },
  ],
};

// Voice quiz questions — episode-scoped, open-ended so voice answers feel natural.
// "acceptable" is a list of keywords/phrases that mark a correct answer.
const QUIZ_QUESTIONS = {
  loki: [
    {
      id: "q1",
      minEp: 1,
      question: "Which famous unsolved American hijacking did Loki reveal he was behind?",
      acceptable: ["d.b. cooper", "db cooper", "d b cooper", "cooper"],
      answer: "D.B. Cooper — the 1971 skyjacker who parachuted out of a plane with $200,000 and vanished. Loki did it on a bet with Thor.",
      difficulty: "Easy",
    },
    {
      id: "q2",
      minEp: 1,
      question: "What's the name of the orange cartoon mascot who explains the rules of the TVA?",
      acceptable: ["miss minutes", "minutes", "ms minutes"],
      answer: "Miss Minutes. She's voiced by Tara Strong — best known for Bubbles in Powerpuff Girls and Harley Quinn.",
      difficulty: "Easy",
    },
    {
      id: "q3",
      minEp: 1,
      question: "What organization did the Time Variance Authority's visual style take inspiration from?",
      acceptable: ["irs", "tax", "dmv", "bureaucracy", "1970s office", "mad men", "brazil"],
      answer: "Director Kate Herron modeled it on 1970s bureaucracies — the IRS, Mad Men, and the film Brazil. That's why it feels so oppressive.",
      difficulty: "Medium",
    },
    {
      id: "q4",
      minEp: 2,
      question: "Why does Loki say apocalypses are safe places for variants to hide?",
      acceptable: ["everyone dies", "no branches", "no one survives", "timeline ends", "doesn't branch", "erased"],
      answer: "Because everyone and everything dies anyway — there's no timeline branch to protect. The changes get erased by the disaster.",
      difficulty: "Medium",
    },
    {
      id: "q5",
      minEp: 3,
      question: "What planet are Loki and Sylvie stranded on in episode 3?",
      acceptable: ["lamentis", "lamentis-1", "lamentis 1"],
      answer: "Lamentis-1. The name comes from the Latin word for 'to mourn' — the writers literally named the planet after grief.",
      difficulty: "Easy",
    },
    {
      id: "q6",
      minEp: 3,
      question: "Sylvie has a power original Loki doesn't. What is it?",
      acceptable: ["enchant", "enchantment", "mind control", "control minds", "hypnosis", "possess"],
      answer: "Enchantment — she can take over people's minds with a touch. That's a power Loki himself can't do, hinting she's had very different experiences.",
      difficulty: "Hard",
    },
  ],
};

const getTrivia = (showId, epNum) => {
  const all = TRIVIA[showId] || [];
  return all.filter((t) => t.minEp <= epNum);
};

const getQuizQuestions = (showId, epNum) => {
  const all = QUIZ_QUESTIONS[showId] || [];
  return all.filter((q) => q.minEp <= epNum);
};

const LIVE_VIEWERS = [
  { name: "alex_k", avatar: "🎬" }, { name: "mira", avatar: "🌌" }, { name: "jordan", avatar: "🚀" },
  { name: "sam_b", avatar: "🌙" }, { name: "nova", avatar: "⚡" }, { name: "theo", avatar: "🔥" },
];

const CHARACTER_MAPS = {
  loki: {
    1: { characters: [
      { id: "loki", name: "Loki", role: "The Variant", x: 50, y: 50, size: 28, color: "#D4AF37" },
      { id: "mobius", name: "Mobius", role: "TVA Analyst", x: 22, y: 30, size: 22, color: "#5B9EFF" },
      { id: "ravonna", name: "Ravonna", role: "TVA Judge", x: 78, y: 28, size: 20, color: "#A78BFA" },
      { id: "hunter-b15", name: "Hunter B-15", role: "TVA Hunter", x: 80, y: 70, size: 18, color: "#F87171" },
      { id: "miss-minutes", name: "Miss Minutes", role: "TVA Mascot", x: 20, y: 72, size: 16, color: "#FBBF24" },
    ], links: [
      { from: "loki", to: "mobius" }, { from: "mobius", to: "ravonna" },
      { from: "hunter-b15", to: "loki" }, { from: "miss-minutes", to: "loki" },
    ]},
    3: { characters: [
      { id: "loki", name: "Loki", role: "Variant L1130", x: 35, y: 50, size: 28, color: "#D4AF37" },
      { id: "sylvie", name: "Sylvie", role: "The Variant", x: 65, y: 50, size: 26, color: "#10B981" },
      { id: "mobius", name: "Mobius", role: "TVA Ally", x: 15, y: 25, size: 20, color: "#5B9EFF" },
      { id: "ravonna", name: "Ravonna", role: "TVA Judge", x: 85, y: 22, size: 18, color: "#A78BFA" },
      { id: "hunter-b15", name: "Hunter B-15", role: "TVA Hunter", x: 85, y: 78, size: 18, color: "#F87171" },
      { id: "miss-minutes", name: "Miss Minutes", role: "TVA AI", x: 15, y: 78, size: 14, color: "#FBBF24" },
    ], links: [
      { from: "loki", to: "sylvie" }, { from: "loki", to: "mobius" },
      { from: "sylvie", to: "hunter-b15" }, { from: "mobius", to: "ravonna" },
    ]},
  },
  wandavision: {
    1: { characters: [
      { id: "wanda", name: "Wanda", role: "Newlywed", x: 35, y: 50, size: 28, color: "#E63946" },
      { id: "vision", name: "Vision", role: "Husband", x: 65, y: 50, size: 26, color: "#F59E0B" },
      { id: "agnes", name: "Agnes", role: "Nosy Neighbor", x: 50, y: 22, size: 20, color: "#A78BFA" },
      { id: "mr-hart", name: "Mr. Hart", role: "Boss", x: 20, y: 78, size: 16, color: "#6B7280" },
      { id: "mrs-hart", name: "Mrs. Hart", role: "Boss's Wife", x: 80, y: 78, size: 16, color: "#6B7280" },
    ], links: [
      { from: "wanda", to: "vision" }, { from: "agnes", to: "wanda" },
      { from: "vision", to: "mr-hart" }, { from: "mr-hart", to: "mrs-hart" },
    ]},
    4: { characters: [
      { id: "wanda", name: "Wanda", role: "Inside Westview", x: 30, y: 45, size: 28, color: "#E63946" },
      { id: "vision", name: "Vision", role: "Inside Westview", x: 55, y: 45, size: 24, color: "#F59E0B" },
      { id: "monica", name: "Monica", role: "SWORD Agent", x: 78, y: 25, size: 22, color: "#60A5FA" },
      { id: "darcy", name: "Darcy", role: "Astrophysicist", x: 78, y: 60, size: 20, color: "#A78BFA" },
      { id: "jimmy", name: "Jimmy Woo", role: "FBI Agent", x: 78, y: 85, size: 20, color: "#F97316" },
      { id: "agnes", name: "Agnes", role: "Neighbor", x: 18, y: 25, size: 18, color: "#EC4899" },
    ], links: [
      { from: "wanda", to: "vision" }, { from: "monica", to: "darcy" },
      { from: "monica", to: "jimmy" }, { from: "monica", to: "wanda" },
      { from: "agnes", to: "wanda" },
    ]},
  },
  moonknight: {
    1: { characters: [
      { id: "steven", name: "Steven Grant", role: "Gift Shop Clerk", x: 50, y: 45, size: 28, color: "#C9B37E" },
      { id: "marc", name: "Marc (?)", role: "The Voice", x: 50, y: 78, size: 18, color: "#6366F1" },
      { id: "harrow", name: "Arthur Harrow", role: "Cult Leader", x: 78, y: 35, size: 22, color: "#059669" },
      { id: "gus", name: "Gus", role: "Steven's Fish", x: 18, y: 72, size: 12, color: "#60A5FA" },
      { id: "donna", name: "Donna", role: "Steven's Boss", x: 22, y: 28, size: 14, color: "#9CA3AF" },
    ], links: [
      { from: "steven", to: "marc" }, { from: "steven", to: "harrow" },
      { from: "steven", to: "donna" }, { from: "steven", to: "gus" },
    ]},
  },
};

const getCharacterMap = (showId, epNum) => {
  const maps = CHARACTER_MAPS[showId];
  if (!maps) return null;
  const available = Object.keys(maps).map(Number).sort((a, b) => b - a);
  const bestMatch = available.find((e) => e <= epNum);
  return bestMatch ? maps[bestMatch] : null;
};

const getCommunityPosts = (showId, epNum) => {
  const posts = COMMUNITY_POSTS[showId];
  if (!posts) return [];
  const allEpisodes = Object.keys(posts).map(Number).sort((a, b) => b - a);
  const applicable = allEpisodes.filter((e) => e <= epNum);
  return applicable.flatMap((e) => posts[e] || []);
};

const getReviews = (showId, epNum) => {
  return SEED_REVIEWS.filter((r) => r.showId === showId && r.epNum === epNum);
};

const detectConfusion = (text) => {
  const signals = [];
  const lower = text.toLowerCase();
  if (/\b(wait|huh|what|confused|lost|don'?t (get|understand))\b/.test(lower)) signals.push("explicit_confusion");
  if (/\b(who|which|what) (is|are|was|were) (that|this|they|he|she)\b/.test(lower)) signals.push("character_identity");
  if (/\b(how|why) (does|did|is|are|do) .* (connect|relate|tie|link)/.test(lower)) signals.push("plot_connection");
  if (/\b(recap|remind|remember|forgot)\b/.test(lower)) signals.push("memory_gap");
  if (/\?.*\?/.test(text)) signals.push("multi_question");
  return signals;
};

// Cinematic show artwork — custom SVG per show, designed to feel like a title card.
// Each poster uses the show's accent color, iconography, and typography cues.
const ShowArtwork = ({ showId, className = "", variant = "card" }) => {
  // variant: "card" = home list tile, "banner" = wide episode header, "thumb" = tiny square
  if (showId === "loki") {
    return (
      <svg
        viewBox="0 0 400 240"
        className={className}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="lokiBg" cx="30%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#4A3018" />
            <stop offset="45%" stopColor="#1A1410" />
            <stop offset="100%" stopColor="#050303" />
          </radialGradient>
          <linearGradient id="lokiGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5D682" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8B6914" />
          </linearGradient>
          <filter id="lokiGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="lokiGrain" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="transparent" />
            <circle cx="1" cy="1" r="0.3" fill="#D4AF37" opacity="0.08" />
          </pattern>
        </defs>
        <rect width="400" height="240" fill="url(#lokiBg)" />
        <rect width="400" height="240" fill="url(#lokiGrain)" />

        {/* Ornate clock motif — TVA */}
        <g transform="translate(300, 120)" opacity="0.35">
          <circle cx="0" cy="0" r="90" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="75" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="60" fill="none" stroke="#D4AF37" strokeWidth="0.3" />
          {[...Array(12)].map((_, i) => {
            const a = (i * 30 - 90) * (Math.PI / 180);
            return (
              <line
                key={i}
                x1={Math.cos(a) * 75}
                y1={Math.sin(a) * 75}
                x2={Math.cos(a) * 90}
                y2={Math.sin(a) * 90}
                stroke="#D4AF37"
                strokeWidth={i % 3 === 0 ? "1.5" : "0.8"}
              />
            );
          })}
          <line x1="0" y1="0" x2="0" y2="-55" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="0" x2="35" y2="20" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="0" cy="0" r="3" fill="#D4AF37" />
        </g>

        {/* Horn silhouette (Loki's crown) */}
        <g transform="translate(75, 80)" opacity="0.55" filter="url(#lokiGlow)">
          <path
            d="M 0 80 Q -5 40 -15 20 Q -25 0 -35 -10 L -20 -5 Q -10 10 0 30 Q 10 10 20 -5 L 35 -10 Q 25 0 15 20 Q 5 40 0 80 Z"
            fill="url(#lokiGold)"
          />
        </g>

        {/* Title */}
        <text
          x="45"
          y="205"
          fontFamily="'Trajan Pro', 'Cinzel', serif"
          fontSize="48"
          fontWeight="700"
          fill="url(#lokiGold)"
          letterSpacing="8"
        >
          LOKI
        </text>
        <text
          x="46"
          y="225"
          fontFamily="'Courier New', monospace"
          fontSize="8"
          fill="#D4AF37"
          opacity="0.6"
          letterSpacing="3"
        >
          FOR ALL TIME. ALWAYS.
        </text>

        {/* Scan lines */}
        <g opacity="0.04">
          {[...Array(60)].map((_, i) => (
            <line key={i} x1="0" y1={i * 4} x2="400" y2={i * 4} stroke="#fff" strokeWidth="0.5" />
          ))}
        </g>
      </svg>
    );
  }

  if (showId === "wandavision") {
    return (
      <svg
        viewBox="0 0 400 240"
        className={className}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="wvBg" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#5C1222" />
            <stop offset="55%" stopColor="#2A0810" />
            <stop offset="100%" stopColor="#0C0206" />
          </radialGradient>
          <linearGradient id="wvRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5266" />
            <stop offset="100%" stopColor="#B91C30" />
          </linearGradient>
          <pattern id="wvHex" width="28" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z"
              fill="none"
              stroke="#E63946"
              strokeWidth="0.4"
              opacity="0.18"
            />
          </pattern>
          <filter id="wvVignette">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <rect width="400" height="240" fill="url(#wvBg)" />
        <rect width="400" height="240" fill="url(#wvHex)" />

        {/* Retro TV frame */}
        <g transform="translate(200, 120)">
          <rect
            x="-145"
            y="-78"
            width="290"
            height="156"
            rx="8"
            fill="none"
            stroke="#E63946"
            strokeWidth="1.2"
            opacity="0.4"
          />
          <rect
            x="-138"
            y="-71"
            width="276"
            height="142"
            rx="4"
            fill="none"
            stroke="#E63946"
            strokeWidth="0.6"
            opacity="0.25"
          />
          {/* TV static overlay */}
          {[...Array(15)].map((_, i) => (
            <line
              key={i}
              x1="-138"
              y1={-71 + i * 10}
              x2="138"
              y2={-71 + i * 10}
              stroke="#fff"
              strokeWidth="0.3"
              opacity="0.05"
            />
          ))}
        </g>

        {/* Scarlet Witch crown silhouette */}
        <g transform="translate(200, 95)" opacity="0.85">
          <path
            d="M -40 0 L -30 -20 L -20 -8 L -10 -28 L 0 -12 L 10 -28 L 20 -8 L 30 -20 L 40 0 Z"
            fill="url(#wvRed)"
          />
          <circle cx="0" cy="-5" r="3" fill="#FFD700" opacity="0.7" />
        </g>

        {/* Double V title */}
        <text
          x="200"
          y="165"
          fontFamily="'Bodoni 72', 'Didot', serif"
          fontSize="30"
          fontWeight="700"
          fill="#fff"
          textAnchor="middle"
          letterSpacing="4"
        >
          WANDA
        </text>
        <text
          x="200"
          y="190"
          fontFamily="'Bodoni 72', 'Didot', serif"
          fontSize="30"
          fontWeight="700"
          fill="url(#wvRed)"
          textAnchor="middle"
          letterSpacing="4"
        >
          VISION
        </text>
        <line x1="160" y1="200" x2="240" y2="200" stroke="#E63946" strokeWidth="0.6" opacity="0.5" />
        <text
          x="200"
          y="215"
          fontFamily="'Courier New', monospace"
          fontSize="7"
          fill="#E63946"
          textAnchor="middle"
          letterSpacing="3"
          opacity="0.7"
        >
          A STRANGE NEW REALITY
        </text>

        {/* Vignette corners */}
        <radialGradient id="wvVig" cx="50%" cy="50%" r="60%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
        <rect width="400" height="240" fill="url(#wvVig)" />
      </svg>
    );
  }

  if (showId === "moonknight") {
    return (
      <svg
        viewBox="0 0 400 240"
        className={className}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mkBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1C1810" />
            <stop offset="60%" stopColor="#0A0806" />
            <stop offset="100%" stopColor="#030201" />
          </linearGradient>
          <radialGradient id="mkMoon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F4E9CE" />
            <stop offset="85%" stopColor="#C9B37E" />
            <stop offset="100%" stopColor="#8B7B4A" />
          </radialGradient>
          <filter id="mkGlow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <pattern id="mkSand" width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="3" height="3" fill="transparent" />
            <circle cx="1.5" cy="1.5" r="0.4" fill="#C9B37E" opacity="0.06" />
          </pattern>
        </defs>
        <rect width="400" height="240" fill="url(#mkBg)" />
        <rect width="400" height="240" fill="url(#mkSand)" />

        {/* Moon with glow */}
        <g transform="translate(310, 100)">
          <circle cx="0" cy="0" r="70" fill="#C9B37E" opacity="0.15" filter="url(#mkGlow)" />
          <circle cx="0" cy="0" r="55" fill="#C9B37E" opacity="0.25" filter="url(#mkGlow)" />
          <circle cx="0" cy="0" r="45" fill="url(#mkMoon)" />
          {/* Crater shadows */}
          <circle cx="-12" cy="-8" r="4" fill="#000" opacity="0.15" />
          <circle cx="10" cy="12" r="6" fill="#000" opacity="0.12" />
          <circle cx="-8" cy="15" r="3" fill="#000" opacity="0.18" />
          <circle cx="18" cy="-15" r="2.5" fill="#000" opacity="0.1" />
        </g>

        {/* Egyptian hieroglyph-style eye (Khonshu reference) */}
        <g transform="translate(80, 95)" opacity="0.7">
          {/* Eye of Horus simplified */}
          <path
            d="M -30 0 Q -15 -20 0 -20 Q 15 -20 25 0 Q 15 8 0 8 Q -15 8 -30 0 Z"
            fill="none"
            stroke="#C9B37E"
            strokeWidth="2"
          />
          <circle cx="-2" cy="-6" r="6" fill="#C9B37E" />
          <circle cx="-2" cy="-6" r="3" fill="#000" />
          {/* Lower strokes */}
          <path d="M -30 0 Q -35 10 -38 18" fill="none" stroke="#C9B37E" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M 10 8 Q 15 18 20 24 M 15 10 L 28 18"
            fill="none"
            stroke="#C9B37E"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* Pyramidal geometric elements */}
        <g opacity="0.3">
          <polygon points="0,240 60,170 120,240" fill="#C9B37E" />
          <polygon points="100,240 180,160 260,240" fill="#8B7B4A" />
          <polygon points="240,240 310,185 380,240" fill="#C9B37E" />
        </g>

        {/* Title */}
        <text
          x="200"
          y="155"
          fontFamily="'Copperplate Gothic', 'Trajan Pro', serif"
          fontSize="36"
          fontWeight="700"
          fill="#C9B37E"
          textAnchor="middle"
          letterSpacing="6"
        >
          MOON KNIGHT
        </text>
        <line x1="100" y1="168" x2="300" y2="168" stroke="#C9B37E" strokeWidth="0.5" opacity="0.5" />
        <text
          x="200"
          y="185"
          fontFamily="'Courier New', monospace"
          fontSize="7"
          fill="#C9B37E"
          textAnchor="middle"
          letterSpacing="4"
          opacity="0.7"
        >
          EMBRACE THE CHAOS
        </text>
      </svg>
    );
  }

  return null;
};

// Star rating component
const StarRating = ({ value, onChange, size = 16, readonly = false }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = (hover || value) >= i;
        return (
          <button
            key={i}
            disabled={readonly}
            onMouseEnter={() => !readonly && setHover(i)}
            onMouseLeave={() => !readonly && setHover(0)}
            onClick={() => !readonly && onChange(i === value ? 0 : i)}
            className={readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}
          >
            <Star
              style={{
                width: size,
                height: size,
                fill: filled ? "#D4AF37" : "none",
                color: filled ? "#D4AF37" : "#444",
              }}
            />
          </button>
        );
      })}
    </div>
  );
};

function LoreDemo() {
  const [screen, setScreen] = useState("home");
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [tab, setTab] = useState("community");
  const [mainTab, setMainTab] = useState("home"); // bottom nav: home, vault, lists, activity
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recapContent, setRecapContent] = useState("");
  const [recapLoading, setRecapLoading] = useState(false);
  const [hoveredChar, setHoveredChar] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likedReviews, setLikedReviews] = useState(new Set());

  // User's own reviews/diary
  const [myReviews, setMyReviews] = useState([]); // { showId, epNum, rating, text, date }
  const [reviewDraft, setReviewDraft] = useState({ rating: 0, text: "" });
  const [showReviewSheet, setShowReviewSheet] = useState(false);

  // User's custom lists
  const [myLists, setMyLists] = useState([
    { id: "ml1", title: "Shows that made me cry", emoji: "😭", items: [], created: Date.now() - 86400000 * 7 },
    { id: "ml2", title: "Best plot twists", emoji: "🤯", items: [], created: Date.now() - 86400000 * 3 },
  ]);
  const [showNewListSheet, setShowNewListSheet] = useState(false);
  const [newListDraft, setNewListDraft] = useState({ title: "", emoji: "🎬" });
  const [showAddToListSheet, setShowAddToListSheet] = useState(null); // the ep to add

  // Following
  const [following, setFollowing] = useState(new Set(["tesseract_theorist", "sylvie_stan"]));

  // Viewing another user's profile (null = viewing your own)
  const [viewingProfile, setViewingProfile] = useState(null);
  const [profileTab, setProfileTab] = useState("watched"); // watched, reviews

  const [analytics, setAnalytics] = useState({
    totalQuestions: 0, signalCounts: {}, questionsByEpisode: {}, recentQuestions: [],
  });

  // Voice-first state
  const [voiceMode, setVoiceMode] = useState("idle"); // idle, listening, processing, speaking
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceOverlayOpen, setVoiceOverlayOpen] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0); // 0-1 for waveform
  const recognitionRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const audioAnimRef = useRef(null);
  const lastSpokenRef = useRef("");

  // Trivia / Quiz state
  const [quizMode, setQuizMode] = useState(false); // true when user is in quiz
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(null); // null, "correct", "incorrect"
  const [quizUserAnswer, setQuizUserAnswer] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);

  // Check speech recognition availability
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setVoiceSupported(false);
  }, []);

  // Text-to-Speech — the app speaks back
  const speak = (text) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    // Strip markdown for natural speech
    const clean = text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/[🛡️🎬🐍🗡️🦚🔮📡🪨🎭]/g, "");
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.02;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    // Prefer a pleasant voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /Samantha|Karen|Aria|Jenny|Serena/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (preferred) utter.voice = preferred;
    utter.onstart = () => setVoiceMode("speaking");
    utter.onend = () => {
      setVoiceMode("idle");
      lastSpokenRef.current = "";
    };
    lastSpokenRef.current = clean;
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setVoiceMode("idle");
  };

  // Waveform animation from real mic input
  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((s, v) => s + v, 0) / data.length;
        setAudioLevel(Math.min(1, avg / 80));
        audioAnimRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      // Mic denied — visualization will just be flat, that's ok
    }
  };

  const stopAudioVisualization = () => {
    if (audioAnimRef.current) cancelAnimationFrame(audioAnimRef.current);
    if (audioCtxRef.current) audioCtxRef.current.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
    setAudioLevel(0);
  };

  // Voice command parser — handles actions locally before falling back to Claude
  const parseVoiceCommand = (text) => {
    const lower = text.toLowerCase().trim();
    // "rate this 5 stars" / "rate it four" / "five stars"
    const ratingMatch =
      lower.match(/rate (?:this|it) (\d|one|two|three|four|five)(?:\s*stars?)?/) ||
      lower.match(/(\d|one|two|three|four|five)\s*stars?/);
    if (ratingMatch && selectedShow && selectedEpisode) {
      const wordMap = { one: 1, two: 2, three: 3, four: 4, five: 5 };
      const n = parseInt(ratingMatch[1]) || wordMap[ratingMatch[1]];
      if (n >= 1 && n <= 5) {
        const existing = myReviews.findIndex(
          (r) => r.showId === selectedShow.id && r.epNum === selectedEpisode.num
        );
        const entry = {
          showId: selectedShow.id,
          showTitle: selectedShow.title,
          showAccent: selectedShow.accent,
          epNum: selectedEpisode.num,
          epTitle: selectedEpisode.title,
          rating: n,
          text: "",
          date: Date.now(),
        };
        if (existing >= 0) {
          const updated = [...myReviews];
          updated[existing] = { ...updated[existing], rating: n, date: Date.now() };
          setMyReviews(updated);
        } else {
          setMyReviews([entry, ...myReviews]);
        }
        return { action: "rated", reply: `Got it — ${n} ${n === 1 ? "star" : "stars"} for this episode.` };
      }
    }
    // "recap this episode" / "give me a recap"
    if (/\b(recap|catch me up|what happened)\b/.test(lower) && selectedShow && selectedEpisode) {
      generateRecap();
      return { action: "recap", reply: "Pulling up the recap now." };
    }
    // "show me the character map" / "who's who"
    if (/\b(character map|who'?s who|show.*characters)\b/.test(lower) && selectedShow && selectedEpisode) {
      setTab("map");
      return { action: "map", reply: "Here's the character map." };
    }
    // "go home" / "home screen"
    if (/\b(go home|home screen|back home)\b/.test(lower)) {
      setScreen("home");
      setMainTab("home");
      return { action: "nav", reply: "Home." };
    }
    // "show my vault" / "my diary"
    if (/\b(my vault|my diary|what.*(watched|logged))\b/.test(lower)) {
      setScreen("home");
      setMainTab("vault");
      return { action: "nav", reply: "Opening your vault." };
    }
    return null;
  };

  // Start listening
  const startListening = async () => {
    if (!voiceSupported) return;
    setVoiceOverlayOpen(true);
    setVoiceTranscript("");
    setVoiceMode("listening");
    stopSpeaking();
    startAudioVisualization();

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += t;
        else interim += t;
      }
      setVoiceTranscript(finalTranscript + interim);
    };

    recognition.onerror = (e) => {
      setVoiceMode("idle");
      stopAudioVisualization();
    };

    recognition.onend = () => {
      stopAudioVisualization();
      if (!finalTranscript.trim()) {
        setVoiceMode("idle");
        setTimeout(() => setVoiceOverlayOpen(false), 1200);
        return;
      }
      setVoiceMode("processing");
      handleVoiceInput(finalTranscript.trim());
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      // already started
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    stopAudioVisualization();
  };

  const handleVoiceInput = async (text) => {
    // First try local command parsing for fast actions
    const cmd = parseVoiceCommand(text);
    if (cmd) {
      setVoiceMode("speaking");
      if (ttsEnabled) speak(cmd.reply);
      setTimeout(() => {
        setVoiceOverlayOpen(false);
        setVoiceMode("idle");
        setVoiceTranscript("");
      }, 2000);
      return;
    }

    // Otherwise, route to Claude if we have a show+episode context
    if (!selectedShow || !selectedEpisode) {
      const reply = "Pick a show and episode first — then ask me anything.";
      if (ttsEnabled) speak(reply);
      setVoiceMode("speaking");
      setTimeout(() => {
        setVoiceOverlayOpen(false);
        setVoiceMode("idle");
      }, 3000);
      return;
    }

    setTab("ask");
    setVoiceMode("processing");

    logAnalytics(text);
    const newUserMsg = { role: "user", content: text };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    const systemPrompt = `You are "Lore" — a voice-first fandom companion. The user is watching "${selectedShow.title}" Season 1 Episode ${selectedEpisode.num}: "${selectedEpisode.title}". Their question came through voice, so respond naturally like you're talking, not writing.

VOICE STYLE RULES:
- Keep responses SHORT — 2-3 sentences max. This is meant to be spoken aloud.
- Conversational, friendly. No markdown, no bullet points. No headers. Just natural speech.
- Don't say "Great question!" or preamble. Just answer.
- If you need more info, ask ONE quick follow-up.

SPOILER RULES:
- ONLY reference events from this episode or earlier.
- NEVER reveal plot points from episodes AFTER S1E${selectedEpisode.num}.
- If asked about future events, say: "That's coming up — I don't want to spoil it."`;

    try {
      await fakeAIDelay();
      const reply = findCannedResponse(selectedShow.id, text).replace(/\*\*/g, "").split("\n\n")[0];
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      setVoiceMode("speaking");
      if (ttsEnabled) speak(reply);
      setTimeout(() => {
        setVoiceOverlayOpen(false);
        setVoiceTranscript("");
      }, Math.min(8000, 2000 + reply.length * 50));
    } catch (err) {
      setVoiceMode("idle");
      setVoiceOverlayOpen(false);
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setRecapContent("");
  }, [selectedEpisode]);

  const pickShow = (show) => { setSelectedShow(show); setScreen("episodes"); };
  const pickEpisode = (ep) => {
    setSelectedEpisode(ep);
    setMessages([]);
    setTab("community");
    setScreen("hub");
  };

  const goBack = () => {
    if (screen === "analytics") setScreen("home");
    else if (screen === "hub") { setScreen("episodes"); setMessages([]); setSelectedEpisode(null); }
    else if (screen === "episodes") { setScreen("home"); setSelectedShow(null); }
  };

  const toggleFollow = (username) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(username)) next.delete(username);
      else next.add(username);
      return next;
    });
  };

  const toggleLike = (setId, postId) => {
    const setter = setId === "post" ? setLikedPosts : setLikedReviews;
    const current = setId === "post" ? likedPosts : likedReviews;
    const next = new Set(current);
    if (next.has(postId)) next.delete(postId);
    else next.add(postId);
    setter(next);
  };

  // Save / update a review for the current episode
  const saveReview = () => {
    if (!selectedShow || !selectedEpisode || reviewDraft.rating === 0) return;
    const existing = myReviews.findIndex(
      (r) => r.showId === selectedShow.id && r.epNum === selectedEpisode.num
    );
    const newEntry = {
      showId: selectedShow.id,
      showTitle: selectedShow.title,
      showAccent: selectedShow.accent,
      epNum: selectedEpisode.num,
      epTitle: selectedEpisode.title,
      rating: reviewDraft.rating,
      text: reviewDraft.text.trim(),
      date: Date.now(),
    };
    if (existing >= 0) {
      const updated = [...myReviews];
      updated[existing] = newEntry;
      setMyReviews(updated);
    } else {
      setMyReviews([newEntry, ...myReviews]);
    }
    setShowReviewSheet(false);
    setReviewDraft({ rating: 0, text: "" });
  };

  // Open review sheet, pre-fill if already reviewed
  const openReviewSheet = () => {
    const existing = myReviews.find(
      (r) => r.showId === selectedShow.id && r.epNum === selectedEpisode.num
    );
    setReviewDraft(existing ? { rating: existing.rating, text: existing.text } : { rating: 0, text: "" });
    setShowReviewSheet(true);
  };

  const myReviewForCurrent =
    selectedShow && selectedEpisode
      ? myReviews.find((r) => r.showId === selectedShow.id && r.epNum === selectedEpisode.num)
      : null;

  const createList = () => {
    if (!newListDraft.title.trim()) return;
    setMyLists([
      { id: `ml${Date.now()}`, title: newListDraft.title.trim(), emoji: newListDraft.emoji, items: [], created: Date.now() },
      ...myLists,
    ]);
    setNewListDraft({ title: "", emoji: "🎬" });
    setShowNewListSheet(false);
  };

  const addToList = (listId, item) => {
    setMyLists((prev) =>
      prev.map((l) => {
        if (l.id !== listId) return l;
        const already = l.items.some((i) => i.showId === item.showId && i.epNum === item.epNum);
        if (already) return l;
        return { ...l, items: [item, ...l.items] };
      })
    );
    setShowAddToListSheet(null);
  };

  const logAnalytics = (text) => {
    const signals = detectConfusion(text);
    const epKey = `${selectedShow.id}-s1e${selectedEpisode.num}`;
    setAnalytics((prev) => {
      const newSignalCounts = { ...prev.signalCounts };
      signals.forEach((s) => { newSignalCounts[s] = (newSignalCounts[s] || 0) + 1; });
      return {
        totalQuestions: prev.totalQuestions + 1,
        signalCounts: newSignalCounts,
        questionsByEpisode: { ...prev.questionsByEpisode, [epKey]: (prev.questionsByEpisode[epKey] || 0) + 1 },
        recentQuestions: [
          { text, show: selectedShow.title, episode: `S1E${selectedEpisode.num}`, signals, timestamp: Date.now() },
          ...prev.recentQuestions,
        ].slice(0, 20),
      };
    });
  };

  const sendMessage = async (messageText) => {
    const text = (messageText ?? input).trim();
    if (!text || loading) return;
    logAnalytics(text);

    const newUserMsg = { role: "user", content: text };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const systemPrompt = `You are "Lore" — a helpful fandom companion inside a community app for TV fans. The user is watching "${selectedShow.title}" Season 1 Episode ${selectedEpisode.num}: "${selectedEpisode.title}".

IMPORTANT VOICE: You're one tool inside a community. Be a knowledgeable friend.

CRITICAL SPOILER RULES:
- ONLY reference events from this episode or earlier.
- NEVER reveal plot points from episodes AFTER S1E${selectedEpisode.num}.
- If asked about future events, redirect: "That's coming up — I won't spoil it."

STYLE: Conversational. 2-4 short paragraphs max. Bold character names. Not cringe.`;

    try {
      await fakeAIDelay();
      const reply = findCannedResponse(selectedShow.id, text);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: "Something went sideways. Try again?" }]);
    } finally {
      setLoading(false);
    }
  };

  // Start the voice quiz — picks random questions scoped to current episode
  const startQuiz = () => {
    if (!selectedShow || !selectedEpisode) return;
    const available = getQuizQuestions(selectedShow.id, selectedEpisode.num);
    if (available.length === 0) return;
    // Shuffle and pick up to 5
    const shuffled = [...available].sort(() => Math.random() - 0.5).slice(0, Math.min(5, available.length));
    setQuizQuestions(shuffled);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(null);
    setQuizUserAnswer("");
    setQuizMode(true);
  };

  // Check a quiz answer (text or voice)
  const checkQuizAnswer = (answerText) => {
    const current = quizQuestions[quizIndex];
    if (!current || quizAnswered) return;
    const clean = answerText.toLowerCase().trim().replace(/[.,!?]/g, "");
    const correct = current.acceptable.some((phrase) => clean.includes(phrase.toLowerCase()));
    setQuizUserAnswer(answerText);
    setQuizAnswered(correct ? "correct" : "incorrect");
    if (correct) {
      setQuizScore((s) => s + 1);
      if (ttsEnabled) speak("Correct! " + current.answer);
    } else {
      if (ttsEnabled) speak("Not quite. " + current.answer);
    }
  };

  // Move to next quiz question
  const nextQuizQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(quizIndex + 1);
      setQuizAnswered(null);
      setQuizUserAnswer("");
    } else {
      // Quiz finished — read the score
      if (ttsEnabled) {
        const final = quizScore + (quizAnswered === "correct" ? 0 : 0); // score already bumped
        speak(`Quiz complete. You got ${quizScore} out of ${quizQuestions.length}.`);
      }
    }
  };

  // Voice-answer a quiz question — starts listening and pipes the transcript to checkQuizAnswer
  const startQuizVoiceAnswer = async () => {
    if (!voiceSupported || quizAnswered) return;
    setVoiceMode("listening");
    setVoiceTranscript("");
    startAudioVisualization();

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += t;
        else interim += t;
      }
      setVoiceTranscript(finalTranscript + interim);
    };

    recognition.onerror = () => {
      setVoiceMode("idle");
      stopAudioVisualization();
    };

    recognition.onend = () => {
      stopAudioVisualization();
      setVoiceMode("idle");
      if (finalTranscript.trim()) {
        checkQuizAnswer(finalTranscript.trim());
        setVoiceTranscript("");
      }
    };

    recognitionRef.current = recognition;
    try { recognition.start(); } catch (e) {}
  };

  const generateRecap = async () => {
    if (recapLoading) return;
    setTab("recap");
    if (recapContent) return;
    setRecapLoading(true);
    const systemPrompt = `Generate a SPOILER-SAFE recap of "${selectedShow.title}" S1E1-${selectedEpisode.num}.
Format EXACTLY:

**The story so far:** [1 sentence]

**Key beats:**
- [beat 1]
- [beat 2]
- [beat 3]

**Watch for:** [open threads, no spoilers]

Under 180 words. Bold character names.`;
    try {
      await fakeAIDelay();
      const reply = getCannedRecap(selectedShow.id, selectedEpisode.num);
      setRecapContent(reply);
    } catch { setRecapContent("Couldn't generate a recap. Try again?"); }
    finally { setRecapLoading(false); }
  };

  const renderContent = (text) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      const isBullet = /^[-*]\s/.test(line.trim());
      const content = isBullet ? line.trim().replace(/^[-*]\s/, "") : line;
      const parts = content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      const rendered = parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*")) return <em key={i} className="italic text-neutral-300">{part.slice(1, -1)}</em>;
        return <span key={i}>{part}</span>;
      });
      if (isBullet) return <div key={lineIdx} className="flex gap-2 my-1"><span className="text-neutral-500 mt-[2px]">•</span><span>{rendered}</span></div>;
      return <div key={lineIdx} className={line.trim() === "" ? "h-2" : "my-1"}>{rendered}</div>;
    });
  };

  const characterMap = selectedShow && selectedEpisode ? getCharacterMap(selectedShow.id, selectedEpisode.num) : null;
  const communityPosts = selectedShow && selectedEpisode ? getCommunityPosts(selectedShow.id, selectedEpisode.num) : [];
  const otherReviews = selectedShow && selectedEpisode ? getReviews(selectedShow.id, selectedEpisode.num) : [];

  const topSignal = Object.entries(analytics.signalCounts).sort((a, b) => b[1] - a[1])[0];
  const signalLabels = {
    explicit_confusion: "Explicit confusion", character_identity: "Character identity",
    plot_connection: "Plot connections", memory_gap: "Memory gaps", multi_question: "Multi-part questions",
  };

  const postTypeConfig = {
    theory: { icon: Lightbulb, label: "Theory", color: "#A78BFA" },
    reaction: { icon: Flame, label: "Reaction", color: "#F97316" },
    question: { icon: MessageCircle, label: "Question", color: "#60A5FA" },
  };

  // Friends' activity = seed activity + reviews from followed users
  const friendsActivity = [
    ...SEED_ACTIVITY.filter((a) => following.has(a.user)),
    ...SEED_REVIEWS
      .filter((r) => following.has(r.user))
      .map((r) => ({
        id: `rev-${r.id}`,
        user: r.user,
        avatar: r.avatar,
        action: "rated",
        target: `${SHOWS[r.showId]?.title} S1E${r.epNum}`,
        rating: r.rating,
        reviewText: r.text,
        time: r.time,
      })),
  ];

  const formatDate = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const avgRating = myReviews.length > 0 ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1) : null;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-950 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16 max-w-6xl w-full">
        {/* LEFT PANEL */}
        <div className="flex-1 text-center md:text-left space-y-5 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur text-xs tracking-widest uppercase text-amber-300">
            <Mic className="w-3 h-3" /> Voice-First
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-none">
            Lore<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">.</span>
          </h1>
          <p className="text-lg text-neutral-300 leading-relaxed font-medium">
            Where fandoms <em className="italic text-amber-300/90">live</em>.
          </p>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Your TV companion. Hands-free and spoiler-safe. Tap the mic and say anything —
            <span className="text-neutral-300"> "who is that?" · "recap this episode" · "rate it 5 stars."</span>
          </p>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 inline-flex items-center gap-1">
              <Mic className="w-3 h-3" /> Voice commands
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 inline-flex items-center gap-1">
              <Shield className="w-3 h-3" /> Spoiler-safe
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 inline-flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Speaks back
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg font-bold text-white">2.4M</div>
              <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Members</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg font-bold text-white">47k</div>
              <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Theories</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg font-bold text-white">310k</div>
              <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Lists</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg font-bold text-white">∞</div>
              <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Lore</div>
            </div>
          </div>

          <button
            onClick={() => setScreen("analytics")}
            className="group w-full md:w-auto mt-4 inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 hover:border-amber-400/40 transition-all text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-semibold tracking-wide">STUDIO INTELLIGENCE</div>
              <div className="text-xs text-neutral-400">Behind-the-scenes view →</div>
            </div>
          </button>
        </div>

        {/* PHONE */}
        {screen !== "analytics" && (
          <div className="relative">
            <div className="relative w-[340px] h-[700px] rounded-[3rem] bg-neutral-900 p-3 shadow-[0_0_80px_rgba(251,191,36,0.08),0_30px_60px_rgba(0,0,0,0.8)] border border-neutral-800">
              <div className="relative w-full h-full rounded-[2.4rem] overflow-hidden bg-black flex flex-col">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-30 flex items-center justify-center">
                  <div className="w-16 h-1 bg-neutral-800 rounded-full" />
                </div>
                <div className="relative z-20 flex justify-between items-center px-6 pt-3 pb-1 text-[11px] text-white font-medium">
                  <span>9:41</span>
                  <span className="text-[10px]">●●●●</span>
                </div>

                {/* HOME (mainTab routing) */}
                {screen === "home" && mainTab === "home" && (
                  <div className="flex-1 overflow-y-auto px-5 pt-8 pb-4 animate-[fadeIn_0.4s_ease-out]">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">Discover</h2>
                        <h1 className="text-2xl font-bold text-white">Your fandoms</h1>
                      </div>
                      <Search className="w-5 h-5 text-neutral-500" />
                    </div>

                    <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Radio className="w-3 h-3 text-emerald-400" />
                        <div className="text-[10px] text-emerald-300 tracking-widest uppercase font-semibold">Live now</div>
                      </div>
                      <div className="flex -space-x-2 mb-2">
                        {LIVE_VIEWERS.slice(0, 5).map((v, i) => (
                          <div key={i} className="w-7 h-7 rounded-full bg-neutral-700 border-2 border-black flex items-center justify-center text-xs">{v.avatar}</div>
                        ))}
                        <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-black flex items-center justify-center text-[9px] text-white font-semibold">+2k</div>
                      </div>
                      <div className="text-[11px] text-neutral-300">
                        <span className="text-emerald-300 font-medium">alex_k, mira</span> and 2,147 others watching Loki right now
                      </div>
                    </div>

                    <div className="space-y-3">
                      {Object.values(SHOWS).map((show, idx) => (
                        <button
                          key={show.id}
                          onClick={() => pickShow(show)}
                          className="group relative w-full h-40 rounded-2xl overflow-hidden border border-white/5 hover:border-white/25 transition-all hover:scale-[1.02] active:scale-[0.99] text-left shadow-lg shadow-black/50"
                          style={{ animation: `slideUp 0.4s ease-out ${idx * 0.08}s backwards` }}
                        >
                          <ShowArtwork showId={show.id} className="absolute inset-0 w-full h-full" />
                          {/* Dark overlay for text legibility */}
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent" />
                          {/* Subtle hover shimmer */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur border border-white/10">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                            </span>
                            <span className="text-[9px] text-white font-medium">{show.watchingNow.toLocaleString()}</span>
                          </div>
                          <div className="absolute bottom-3 left-4 right-4">
                            <div className="flex items-center gap-3 text-[10px] text-white/70">
                              <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5" /> {show.members} members</span>
                              <span>·</span>
                              <span>{show.year}</span>
                              <span>·</span>
                              <span className="text-amber-300/80">{show.seasons[0].episodes.length} episodes</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* VAULT TAB (Diary) */}
                {screen === "home" && mainTab === "vault" && (
                  <div className="flex-1 overflow-y-auto px-5 pt-8 pb-4 animate-[fadeIn_0.4s_ease-out]">
                    <div className="mb-5">
                      <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">Your diary</h2>
                      <h1 className="text-2xl font-bold text-white">The Vault</h1>
                    </div>

                    {/* Stats strip */}
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                        <div className="text-xl font-bold text-white">{myReviews.length}</div>
                        <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Episodes</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                        <div className="text-xl font-bold text-white">{avgRating || "—"}</div>
                        <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Avg ★</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                        <div className="text-xl font-bold text-white">{new Set(myReviews.map((r) => r.showId)).size}</div>
                        <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Shows</div>
                      </div>
                    </div>

                    {myReviews.length === 0 ? (
                      <div className="mt-8 p-6 rounded-xl bg-white/5 border border-dashed border-white/10 text-center">
                        <CalendarDays className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                        <div className="text-sm text-white font-medium mb-1">Your vault is empty</div>
                        <div className="text-[11px] text-neutral-500 leading-relaxed mb-4">
                          Rate an episode to start your diary. Every entry is timestamped and yours forever.
                        </div>
                        <button
                          onClick={() => setMainTab("home")}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 hover:bg-amber-500/30 transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Watch something
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {myReviews.map((r, i) => (
                          <div
                            key={`${r.showId}-${r.epNum}-${r.date}`}
                            className="p-3 rounded-xl bg-white/5 border border-white/5 flex gap-3"
                            style={{ animation: `slideUp 0.3s ease-out ${i * 0.04}s backwards` }}
                          >
                            <div
                              className="w-10 h-12 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold"
                              style={{ background: `${r.showAccent}30`, color: r.showAccent }}
                            >
                              {r.epNum}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <div className="text-xs font-semibold text-white truncate">{r.showTitle}</div>
                                <div className="text-[9px] text-neutral-500">·</div>
                                <div className="text-[10px] text-neutral-500 flex-shrink-0">{formatDate(r.date)}</div>
                              </div>
                              <div className="text-[11px] text-neutral-400 truncate mb-1">
                                S1E{r.epNum} · {r.epTitle}
                              </div>
                              <StarRating value={r.rating} readonly size={11} />
                              {r.text && (
                                <div className="text-[12px] text-neutral-300 italic mt-1.5 leading-snug">"{r.text}"</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* LISTS TAB */}
                {screen === "home" && mainTab === "lists" && (
                  <div className="flex-1 overflow-y-auto px-5 pt-8 pb-4 animate-[fadeIn_0.4s_ease-out]">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">Collections</h2>
                        <h1 className="text-2xl font-bold text-white">Lists</h1>
                      </div>
                      <button
                        onClick={() => setShowNewListSheet(true)}
                        className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center hover:bg-amber-500/30 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-amber-300" />
                      </button>
                    </div>

                    <div className="mb-5">
                      <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-2">Your lists</div>
                      <div className="space-y-2">
                        {myLists.map((list, i) => (
                          <div
                            key={list.id}
                            className="p-3 rounded-xl bg-white/5 border border-white/5"
                            style={{ animation: `slideUp 0.3s ease-out ${i * 0.04}s backwards` }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg flex-shrink-0">
                                {list.emoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{list.title}</div>
                                <div className="text-[10px] text-neutral-500">
                                  {list.items.length} {list.items.length === 1 ? "episode" : "episodes"}
                                </div>
                              </div>
                              <List className="w-4 h-4 text-neutral-600" />
                            </div>
                            {list.items.length > 0 && (
                              <div className="flex gap-1 mt-2 flex-wrap">
                                {list.items.slice(0, 4).map((it, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5"
                                  >
                                    {SHOWS[it.showId]?.title?.slice(0, 8) || "Show"} · E{it.epNum}
                                  </span>
                                ))}
                                {list.items.length > 4 && (
                                  <span className="text-[9px] px-1.5 py-0.5 text-neutral-500">+{list.items.length - 4}</span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-2">Popular in the community</div>
                      <div className="space-y-2">
                        {SEED_LISTS.map((list, i) => (
                          <div
                            key={list.id}
                            className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                            style={{ animation: `slideUp 0.3s ease-out ${(i + myLists.length) * 0.04}s backwards` }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-[11px]">{list.avatar}</div>
                              <div className="text-[10px] text-neutral-400">{list.author}</div>
                              <div className="text-[9px] text-neutral-600">·</div>
                              <div className="text-[10px] text-neutral-500">{list.count} eps</div>
                            </div>
                            <div className="text-sm font-semibold text-white mb-0.5">{list.title}</div>
                            <div className="text-[11px] text-neutral-500 leading-snug mb-2">{list.description}</div>
                            <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                              <Heart className="w-3 h-3" />
                              {list.likes.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ACTIVITY TAB */}
                {screen === "home" && mainTab === "activity" && (
                  <div className="flex-1 overflow-y-auto px-5 pt-8 pb-4 animate-[fadeIn_0.4s_ease-out]">
                    <div className="mb-5">
                      <h2 className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">From fans you follow</h2>
                      <h1 className="text-2xl font-bold text-white">Activity</h1>
                    </div>

                    {friendsActivity.length === 0 ? (
                      <div className="mt-8 p-6 rounded-xl bg-white/5 border border-dashed border-white/10 text-center">
                        <UserPlus className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                        <div className="text-sm text-white font-medium mb-1">Your feed is quiet</div>
                        <div className="text-[11px] text-neutral-500 leading-relaxed">
                          Follow some fans to see their ratings, theories, and lists here.
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {friendsActivity.map((a, i) => {
                          const hasProfile = USER_PROFILES[a.user];
                          const openProfile = () => {
                            if (!hasProfile) return;
                            setMainTab("profile");
                            setViewingProfile(a.user);
                            setProfileTab("watched");
                          };
                          return (
                            <div
                              key={a.id}
                              className="p-3 rounded-xl bg-white/5 border border-white/5 flex gap-3"
                              style={{ animation: `slideUp 0.3s ease-out ${i * 0.04}s backwards` }}
                            >
                              <button
                                onClick={openProfile}
                                disabled={!hasProfile}
                                className="w-9 h-9 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-base flex-shrink-0 hover:border-white/30 transition-colors disabled:cursor-default"
                              >
                                {a.avatar}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="text-[12px] text-neutral-200 leading-snug">
                                  <button
                                    onClick={openProfile}
                                    disabled={!hasProfile}
                                    className="font-semibold text-white hover:text-amber-300 transition-colors disabled:cursor-default disabled:hover:text-white"
                                  >
                                    {a.user}
                                  </button>{" "}
                                  <span className="text-neutral-400">{a.action}</span>{" "}
                                  {a.target && <span className="text-white">{a.target}</span>}
                                </div>
                                {a.rating && (
                                  <div className="mt-1"><StarRating value={a.rating} readonly size={10} /></div>
                                )}
                                {a.reviewText && (
                                  <div className="text-[11px] text-neutral-400 italic mt-1 leading-snug">"{a.reviewText}"</div>
                                )}
                                <div className="text-[10px] text-neutral-600 mt-1">{a.time}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-6">
                      <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-2">Suggested fans</div>
                      <div className="space-y-2">
                        {["scarlet_witch_99", "westview_watcher", "khonshu_listener", "london_lurker"].map((u) => {
                          const avatar = SEED_REVIEWS.find((r) => r.user === u)?.avatar || "👤";
                          const isFollowing = following.has(u);
                          return (
                            <div key={u} className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                              <button
                                onClick={() => {
                                  if (USER_PROFILES[u]) {
                                    setViewingProfile(u);
                                    setProfileTab("watched");
                                    setMainTab("profile");
                                  }
                                }}
                                className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                              >
                                <div className="w-9 h-9 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-base flex-shrink-0">
                                  {avatar}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <div className="text-xs font-semibold text-white truncate">{u}</div>
                                  <div className="text-[10px] text-neutral-500">Active fan</div>
                                </div>
                              </button>
                              <button
                                onClick={() => toggleFollow(u)}
                                className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                                  isFollowing
                                    ? "bg-white/10 text-neutral-400 border border-white/10"
                                    : "bg-white text-black hover:bg-neutral-200"
                                }`}
                              >
                                {isFollowing ? "Following" : "Follow"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* EPISODES */}
                {screen === "episodes" && selectedShow && (
                  <div className="flex-1 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
                    <div className="relative h-56 overflow-hidden">
                      <ShowArtwork showId={selectedShow.id} className="absolute inset-0 w-full h-full" />
                      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black via-black/60 to-black/20" />
                      <button
                        onClick={goBack}
                        className="absolute top-4 left-5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white/90 hover:bg-black/80 text-xs transition-colors z-10"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Shows
                      </button>
                      <div className="absolute bottom-4 left-5 right-5 z-10">
                        <div className="flex items-center gap-3 text-[11px] text-white/80">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {selectedShow.members}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {selectedShow.watchingNow.toLocaleString()} watching
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-4">
                      <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-3">Jump into an episode</div>
                      <div className="space-y-2">
                        {selectedShow.seasons[0].episodes.map((ep, idx) => {
                          const myRev = myReviews.find((r) => r.showId === selectedShow.id && r.epNum === ep.num);
                          return (
                            <button
                              key={ep.num}
                              onClick={() => pickEpisode(ep)}
                              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all text-left group"
                              style={{ animation: `slideUp 0.3s ease-out ${idx * 0.04}s backwards` }}
                            >
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                                style={{ background: `${selectedShow.accent}20`, color: selectedShow.accent }}>
                                {ep.num}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Episode {ep.num}</div>
                                <div className="text-sm text-white font-medium truncate">{ep.title}</div>
                                {myRev && <div className="mt-1"><StarRating value={myRev.rating} readonly size={10} /></div>}
                              </div>
                              <ChevronLeft className="w-4 h-4 text-neutral-600 rotate-180 group-hover:text-white transition-colors" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* HUB */}
                {screen === "hub" && selectedShow && selectedEpisode && (
                  <div className="flex-1 flex flex-col min-h-0 animate-[fadeIn_0.3s_ease-out] relative">
                    <div className="px-4 pt-2 pb-3 border-b border-white/5 flex items-center gap-3">
                      <button onClick={goBack} className="text-white/70 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{selectedShow.title}</div>
                        <div className="text-[10px] text-neutral-500 truncate">S1E{selectedEpisode.num} · {selectedEpisode.title}</div>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                        <Shield className="w-2.5 h-2.5" /> SAFE
                      </div>
                    </div>

                    {/* Rate + Add to list quick actions */}
                    <div className="px-3 py-2 border-b border-white/5 bg-black/50 flex gap-2">
                      <button
                        onClick={openReviewSheet}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border transition-colors ${
                          myReviewForCurrent
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                            : "bg-white/5 hover:bg-white/10 border-white/5 text-neutral-200"
                        }`}
                      >
                        {myReviewForCurrent ? <Star className="w-3 h-3" style={{ fill: "#D4AF37" }} /> : <Star className="w-3 h-3" />}
                        <span className="text-[11px] font-medium">
                          {myReviewForCurrent ? `Your rating · ${myReviewForCurrent.rating}★` : "Rate & review"}
                        </span>
                      </button>
                      <button
                        onClick={() => setShowAddToListSheet({
                          showId: selectedShow.id,
                          epNum: selectedEpisode.num,
                          epTitle: selectedEpisode.title,
                        })}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-neutral-200 transition-colors"
                      >
                        <Bookmark className="w-3 h-3" />
                        List
                      </button>
                    </div>

                    <div className="flex border-b border-white/5 bg-black/50 overflow-x-auto scrollbar-hide">
                      {[
                        { id: "community", label: "Community", icon: MessagesSquare },
                        { id: "reviews", label: "Reviews", icon: Star },
                        { id: "ask", label: "Ask", icon: Sparkles },
                        { id: "map", label: "Map", icon: Network },
                        { id: "recap", label: "Recap", icon: BookOpen },
                        ...(TRIVIA[selectedShow.id]?.length > 0 ? [{ id: "trivia", label: "Trivia", icon: Brain }] : []),
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            if (t.id === "recap") generateRecap();
                            else setTab(t.id);
                            if (t.id !== "trivia") setQuizMode(false);
                          }}
                          className={`flex-shrink-0 min-w-[60px] flex flex-col items-center gap-0.5 py-2.5 px-2 transition-all relative ${
                            tab === t.id ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                          }`}
                        >
                          <t.icon className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-medium">{t.label}</span>
                          {tab === t.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ background: selectedShow.accent }} />}
                        </button>
                      ))}
                    </div>

                    {/* COMMUNITY */}
                    {tab === "community" && (
                      <div className="flex-1 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
                        <div className="px-4 pt-3 pb-2 border-b border-white/5 bg-gradient-to-r from-emerald-500/5 to-transparent">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex -space-x-1.5">
                              {LIVE_VIEWERS.slice(0, 4).map((v, i) => (
                                <div key={i} className="w-5 h-5 rounded-full bg-neutral-700 border border-black flex items-center justify-center text-[9px]">{v.avatar}</div>
                              ))}
                            </div>
                            <div className="text-[11px] text-neutral-300">
                              <span className="text-emerald-400 font-semibold">{selectedShow.watchingNow.toLocaleString()}</span> fans discussing
                            </div>
                          </div>
                        </div>
                        <div className="px-3 py-3 space-y-3">
                          {communityPosts.length === 0 ? (
                            <div className="text-center py-8 text-xs text-neutral-500">No posts yet for this episode. Be the first!</div>
                          ) : (
                            communityPosts.map((post, idx) => {
                              const TypeIcon = postTypeConfig[post.type]?.icon || MessageCircle;
                              const typeColor = postTypeConfig[post.type]?.color || "#888";
                              const liked = likedPosts.has(post.id);
                              const likeCount = post.likes + (liked ? 1 : 0);
                              return (
                                <div key={post.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                                  style={{ animation: `slideUp 0.3s ease-out ${idx * 0.05}s backwards` }}>
                                  <div className="flex items-start gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-base flex-shrink-0">{post.avatar}</div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-baseline gap-1.5 flex-wrap">
                                        <span className="text-xs font-semibold text-white truncate">{post.author}</span>
                                        <span className="text-[8px] px-1.5 py-0.5 rounded-full border" style={{ color: typeColor, borderColor: `${typeColor}40`, background: `${typeColor}15` }}>{post.badge}</span>
                                        <span className="text-[10px] text-neutral-500">· {post.time}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium" style={{ color: typeColor, background: `${typeColor}15` }}>
                                      <TypeIcon className="w-2.5 h-2.5" />{postTypeConfig[post.type]?.label}
                                    </div>
                                  </div>
                                  <div className="text-sm font-semibold text-white mb-1 leading-snug">{post.title}</div>
                                  <div className="text-[12px] text-neutral-400 leading-relaxed mb-2">{post.body}</div>
                                  <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                                    <button onClick={() => toggleLike("post", post.id)} className="flex items-center gap-1 hover:text-rose-400 transition-colors">
                                      <Heart className="w-3.5 h-3.5" style={{ fill: liked ? "#fb7185" : "none", color: liked ? "#fb7185" : "currentColor" }} />
                                      <span style={{ color: liked ? "#fb7185" : undefined }}>{likeCount.toLocaleString()}</span>
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                                      <MessageCircle className="w-3.5 h-3.5" />{post.replies}
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}

                    {/* REVIEWS TAB */}
                    {tab === "reviews" && (
                      <div className="flex-1 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
                        {myReviewForCurrent && (
                          <div className="mx-3 mt-3 p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center text-[10px]">🎬</div>
                              <div className="text-[10px] text-amber-300 tracking-widest uppercase font-semibold">Your review</div>
                              <button onClick={openReviewSheet} className="ml-auto text-[10px] text-neutral-400 hover:text-white">Edit</button>
                            </div>
                            <StarRating value={myReviewForCurrent.rating} readonly size={14} />
                            {myReviewForCurrent.text && <div className="text-[12px] text-neutral-200 italic mt-2 leading-snug">"{myReviewForCurrent.text}"</div>}
                          </div>
                        )}
                        <div className="px-3 py-3">
                          <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-2 px-1">Top reviews</div>
                          {otherReviews.length === 0 ? (
                            <div className="text-center py-8 text-xs text-neutral-500">No reviews yet. Be the first!</div>
                          ) : (
                            <div className="space-y-2">
                              {otherReviews.map((r, i) => {
                                const liked = likedReviews.has(r.id);
                                const likeCount = r.likes + (liked ? 1 : 0);
                                const isFollowing = following.has(r.user);
                                return (
                                  <div key={r.id} className="p-3 rounded-xl bg-white/5 border border-white/5"
                                    style={{ animation: `slideUp 0.3s ease-out ${i * 0.05}s backwards` }}>
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <div className="w-7 h-7 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-sm">{r.avatar}</div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-xs font-semibold text-white truncate">{r.user}</div>
                                        <div className="text-[9px] text-neutral-500">{r.time}</div>
                                      </div>
                                      <button
                                        onClick={() => toggleFollow(r.user)}
                                        className={`text-[9px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                                          isFollowing ? "text-neutral-500" : "bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                      >
                                        {isFollowing ? "Following" : "+ Follow"}
                                      </button>
                                    </div>
                                    <StarRating value={r.rating} readonly size={11} />
                                    <div className="text-[12px] text-neutral-300 italic mt-1.5 leading-snug">"{r.text}"</div>
                                    <div className="flex items-center gap-3 mt-2 text-[10px] text-neutral-500">
                                      <button onClick={() => toggleLike("review", r.id)} className="flex items-center gap-1 hover:text-rose-400 transition-colors">
                                        <Heart className="w-3 h-3" style={{ fill: liked ? "#fb7185" : "none", color: liked ? "#fb7185" : "currentColor" }} />
                                        <span style={{ color: liked ? "#fb7185" : undefined }}>{likeCount.toLocaleString()}</span>
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ASK */}
                    {tab === "ask" && (
                      <div className="flex-1 flex flex-col min-h-0 animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                          {messages.length === 0 && (
                            <div className="text-center py-6">
                              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: `${selectedShow.accent}20` }}>
                                <Sparkles className="w-5 h-5" style={{ color: selectedShow.accent }} />
                              </div>
                              <div className="text-sm font-semibold text-white mb-1">Missed something? Just ask.</div>
                              <div className="text-[11px] text-neutral-500 mb-4 px-4">A helper trained on the lore — spoiler-safe to your episode.</div>
                              <div className="flex flex-col gap-2 px-2">
                                {["Who is that character again?", "Recap what I need to remember", "Explain that last scene"].map((q) => (
                                  <button key={q} onClick={() => sendMessage(q)} className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[12px] text-neutral-300 text-left transition-colors">
                                    {q}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`} style={{ animation: "slideUp 0.3s ease-out" }}>
                              <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-white text-black rounded-br-md" : "bg-neutral-800/80 text-neutral-100 rounded-bl-md border border-white/5"}`}>
                                {renderContent(msg.content)}
                              </div>
                            </div>
                          ))}
                          {loading && (
                            <div className="flex justify-start">
                              <div className="bg-neutral-800/80 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md">
                                <div className="flex gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                        <div className="px-3 pb-4 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-2 bg-neutral-900 border border-white/10 rounded-full px-4 py-2.5 focus-within:border-white/30 transition-colors">
                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                              placeholder="Ask anything about this episode..." className="flex-1 bg-transparent text-white text-sm placeholder-neutral-600 outline-none" disabled={loading} />
                            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                              className="w-7 h-7 rounded-full bg-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform">
                              <Send className="w-3.5 h-3.5 text-black" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MAP */}
                    {tab === "map" && characterMap && (
                      <div className="flex-1 flex flex-col min-h-0 animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:20px_20px]">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {characterMap.links.map((link, i) => {
                              const from = characterMap.characters.find((c) => c.id === link.from);
                              const to = characterMap.characters.find((c) => c.id === link.to);
                              if (!from || !to) return null;
                              const isHighlighted = hoveredChar && (hoveredChar === from.id || hoveredChar === to.id);
                              return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                                stroke={isHighlighted ? selectedShow.accent : "#ffffff20"}
                                strokeWidth={isHighlighted ? "0.4" : "0.2"} strokeDasharray="1,0.5" style={{ transition: "all 0.3s" }} />;
                            })}
                          </svg>
                          {characterMap.characters.map((char) => {
                            const isHovered = hoveredChar === char.id;
                            return (
                              <button key={char.id} onMouseEnter={() => setHoveredChar(char.id)} onMouseLeave={() => setHoveredChar(null)}
                                onClick={() => { setHoveredChar(null); setTab("ask"); sendMessage(`Tell me about ${char.name}.`); }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                                style={{ left: `${char.x}%`, top: `${char.y}%`, animation: "fadeIn 0.5s ease-out backwards" }}>
                                <div className="rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110"
                                  style={{ width: char.size * 2, height: char.size * 2, background: `${char.color}20`, borderColor: char.color,
                                    boxShadow: isHovered ? `0 0 20px ${char.color}80, inset 0 0 10px ${char.color}40` : undefined }}>
                                  <span className="text-[9px] font-bold text-center leading-tight px-1" style={{ color: char.color }}>
                                    {char.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                                  </span>
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-center pointer-events-none"
                                  style={{ opacity: isHovered ? 1 : 0.85, transition: "opacity 0.2s" }}>
                                  <div className="text-[10px] font-semibold text-white">{char.name}</div>
                                  <div className="text-[8px] text-neutral-400">{char.role}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="px-4 py-2 border-t border-white/5 text-[10px] text-neutral-500 text-center">Tap a character to ask about them</div>
                      </div>
                    )}

                    {/* RECAP */}
                    {tab === "recap" && (
                      <div className="flex-1 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
                        <div className="px-5 py-5">
                          <div className="mb-4 h-24 rounded-xl overflow-hidden relative border border-white/5">
                            <ShowArtwork showId={selectedShow.id} className="absolute inset-0 w-full h-full" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                              <div className="text-[9px] tracking-widest uppercase text-white/70 mb-0.5">Caught up to</div>
                              <div className="text-base font-bold text-white leading-tight">{selectedEpisode.title}</div>
                              <div className="text-[10px] text-white/70">S1E{selectedEpisode.num}</div>
                            </div>
                          </div>
                          {recapLoading ? (
                            <div className="space-y-3 animate-pulse">
                              <div className="h-3 bg-white/5 rounded w-3/4" />
                              <div className="h-3 bg-white/5 rounded w-full" />
                              <div className="h-3 bg-white/5 rounded w-5/6" />
                              <div className="text-[11px] text-neutral-500 text-center pt-4">Generating your recap...</div>
                            </div>
                          ) : (
                            <div className="text-sm text-neutral-200 leading-relaxed space-y-1">{renderContent(recapContent)}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TRIVIA */}
                    {tab === "trivia" && (() => {
                      const triviaCards = getTrivia(selectedShow.id, selectedEpisode.num);
                      const availableQuiz = getQuizQuestions(selectedShow.id, selectedEpisode.num);

                      // Quiz mode UI
                      if (quizMode && quizQuestions.length > 0) {
                        const current = quizQuestions[quizIndex];
                        const isLast = quizIndex === quizQuestions.length - 1;
                        const isFinished = quizAnswered && isLast;

                        return (
                          <div className="flex-1 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
                            <div className="px-5 py-4">
                              {/* Progress bar */}
                              <div className="flex items-center justify-between mb-3">
                                <button
                                  onClick={() => setQuizMode(false)}
                                  className="text-[10px] text-neutral-500 hover:text-white flex items-center gap-1"
                                >
                                  <ChevronLeft className="w-3 h-3" /> Exit quiz
                                </button>
                                <div className="text-[10px] text-neutral-400">
                                  Question {quizIndex + 1} of {quizQuestions.length} · <span className="text-amber-300 font-semibold">{quizScore}</span> correct
                                </div>
                              </div>
                              <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-5">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
                                  style={{ width: `${((quizIndex + (quizAnswered ? 1 : 0)) / quizQuestions.length) * 100}%` }}
                                />
                              </div>

                              {/* Question card */}
                              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-7 h-7 rounded-full bg-amber-500/30 flex items-center justify-center">
                                    <Brain className="w-3.5 h-3.5 text-amber-300" />
                                  </div>
                                  <div className="text-[10px] text-amber-300 tracking-widest uppercase font-semibold">
                                    {current.difficulty}
                                  </div>
                                </div>
                                <div className="text-base text-white font-medium leading-snug">
                                  {current.question}
                                </div>
                              </div>

                              {/* Answer state */}
                              {!quizAnswered && (
                                <div className="space-y-3">
                                  {/* Voice answer button */}
                                  <button
                                    onClick={startQuizVoiceAnswer}
                                    disabled={!voiceSupported || voiceMode === "listening"}
                                    className="w-full p-4 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-900 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.99] transition-transform disabled:opacity-60"
                                  >
                                    <Mic className="w-4 h-4" />
                                    {voiceMode === "listening" ? "Listening..." : "Say your answer"}
                                  </button>

                                  {voiceMode === "listening" && voiceTranscript && (
                                    <div className="text-center text-sm text-white italic p-3 rounded-xl bg-white/5 border border-white/10">
                                      "{voiceTranscript}"
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                                    <div className="h-px flex-1 bg-white/10" />
                                    <span>or type it</span>
                                    <div className="h-px flex-1 bg-white/10" />
                                  </div>

                                  {/* Text fallback */}
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={quizUserAnswer}
                                      onChange={(e) => setQuizUserAnswer(e.target.value)}
                                      onKeyDown={(e) => e.key === "Enter" && quizUserAnswer.trim() && checkQuizAnswer(quizUserAnswer)}
                                      placeholder="Your answer..."
                                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-white/30"
                                    />
                                    <button
                                      onClick={() => quizUserAnswer.trim() && checkQuizAnswer(quizUserAnswer)}
                                      disabled={!quizUserAnswer.trim()}
                                      className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-sm disabled:opacity-30"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Result */}
                              {quizAnswered && (
                                <div className="animate-[slideUp_0.3s_ease-out]">
                                  <div
                                    className={`p-4 rounded-xl border mb-3 ${
                                      quizAnswered === "correct"
                                        ? "bg-emerald-500/10 border-emerald-500/30"
                                        : "bg-rose-500/10 border-rose-500/30"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      {quizAnswered === "correct" ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                      ) : (
                                        <XCircle className="w-5 h-5 text-rose-400" />
                                      )}
                                      <div
                                        className={`text-sm font-semibold ${
                                          quizAnswered === "correct" ? "text-emerald-300" : "text-rose-300"
                                        }`}
                                      >
                                        {quizAnswered === "correct" ? "Nailed it!" : "Not quite"}
                                      </div>
                                    </div>
                                    {quizUserAnswer && (
                                      <div className="text-[11px] text-neutral-400 italic mb-2">
                                        You said: "{quizUserAnswer}"
                                      </div>
                                    )}
                                    <div className="text-sm text-neutral-200 leading-relaxed">
                                      {current.answer}
                                    </div>
                                  </div>

                                  {!isLast ? (
                                    <button
                                      onClick={nextQuizQuestion}
                                      className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:scale-[1.01] active:scale-[0.99] transition-transform"
                                    >
                                      Next question →
                                    </button>
                                  ) : (
                                    <div className="space-y-3 animate-[fadeIn_0.4s_ease-out]">
                                      <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 text-center">
                                        <Trophy className="w-10 h-10 text-amber-300 mx-auto mb-2" />
                                        <div className="text-xl font-bold text-white mb-1">
                                          {quizScore} / {quizQuestions.length}
                                        </div>
                                        <div className="text-xs text-amber-200">
                                          {quizScore === quizQuestions.length
                                            ? "Perfect score. You ARE the TVA."
                                            : quizScore >= quizQuestions.length * 0.6
                                            ? "Solid. You've been paying attention."
                                            : "Rewatch and try again."}
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <button
                                          onClick={() => setQuizMode(false)}
                                          className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10"
                                        >
                                          Back to trivia
                                        </button>
                                        <button
                                          onClick={startQuiz}
                                          className="py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200"
                                        >
                                          Play again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }

                      // Default trivia browsing
                      return (
                        <div className="flex-1 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
                          <div className="px-4 py-4">
                            {/* Quiz CTA */}
                            {availableQuiz.length > 0 && (
                              <button
                                onClick={startQuiz}
                                className="w-full p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 hover:border-amber-400/50 transition-all flex items-center gap-3 mb-4 text-left group"
                              >
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                                  <Brain className="w-5 h-5 text-neutral-900" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-bold text-white mb-0.5">Test your lore</div>
                                  <div className="text-[11px] text-amber-200/80">
                                    {availableQuiz.length} voice questions · Speak your answers
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-amber-300 group-hover:translate-x-1 transition-transform">
                                  <Mic className="w-3.5 h-3.5" />
                                  <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
                                </div>
                              </button>
                            )}

                            <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-3 px-1">
                              Easter eggs · Through S1E{selectedEpisode.num}
                            </div>

                            {triviaCards.length === 0 ? (
                              <div className="p-6 rounded-xl bg-white/5 border border-dashed border-white/10 text-center">
                                <div className="text-sm text-white mb-1">No trivia yet</div>
                                <div className="text-[11px] text-neutral-500">Trivia unlocks as you watch more.</div>
                              </div>
                            ) : (
                              <div className="space-y-2.5">
                                {triviaCards.map((card, i) => (
                                  <div
                                    key={card.id}
                                    className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors"
                                    style={{ animation: `slideUp 0.3s ease-out ${i * 0.05}s backwards` }}
                                  >
                                    <div className="flex items-start gap-3 mb-2">
                                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-lg flex-shrink-0">
                                        {card.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-[9px] tracking-widest uppercase text-amber-400 font-semibold mb-0.5">
                                          {card.category}
                                        </div>
                                        <div className="text-sm font-semibold text-white leading-snug">
                                          {card.title}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-[12px] text-neutral-400 leading-relaxed mb-2">
                                      {card.body}
                                    </div>
                                    <div className="text-[9px] text-neutral-600 uppercase tracking-wider">
                                      {card.source}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* REVIEW SHEET (Rate + Write) */}
                {showReviewSheet && selectedShow && selectedEpisode && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-end animate-[fadeIn_0.2s_ease-out]">
                    <div className="w-full bg-neutral-900 rounded-t-3xl border-t border-white/10 p-5 animate-[slideUpSheet_0.3s_ease-out]">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-[10px] tracking-widest uppercase text-neutral-500 mb-0.5">Rate & review</div>
                          <div className="text-sm font-semibold text-white">{selectedShow.title}</div>
                          <div className="text-[10px] text-neutral-500">S1E{selectedEpisode.num} · {selectedEpisode.title}</div>
                        </div>
                        <button onClick={() => setShowReviewSheet(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-col items-center py-4">
                        <div className="text-[10px] tracking-widest uppercase text-neutral-500 mb-2">Your rating</div>
                        <StarRating value={reviewDraft.rating} onChange={(r) => setReviewDraft({ ...reviewDraft, rating: r })} size={32} />
                      </div>

                      <div className="mb-4">
                        <div className="text-[10px] tracking-widest uppercase text-neutral-500 mb-2">Your take (optional)</div>
                        <textarea
                          value={reviewDraft.text}
                          onChange={(e) => setReviewDraft({ ...reviewDraft, text: e.target.value.slice(0, 140) })}
                          placeholder="One witty line about this episode..."
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-white/30 resize-none"
                        />
                        <div className="text-[10px] text-neutral-600 text-right mt-1">{reviewDraft.text.length}/140</div>
                      </div>

                      <button
                        onClick={saveReview}
                        disabled={reviewDraft.rating === 0}
                        className="w-full py-3 rounded-full bg-white text-black font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-transform"
                      >
                        {myReviewForCurrent ? "Update review" : "Post review"}
                      </button>
                    </div>
                  </div>
                )}

                {/* ADD TO LIST SHEET */}
                {showAddToListSheet && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-end animate-[fadeIn_0.2s_ease-out]">
                    <div className="w-full bg-neutral-900 rounded-t-3xl border-t border-white/10 p-5 animate-[slideUpSheet_0.3s_ease-out]">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-[10px] tracking-widest uppercase text-neutral-500 mb-0.5">Add to list</div>
                          <div className="text-xs text-white">
                            {SHOWS[showAddToListSheet.showId]?.title} · E{showAddToListSheet.epNum}
                          </div>
                        </div>
                        <button onClick={() => setShowAddToListSheet(null)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
                        {myLists.map((list) => {
                          const already = list.items.some((i) => i.showId === showAddToListSheet.showId && i.epNum === showAddToListSheet.epNum);
                          return (
                            <button
                              key={list.id}
                              onClick={() => !already && addToList(list.id, showAddToListSheet)}
                              disabled={already}
                              className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-3 transition-colors disabled:opacity-50"
                            >
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-base">{list.emoji}</div>
                              <div className="flex-1 min-w-0 text-left">
                                <div className="text-sm text-white font-medium truncate">{list.title}</div>
                                <div className="text-[10px] text-neutral-500">{list.items.length} eps</div>
                              </div>
                              {already && <Check className="w-4 h-4 text-emerald-400" />}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          setShowAddToListSheet(null);
                          setShowNewListSheet(true);
                        }}
                        className="w-full py-2 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 hover:bg-white/10 transition-colors"
                      >
                        + Create new list
                      </button>
                    </div>
                  </div>
                )}

                {/* NEW LIST SHEET */}
                {showNewListSheet && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-end animate-[fadeIn_0.2s_ease-out]">
                    <div className="w-full bg-neutral-900 rounded-t-3xl border-t border-white/10 p-5 animate-[slideUpSheet_0.3s_ease-out]">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-[10px] tracking-widest uppercase text-neutral-500 mb-0.5">New list</div>
                          <div className="text-sm font-semibold text-white">Build a collection</div>
                        </div>
                        <button onClick={() => setShowNewListSheet(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mb-3">
                        <div className="text-[10px] tracking-widest uppercase text-neutral-500 mb-2">Emoji</div>
                        <div className="flex gap-2 flex-wrap">
                          {["🎬", "😭", "🤯", "🔥", "🌙", "⚡", "💔", "👑", "🦹", "✨"].map((e) => (
                            <button
                              key={e}
                              onClick={() => setNewListDraft({ ...newListDraft, emoji: e })}
                              className={`w-9 h-9 rounded-lg text-base flex items-center justify-center transition-colors ${
                                newListDraft.emoji === e ? "bg-amber-500/20 border border-amber-500/40" : "bg-white/5 border border-white/10"
                              }`}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-[10px] tracking-widest uppercase text-neutral-500 mb-2">Title</div>
                        <input
                          type="text"
                          value={newListDraft.title}
                          onChange={(e) => setNewListDraft({ ...newListDraft, title: e.target.value.slice(0, 60) })}
                          placeholder='e.g. "Shows I rewatch when sad"'
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-white/30"
                        />
                      </div>

                      <button
                        onClick={createList}
                        disabled={!newListDraft.title.trim()}
                        className="w-full py-3 rounded-full bg-white text-black font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-transform"
                      >
                        Create list
                      </button>
                    </div>
                  </div>
                )}

                {/* PROFILE TAB — Your wall (or a friend's) */}
                {screen === "home" && mainTab === "profile" && (() => {
                  const isMe = !viewingProfile;
                  const profile = isMe
                    ? {
                        username: "you",
                        displayName: "You",
                        avatar: "🎬",
                        bio: "Joined recently. Watching everything.",
                        badge: "Member",
                        followers: 12,
                        following: following.size,
                        episodesWatched: myReviews.map((r) => ({
                          showId: r.showId,
                          epNum: r.epNum,
                          rating: r.rating,
                          date: r.date,
                          text: r.text,
                        })),
                      }
                    : USER_PROFILES[viewingProfile];

                  if (!profile) return null;

                  // Group watched episodes by show
                  const byShow = {};
                  profile.episodesWatched.forEach((ep) => {
                    if (!byShow[ep.showId]) byShow[ep.showId] = [];
                    byShow[ep.showId].push(ep);
                  });
                  const shows = Object.keys(byShow).map((showId) => ({
                    show: SHOWS[showId],
                    episodes: byShow[showId].sort((a, b) => b.date - a.date),
                  }));
                  const totalEps = profile.episodesWatched.length;
                  const ratingsOnly = profile.episodesWatched.filter((e) => e.rating);
                  const avgR = ratingsOnly.length > 0
                    ? (ratingsOnly.reduce((s, e) => s + e.rating, 0) / ratingsOnly.length).toFixed(1)
                    : null;
                  const reviews = profile.episodesWatched.filter((e) => e.text);
                  const isFollowingThem = viewingProfile && following.has(viewingProfile);

                  return (
                    <div className="flex-1 overflow-y-auto animate-[fadeIn_0.4s_ease-out]">
                      {/* Banner */}
                      <div className="relative h-28 bg-gradient-to-br from-amber-900/30 via-purple-900/20 to-slate-900 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,191,36,0.2),transparent_50%)]" />
                        {!isMe && (
                          <button
                            onClick={() => setViewingProfile(null)}
                            className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur text-xs text-white hover:bg-black/80"
                          >
                            <ChevronLeft className="w-3 h-3" /> Back
                          </button>
                        )}
                      </div>

                      {/* Identity */}
                      <div className="px-5 -mt-10 relative">
                        <div className="w-20 h-20 rounded-full bg-neutral-800 border-4 border-black flex items-center justify-center text-4xl">
                          {profile.avatar}
                        </div>
                        <div className="mt-3 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-lg font-bold text-white truncate">{profile.displayName}</div>
                            <div className="text-[11px] text-neutral-500">@{profile.username}</div>
                          </div>
                          {!isMe && (
                            <button
                              onClick={() => toggleFollow(profile.username)}
                              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                                isFollowingThem
                                  ? "bg-white/10 text-neutral-300 border border-white/10 hover:bg-white/15"
                                  : "bg-white text-black hover:bg-neutral-200"
                              }`}
                            >
                              {isFollowingThem ? "Following" : "Follow"}
                            </button>
                          )}
                        </div>

                        {profile.bio && (
                          <div className="text-xs text-neutral-300 mt-2 italic leading-snug">"{profile.bio}"</div>
                        )}

                        {/* Stats */}
                        <div className="flex gap-5 mt-3 pb-3 border-b border-white/5">
                          <div>
                            <div className="text-sm font-bold text-white">{totalEps}</div>
                            <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Watched</div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{profile.followers.toLocaleString()}</div>
                            <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Followers</div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{profile.following.toLocaleString()}</div>
                            <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Following</div>
                          </div>
                          {avgR && (
                            <div>
                              <div className="text-sm font-bold text-white">{avgR}★</div>
                              <div className="text-[9px] text-neutral-500 uppercase tracking-wider">Avg</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sub-tabs */}
                      <div className="flex border-b border-white/5 px-5">
                        {[
                          { id: "watched", label: `Watched (${totalEps})` },
                          { id: "reviews", label: `Reviews (${reviews.length})` },
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setProfileTab(t.id)}
                            className={`py-2.5 pr-4 text-xs font-medium relative transition-colors ${
                              profileTab === t.id ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                            }`}
                          >
                            {t.label}
                            {profileTab === t.id && (
                              <div className="absolute bottom-0 left-0 right-4 h-0.5 rounded-full bg-amber-400" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Watched — grouped by show */}
                      {profileTab === "watched" && (
                        <div className="px-5 py-4">
                          {shows.length === 0 ? (
                            <div className="p-6 rounded-xl bg-white/5 border border-dashed border-white/10 text-center">
                              <Eye className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                              <div className="text-sm text-white font-medium mb-1">
                                {isMe ? "You haven't watched anything yet" : `${profile.displayName} hasn't watched anything yet`}
                              </div>
                              <div className="text-[11px] text-neutral-500 leading-relaxed">
                                {isMe ? "Rate an episode and it'll show up on your public profile." : "Check back later."}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {shows.map(({ show, episodes }, i) => (
                                <div key={show?.id || i} style={{ animation: `slideUp 0.3s ease-out ${i * 0.08}s backwards` }}>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-1 h-5 rounded-full"
                                        style={{ background: show?.accent || "#fff" }}
                                      />
                                      <div className="text-sm font-semibold text-white">{show?.title}</div>
                                    </div>
                                    <div className="text-[10px] text-neutral-500">
                                      {episodes.length}/{show?.seasons[0].episodes.length} eps
                                    </div>
                                  </div>
                                  {/* Episode grid — poster-style tiles */}
                                  <div className="grid grid-cols-6 gap-1.5">
                                    {show?.seasons[0].episodes.map((ep) => {
                                      const watched = episodes.find((e) => e.epNum === ep.num);
                                      return (
                                        <div
                                          key={ep.num}
                                          className={`aspect-[2/3] rounded-md flex flex-col items-center justify-center relative overflow-hidden transition-all ${
                                            watched ? "" : "opacity-25"
                                          }`}
                                          style={{
                                            background: watched
                                              ? `linear-gradient(135deg, ${show.accent}40, ${show.accent}15)`
                                              : "rgba(255,255,255,0.03)",
                                            border: watched ? `1px solid ${show.accent}40` : "1px solid rgba(255,255,255,0.05)",
                                          }}
                                          title={`E${ep.num}: ${ep.title}${watched?.rating ? ` · ${watched.rating}★` : ""}`}
                                        >
                                          <div
                                            className="text-base font-bold"
                                            style={{ color: watched ? show.accent : "#666" }}
                                          >
                                            {ep.num}
                                          </div>
                                          {watched?.rating && (
                                            <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-px">
                                              {[...Array(watched.rating)].map((_, idx) => (
                                                <Star
                                                  key={idx}
                                                  className="w-1.5 h-1.5"
                                                  style={{ fill: show.accent, color: show.accent }}
                                                />
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Reviews */}
                      {profileTab === "reviews" && (
                        <div className="px-5 py-4">
                          {reviews.length === 0 ? (
                            <div className="p-6 rounded-xl bg-white/5 border border-dashed border-white/10 text-center">
                              <div className="text-sm text-white font-medium mb-1">No written reviews yet</div>
                              <div className="text-[11px] text-neutral-500">
                                {isMe ? "Add a take when you rate an episode." : "They rate but don't write."}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {reviews
                                .sort((a, b) => b.date - a.date)
                                .map((r, i) => {
                                  const show = SHOWS[r.showId];
                                  const ep = show?.seasons[0].episodes.find((e) => e.num === r.epNum);
                                  return (
                                    <div
                                      key={`${r.showId}-${r.epNum}-${i}`}
                                      className="p-3 rounded-xl bg-white/5 border border-white/5"
                                      style={{ animation: `slideUp 0.3s ease-out ${i * 0.05}s backwards` }}
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        <div
                                          className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                                          style={{ background: `${show?.accent}20`, color: show?.accent }}
                                        >
                                          {show?.title} · E{r.epNum}
                                        </div>
                                        <div className="text-[9px] text-neutral-500 truncate">{ep?.title}</div>
                                      </div>
                                      <StarRating value={r.rating} readonly size={12} />
                                      <div className="text-[12px] text-neutral-200 italic mt-1.5 leading-snug">"{r.text}"</div>
                                      <div className="text-[9px] text-neutral-600 mt-1">{formatDate(r.date)}</div>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Discover friends (only on your own profile) */}
                      {isMe && (
                        <div className="px-5 pb-6">
                          <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-2 mt-2">
                            Peek at friends' walls
                          </div>
                          <div className="space-y-2">
                            {Object.values(USER_PROFILES).slice(0, 5).map((p) => (
                              <button
                                key={p.username}
                                onClick={() => {
                                  setViewingProfile(p.username);
                                  setProfileTab("watched");
                                }}
                                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-3 transition-colors"
                              >
                                <div className="w-9 h-9 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-base flex-shrink-0">
                                  {p.avatar}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <div className="text-xs font-semibold text-white truncate">{p.displayName}</div>
                                  <div className="text-[10px] text-neutral-500">
                                    @{p.username} · {p.episodesWatched.length} watched
                                  </div>
                                </div>
                                <ChevronLeft className="w-3.5 h-3.5 text-neutral-600 rotate-180" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Bottom nav */}
                {screen === "home" && (
                  <div className="border-t border-white/5 bg-black/80 backdrop-blur flex items-center justify-around px-2 py-2">
                    {[
                      { id: "home", label: "Home", icon: Home },
                      { id: "vault", label: "Vault", icon: CalendarDays },
                      { id: "lists", label: "Lists", icon: List },
                      { id: "activity", label: "Activity", icon: TrendingUp },
                      { id: "profile", label: "Profile", icon: User },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setMainTab(t.id);
                          if (t.id === "profile") setViewingProfile(null);
                        }}
                        className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-colors ${mainTab === t.id ? "text-white" : "text-neutral-500"}`}
                      >
                        <t.icon className="w-4 h-4" />
                        <span className="text-[9px]">{t.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* FLOATING VOICE BUTTON — persistent across every screen */}
                {!voiceOverlayOpen && (
                  <button
                    onClick={startListening}
                    disabled={!voiceSupported}
                    className="absolute z-30 group"
                    style={{
                      bottom: screen === "home" ? "70px" : "20px",
                      right: "16px",
                    }}
                    aria-label="Talk to Lore"
                  >
                    {/* Pulsing rings */}
                    <span className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" />
                    <span className="absolute inset-0 rounded-full bg-amber-400/20 animate-pulse" style={{ animationDelay: "0.3s" }} />
                    {/* Main orb */}
                    <span
                      className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 shadow-[0_0_30px_rgba(251,191,36,0.5)] border border-amber-200/40 group-hover:scale-110 group-active:scale-95 transition-transform"
                    >
                      <Mic className="w-5 h-5 text-neutral-900" strokeWidth={2.5} />
                    </span>
                    {/* Hint label */}
                    {voiceSupported && (
                      <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap px-2 py-1 rounded-full bg-black/80 backdrop-blur border border-white/10 text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        Tap to talk
                      </span>
                    )}
                  </button>
                )}

                {/* VOICE OVERLAY — the immersive listening experience */}
                {voiceOverlayOpen && (
                  <div className="absolute inset-0 z-40 bg-gradient-to-b from-neutral-950 via-black to-neutral-950 backdrop-blur-xl flex flex-col animate-[fadeIn_0.3s_ease-out]">
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-5 pt-12 pb-2">
                      <button
                        onClick={() => setTtsEnabled(!ttsEnabled)}
                        className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white"
                        title={ttsEnabled ? "Voice replies ON" : "Voice replies OFF"}
                      >
                        {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>
                      <div className="text-[10px] tracking-[0.2em] uppercase text-amber-300/80">
                        {voiceMode === "listening" && "Listening"}
                        {voiceMode === "processing" && "Thinking"}
                        {voiceMode === "speaking" && "Speaking"}
                        {voiceMode === "idle" && "Done"}
                      </div>
                      <button
                        onClick={() => {
                          stopListening();
                          stopSpeaking();
                          setVoiceOverlayOpen(false);
                          setVoiceTranscript("");
                          setVoiceMode("idle");
                        }}
                        className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Central waveform orb */}
                    <div className="flex-1 flex flex-col items-center justify-center px-6">
                      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                        {/* Layered animated rings */}
                        {voiceMode === "listening" && (
                          <>
                            <div
                              className="absolute inset-0 rounded-full border border-amber-400/40"
                              style={{ transform: `scale(${1 + audioLevel * 0.4})`, transition: "transform 0.1s" }}
                            />
                            <div
                              className="absolute rounded-full border border-amber-400/25"
                              style={{
                                inset: "-20px",
                                transform: `scale(${1 + audioLevel * 0.5})`,
                                transition: "transform 0.15s",
                              }}
                            />
                            <div
                              className="absolute rounded-full border border-amber-400/15"
                              style={{
                                inset: "-40px",
                                transform: `scale(${1 + audioLevel * 0.6})`,
                                transition: "transform 0.2s",
                              }}
                            />
                          </>
                        )}
                        {voiceMode === "processing" && (
                          <>
                            <div className="absolute inset-0 rounded-full border border-amber-400/30 animate-pulse" />
                            <div
                              className="absolute inset-[-20px] rounded-full border-2 border-transparent"
                              style={{
                                borderTopColor: "#fbbf24",
                                animation: "spin 1s linear infinite",
                              }}
                            />
                          </>
                        )}
                        {voiceMode === "speaking" && (
                          <>
                            <div className="absolute inset-0 rounded-full border border-emerald-400/40 animate-ping" />
                            <div className="absolute inset-[-20px] rounded-full border border-emerald-400/25 animate-pulse" />
                          </>
                        )}

                        {/* Main orb */}
                        <div
                          className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                            voiceMode === "listening"
                              ? "bg-gradient-to-br from-amber-300 to-amber-600 shadow-[0_0_60px_rgba(251,191,36,0.6)]"
                              : voiceMode === "speaking"
                              ? "bg-gradient-to-br from-emerald-300 to-emerald-600 shadow-[0_0_60px_rgba(52,211,153,0.6)]"
                              : voiceMode === "processing"
                              ? "bg-gradient-to-br from-amber-400/60 to-amber-700/60"
                              : "bg-gradient-to-br from-neutral-600 to-neutral-800"
                          }`}
                          style={{
                            transform: voiceMode === "listening" ? `scale(${1 + audioLevel * 0.15})` : "scale(1)",
                            transition: "transform 0.1s, background 0.3s",
                          }}
                        >
                          {voiceMode === "speaking" ? (
                            <Volume2 className="w-10 h-10 text-neutral-900" strokeWidth={2} />
                          ) : (
                            <Mic className="w-10 h-10 text-neutral-900" strokeWidth={2} />
                          )}
                        </div>

                        {/* Mini waveform bars around orb when listening */}
                        {voiceMode === "listening" && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex items-center gap-1">
                              {[...Array(7)].map((_, i) => {
                                const h = 8 + Math.sin(Date.now() / 200 + i) * 6 + audioLevel * 30;
                                return (
                                  <div
                                    key={i}
                                    className="w-1 rounded-full bg-white/60"
                                    style={{
                                      height: `${h}px`,
                                      transform: `translateY(${80}px) rotate(${(i - 3) * 20}deg) translateY(-80px)`,
                                      transition: "height 0.08s",
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Transcript */}
                      <div className="text-center max-w-xs min-h-[60px]">
                        {voiceTranscript ? (
                          <div className="text-xl text-white font-medium leading-snug animate-[fadeIn_0.3s_ease-out]">
                            "{voiceTranscript}"
                          </div>
                        ) : voiceMode === "listening" ? (
                          <div className="text-neutral-500 text-sm">Go ahead, I'm listening...</div>
                        ) : voiceMode === "processing" ? (
                          <div className="text-neutral-400 text-sm italic">Thinking...</div>
                        ) : voiceMode === "speaking" && messages.length > 0 ? (
                          <div className="text-sm text-neutral-200 leading-relaxed px-2">
                            {messages[messages.length - 1]?.content}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Try saying... suggestions (only when listening with no transcript yet) */}
                    {voiceMode === "listening" && !voiceTranscript && (
                      <div className="px-6 pb-6">
                        <div className="text-[10px] tracking-widest uppercase text-neutral-600 mb-2 text-center">
                          Try saying
                        </div>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {(selectedEpisode
                            ? [
                                "Who is that character?",
                                "Recap this episode",
                                "Rate this 5 stars",
                                "Show the character map",
                              ]
                            : [
                                "Go home",
                                "Show my vault",
                              ]
                          ).map((s) => (
                            <div
                              key={s}
                              className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400"
                            >
                              "{s}"
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bottom controls */}
                    <div className="px-6 pb-8 flex items-center justify-center gap-4">
                      {voiceMode === "listening" && (
                        <button
                          onClick={() => {
                            stopListening();
                            setVoiceMode("idle");
                          }}
                          className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold hover:bg-white/15"
                        >
                          Stop
                        </button>
                      )}
                      {voiceMode === "speaking" && (
                        <button
                          onClick={stopSpeaking}
                          className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200"
                        >
                          Stop speaking
                        </button>
                      )}
                      {voiceMode === "idle" && (
                        <button
                          onClick={startListening}
                          className="px-6 py-2.5 rounded-full bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400"
                        >
                          <Mic className="w-3.5 h-3.5 inline mr-1.5" /> Tap to speak again
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Fallback banner if voice unsupported */}
                {!voiceSupported && voiceOverlayOpen && (
                  <div className="absolute inset-x-4 bottom-24 z-30 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-[11px] text-amber-200">
                    Voice input isn't supported in this browser. Try Chrome, Edge, or Safari.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STUDIO DASHBOARD */}
        {screen === "analytics" && (
          <div className="relative w-full max-w-2xl animate-[fadeIn_0.4s_ease-out]">
            <div className="rounded-3xl bg-neutral-900/80 backdrop-blur border border-white/10 p-6 md:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400 tracking-widest uppercase mb-1">
                    <BarChart3 className="w-3 h-3" /> Studio Intelligence
                  </div>
                  <h2 className="text-2xl font-bold text-white">Fandom Signals</h2>
                  <p className="text-xs text-neutral-500 mt-1">Live behavioral data from the community.</p>
                </div>
                <button onClick={goBack} className="text-neutral-400 hover:text-white text-sm flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-1 text-[9px] tracking-widest uppercase text-neutral-500 mb-1"><MessageCircle className="w-3 h-3" /> Questions</div>
                  <div className="text-xl font-bold text-white">{analytics.totalQuestions}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-1 text-[9px] tracking-widest uppercase text-neutral-500 mb-1"><Star className="w-3 h-3" /> Ratings</div>
                  <div className="text-xl font-bold text-white">{myReviews.length}</div>
                  <div className="text-[9px] text-neutral-500">avg {avgRating || "—"}★</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-1 text-[9px] tracking-widest uppercase text-neutral-500 mb-1"><List className="w-3 h-3" /> Lists</div>
                  <div className="text-xl font-bold text-white">{myLists.length}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-1 text-[9px] tracking-widest uppercase text-neutral-500 mb-1"><UserPlus className="w-3 h-3" /> Follows</div>
                  <div className="text-xl font-bold text-white">{following.size}</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-neutral-500 mb-3">
                  <TrendingUp className="w-3 h-3" /> Confusion Signal Breakdown
                </div>
                {Object.keys(analytics.signalCounts).length === 0 ? (
                  <div className="p-6 rounded-xl bg-white/5 border border-dashed border-white/10 text-center">
                    <div className="text-xs text-neutral-500">Ask questions in the app to populate this dashboard.</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(analytics.signalCounts).sort((a, b) => b[1] - a[1]).map(([signal, count]) => {
                      const max = Math.max(...Object.values(analytics.signalCounts));
                      const pct = (count / max) * 100;
                      return (
                        <div key={signal}>
                          <div className="flex justify-between items-baseline mb-1">
                            <div className="text-xs text-neutral-300">{signalLabels[signal] || signal}</div>
                            <div className="text-[10px] text-neutral-500">{count}</div>
                          </div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-neutral-500 mb-3">
                  <MessageCircle className="w-3 h-3" /> Recent Questions (anonymized)
                </div>
                {analytics.recentQuestions.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-neutral-500">No questions yet.</div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {analytics.recentQuestions.map((q, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="text-xs text-neutral-200 flex-1">"{q.text}"</div>
                          <div className="text-[9px] text-neutral-500 flex-shrink-0">{q.show} · {q.episode}</div>
                        </div>
                        {q.signals.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {q.signals.map((s) => (
                              <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                {signalLabels[s] || s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpSheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(LoreDemo));
