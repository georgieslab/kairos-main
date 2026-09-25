// src/data/podcasts.js
// The single podcast episode featured on the "Listen" screen (Home / Profile → Listen),
// plus the journaling info shown in the glassy pop-up on that screen.
// English-only content by design (only the screen chrome is localized).
//
// To publish audio: drop the file in `public/podcasts/` and point `audioUrl` at it
// (e.g. '/podcasts/ink-and-intention.m4a' — .m4a/AAC and .mp3 both play natively),
// OR omit audioUrl and set an external `link` to open in a new tab.

export const PODCAST = {
  title: 'Ink & Intention',
  tagline: 'Handwriting & journaling, unhurried',
  description:
    "A quiet conversation about writing by hand in a world of keyboards and voice notes — why the slow act of forming letters sharpens memory and focus, how a blank page becomes a daily ritual, and small, forgiving ways to make journaling a habit that lasts.",
  durationMin: 20,
  audioUrl: '/podcasts/ink-and-intention.aac',
  // link: 'https://…', // used instead of the inline player when there's no audioUrl
};

// Shown in the glassy "About journaling" pop-up on the Listen screen.
export const ABOUT_JOURNALING = {
  title: 'Why journaling works',
  intro: 'A few unhurried minutes on the page do more than you might think.',
  points: [
    { title: 'Clears the mind', text: 'Putting thoughts into words offloads mental clutter and quiets the noise.' },
    { title: 'Strengthens memory', text: 'Forming letters by hand encodes what you live more deeply than typing does.' },
    { title: 'Processes emotion', text: 'Naming a feeling on the page takes some of its edge away.' },
    { title: 'Reveals patterns', text: 'Over weeks, your entries surface the themes running quietly through your days.' },
    { title: 'Builds intention', text: 'A small daily ritual turns autopilot back into choice.' },
  ],
};

// Curated contemplative ambient soundscapes for writing sessions
export const AMBIENT_TRACKS = [
  {
    id: 'rain',
    title: 'Rain on Japanese Slate',
    subtitle: 'Gentle raindrops falling on ancient stone tiles',
    tagline: 'Focus · Deep Calm',
    iconName: 'CloudRain',
    colorRgb: '79, 140, 201',
    durationLabel: 'Infinite Loop'
  },
  {
    id: 'temple',
    title: 'Temple Singing Bowl',
    subtitle: '432Hz harmonic drone with resonant bronze bells',
    tagline: 'Contemplation · Zen',
    iconName: 'Bell',
    colorRgb: '201, 169, 97',
    durationLabel: 'Infinite Loop'
  },
  {
    id: 'pen',
    title: 'Fountain Pen Whispers',
    subtitle: 'Archival nib acoustics & fibrous paper texture',
    tagline: 'Writing · Tactile Presence',
    iconName: 'PenTool',
    colorRgb: '85, 139, 110',
    durationLabel: 'Infinite Loop'
  },
  {
    id: 'night',
    title: 'Celestial Night',
    subtitle: 'Cosmic emerald aurora & deep harmonic stillness',
    tagline: 'Evening · Rest',
    iconName: 'Moon',
    colorRgb: '147, 112, 219',
    durationLabel: 'Infinite Loop'
  }
];

