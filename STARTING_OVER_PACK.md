# Starting Over — pack design

A second one-time-purchase package, for people who moved country and began
again. Three paths, 42 days, €2.99 — the same shape and price as Kairos
Moments.

**Why this one.** Nothing in the 53 covers it. `transitions-navigator` is about
change in the abstract; this is about the specific experience of arriving
somewhere your competence doesn't transfer, your humour doesn't land, and
nobody knows who you used to be. It is also the founder's own story, which
means it can be written from inside rather than researched — and that is
exactly the difference a reader feels.

---

## The three paths

| id | title | days | what it covers |
|---|---|---|---|
| `starting-over` *(anchor)* | The Crossing | 14 | the rupture, the leaving, the first disoriented months |
| `learning-to-speak` | Learning to Speak | 14 | language, and who you are when you cannot say what you mean |
| `two-homes` | Two Homes | 14 | the long middle: belonging to neither, then to both |

`starting-over` is the anchor — buying any of the three purchases it, and
owning it unlocks all three. That is already how `pathBundles.js` works.

**Order matters.** The Crossing is grief, Learning to Speak is humiliation and
recovery, Two Homes is integration. Someone six months in needs the first;
someone six years in will find the third is the one that lands. Sold together
so they can start wherever they actually are.

---

## Path 1 — The Crossing (14 days)

The part everyone gets wrong about leaving: it is not one decision, it is a
hundred small severances, and most of them you notice afterwards.

| day | title | theme |
|---|---|---|
| 1 | What Ended | Rupture |
| 2 | Chosen or Forced | Agency |
| 3 | What You Packed | Selection |
| 4 | What You Left | Loss |
| 5 | The Last Day | Departure |
| 6 | The First Week | Arrival |
| 7 | Suddenly Incompetent | Humility |
| 8 | The Paperwork | Endurance |
| 9 | Who You Told | Disclosure |
| 10 | The First Time You Cried Here | Breaking |
| 11 | What You Expected to Miss | Prediction |
| 12 | What Surprised You | Discovery |
| 13 | Who Helped | Debt |
| 14 | A Letter to the Plane | Integration |

## Path 2 — Learning to Speak (14 days)

The least-written part, and the one that changes people most. You do not just
lose words. You lose the version of yourself that was quick.

| day | title | theme |
|---|---|---|
| 1 | The Word You Couldn't Find | Silence |
| 2 | Treated as Simple | Perception |
| 3 | Your Jokes Don't Land | Humour |
| 4 | The Exhaustion | Cost |
| 5 | The First Joke You Understood | Threshold |
| 6 | The First Joke You Made | Return |
| 7 | Words They Have That You Don't | Gain |
| 8 | Words You Have That They Don't | Untranslatable |
| 9 | Who You Are in Each Language | Selves |
| 10 | The Night You Dreamt in It | Crossing Over |
| 11 | Losing Your Own | Erosion |
| 12 | Talking to Family | Drift |
| 13 | The Accent | Permanence |
| 14 | What You Can Say Now | Fluency |

## Path 3 — Two Homes (14 days)

Where it stops being an ordeal and becomes a life — and what that costs.

| day | title | theme |
|---|---|---|
| 1 | When It Stopped Being Temporary | Recognition |
| 2 | The First Thing Here You'd Defend | Belonging |
| 3 | Going Back | Return |
| 4 | A Foreigner There Now | Displacement |
| 5 | What You Carried That Works | Continuity |
| 6 | What You Carried That Doesn't | Adaptation |
| 7 | The One Who Stayed | Counterfactual |
| 8 | Smell, Food, a Song | Involuntary |
| 9 | "Where Are You From?" | Explanation |
| 10 | The Legal Self | Paper |
| 11 | What You Built | Evidence |
| 12 | Who You'd Be If You'd Stayed | Shadow |
| 13 | To Someone Arriving Tomorrow | Transmission |
| 14 | The Ledger | Reckoning |

---

## Drafted prompts

Five written out in full, spread across all three paths, so the voice can be
judged before the other 37 are written.

### The Crossing — Day 1

```js
{
  day: 1,
  title: "What Ended",
  theme: "Rupture",
  prompt: `Before the moving, before the paperwork, something ended. Start there.

• What actually ended — a plan, a career, a relationship, a body that worked, a country that stopped being possible?
• Did you get to grieve it, or did the logistics start immediately?
• What have you been calling "a move" that was really a loss?

Write the ending in one sentence, without the word "but".`
}
```

### The Crossing — Day 7

```js
{
  day: 7,
  title: "Suddenly Incompetent",
  theme: "Humility",
  prompt: `You knew how to do everything. Then you didn't know how to post a letter.

• What ordinary task defeated you first — a form, a ticket machine, a phone call, a shop?
• You were competent somewhere. What did it do to you to be treated as though you weren't?
• Who watched you fail at something small, and how did you feel about them afterwards?

Name one thing you can do now without thinking that once took your whole day.`
}
```

### Learning to Speak — Day 2

```js
{
  day: 2,
  title: "Treated as Simple",
  theme: "Perception",
  prompt: `Your vocabulary shrank. People assumed you had.

• When did someone speak to you slowly, loudly, or in very short words, and what did that feel like?
• What were you actually thinking in that moment that you couldn't say?
• Have you ever done this to someone else, before you knew?

Write one sentence you wanted to say back — in your own language, then in theirs.`
}
```

### Learning to Speak — Day 11

```js
{
  day: 11,
  title: "Losing Your Own",
  theme: "Erosion",
  prompt: `The new language arrives by taking room from the old one. Nobody warns you.

• When did you first reach for a word in your own language and find the foreign one instead?
• What does it cost you that your mother tongue is now slightly slower?
• Who at home has noticed, and what did they say?

Write three sentences in your first language, about anything. Notice what it feels like.`
}
```

### Two Homes — Day 14

```js
{
  day: 14,
  title: "The Ledger",
  theme: "Reckoning",
  prompt: `Both columns are real. Write both, and don't balance them for comfort.

• What did leaving cost you — plainly, without the redemptive ending?
• What did it buy that you could not have bought by staying?
• Which of those two lists were you avoiding writing?

If the ledger doesn't balance, say so. Some don't.`
}
```

---

## Notes for whoever builds it

**A disclaimer is probably warranted.** Displacement often sits next to trauma
— accidents, war, family separation, asylum. The pattern already exists:
`JourneyDisclaimerModal` gates `transformation-journey` and is shown from
`JourneyPreviewModal` for that path alone. A version of it here should point at
resources for displacement and trauma rather than substance recovery, and it
would need the same three-language treatment.

**Voice.** Second person, direct, no consolation offered before it is earned.
The closing line of each day is an instruction, not an affirmation. Day 14 of
Two Homes ends on "some don't" deliberately — the honesty directive in
`claudeService.js` applies to the analysis, and the prompts should not promise
something the analysis will then refuse to deliver.

**Wiring it up, once the prompts exist.**
1. Three day-arrays in `JourneyData.js`, three `createJourneyPath` registrations
   with `isExclusive: true` and a shared `color`.
2. One entry in `BUNDLES` in `src/constants/pathBundles.js`:
   `'starting-over': { label: 'Starting Over', paths: ['starting-over', 'learning-to-speak', 'two-homes'] }`
3. One entry in `EXCLUSIVE_PATH_PRODUCTS` in `functions/index.js` with the new
   Stripe product id and `unitAmount: 299`.
4. Translations into `de` and `ka` under `src/data/journeyTranslations/`.

Nothing else. `PathSelection`, `PathUnlockModal`, the webhook and invite codes
all read through the helpers and need no changes.
