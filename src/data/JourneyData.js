import i18n from '../i18n/config';

// Central registry for all journey paths
export const JOURNEY_PATHS = {};

export const decidingToDoingDays = [
  {
    day: 1,
    title: "Closing Doors",
    theme: "Decision aftermath and emotional reality",
    prompt: `You've made a decision. Other paths are closed. How does this actually feel in your body right now?

Explore these aspects:
• What physical sensations do you notice when you think about this choice? (Tightness? Relief? Heaviness?)
• Which closed door are you still looking back at? Be honest.
• What does 'relief' feel like for you? Is it peaceful or just the absence of anxiety?
• What does 'terror' feel like? Where do you feel it?
• Write this sentence and complete it: 'Now that I've chosen, I can no longer pretend that I...'
• What are you grieving by closing the other options?

Don't rationalize. Just describe what's true.`
  },
  {
    day: 2,
    title: "What Are You Waiting For?",
    theme: "Identifying the invisible barriers",
    prompt: `You know what to do next. But you're not doing it. What are you actually waiting for?

Answer each honestly:
• Permission from whom? (Name them. Even if it sounds silly.)
• What 'energy' are you waiting to feel? (Describe it specifically - motivated? fearless? certain?)
• What would 'the right moment' look like? (Paint the picture - what needs to be true?)
• How will you know when you're 'ready'? (What's the signal you're listening for?)
• If you had to start today, what would be your excuse? (Write it exactly as you'd say it to someone else.)
• Is that excuse protecting you from something? What?

Complete this: 'I'll start when...' - then challenge that statement.`
  },
  {
    day: 3,
    title: "What Does 'Launched' Actually Mean?",
    theme: "Separating perfect from complete",
    prompt: `Forget 'perfect.' What does 'done and out there' actually look like for your project?

Be brutally specific:
• If you launched today, what would exist? (List the actual things - page, post, product, whatever)
• What's the minimum that counts as 'real'? (Not your ideal - the floor, not the ceiling)
• What are you adding because it's necessary vs. because you're stalling?
• Which features are you hiding behind? (The ones you 'need' before launch - list them)
• For each feature above: What if you launched without it? Really, what would happen?
• What does 'good enough to be useful' look like?
• Write this: 'My project is launched when someone who isn't me can...' (finish that sentence)

Now imagine someone using your 'good enough' version. What do they experience?`
  },
  {
    day: 4,
    title: "Not Planning - Doing",
    theme: "Execution vs. preparation",
    prompt: `Not another plan. Not more research. What's the smallest ACTUAL action you could take today?

Work through this:
• What would take 15 minutes and move the project forward? (Not thinking about moving it - actually moving it)
• List 3 tiny actions. Which one are you avoiding most? (That's probably the one to do)
• What's the difference between 'preparing to start' and 'starting'? (For YOUR project specifically)
• How much of today did you spend 'getting ready' vs 'doing'? (Rough percentage)
• What did you do today that felt productive but wasn't execution? (Be specific)
• What's the next physical action that would make the project more real? (Something someone could witness)

Before bed tonight: Did you do the tiny action? Yes or no. If no, why not? (No judgment - just data.)`
  },
  {
    day: 5,
    title: "The Failure Fantasy",
    theme: "Confronting worst-case scenarios",
    prompt: `Your project fails completely. It's done and out there, and nobody cares. Sit with this. Really feel it.

Explore what that means:
• What actually happens if it fails? (Not dramatic - literal. What changes in your life?)
• Who would know? (Honestly - who's even watching?)
• What would you tell yourself in that moment? (Your self-talk when it doesn't work)
• Would you regret trying, or regret the time spent? (There's a difference)
• What would 'failure' take away from you? (Identity? Hope? Security? Name it)
• Has something you've done 'failed' before? (What did you survive from that?)
• Write this sentence: 'If this fails, it means...' - then challenge whether that's actually true

Here's the real question: Is the fear of failure bigger than the cost of never trying?`
  },
  {
    day: 6,
    title: "The Success Fear",
    theme: "Why success might be scarier than failure",
    prompt: `Your project succeeds. People want it. It's real and growing. This might be more frightening than failure.

Explore what success would demand:
• What would you have to become if this worked? (What version of you would be required?)
• What comfort would you lose? (The safety of 'potential,' the excuse of 'someday')
• What would people expect from you then? (Ongoing delivery? Consistency? Visibility?)
• What if success meant you couldn't go back to how things were? (Would you want to?)
• What responsibility would success create? (For others? For yourself?)
• Complete this: 'I'm afraid that if this works, I'll have to...'
• Which is scarier: failing publicly or succeeding publicly? (Be honest about why)

Success means being seen. Are you ready to be visible?`
  },
  {
    day: 7,
    title: "From Potential to Actual",
    theme: "Identity transformation",
    prompt: `This project has been 'potential' - something you might do, could do, will do someday. What if it becomes real today?

Identity questions:
• Who are you if you're someone who 'did it' instead of 'might do it'? (Not hypothetically - who is that person?)
• What do you gain by keeping it potential? (The comfort of infinite possibilities?)
• What do you lose by keeping it potential? (The reality of having done something?)
• How long have you been 'about to start' this? (Count the days, weeks, months, years)
• Write this sentence 10 times, filling it differently each time: 'I am someone who...'
• Which of those 10 sentences is true today? Which is true if you launch?
• What's the story you'll tell about this moment? (When you look back - what will you say about now?)

Final question: What if you stopped deciding and just did it? What if today is the day the gap closes?`
  }
];

export const letterToMyselfDays = [
  {
    day: 1,
    title: "A Letter to Your Past Self",
    theme: "Reflection",
    prompt: `A year ago, you were a different person carrying different weight. Write to them now, as someone who made it to the other side of whatever they were facing.

• What were they most afraid of back then? Did it actually happen?
• What's one thing you know now that would have spared them months of worry?
• What did they get right that you've forgotten to credit them for?
• Is there a promise you didn't keep, or a version of yourself you abandoned too fast — do they deserve an apology?

Sign it. Then read it back as if you were them receiving it - does it land as kindness, or performance?`
  },
  {
    day: 2,
    title: "Letter from Your Inner Child",
    theme: "Playfulness",
    prompt: `Somewhere underneath the adult you've become, a much younger version of you is still keeping score of what got left behind. Let them write first, in their own voice - messy, honest, unfiltered.

• What do they think you take too seriously now?
• What game, story, or make-believe world did they love that you haven't touched in years?
• What are they proud of you for, even if you don't feel it yourself?
• What's one thing they wish you'd let yourself want again, out loud?

Don't clean up their voice or make it sound wiser than it is. Let it stay exactly as young and unguarded as it needs to be.`
  },
  {
    day: 3,
    title: "A Letter of Forgiveness",
    theme: "Compassion",
    prompt: `Pick the one mistake you replay most - the one your mind still drags out late at night. Write the letter you'd actually need in order to put it down.

• What did you do, exactly - no euphemisms, no softening?
• What were you actually trying to protect or survive when you did it?
• If your closest friend had done the same thing, what would you tell them?
• What's the sentence you're withholding from yourself that would end this?

Write it, then say it out loud once. Notice what in your body resists believing it.`
  },
  {
    day: 4,
    title: "Letter to Your Future Self",
    theme: "Vision",
    prompt: `A year from today, someone who used to be exactly where you are right now will open this letter. Write to them like they're real, because they will be.

• What do you want them to have finally stopped tolerating?
• What's one promise you're making that you actually intend to keep - not the aspirational kind, the specific kind?
• What do you hope they remember about right now, even the hard parts?
• What would make you proud of them, regardless of how things turn out?

Seal it with something only future-you will understand.`
  },
  {
    day: 5,
    title: "Letter of Gratitude to Yourself",
    theme: "Appreciation",
    prompt: `You've kept yourself moving through things no one else fully witnessed. Write the thank-you letter you'd never think to send yourself.

• What did you survive this year that you rarely give yourself credit for?
• Where did you show up for someone else while running on empty - and still did it?
• What strength do you have now that cost you something to earn?
• If a friend had done everything you did this year, what would you tell them?

Read it back slowly. Let yourself actually receive it instead of deflecting.`
  },
  {
    day: 6,
    title: "Letter from Your Wisest Self",
    theme: "Wisdom",
    prompt: `Somewhere ahead of you is a version of yourself who already made it through what you're facing now - decades older, unbothered, clear-eyed. Let them write to you directly.

• What do they already know that you're still fighting to believe?
• What are you currently treating as a crisis that they'd call a Tuesday?
• What would they tell you to stop apologizing for?
• What's the one piece of advice they'd repeat if you forgot everything else they said?

Write in their voice, not yours - calm, unhurried, done with proving anything.`
  },
  {
    day: 7,
    title: "A Love Letter to Yourself",
    theme: "Self-Love",
    prompt: `Write the letter you'd want to receive on your worst day - not generic affirmations, the real, specific things that are true about you.

• Name three things about yourself that have nothing to do with your usefulness to other people.
• What's a quirk you used to be embarrassed by that you've quietly grown to like?
• What has your body carried you through that deserves acknowledgment instead of criticism?
• If tenderness had a voice, what would it say to you right now?

End with the sentence you most need to hear - then let yourself believe it, even for one minute.`
  }
];

export const journeyDays = [
  {
    day: 1,
    title: "Beginning the Journey",
    theme: "Self-Awareness",
    prompt: `You opened this app instead of closing it. Something in you wanted this practice enough to start. Start there.

• What's actually going on in your life right now that made you say yes to this?
• What do you hope journaling gives you that you're not getting anywhere else?
• What's your honest track record with practices like this - do you finish what you start, or does life get in the way? Why might this time be different?
• What would you be disappointed not to have discovered about yourself in ten days?

Name the thing you're hoping for, plainly, even if it feels small.`
  },
  {
    day: 2,
    title: "Values Exploration",
    theme: "Core Values",
    prompt: `Everyone says they value "honesty" or "family." Skip the words that sound good and find the ones that actually run your life.

• Look at how you spent your time and money this past week - what do those choices say you value, whether you meant them to or not?
• Name 3-5 values that are genuinely yours, not inherited from someone you're still trying to please.
• Which one do you violate most often, and what does that cost you?
• If you built a day entirely around your top value, what would you stop doing?

Pick the value you're least living up to. What's one choice this week that would honor it?`
  },
  {
    day: 3,
    title: "Life Chapters",
    theme: "Personal Narrative",
    prompt: `If your life were a book, someone reading it cold would notice things you've stopped seeing because you're too close to the story.

• Name the chapters so far - not the years, the actual turning points that split "before" and "after."
• Which chapter would you tell a stranger about, and which one would you skip?
• What's the chapter title for right now? Be honest even if it's not flattering.
• Is there a chapter you're still stuck rereading instead of turning the page on?

Write the one-sentence summary for the chapter you think comes next.`
  },
  {
    day: 4,
    title: "Inner Critic",
    theme: "Self-Compassion",
    prompt: `That voice that narrates your mistakes before anyone else can - give it a shape today instead of just obeying it.

• What does it actually say, word for word, the last time it spoke up?
• Whose voice does it borrow - a parent, a teacher, an old version of you?
• What is it so afraid will happen if it stops criticizing you?
• When has it been useful, and when has it just been cruel dressed up as useful?

Write one sentence back to it - not to silence it, but to negotiate with it like you would with a scared, overprotective friend.`
  },
  {
    day: 5,
    title: "Sources of Joy",
    theme: "Meaning & Purpose",
    prompt: `Notice what makes you lose track of time - not what you think should, what actually does.

• Name the last time hours passed without you checking the clock. What were you doing?
• What do those moments have in common - challenge, connection, creation, solitude?
• How much of your week is built around access to that feeling versus around obligation?
• What's one thing you used to love that quietly disappeared from your life - and why did it go?

If you protected one hour this week purely for this, what would you actually do with it?`
  },
  {
    day: 6,
    title: "Relationship Patterns",
    theme: "Connection",
    prompt: `The people closest to you keep meeting the same version of you, whether you intend that or not.

• What role do you always end up playing in your close relationships - the fixer, the one who pulls away first, the peacekeeper?
• What do you chronically seek from others that you could be giving yourself?
• Name a pattern that shows up with more than one person in your life. What does that tell you about you, not them?
• What's the conversation you keep avoiding because it might change the dynamic?

What would it cost you to break the pattern once, this week, with one specific person?`
  },
  {
    day: 7,
    title: "Future Self",
    theme: "Growth",
    prompt: `Five years out, living a life you'd actually call fulfilling - stop being vague about what that looks like.

• What does a normal Tuesday look like for that version of you, in concrete detail?
• What have they stopped tolerating that you currently put up with?
• What quality did they have to develop that you don't have yet?
• What would they tell you about the thing you're most anxious about right now?

Name one decision in front of you today that this future self would make differently than you're about to.`
  },
  {
    day: 8,
    title: "Limiting Beliefs",
    theme: "Mindset",
    prompt: `Somewhere you picked up a rule about what you're capable of, and you've been living inside it like it's fact.

• Finish this sentence honestly: "People like me don't..." or "I'm the kind of person who can't..."
• Where did that belief come from - who taught it to you, and were they qualified to?
• What evidence have you collected that actually contradicts it, that you've been ignoring?
• Who would you be, this month, if you simply stopped assuming it was true?

What's one small action you could take today that the old belief would have talked you out of?`
  },
  {
    day: 9,
    title: "Gratitude Reflection",
    theme: "Appreciation",
    prompt: `Skip the postcard version of gratitude. Find the gratitude that's tangled up with difficulty.

• What's something ordinary from today you'd miss badly if it were gone tomorrow?
• Name something hard you're grateful for anyway - not despite the difficulty, but because of what it gave you.
• Who has shown up for you recently in a way you haven't properly acknowledged?
• What are you grateful for about your own resilience this season, specifically?

Tell one of these people what you noticed, today if you can.`
  },
  {
    day: 10,
    title: "Integration",
    theme: "Wisdom",
    prompt: `Ten days of your own words are sitting behind you now - go back and actually read them instead of assuming you remember what you wrote.

• What comes up more than once, in different words, across these entries?
• What surprised you about yourself in this process?
• What's one truth you wrote that you're tempted to forget the moment this journey ends?
• If a friend had written everything you just read, what would you tell them about themselves?

Write that truth somewhere you'll actually see it again - not just here.`
  }
];

// Emotional Intelligence 10-day journey
export const emotionalIntelligenceDays = [
  {
    day: 1,
    title: "Emotional Awareness",
    theme: "Feeling Recognition",
    prompt: `Most people move through a day feeling five different things and naming none of them. Slow down and actually catalog today.

• Name 3-5 emotions you felt today, as precisely as you can - not just "bad" or "fine."
• For each one: where did you feel it in your body, specifically?
• What was happening right before each one showed up?
• Which one did you act on, and which one did you swallow?

Pick the emotion you swallowed. What would have happened if you'd let it show?`
  },
  {
    day: 2,
    title: "Emotional Vocabulary",
    theme: "Expression",
    prompt: `"Fine," "stressed," "good" - these words hide more than they reveal. Your emotional life is more specific than your vocabulary for it.

• Beyond happy, sad, angry, and scared, list at least 10 precise feeling words that actually match your life right now (e.g. wistful, depleted, defensive, tender, restless).
• Which of these words do you use often in your head but rarely say out loud to another person?
• Pick one nuanced emotion from your list - when did you last feel it, and did anyone know?
• What's a feeling you have that English doesn't have a clean word for? Describe it anyway.

Use one of these precise words the next time someone asks how you're doing - notice what happens.`
  },
  {
    day: 3,
    title: "Emotional Patterns",
    theme: "Self-Knowledge",
    prompt: `One emotion keeps showing up in your life more than any other - it's worth knowing why.

• Name the emotion that visits you most often, uninvited.
• What situations reliably bring it on? Be specific, not general.
• What does this emotion protect you from, or get you out of?
• If this emotion could talk, what would it say it's trying to accomplish for you?

Where in your life is this emotion actually costing you more than it's protecting you?`
  },
  {
    day: 4,
    title: "Difficult Emotions",
    theme: "Acceptance",
    prompt: `Pick the emotion you're fastest to shut down or explain away the moment it shows up.

• Name it specifically - not "negative feelings," the actual emotion.
• What's your go-to move when it arises - distraction, anger at yourself, forced positivity?
• What has this emotion been trying to tell you that you've been too quick to silence?
• What would it cost you to just let it exist for sixty seconds without fixing it?

Let yourself feel it right now, unedited, for one minute before you write anything else.`
  },
  {
    day: 5,
    title: "Emotional Triggers",
    theme: "Self-Regulation",
    prompt: `Certain situations hijack you reliably - the same tone of voice, the same kind of comment, the same silence.

• Name two or three situations that reliably trigger a strong reaction in you.
• What's the very first sensation you notice right before you react - the tell, before the explosion?
• Trace one trigger back - when do you remember first feeling this exact charge?
• What do you wish you could do in that first-sensation moment instead of what you usually do?

Name one upcoming situation this week where this trigger is likely to show up. What's your plan for the first ten seconds?`
  },
  {
    day: 6,
    title: "Emotion & the Body",
    theme: "Embodiment",
    prompt: `Your body knows what you're feeling before your mind catches up and names it.

• Recall a recent strong emotion - where exactly did you feel it? Chest, jaw, stomach, shoulders?
• Describe the physical sensation itself, not the story around it - tight, hot, hollow, buzzing?
• What's the earliest physical warning sign that an emotion is building, before it takes over?
• How often do you notice the body's signal versus only noticing once you're already reacting?

Name one physical cue you'll watch for this week as an early warning system.`
  },
  {
    day: 7,
    title: "Emotional Needs",
    theme: "Self-Care",
    prompt: `Behind every persistent bad mood is usually an unmet need that never got named, let alone addressed.

• What emotional needs matter most to your wellbeing - to be heard, to rest, to matter, to be right?
• How do you typically know when one of these needs isn't being met - what does the warning sign feel like?
• Which need have you been neglecting the longest, and why?
• What's one honest way to ask for it, instead of hoping someone notices?

Name the person or situation where you'll actually voice this need this week.`
  },
  {
    day: 8,
    title: "Empathy Practice",
    theme: "Understanding Others",
    prompt: `Pick a recent disagreement you're still a little annoyed about, and do the harder thing - imagine it from their side.

• What actually happened, in plain facts, without your interpretation attached?
• What might they have been feeling in that moment that you didn't consider at the time?
• What need might they have been trying to protect or meet?
• Does anything change about your anger once you consider their side honestly?

What's one thing you'd say differently if this conversation happened again tomorrow?`
  },
  {
    day: 9,
    title: "Emotional Resilience",
    theme: "Recovery",
    prompt: `Everyone gets knocked down emotionally - the real skill is in how you find your way back up.

• Think of your last genuinely hard emotional stretch - what actually helped you move through it, versus what you thought should help?
• What do you tend to do that makes recovery slower, even if it feels comforting in the moment?
• Who or what has been reliable for you during hard emotional periods?
• What's one new strategy you're curious to try next time you're knocked down?

Name the person you'd call first next time, and whether you actually would.`
  },
  {
    day: 10,
    title: "Emotional Integration",
    theme: "Wisdom",
    prompt: `Ten days of naming, tracking, and sitting with your emotions - look back at what actually changed.

• What pattern showed up more than once across this journey that you hadn't noticed before?
• What's one emotion you understand differently now than you did on day one?
• Where did you surprise yourself - a feeling you handled better, or worse, than expected?
• What's one specific way you want your relationship with your emotions to keep growing?

Write the one sentence about your emotional life you most want to remember a year from now.`
  }
];

// Mindfulness Awareness 10-day journey
export const mindfulnessAwarenessDays = [
  {
    day: 1,
    title: "Present Moment",
    theme: "Awareness",
    prompt: `Stop and actually inventory this exact moment before you write anything else - five things you see, four you feel, three you hear, two you smell, one you taste.

• Write all five senses down, specifically - not "sounds" but the actual sound.
• Which sense gave you the most surprising detail, something you'd normally never register?
• What was your mind doing right before you paused - where had it wandered off to?
• How does your body feel different now than it did sixty seconds ago?

Notice one thing from this list you'll actually still remember tomorrow. Why that one?`
  },
  {
    day: 2,
    title: "Mindful Activity",
    theme: "Engaged Presence",
    prompt: `Pick one routine task today - dishes, walking, brushing your teeth - and give it your entire attention, like it's the only thing happening in the world.

• Describe the activity in physical detail: temperature, sound, weight, texture.
• What did you notice this time that you normally tune out completely?
• Where did your mind try to wander, and what did it want to go do instead?
• What changed in how the activity felt once you actually paid attention to it?

Name one other routine task you'd like to try this with tomorrow.`
  },
  {
    day: 3,
    title: "Thought Patterns",
    theme: "Mental Habits",
    prompt: `Spend five real minutes just watching your thoughts arrive and leave, without grabbing onto any of them.

• What did you actually notice - are your thoughts mostly rehearsing the past, rehearsing the future, or rarely in the present at all?
• Was there a repeat visitor - one thought or worry that kept circling back?
• What's the emotional tone underneath most of them: anxious, bored, critical, calm?
• What surprised you about watching your own mind for five straight minutes?

Name the one thought that showed up that you'd like to examine more honestly.`
  },
  {
    day: 4,
    title: "Body Awareness",
    theme: "Physical Presence",
    prompt: `Move slowly from head to toe and actually check in with each part instead of assuming you already know how your body feels.

• Where did you find tension you weren't expecting?
• What sensation surprised you - warmth, numbness, tightness, ease?
• Is there a part of your body you tend to ignore entirely until it hurts?
• What did your body seem to want, once you actually asked it?

Pick the tightest spot you found. What's been asking to be released there?`
  },
  {
    day: 5,
    title: "Mindful Listening",
    theme: "Receptive Awareness",
    prompt: `Think about how you actually listen when someone else is talking - not how you'd like to think you listen.

• In a recent conversation, were you listening to understand, or already building your response?
• What did you miss because you were half-listening?
• How did your level of presence change the outcome of that conversation, for better or worse?
• Who in your life deserves your full listening the most right now, and how often do they get it?

Name one conversation this week where you'll practice listening without planning your reply.`
  },
  {
    day: 6,
    title: "Mindfulness in Challenges",
    theme: "Equanimity",
    prompt: `Recall a situation recently that knocked you off balance, and look at how you actually handled it in the moment.

• What happened, and what was your first reaction - before you had time to think?
• Where in the situation did you react on autopilot instead of choosing a response?
• What would a mindful pause have looked like right at the peak of that moment?
• What's one thing you'd want to try differently if something similar happens again?

Name a situation likely to come up again soon where you could practice this pause.`
  },
  {
    day: 7,
    title: "Inner Dialogue",
    theme: "Self-Talk",
    prompt: `Listen to the voice running commentary in your head today like you'd listen to a stranger talking to you.

• What's its tone right now - kind, critical, anxious, flat?
• What has it said today that you wouldn't say out loud to someone you love?
• Whose voice does it remind you of?
• What would change if you brought the same attention to this voice that you bring to a real conversation?

Write one sentence back to that inner voice, the way you'd answer a friend who talked to themselves like that.`
  },
  {
    day: 8,
    title: "Gratitude Practice",
    theme: "Appreciation",
    prompt: `Notice five things today you're grateful for - specifically the ordinary ones you'd normally walk right past.

• Name all five, in enough detail that a stranger could picture them.
• Which one did you almost skip because it seemed too small to count?
• What's something you'd miss badly if it disappeared tomorrow, that you haven't thanked anyone or anything for?
• How does your body feel different after naming these versus before?

Tell one person today, specifically, what you noticed and appreciated about them.`
  },
  {
    day: 9,
    title: "Compassion Meditation",
    theme: "Loving-Kindness",
    prompt: `Write a short message of compassion to five different recipients today: yourself, someone you love, an acquaintance, someone you find difficult, and all beings everywhere.

• What does compassion for yourself actually sound like, in your own words?
• What's the hardest of these five messages to write honestly, and why?
• What shifted in your body as you moved through each one?
• Which message would you like to actually say out loud to that person, given the chance?

Notice which recipient you resisted the most - what does that resistance tell you?`
  },
  {
    day: 10,
    title: "Mindfulness Integration",
    theme: "Conscious Living",
    prompt: `Look back over these ten days of trying to actually be present, and take stock honestly.

• What have you learned about your own mind that you didn't know ten days ago?
• Which practice from this journey do you actually want to keep - not the one you think you should keep?
• Where in your daily life is presence hardest for you to access?
• What would change in your relationships or your stress if this became a daily habit instead of a ten-day experiment?

Name one specific moment tomorrow where you'll practice this on purpose.`
  }
];

// Three new 10-day journeys for Καιρός Smart Journal

// Gratitude Practice 10-day journey
export const gratitudePracticeDays = [
  {
    day: 1,
    title: "Gratitude Foundations",
    theme: "Awareness",
    prompt: `Gratitude gets thrown around so casually it's lost its weight - find the real thing before you try to practice it.

• Recall a time you felt genuinely, deeply grateful - not politely thankful. What was happening?
• Where did you feel that gratitude in your body - chest, throat, a loosening somewhere?
• What thoughts came with it? Did it feel like relief, abundance, or something else?
• What's the difference between that feeling and the gratitude you perform on autopilot?

Name what you're actually hoping this practice will change in you over the next ten days.`
  },
  {
    day: 2,
    title: "Simple Pleasures",
    theme: "Daily Appreciation",
    prompt: `Somewhere in today, five small pleasant things happened that you probably didn't clock as gifts.

• Go sense by sense - what did you see, hear, taste, smell, or touch today that felt good?
• Which of these would you have completely forgotten by tomorrow if you hadn't stopped to notice it?
• Is there a pleasure you used to savor that's become background noise through repetition?
• What would it take to actually slow down for these instead of rushing past them?

Pick one of today's five and let yourself enjoy it again, right now, in memory.`
  },
  {
    day: 3,
    title: "People Appreciation",
    theme: "Connection",
    prompt: `Three people have made your life better recently, in ways you probably haven't said out loud.

• Name them, and the specific thing each one did - not "they're nice," the actual action.
• What would you have lost without that specific thing they did?
• Why haven't you told at least one of them directly yet?
• What's holding you back - awkwardness, busyness, or something more real?

Message or call one of them today with the specific thing you're grateful for. Not "thanks for everything" - the detail.`
  },
  {
    day: 4,
    title: "Challenge Gratitude",
    theme: "Growth",
    prompt: `This one's harder - find gratitude inside something that actually hurt.

• Name a recent challenge or obstacle, plainly, without minimizing how hard it was.
• What did it force you to learn about yourself that comfort never would have?
• Who or what showed up for you during it that you might have missed if things were easier?
• Is there a version of gratitude here that isn't "everything happens for a reason" - something more honest?

What's one specific strength this difficulty left you with that you still have today?`
  },
  {
    day: 5,
    title: "Body Gratitude",
    theme: "Physical Wellbeing",
    prompt: `Your body has been working for you your entire life, mostly without a single thank you.

• Name a function, ability, or feature of your body you take completely for granted.
• What has it let you do this week that you didn't pause to appreciate?
• Is there a part of your body you've mostly criticized rather than thanked - what would thanking it sound like?
• What's something your body does for you every single day that would be devastating to lose?

Say thank you to one specific part of your body out loud, and notice how strange or true it feels.`
  },
  {
    day: 6,
    title: "Abundance Awareness",
    theme: "Sufficiency",
    prompt: `Somewhere you have resources, access, or privilege that isn't universal, even if it doesn't feel remarkable to you.

• Name specific material resources, opportunities, or advantages you have that others in your life don't.
• Which one do you complain about most, despite it being something others would trade for?
• How directly do these advantages shape your daily ease, even in ways you don't usually trace back to them?
• What's one way you could extend some of this abundance to someone who doesn't have it?

Name one concrete action this week that shares some of what you have.`
  },
  {
    day: 7,
    title: "Nature's Gifts",
    theme: "Environmental Connection",
    prompt: `The natural world is holding you up right now in ways you rarely register - the air, the light, the ground.

• Name specific elements of nature that brought you something today - joy, calm, plain survival.
• When did you last really stop to notice a landscape, sky, or plant instead of walking past it?
• What in nature do you miss when you go too long without it?
• How does your mood shift on days you spend more time outside versus fully indoors?

Step outside for two minutes today and notice one thing you'd otherwise have missed entirely.`
  },
  {
    day: 8,
    title: "Self-Appreciation",
    theme: "Inner Worth",
    prompt: `You are almost certainly harder on yourself than you are grateful toward yourself - today, flip that ratio.

• Name a quality, achievement, or action of your own you're genuinely grateful for.
• What have you done recently for your own wellbeing that you haven't acknowledged?
• What would you say if a friend had accomplished exactly what you have this month?
• Why is it harder to thank yourself than to thank someone else?

Write one full sentence of thanks to yourself, using your own name, and read it back.`
  },
  {
    day: 9,
    title: "Future Gratitude",
    theme: "Anticipation",
    prompt: `Gratitude doesn't have to wait for something to already be over - try feeling it in advance.

• What's coming up that you're genuinely looking forward to, big or small?
• How does it change your mood right now just to name it and sit with the anticipation?
• Is there something you're dreading that also has a sliver of possibility worth being grateful for in advance?
• What would it look like to walk into that future moment already appreciating it, instead of waiting to see if it goes well?

Name one upcoming moment this week you'll try to be fully present for, gratitude and all.`
  },
  {
    day: 10,
    title: "Gratitude Integration",
    theme: "Practice",
    prompt: `Nine days of deliberately noticing what you're grateful for - look at what actually shifted.

• What's different about how you scan your day now compared to day one?
• Which prompt from this journey surprised you the most?
• What's one specific practice from these nine days you actually want to keep doing?
• Where does gratitude still feel hardest for you to access, even now?

Name the one thing you never want to stop noticing, starting tomorrow.`
  }
];

// Shadow Work Exploration 10-day journey
export const shadowWorkDays = [
  {
    day: 1,
    title: "Shadow Introduction",
    theme: "Awareness",
    prompt: `Everyone has parts of themselves they've exiled to the basement - not because those parts are evil, but because someone once told them they weren't acceptable.

• Which parts of your personality do you actively hide from most people in your life?
• What would people who only know your public self be shocked to learn about you?
• What's a trait you're quick to insist "that's not me" about, a little too quickly?
• Can you approach this with curiosity instead of the usual shame - what changes if you do?

Name one hidden part you're willing to actually look at this week, without flinching away.`
  },
  {
    day: 2,
    title: "Emotional Triggers",
    theme: "Reactions",
    prompt: `Your biggest reactions are rarely about what just happened - they're about something old getting touched.

• Recall a recent moment where your reaction felt bigger than the situation warranted. What was it?
• What exactly triggered you - the words, the tone, the timing?
• If this reaction is a messenger, what disowned part of you might it be defending?
• What is this reaction actually trying to protect you from feeling?

What would it look like to thank this reaction instead of being embarrassed by it?`
  },
  {
    day: 3,
    title: "Projection Patterns",
    theme: "Mirroring",
    prompt: `The qualities that irritate you most in other people are rarely random - they're often a mirror pointed at something in you.

• Name a quality in someone else that genuinely irritates or repels you.
• Have you ever, even once, shown that same quality yourself? Look harder if your first answer is no.
• What might you be disowning in yourself by being so harsh about it in them?
• How might your relationships change if you owned this instead of policing it in others?

Pick one person who irritates you and write what their existence might be teaching you about yourself.`
  },
  {
    day: 4,
    title: "Childhood Messages",
    theme: "Origins",
    prompt: `Somewhere young, you learned which parts of you were safe to show and which parts needed to disappear.

• What were you taught, directly or by example, to hide or suppress as a child?
• Who taught you this - and what would have happened if you'd shown that part of yourself to them?
• What specific words or looks do you still remember from when you learned this lesson?
• How is that childhood rule still running your adult life without your permission?

What would it look like to finally break that old rule, even in one small, private way?`
  },
  {
    day: 5,
    title: "Fear Exploration",
    theme: "Defense",
    prompt: `Your shadow stays hidden because something in you believes exposure would be dangerous - name the danger directly.

• What specifically are you afraid would happen if this hidden part of you were seen?
• Who do you imagine would leave, judge, or reject you if they knew?
• How old were you when you first believed this fear was true?
• Is there any real evidence for this fear today, or is it running on outdated information?

Meet this fear the way you'd meet a frightened child's fear - what would you actually say to reassure it?`
  },
  {
    day: 6,
    title: "Shadow Strengths",
    theme: "Reclamation",
    prompt: `Every trait you've labeled as your "worst" quality is usually an actual strength that never learned when to stop.

• Name a trait about yourself you consider distinctly negative.
• In what situation has this exact trait ever actually served you or someone else?
• What would this quality look like expressed with more skill instead of suppressed entirely?
• Who do you know who has this same trait but wields it well - what do they do differently?

Write one sentence reclaiming this trait as a strength you're learning to aim, not eliminate.`
  },
  {
    day: 7,
    title: "Needs and Boundaries",
    theme: "Self-Care",
    prompt: `Shadow parts often form around needs that got labeled selfish or too much, and got buried instead of met.

• What needs have you been quietly denying or minimizing lately?
• What happens in your body when you imagine actually stating one of these needs out loud?
• Where in your life would honoring your shadow mean drawing a boundary you've been avoiding?
• What's the worst realistic outcome of finally advocating for yourself here?

Name one boundary you'll set this week, and the exact words you'll use.`
  },
  {
    day: 8,
    title: "Creative Expression",
    theme: "Integration",
    prompt: `Give a shadow aspect a form outside your own head - draw it, write it as fiction, move it through your body, whatever medium pulls you.

• Which shadow aspect wants expression today, specifically?
• What color, shape, sound, or movement does it want to take?
• What surprised you once you gave it a physical form instead of just a thought?
• Does it look different externalized than it felt internally?

Keep this expression completely private if it needs to be - what does it feel like to let it exist without an audience?`
  },
  {
    day: 9,
    title: "Shadow Dialogue",
    theme: "Communication",
    prompt: `Write an actual back-and-forth between your everyday self and one specific shadow aspect - let it talk back.

• What does your conscious self say first?
• What does the shadow aspect say it actually needs?
• What is it trying to protect you from, in its own words?
• What surprised you about what emerged once you let it speak instead of arguing with it?

End the dialogue with one thing your everyday self agrees to do differently going forward.`
  },
  {
    day: 10,
    title: "Shadow Integration",
    theme: "Wholeness",
    prompt: `Ten days of looking at what you usually look away from - take stock of what actually shifted.

• What's one thing you discovered about yourself that you didn't expect?
• Which shadow aspect feels different to you now than it did on day one?
• What would "greater wholeness" concretely look like in how you talk to yourself day to day?
• What's one ongoing practice that would help you keep meeting your shadow with curiosity instead of shame?

Name the specific shadow part you'll keep working with after this journey ends.`
  }
];

// Nature Connection 10-day journey
export const natureConnectionDays = [
  {
    day: 1,
    title: "Natural Awareness",
    theme: "Presence",
    prompt: `Give the natural world ten uninterrupted minutes today - no phone, no agenda, just attention.

• What did you notice that you normally walk right past without seeing?
• What changed in your body or mood over those ten minutes?
• Was there a moment your mind quieted down on its own - what triggered it?
• What did you almost not notice, but caught anyway?

Name one detail from today you want to look for again tomorrow.`
  },
  {
    day: 2,
    title: "Sensory Immersion",
    theme: "Experience",
    prompt: `Go outside and take nature in through every sense you have, not just your eyes.

• What did you see, hear, smell, feel, and maybe taste?
• Which sense gave you the most vivid or surprising experience today?
• Describe that one sensory moment in enough detail that someone else could feel it too.
• What sense do you usually ignore outdoors that you actually used today?

Name the sense you want to lead with next time you step outside.`
  },
  {
    day: 3,
    title: "Childhood Nature",
    theme: "Memory",
    prompt: `Somewhere in your early years is a specific memory of the outdoors that still lives in you.

• What's your earliest or most vivid childhood memory of being in nature?
• Who were you with, and what did that place look and smell like?
• How did that experience shape how you relate to the outdoors now, for better or worse?
• Is there an element from that memory - a tree, a smell, a season - that still moves you today?

Name one way you could recreate a piece of that memory this week.`
  },
  {
    day: 4,
    title: "Earth as Teacher",
    theme: "Wisdom",
    prompt: `Nature has been running the same processes for longer than any human wisdom tradition - it has something to teach if you actually watch.

• Choose one element - water, trees, weather, animals - and describe what you actually observed about it recently.
• What does the way it behaves suggest about resilience, timing, or letting go?
• Where in your own life could you use this exact lesson right now?
• What would it look like to actually apply this, not just admire it as a metaphor?

Name one specific situation this week where you'll try applying this lesson.`
  },
  {
    day: 5,
    title: "Local Ecosystem",
    theme: "Interdependence",
    prompt: `You share your immediate surroundings with an entire web of other living things you rarely think about.

• What species - plants, birds, insects, animals - actually share your neighborhood or yard?
• How do they depend on each other, as far as you can tell or find out?
• Where do you fit into this web, even passively - what do you take from it, and what do you give back?
• What would you lose if one part of this local ecosystem disappeared?

Name one small action that would support this web rather than just take from it.`
  },
  {
    day: 6,
    title: "Seasonal Awareness",
    theme: "Cycles",
    prompt: `Notice what season you're actually in, in your environment and in your body, not just on the calendar.

• How does this season show up around you right now - light, temperature, what's growing or dying back?
• How does your own energy or mood mirror or resist this season?
• What does this particular season seem to be asking of you - rest, growth, release?
• Are you fighting the season you're in, or moving with it?

Name one way you'll cooperate with this season instead of resisting it this week.`
  },
  {
    day: 7,
    title: "Nature Relationship",
    theme: "Connection",
    prompt: `If your relationship with nature were a relationship with a person, describe it honestly.

• Is it intimate, distant, reverent, fearful, curious, or something else entirely?
• When was the last time you actually reached toward this relationship instead of just passing through it?
• What's kept you at the distance you're currently at - time, comfort, habit?
• What would "deepening" this relationship actually look like in practical terms?

Name one specific date you'll set with nature this week, like you would with a person.`
  },
  {
    day: 8,
    title: "Urban Nature",
    theme: "Discovery",
    prompt: `Even concrete and traffic can't fully keep nature out - go find where it's pushing through today.

• Where did you spot nature persisting in an unexpected, human-built place?
• What surprised you about how it managed to survive or thrive there?
• How did noticing this shift how you see your usual environment?
• What does this resilience suggest about your own capacity to find growth in unlikely conditions?

Name one overlooked patch of urban nature you'll check in on again this week.`
  },
  {
    day: 9,
    title: "Environmental Impact",
    theme: "Stewardship",
    prompt: `Look honestly at your own footprint on the natural world, without either excusing it or drowning in guilt about it.

• What actions do you currently take that genuinely support environmental health?
• What's one habit you have that you know works against it, even a small one?
• What's stopped you from changing that habit so far - convenience, cost, forgetting?
• What would a realistic, sustainable next step look like, not a dramatic overhaul?

Name the one small change you're actually willing to start this week.`
  },
  {
    day: 10,
    title: "Nature Integration",
    theme: "Belonging",
    prompt: `Ten days of paying closer attention to the natural world - look at what's actually different in you now.

• How has your sense of connection to nature shifted since day one?
• Which practice from this journey do you want to keep, specifically?
• What did you learn about your own wellbeing by paying attention to something outside yourself?
• Where do you still feel disconnected, even now?

Name one way you'll keep this relationship alive once this journey officially ends.`
  }
];

// Transformation Journey 21-day journey (existing)
export const transformationJourneyDays = [
  {
    day: 1,
    title: "Honest Assessment",
    theme: "Self-Awareness",
    prompt: `Before you can change your relationship with [substance/behavior], you need to see it exactly as it is, not the version you tell other people.

• When did this actually begin - what was happening in your life at that time?
• How has it changed since then - more frequent, more hidden, more necessary?
• What role is it playing in your life right now, honestly, beyond what you'd admit out loud?
• What would you never want anyone to know about this pattern?

Write the one sentence you've been avoiding saying, even to yourself.`
  },
  {
    day: 2,
    title: "Understanding Your Why",
    theme: "Motivation",
    prompt: `Wanting to change is easy to say and hard to sustain unless the reason underneath it is real.

• What specifically brought you to this exact moment of wanting to transform this pattern?
• Is this motivation coming from yourself, or from someone else's disappointment or ultimatum?
• What has this pattern already cost you that you're only now willing to admit?
• What do you actually want on the other side of this - not the absence of the pattern, but what replaces it?

Write your why in one sentence strong enough to return to on a hard day.`
  },
  {
    day: 3,
    title: "Commitment Setting",
    theme: "Intention",
    prompt: `A vague wish to "do better" won't survive contact with a hard moment - a specific commitment might.

• What exactly are you committing to, in concrete and measurable terms?
• What are you willing to do differently starting today, not next week?
• What has stopped past commitments like this one from holding?
• Who, if anyone, will know about this commitment and can hold you to it?

Write the letter to yourself now, and read it again the next time you're tempted to quit on it.`
  },
  {
    day: 4,
    title: "Identifying Triggers",
    theme: "Trigger Awareness",
    prompt: `The behavior rarely comes out of nowhere - something specific sets it in motion every time.

• What situations, people, emotions, or thoughts reliably precede the urge for [substance/behavior]?
• What time of day or type of day is this most likely to happen?
• Is there a specific feeling right before the urge - boredom, loneliness, overwhelm?
• Which of these triggers shows up most often in your actual week?

Name the one trigger you're most likely to face in the next 48 hours.`
  },
  {
    day: 5,
    title: "The Emotional Landscape",
    theme: "Emotional Awareness",
    prompt: `[Substance/behavior] is doing an emotional job for you - find out exactly what job that is.

• What do you feel right before you engage in it - and right after?
• Does it provide comfort, excitement, numbness, relief, or something harder to name?
• What emotion are you actually trying to access, or avoid, through this pattern?
• If this behavior disappeared tomorrow, what feeling would you have to face directly instead?

Name the emotion underneath the pattern that you're most afraid of sitting with.`
  },
  {
    day: 6,
    title: "The Physical Experience",
    theme: "Body Awareness",
    prompt: `Your body carries the craving before your mind even names it - learn to read that signal early.

• Where in your body do you first feel the craving for [substance/behavior]?
• What does it physically feel like - tightness, restlessness, a pull?
• How does your body feel during the behavior itself, and how does that shift right after?
• What's the earliest physical warning sign you could catch before the craving takes over?

Name the physical cue you'll watch for as your earliest warning system.`
  },
  {
    day: 7,
    title: "The Pattern Cycle",
    theme: "Pattern Recognition",
    prompt: `Map the whole cycle out, start to finish, like you're studying someone else's behavior.

• What's the very first trigger that starts the cycle?
• What are the predictable stages between trigger and behavior?
• What happens in the aftermath - relief, shame, a promise to yourself?
• Where in this entire cycle do you actually have the most power to intervene?

Circle the exact moment in the cycle where a different choice would change everything downstream.`
  },
  {
    day: 8,
    title: "The Pause Practice",
    theme: "Mindful Response",
    prompt: `Between the trigger and the behavior there's a gap, even if it currently feels like there isn't one.

• What would it take to insert even ten seconds of pause into that gap?
• What physically helps you stop and breathe - a specific action, not a vague idea?
• What has made past attempts at pausing fail?
• What would you need to have ready in advance to make the pause actually possible?

Design the exact pause you'll use next time - what you'll physically do in that gap.`
  },
  {
    day: 9,
    title: "Replacement Behaviors",
    theme: "Healthy Alternatives",
    prompt: `The urge is often really a need in disguise - find something else that can actually meet it.

• Brainstorm at least five specific alternative actions you could turn to when a craving hits.
• Which of these actually address the same underlying need - not just distraction, real substitution?
• Which one is realistic enough that you'd actually do it in a hard moment?
• What would make that alternative easier to reach for than the old pattern?

Pick your top one and make it physically easier to access than [substance/behavior] is.`
  },
  {
    day: 10,
    title: "Managing Difficult Emotions",
    theme: "Emotional Resilience",
    prompt: `Without [substance/behavior] as the release valve, the discomfort underneath still needs somewhere to go.

• What emotion are you least equipped to sit with right now - boredom, anxiety, stress?
• What have you used this pattern to avoid feeling, specifically?
• What's one healthy way you could let that discomfort just exist, without fixing it immediately?
• Who or what has helped you tolerate hard feelings before, even briefly?

Name the discomfort you're most likely to face this week and how you'll meet it differently.`
  },
  {
    day: 11,
    title: "Building Your Support System",
    theme: "Connection",
    prompt: `Nobody sustains real change entirely alone - name who's actually in your corner.

• Who specifically could support you through this - not hypothetically, by name?
• What would you need to say to them to actually let them help?
• What professional resources exist that you've been hesitant to use?
• What's stopped you from reaching out so far - pride, shame, not wanting to be a burden?

Reach out to one specific person this week and tell them exactly what you need from them.`
  },
  {
    day: 12,
    title: "Preparing for Challenges",
    theme: "Resilience Planning",
    prompt: `The setback that derails you probably won't be a surprise if you're honest about what's coming.

• What's the most likely situation to challenge your commitment in the next two weeks?
• For each likely challenge, what's your specific plan - not "try harder," an actual action?
• What has caused past attempts to fall apart at moments like this?
• How will you recover quickly if you slip, instead of spiraling into all-or-nothing thinking?

Name your recovery plan for a slip before it happens, not after.`
  },
  {
    day: 13,
    title: "Designing Your Environment",
    theme: "Environmental Design",
    prompt: `Willpower is unreliable - your environment doesn't have to be.

• What in your physical space currently makes the old pattern easier than it should be?
• What specific change would make [substance/behavior] harder to access or engage in?
• What would make the healthier alternative easier to reach instead?
• What's one environmental change you could make today, not eventually?

Make that one change to your space today.`
  },
  {
    day: 14,
    title: "Daily Rituals and Routines",
    theme: "Positive Routines",
    prompt: `The hours when you're most vulnerable need a plan built in advance, not improvised in the moment.

• What time of day are you most vulnerable to the old pattern?
• What specific healthy activity could occupy that exact window?
• What would it take to actually do this consistently, not just when you feel motivated?
• What's the smallest version of this routine you could commit to daily?

Write the routine down with the exact time and action, and start it tomorrow.`
  },
  {
    day: 15,
    title: "Nurturing Physical Wellbeing",
    theme: "Physical Health",
    prompt: `Sleep, food, water, and movement all shift how much willpower you actually have available.

• Which of these four - sleep, nutrition, hydration, movement - is weakest right now?
• How does your vulnerability to the old pattern change on days when this is neglected?
• What's one realistic improvement you could make to this area this week?
• What's stopped you from prioritizing this before now?

Choose the one area you'll focus on this week, and name the first concrete step.`
  },
  {
    day: 16,
    title: "Finding Meaning and Purpose",
    theme: "Values and Meaning",
    prompt: `A life with genuine meaning in it has less room left for a pattern that was filling an empty space.

• What activities give you a real sense of purpose or flow, beyond just distraction?
• How much of your current week is actually built around these versus around obligation?
• What meaningful pursuit have you been neglecting since this pattern took hold?
• What would it look like to make more room for this, starting this week?

Name the one meaningful activity you'll schedule back into your week.`
  },
  {
    day: 17,
    title: "Celebrating Small Wins",
    theme: "Progress Recognition",
    prompt: `Somewhere in the last two and a half weeks, something actually shifted, even if it's small.

• What's one specific moment where you responded differently than you would have before this journey?
• What change have you noticed in your thoughts, feelings, or behavior, even subtly?
• Who would notice this change about you, if anyone?
• What tends to happen in your mind right after you notice progress - do you dismiss it?

Name the win, out loud if you can, without minimizing it.`
  },
  {
    day: 18,
    title: "Managing Stress and Pressure",
    theme: "Stress Resilience",
    prompt: `Stress is one of the most reliable ways old patterns come roaring back - plan for it deliberately.

• How does stress specifically increase your vulnerability to [substance/behavior]?
• What's a high-pressure period you can already see coming in the next month?
• What's your specific stress management plan for that period - not general advice, your actual plan?
• What's one thing that's genuinely calmed you in the past that you've stopped using?

Name the one stress tool you'll have ready before pressure hits, not during it.`
  },
  {
    day: 19,
    title: "Identity Transformation",
    theme: "Self-Concept",
    prompt: `Somewhere in this process, who you believe yourself to be has started to shift, even quietly.

• How has your self-image changed since day one of this journey?
• What are you becoming that feels different from who you were three weeks ago?
• What old identity or self-story about this pattern are you starting to release?
• What would the person you're becoming do in a moment of temptation?

Finish this sentence: "I am becoming someone who..."`
  },
  {
    day: 20,
    title: "Planning for the Future",
    theme: "Sustainable Change",
    prompt: `These 21 days end soon - the plan for what comes after needs to exist before day 21 does.

• What ongoing practices from this journey are you committing to keep?
• What check-ins, people, or accountability will you need beyond today?
• What's the biggest risk to your progress once the structure of this journey ends?
• What would relapse actually look like, and what's your plan if it happens?

Write your maintenance plan as specifically as you wrote your original commitment.`
  },
  {
    day: 21,
    title: "Integration and Commitment Renewal",
    theme: "Integration",
    prompt: `Twenty-one days of honest work on this pattern - look back at the whole arc of it.

• What have you learned about yourself that you didn't know on day one?
• How has your actual relationship with [substance/behavior] changed, concretely?
• What was the hardest day of this journey, and what got you through it?
• What commitment are you renewing to yourself for the path ahead, beyond today?

Write your renewed commitment as if writing to the person you were on day one.`
  }
];

// NEW 14-day Creative Expression journey
export const creativeExpressionDays = [
  {
    day: 1,
    title: "Creative Identity",
    theme: "Self-Perception",
    prompt: `Before you can create freely, you have to look honestly at the story you tell yourself about whether you're "creative" at all.

• Do you actually consider yourself a creative person, or is that a label you've quietly given up on?
• Name one creative strength you have that you rarely credit yourself for.
• What's the block that shows up most often - fear, comparison, simply not starting?
• If a stranger only saw your creative output from the last year, what would they assume about you?

Write the sentence you wish you believed about your own creativity, even if you don't fully believe it yet.`
  },
  {
    day: 2,
    title: "Childhood Creativity",
    theme: "Origins",
    prompt: `Before anyone graded it or judged it, you made things purely because you wanted to.

• What creative activities did you love as a kid, before you cared if they were "good"?
• What happened to that interest - did it fade, get mocked, get replaced by something more practical?
• Is there a specific moment you can point to when creating stopped feeling free and started feeling evaluated?
• What did that childhood version of you understand about making things that you've since forgotten?

Name one thing you'll do this week purely for the childlike joy of it, with zero audience.`
  },
  {
    day: 3,
    title: "Creative Inspiration",
    theme: "Sources",
    prompt: `Inspiration rarely arrives from nowhere - it has specific sources, and you probably know exactly what they are.

• Name the people, places, works, or experiences that reliably spark your imagination.
• When did you last deliberately go looking for inspiration instead of waiting for it to strike?
• What's a source of inspiration you used to seek out that you've stopped making time for?
• Is there a kind of inspiration you're a little embarrassed to admit moves you?

Name one specific source you'll intentionally return to this week.`
  },
  {
    day: 4,
    title: "Creative Fears",
    theme: "Resistance",
    prompt: `Something is standing between you and making the thing you actually want to make - name it precisely.

• What specific fear holds you back the most: being judged, failing publicly, or simply not being good enough?
• Where did this fear come from - a specific comment, a specific person, a specific failure?
• What would you make this week if you knew, with total certainty, no one would ever judge it?
• What's the smallest version of that fearless thing you could actually attempt?

Make that smallest version today, even badly, even for five minutes.`
  },
  {
    day: 5,
    title: "The Inner Critic",
    theme: "Self-Judgment",
    prompt: `There's a specific voice that shows up the moment you start to create - get to know it instead of just obeying it.

• What exactly does your inner critic say when you sit down to create? Word for word.
• Whose voice does it borrow - a teacher, a parent, a rival, your own harshest moment?
• What is it actually afraid will happen if it stops criticizing you?
• Has it ever once been right in a way that actually helped you, or does it just repeat itself?

Write one sentence back to this critic, the way you'd respond to a well-meaning but overbearing friend.`
  },
  {
    day: 6,
    title: "Creative Space",
    theme: "Environment",
    prompt: `The conditions around you shape whether creativity feels possible or impossible - get specific about what you actually need.

• Describe your ideal creative environment in physical detail - light, sound, mess, order.
• How different is this from the space you actually create in most days?
• What's one small, doable change that would close that gap this week?
• Is there a time of day when your creative energy is naturally highest that you're currently wasting on something else?

Name the one change to your space or schedule you'll actually make, starting tomorrow.`
  },
  {
    day: 7,
    title: "Creative Routine",
    theme: "Practice",
    prompt: `A creative life needs a container, not just inspiration - design one that could actually survive contact with your real schedule.

• What would a sustainable creative practice realistically look like, given your actual responsibilities?
• What's the smallest recurring block of time you could reliably protect for this?
• What has sabotaged your past attempts at a creative routine - be specific?
• What would need to be true for this version to actually stick?

Write the routine down as a specific, repeatable plan - day, time, duration.`
  },
  {
    day: 8,
    title: "Beginner's Mind",
    theme: "Exploration",
    prompt: `Pick a creative medium you've genuinely never tried, and let yourself be bad at it on purpose.

• What medium have you always been curious about but never attempted?
• What draws you to it, specifically?
• What expectations or assumptions are you bringing into it that you should probably drop?
• What would it feel like to do this with zero competence and zero shame about that?

Try it today for ten minutes, and write down what surprised you about being a total beginner again.`
  },
  {
    day: 9,
    title: "Creative Blocks",
    theme: "Obstacles",
    prompt: `Every creative person hits walls - the useful question is what actually gets you through them.

• Recall a specific time you felt creatively blocked. What triggered it?
• What did you try that didn't help, even though it seemed like it should?
• What actually worked to move you through it, even a little?
• What's a new strategy you haven't tried yet that you're curious about?

Name the strategy you'll reach for next time you feel a block coming on.`
  },
  {
    day: 10,
    title: "Creative Collaboration",
    theme: "Connection",
    prompt: `Creating alongside someone else changes the work and changes you - look honestly at how.

• Think of a past creative collaboration. What made it energizing or draining?
• What do you gain from creating with others that you can't get working alone?
• What do you protect by staying solo that collaboration would threaten?
• Who is someone you'd genuinely like to create something with, given the chance?

Reach out to that person this week, even just to float the idea.`
  },
  {
    day: 11,
    title: "Creative Risk-Taking",
    theme: "Courage",
    prompt: `Every piece of creative work you're proud of probably required a risk you almost didn't take.

• What creative risk have you been wanting to take but keep postponing?
• What specifically holds you back - the outcome, or what it says about you if it fails?
• What's a smaller version of that risk you could take this week instead of the whole leap?
• What might you learn even if it doesn't go well?

Take that smaller risk this week and note exactly what happens, good or bad.`
  },
  {
    day: 12,
    title: "Sharing Your Work",
    theme: "Vulnerability",
    prompt: `Making something is one kind of vulnerable - letting someone else see it is another.

• How do you actually feel, physically, when you imagine sharing your creative work?
• What would make sharing feel safer - a specific audience, a specific format, lower stakes?
• Who is one person whose reaction to your work you'd genuinely value, not just fear?
• What might your work give someone else if you let them see it?

Share one piece of your work with one person this week, even if it's unfinished.`
  },
  {
    day: 13,
    title: "Creative Legacy",
    theme: "Purpose",
    prompt: `Zoom out from the day-to-day and ask what all of this creating is actually for.

• What do you hope your creative expression contributes to the world, even in a small way?
• What themes or experiences do you keep returning to across your work, whether you plan it or not?
• If your creative work outlived you, what would you want it to say about how you saw things?
• Is your current creative practice actually pointed toward this, or has it drifted?

Name one adjustment that would align your practice more closely with this purpose.`
  },
  {
    day: 14,
    title: "Creative Integration",
    theme: "Commitment",
    prompt: `Fourteen days of examining your creative life - look at what's actually changed.

• What have you discovered about your own creativity that surprised you?
• Which specific practice from this journey do you want to keep?
• What fear or block feels smaller now than it did on day one?
• What's the one commitment you're willing to make to your creative life going forward?

Write that commitment down as a specific, concrete promise to yourself - not a vague intention.`
  }
];

export const habitFormationDays = [
  {
    day: 1,
    title: "Habit Vision",
    theme: "Intention",
    prompt: `Thirty days from now, one new behavior could be running quietly in the background of your life - name it precisely.

• What habit do you want to build over these 30 days, in exact, specific terms?
• Why this one, and why now - what changed that makes this matter today?
• How would your life actually be different a year from now if this habit stuck?
• What have you tried before with this exact habit, and what happened?

Write the one sentence that will remind you why this is worth the discomfort of building it.`
  },
  {
    day: 2,
    title: "Current State",
    theme: "Awareness",
    prompt: `Before you build something new, look clearly at what you're actually doing right now instead.

• Describe your current behavior around this area of your life, without softening it.
• What typically triggers what you do now - time of day, mood, situation?
• What's the real barrier that's kept the habit you want from happening already?
• Is the barrier practical, or is it something more like fear or identity?

Name the single biggest obstacle you'll need to solve for in the next 29 days.`
  },
  {
    day: 3,
    title: "Science of Habits",
    theme: "Understanding",
    prompt: `Every habit runs on the same basic loop: cue, craving, response, reward - map yours onto it.

• What cue could reliably trigger your new habit - time, location, an existing action?
• What craving or desire will actually pull you toward doing it?
• What's the simplest version of the response itself?
• What reward, immediate and real, will reinforce it enough to repeat tomorrow?

Write your specific cue-craving-response-reward loop as one clear sentence.`
  },
  {
    day: 4,
    title: "Micro-Habit Design",
    theme: "Small Steps",
    prompt: `Ambition is usually what kills a new habit in week one - shrink it until it's almost embarrassingly easy.

• What's the smallest possible version of this habit - not the ideal version, the floor?
• Could you do this version even on your worst, most exhausted day?
• What's making you resist starting this small - pride, impatience?
• What would "so easy you can't say no" actually look like here?

Commit to the tiniest version for tomorrow, not the ambitious one.`
  },
  {
    day: 5,
    title: "Environmental Design",
    theme: "Context",
    prompt: `Willpower fades by evening - your environment doesn't, so let it do the work instead.

• What in your physical space currently makes this habit harder than it needs to be?
• What one change would make the habit almost automatic to start?
• What would you need to remove or hide to make the old, competing behavior less convenient?
• What's stopped you from making this environmental change already?

Make that one physical change to your space today, not this weekend.`
  },
  {
    day: 6,
    title: "Habit Stacking",
    theme: "Integration",
    prompt: `A new habit is far more likely to stick if it rides on the back of one you already do without thinking.

• What existing daily habit happens reliably, no matter what kind of day you're having?
• Complete this exactly: "After I ___, I will ___."
• Why does this particular pairing make sense - proximity, timing, energy level?
• What could disrupt this stack, and how would you adapt?

Write your stack as one sentence you'll say to yourself tomorrow morning.`
  },
  {
    day: 7,
    title: "Implementation Intentions",
    theme: "Planning",
    prompt: `A habit with no fixed time or place is a habit that quietly never happens.

• Fill in exactly: "I will [habit] at [time] in [location]."
• Why this specific time and place, over any other option?
• What's likely to conflict with this exact plan during a normal week?
• What backup time or place will you use if the primary one falls through?

Write both your primary plan and your backup plan, in full detail.`
  },
  {
    day: 8,
    title: "Identifying Obstacles",
    theme: "Preparation",
    prompt: `The habit rarely fails because of laziness - it fails because a predictable obstacle wasn't planned for.

• What are the two or three most likely things to derail this habit in the coming weeks?
• For each one, complete: "If [obstacle], then I will [specific solution]."
• Which obstacle has actually already stopped you before, in a past attempt?
• What would it take to obstacle-proof this habit against that one specifically?

Write your strongest if-then plan for the obstacle most likely to hit you this week.`
  },
  {
    day: 9,
    title: "Habit Tracking System",
    theme: "Measurement",
    prompt: `What doesn't get tracked tends to quietly slip - build a system simple enough to actually maintain.

• What's the simplest possible way you could track this habit - a checkmark, a note, an app?
• What exactly will you measure - frequency, duration, quality?
• How often will you check in with your tracker - daily, weekly?
• What's stopped tracking systems from working for you in the past?

Set up your tracking system right now, before you close this entry.`
  },
  {
    day: 10,
    title: "First Week Reflection",
    theme: "Evaluation",
    prompt: `One week in - look at the real data instead of the story you're telling yourself about how it went.

• What's actually working better than you expected?
• What's harder than you expected, specifically?
• Where did the plan break down, and why?
• What single adjustment would make the next week more consistent?

Make that one adjustment starting tomorrow, not after more reflection.`
  },
  {
    day: 11,
    title: "Reward System",
    theme: "Positive Reinforcement",
    prompt: `A habit that never feels good in the moment rarely survives past the initial motivation - build in something that does.

• What small, immediate reward could you pair with completing this habit?
• What meaningful reward would actually motivate a full week of consistency?
• Are you currently relying only on future benefits, with nothing rewarding right now?
• What's a reward that won't quietly undermine the habit itself?

Choose one immediate reward and use it the very next time you do the habit.`
  },
  {
    day: 12,
    title: "Social Accountability",
    theme: "Support",
    prompt: `A habit kept entirely private is a habit only you will notice if it slips.

• Who in your life could realistically support this habit - by name?
• What specifically would you want from them - a check-in, a shared goal, just knowing?
• What's stopped you from telling anyone about this commitment so far?
• What would change if this stopped being a secret project?

Tell one specific person about this habit today, and what you want from them.`
  },
  {
    day: 13,
    title: "Identity Shift",
    theme: "Self-Concept",
    prompt: `Habits stick best when they're backed by a new identity, not just a new behavior.

• Complete this sentence: "I am becoming the kind of person who..."
• How does that identity feel different from how you've described yourself before?
• What would that person do in a moment you're currently struggling with?
• What evidence from the last 12 days supports this new identity, even a little?

Say the identity sentence out loud once, and notice if it feels true yet or aspirational.`
  },
  {
    day: 14,
    title: "Habit Recovery Plan",
    theme: "Resilience",
    prompt: `You will miss a day at some point - the habit's survival depends on what happens next, not on perfection.

• What's your honest track record so far - have you missed any days?
• What thought runs through your head right after a missed day?
• What's your specific recovery plan - the exact next action, not a vague intention?
• How will you avoid turning one missed day into a week off?

Write the rule: "I never miss twice." What does that look like in practice for you?`
  },
  {
    day: 15,
    title: "Mid-Point Assessment",
    theme: "Progress",
    prompt: `Halfway through - take real stock instead of just pushing forward on autopilot.

• What concrete progress have you made, in numbers or specifics?
• What evidence do you see that this is actually becoming a habit, not just a streak?
• What still requires real conscious effort every single time?
• What adjustment would make the second half easier than the first?

Name the one change you'll make for days 16 through 30.`
  },
  {
    day: 16,
    title: "Deepening Understanding",
    theme: "Motivation",
    prompt: `Halfway is where motivation naturally dips - reconnect with the reason underneath the routine.

• What was your original "why" for this habit, in your own words from day one?
• Does that reason still feel true, or has your motivation shifted since then?
• How does this habit actually connect to a core value or long-term goal you care about?
• What would you tell someone who asked why you're still bothering with this?

Write an updated "why" that reflects what you actually know now, 15 days in.`
  },
  {
    day: 17,
    title: "Challenging Situations",
    theme: "Adaptation",
    prompt: `Real life doesn't pause for your habit - travel, stress, and social plans will test it directly.

• What upcoming situation is most likely to disrupt your routine - travel, a stressful week, an event?
• What would a scaled-down version of the habit look like in that situation?
• What's tempted you to just skip it entirely during disruptions in the past?
• What's the minimum you're willing to protect, no matter what else is happening?

Name your non-negotiable minimum version for the hardest upcoming week.`
  },
  {
    day: 18,
    title: "Unexpected Benefits",
    theme: "Awareness",
    prompt: `Habits tend to ripple into places you didn't expect - notice what's actually shifted.

• What unexpected benefit have you noticed since starting this habit?
• How is this habit affecting other areas of your life - mood, energy, other habits?
• Has anyone else noticed a change in you, even in passing?
• What surprised you most about the actual experience of doing this, versus what you imagined?

Name the ripple effect you're most grateful for so far.`
  },
  {
    day: 19,
    title: "Habit Expansion",
    theme: "Growth",
    prompt: `If the habit is starting to feel easy, that's a signal, not a finish line.

• Is the habit noticeably easier now than it was on day one? How can you tell?
• What would a slightly expanded or enhanced version of it look like?
• Is now actually the right time to expand, or are you rushing past a habit that's still fragile?
• What's the risk of expanding too soon?

Decide honestly whether to expand this week or hold steady, and name why.`
  },
  {
    day: 20,
    title: "Intrinsic Motivation",
    theme: "Enjoyment",
    prompt: `External rewards get you started, but enjoying the thing itself is what keeps you going for years.

• What part of doing this habit, if any, genuinely feels good in the moment?
• What could you change about how you do it to make it more enjoyable?
• Are you still relying entirely on external rewards, or has anything intrinsic started to show up?
• What would make you want to do this even if no one was tracking or praising it?

Name one small change that would make tomorrow's habit more enjoyable, not just more dutiful.`
  },
  {
    day: 21,
    title: "Three-Week Milestone",
    theme: "Celebration",
    prompt: `Three weeks of showing up is real - stop and actually let yourself feel that instead of rushing past it.

• What have you learned about yourself through these 21 days that you didn't expect?
• What are you genuinely proud of, specifically - not generally?
• What would you tell someone who was on day one of a habit like this?
• How does the person who started this compare to who you are today?

Do something today, small or large, to actually mark this milestone.`
  },
  {
    day: 22,
    title: "Process vs. Outcome",
    theme: "Focus",
    prompt: `Somewhere in the last three weeks, your attention has probably drifted toward results instead of the doing itself.

• Are you currently more focused on doing the habit, or on the results it's supposed to produce?
• Which focus is actually serving you better right now, honestly?
• What happens to your motivation on days when the results aren't visible yet?
• What would shift if you measured success purely by whether you showed up, not by outcome?

Name one way you'll shift more attention back onto the process this week.`
  },
  {
    day: 23,
    title: "Deeper Habit Integration",
    theme: "Normalization",
    prompt: `Somewhere in this process, the habit has started needing less willpower than it used to - notice exactly where.

• When do you now do this habit almost without thinking, compared to three weeks ago?
• When does it still require real conscious effort or a pep talk?
• What's different about your internal experience of doing it now versus day one?
• What would it take to close the gap on the parts that still feel effortful?

Name the one part of the habit that still needs the most conscious effort, and why.`
  },
  {
    day: 24,
    title: "Handling Plateaus",
    theme: "Persistence",
    prompt: `Progress rarely moves in a straight line - a flat stretch doesn't mean it's not working.

• Does progress feel like it's plateaued right now? Be honest about what that actually looks like.
• What's kept you going on the days when motivation was flat?
• What would help you persist through a flat spot instead of quitting out of frustration?
• Is there a small variation that would make a plateaued habit feel fresh again?

Name one thing you'll do this week purely to push through a flat stretch, not to feel excited again.`
  },
  {
    day: 25,
    title: "Compound Effect",
    theme: "Long-Term Vision",
    prompt: `A tiny daily action looks insignificant on any single day and undeniable over a year.

• If you kept this habit going for a full year, what compound effect might you actually see?
• What's the smallest daily action that, repeated, would surprise you most in twelve months?
• What have you already seen in 25 days that hints at this larger effect?
• What would it take to trust the process on days when the progress feels invisible?

Write the one-year version of this habit's payoff in a single vivid sentence.`
  },
  {
    day: 26,
    title: "Mindfulness in Habit",
    theme: "Presence",
    prompt: `It's possible to do this habit correctly every day and still be completely absent while doing it.

• How present are you, honestly, while actually performing this habit day to day?
• What would change if you did it with complete attention instead of on autopilot?
• What do you usually think about while doing it - is your mind somewhere else entirely?
• What's one sensory detail of the habit you've stopped noticing?

Do the habit today with total presence, and write down what was different.`
  },
  {
    day: 27,
    title: "Sharing Your Experience",
    theme: "Wisdom",
    prompt: `Twenty-seven days in, you know something about this process that you didn't know a month ago.

• What have you learned about habit formation that surprised you?
• What advice would you give someone on day one of trying to build this exact habit?
• What would you warn them not to do, based on your own mistakes?
• Who in your life might actually benefit from hearing this?

Share this insight with one specific person this week.`
  },
  {
    day: 28,
    title: "Preparing for Month Two",
    theme: "Continuity",
    prompt: `In two days, the structured 30-day container disappears - the habit needs to survive without it.

• What's made this habit possible specifically because of this 30-day structure?
• What system will replace that structure once the formal journey ends?
• What's most likely to cause this habit to quietly fade in month two without support?
• What ongoing check-in or practice will you put in its place?

Name the exact system you'll use starting day 31.`
  },
  {
    day: 29,
    title: "Habit Ecosystem",
    theme: "Integration",
    prompt: `No habit lives in isolation - it either supports or competes with everything else in your routine.

• How does this habit currently fit alongside your other daily routines?
• What other habit might naturally grow out of this one, now that it's established?
• Is there a habit this one is quietly competing with for time or energy?
• What would a well-balanced ecosystem of habits look like around this one?

Name the next habit you might build on top of this foundation, once it's solid.`
  },
  {
    day: 30,
    title: "The Path Forward",
    theme: "Continuation",
    prompt: `Thirty days ago you set an intention - look at the whole arc of what actually happened.

• What has genuinely changed since day one, in you and in this behavior?
• What challenges still remain, honestly, even after a full month?
• What will you do differently starting tomorrow to keep this alive long-term?
• What are you most proud of from this entire month?

Write the one commitment that will carry this habit past day 30 and into the rest of your life.`
  }
];

// Complete 100-day Life Vision journey
export const lifeVisionDays = [
  // FOUNDATION (Days 1-10): Self-awareness, values, and identity
  {
    day: 1,
    title: "Life Mapping",
    theme: "Overview",
    prompt: `A life looked at all at once, instead of day by day, tells a different story than the one you're used to telling.

• Plot the major turning points, in order - not just events, but the moments that split your path into before and after.
• What theme keeps reappearing across different decades or chapters?
• Which turning point still surprises you when you look back at it?

Name the one pattern you want this 100-day journey to help you finally understand.`
  },
  {
    day: 2,
    title: "Core Identity",
    theme: "Self-Concept",
    prompt: `Strip away your job title, your relationships, your responsibilities, and see what's actually left.

• Who are you underneath the roles you play for other people?
• What has remained recognizably you through every major change in your life?
• What would you still be if everything external were taken away?

Write one sentence that describes you at your core, without listing what you do.`
  },
  {
    day: 3,
    title: "Values Exploration",
    theme: "Principles",
    prompt: `Values that just sound good on a poster aren't the ones actually running your choices.

• Name 5-7 values that are genuinely yours, tested against how you actually live, not just what you'd claim.
• For each, when has honoring it cost you something real?
• Which value do you say matters most but rarely act on?

Pick the value you're currently living furthest from, and name why.`
  },
  {
    day: 4,
    title: "Strengths Inventory",
    theme: "Capabilities",
    prompt: `Your natural strengths are often so easy for you that you've stopped noticing they're strengths at all.

• Name the talents and developed skills that come most naturally to you.
• When do you feel most capable and in flow - what are you actually doing in those moments?
• Which strength have you been underusing because it doesn't feel impressive enough to count?

Name one strength you'll deliberately use more this week.`
  },
  {
    day: 5,
    title: "Meaningful Achievements",
    theme: "Accomplishment",
    prompt: `Not every achievement you're proud of would impress a stranger - and that's exactly the point.

• Name the achievements you're genuinely most proud of, regardless of how they'd look on a resume.
• What made each one meaningful, beyond the outcome itself?
• What do these achievements reveal about what actually matters to you?

Name the kind of achievement you want more of in the next chapter of your life.`
  },
  {
    day: 6,
    title: "Life Roles",
    theme: "Identity",
    prompt: `You're playing several different roles right now, and not all of them fit the same way.

• List the roles you currently hold - parent, professional, friend, and beyond.
• Which one feels most authentically you?
• Which one feels the most like a costume you're tired of wearing?

Name one adjustment you could make to a role that currently feels constraining.`
  },
  {
    day: 7,
    title: "Personal Beliefs",
    theme: "Worldview",
    prompt: `Some of your core beliefs you chose deliberately - others you simply absorbed without ever agreeing to them.

• Name a core belief that shapes how you see the world.
• Did you consciously choose it, or did you inherit it from somewhere else?
• Which belief serves you well, and which one deserves real scrutiny?

Name the one inherited belief you're most ready to examine.`
  },
  {
    day: 8,
    title: "Character Strengths",
    theme: "Virtues",
    prompt: `Certain virtues show up in you reliably - courage, kindness, curiosity - even when no one's watching.

• Which character strengths do you consistently embody, even under pressure?
• Which one would you like to develop further?
• How might strengthening this one virtue shape the vision you're building?

Name one situation this week where you'll deliberately practice this virtue.`
  },
  {
    day: 9,
    title: "Multiple Intelligences",
    theme: "Abilities",
    prompt: `Intelligence isn't just the kind that shows up on a test - yours might live somewhere else entirely.

• Beyond traditional intelligence, where are you strong - emotional, social, creative, physical, spatial?
• Which of these intelligences have you underestimated in yourself?
• How might this particular strength shape a path that traditional metrics wouldn't predict?

Name the intelligence you most want to trust and develop going forward.`
  },
  {
    day: 10,
    title: "Foundation Integration",
    theme: "Self-Knowledge",
    prompt: `Nine days of examining who you are - now write the truth that ties it together.

• What common thread runs through your identity, values, strengths, and beliefs from this week?
• What's one truth about yourself you're seeing more clearly now than on day one?
• What essential fact about you should inform everything else in this 100-day journey?

Write your comprehensive self-description in one paragraph, as if introducing yourself to someone who needs to actually understand you.`
  },

  // PAST REFLECTION (Days 11-20): Learning from life experiences
  {
    day: 11,
    title: "Childhood Influences",
    theme: "Origins",
    prompt: `Long before you had any say in the matter, your childhood was already writing rules you still follow.

• What lesson, belief, or pattern from your early years still runs quietly in the background of your choices?
• Who taught it to you, and in what specific moment?
• Which of these early imprints deserves to be updated with what you know now?

Name the one childhood pattern you're ready to consciously rewrite.`
  },
  {
    day: 12,
    title: "Formative Experiences",
    theme: "Key Moments",
    prompt: `A handful of moments did more to shape your path than years of ordinary days combined.

• Name 3-5 experiences that most changed your direction or sense of what's possible.
• For each, what exactly shifted - your confidence, your fear, your ambition?
• Which one do you think about the least, despite its impact?

Name the formative experience you'd most like to finally make peace with.`
  },
  {
    day: 13,
    title: "Teachers & Mentors",
    theme: "Guidance",
    prompt: `Someone's voice is still in your head, still shaping decisions, even if they're long gone from your life.

• Who has meaningfully guided or influenced your path?
• What specific piece of wisdom from them do you still lean on?
• Is there a mentor's voice you've been ignoring that deserves more weight?

Name one person you'd like to thank, even years later.`
  },
  {
    day: 14,
    title: "Past Dreams",
    theme: "Aspirations",
    prompt: `Somewhere behind you is a version of you with dreams you haven't looked at in years.

• What did you dream of becoming or doing when you were younger?
• Which dreams did you pursue, which did you abandon, and which did you just quietly postpone?
• What do these old dreams reveal about desires that are still authentically yours?

Name the abandoned dream most worth revisiting, even in a new form.`
  },
  {
    day: 15,
    title: "Life Challenges",
    theme: "Resilience",
    prompt: `You've already survived things that once felt unsurvivable - that's worth taking seriously.

• Name a significant challenge you've faced and how you actually got through it.
• What strength or capacity emerged from that difficulty that you still have?
• What did that hardship teach you about what you're capable of?

Name the strength from that challenge you'll lean on again soon.`
  },
  {
    day: 16,
    title: "Regrets & Lessons",
    theme: "Learning",
    prompt: `Regret is only wasted if you refuse to extract the lesson hiding inside it.

• Name a decision or action you genuinely regret.
• What have you actually learned from it, once the shame settles?
• How might this lesson change a choice you're facing right now?

Write the lesson as advice you'd give someone about to make the same mistake.`
  },
  {
    day: 17,
    title: "Relationship Patterns",
    theme: "Connection History",
    prompt: `The same dynamic keeps showing up across different relationships in your life, whether you meant it to or not.

• What pattern have you noticed repeating across your relationships over time?
• Where did this pattern likely originate?
• How has it shaped the way you connect with people today, for better or worse?

Name one way you'd like this pattern to shift going forward.`
  },
  {
    day: 18,
    title: "Career Journey",
    theme: "Work History",
    prompt: `Your work history is a map of what you've sought, tolerated, and quietly avoided.

• Trace your work path - what pattern shows up in what you've pursued or avoided?
• When did work actually feel meaningful, and what made it so?
• What has this journey taught you about what you actually need from work?

Name the one insight from your career history that should inform what's next.`
  },
  {
    day: 19,
    title: "Personal Evolution",
    theme: "Growth",
    prompt: `You are demonstrably not the same person you were ten years ago - track exactly what changed.

• What beliefs, values, or priorities have genuinely shifted over time?
• What has remained recognizably constant through all of it?
• What's the biggest way you've grown that you rarely give yourself credit for?

Name the growth you're proudest of, even if no one else witnessed it.`
  },
  {
    day: 20,
    title: "Past Integration",
    theme: "Life Lessons",
    prompt: `Twenty days of looking backward - now distill it into something you can actually carry forward.

• What are the 5-7 most significant lessons your past has taught you?
• Which lesson took the longest for you to actually learn?
• How will these lessons concretely shape the vision you're building in the next 80 days?

Write the one lesson you never want to have to learn twice.`
  },

  // PRESENT ASSESSMENT (Days 21-30): Current life evaluation
  {
    day: 21,
    title: "Current Reality Check",
    theme: "Present State",
    prompt: `Skip the highlight reel version of your life and look at what's actually true today.

• What's genuinely working well in your life right now?
• What's not working, even if you've gotten used to tolerating it?
• Where do you feel most out of alignment with who you actually are?

Name the one area of misalignment you're most ready to address.`
  },
  {
    day: 22,
    title: "Life Satisfaction",
    theme: "Fulfillment Areas",
    prompt: `Numbers don't lie the way our self-image sometimes does - rate yourself honestly.

• Rate your satisfaction (1-10) across career, relationships, health, finances, growth, fun, environment.
• Which area scored lowest, and does that surprise you?
• What pattern connects your lowest-scoring areas?

Name the one area you'll focus on improving first.`
  },
  {
    day: 23,
    title: "Energy Inventory",
    theme: "Vitality",
    prompt: `Some things fill you up and some things quietly drain you - most people never actually map this out.

• What activities, people, or environments genuinely energize you?
• What consistently depletes you, even if you've normalized it?
• What would change if you deliberately designed more of your week around what fills you?

Name one draining commitment you'll reduce or remove this month.`
  },
  {
    day: 24,
    title: "Time Audit",
    theme: "Priorities",
    prompt: `How you spend your hours is the truest record of your priorities, whether you like the answer or not.

• Track roughly how you spent your time this past week.
• Does this match what you say actually matters to you?
• Where's the biggest gap between your stated values and your actual calendar?

Name one specific change you'll make to close that gap this week.`
  },
  {
    day: 25,
    title: "Relationship Assessment",
    theme: "Current Connections",
    prompt: `Not every relationship in your life is pulling its weight - look honestly at who does what.

• Which key relationships genuinely support your growth and authentic expression?
• Which ones feel consistently challenging or draining?
• What needs to shift, and are you willing to be the one to shift it?

Name the one relationship conversation you've been avoiding.`
  },
  {
    day: 26,
    title: "Work & Contribution",
    theme: "Meaningful Activity",
    prompt: `Look at what actually fills your working hours and ask if it deserves that much of your life.

• How meaningful does your current work or main activity actually feel, day to day?
• How well does it use your real strengths?
• Where's the biggest mismatch between what you do and what you value?

Name one small shift that would make your work feel more aligned.`
  },
  {
    day: 27,
    title: "Financial Landscape",
    theme: "Resource Reality",
    prompt: `Money reveals priorities and fears in equal measure - look at yours without flinching.

• What's genuinely working in your relationship with money right now?
• What needs honest attention that you've been avoiding?
• How is your current financial reality shaping choices you don't even realize it's shaping?

Name the one financial truth you're ready to finally face.`
  },
  {
    day: 28,
    title: "Physical Wellbeing",
    theme: "Body Assessment",
    prompt: `Your body has been keeping score of how you've treated it, whether or not you've been paying attention.

• What's genuinely supporting your physical wellbeing right now?
• What habit or pattern do you know needs to change?
• What's stopped you from addressing it so far?

Name the one physical habit you'll adjust this week.`
  },
  {
    day: 29,
    title: "Emotional Landscape",
    theme: "Feeling States",
    prompt: `Certain emotions have been running the show lately - name them honestly instead of pushing past them.

• What emotions dominate your daily experience most often?
• Which do you welcome, and which do you actively avoid?
• What might this emotional pattern be trying to tell you about your current life?

Name the emotion you're most ready to actually listen to.`
  },
  {
    day: 30,
    title: "Present Integration",
    theme: "Current Snapshot",
    prompt: `Thirty days of honest assessment - now put the whole picture together in one place.

• What does your comprehensive life snapshot actually reveal, fulfilling and challenging parts both?
• What need is most clearly asking for attention?
• What want have you been quietly ignoring?

Write the one sentence that captures where you truly stand today.`
  },

  // DREAM EXPLORATION (Days 31-40): Imagining possibilities
  {
    day: 31,
    title: "Permission to Dream",
    theme: "Liberation",
    prompt: `Constraints of money, time, and other people's expectations have been editing your dreams before you even finish having them - drop them for one entry.

• If nothing were limiting you, what would you do, be, or create?
• What's the first thing your mind reached for, before you started editing it down to "realistic"?
• What does that first instinct tell you about a desire you've been suppressing?

Write the dream exactly as it came, without qualifying it.`
  },
  {
    day: 32,
    title: "Alternate Lives",
    theme: "Possibilities",
    prompt: `You're living one version of your life - imagine a few others in vivid, specific detail.

• Describe 3-5 completely different lives you could plausibly lead.
• What details in each one feel most exciting to imagine?
• What common thread connects the lives that excite you most?

Name the one element from these alternate lives you could actually bring into this one.`
  },
  {
    day: 33,
    title: "Childhood Dreams Revisited",
    theme: "Original Desires",
    prompt: `Before the world told you what was realistic, you already knew something true about what you wanted.

• Return to your childhood dreams - which still genuinely resonate?
• What did that younger version of you understand that you've since talked yourself out of?
• Is there authentic desire buried in an old dream that looked impractical?

Name the childhood dream you'll take seriously again, even in a new form.`
  },
  {
    day: 34,
    title: "Idealized Day",
    theme: "Daily Rhythm",
    prompt: `Describe an ordinary day so good you'd happily repeat it for years.

• Walk through this ideal day from morning to night, in specific detail.
• What people, places, and activities are present?
• How far is this from your actual average day right now?

Name the one element of this ideal day you could add to tomorrow.`
  },
  {
    day: 35,
    title: "Adventure & Growth",
    theme: "Expansion",
    prompt: `Comfort has its place, but something in you is also asking to be stretched.

• What adventures, challenges, or growth experiences do you genuinely yearn for?
• What's stopped you from pursuing them so far?
• What would meaningfully stretching yourself actually look like this year?

Name the smallest version of this adventure you could commit to soon.`
  },
  {
    day: 36,
    title: "Dream Environment",
    theme: "Physical Context",
    prompt: `The place you live shapes you more than you probably credit it for - imagine the right one.

• Describe your ideal living environment and location in detail.
• What elements of it would genuinely nourish you, not just look good?
• How far is this from where you currently live?

Name one element of this dream environment you could bring into your current space.`
  },
  {
    day: 37,
    title: "Relationship Vision",
    theme: "Connection Dreams",
    prompt: `Picture the full landscape of connection you actually want - not just one relationship, the whole web.

• Envision your ideal relationships across romantic, family, friendship, and community.
• What qualities would define these connections?
• Which of these is furthest from your current reality?

Name one step toward the relationship landscape you're picturing.`
  },
  {
    day: 38,
    title: "Creative Expression",
    theme: "Artistic Vision",
    prompt: `If failure weren't a possibility, something specific would want to be made through you.

• What creative expression calls to you, even if you've dismissed it as impractical?
• What would you create if you knew you couldn't fail?
• How might this actually fit into your larger life vision, not just as a hobby?

Name the first small step toward making this real.`
  },
  {
    day: 39,
    title: "Impact Imagination",
    theme: "Contribution Vision",
    prompt: `Somewhere is a specific positive impact only you, with your specific gifts, are positioned to make.

• If you could create any impact in the world, what would it be?
• What need does it address that you personally care about?
• How do your unique gifts actually match this need?

Name the smallest version of this impact you could start today.`
  },
  {
    day: 40,
    title: "Dreams Integration",
    theme: "Possibility Patterns",
    prompt: `Ten days of dreaming without constraint - now look for the thread running through it all.

• What pattern shows up across everything you've imagined this week?
• Which elements feel most alive and authentic, versus just aspirational?
• What's the version of this dream that's actually achievable, not just wished for?

Name the one dream element you're committing to pursue for real.`
  },

  // PURPOSE & MEANING (Days 41-50): Finding core purpose
  {
    day: 41,
    title: "Sources of Meaning",
    theme: "Significance",
    prompt: `Meaning shows up in specific moments, not as a constant hum - find the moments that actually had it.

• When has your life felt deeply meaningful? What was actually happening?
• What conditions were present that let that meaning show up?
• What activities make you lose track of time entirely?

Name the meaning-source you'll deliberately seek out more this month.`
  },
  {
    day: 42,
    title: "Life as Legacy",
    theme: "Contribution",
    prompt: `What you leave behind isn't just what you build - it's how you made people feel along the way.

• What mark do you actually want to leave on the world?
• How do you want your life to have mattered, in concrete terms?
• What contribution feels uniquely yours, not borrowed from someone else's definition of success?

Name the first step toward that contribution you could take this year.`
  },
  {
    day: 43,
    title: "Core Motivations",
    theme: "Driving Forces",
    prompt: `Beneath every choice you make is a motivation you may never have named out loud.

• What fundamentally motivates you, beyond external rewards like money or approval?
• What drives your choices at the deepest level, even the ones that don't make obvious sense?
• How much of your current life is actually shaped by this true motivation versus by obligation?

Name the motivation you'll trust more, starting now.`
  },
  {
    day: 44,
    title: "Intersections",
    theme: "Sweet Spots",
    prompt: `Somewhere your talent, your passion, your values, and what the world needs actually overlap.

• Where do your talents, passions, and values intersect with real needs in the world?
• What activity combines what you're good at, what you love, and what matters?
• What's stopped you from spending more time in this intersection?

Name one way to spend more time in this sweet spot this month.`
  },
  {
    day: 45,
    title: "Purpose Statements",
    theme: "Mission",
    prompt: `A purpose you can't put into words is hard to actually live by - try to name yours.

• Draft 3-5 possible purpose statements, starting with "My purpose is to..."
• Which one resonates most deeply when you say it out loud?
• What would change in your daily choices if you actually lived by this statement?

Write the purpose statement you'll return to when you lose direction.`
  },
  {
    day: 46,
    title: "Meaning Through Adversity",
    theme: "Transformation",
    prompt: `Some of your deepest meaning may have come from your hardest chapters, not your easiest ones.

• How have you found meaning in a genuinely difficult experience?
• What purpose might your hardest challenges serve in your larger life story?
• What would it look like to see adversity as material rather than just obstacle?

Name the difficult chapter that taught you the most about your purpose.`
  },
  {
    day: 47,
    title: "Transcendent Experiences",
    theme: "Beyond Self",
    prompt: `Occasionally you've felt connected to something bigger than your own life - notice what triggers it.

• When have you felt connected to something larger than yourself?
• What practices, places, or activities reliably create this sense of connection?
• How often do you actually make room for this in your regular life?

Name one practice you'll build back into your week to access this more often.`
  },
  {
    day: 48,
    title: "Mortality Reflection",
    theme: "Limited Time",
    prompt: `Time is not infinite, and pretending otherwise is quietly costing you clarity.

• With limited time in mind, what becomes undeniably important?
• How would you spend your days differently if you took this seriously?
• What would you no longer tolerate if you fully accepted life's finitude?

Name the one thing you'll stop tolerating starting this week.`
  },
  {
    day: 49,
    title: "Personal Philosophy",
    theme: "Wisdom",
    prompt: `You've already gathered real wisdom about living - it's worth writing down instead of just carrying silently.

• What wisdom have you gained about what makes a good life?
• What principle guides your hardest decisions, even if you've never said it out loud?
• Where did this wisdom actually come from - a mentor, a failure, a quiet realization?

Write your personal philosophy in three sentences you could repeat from memory.`
  },
  {
    day: 50,
    title: "Purpose Integration",
    theme: "Unified Direction",
    prompt: `Ten days examining purpose - now draw the throughline that connects it all.

• What central purpose is emerging from everything you've reflected on?
• How might this purpose express itself differently across different areas of your life?
• What's the version of this purpose you're actually willing to commit to, not just admire?

Write your unified purpose statement as it stands today.`
  },

  // RELATIONSHIPS (Days 51-60): Connection with others
  {
    day: 51,
    title: "Relationship Values",
    theme: "Connection Principles",
    prompt: `What you actually need from relationships is more specific than "love" or "support" - get precise.

• What values matter most to you in relationships - honesty, loyalty, space, adventure?
• What do you genuinely bring to your relationships?
• What do you seek in others that you're not always finding?

Name the relationship value you'll hold yourself to more consistently.`
  },
  {
    day: 52,
    title: "Family Vision",
    theme: "Kin Connections",
    prompt: `Family - chosen or given - carries patterns you either continue or consciously interrupt.

• What kind of family life do you envision, realistically and specifically?
• Which family patterns do you want to continue, and which do you want to break?
• How do these relationships fit into the larger vision you're building?

Name the one family pattern you're ready to consciously change.`
  },
  {
    day: 53,
    title: "Friendship Landscape",
    theme: "Peer Bonds",
    prompt: `Friendship rarely gets the same deliberate attention as romance or career - give it that attention now.

• What role do friendships play in your ideal life?
• What qualities define your most meaningful friendships?
• Which friendship deserves more investment than it's currently getting?

Name the friend you'll reach out to intentionally this week.`
  },
  {
    day: 54,
    title: "Romantic Connection",
    theme: "Partnership",
    prompt: `Whatever your current status, it's worth being specific about what partnership actually means to you.

• What place does romantic partnership hold in your life vision?
• What would an ideal partnership actually look and feel like, day to day?
• How would it support your growth rather than just your comfort?

Name one quality you'll stop compromising on going forward.`
  },
  {
    day: 55,
    title: "Community Belonging",
    theme: "Larger Circles",
    prompt: `Beyond your inner circle is a wider community you either belong to or quietly drift past.

• What communities do you want to genuinely belong to?
• What would meaningful community connection actually look like for you?
• What do you have to offer these communities, not just receive from them?

Name one community you'll actively engage with this month.`
  },
  {
    day: 56,
    title: "Relationship Patterns",
    theme: "Connection Habits",
    prompt: `A pattern that shows up across multiple relationships is rarely about any one person - it's about you.

• What relationship pattern would you most like to transform?
• What new skill or approach would support the connection you actually want?
• Where did this old pattern likely start?

Name the one relational skill you'll practice this week.`
  },
  {
    day: 57,
    title: "Communication Vision",
    theme: "Authentic Expression",
    prompt: `How you communicate shapes whether you're actually known, or just heard.

• How do you want to communicate and be heard in your key relationships?
• What does authentic, effective communication actually look like for you?
• Where do you currently hold back more than you'd like to?

Name the conversation where you'll practice more directness this week.`
  },
  {
    day: 58,
    title: "Boundaries & Space",
    theme: "Healthy Limits",
    prompt: `Connection without boundaries eventually becomes resentment - name yours clearly.

• What boundaries would support healthier relationships in your life vision?
• How do you currently balance closeness with others against closeness with yourself?
• Where is a boundary currently too loose, or too rigid?

Name the boundary you'll set or adjust this week.`
  },
  {
    day: 59,
    title: "Conflict & Growth",
    theme: "Productive Tension",
    prompt: `Conflict handled well can deepen a relationship instead of ending it - it's a skill, not a threat.

• How might conflict actually be generative in your key relationships?
• What approach to disagreement would let both people grow while staying connected?
• What's your current default in conflict, and does it actually serve you?

Name the conflict pattern you'll try to handle differently next time.`
  },
  {
    day: 60,
    title: "Relationships Integration",
    theme: "Connection Ecosystem",
    prompt: `Ten days examining connection - now design the whole ecosystem deliberately.

• Who belongs in your inner, middle, and outer circles, realistically?
• How would this ecosystem support your wholeness and your purpose?
• What's currently missing from this picture?

Name the one relationship investment you'll prioritize this month.`
  },

  // WORK & CONTRIBUTION (Days 61-70): Career and meaningful work
  {
    day: 61,
    title: "Work Purpose",
    theme: "Meaningful Contribution",
    prompt: `Work can either express your purpose or just consume your hours - notice which one is true right now.

• What kind of work genuinely feels meaningful to you?
• How might your work express your values and purpose more directly?
• What impact do you actually want your work to have?

Name the one shift that would make your current work feel more purposeful.`
  },
  {
    day: 62,
    title: "Ideal Work Environment",
    theme: "Context & Culture",
    prompt: `The conditions around your work shape your performance and your soul in equal measure.

• Describe your ideal work environment - space, culture, pace, people.
• How far is this from where you currently work?
• What condition matters most to you that you've been ignoring?

Name one change to your work context you could actually pursue.`
  },
  {
    day: 63,
    title: "Skills & Mastery",
    theme: "Competence",
    prompt: `Mastery of the right skill can open doors that hustle alone never will.

• What skills would you most like to develop or master?
• What expertise would be genuinely fulfilling to cultivate, not just impressive?
• How would developing this serve your larger purpose?

Name the skill you'll start deliberately building this month.`
  },
  {
    day: 64,
    title: "Financial Vision",
    theme: "Resource Stewardship",
    prompt: `Money's role in your vision deserves more clarity than "more is better."

• What role should money actually play in the life you're building?
• What would "enough" concretely look like for you?
• How do you want to earn, save, spend, and share resources going forward?

Name the one financial habit that would align with this vision.`
  },
  {
    day: 65,
    title: "Balance & Integration",
    theme: "Work-Life Harmony",
    prompt: `Work either integrates with the rest of your life or quietly colonizes it - notice which is happening.

• How does work currently integrate with the other dimensions of your vision?
• What would healthy balance actually feel like, not just look like on paper?
• What's currently out of proportion?

Name the one adjustment that would restore better balance this month.`
  },
  {
    day: 66,
    title: "Leadership & Influence",
    theme: "Positive Impact",
    prompt: `Whether or not you have a title, you influence people around you - notice how.

• How do you currently lead or influence others through your work?
• What approach to leadership aligns with your actual values?
• Where do you hold back from influence you could rightfully claim?

Name one way you'll step into more leadership this month.`
  },
  {
    day: 67,
    title: "Entrepreneurship & Creation",
    theme: "Building & Innovating",
    prompt: `Something specific wants to be built through you - name it plainly.

• What might you create or build if you let yourself take it seriously?
• Does starting your own venture or project actually fit your vision?
• What's stopped you from starting, even in a small way?

Name the smallest version of this creation you could start this month.`
  },
  {
    day: 68,
    title: "Service & Giving",
    theme: "Altruism",
    prompt: `Contribution doesn't require a title - it requires attention to where you're actually needed.

• How might service or volunteering fit into your life vision?
• What cause or community do you genuinely want to support?
• What resource - time, skill, money - could you realistically offer?

Name the specific way you'll give this month.`
  },
  {
    day: 69,
    title: "Legacy Through Work",
    theme: "Enduring Impact",
    prompt: `Your work will eventually end - what continues after you're gone is worth deciding now.

• What professional legacy do you want to leave?
• How might your work outlast your direct involvement in it?
• What do you want to be remembered for professionally?

Name the one contribution you're most focused on building toward this legacy.`
  },
  {
    day: 70,
    title: "Work Integration",
    theme: "Contribution Synthesis",
    prompt: `Ten days examining your working life - now put it together into one coherent picture.

• What would your ideal work life actually look like, synthesized from this week?
• How would it express your purpose and use your real gifts?
• What's the first concrete step toward that ideal?

Write your work vision as a single clear paragraph.`
  },

  // WELLBEING & JOY (Days 71-80): Health and happiness
  {
    day: 71,
    title: "Physical Vitality",
    theme: "Body Care",
    prompt: `Your body is the one vehicle you can't trade in - what would truly caring for it look like?

• What role does physical health play in the life you're envisioning?
• What practices would support your ideal of physical wellbeing?
• What's the gap between this ideal and your current habits?

Name the one physical practice you'll commit to this week.`
  },
  {
    day: 72,
    title: "Emotional Wellbeing",
    theme: "Feeling Life",
    prompt: `Emotional wellbeing isn't the absence of hard feelings - it's a different relationship with them.

• What would genuine emotional wellbeing feel like for you, specifically?
• What practices would help you build more resilience and richness in your emotional life?
• What's currently missing from your emotional toolkit?

Name the practice you'll add to support this.`
  },
  {
    day: 73,
    title: "Mental Clarity",
    theme: "Cognitive Health",
    prompt: `A clear mind is a maintained one - what maintenance are you actually doing?

• How do you want to develop and maintain your mental faculties over time?
• What practices support clear thinking, learning, and cognitive wellbeing for you specifically?
• What currently clutters your mind the most?

Name one practice you'll adopt to protect your mental clarity.`
  },
  {
    day: 74,
    title: "Spiritual Connection",
    theme: "Transcendent Dimension",
    prompt: `Whatever you consider sacred deserves deliberate space in your life, not just occasional attention.

• What role does spirituality or a sense of the sacred play in your vision?
• How might you nurture connection to what feels meaningful or greater than yourself?
• What's stopped you from making more room for this?

Name the practice you'll return to or begin this month.`
  },
  {
    day: 75,
    title: "Play & Joy",
    theme: "Pleasure & Delight",
    prompt: `Somewhere joy became optional in your life instead of essential - reclaim it.

• What brings you genuine joy and pleasure, not just relief from stress?
• How would play and delight be integrated into your ideal life?
• What would you do purely because it delights you, with no other justification?

Name the one joyful thing you'll do this week for no reason at all.`
  },
  {
    day: 76,
    title: "Rest & Restoration",
    theme: "Renewal",
    prompt: `Rest isn't the reward for finishing - it's part of the work itself.

• How would you ideally rest and restore your energy?
• What healthy rhythm of activity and recovery would actually serve you?
• What's currently preventing real rest, even when you have the time?

Name the one restorative practice you'll protect this week.`
  },
  {
    day: 77,
    title: "Creative Expression",
    theme: "Making & Imagining",
    prompt: `Creativity isn't separate from wellbeing - for many people, it's central to it.

• How would creative expression nurture your overall wellbeing?
• What forms of creativity belong in your vision for a joyful, fulfilled life?
• What's stopped you from making more room for this?

Name the creative practice you'll return to this month.`
  },
  {
    day: 78,
    title: "Nature Connection",
    theme: "Environmental Bond",
    prompt: `The natural world offers a kind of restoration that nothing manufactured quite replicates.

• What role does connection with nature play in your vision for wellbeing?
• How would you integrate more nature experiences into your ideal life?
• What's the barrier that currently keeps you from this?

Name the nature practice you'll build into your week.`
  },
  {
    day: 79,
    title: "Learning & Growth",
    theme: "Development",
    prompt: `A life that keeps growing needs ongoing input, not just accumulated experience.

• How would continual learning feature in your ideal life?
• What do you want to learn, study, or explore over the coming years?
• What's stopped you from pursuing this already?

Name the one thing you'll start learning this month.`
  },
  {
    day: 80,
    title: "Wellbeing Integration",
    theme: "Wholeness",
    prompt: `Ten days examining wellbeing - now design an approach that actually holds it all together.

• How do physical, emotional, mental, and spiritual wellbeing connect in your life?
• What practices and priorities would support your thriving across all of them?
• What's the one area most neglected right now?

Write your integrated wellbeing plan as a short, concrete list.`
  },

  // FUTURE PLANNING (Days 81-90): Concrete plans and goals
  {
    day: 81,
    title: "Vision to Reality",
    theme: "Implementation",
    prompt: `A vision that stays a vision changes nothing - what would it take to actually move it into reality?

• What specific changes or actions would bridge where you are now and where you want to be?
• What's the biggest gap between your current life and your vision?
• What's stopped you from closing this gap already?

Name the first concrete bridge you'll build this month.`
  },
  {
    day: 82,
    title: "Core Goal Areas",
    theme: "Key Focuses",
    prompt: `Trying to change everything at once usually means changing nothing - narrow your focus.

• What 3-5 areas of your vision feel most important to focus on first?
• For each, what specific goal would create meaningful progress?
• Which area, if improved, would positively affect the others?

Name your single top-priority area for the next 90 days.`
  },
  {
    day: 83,
    title: "Habit Design",
    theme: "Daily Practices",
    prompt: `Your vision will be built, or abandoned, in the accumulation of ordinary days.

• What daily and weekly habits would actually move you toward your vision?
• What's the smallest version of these habits you could realistically sustain?
• What's derailed similar habits for you in the past?

Name the one habit you'll start building this week.`
  },
  {
    day: 84,
    title: "Resource Inventory",
    theme: "Assets & Needs",
    prompt: `You already have more to work with than you're giving yourself credit for - and some real gaps too.

• What resources - skills, relationships, finances - do you already have to support your vision?
• What additional resources will you genuinely need to develop or acquire?
• What's the resource you're most lacking right now?

Name the one resource you'll start building or seeking this month.`
  },
  {
    day: 85,
    title: "Obstacle Planning",
    theme: "Challenge Management",
    prompt: `The obstacles ahead are mostly predictable if you're honest about your own patterns.

• What internal obstacles - fear, doubt, old habits - might hinder your vision?
• What external obstacles are realistically in your way?
• For your biggest obstacle, what's a specific strategy to navigate it?

Name the obstacle you'll prepare for first.`
  },
  {
    day: 86,
    title: "Support System",
    theme: "Help & Accountability",
    prompt: `No vision this size gets built entirely alone - name who's actually going to help.

• Who could genuinely support you in realizing this vision?
• What kind of help do you actually need - feedback, accountability, encouragement?
• What's stopped you from asking for this so far?

Name the person you'll ask for support this week.`
  },
  {
    day: 87,
    title: "Decision Framework",
    theme: "Choice Architecture",
    prompt: `Every day ahead will bring choices - build the filter now instead of deciding from scratch each time.

• What framework would help you make decisions aligned with this vision?
• What specific questions or criteria could guide your future choices?
• What decision are you facing right now that this framework could clarify?

Write your decision framework as three concrete questions you'll actually use.`
  },
  {
    day: 88,
    title: "Metrics & Feedback",
    theme: "Progress Tracking",
    prompt: `Without some way to measure progress, you won't know if you're actually moving or just staying busy.

• How will you measure progress toward this vision?
• What specific indicators would show you're moving in the right direction?
• How will you gather honest feedback along the way?

Name the one metric you'll start tracking this month.`
  },
  {
    day: 89,
    title: "Adjustment Process",
    theme: "Adaptive Planning",
    prompt: `No vision survives contact with reality unchanged - build in a process for adjusting it.

• How will you review and adjust this vision over time?
• What would a regular check-in with yourself look like?
• What would tell you it's time to course-correct rather than push through?

Name the specific schedule you'll use to review this vision.`
  },
  {
    day: 90,
    title: "Action Plan",
    theme: "First Steps",
    prompt: `Ten days of planning - now commit to the concrete next ninety.

• What specific steps will you take in the next three months?
• What calendar commitments are you willing to actually make to yourself?
• What would make you quietly abandon this plan, and how will you prevent that?

Write your three-month action plan as a dated list.`
  },

  // INTEGRATION & LEGACY (Days 91-100): Synthesis and living your vision
  {
    day: 91,
    title: "Living Your Vision",
    theme: "Daily Embodiment",
    prompt: `You don't have to wait for every circumstance to change before you start living this vision.

• How can you begin embodying elements of this vision today, before anything external shifts?
• What mindset or practice could you adopt right now, regardless of circumstances?
• What's stopped you from starting sooner?

Name the one element of your vision you'll start living today.`
  },
  {
    day: 92,
    title: "Personal Credo",
    theme: "Guiding Principles",
    prompt: `A life this considered deserves a written declaration of how you intend to live it.

• What principles will guide your choices and actions going forward?
• Write a personal credo or manifesto capturing the essence of how you want to live.
• Which principle will be hardest to actually honor under pressure?

Read your credo out loud once, and notice how it feels to claim it.`
  },
  {
    day: 93,
    title: "Life Chapters Ahead",
    theme: "Future Story",
    prompt: `The chapters of your life still to be written are yours to title.

• What chapters of your life story are still ahead of you?
• What title would you give the chapter you're about to start?
• What themes do you want this next chapter to explore?

Name the opening line of this next chapter.`
  },
  {
    day: 94,
    title: "Aging With Purpose",
    theme: "Lifelong Development",
    prompt: `Growing older is inevitable - growing older with purpose is a choice you can start making now.

• How do you envision growing older with purpose and grace?
• What would meaningful aging actually look like within your vision?
• What fear about aging is worth examining honestly?

Name the one quality you want to deepen, not just maintain, as you age.`
  },
  {
    day: 95,
    title: "Wisdom Cultivation",
    theme: "Growing Deeper",
    prompt: `Getting older and getting wiser are not automatically the same thing - the second one takes intention.

• What wisdom do you want to develop over your lifetime?
• How might you grow not just older, but deeper and more compassionate?
• What practice actually builds wisdom, versus just accumulating years?

Name the practice you'll commit to for cultivating this.`
  },
  {
    day: 96,
    title: "Legacy Statement",
    theme: "Impact",
    prompt: `What people say about you after you're gone is being written by how you live right now.

• Draft a personal legacy statement - what impact do you want to have had?
• How do you want to be remembered, specifically?
• What are you currently doing that actually builds toward this legacy?

Write your legacy statement as a single, clear paragraph.`
  },
  {
    day: 97,
    title: "One-Year Vision",
    theme: "Near Future",
    prompt: `One year out is close enough to be concrete and far enough to actually change.

• What will have changed in your life a year from now, if this vision is being lived?
• What will you be doing, feeling, and experiencing day to day?
• What's the first milestone along the way you'd notice?

Name the one thing that needs to start this month for that year to be real.`
  },
  {
    day: 98,
    title: "Five-Year Vision",
    theme: "Medium Future",
    prompt: `Five years is long enough for real transformation, if the direction is set now.

• What will you have accomplished in five years, in this vision?
• How will your daily life look and feel different from today?
• What will matter most to you by then?

Name the one decision today that most shapes whether this becomes true.`
  },
  {
    day: 99,
    title: "Ten-Year Horizon",
    theme: "Long Future",
    prompt: `Ten years out, most of what worries you today will be forgotten - what will actually matter?

• What possibilities excite you when you look ten years ahead?
• What impact will you have made by then?
• How will your wisdom and experience have deepened?

Name the one seed you'll plant now that won't bear fruit for years.`
  },
  {
    day: 100,
    title: "Your Legacy",
    theme: "Integration",
    prompt: `A hundred days of reflection end here - what do you actually want your life to stand for?

• After everything you've explored, what do you want your life to stand for?
• What legacy do you hope to create, stated plainly?
• What's the very next chapter you're walking into starting tomorrow?

Write the one sentence you want to remember from this entire hundred-day journey.`
  }
];

export const mindfulVisualizationDays = [
  {
    day: 1,
    title: "Visual Awareness",
    theme: "Present Observation",
    prompt: `Most of what surrounds you goes unseen because you stopped really looking a long time ago - pick one object and actually look.

• Choose one object that genuinely catches your attention right now.
• Sketch its basic shapes and lines - no need for accuracy, just presence.
• What did you notice about it only once you slowed down to draw it?

Don't judge the sketch - notice instead what looking that closely did to your attention.`
  },
  {
    day: 2,
    title: "Emotional Colors",
    theme: "Color Expression",
    prompt: `Skip the object entirely today - let the feeling itself hit the page directly, through color alone.

• Name the emotion you're feeling most strongly right now.
• Choose colors that feel like that emotion, not colors you think "should" represent it.
• Let those colors and shapes move across the page with no plan.

Notice which color surprised you by how right it felt.`
  },
  {
    day: 3,
    title: "Mindful Lines",
    theme: "Process Focus",
    prompt: `Draw without deciding where the line is going - just follow the sensation of your hand moving.

• Let your pen move continuously without planning the outcome.
• Notice the exact moment your mind starts narrating instead of just moving.
• Gently return to the sensation of the stroke each time it wanders.

Look at the result - does it look like your mind was calm, scattered, or something else?`
  },
  {
    day: 4,
    title: "Nature's Patterns",
    theme: "Natural Forms",
    prompt: `Pick one natural object - a leaf, a stone, a cloud - and actually study it instead of glancing at it.

• Spend real time observing its texture and repetition before you draw anything.
• Sketch the pattern you see, not the object's overall outline.
• What did slowing down reveal that a quick glance would have missed?

Notice one detail in this pattern you've never consciously seen before.`
  },
  {
    day: 5,
    title: "Body Awareness",
    theme: "Physical Sensation",
    prompt: `Close your eyes and scan for what's actually happening in your body right now, before you draw a single line.

• Notice where you feel tension, lightness, or energy.
• Choose colors, shapes, or symbols that represent these physical sensations.
• Which sensation was hardest to find a visual form for?

Let the drawing be entirely about sensation, not appearance.`
  },
  {
    day: 6,
    title: "Breath Visualization",
    theme: "Rhythmic Flow",
    prompt: `Let your breathing draw the line instead of your intention - rising with the inhale, falling with the exhale.

• Draw a continuous line that follows your breath for at least five minutes.
• Notice where your breath sped up, caught, or steadied.
• What does the resulting rhythm tell you about your state right now?

Look at where the line is jagged versus smooth - what was happening in you at that moment?`
  },
  {
    day: 7,
    title: "Sound Translation",
    theme: "Sensory Integration",
    prompt: `Listen first, draw second - let sound decide the shape instead of your eyes.

• Listen closely to the sounds around you, or play a piece of music.
• Translate what you hear into visual elements - dots, waves, colors, whatever fits.
• Which sound was hardest to translate into something visual?

Notice what this exercise reveals about how you actually experience sound.`
  },
  {
    day: 8,
    title: "Memory Sketching",
    theme: "Present to Past",
    prompt: `Pull up a calm, pleasant memory and let your hand sketch it before your mind edits it.

• Recall the memory in detail - where you were, who else was there.
• Sketch elements of it without overthinking accuracy.
• What feeling from that memory came through most clearly in the sketch?

Notice what your hand chose to include that your conscious memory had forgotten.`
  },
  {
    day: 9,
    title: "Gratitude Symbols",
    theme: "Appreciation",
    prompt: `Turn three things you're grateful for today into simple symbols instead of words.

• Choose three things you're genuinely grateful for right now.
• Create a simple symbol or icon for each.
• Arrange them in a way that feels balanced and meaningful to you.

Notice which symbol was easiest to draw and which took the most thought.`
  },
  {
    day: 10,
    title: "Inner Weather",
    theme: "Emotional Landscape",
    prompt: `If your emotional state today were an actual weather system, what would the forecast say?

• Decide what weather your current state resembles - storm, fog, clear skies, something in between.
• Use colors, shapes, and textures to depict this internal weather.
• Is there a front moving in, or does this weather feel likely to hold?

Notice what this weather metaphor reveals that a mood word wouldn't have.`
  },
  {
    day: 11,
    title: "Intentional Mandalas",
    theme: "Centered Focus",
    prompt: `Build outward from a single center point, letting each ring carry an intention.

• Start a simple mandala from the center and work outward.
• With each new layer, hold a quality you want to cultivate - patience, joy, calm.
• Which quality was hardest to actually hold in mind while drawing?

Notice whether the mandala became more ordered or more chaotic as it grew.`
  },
  {
    day: 12,
    title: "Shadow Appreciation",
    theme: "Contrast & Balance",
    prompt: `Look at what shadow actually does - it doesn't just hide, it defines and reveals.

• Observe the shadows and light around you right now.
• Draw focusing on the contrast between dark and light rather than the objects themselves.
• Where does the shadow reveal something the light alone wouldn't show?

Notice one place in your life where "shadow" might be doing the same defining work.`
  },
  {
    day: 13,
    title: "Texture Exploration",
    theme: "Tactile Awareness",
    prompt: `Close your eyes and let touch lead, then translate what your fingers found into a visual pattern.

• Touch several different textures around you with your eyes closed.
• Create a visual composition translating these tactile sensations.
• Which texture was the hardest to render visually?

Notice which sense - touch or sight - actually told you more about the object.`
  },
  {
    day: 14,
    title: "Dream Fragment",
    theme: "Subconscious Expression",
    prompt: `Pull up a recent dream fragment and let it land on the page without trying to make literal sense of it.

• Recall a dream or fragment, however strange or incomplete.
• Draw or paint the feeling of it, not a literal illustration.
• What emotion from the dream came through strongest in the image?

Notice what element refused to translate cleanly into a drawing - that's often the important part.`
  },
  {
    day: 15,
    title: "Mid-Journey Reflection",
    theme: "Integration",
    prompt: `Two weeks of visual journaling behind you - look back and notice which pieces you actually keep returning to.

• Review your entries from the past two weeks.
• Create a new piece that pulls elements or techniques from your favorites.
• What technique or color keeps reappearing without you planning it?

Notice what this recurring element might be trying to tell you.`
  },
  {
    day: 16,
    title: "Body Mapping",
    theme: "Self-Connection",
    prompt: `Draw a simple body outline and map what's actually happening inside it right now.

• Sketch a simple human outline.
• Use color, pattern, or symbol to mark where you feel joy, tension, energy, or calm.
• Which part of the body surprised you with what it was holding?

Notice the area you almost skipped over - what might it be asking for?`
  },
  {
    day: 17,
    title: "Releasing Visualization",
    theme: "Letting Go",
    prompt: `Name the thing you're ready to release, and let the image show the transformation, not just the object.

• Identify something you'd like to let go of.
• Depict the shift - from tension to freedom, or from chaos to clarity.
• What did the "before" look like compared to the "after"?

Notice how it feels in your body to look at the "after" image.`
  },
  {
    day: 18,
    title: "Sacred Space",
    theme: "Inner Sanctuary",
    prompt: `Picture the place that would make you feel completely safe, and draw it into existence.

• Visualize a space representing safety, peace, and comfort.
• Draw this inner sanctuary, including what makes you feel protected there.
• What element of this space is missing from your actual daily life?

Notice one small way you could bring a piece of this sanctuary into your real environment.`
  },
  {
    day: 19,
    title: "Movement Traces",
    theme: "Dynamic Presence",
    prompt: `Draw from a distance today - let your whole arm move instead of just your fingers.

• Extend your drawing tool with a stick or holder to create distance from the page.
• Move your whole arm or body as you draw, rather than controlling with just your hand.
• What changed in the marks once precision became impossible?

Notice whether this felt more freeing or more frustrating, and why.`
  },
  {
    day: 20,
    title: "Intuitive Symbols",
    theme: "Personal Iconography",
    prompt: `Let 3-5 symbols surface without overthinking what they're supposed to mean.

• Create symbols that feel personally meaningful right now, without pre-planning them.
• Notice what each one seems to represent only after it's drawn.
• Which symbol surprised you the most?

Name what current challenge or aspiration that surprising symbol might be pointing to.`
  },
  {
    day: 21,
    title: "Nature Connection",
    theme: "Ecological Awareness",
    prompt: `Spend time with one natural element and let your drawing blend your own form into it.

• Observe a tree, flower, sky, or body of water closely.
• Draw your connection to it, perhaps blending your human form with the natural one.
• Where did the boundary between you and the element start to blur?

Notice what this blending reveals about how separate you actually feel from nature day to day.`
  },
  {
    day: 22,
    title: "Childhood Memory",
    theme: "Playful Expression",
    prompt: `Draw with your non-dominant hand and let go of any expectation of skill.

• Recall how you used to draw as a child, before it needed to be "good."
• Create something with your non-dominant hand, embracing the wobble.
• What feeling came up as you let go of control over the outcome?

Notice whether this felt more freeing or more uncomfortable, and sit with that honestly.`
  },
  {
    day: 23,
    title: "Visual Meditation",
    theme: "Focused Awareness",
    prompt: `Start from a single dot and stay with the page for ten full minutes of present attention.

• Begin with one dot in the center of the page.
• Add to it slowly for ten minutes, returning to the present each time your mind wanders.
• How many times did you catch your attention drifting?

Notice what pulled your attention away most often, and what that says about your current mental state.`
  },
  {
    day: 24,
    title: "Emotional Spectrum",
    theme: "Full Range Expression",
    prompt: `Map the whole range of what you feel, not just the easy or acceptable parts.

• Depict your emotional spectrum - from the most difficult feelings to the most uplifting.
• Notice how these emotions relate to or bleed into each other visually.
• Which emotion took up the most space on the page, and did that surprise you?

Notice which emotion you almost left out entirely.`
  },
  {
    day: 25,
    title: "Word to Image",
    theme: "Linguistic Translation",
    prompt: `Choose one significant word and let its feeling become an image, without illustrating it literally.

• Pick a word that feels significant to you today.
• Translate its essence into color, shape, and texture - not a literal picture of it.
• What surprised you about how the word wanted to look?

Notice whether the image matches how you'd have described the word in conversation.`
  },
  {
    day: 26,
    title: "Energy Pathways",
    theme: "Vitality Awareness",
    prompt: `Sense your inner energy with eyes closed, then let flowing lines map where it moves.

• Close your eyes and sense the movement of energy in your body.
• Open your eyes and draw flowing lines mapping these pathways, using different colors for different qualities of energy.
• Where did the energy feel blocked or stagnant versus free-flowing?

Notice the one pathway you'd like to open up more this week.`
  },
  {
    day: 27,
    title: "Growth Visualization",
    theme: "Transformation",
    prompt: `Depict your growth journey as a single image spanning where you've been to where you're heading.

• Show where you've been, where you are now, and the direction you're growing toward.
• Notice which part of this journey was hardest to depict.
• What visual element captures your current growing edge?

Notice whether the image feels more like a straight line or something messier - and which feels more honest.`
  },
  {
    day: 28,
    title: "Boundary Exploration",
    theme: "Containment & Freedom",
    prompt: `Draw a boundary and fill the two sides of it differently, on purpose.

• Draw a container of some kind - circle, square, or an irregular shape.
• Fill the inside and outside in contrasting ways.
• Which side feels more like your current life - the contained or the uncontained?

Notice what it would take to shift the balance between the two.`
  },
  {
    day: 29,
    title: "Visual Storytelling",
    theme: "Narrative Flow",
    prompt: `Tell a story in 3-4 panels and let it emerge intuitively instead of planning it out first.

• Create a simple sequential drawing across a few panels.
• Focus on the transition between panels rather than the detail within them.
• What story emerged that you didn't consciously plan to tell?

Notice what the ending panel reveals about where you feel you're headed.`
  },
  {
    day: 30,
    title: "Aspirational Vision",
    theme: "Future Self",
    prompt: `Pick a quality you want to grow into, and give it a visual form before it fully exists in you.

• Choose a quality you wish to develop more fully in yourself.
• Depict how this quality might look and feel if expressed visually.
• What color, shape, or texture captures this quality best?

Notice the smallest way you could embody this quality even today, before it's fully developed.`
  },
  {
    day: 31,
    title: "Integration Patterns",
    theme: "Wholeness",
    prompt: `Let contrasting parts of yourself share the same page without one canceling the other out.

• Represent different aspects of yourself in a single image, even if they seem contradictory.
• Notice how you visually harmonize the contrasting elements.
• Which two parts of yourself were hardest to place together?

Notice whether the final image feels like conflict or like coexistence.`
  },
  {
    day: 32,
    title: "Gratitude Garden",
    theme: "Abundance",
    prompt: `Grow a garden made entirely of what you're grateful for, one plant at a time.

• Fill a visual garden with elements representing things you're grateful for.
• Let each plant, flower, or feature symbolize a different part of your life.
• Which part of the garden feels most abundant right now?

Notice which part of the garden looks like it needs more tending.`
  },
  {
    day: 33,
    title: "Visual Journey Reflection",
    theme: "Creative Integration",
    prompt: `Look back through this entire visual journey and let the final piece hold what actually mattered.

• Review all your entries from this journey.
• Create a final piece incorporating the elements that most resonated with you.
• What technique or theme showed up more than any other?

Write, next to your final piece, the one thing this visual mindfulness practice taught you about yourself.`
  }
];

export const lifeValuesDays = [
  {
    day: 1,
    title: "Values Introduction",
    theme: "Self-Awareness",
    prompt: `Values aren't abstract ideals - they're the actual reason certain moments in your life felt right.

• Recall a time you felt truly aligned and fulfilled. What was actually happening?
• What value were you honoring in that specific moment?
• Why does it matter to you personally that values even get named?

Name the value from that memory you want to trace through this entire journey.`
  },
  {
    day: 2,
    title: "Values Exploration",
    theme: "Discovery",
    prompt: `Scan a wide list of possible values - integrity, freedom, creativity, security, and beyond - and notice which ones actually pull at you.

• Which 10-15 values genuinely resonate when you read them, not just sound nice?
• Which one surprised you by how strongly it landed?
• Which "obvious" value on the list did you feel nothing for?

Circle the three that felt most immediate and true.`
  },
  {
    day: 3,
    title: "Core Values Identification",
    theme: "Prioritization",
    prompt: `From yesterday's longer list, narrow ruthlessly down to what's actually essential.

• Which 5-7 values feel non-negotiable to who you are?
• What separates a core value from a value you just admire in others?
• Which value did you cut that was hardest to let go of?

Name the one value you're most confident belongs on this shorter list.`
  },
  {
    day: 4,
    title: "Values in Action",
    theme: "Manifestation",
    prompt: `A value only counts once it's shown up in an actual moment - find that moment for each of yours.

• For each core value, recall a specific time you lived it fully.
• How did it feel in your body when you did?
• What impact did that moment have, on you or on someone else?

Name the value you've lived out the least recently.`
  },
  {
    day: 5,
    title: "Values Conflicts",
    theme: "Tension",
    prompt: `Your values don't always agree with each other - notice where they've clashed.

• When have two of your core values pulled you in opposite directions?
• How did you navigate that tension, and what did you ultimately prioritize?
• Looking back, do you agree with the choice you made?

Name a values conflict you're currently facing and which value is winning right now.`
  },
  {
    day: 6,
    title: "Family Values",
    theme: "Origins",
    prompt: `Some of your values were handed to you long before you chose anything for yourself.

• What values were emphasized in your family growing up?
• Which of these did you absorb without question, and which did you actively reject?
• Which one have you quietly modified into your own version?

Name the family value you're still deciding whether to keep.`
  },
  {
    day: 7,
    title: "Cultural Values",
    theme: "Societal Influence",
    prompt: `Culture writes rules about what should matter, and you've been following some of them without noticing.

• How has your cultural background shaped what you value?
• Which culturally-inherited value do you genuinely embrace?
• Which one have you started to question?

Name one cultural value you're ready to examine more critically.`
  },
  {
    day: 8,
    title: "Values Assessment",
    theme: "Congruence",
    prompt: `Rating yourself honestly here will sting a little, and that's exactly the point.

• Rate each core value 1-10 for how fully you're actually living it, not aspiring to.
• Which value scored the lowest, and does that surprise you?
• What's the gap between this score and how you'd describe yourself to others?

Name the value with the biggest gap between belief and practice.`
  },
  {
    day: 9,
    title: "Work Values",
    theme: "Professional Alignment",
    prompt: `Your job either lets your values breathe or quietly suffocates them - notice which is true.

• Which of your values are genuinely honored in your current work?
• Which are compromised or ignored there?
• What would greater alignment actually look like, concretely?

Name the one workplace change that would most honor your top value.`
  },
  {
    day: 10,
    title: "Relationship Values",
    theme: "Connection",
    prompt: `Values shape who you're drawn to and who eventually frustrates you.

• Which values do you share with the people closest to you?
• Where do your values genuinely differ from theirs?
• How do you currently navigate those differences - well, or not?

Name the relationship where a values gap most needs an honest conversation.`
  },
  {
    day: 11,
    title: "Values and Time",
    theme: "Priorities",
    prompt: `Your calendar is a more honest values statement than anything you'd say out loud.

• Look at how you actually spent time this past week.
• Which activities aligned with your core values?
• Which activities directly worked against them?

Name the one time-adjustment that would close the biggest gap.`
  },
  {
    day: 12,
    title: "Values Under Pressure",
    theme: "Resilience",
    prompt: `Stress reveals which of your values are load-bearing and which were just decoration.

• Under real pressure, which values do you maintain most easily?
• Which tend to collapse first when things get hard?
• What actually helps you stay aligned during difficult stretches?

Name the value you most want to protect the next time you're under pressure.`
  },
  {
    day: 13,
    title: "Values and Decision-Making",
    theme: "Choices",
    prompt: `A recent decision reveals more about your real values than any list you'd write on purpose.

• Recall a significant decision you made recently.
• How did your values actually shape that choice, whether consciously or not?
• What framework could you build from this to guide future decisions?

Write your values-based decision framework as two or three concrete questions.`
  },
  {
    day: 14,
    title: "Values Evolution",
    theme: "Growth",
    prompt: `You haven't valued the same things your entire life - trace what's actually shifted.

• Which values have remained constant throughout your life?
• Which have genuinely changed, and what catalyzed the shift?
• Which past value do you no longer recognize as yours?

Name the value shift you're proudest of.`
  },
  {
    day: 15,
    title: "Aspirational Values",
    theme: "Future Self",
    prompt: `Some values you admire in others but haven't fully claimed for yourself yet.

• What value do you aspire to embody more fully?
• What quality in someone else makes you want to develop this in yourself?
• What would actually living this value look like in your daily life?

Name one small action this week that would move you toward this aspirational value.`
  },
  {
    day: 16,
    title: "Values and Ethics",
    theme: "Principles",
    prompt: `Your values are being tested every time a situation gets morally complicated.

• How do your values inform your approach to right and wrong?
• Think of a morally complex situation you've faced - which values guided you?
• Where did your values conflict with what was easiest or most convenient?

Name the ethical principle you're most committed to, even when it costs you.`
  },
  {
    day: 17,
    title: "Values in Community",
    theme: "Collective Belonging",
    prompt: `Being around people who share your values reinforces them; being around people who don't can quietly erode them.

• Which communities or groups genuinely share your core values?
• How does belonging to them reinforce what matters to you?
• What could you actually contribute to a community that matters to you?

Name the community you'll invest more in this month.`
  },
  {
    day: 18,
    title: "Living Your Values",
    theme: "Alignment",
    prompt: `Pick one value and build an actual, boring, doable plan to live it more.

• Choose the value you most want to express more fully.
• What specific action or habit would help you live it more intentionally?
• What's stopped you from doing this already?

Write the concrete plan, with a start date this week.`
  },
  {
    day: 19,
    title: "Values Legacy",
    theme: "Impact",
    prompt: `The values you actually live by outlast you far more than any achievement will.

• What values do you hope to pass on or be remembered for?
• How might living these values impact someone beyond your own lifetime?
• Who have you already influenced this way, even without realizing it?

Name the one value you most want people to associate with you.`
  },
  {
    day: 20,
    title: "Personal Values Statement",
    theme: "Integration",
    prompt: `Twenty days of examining your values - now put them into words you could actually live by.

• What core principles have emerged as truly yours?
• How do you want these principles to guide your daily choices?
• What would change if you actually consulted this statement regularly?

Draft your personal values statement in three sentences you could memorize.`
  },
  {
    day: 21,
    title: "Values and Purpose",
    theme: "Meaning",
    prompt: `Your values and your sense of purpose are more connected than they might seem.

• How do your core values connect to what gives your life meaning?
• What kind of contribution feels genuinely aligned with what you value?
• What would a more meaningful life look like if it fully expressed your values?

Name the one contribution you'll pursue that honors both your values and your purpose.`
  },
  {
    day: 22,
    title: "Values Journey Integration",
    theme: "Commitment",
    prompt: `Twenty-two days of examining what actually matters to you - now commit to something real.

• What's the single most important insight from this entire exploration?
• Which value do you most need to live more consistently?
• What would hold you accountable to this going forward?

Write the one commitment you're making to keep your life aligned with what matters most.`
  }
];

// "Relationship Mastery" 30-day journey (adapted from premium path)
export const relationshipMasteryDays = [
  {
    day: 1,
    title: "Relationship Audit",
    theme: "Assessment",
    prompt: `Map your relationships honestly instead of by how you'd describe them at a party.

• List your key relationships - family, friends, romantic, professional.
• For each, name what's genuinely working and what quietly isn't.
• What pattern shows up across more than one of these relationships?

Name the one relationship most in need of attention right now.`
  },
  {
    day: 2,
    title: "Relationship Values",
    theme: "Principles",
    prompt: `What you actually need from people is more specific than "a good relationship."

• Name the qualities you most value in relationships - trust, humor, depth, honesty.
• Which of these do you consistently embody yourself?
• Which do you expect from others but rarely offer first?

Name the value you most want to develop in how you show up for people.`
  },
  {
    day: 3,
    title: "Attachment Patterns",
    theme: "Connection Styles",
    prompt: `The way you connect - or don't - was largely set before you had any say in it.

• Do you tend to cling, avoid, or stay secure in close relationships?
• Where did this pattern likely originate in your early experiences?
• How does it show up in a relationship you're in right now?

Name the one attachment behavior you're most ready to examine.`
  },
  {
    day: 4,
    title: "Communication Inventory",
    theme: "Expression",
    prompt: `Some things you say clearly, and some things you swallow - notice the difference.

• When do you express yourself clearly, and when do you hold back?
• What conditions help you communicate effectively?
• What reliably triggers your worst communication?

Name the relationship where you hold back the most, and why.`
  },
  {
    day: 5,
    title: "Active Listening",
    theme: "Receptivity",
    prompt: `Real listening is rarer than it sounds - notice when you actually do it.

• When did you last listen to someone without already planning your response?
• What helps you be fully present in conversation?
• Who in your life deserves more of this presence than they currently get?

Name the conversation this week where you'll practice listening without an agenda.`
  },
  {
    day: 6,
    title: "Boundaries Exploration",
    theme: "Healthy Limits",
    prompt: `Some of your boundaries are solid, and some are either too soft or too rigid.

• Where do you maintain genuinely healthy boundaries?
• Where are they weak, or overcorrected into rigidity?
• How might a clearer boundary actually deepen, not damage, a key relationship?

Name the boundary you'll clarify this week.`
  },
  {
    day: 7,
    title: "Conflict Patterns",
    theme: "Disagreement",
    prompt: `Your default conflict style was likely modeled for you long before you chose it.

• How do you typically handle conflict - avoid, accommodate, compete, compromise, collaborate?
• What was modeled for you growing up around disagreement?
• How well is your current approach actually serving your relationships?

Name the conflict pattern you'll try to interrupt next time it shows up.`
  },
  {
    day: 8,
    title: "Trust Builders",
    theme: "Reliability",
    prompt: `Trust is built through specific, repeatable behaviors, not vague good intentions.

• What actually builds trust for you in a relationship?
• Recall a time you experienced deep trust with someone - what created it?
• Which of these trust-building behaviors do you consistently offer others?

Name the trust-building behavior you'll practice more this week.`
  },
  {
    day: 9,
    title: "Trust Breakers",
    theme: "Rupture",
    prompt: `Somewhere, trust was broken, and it's worth looking at honestly instead of around it.

• When has trust been broken in a significant relationship of yours?
• What impact did that rupture actually have on you?
• What would help rebuild that trust, if it's even repairable?

Name the lesson from that rupture you carry into relationships today.`
  },
  {
    day: 10,
    title: "Vulnerability Exploration",
    theme: "Openness",
    prompt: `Being truly seen requires a risk most people quietly avoid taking.

• How comfortable are you with being vulnerable, honestly?
• What makes vulnerability easier, and what makes it harder?
• Where would appropriate vulnerability actually deepen a key relationship?

Name the one vulnerable thing you'll share with someone this week.`
  },
  {
    day: 11,
    title: "Asking for What You Need",
    theme: "Self-Advocacy",
    prompt: `Needs that go unspoken rarely get met, no matter how much you hope someone will guess.

• How effectively do you express your needs in relationships?
• What makes this challenging for you specifically?
• What need have you been silently hoping someone would notice?

Write the exact words you'll use to voice this need directly.`
  },
  {
    day: 12,
    title: "Giving vs. Receiving",
    theme: "Balance",
    prompt: `Some people give constantly and receive poorly, or the reverse - notice which is you.

• Is it easier for you to give or to receive in relationships?
• Where might one of your relationships be out of balance because of this?
• What helps you maintain a healthier flow between the two?

Name one way you'll practice receiving, or giving, more this week - whichever is harder for you.`
  },
  {
    day: 13,
    title: "Empathy Practices",
    theme: "Understanding Others",
    prompt: `Every disagreement looks different once you actually step fully into the other side of it.

• Recall a recent disagreement - how well did you understand their perspective at the time?
• Reimagine it now, fully inhabiting their experience and feelings.
• Does anything about your anger or certainty shift once you do this?

Name what you'd say differently if this conversation happened again tomorrow.`
  },
  {
    day: 14,
    title: "Forgiveness Exploration",
    theme: "Letting Go",
    prompt: `Some resentment has been sitting in you longer than it needed to.

• Is there someone you're struggling to forgive right now?
• What makes forgiveness genuinely difficult here?
• What might become possible if you actually released this resentment?

Name the smallest step toward forgiveness you're willing to take, even if full forgiveness isn't there yet.`
  },
  {
    day: 15,
    title: "Relationship Mid-Point Check",
    theme: "Progress",
    prompt: `Two weeks of examining your relational patterns - look honestly at what's shifted.

• What relationship pattern have you recognized that you hadn't seen before?
• What shift have you actually begun to make, in practice not just intention?
• What still feels genuinely challenging?

Name the one thing you want the next two weeks to focus on.`
  },
  {
    day: 16,
    title: "Digital Communication",
    theme: "Modern Connection",
    prompt: `Your phone is quietly shaping the quality of your relationships, for better and worse.

• When does digital communication genuinely enhance your connections?
• When does it detract, flatten, or replace real connection?
• What boundary around technology would benefit a relationship of yours?

Name the one digital habit you'll adjust this week.`
  },
  {
    day: 17,
    title: "Appreciation Practices",
    theme: "Gratitude",
    prompt: `Appreciation you feel but never say does nothing for the person you feel it about.

• How often do you actually voice genuine appreciation to people?
• For three key relationships, name a specific quality you appreciate in each.
• Which one have you never actually told them?

Tell that person today, specifically, what you appreciate about them.`
  },
  {
    day: 18,
    title: "Difficult Conversations",
    theme: "Courage",
    prompt: `Something needs to be said, and you've been finding reasons to delay it.

• What conversation have you been avoiding?
• Why exactly is it difficult - the topic, the person, the timing?
• How could you approach it honestly without it becoming a fight?

Script the opening line you'll actually use, honest and respectful both.`
  },
  {
    day: 19,
    title: "Relationship Maintenance",
    theme: "Nurturing",
    prompt: `Relationships don't run on autopilot - they need small, regular deposits.

• What regular practices currently keep your important relationships healthy?
• Which relationship needs more intentional maintenance than it's getting?
• What's a simple, repeatable practice you could build for that relationship?

Design that practice and start it this week.`
  },
  {
    day: 20,
    title: "Support Systems",
    theme: "Community",
    prompt: `Not everyone in your life can support you the same way - map who does what.

• Who do you actually turn to for different kinds of support?
• Where are the gaps - a kind of support you don't currently have anywhere?
• How might you strengthen or expand this network?

Name the one gap you'll actively address this month.`
  },
  {
    day: 21,
    title: "Relationship Repair",
    theme: "Healing",
    prompt: `One relationship in your life needs actual repair work, not just time passing.

• Which relationship most needs repairing right now?
• What steps could realistically begin that healing process?
• What would you want a first conversation about it to include?

Name the date you'll initiate that first conversation.`
  },
  {
    day: 22,
    title: "Mentorship & Learning",
    theme: "Growth",
    prompt: `Someone in your life has modeled healthy relating, whether or not you've thanked them for it.

• Who has modeled healthy relationships for you?
• What specifically have you learned from them?
• What relationship skill are you still developing, and who could help you with it?

Name the person you'll ask for guidance or feedback on this skill.`
  },
  {
    day: 23,
    title: "Expectations vs. Reality",
    theme: "Acceptance",
    prompt: `Some of your disappointment in others is really a mismatch between expectation and reality.

• Where do your relationship expectations create disappointment or frustration?
• Which of these expectations are reasonable, and which might need adjusting?
• How might more acceptance change a currently challenging relationship?

Name the one expectation you're willing to release or renegotiate.`
  },
  {
    day: 24,
    title: "Cultural Influences",
    theme: "Societal Context",
    prompt: `Culture has quietly scripted some of what you expect from relationships.

• How have cultural messages shaped your relationship expectations and behaviors?
• Which of these influences genuinely serve you?
• Which might deserve real reconsideration?

Name the cultural script about relationships you're most ready to question.`
  },
  {
    day: 25,
    title: "Self-Relationship",
    theme: "Inner Connection",
    prompt: `How you treat everyone else is downstream of how you treat yourself.

• How would you describe your relationship with yourself right now?
• Where are you self-critical versus self-compassionate?
• How does this self-relationship show up in your connections with others?

Name the one way you'll practice more self-compassion this week.`
  },
  {
    day: 26,
    title: "Interdependence Balance",
    theme: "Connection & Autonomy",
    prompt: `Healthy connection isn't total merging or total independence - it's a balance most people never quite calibrate.

• How do you currently balance closeness and independence in relationships?
• Where do you lean toward unhealthy dependence, or unnecessary distance?
• What helps you maintain a genuinely healthy interdependence?

Name the relationship where this balance feels most off right now.`
  },
  {
    day: 27,
    title: "Relationship Vision",
    theme: "Aspiration",
    prompt: `Picture your relationship ecosystem five years from now, in specific, lived-in detail.

• What qualities characterize the relationships in this vision?
• What would need to change to move toward it?
• What's the first, smallest step available to you now?

Name that first step and when you'll take it.`
  },
  {
    day: 28,
    title: "Relationship Action Plan",
    theme: "Implementation",
    prompt: `Pick one relationship and turn insight into an actual plan.

• Choose the one key relationship you'll focus on improving.
• What specific action will you take, and what conversation might you initiate?
• What personal change on your part would make the biggest difference?

Write the plan down with a date you'll act on it.`
  },
  {
    day: 29,
    title: "Navigating Change",
    theme: "Evolution",
    prompt: `Relationships change shape over time whether you're ready or not - notice how you've handled that.

• How do you typically adapt when a relationship changes significantly?
• Recall a relationship that evolved a lot - what helped you navigate that transition?
• What wisdom from that experience applies to a change happening right now?

Name the relationship currently in transition and what this wisdom suggests for it.`
  },
  {
    day: 30,
    title: "Relationship Mastery Integration",
    theme: "Wisdom",
    prompt: `A month of examining how you connect - now look at the whole picture honestly.

• What key relationship insight has emerged that surprised you most?
• What pattern do you recognize now that you didn't on day one?
• What new practice are you actually committed to continuing?

Name your single next step in relationship growth, starting this week.`
  }
];

// "Financial Mindfulness" 21-day journey (adapted from premium path)
export const financialMindfulnessDays = [
  {
    day: 1,
    title: "Money Story",
    theme: "Narrative",
    prompt: `Long before you earned a paycheck, you were already absorbing lessons about what money means.

• What's your earliest memory involving money - a specific moment, not a general impression?
• What did the adults around you say or do about money that you absorbed without question?
• Was money discussed openly in your house, or was it a source of tension and silence?
• Which of these early messages are you still unconsciously obeying today?

Name the one money belief from childhood you're most ready to finally question.`
  },
  {
    day: 2,
    title: "Money Beliefs",
    theme: "Mindset",
    prompt: `Underneath your financial decisions is a set of beliefs you rarely examine because they feel like fact.

• Name a core belief you hold about money, in your own words - not the polished version, the raw one.
• Where did this belief come from, and has it actually been tested against your real life?
• Which belief genuinely serves you, and which one quietly limits you?
• What would you do differently this month if the limiting belief simply weren't true?

Write the counter-belief you'd like to start practicing instead.`
  },
  {
    day: 3,
    title: "Financial Feelings",
    theme: "Emotions",
    prompt: `Money is rarely just math - it drags emotion behind it everywhere it goes.

• What specific situation - checking your balance, a bill, a conversation - reliably triggers a strong emotion around money?
• Name the emotion precisely: anxiety, shame, pride, relief, resentment?
• How does that emotion actually change your financial behavior in the moment - avoidance, overspending, control?
• Whose voice or judgment do you hear when this emotion shows up?

Name one financial situation this week where you'll notice the feeling before you act on it.`
  },
  {
    day: 4,
    title: "Money & Identity",
    theme: "Self-Concept",
    prompt: `Somewhere along the way, your bank balance may have started standing in for your sense of worth.

• In what specific ways have you tied your value as a person to your financial status?
• What does a bad financial month make you believe about yourself, beyond the numbers?
• Who would you be, in your own eyes, if your income disappeared tomorrow?
• What's actually true about your worth that has nothing to do with money at all?

Write one sentence separating your identity from your finances that you can return to on hard days.`
  },
  {
    day: 5,
    title: "Financial Reality Check",
    theme: "Awareness",
    prompt: `Take an honest, judgment-free look at where things actually stand today.

• What's genuinely working in your financial life right now?
• What have you been avoiding looking at - an account, a number, a habit?
• What small step, taken today, would give you real clarity instead of vague dread?
• What's the story you tell yourself about your finances that may not match the actual numbers?

Do that one small clarifying step today, even if it's just opening the account you've been avoiding.`
  },
  {
    day: 6,
    title: "Spending Patterns",
    theme: "Consumption",
    prompt: `Your recent purchases are a more honest record of your priorities than anything you'd say out loud.

• Look at your last week of spending - what pattern jumps out?
• When did you spend mindfully, on purpose, and feel good about it afterward?
• When did you spend reactively - out of stress, boredom, or habit - and regret it?
• What do these patterns reveal about values you hold that you haven't consciously named?

Name one reactive spending trigger you'll watch for this week.`
  },
  {
    day: 7,
    title: "Scarcity vs. Abundance",
    theme: "Perspective",
    prompt: `Underneath your money decisions is a default setting - scarcity or abundance - running quietly in the background.

• Which one describes your default posture around money most days?
• Give a specific recent example of a decision this mindset shaped.
• What would a more balanced view actually look like in that same situation?
• Is your current mindset based on your present reality, or an old story that's outlived its usefulness?

Name one decision this week where you'll consciously choose the more balanced view.`
  },
  {
    day: 8,
    title: "Money & Relationships",
    theme: "Social Dynamics",
    prompt: `Money quietly shapes your closest relationships whether you talk about it directly or not.

• Where does money create tension in a specific relationship - partner, family, friend?
• What's the unspoken rule about money in that relationship that no one's ever actually said out loud?
• What conversation about money have you been avoiding having?
• What would honest, calm financial communication with this person actually sound like?

Name one specific thing you'll say to them this week that you've been holding back.`
  },
  {
    day: 9,
    title: "Financial Values",
    theme: "Principles",
    prompt: `Money itself is neutral - what matters is what you're actually trying to buy with it: security, freedom, generosity, status.

• Name the two or three values that matter most to you around money.
• Look at your last month of financial choices - do they actually reflect these values, or contradict them?
• Where's the biggest gap between what you say you value and what your spending shows?
• What would one week of value-aligned spending look like, specifically?

Name one purchase or habit you'll change this week to close that gap.`
  },
  {
    day: 10,
    title: "Enough",
    theme: "Sufficiency",
    prompt: `"Enough" is a moving target for most people - it's worth pinning down what it actually means for you.

• What does "enough" mean to you financially, in concrete terms, not a vague feeling?
• Has your definition of enough kept moving as your income has changed? Why?
• What non-financial assets - relationships, health, time, skill - actually make you feel wealthy?
• Who taught you your current definition of enough, and do you actually agree with it?

Write your own definition of enough, in one sentence, and notice if it's smaller than you expected.`
  },
  {
    day: 11,
    title: "Money Triggers",
    theme: "Reactions",
    prompt: `Certain financial moments hijack your calm reliably - name them so you can see them coming.

• What specific situation - checking your balance, a bill arriving, a money conversation - triggers a strong reaction?
• What's your automatic response in that moment, before you have time to think?
• What would a paused, mindful response look like instead?
• What is this trigger actually protecting you from feeling?

Name the next likely trigger this week and how you'll respond differently.`
  },
  {
    day: 12,
    title: "Financial Habits",
    theme: "Patterns",
    prompt: `Your financial life today is mostly the sum of small habits repeated without much thought.

• Name one financial habit that's genuinely working for you.
• Name one that's quietly working against you.
• What's the smallest possible version of a change to that unhelpful habit?
• What has stopped you from changing it already - convenience, forgetting, resistance?

Take that smallest step today, not next month.`
  },
  {
    day: 13,
    title: "Money & Time",
    theme: "Exchange",
    prompt: `Money and time are constantly being traded for each other, often without you noticing the exchange rate.

• When does spending money actually buy you back meaningful time?
• When does chasing more money cost you time you'll never get back?
• What's one thing you overpay for in time that you could solve with a small amount of money?
• What's one thing you overspend money on that isn't actually buying you anything valuable?

Name one trade you'll rebalance this week - toward time or toward money, whichever you're short on.`
  },
  {
    day: 14,
    title: "Mid-Journey Financial Check",
    theme: "Progress",
    prompt: `Two weeks in - look honestly at what's actually shifted in how you relate to money.

• What insight from the past two weeks has stuck with you the most?
• What's still just as hard or confusing as it was on day one?
• What have you actually done differently, in practice, not just in thought?
• What do you want the next week to focus on?

Name one thing you want to understand better before this journey ends.`
  },
  {
    day: 15,
    title: "Financial Fears",
    theme: "Concerns",
    prompt: `Somewhere under the surface is the money fear that actually keeps you up at night - name it directly.

• What's your biggest financial fear, stated plainly?
• How likely is this scenario, realistically, versus how big it feels emotionally?
• What would actually help you feel more secure - a number, a plan, a conversation?
• Is this fear yours, or one you inherited from someone else's story?

Name one concrete step this week that would make this fear even slightly less powerful.`
  },
  {
    day: 16,
    title: "Money & Purpose",
    theme: "Meaning",
    prompt: `Money stops being just a number once you connect it to something you actually care about.

• What deeper purpose could your financial resources serve, beyond just paying bills?
• What meaningful goal have you been putting off because "the money isn't there yet"?
• How could your current spending shift even slightly to serve what matters most to you?
• What would it feel like to see your paycheck as fuel for something specific, rather than just survival?

Name one goal you'll start directing even a small amount of money toward this month.`
  },
  {
    day: 17,
    title: "Financial Decision-Making",
    theme: "Choices",
    prompt: `Some of your money decisions are deliberate, and some are just reactions dressed up as choices.

• Walk through your last big financial decision - was it reactive or genuinely deliberate?
• What information or feeling did you skip past to make it faster?
• What would a simple, repeatable framework for money decisions look like for you?
• What question should you always ask yourself before a financial choice, that you currently skip?

Write your framework down as three questions you'll actually use next time.`
  },
  {
    day: 18,
    title: "Gratitude & Generosity",
    theme: "Abundance",
    prompt: `Scarcity thinking softens the moment you actually notice what you have and what you're able to give.

• What are you genuinely grateful for in your financial life right now, even if it's imperfect?
• How does naming that gratitude change your mindset about money, even briefly?
• Where does generosity currently show up in your financial life?
• What would it look like to give a little more, without it threatening your own security?

Name one specific act of generosity, big or small, you'll practice this week.`
  },
  {
    day: 19,
    title: "Money Vision",
    theme: "Future",
    prompt: `Picture your relationship with money three years from now, in specific, lived-in detail.

• What's different about how you feel when you check your finances?
• What habits have you kept up consistently to get there?
• What have you stopped doing that currently drains you?
• What's the very first step, available to you now, that starts moving you toward this vision?

Name that first step and when this week you'll take it.`
  },
  {
    day: 20,
    title: "Financial Action Plan",
    theme: "Implementation",
    prompt: `Insight without action just becomes another thing you know but don't do - turn this into a plan.

• Based on everything so far, what 2-3 specific actions would most improve your financial wellbeing?
• What's the actual timeline for each one - not "someday," a real date?
• What obstacle is most likely to derail this plan, and what's your response if it does?
• Who, if anyone, will help keep you accountable to this?

Write the plan down with dates, and put it somewhere you'll actually see it again.`
  },
  {
    day: 21,
    title: "Financial Mindfulness Integration",
    theme: "Wisdom",
    prompt: `Three weeks of paying real attention to money - look back at what's actually different now.

• How has your relationship with money changed since day one, specifically?
• What's the single most valuable insight you're taking with you?
• What still feels unresolved, and how will you keep working on it?
• What daily or weekly practice will keep this mindfulness alive after today?

Write the one sentence about money you most want to remember a year from now.`
  }
];

export const holisticTransformationDays = [
  // MODULE 1: FOUNDATIONS (Days 1-10) - Setting the groundwork
  {
    day: 1,
    title: "Journey Beginning",
    theme: "Intention",
    prompt: `A hundred days is a real commitment - be honest about what's actually pulling you toward it.

• What specifically brought you to start this 100-day journey right now?
• What does "transformation" actually mean to you, beyond the buzzword?
• What are you quietly hoping will be different on day 100?

Name the one hope you're most afraid to say out loud.`
  },
  {
    day: 2,
    title: "Current Reality",
    theme: "Assessment",
    prompt: `Rate yourself honestly before you try to change anything.

• Rate your satisfaction (1-10) across physical health, emotional wellbeing, relationships, career, finances, growth, spirituality.
• Which area scored lowest, and does that match your gut feeling about your life?
• What pattern connects your lowest-scoring areas?

Name the one area you're most ready to actually work on.`
  },
  {
    day: 3,
    title: "Vision Creation",
    theme: "Possibility",
    prompt: `Picture day 100 in vivid, specific detail - not a vague "better," an actual scene.

• What would be visibly different about how you think, feel, and behave?
• What's the first sign on an ordinary day that this transformation actually took?
• What about this vision excites you most?

Name the one detail from this vision you want to hold onto through the hard days.`
  },
  {
    day: 4,
    title: "Values Clarification",
    theme: "Core Principles",
    prompt: `Your transformation needs to be built on values that are actually yours, not borrowed.

• Name your top 5-7 core values.
• Why does each one matter to you personally?
• Which value do you want to embody more fully during this journey?

Name the value that will most guide your choices over the next 100 days.`
  },
  {
    day: 5,
    title: "Limiting Beliefs",
    theme: "Mental Barriers",
    prompt: `A belief you've never questioned might be the very thing standing between you and this transformation.

• What belief about yourself or the world might be holding you back?
• Where did this belief actually originate?
• How might reframing it change what feels possible?

Name the belief you're most ready to challenge starting today.`
  },
  {
    day: 6,
    title: "Strengths Identification",
    theme: "Personal Power",
    prompt: `Whatever you build over the next 100 days will lean on strengths you already have.

• Name your greatest strengths, talents, and positive qualities.
• When do you feel most capable and alive?
• How might these specific strengths support this transformation?

Name the strength you'll lean on hardest in the difficult weeks ahead.`
  },
  {
    day: 7,
    title: "Resource Mapping",
    theme: "Support",
    prompt: `You're not starting from zero - map what you already have access to.

• What people, tools, environments, or practices are already available to support you?
• What additional resource will you actually need to seek out?
• What's stopped you from using existing resources fully already?

Name the one resource you'll activate this week.`
  },
  {
    day: 8,
    title: "Obstacles & Challenges",
    theme: "Preparation",
    prompt: `The obstacles ahead are mostly predictable if you're honest with yourself now.

• What internal and external obstacles are likely to arise during this journey?
• For your biggest one, what's a real strategy, not just good intentions?
• Which obstacle has derailed you before in similar efforts?

Name the obstacle you're most likely to face first.`
  },
  {
    day: 9,
    title: "Learning Modalities",
    theme: "Growth Approach",
    prompt: `You've already grown before - notice what conditions actually made that possible.

• How do you learn and grow most effectively?
• What conditions, from past growth experiences, helped you transform successfully?
• What's different about how you're approaching growth this time?

Name the one condition you'll deliberately recreate during this journey.`
  },
  {
    day: 10,
    title: "Commitment Contract",
    theme: "Dedication",
    prompt: `Ten days of preparation - now put your name on something real.

• What specific promises are you making to yourself for these 100 days?
• How will you hold yourself accountable when motivation dips?
• What would make you actually break this commitment?

Write and sign your commitment contract, dated today.`
  },

  // MODULE 2: MIND MASTERY (Days 11-20) - Mental patterns and thought management
  {
    day: 11,
    title: "Thought Patterns",
    theme: "Awareness",
    prompt: `Just observe your thoughts today, without trying to fix a single one yet.

• What recurring thoughts arose today?
• Which were constructive, and which quietly created suffering?
• What surprised you about the sheer volume of mental noise?

Name the one thought pattern you'll simply keep observing this week, without judgment.`
  },
  {
    day: 12,
    title: "Cognitive Distortions",
    theme: "Thinking Traps",
    prompt: `Certain thinking traps run automatically in your mind - name three of yours.

• Identify three distortions you notice in yourself - all-or-nothing, catastrophizing, mind-reading.
• How does each one affect your emotions and behavior?
• Which one shows up most often in your week?

Name the distortion you'll catch yourself in this week and challenge on the spot.`
  },
  {
    day: 13,
    title: "Mental Reframing",
    theme: "Perspective Shift",
    prompt: `The same situation looks completely different depending on which lens you use.

• Choose a challenging situation you're facing.
• Write about it from three genuinely different perspectives.
• How did your emotional response shift with each one?

Name the reframe that felt most useful, and why.`
  },
  {
    day: 14,
    title: "Mindfulness Practice",
    theme: "Present Awareness",
    prompt: `Ten minutes of just noticing, without trying to change anything.

• What sensations, thoughts, and emotions did you notice during ten minutes of observation?
• What surprised you about your own mind in that window?
• How might regular mindfulness actually support this transformation?

Name the time of day you'll build this practice into.`
  },
  {
    day: 15,
    title: "Self-Talk Patterns",
    theme: "Inner Dialogue",
    prompt: `The way you talk to yourself sets the tone for everything else you attempt.

• What's the tone and content of your most common self-statements?
• How would you speak to a beloved friend facing the same situation?
• What's the gap between those two voices?

Write one sentence you'll say to yourself instead, the next time you're self-critical.`
  },
  {
    day: 16,
    title: "Focus & Attention",
    theme: "Mental Energy",
    prompt: `Where your attention actually goes reveals more than where you say your priorities are.

• Where does your attention naturally drift throughout the day?
• What deserves more of your focus, and what deserves less?
• What's the cost of your current attention habits?

Name the one thing you'll redirect your focus toward this week.`
  },
  {
    day: 17,
    title: "Curiosity Cultivation",
    theme: "Open Mind",
    prompt: `Curiosity dissolves a lot of resistance that judgment only reinforces.

• What topics, questions, or experiences genuinely awaken your curiosity?
• How might approaching this transformation with curiosity change your experience of it?
• Where have you been judging yourself instead of staying curious?

Name the one place you'll swap judgment for curiosity this week.`
  },
  {
    day: 18,
    title: "Mental Triggers",
    theme: "Emotional Reactions",
    prompt: `Certain words or situations reliably set you off - name them plainly.

• What situations, words, or behaviors trigger strong emotional reactions in you?
• What belief or past experience connects to this trigger?
• Which trigger shows up most often in your actual life?

Name the trigger you'll watch for this week, and how you'll respond differently.`
  },
  {
    day: 19,
    title: "Worry Management",
    theme: "Future Thinking",
    prompt: `Most worry is about things you can't actually control - sort yours honestly.

• What worries about the future occupy your mind most?
• For each, is it actually within your control?
• What specific action addresses the part that is controllable?

Name the one worry you're ready to actively let go of.`
  },
  {
    day: 20,
    title: "Mind Mastery Reflection",
    theme: "Integration",
    prompt: `Ten days examining your mental patterns - what's actually different now?

• What insight about your mental patterns surprised you most?
• What specific thought-management practice will you keep?
• What pattern do you still want to work on?

Name the one mental habit you're committing to carry forward.`
  },

  // MODULE 3: EMOTIONAL INTELLIGENCE (Days 21-30) - Emotional awareness and regulation
  {
    day: 21,
    title: "Emotional Vocabulary",
    theme: "Naming Feelings",
    prompt: `A limited emotional vocabulary keeps your inner life blurry - sharpen it.

• List as many emotion words as you can think of.
• Which do you experience most frequently?
• Which are most uncomfortable for you to admit to feeling?

Name the emotion word you'll start using more precisely this week.`
  },
  {
    day: 22,
    title: "Emotion Location",
    theme: "Body Awareness",
    prompt: `Your body has its own map of where feelings live - trace it.

• Where do you physically feel joy, fear, anger, sadness?
• Create a rough body map noting these locations.
• Which location surprised you?

Name the physical cue you'll watch for as an early emotional warning sign.`
  },
  {
    day: 23,
    title: "Emotional Triggers",
    theme: "Reaction Patterns",
    prompt: `Certain people, topics, or unmet needs reliably set off a strong feeling - name them.

• What consistently triggers specific emotional responses in you?
• Is there an unmet need underneath the trigger?
• Which trigger shows up more than once in your week?

Name the trigger you're most ready to understand instead of just react to.`
  },
  {
    day: 24,
    title: "Emotion Regulation",
    theme: "Self-Soothing",
    prompt: `You need a real toolkit for each primary emotion, not just willpower.

• What actually helps you regulate joy, fear, anger, and sadness?
• Which emotion do you currently have no healthy strategy for?
• What new strategy are you curious to try?

Name the strategy you'll test this week.`
  },
  {
    day: 25,
    title: "Emotional Needs",
    theme: "Core Requirements",
    prompt: `Underneath most distress is a need that isn't being met.

• What are your fundamental emotional needs - connection, autonomy, security, purpose?
• How well are these actually being met right now?
• Which unmet need is quietly running the show?

Name the one way you'll address this unmet need this week.`
  },
  {
    day: 26,
    title: "Difficult Emotions",
    theme: "Acceptance",
    prompt: `The emotion you avoid most is usually the one with the most to teach you.

• Choose an emotion you typically avoid or suppress.
• What wisdom might it actually be carrying?
• What would accepting instead of resisting it change?

Let yourself feel it fully for one minute before writing further.`
  },
  {
    day: 27,
    title: "Emotional Cycles",
    theme: "Patterns",
    prompt: `Your emotions probably move in patterns tied to time, work, or relationships - notice the rhythm.

• What cyclical emotional patterns do you notice in your life?
• Are they tied to particular days, times, or situations?
• What would it help to know in advance about this cycle?

Name the pattern you'll track more closely this week.`
  },
  {
    day: 28,
    title: "Joy Cultivation",
    theme: "Positive Emotions",
    prompt: `Joy needs deliberate cultivation just as much as difficulty needs managing.

• What reliably brings you joy, contentment, or peace?
• How much of your week is actually built around this?
• What's stopped you from having more of it?

Name the joyful thing you'll schedule into this week on purpose.`
  },
  {
    day: 29,
    title: "Emotional Intelligence in Relationships",
    theme: "Connection",
    prompt: `How you handle your own and others' emotions shapes every relationship you have.

• How do you navigate emotions in your close relationships?
• What patterns create connection, and which create distance?
• Where do you struggle most to respond well to someone else's feelings?

Name the relationship where you'll practice more emotional attunement this week.`
  },
  {
    day: 30,
    title: "Emotional Intelligence Reflection",
    theme: "Integration",
    prompt: `Ten days examining your emotional landscape - what's actually clearer now?

• What have you learned about your emotional patterns?
• What practice for emotional awareness will you keep?
• What still feels unresolved?

Name the one emotional skill you're committing to keep building.`
  },

  // MODULE 4: BODY WISDOM (Days 31-40) - Physical wellbeing and body awareness
  {
    day: 31,
    title: "Body Relationship",
    theme: "Physical Connection",
    prompt: `The messages you got about your body long ago are still shaping how you treat it today.

• How would you describe your relationship with your body right now?
• What messages did you receive about your body growing up?
• How have these messages shaped your current body image?

Name the message you're most ready to unlearn.`
  },
  {
    day: 32,
    title: "Body Sensations",
    theme: "Physical Awareness",
    prompt: `Scan your whole body and actually notice what's there instead of assuming you already know.

• What sensations do you notice scanning head to toe?
• Where do you feel tension, ease, energy, or depletion?
• What might your body be trying to communicate?

Name the area that's asking for the most attention right now.`
  },
  {
    day: 33,
    title: "Movement Exploration",
    theme: "Physical Expression",
    prompt: `Your body has a preferred way of moving that you may have been ignoring.

• What forms of movement genuinely bring you joy and vitality?
• How does your body actually like to move, versus how you make it move?
• What new movement might you explore during this journey?

Name the movement you'll try this week.`
  },
  {
    day: 34,
    title: "Rest & Recovery",
    theme: "Restoration",
    prompt: `Rest is a skill you're either practicing or neglecting - be honest.

• How well do you honor your body's need for rest?
• What's your actual sleep quality and relaxation practice like?
• How well do you recognize signals of fatigue before you're depleted?

Name the one rest practice you'll prioritize this week.`
  },
  {
    day: 35,
    title: "Nourishment Patterns",
    theme: "Fuel",
    prompt: `Food is doing more to your mood and energy than you probably credit it for.

• What's your actual relationship with food and eating?
• How do different foods affect your energy and mood?
• What shift in nourishment might support this transformation?

Name the one nourishment change you'll experiment with this week.`
  },
  {
    day: 36,
    title: "Physical Environment",
    theme: "Surroundings",
    prompt: `Your surroundings are either supporting your wellbeing or quietly working against it.

• How do your physical surroundings affect your wellbeing?
• Which spaces make you feel most at ease, and which feel tense?
• What change would make your environment more supportive?

Name the one environmental change you'll make this week.`
  },
  {
    day: 37,
    title: "Stress Responses",
    theme: "Tension Patterns",
    prompt: `Your body holds stress somewhere specific - find out where.

• How does your body respond to stress?
• Where do you consistently hold tension?
• What physical practice actually helps you release it?

Name the practice you'll use the next time stress hits.`
  },
  {
    day: 38,
    title: "Pain & Discomfort",
    theme: "Body Messages",
    prompt: `Physical pain is rarely random - it's often trying to tell you something.

• What physical pain or discomfort do you currently experience?
• What might these sensations be communicating?
• How do you typically respond to them - ignore, medicate, address?

Name the one thing you'll do differently in response to this pain.`
  },
  {
    day: 39,
    title: "Energy Management",
    theme: "Vitality",
    prompt: `Your energy has natural rhythms that your schedule probably ignores.

• When do you feel most energized and vital during the day?
• What consistently depletes your energy?
• How might you restructure your day around your natural rhythm?

Name the one schedule change that would honor this rhythm.`
  },
  {
    day: 40,
    title: "Body Wisdom Reflection",
    theme: "Integration",
    prompt: `Ten days paying attention to your body - what's actually different now?

• What have you learned about your body's wisdom?
• What physical practice will you continue?
• What area still needs more attention?

Name the one body practice you're committing to carry forward.`
  },

  // MODULE 5: HABIT REDESIGN (Days 41-50) - Creating supportive routines and breaking patterns
  {
    day: 41,
    title: "Habit Inventory",
    theme: "Pattern Recognition",
    prompt: `List your habits honestly, the helpful and unhelpful both.

• What are your current daily and weekly habits?
• Which genuinely support you, and which quietly work against you?
• Which habit surprised you when you actually wrote it down?

Name the one unsupportive habit you're most ready to address.`
  },
  {
    day: 42,
    title: "Keystone Habits",
    theme: "Foundation Behaviors",
    prompt: `Some habits have outsized effects on everything else - find yours.

• What 2-3 keystone habits would most positively impact your overall wellbeing?
• Why would these specific habits ripple out further than others?
• Which one feels most achievable to start with?

Name the keystone habit you'll focus on first.`
  },
  {
    day: 43,
    title: "Habit Triggers",
    theme: "Cues",
    prompt: `Every habit, wanted or unwanted, runs on a cue - identify yours.

• For a habit you want to change, what triggers the current behavior?
• For a habit you want to build, what reliable cue could you establish?
• What time or location would make the best trigger?

Name the specific cue you'll set up this week.`
  },
  {
    day: 44,
    title: "Morning Routine",
    theme: "Day Foundation",
    prompt: `How you start the day quietly sets the tone for everything after.

• What would your ideal morning routine include?
• What specific elements would set a tone of intention and vitality?
• What's the gap between this ideal and your actual mornings?

Name the one element you'll add to your mornings this week.`
  },
  {
    day: 45,
    title: "Evening Routine",
    theme: "Closure",
    prompt: `How you end the day shapes how well you rest and how you start the next one.

• What would your ideal evening routine include?
• What elements would support reflection, rest, and preparation for tomorrow?
• What currently disrupts a good evening routine?

Name the one evening element you'll add this week.`
  },
  {
    day: 46,
    title: "Habit Obstacles",
    theme: "Friction Points",
    prompt: `Something specific keeps interrupting your desired habits - name it.

• What internal and external obstacles interfere with your desired habits?
• For your biggest obstacle, what's a specific workaround?
• What obstacle has derailed you the most times before?

Name your strategy for the obstacle most likely to hit this week.`
  },
  {
    day: 47,
    title: "Habit Support Systems",
    theme: "Scaffolding",
    prompt: `Your environment and relationships can either scaffold your habits or undermine them.

• What environmental or social supports could help your new habits stick?
• How might you redesign your space, schedule, or relationships to reinforce this change?
• Who could actively support this without you having to explain everything?

Name the one support you'll put in place this week.`
  },
  {
    day: 48,
    title: "Weekly Planning",
    theme: "Intentional Time",
    prompt: `A week without a plan tends to default to old patterns.

• What would a weekly planning process actually look like for you?
• How will you review the past week honestly?
• What will you intentionally design for the coming week?

Name the day and time you'll do this weekly review.`
  },
  {
    day: 49,
    title: "Habit Tracking",
    theme: "Measurement",
    prompt: `What doesn't get tracked tends to quietly slip.

• What simple system will you use to track your key habits?
• How will you measure progress and celebrate consistency?
• What will you do when you notice yourself falling behind?

Set up your tracking system today.`
  },
  {
    day: 50,
    title: "Habit Redesign Reflection",
    theme: "Integration",
    prompt: `Ten days redesigning your habits - what's actually different now?

• What insight about your habits surprised you most?
• What specific habit change will you focus on next?
• What's working better than expected?

Name the habit you're most committed to carrying forward.`
  },

  // MODULE 6: RELATIONSHIP DYNAMICS (Days 51-60) - Interpersonal connections and patterns
  {
    day: 51,
    title: "Relationship Mapping",
    theme: "Connection Inventory",
    prompt: `Map your relationships with yourself at the center and notice the pattern in how close things sit.

• Place yourself at the center, with concentric circles for closeness - who goes where?
• What pattern do you notice in how you connect with people?
• Who is closer or further than you'd actually like?

Name the one relationship you'd like to move inward.`
  },
  {
    day: 52,
    title: "Communication Patterns",
    theme: "Expression",
    prompt: `How you say - or don't say - what you need shapes everything downstream.

• How do you typically communicate needs, boundaries, and feelings?
• When are you most clear and authentic?
• When do you struggle most to communicate?

Name the relationship where you'll practice clearer expression this week.`
  },
  {
    day: 53,
    title: "Listening Practices",
    theme: "Reception",
    prompt: `Rate your listening honestly, not how you'd like it to be.

• How would you actually rate your listening skills?
• When do you listen deeply, and when do you plan your response instead?
• What would deeper listening look like in practice?

Name the conversation where you'll practice this deliberately.`
  },
  {
    day: 54,
    title: "Relationship Needs",
    theme: "Connection Requirements",
    prompt: `What you actually need from closeness is more specific than "to feel loved."

• What do you most need in close relationships - autonomy, understanding, support?
• How well are these needs currently being met?
• Which need have you never actually voiced?

Name the person you'll voice this need to.`
  },
  {
    day: 55,
    title: "Conflict Patterns",
    theme: "Tension Navigation",
    prompt: `Your conflict style was likely inherited before you ever chose it.

• How do you typically respond to interpersonal conflict?
• What pattern did you inherit from your family of origin?
• Where does this pattern help you, and where does it hurt you?

Name the conflict habit you'll try to interrupt next time.`
  },
  {
    day: 56,
    title: "Boundaries",
    theme: "Healthy Limits",
    prompt: `Some boundaries are solid, and some need real reinforcing.

• Where are your boundaries strong, and where do they need strengthening?
• Consider physical, emotional, time, and energy boundaries specifically.
• What makes boundary-setting hardest for you?

Name the boundary you'll strengthen this week.`
  },
  {
    day: 57,
    title: "Trust Dynamics",
    theme: "Safety & Vulnerability",
    prompt: `Trust and vulnerability are built the same way, brick by brick, or broken the same way, all at once.

• What builds and breaks trust for you specifically?
• What past experience shaped your ability to trust and be vulnerable?
• Where is trust strong right now, and where is it fragile?

Name the relationship where you'll take one small trust-building risk.`
  },
  {
    day: 58,
    title: "Forgiveness Exploration",
    theme: "Releasing Resentment",
    prompt: `Resentment held onto quietly costs you more than the person who hurt you.

• Where are you holding resentment or hurt in a relationship?
• What might forgiveness look like here, practically?
• What step could begin that healing process?

Name the smallest step toward forgiveness available to you now.`
  },
  {
    day: 59,
    title: "Community & Belonging",
    theme: "Collective Connection",
    prompt: `Belonging doesn't happen by accident - it's cultivated deliberately.

• Where do you experience real belonging and community?
• What group shares your values in a way that feels nourishing?
• How might you deepen connection with a group like this?

Name the community you'll invest more in this month.`
  },
  {
    day: 60,
    title: "Relationship Dynamics Reflection",
    theme: "Integration",
    prompt: `Ten days examining your relational patterns - take honest stock.

• What pattern have you discovered in your relationships this week?
• What specific change in your approach to connection will you implement?
• What relationship needs the most attention going forward?

Name the one relational practice you're carrying forward.`
  },

  // MODULE 7: MEANING & PURPOSE (Days 61-70) - Life direction and significance
  {
    day: 61,
    title: "Sources of Meaning",
    theme: "Significance",
    prompt: `Meaning shows up in specific moments - find where it actually lives for you.

• When have you felt a deep sense of meaning or purpose?
• What activity, relationship, or contribution created that feeling?
• How often does your current life include this?

Name the source of meaning you'll seek out more this month.`
  },
  {
    day: 62,
    title: "Values in Action",
    theme: "Living Principles",
    prompt: `Your values are either showing up in your daily choices or just sitting on a shelf.

• How are your core values expressed through your actual daily actions?
• Where do you see genuine alignment, and where's the gap?
• Which value is most neglected in practice?

Name the one action that would close this gap.`
  },
  {
    day: 63,
    title: "Legacy Consideration",
    theme: "Impact",
    prompt: `What you want to leave behind is worth deciding on purpose, not by default.

• What impact do you want to have on the world and those around you?
• How do you want to be remembered?
• What are you currently doing that builds toward this?

Name the one action this month that builds toward this legacy.`
  },
  {
    day: 64,
    title: "Work & Contribution",
    theme: "Service",
    prompt: `Your work either channels your purpose or just consumes your hours.

• How does your work align with your sense of purpose?
• What would make your work feel more meaningful?
• What's the biggest mismatch right now?

Name the one shift that would increase this alignment.`
  },
  {
    day: 65,
    title: "Life Mission",
    theme: "Core Purpose",
    prompt: `A mission statement forces clarity that vague good intentions never will.

• If you crafted a personal mission statement, what would it say?
• What central purpose could guide choices across different areas of your life?
• Does this purpose feel true, or aspirational?

Write your draft mission statement in one sentence.`
  },
  {
    day: 66,
    title: "Ikigai Exploration",
    theme: "Purposeful Intersection",
    prompt: `Somewhere your love, your skill, the world's need, and reward actually overlap.

• Where do what you love, what you're good at, what the world needs, and what you're rewarded for intersect?
• Which of these four is currently weakest in your life?
• What would strengthening it look like?

Name the one step toward this intersection you'll take this month.`
  },
  {
    day: 67,
    title: "Spiritual Connection",
    theme: "Transcendence",
    prompt: `Whatever connects you to something larger deserves deliberate space, not just occasional access.

• What practices or beliefs connect you to something larger than yourself?
• How often do you actually make room for this?
• What's stopped you from deepening this connection?

Name the practice you'll return to this month.`
  },
  {
    day: 68,
    title: "Creativity & Expression",
    theme: "Authentic Voice",
    prompt: `Creative expression carries meaning that logic alone can't reach.

• How does creative expression bring meaning to your life?
• What form of creativity feels most authentically yours?
• How much room does your current life actually give it?

Name the creative practice you'll make room for this month.`
  },
  {
    day: 69,
    title: "Growth & Learning",
    theme: "Evolution",
    prompt: `Purpose deepens when you keep learning, not when you stay static.

• How does personal growth contribute to your sense of purpose?
• What area of development is calling to you right now?
• What's stopped you from pursuing it?

Name the one thing you'll start learning this month.`
  },
  {
    day: 70,
    title: "Meaning & Purpose Reflection",
    theme: "Integration",
    prompt: `Ten days examining meaning - what's actually clearer now?

• What insight about your life's purpose has emerged?
• How will you align your daily life more closely with this?
• What still feels unresolved about your purpose?

Name the one purpose-aligned action you're committing to.`
  },

  // MODULE 8: PROFESSIONAL DEVELOPMENT (Days 71-80) - Career and work life
  {
    day: 71,
    title: "Career Assessment",
    theme: "Professional Inventory",
    prompt: `Rate your work life honestly across more than just salary.

• How satisfied are you with your professional life - values alignment, strengths use, relationships, compensation, growth, impact?
• Which area scored lowest?
• Does this match your gut sense of your career?

Name the one professional area you're most ready to address.`
  },
  {
    day: 72,
    title: "Professional Strengths",
    theme: "Work Capabilities",
    prompt: `Your best professional qualities are probably underused right now.

• What are your greatest professional strengths and talents?
• When do you feel most capable and valuable at work?
• How might you leverage these strengths further?

Name the strength you'll deliberately use more this month.`
  },
  {
    day: 73,
    title: "Growth Edges",
    theme: "Development Areas",
    prompt: `One skill, developed further, would meaningfully change your professional trajectory.

• What skill or capability would you like to develop professionally?
• What growth area would most enhance your effectiveness and satisfaction?
• What's stopped you from developing it already?

Name the first step toward developing this skill.`
  },
  {
    day: 74,
    title: "Work Relationships",
    theme: "Professional Connections",
    prompt: `Your work relationships shape your daily experience more than the work itself sometimes.

• How would you describe your relationships with colleagues, supervisors, or clients?
• What pattern creates connection, and what creates tension?
• Which work relationship needs the most attention?

Name the one action you'll take to improve it.`
  },
  {
    day: 75,
    title: "Professional Environment",
    theme: "Work Context",
    prompt: `Your surroundings at work are either helping or quietly draining you.

• How does your work environment affect your productivity, creativity, and wellbeing?
• Consider physical space, culture, and structure specifically.
• What change would most enhance your experience?

Name the one environmental change you'll pursue.`
  },
  {
    day: 76,
    title: "Work Boundaries",
    theme: "Professional Limits",
    prompt: `The line between work and everything else may be more blurred than you realize.

• How effectively do you maintain boundaries between work and personal life?
• Where does this boundary break down most often?
• What adjustment would create healthier integration?

Name the one work boundary you'll enforce this week.`
  },
  {
    day: 77,
    title: "Career Vision",
    theme: "Professional Future",
    prompt: `Picture your professional life 3-5 years out, in specific detail.

• What would your ideal professional life look like then?
• What specific step could move you toward this vision now?
• What's the biggest obstacle between here and there?

Name the first concrete step you'll take this month.`
  },
  {
    day: 78,
    title: "Leadership Approach",
    theme: "Influence",
    prompt: `You influence people at work whether or not you have the title for it.

• How do you express leadership, regardless of formal role?
• What's your natural leadership style?
• Where do you hold back from influence you could rightfully claim?

Name the one way you'll step into more leadership this month.`
  },
  {
    day: 79,
    title: "Productivity & Focus",
    theme: "Effective Work",
    prompt: `Some conditions make you dramatically more effective - notice which.

• When are you most productive and focused at work?
• What conditions or habits maximize your effectiveness?
• How might you create more of these optimal conditions?

Name the one condition you'll build into your week.`
  },
  {
    day: 80,
    title: "Professional Development Reflection",
    theme: "Integration",
    prompt: `Ten days examining your professional life - what's actually clearer now?

• What insight about your work life surprised you?
• What specific change will you implement to enhance your experience?
• What still needs more attention?

Name the one professional change you're committing to.`
  },

  // MODULE 9: RESILIENCE BUILDING (Days 81-90) - Developing inner strength and adaptability
  {
    day: 81,
    title: "Adversity Inventory",
    theme: "Challenge Assessment",
    prompt: `You've already survived real difficulty - take that seriously.

• What significant challenges have you faced?
• How did you navigate them?
• What strength or coping strategy emerged from these experiences?

Name the strength you'll lean on again soon.`
  },
  {
    day: 82,
    title: "Stress Response",
    theme: "Pressure Reactions",
    prompt: `Notice exactly what happens in you under pressure, not what you wish happened.

• How do you typically respond to stress - thoughts, emotions, behaviors?
• Which responses genuinely serve you, and which don't?
• What's your very first reaction, before you have time to think?

Name the response you'd like to change first.`
  },
  {
    day: 83,
    title: "Recovery Practices",
    theme: "Restoration",
    prompt: `What actually helps you bounce back, versus what you think should help?

• What helps you recover from stress, setbacks, or difficult experiences?
• Which practice do you neglect even though you know it helps?
• What's stopped you from prioritizing it?

Name the recovery practice you'll commit to this week.`
  },
  {
    day: 84,
    title: "Support Network",
    theme: "Connection Resources",
    prompt: `Who actually shows up for you during hard times - name them specifically.

• Who comprises your support network during challenges?
• How do you typically reach out for support?
• Where are the gaps in this network?

Name the one way you'll strengthen this network this month.`
  },
  {
    day: 85,
    title: "Meaning Making",
    theme: "Narrative Construction",
    prompt: `The story you tell about your hardest experiences shapes what they mean going forward.

• How do you make meaning from difficult experiences?
• How have past challenges been integrated into your life story?
• What meaning might you create from a current challenge?

Name the reframe you're most ready to try.`
  },
  {
    day: 86,
    title: "Adaptability",
    theme: "Flexible Response",
    prompt: `Plans change - notice how gracefully or poorly you actually adapt.

• How adaptable are you when plans change or expectations aren't met?
• What helps you adjust to new circumstances?
• What makes adaptation harder for you specifically?

Name the situation this week where you'll practice more flexibility.`
  },
  {
    day: 87,
    title: "Inner Resources",
    theme: "Personal Strengths",
    prompt: `Certain inner qualities have carried you through before - name them.

• What inner resources help you navigate challenging times - patience, courage, humor, faith?
• Which have you underused recently?
• How might you lean on this resource more deliberately?

Name the inner resource you'll draw on this week.`
  },
  {
    day: 88,
    title: "Failure Relationship",
    theme: "Learning from Setbacks",
    prompt: `Your relationship with failure shapes how much you're willing to risk.

• How do you relate to failure and setbacks?
• When has a failure ultimately led to growth or unexpected good?
• How might you reframe your relationship with failure going forward?

Name the failure you're ready to see differently.`
  },
  {
    day: 89,
    title: "Future Challenges",
    theme: "Preparation",
    prompt: `Some challenges ahead are predictable enough to prepare for now.

• What challenges might you face in the coming months or years?
• How might you proactively prepare for these?
• What resource or skill would help most?

Name the one preparation step you'll take this month.`
  },
  {
    day: 90,
    title: "Resilience Building Reflection",
    theme: "Integration",
    prompt: `Ten days examining resilience - what's actually clearer now?

• What have you learned about your own resilience?
• What practice or mindset will you cultivate going forward?
• What challenge feels more manageable now than it did before?

Name the one resilience practice you're committing to.`
  },

  // MODULE 10: INTEGRATION & FUTURE VISION (Days 91-100) - Synthesizing learning and planning forward
  {
    day: 91,
    title: "Transformation Review",
    theme: "Journey Assessment",
    prompt: `Ninety days behind you - look at the whole arc honestly.

• What's been most significant about your insights, changes, or growth?
• What's genuinely shifted in how you think, feel, or behave?
• What surprised you the most about this process?

Name the one shift you're proudest of.`
  },
  {
    day: 92,
    title: "Integration Challenges",
    theme: "Growth Obstacles",
    prompt: `Some of what you've learned hasn't fully made it into your daily life yet.

• What aspect of your transformation has been hardest to integrate?
• What resistance or obstacle have you encountered?
• What would help this actually stick?

Name the one integration challenge you'll address directly.`
  },
  {
    day: 93,
    title: "Success Celebration",
    theme: "Achievement Recognition",
    prompt: `Ninety days of real effort deserves actual acknowledgment, not a quick dismissal.

• What specific successes from this journey deserve celebration?
• What does this reveal about your commitment and courage?
• Why is it hard to fully receive this acknowledgment?

Do something today to actually mark this progress.`
  },
  {
    day: 94,
    title: "Identity Evolution",
    theme: "Self-Concept",
    prompt: `You are, in some real way, not who you were on day one.

• How has your sense of identity evolved during this journey?
• What new way of seeing yourself has emerged?
• What old self-concept have you outgrown?

Finish the sentence: "I used to see myself as ___, and now I see myself as ___."`
  },
  {
    day: 95,
    title: "Wisdom Distillation",
    theme: "Key Learnings",
    prompt: `Distill a hundred days into something small enough to actually carry.

• What are the five key insights or principles from this entire journey?
• Which one surprised you the most?
• How will these serve as guideposts going forward?

Write these five insights down somewhere you'll actually see them again.`
  },
  {
    day: 96,
    title: "Ongoing Practices",
    theme: "Sustainability",
    prompt: `The structure of this journey ends soon - the practices need to survive without it.

• What specific practices from this journey will you continue?
• How will you sustain them once the formal structure ends?
• What's most likely to cause them to quietly fade?

Name the system that will keep these practices alive.`
  },
  {
    day: 97,
    title: "One-Year Vision",
    theme: "Near Future",
    prompt: `Building on this foundation, picture a year from now in concrete detail.

• What will be different in how you live, relate, work, and experience yourself?
• What's the first milestone you'd notice along the way?
• What needs to start now for this to become real?

Name the one thing that needs to begin this month.`
  },
  {
    day: 98,
    title: "Five-Year Vision",
    theme: "Extended Horizon",
    prompt: `Five years of continuing to apply what you've learned - what unfolds?

• What possibilities might open up if you keep applying these insights?
• What would surprise your current self about this future?
• What decision today most shapes whether this becomes real?

Name that decision.`
  },
  {
    day: 99,
    title: "Continuation Plan",
    theme: "Next Steps",
    prompt: `This journey ends, but your growth doesn't have to.

• What area will you focus on next, after these 100 days?
• What structure will support your continued transformation?
• What have you learned about what actually works for you?

Write your continuation plan as a concrete next step.`
  },
  {
    day: 100,
    title: "Full Circle Integration",
    theme: "Completion",
    prompt: `Day 100 - look back at day 1's hopes and take honest stock.

• What has been fulfilled from your original intentions?
• What surprised you most across this entire journey?
• What will you carry forward as you begin your next chapter?

Write the one sentence you want to remember from this hundred-day journey.`
  }
];

// Add these three new journey arrays to your JourneyData.js file

// 1. MANIFESTATION & REALITY CREATION (33 days, Text, Intermediate)
export const manifestationRealityDays = [
  {
    day: 1,
    title: "Setting Your Manifestation Foundation",
    theme: "Foundation",
    prompt: `Before you try to create anything, look honestly at what you actually believe is possible for you.

• What does manifestation genuinely mean to you, in your own words?
• What do you want to create in your life that you haven't said out loud?
• What belief is quietly stopping you from thinking it's actually possible?

Name the one belief you're most ready to question starting today.`
  },
  {
    day: 2,
    title: "Identifying Your Deepest Desires",
    theme: "Clarity",
    prompt: `Skip the surface wants and dig for what your deeper self is actually asking for.

• Beyond immediate wants, what does your deepest self truly desire to experience?
• What do you want to feel more than what you want to have?
• Why does this desire matter to you, underneath the "how"?

Name the desire that feels most true, even if it scares you a little.`
  },
  {
    day: 3,
    title: "Examining Your Relationship with Abundance",
    theme: "Abundance",
    prompt: `Notice where scarcity has quietly set the rules in how you think about love, money, or opportunity.

• How do you relate to abundance in its different forms - money, love, opportunity, joy?
• What scarcity belief shows up most often in your thinking?
• Where did this belief likely come from?

Name the one abundance block you're most ready to challenge.`
  },
  {
    day: 4,
    title: "Present Moment Awareness",
    theme: "Presence",
    prompt: `Real creation starts with actually seeing what's already here, not just what's missing.

• Describe your current reality with real gratitude and detail.
• What piece of your dream life is already present, even in small form?
• What have you been overlooking because you're focused on what's not here yet?

Name the one thing already present that deserves more appreciation.`
  },
  {
    day: 5,
    title: "Energy and Vibration Check-In",
    theme: "Energy",
    prompt: `Notice what you're actually putting out today, not what you wish you were putting out.

• How does your energy genuinely feel right now - your emotions, your body, your overall state?
• What's shaping this energy today?
• What are you putting out into your interactions, whether you mean to or not?

Name the one small shift that would improve your energy today.`
  },
  {
    day: 6,
    title: "Vision Clarity Session",
    theme: "Vision",
    prompt: `Get specific enough about your ideal life that it stops being a vague wish.

• What does a typical day in this life actually look like, hour by hour?
• How do you feel throughout that day?
• Who is around you, and what are you doing?

Name the one detail from this vision that feels most alive to you.`
  },
  {
    day: 7,
    title: "Removing Internal Obstacles",
    theme: "Obstacles",
    prompt: `Something inside you is quietly working against what you say you want.

• What internal belief, fear, or pattern might be blocking your progress?
• Where does this resistance actually come from?
• What would it cost you to let this obstacle go?

Name the one obstacle you're ready to face directly this week.`
  },
  {
    day: 8,
    title: "Aligned Action Planning",
    theme: "Action",
    prompt: `Notice the difference between action that feels forced and action that feels alive.

• What inspired action could you take toward your vision this week?
• How is this different from action that feels desperate or forced?
• What's stopped you from taking this action already?

Take that aligned action today, not next week.`
  },
  {
    day: 9,
    title: "Gratitude Amplification",
    theme: "Gratitude",
    prompt: `Even the hard parts of this process deserve genuine gratitude.

• What are you grateful for in your manifestation journey so far, including the difficult parts?
• What challenge has actually helped you grow?
• How does gratitude shift your energy right now, in this moment?

Name the one thing you're most surprised to feel grateful for.`
  },
  {
    day: 10,
    title: "Signs and Synchronicities",
    theme: "Synchronicity",
    prompt: `Notice what's been quietly lining up around you that you might have brushed past.

• What signs, synchronicities, or meaningful coincidences have you noticed lately?
• What might these be responding to in your own intentions?
• Which one felt too specific to be random?

Name the synchronicity you'll pay closer attention to this week.`
  },
  {
    day: 11,
    title: "Embodying Your Future Self",
    theme: "Embodiment",
    prompt: `Write today as if the version of you who already has this has taken over the pen.

• How would your future self - who has already manifested this vision - think and feel?
• How would they move through today differently than you are?
• What would they tell you about the doubt you're currently carrying?

Do one thing today the way that future self would do it.`
  },
  {
    day: 12,
    title: "Relationship with Timing",
    theme: "Timing",
    prompt: `The gap between wanting something and having it is where most people give up - notice how you handle it.

• How do you typically handle the gap between intention and result?
• Where do you struggle most with trusting the timing of things?
• What would it look like to hold your vision loosely instead of anxiously?

Name the one area where you're most impatient right now.`
  },
  {
    day: 13,
    title: "Community and Support",
    theme: "Community",
    prompt: `Who around you actually believes in what you're building, and who quietly doesn't?

• Who genuinely supports your growth and your vision?
• Who, even unintentionally, dampens your belief in it?
• How could you surround yourself with more of the former?

Name one person you'll lean on more this week.`
  },
  {
    day: 14,
    title: "Mid-Journey Integration",
    theme: "Integration",
    prompt: `Two weeks in - notice what's actually shifted in how you think and feel.

• What insight from this journey has stuck with you most?
• What's different about your energy compared to day one?
• What's still hard to believe, even now?

Name the one shift you want to deepen in the coming weeks.`
  },
  {
    day: 15,
    title: "Releasing Control",
    theme: "Surrender",
    prompt: `Notice where you're gripping the outcome instead of trusting the process.

• Where are you trying to control exactly how this unfolds?
• What would it feel like to hold the vision while releasing the "how"?
• What's the fear underneath your need for control here?

Name the one thing you're ready to release your grip on this week.`
  },
  {
    day: 16,
    title: "Worthiness and Deserving",
    theme: "Worthiness",
    prompt: `Notice if you actually believe you deserve what you're trying to create.

• Do you genuinely believe you deserve this, or are you secretly bracing for it not to work?
• Where does this doubt about your worthiness come from?
• What would you tell a friend who felt this same doubt?

Write one sentence affirming your worthiness that you actually believe, even a little.`
  },
  {
    day: 17,
    title: "Financial Flow and Abundance",
    theme: "Financial",
    prompt: `If money weren't a limiting factor, notice what you'd actually build.

• If money were no object, what would you create?
• What does this reveal about your relationship with money as energy?
• Where does scarcity thinking still limit your financial vision?

Name the one financial belief you're ready to update.`
  },
  {
    day: 18,
    title: "Creative Expression of Vision",
    theme: "Creativity",
    prompt: `Give your vision a more playful outlet than just words on a page.

• How could you creatively express your vision - art, movement, collage, sound?
• What would bringing more play into this process actually look like?
• What's stopped you from making this more creative already?

Try one creative expression of your vision this week.`
  },
  {
    day: 19,
    title: "Health and Vitality Manifestation",
    theme: "Health",
    prompt: `Your physical vitality is part of the foundation this vision needs to stand on.

• How does your physical health currently support or undermine your goals?
• What would more energy and vitality actually enable in your life?
• What's one health habit that would meaningfully support this vision?

Name the one vitality practice you'll commit to this week.`
  },
  {
    day: 20,
    title: "Relationship Manifestation",
    theme: "Relationships",
    prompt: `Get specific about the kind of connection you actually want to call in.

• What kind of relationships do you want more of in your life?
• What quality matters most in these connections?
• What have you been settling for that doesn't match this vision?

Name the one relationship pattern you're ready to stop settling for.`
  },
  {
    day: 21,
    title: "Career and Purpose Alignment",
    theme: "Purpose",
    prompt: `Notice the gap between your work life and the vision you're building.

• How could your work align more closely with this manifestation vision?
• What would purpose and abundance actually look like through your work?
• What's the biggest mismatch right now?

Name the one shift that would close this gap.`
  },
  {
    day: 22,
    title: "Environmental Support",
    theme: "Environment",
    prompt: `Your physical space is either quietly supporting this vision or working against it.

• How does your current environment support or contradict what you're manifesting?
• What would a space aligned with this vision actually look like?
• What's one change you could make to your space this week?

Make that one change today.`
  },
  {
    day: 23,
    title: "Seasonal Manifestation Cycles",
    theme: "Cycles",
    prompt: `Notice whether you're working with the natural rhythm you're in, or against it.

• What season, literal or metaphorical, are you currently in?
• How might this rhythm actually support your process, rather than obstruct it?
• Where have you been fighting your current cycle instead of moving with it?

Name the one way you'll cooperate with this cycle this week.`
  },
  {
    day: 24,
    title: "Past Success Integration",
    theme: "Success",
    prompt: `You've already manifested things before - notice what actually worked.

• Recall a time you successfully brought a desire into reality.
• What pattern or approach made that possible?
• How could you apply that same approach now?

Name the one past success habit you'll bring back into this process.`
  },
  {
    day: 25,
    title: "Fear Transformation",
    theme: "Fear",
    prompt: `Notice what actually scares you about receiving what you want.

• What fear arises when you imagine actually having this?
• What would change about your identity or responsibilities if you got it?
• How might you transform this fear into preparation instead of avoidance?

Name the one fear you're ready to face directly.`
  },
  {
    day: 26,
    title: "Service and Contribution",
    theme: "Service",
    prompt: `Notice how your personal desires connect to something bigger than just you.

• How does what you're manifesting serve others, not just yourself?
• What bigger purpose sits underneath this personal desire?
• Does connecting it to service make it feel more or less urgent?

Name the one way this vision could serve someone beyond you.`
  },
  {
    day: 27,
    title: "Intuition and Inner Guidance",
    theme: "Intuition",
    prompt: `Notice how much you actually trust your own inner signal versus outside noise.

• How does your intuition currently guide this process?
• When have you ignored a strong inner nudge, and what happened?
• What would strengthening this connection actually look like?

Name the one intuitive nudge you're going to follow this week.`
  },
  {
    day: 28,
    title: "Celebration and Appreciation",
    theme: "Celebration",
    prompt: `Notice whether you actually celebrate progress, or just rush past it toward the next goal.

• What win, big or small, from this journey deserves real celebration?
• How do you typically respond to your own progress - do you dismiss it?
• What would genuinely celebrating this look like?

Celebrate that win today, out loud if you can.`
  },
  {
    day: 29,
    title: "Integration and Sustainability",
    theme: "Sustainability",
    prompt: `Notice what would make this a lasting practice instead of a short burst of effort.

• What would make manifestation a sustainable part of your life, not a one-time event?
• Which practice from this journey is worth keeping long-term?
• What's likely to cause this practice to fade once the structure ends?

Name the system that will keep this practice alive.`
  },
  {
    day: 30,
    title: "Quantum Leaps and Expansion",
    theme: "Expansion",
    prompt: `Notice what becomes possible once you stop capping your imagination at "realistic."

• What bigger leap is possible for you that you've been dismissing as unrealistic?
• What would it take to expand beyond your current comfort zone?
• What's actually stopping you from imagining bigger?

Name the one leap you're willing to seriously consider now.`
  },
  {
    day: 31,
    title: "Legacy and Long-term Vision",
    theme: "Legacy",
    prompt: `Notice how what you're creating connects to something that outlasts you.

• How does what you're manifesting contribute to a legacy you actually care about?
• What long-term impact matters most to you here?
• Does your current daily practice actually point toward this?

Name the one adjustment that would align your daily actions with this legacy.`
  },
  {
    day: 32,
    title: "Final Integration and Wisdom",
    theme: "Wisdom",
    prompt: `Look back at this whole journey and pull out what actually matters.

• What wisdom have you genuinely gained about creating your reality?
• Which insight surprised you the most?
• How will this wisdom guide your ongoing practice?

Write your top insight down somewhere you'll actually see it again.`
  },
  {
    day: 33,
    title: "Commitment to Continued Creation",
    theme: "Commitment",
    prompt: `Thirty-three days end here, but the practice doesn't have to.

• How will you continue applying what you've learned in daily life?
• What would staying aligned with your creative power actually require?
• What would make you quietly abandon this practice, and how will you prevent that?

Write your commitment to yourself, dated today.`
  }
];

// 2. DECISION-MAKING COMPASS (14 days, Text, Beginner)
export const decisionCompassDays = [
  {
    day: 1,
    title: "Your Current Decision-Making Style",
    theme: "Self-Awareness",
    prompt: `Before you can improve how you decide, you need an honest look at how you're actually deciding right now.

• Walk through your last significant decision - what did you actually lean on: logic, gut feeling, someone else's opinion?
• Which of these do you trust the least, and why?
• What's a decision-making habit that's served you well more than once?
• What's one that's quietly gotten you into trouble more than once?

Name the decision-making pattern you're most ready to change.`
  },
  {
    day: 2,
    title: "Values-Based Decision Framework",
    theme: "Values",
    prompt: `Most decisions get harder than they need to be because your values aren't actually steering.

• Name your core values, without the words that just sound good on paper.
• Pick a decision you're facing right now - which value should be deciding it?
• How would your choice change if you honored that value first, before convenience or fear?
• What's a past decision you'd make differently if you'd led with values instead of pressure?

Name the value you'll consciously lead with on your next decision this week.`
  },
  {
    day: 3,
    title: "Intuition vs. Logic Balance",
    theme: "Balance",
    prompt: `Somewhere recently your gut and your spreadsheet disagreed - that conflict is worth examining closely.

• Recall a decision where intuition and logic pulled you in different directions. What happened?
• Which one did you ultimately trust, and how did that turn out?
• What does your body actually do when something is genuinely right for you - versus when it's wrong?
• Are you someone who overrides intuition with logic, or the reverse? What's that cost you?

Name one current decision where you'll deliberately listen to both before choosing.`
  },
  {
    day: 4,
    title: "Fear-Based vs. Love-Based Choices",
    theme: "Motivation",
    prompt: `Look at a decision you're facing right now and ask what's actually driving each option.

• Are your current options motivated by avoiding something, or moving toward something?
• Which option would you pick if fear weren't in the room at all?
• What exactly are you afraid would happen if you chose the "love-based" option instead?
• Has fear ever actually protected you here, or has it just been loud?

Name which motivation - fear or desire - you'll let lead this specific decision.`
  },
  {
    day: 5,
    title: "The Cost of Indecision",
    theme: "Consequences",
    prompt: `Not deciding is still a decision, and it usually has a price you haven't tallied yet.

• Recall a time you delayed a decision. What did the waiting actually cost you - time, opportunity, peace of mind?
• What decision are you currently avoiding, and what is the delay costing you right now, today?
• How does unresolved indecision show up in your energy or your relationships?
• What are you actually protecting by staying undecided?

Name the deadline you'll set for yourself on the decision you're currently avoiding.`
  },
  {
    day: 6,
    title: "Future Self Consultation",
    theme: "Perspective",
    prompt: `Someone five years ahead of you already knows how this decision turns out - consult them.

• Imagine yourself five years from now, looking back at the decision you're facing today. What do they say?
• What would that future self regret not having tried?
• What would they tell you to stop overthinking?
• Does their perspective make the decision feel bigger or smaller than it currently feels?

Write one piece of advice from your future self that you'll actually act on this week.`
  },
  {
    day: 7,
    title: "External Influences and Pressure",
    theme: "Boundaries",
    prompt: `Other people's expectations have a way of quietly steering your choices without ever being named out loud.

• Who or what is currently influencing this decision - family, culture, someone's unspoken expectation?
• What would you choose if that influence weren't in the room?
• How much of your hesitation is really about their reaction rather than your own judgment?
• What would it look like to honor their input without handing them the final vote?

Name the one boundary you need to hold here, even if it disappoints someone.`
  },
  {
    day: 8,
    title: "Decision-Making in Uncertainty",
    theme: "Uncertainty",
    prompt: `You will probably never have all the information you want before this decision is due - work with that.

• What decision are you stalling on because you don't have complete information?
• What information could you realistically get, and what will simply never be knowable in advance?
• How comfortable are you, generally, moving forward without a guarantee?
• What's the actual worst case if you decide now and you're wrong?

Name the next step you'll take on this decision despite the uncertainty.`
  },
  {
    day: 9,
    title: "Small Daily Choices Matter",
    theme: "Daily Practice",
    prompt: `The big decision you're wrestling with is being shaped daily by dozens of small ones you barely notice.

• What routine choices this week were made on autopilot rather than intention?
• Which small daily decisions actually align with your bigger goals?
• Which ones quietly work against them?
• What's one small choice you could make more consciously starting tomorrow?

Name the one daily decision you'll bring deliberate attention to this week.`
  },
  {
    day: 10,
    title: "Learning from Past Decisions",
    theme: "Learning",
    prompt: `A decision that didn't go as planned still has something to teach you, if you can look at it without flinching.

• Name a decision that didn't turn out as expected. What actually happened?
• What did you know then that turned out to be wrong, or incomplete?
• What specific lesson from that decision applies to what you're facing now?
• How do you keep this lesson from turning into paralysis about deciding at all?

Name one way you'll apply this lesson to a current choice without being ruled by past fear.`
  },
  {
    day: 11,
    title: "Energy and Decision Quality",
    theme: "Energy",
    prompt: `The same decision can look completely different depending on how depleted or resourced you are when you make it.

• When do you tend to make your best decisions - what state are you in?
• When have you made a decision you regretted because you were exhausted, rushed, or reactive?
• What physical or mental state do you need before making something important?
• What's one important decision you should probably delay until you're in better shape to make it?

Name the specific condition you'll wait for before finalizing your next big decision.`
  },
  {
    day: 12,
    title: "Reversible vs. Irreversible Decisions",
    theme: "Flexibility",
    prompt: `Not every decision deserves the same amount of agonizing - some can simply be tried.

• Look at a decision in front of you - is it actually reversible, or permanent?
• Are you spending irreversible-decision energy on something you could just test and adjust?
• What's one decision you've been treating as high-stakes that's actually low-risk to try?
• What would you decide today if you knew you could change course later?

Name one reversible decision you'll just go ahead and try this week instead of overthinking it.`
  },
  {
    day: 13,
    title: "Your Personal Decision Ritual",
    theme: "Process",
    prompt: `Rather than starting from scratch with every hard choice, build yourself a repeatable process.

• What steps actually help you gain real clarity - not busywork, actual clarity?
• Where does your intuition fit into this process, and where does research or logic fit?
• What question do you consistently forget to ask yourself before deciding?
• What would a five-step personal decision ritual look like for you specifically?

Write your ritual down as an actual numbered list you'll use on your next decision.`
  },
  {
    day: 14,
    title: "Commitment and Moving Forward",
    theme: "Commitment",
    prompt: `Fourteen days of examining how you decide - now put it to use on something you've been avoiding.

• What's the single most useful insight from this journey about how you make decisions?
• Name one decision you've been avoiding this entire time.
• Using everything you've learned, what's your actual process for deciding it now?
• What would committing to a choice, imperfectly but fully, feel like right now?

Set a specific date this week you will decide, and commit to it out loud to someone.`
  }
];

// 3. EMOTIONAL PORTRAIT SERIES (25 days, Visual, Intermediate)
export const portraitEmotionsDays = [
  {
    day: 1,
    title: "Self-Portrait Baseline",
    theme: "Foundation",
    prompt: `Draw yourself as you actually are today, not as you'd like to be seen.

• Create a simple self-portrait without worrying about technical skill.
• Look closely at what emotion is actually in your own eyes right now.
• What did you almost soften or leave out?

Notice what surprised you about what your own face revealed.`
  },
  {
    day: 2,
    title: "Joy Expression Study",
    theme: "Joy",
    prompt: `Chase pure joy onto the page and notice exactly what it does to a face.

• Draw or paint a portrait, yourself or imagined, expressing unguarded joy.
• Notice how the eyes, mouth, and overall expression shift with real joy.
• What colors feel like joy to you specifically?

Notice which feature carried the joy most convincingly.`
  },
  {
    day: 3,
    title: "Melancholy and Sadness",
    theme: "Sadness",
    prompt: `Sadness has its own kind of beauty - try to capture that instead of just the pain.

• Explore melancholy through the eyes, posture, or overall composition.
• Where does sadness settle in a face, specifically?
• What's beautiful, not just painful, about this depth?

Notice what this portrait reveals about how you personally hold sadness.`
  },
  {
    day: 4,
    title: "Anger and Fire",
    theme: "Anger",
    prompt: `Let anger have its full intensity on the page instead of softening it.

• Channel real anger or frustration into a portrait.
• What colors and strokes convey this intensity honestly?
• Where does the fire show up in the face - eyes, jaw, brow?

Notice whether this anger, fully expressed, feels dangerous or just honest.`
  },
  {
    day: 5,
    title: "Fear and Vulnerability",
    theme: "Fear",
    prompt: `Draw fear with compassion instead of judgment.

• Focus on the vulnerability in the eyes and tension in the features.
• How can this fear be shown tenderly rather than as weakness?
• What is this fear actually trying to protect?

Notice what changes in how you feel about fear once you've drawn it with care.`
  },
  {
    day: 6,
    title: "Surprise and Wonder",
    theme: "Surprise",
    prompt: `Capture the split second before the mind catches up to what just happened.

• Show how features open and expand in a moment of genuine surprise.
• What's the difference between surprise and wonder in a face?
• Which felt more natural to draw?

Notice the last time you actually felt this expression on your own face.`
  },
  {
    day: 7,
    title: "Love and Tenderness",
    theme: "Love",
    prompt: `Let love soften every line instead of making it dramatic.

• Create a portrait of love or deep tenderness - romantic, parental, or universal.
• How does love visibly soften features compared to other emotions?
• Which kind of love did you choose to draw, and why that one?

Notice who or what you were actually picturing while you drew this.`
  },
  {
    day: 8,
    title: "Confidence and Strength",
    theme: "Confidence",
    prompt: `Draw power that comes from calm certainty, not aggression.

• Show someone, yourself or imagined, radiating quiet confidence.
• What's the visual difference between true strength and posturing?
• Where does this confidence live in the face and posture?

Notice whether this portrait looks more like who you are or who you're becoming.`
  },
  {
    day: 9,
    title: "Contemplation and Wisdom",
    theme: "Contemplation",
    prompt: `Capture the inward-turning quality of someone deep in thought.

• Draw a contemplative moment - deep thought or meditation.
• How do you show the peace of inner focus rather than distraction?
• What does this stillness reveal that an active expression wouldn't?

Notice what question this contemplative figure seems to be sitting with.`
  },
  {
    day: 10,
    title: "Longing and Desire",
    theme: "Longing",
    prompt: `Show desire that hasn't been fulfilled, without resolving it.

• Express longing or yearning - romantic, homesickness, or spiritual seeking.
• How do you show desire that's still open, still reaching?
• What's just out of frame that this longing is directed toward?

Notice what your own longing this portrait might actually be pointing at.`
  },
  {
    day: 11,
    title: "Peaceful Serenity",
    theme: "Peace",
    prompt: `Draw true calm instead of just the absence of tension.

• Create a portrait of deep peace - relaxed features, soft expression.
• What does genuine inner calm actually look like, versus practiced calm?
• Where does the peace live in the face?

Notice how different this feels to draw compared to the anger or fear portraits.`
  },
  {
    day: 12,
    title: "Curiosity and Interest",
    theme: "Curiosity",
    prompt: `Show a mind actively exploring, not just passively watching.

• Draw someone in a state of alert, engaged curiosity.
• How is curiosity visually different from surprise?
• What does this figure seem to be looking toward?

Notice what you're currently curious about that you haven't pursued.`
  },
  {
    day: 13,
    title: "Embarrassment and Shyness",
    theme: "Embarrassment",
    prompt: `Find the endearing quality inside vulnerability instead of just the discomfort.

• Explore the turning away, the hiding, the flush of embarrassment.
• What makes this vulnerable moment also somehow tender?
• How do you show both the discomfort and the humanity in it?

Notice a recent moment of your own embarrassment you're now able to look at more gently.`
  },
  {
    day: 14,
    title: "Excitement and Anticipation",
    theme: "Excitement",
    prompt: `Capture the energy of someone who can barely contain what's coming.

• Show how features light up with real excitement or anticipation.
• What body language or posture conveys this energy?
• What's this figure anticipating?

Notice what you're genuinely excited about right now that this portrait echoes.`
  },
  {
    day: 15,
    title: "Disappointment and Loss",
    theme: "Disappointment",
    prompt: `Show the specific heaviness that settles in after a letdown.

• Draw the weight of disappointment or loss in the features and posture.
• Where does this heaviness show up most clearly?
• What's different about disappointment versus sadness?

Notice a recent disappointment of your own that this portrait might be carrying.`
  },
  {
    day: 16,
    title: "Determination and Grit",
    theme: "Determination",
    prompt: `Capture someone who has decided not to quit.

• Show the set jaw, focused eyes, and unwavering commitment of real resolve.
• What's the difference between determination and stubbornness in a face?
• What is this figure pushing through?

Notice where in your own life you need to summon exactly this expression.`
  },
  {
    day: 17,
    title: "Playfulness and Mischief",
    theme: "Playfulness",
    prompt: `Let some lightness and mischief onto the page for once.

• Express playfulness or mischief - the sparkle in the eyes, the suggestive smile.
• What makes an expression read as "fun" rather than just "happy"?
• What kind of mischief is this figure up to?

Notice the last time you let yourself be this playful.`
  },
  {
    day: 18,
    title: "Nostalgia and Memory",
    theme: "Nostalgia",
    prompt: `Capture someone lost in a memory, half here and half somewhere else.

• Show the distant, soft, far-away quality of remembering.
• What in the eyes signals "I'm not fully present right now"?
• What memory do you imagine this figure is inside of?

Notice the memory of your own that surfaced while you drew this.`
  },
  {
    day: 19,
    title: "Pride and Accomplishment",
    theme: "Pride",
    prompt: `Show the glow of someone who earned something and knows it.

• Draw the expansion, the straightened posture, the glow of real accomplishment.
• What's the difference between pride and arrogance in a portrait?
• What has this figure just achieved?

Notice an accomplishment of your own you haven't let yourself feel proud of yet.`
  },
  {
    day: 20,
    title: "Envy and Wanting",
    theme: "Envy",
    prompt: `Find compassion for a difficult emotion instead of hiding from it.

• Explore the tension of wanting what someone else has.
• How do you show this without villainizing the feeling?
• What is this figure actually longing for underneath the envy?

Notice something you're currently envious of, and what it reveals about a desire of your own.`
  },
  {
    day: 21,
    title: "Gratitude and Appreciation",
    theme: "Gratitude",
    prompt: `Show the softness and openness that comes with genuine thankfulness.

• Draw the warmth of real gratitude, not a polite smile.
• Where does this openness show up in the face?
• What is this figure grateful for?

Notice something you're genuinely grateful for right now that this portrait echoes.`
  },
  {
    day: 22,
    title: "Confusion and Uncertainty",
    theme: "Confusion",
    prompt: `Capture the discomfort of genuinely not knowing.

• Show the furrowed brow, the questioning look of real confusion.
• What's the difference between confusion and curiosity in a face?
• What is this figure trying to figure out?

Notice a question in your own life you're currently sitting inside without an answer.`
  },
  {
    day: 23,
    title: "Relief and Release",
    theme: "Relief",
    prompt: `Draw the exact moment tension finally lets go.

• Show the softening, the exhale, the visible relaxation of relief.
• What did this figure just get to put down?
• How is relief different from peace in a portrait?

Notice something you're waiting to feel this exact relief about.`
  },
  {
    day: 24,
    title: "Complex Emotional Mix",
    theme: "Complexity",
    prompt: `Show two feelings at once instead of picking just one.

• Create a portrait holding mixed or conflicted emotions - bittersweet, torn, ambivalent.
• Which two emotions did you choose to combine?
• How do you show both without one canceling the other out?

Notice a situation in your own life that actually feels this complicated right now.`
  },
  {
    day: 25,
    title: "Your Emotional Spectrum Complete",
    theme: "Integration",
    prompt: `Let this final portrait hold everything you've learned about faces and feeling.

• Create a final self-portrait incorporating what you've discovered across this journey.
• Which emotion from this whole series was hardest to draw honestly?
• How has this changed how you read other people's faces?

Write, next to this final piece, the one thing this journey taught you about your own emotional range.`
  }
];



// 1. CAREER COMPASS - 21-day professional direction journey
export const careerCompassDays = [
  {
    day: 1,
    title: "Career Inventory",
    theme: "Assessment",
    prompt: `Look honestly at your professional life instead of the version you'd give at a dinner party.

• What aspects of your work genuinely energize you?
• What quietly drains you, even if you've stopped noticing it?
• Which skills do you love using, and which feel like a burden now?

Name the one task you dread most that reveals something worth paying attention to.`
  },
  {
    day: 2,
    title: "Professional Strengths",
    theme: "Capabilities",
    prompt: `Your best professional qualities are probably underused right now.

• What are your greatest professional strengths and natural talents?
• When do you feel most competent and confident at work?
• How might these specific strengths be better utilized?

Name the strength you're most ready to lean into more.`
  },
  {
    day: 3,
    title: "Work Environment Preferences",
    theme: "Context",
    prompt: `The conditions around your work shape you as much as the work itself.

• Describe your ideal work environment - space, culture, team dynamics, autonomy.
• How far is this from your current reality?
• What matters most to you that you've been ignoring?

Name the one gap between ideal and actual that bothers you most.`
  },
  {
    day: 4,
    title: "Career Influences",
    theme: "Origins",
    prompt: `Some of your career choices were made for reasons that aren't fully yours.

• What influenced your career path - family expectation, practicality, genuine interest?
• Which influence still genuinely serves you?
• Which one deserves real questioning now?

Name the influence you're most ready to examine.`
  },
  {
    day: 5,
    title: "Professional Relationships",
    theme: "Connection",
    prompt: `Your work relationships shape your day-to-day experience more than the tasks themselves.

• How would you describe your relationships with colleagues, supervisors, or clients?
• What pattern creates connection, and what creates tension?
• Which work relationship most affects your job satisfaction?

Name the one action that would improve this relationship.`
  },
  {
    day: 6,
    title: "Work-Life Integration",
    theme: "Balance",
    prompt: `Notice where your career and your personal life actually clash, not just in theory.

• How well does your career integrate with your personal life and values?
• Where do you experience real conflict, and where genuine harmony?
• What adjustment would create better alignment?

Name the one boundary you'll set this week.`
  },
  {
    day: 7,
    title: "Values at Work",
    theme: "Alignment",
    prompt: `Your personal values either show up in your work or get quietly left at the door.

• How do your core values show up, or fail to show up, in your work?
• What would greater alignment between values and career actually look like?
• Which value is most compromised right now?

Name the one small way you'll honor this value at work this week.`
  },
  {
    day: 8,
    title: "Career Fears",
    theme: "Obstacles",
    prompt: `Something is quietly holding you back professionally - name it directly.

• What fears hold you back - failure, success, change, judgment?
• How might this fear be protecting you, even while it limits you?
• What would you do differently this month if the fear weren't there?

Name the smallest action you could take despite this fear.`
  },
  {
    day: 9,
    title: "Professional Learning",
    theme: "Growth",
    prompt: `One new skill, developed deliberately, would change your trajectory.

• What new skill or knowledge would most enhance your satisfaction and effectiveness?
• What learning opportunity genuinely excites you?
• What's stopped you from pursuing it already?

Name the first step toward learning this.`
  },
  {
    day: 10,
    title: "Impact and Contribution",
    theme: "Purpose",
    prompt: `Notice what kind of mark you actually want your work to leave.

• What impact do you want to have through your work?
• How do you want to contribute to your organization, industry, or community?
• What would make your work feel genuinely more meaningful?

Name the one contribution you're most drawn to make this year.`
  },
  {
    day: 11,
    title: "Career Role Models",
    theme: "Inspiration",
    prompt: `Someone you admire professionally is modeling something you actually want.

• Who do you genuinely admire in your professional world?
• What quality of theirs would you like to develop in yourself?
• What can you learn from their actual path, not just their current success?

Name the one thing you'll try to emulate from them this month.`
  },
  {
    day: 12,
    title: "Professional Challenges",
    theme: "Obstacles",
    prompt: `Sort your challenges honestly - some you can act on, some you can't.

• What's your biggest professional challenge right now?
• Is it within your control to address, or does it require acceptance?
• What's stopped you from addressing the controllable part?

Name the one action you'll take on the part you actually can control.`
  },
  {
    day: 13,
    title: "Success Redefinition",
    theme: "Achievement",
    prompt: `Your current definition of success might not actually be yours.

• How do you currently define professional success?
• Is this genuinely your definition, or one you absorbed from someone else?
• How might you redefine success around what actually matters to you?

Write your own definition of success in one honest sentence.`
  },
  {
    day: 14,
    title: "Future Vision",
    theme: "Aspiration",
    prompt: `Picture your professional life five years out in vivid, specific detail.

• What type of work are you doing in this vision?
• What impact are you having, and in what environment?
• What's the first sign, on an ordinary day, that this future has arrived?

Name the one step available to you now that starts moving toward this.`
  },
  {
    day: 15,
    title: "Career Transitions",
    theme: "Change",
    prompt: `Notice what's actually pulling you toward change, and what's holding you back.

• If you made a career change, what would it realistically look like?
• What's attracting you toward it, and what's the fear keeping you in place?
• What would a gradual transition, rather than a leap, actually involve?

Name the smallest first step of this transition you could take.`
  },
  {
    day: 16,
    title: "Financial Considerations",
    theme: "Resources",
    prompt: `Money shapes your career choices more than you might admit out loud.

• How do financial needs and goals impact your career decisions?
• What's the actual relationship between money and fulfillment in your work?
• Where are you sacrificing one for the other more than you'd like?

Name the one adjustment that would better balance financial and personal satisfaction.`
  },
  {
    day: 17,
    title: "Professional Legacy",
    theme: "Impact",
    prompt: `What you're remembered for professionally is being decided right now, not someday.

• What professional legacy do you want to leave?
• How do you want colleagues to remember working with you?
• What are you currently doing that builds toward this?

Name the one action this month that builds toward this legacy.`
  },
  {
    day: 18,
    title: "Networking and Community",
    theme: "Connection",
    prompt: `Professional relationships are either being built deliberately or left to chance.

• What professional communities or networks currently support your growth?
• How might you contribute more, not just benefit?
• What community would you like to join or help build?

Name the one connection you'll actively cultivate this month.`
  },
  {
    day: 19,
    title: "Skill Gap Analysis",
    theme: "Development",
    prompt: `The gap between where you are and where you want to be is usually more specific than it feels.

• What gap exists between your current capabilities and your aspirations?
• What specific skill or experience would bridge this gap?
• How might you actually acquire it, realistically?

Name the first concrete step toward closing this gap.`
  },
  {
    day: 20,
    title: "Risk Assessment",
    theme: "Strategy",
    prompt: `Staying still has a cost too, even if it's quieter than the cost of change.

• What risk are you willing to take for career growth or change?
• What's the cost of staying exactly where you are right now?
• How do you typically approach professional risk - too cautious, too reckless, or genuinely calibrated?

Name the one risk you're ready to seriously consider.`
  },
  {
    day: 21,
    title: "Action Planning",
    theme: "Implementation",
    prompt: `Twenty-one days of reflection - now turn it into an actual plan.

• What are the top 3 concrete steps that would move you toward your ideal career vision?
• What obstacle is most likely to derail each one?
• What timeline and accountability will you set for yourself?

Write the plan down with dates, not just intentions.`
  }
];

// 2. INNER CHILD HEALING - 14-day childhood exploration
export const innerChildDays = [
  {
    day: 1,
    title: "Childhood Memories",
    theme: "Exploration",
    prompt: `Your earliest memories are still shaping you, whether or not you've looked at them lately.

• What's your earliest or most vivid childhood memory?
• Which memories bring joy, and which bring sadness or confusion?
• What do these memories reveal about your young self's early experience of the world?

Name the one memory you're most ready to look at honestly.`
  },
  {
    day: 2,
    title: "Young Self Description",
    theme: "Identity",
    prompt: `Describe the child you actually were, not the tidy story you've told about it since.

• What were your personality traits, favorite activities, and natural tendencies?
• What did you love most about being young?
• What part of that child do you genuinely miss?

Name the one quality from that child you'd like back.`
  },
  {
    day: 3,
    title: "Family Dynamics",
    theme: "Relationships",
    prompt: `Every family runs on unspoken rules - name the ones you learned to follow.

• How would you describe your family dynamics as a child?
• What spoken and unspoken rules existed about feelings, attention, or approval?
• What survival strategy did you develop to get your needs met?

Name the strategy you're most ready to examine as an adult.`
  },
  {
    day: 4,
    title: "Childhood Wounds",
    theme: "Healing",
    prompt: `Some childhood moments still ache, even decades later - approach them with curiosity, not judgment.

• What experience from childhood still feels painful or unresolved?
• When did you feel most misunderstood, rejected, or hurt?
• What does that younger version of you still need to hear?

Write the one sentence of comfort you'd offer that child now.`
  },
  {
    day: 5,
    title: "Lost Dreams",
    theme: "Reclamation",
    prompt: `Somewhere behind you is a dream you had before anyone told you it was impractical.

• What did you dream of becoming or doing as a child?
• Which of these dreams did you abandon, and why?
• Which one still sparks something in you today?

Name the smallest way you could reconnect with this dream now.`
  },
  {
    day: 6,
    title: "Childhood Gifts",
    theme: "Strengths",
    prompt: `You had natural gifts before the world taught you to doubt them.

• What special quality, talent, or way of seeing did you have as a child?
• What did others recognize in you back then?
• Is this gift still part of you today, even if buried?

Name the one childhood gift you're ready to reclaim.`
  },
  {
    day: 7,
    title: "Protective Patterns",
    theme: "Survival",
    prompt: `A pattern you built as a child to feel safe might still be running your adult life.

• What pattern did you develop to feel safe, loved, or accepted - people-pleasing, perfectionism, withdrawal, rebellion?
• How did this pattern actually protect you back then?
• Where does it still show up in your life today, whether or not it's still needed?

Name the one situation where you'll try responding differently this week.`
  },
  {
    day: 8,
    title: "Messages Received",
    theme: "Beliefs",
    prompt: `Some beliefs about yourself were installed before you could question them.

• What message did you receive about yourself, relationships, or the world as a child?
• Was this message spoken outright, or just implied through actions?
• How has this message shaped a belief you still hold today?

Name the one message you're ready to actively challenge.`
  },
  {
    day: 9,
    title: "Play and Joy",
    theme: "Spontaneity",
    prompt: `Somewhere you knew how to play without needing it to accomplish anything.

• What made you laugh, feel free, or lose track of time as a child?
• How much of this playfulness survives in your adult life?
• What's stopped you from bringing more of it back?

Name the one playful thing you'll do this week for no reason at all.`
  },
  {
    day: 10,
    title: "Inner Child Dialogue",
    theme: "Communication",
    prompt: `Let your inner child speak directly instead of just being spoken about.

• Write a conversation between your adult self and your inner child.
• What does your inner child need to hear from you right now?
• What fear or concern does your inner child voice in this dialogue?

Write the one line of reassurance your adult self offers back.`
  },
  {
    day: 11,
    title: "Reparenting Practices",
    theme: "Nurturing",
    prompt: `What you needed more of as a child, you can start giving yourself now.

• What did you need more of growing up - comfort, validation, encouragement, boundaries, fun?
• How might you "reparent" yourself in this specific way now?
• What's stopped you from doing this already?

Name the one reparenting practice you'll start this week.`
  },
  {
    day: 12,
    title: "Forgiveness Process",
    theme: "Release",
    prompt: `Forgiveness here is for your own freedom, not for excusing what happened.

• What aspect of your childhood are you ready to forgive - in yourself, a parent, or someone else?
• What makes this forgiveness difficult?
• What would it free up in you if you actually released this?

Name the smallest step toward forgiveness you're willing to take now.`
  },
  {
    day: 13,
    title: "Childhood Wisdom",
    theme: "Integration",
    prompt: `You knew something true as a child that you've since dismissed as naive.

• What wisdom, intuition, or way of seeing did you have as a child that you've since forgotten?
• Why did you stop trusting it?
• How might this childhood wisdom actually serve you now?

Name the one way you'll trust this wisdom again this week.`
  },
  {
    day: 14,
    title: "Integration",
    theme: "Wholeness",
    prompt: `Fourteen days with your inner child - now decide how you'll keep them close.

• What small action would bring more playfulness, curiosity, or authenticity into your daily life?
• What has this journey taught you about the child you still carry?
• What commitment do you want to make to them going forward?

Write that commitment as a promise to your inner child, in your own words.`
  }
];

// 3. ANXIETY ALCHEMY - 10-day worry transformation
export const anxietyAlchemyDays = [
  {
    day: 1,
    title: "Anxiety Mapping",
    theme: "Awareness",
    prompt: `Describe your anxiety like a scientist studying it, not a victim of it.

• Where in your body do you feel it first?
• What physical sensations show up - tight chest, racing thoughts, restlessness?
• When does it tend to hit hardest - time of day, situation, company?

Name the earliest physical sign you could catch it by, before it takes over.`
  },
  {
    day: 2,
    title: "Anxiety Origins",
    theme: "Understanding",
    prompt: `Anxiety usually has a history - trace yours back honestly.

• When do you first remember experiencing anxiety?
• What life circumstances may have contributed to this pattern forming?
• How has your relationship with it changed since then?

Name the one thing about its origin that surprises you now.`
  },
  {
    day: 3,
    title: "Anxiety Triggers",
    theme: "Patterns",
    prompt: `Certain situations reliably set it off - map the pattern instead of just enduring it.

• What specific situations, thoughts, or circumstances trigger your anxiety?
• Is there a pattern in timing, environment, or relationship that precedes it?
• Which trigger shows up most often in your actual week?

Name the trigger you're most likely to face in the next few days.`
  },
  {
    day: 4,
    title: "Anxiety Messages",
    theme: "Wisdom",
    prompt: `If your anxiety were trying to tell you something instead of just torment you, what would it say?

• What might it be trying to protect you from or alert you to?
• How might it actually be attempting to help, however clumsily?
• What's it gotten right, even once?

Name the message you're willing to actually listen to instead of dismiss.`
  },
  {
    day: 5,
    title: "Body and Anxiety",
    theme: "Physical",
    prompt: `Your body carries anxiety in specific, physical ways - notice exactly how.

• Where does tension consistently build when anxiety arises?
• What bodily response shows up most reliably?
• What actually helps your body feel safer in the moment?

Name the one physical practice you'll use the next time anxiety hits.`
  },
  {
    day: 6,
    title: "Anxiety and Control",
    theme: "Acceptance",
    prompt: `Anxiety often shows up hardest exactly where you're trying to control the uncontrollable.

• What are you trying to control when you feel anxious?
• What actually happens when you can't control it?
• How might accepting some uncertainty lighten this load?

Name the one thing you're ready to stop trying to control this week.`
  },
  {
    day: 7,
    title: "Reframing Practice",
    theme: "Transformation",
    prompt: `Pick a current worry and see if it can be read as information instead of just suffering.

• Choose a current anxiety or worry.
• How might this concern actually be valuable information or motivation?
• What would change if you saw it as guidance rather than a threat?

Write the reframed version of this worry in one sentence.`
  },
  {
    day: 8,
    title: "Anxiety Allies",
    theme: "Support",
    prompt: `Something has actually worked before to calm you - name it specifically.

• What practice, person, or environment helps you feel calmer?
• Which tool have you found most effective for managing anxious thoughts?
• What's stopped you from using it more consistently?

Name the ally you'll lean on the next time anxiety rises.`
  },
  {
    day: 9,
    title: "Future Self",
    theme: "Growth",
    prompt: `Someone ahead of you has learned to work skillfully with this same anxiety.

• Imagine a version of yourself who relates to anxious thoughts with more skill.
• How does this future self actually respond differently than you do now?
• What wisdom would they offer you today?

Name the one thing you'll try that this future self would already be doing.`
  },
  {
    day: 10,
    title: "Anxiety Integration",
    theme: "Partnership",
    prompt: `Ten days of studying your anxiety - now consider a more collaborative relationship with it.

• What would working with your anxious energy, rather than against it, actually look like?
• What have you learned about transforming worry into useful information?
• What practice will you keep going forward?

Name the one shift in your relationship with anxiety you're most committed to.`
  }
];

// 4. DREAM JOURNAL DECODER - 14-day subconscious exploration
export const dreamJournalDecoderDays = [
  {
    day: 1,
    title: "Dream Awareness",
    theme: "Recognition",
    prompt: `Before you move, before the day takes over, catch whatever fragments are still there.

• Lie still upon waking and recall any images, feelings, or fragments from the night.
• Write down whatever you remember, even if it's incomplete or barely there.
• What feeling lingered even after the images faded?

Notice how much more you remember by staying still versus jumping straight up.`
  },
  {
    day: 2,
    title: "Dream Recording",
    theme: "Capture",
    prompt: `Build the habit of catching dreams before they slip, without worrying yet about what they mean.

• Record your dream immediately upon waking - visuals, emotions, people, dialogue.
• What detail did you almost forget to write down?
• What surprised you about how much or how little you remembered today?

Notice which part of the dream faded fastest once you were fully awake.`
  },
  {
    day: 3,
    title: "Dream Emotions",
    theme: "Feelings",
    prompt: `Focus purely on what you felt, not what happened.

• What emotion dominated your dream experience last night?
• How does this compare to what you've been feeling in waking life lately?
• Did the dream emotion surprise you, or did it feel familiar?

Name the one feeling from the dream you want to sit with a little longer today.`
  },
  {
    day: 4,
    title: "Dream Characters",
    theme: "Relationships",
    prompt: `The people in your dreams, known or strange, are rarely there by accident.

• Who appeared in your dream - someone you know, or a stranger?
• What might this character represent about you or your life right now?
• How did you interact with them, and what does that interaction suggest?

Name the one relationship, real or symbolic, this dream character seems to be pointing at.`
  },
  {
    day: 5,
    title: "Dream Settings",
    theme: "Environment",
    prompt: `Where a dream takes place often mirrors something about your inner landscape.

• Where did your dream take place - familiar or unknown territory?
• What did this setting feel like emotionally?
• How might this environment reflect something happening inside you right now?

Name the one detail about this setting you want to sit with longer.`
  },
  {
    day: 6,
    title: "Recurring Elements",
    theme: "Patterns",
    prompt: `Your subconscious repeats itself when it wants your attention.

• What theme, symbol, or element keeps showing up across your recent dreams?
• Is it a person, place, object, or situation?
• What might this repetition be trying to emphasize?

Name the one recurring element you're most curious to understand.`
  },
  {
    day: 7,
    title: "Dream Symbols",
    theme: "Meaning",
    prompt: `Skip the dream dictionary - your own associations matter more than universal meanings.

• Identify a key symbol from your dreams this week.
• What does this symbol mean to you personally, not in general?
• What memory or feeling does it stir up?

Write the personal meaning of this symbol in your own words.`
  },
  {
    day: 8,
    title: "Nightmare Navigation",
    theme: "Shadow",
    prompt: `A disturbing dream is worth curiosity, not just fear.

• If you've had a disturbing dream recently, what might it be trying to tell you?
• What unresolved fear or issue might it be highlighting?
• What would happen if you approached it with curiosity instead of avoidance?

Name the one thing this nightmare might actually be asking you to address.`
  },
  {
    day: 9,
    title: "Dream Gifts",
    theme: "Wisdom",
    prompt: `Your dreaming mind sometimes solves what your waking mind can't.

• What insight, solution, or creative idea has emerged from a recent dream?
• How might your dreaming mind be offering wisdom your conscious mind missed?
• What gift has your dream world given you this week?

Name the one dream insight you'll actually apply to waking life.`
  },
  {
    day: 10,
    title: "Dream Actions",
    theme: "Behavior",
    prompt: `Notice how you behave in dreams compared to how you behave awake.

• Are you active or passive in your dreams? Confident or fearful?
• How does this compare to your waking behavior?
• What might this difference reveal about a part of yourself you don't usually show?

Name the one dream-behavior you'd like to bring more of into waking life.`
  },
  {
    day: 11,
    title: "Lucid Moments",
    theme: "Consciousness",
    prompt: `Even a flicker of "I know I'm dreaming" is worth paying attention to.

• Have you had any moment of awareness within a dream, even briefly?
• What did that moment of "knowing" feel like?
• How might developing more of this awareness serve your growth?

Name the one thing you'll try to notice next time you sense you're dreaming.`
  },
  {
    day: 12,
    title: "Dream Integration",
    theme: "Application",
    prompt: `Dream insight is only useful once it touches your actual life.

• What message from a recent dream feels relevant to a current situation or decision?
• How might this dream wisdom actually inform a choice you're facing?
• What's stopped you from taking dreams this seriously before?

Name the one decision you'll let this dream insight influence.`
  },
  {
    day: 13,
    title: "Dream Dialogue",
    theme: "Communication",
    prompt: `Let a dream element speak back to you directly instead of just analyzing it from outside.

• Choose a significant dream from this journey and pick a key element - a character, symbol, or setting.
• What question would you ask it?
• What might it say back to you?

Write this dialogue out fully, letting the dream element answer in its own voice.`
  },
  {
    day: 14,
    title: "Dream Journey Reflection",
    theme: "Integration",
    prompt: `Two weeks of paying attention to your dreams - look back at the whole picture.

• What pattern or surprising discovery has emerged across these two weeks?
• How has paying attention to your dreams changed your understanding of yourself?
• What practice will you continue beyond this journey?

Name the one dream insight you never want to forget.`
  }
];

// 5. SEASONAL SOUL RHYTHMS - 28-day natural cycles alignment
export const seasonalSoulRhythmsDays = [
  {
    day: 1,
    title: "Current Season Awareness",
    theme: "Present Moment",
    prompt: `Notice what season you're actually in, outside in nature and inside your own life.

• What does this season look like around you right now - light, temperature, growth or dying back?
• How does your body respond to it - energy, appetite, sleep?
• Does your inner emotional season match the outer one, or contradict it?

Name the one way this season is currently asking something of you.`
  },
  {
    day: 2,
    title: "Seasonal Childhood",
    theme: "Memory",
    prompt: `A season from childhood still lives in your body, wired to specific smells and sounds.

• What's your earliest memory of a seasonal change?
• Which season felt most magical to you as a child, and why?
• How did your family or culture mark these transitions?

Name the one seasonal tradition from childhood you'd like to bring back.`
  },
  {
    day: 3,
    title: "Body Seasons",
    theme: "Physical Rhythms",
    prompt: `Your body has its own seasonal responses that your schedule probably ignores.

• How does your energy, sleep, or appetite shift across seasons?
• What does your body specifically need right now, in this season?
• Which season is hardest on your body, and why?

Name the one adjustment you'll make to support your body this season.`
  },
  {
    day: 4,
    title: "Emotional Seasons",
    theme: "Inner Weather",
    prompt: `Just like nature, your inner life moves through growth, harvest, decay, and rest.

• What emotional season are you in right now - growth, harvest, decay, or rest?
• What tells you this is the season you're actually in?
• Does this match or clash with what's happening externally?

Name what this inner season seems to be asking you to do.`
  },
  {
    day: 5,
    title: "Spring Energy",
    theme: "New Beginnings",
    prompt: `Regardless of the calendar, notice what wants to be born in you right now.

• What wants to begin, grow, or come alive in your life currently?
• What seed of possibility are you quietly nurturing?
• What's stopped you from giving it more room?

Name the one small action that would nurture this beginning this week.`
  },
  {
    day: 6,
    title: "Summer Fullness",
    theme: "Peak Expression",
    prompt: `Notice where in your life you're currently in full bloom.

• What part of your life feels most fully alive and expressed right now?
• Where are you sharing your gifts most fully?
• What would more of this fullness look like?

Name the one area you'd like to bring more summer energy into.`
  },
  {
    day: 7,
    title: "Autumn Harvest",
    theme: "Gathering",
    prompt: `Notice what you're actually harvesting from recent effort, not just what's still growing.

• What fruits of your effort are ready to gather right now?
• What wisdom have you gained from recent experience?
• What are you most grateful to have gathered this season?

Name the one harvest you haven't fully acknowledged yet.`
  },
  {
    day: 8,
    title: "Winter Rest",
    theme: "Contemplation",
    prompt: `Notice what in your life is quietly asking for rest instead of more effort.

• What in your life needs hibernation or genuine rest right now?
• What wants to be released or composted to feed future growth?
• What's stopping you from actually resting?

Name the one thing you'll let go dormant this week instead of forcing it.`
  },
  {
    day: 9,
    title: "Natural Rhythms",
    theme: "Observation",
    prompt: `Spend real time watching the natural world instead of glancing at it.

• What seasonal signs do you notice around you right now?
• How do plants, animals, or the landscape embody this current season?
• What does nature's rhythm suggest about your own pacing right now?

Name the one lesson from nature's current rhythm you'll apply to yourself.`
  },
  {
    day: 10,
    title: "Resistance to Seasons",
    theme: "Acceptance",
    prompt: `Notice which seasons you resist, in nature and in your own life's cycles.

• Which seasonal change do you resist most, and why?
• What do you prefer about certain seasons over others?
• What would accepting all seasons, not just the comfortable ones, actually change?

Name the season you're currently resisting the most.`
  },
  {
    day: 11,
    title: "Seasonal Self-Care",
    theme: "Adaptation",
    prompt: `Your self-care needs shift with the season, even if your routine doesn't.

• What does your body, mind, or spirit specifically need during this time of year?
• How does your current self-care routine match or ignore this need?
• What adjustment would actually serve you better right now?

Name the one self-care shift you'll make this season.`
  },
  {
    day: 12,
    title: "Light and Dark",
    theme: "Balance",
    prompt: `Notice how changing light literally and metaphorically affects you.

• How do you respond to changing patterns of daylight and darkness?
• What metaphorical periods of illumination or mystery are you currently in?
• Which do you find harder to be in - the light or the dark?

Name the one way you'll honor whichever one you're in right now.`
  },
  {
    day: 13,
    title: "Seasonal Creativity",
    theme: "Expression",
    prompt: `Your creative energy likely has its own seasonal rhythm too.

• How does your creativity express itself differently across seasons?
• Which season feels most creatively fertile for you?
• Are you honoring this rhythm, or fighting it with a rigid schedule?

Name the one way you'll work with your creative season this month.`
  },
  {
    day: 14,
    title: "Seasonal Relationships",
    theme: "Connection",
    prompt: `Notice how your need for connection shifts with the seasons.

• Do you crave more or less social connection during different times of year?
• How do your relationships actually change with the seasons?
• What would honoring this rhythm, instead of forcing consistency, look like?

Name the one relationship adjustment that fits this current season.`
  },
  {
    day: 15,
    title: "Weather Patterns",
    theme: "External Reflection",
    prompt: `Weather does something specific to your mood - notice exactly what.

• How does rain, sunshine, wind, or snow affect your energy and mood?
• Which weather do you resist most, and which do you welcome?
• What might weather's unpredictability teach you about your own adaptability?

Name the one lesson from weather you'll apply to something uncertain in your life.`
  },
  {
    day: 16,
    title: "Seasonal Foods",
    theme: "Nourishment",
    prompt: `Notice what your body actually craves as the seasons shift.

• What foods does your body want during this particular season?
• How might eating seasonally support your health and your connection to natural cycles?
• What seasonal nourishment practice is calling to you right now?

Name the one seasonal food practice you'll try this week.`
  },
  {
    day: 17,
    title: "Holiday and Ritual",
    theme: "Ceremony",
    prompt: `Seventeen days of seasonal attention - now consider what ceremony would honor it.

• What seasonal celebration or ritual feels genuinely meaningful to you, not just obligatory?
• What personal ceremony could you create to mark seasonal transitions?
• What ritual would actually help you feel more aligned with these natural cycles?

Name the one ritual you'll create or revive this season.`
  },
  {
    day: 18,
    title: "Seasonal Work",
    theme: "Professional Rhythms",
    prompt: `Your energy for work likely has its own seasonal ebb and flow that your job ignores.

• How does your work rhythm align, or clash, with the season you're in?
• What would honoring natural energy cycles look like in your professional life?
• Which season makes your work feel hardest?

Name the one work adjustment that would better fit this season.`
  },
  {
    day: 19,
    title: "Climate and Location",
    theme: "Geography",
    prompt: `Where you live shapes how directly you experience seasonal change.

• How does your specific location affect your experience of seasons?
• What seasonal pattern is unique to where you live?
• If your climate has subtle shifts, how do you still connect with seasonal rhythm?

Name the one seasonal marker specific to your location that you'll pay closer attention to.`
  },
  {
    day: 20,
    title: "Life Season Assessment",
    theme: "Personal Timing",
    prompt: `Beyond the calendar, notice what season of your actual life you're in.

• What season of life are you in overall - beginning, building, harvesting, resting?
• What does this life season suggest about realistic expectations right now?
• Are you trying to force a different season's pace onto your current one?

Name the one expectation you'll adjust to match your actual life season.`
  },
  {
    day: 21,
    title: "Seasonal Challenges",
    theme: "Difficulty",
    prompt: `Certain times of year are reliably harder for you - name them honestly.

• What seasonal challenge do you consistently face - low mood, difficult anniversaries, harsh weather?
• How have you tried to prepare for this in the past?
• What would meeting this challenge with more compassion look like?

Name the one thing you'll do differently to prepare for this challenge next time.`
  },
  {
    day: 22,
    title: "Micro-Seasons",
    theme: "Subtle Changes",
    prompt: `Within every season are smaller shifts most people never notice.

• What subtle shift have you noticed happening within the current season?
• What does this micro-season feel like compared to last week?
• How does paying attention to these small transitions change your sensitivity to rhythm overall?

Name the one micro-seasonal change you'll watch for this week.`
  },
  {
    day: 23,
    title: "Seasonal Ancestors",
    theme: "Heritage",
    prompt: `Your ancestors lived far closer to seasonal cycles than you likely do now.

• How did the people before you live in relationship with seasonal cycles?
• What traditional knowledge about seasonal living might still serve you now?
• What has modern life caused you to lose touch with?

Name the one piece of ancestral seasonal wisdom you'd like to reclaim.`
  },
  {
    day: 24,
    title: "Urban Seasons",
    theme: "City Rhythms",
    prompt: `Even in the most paved-over environment, the seasons still find a way through.

• If you live in a city, what sign of seasonal change can you notice there?
• How do you currently connect with natural rhythm despite an urban setting?
• What would strengthen this connection further?

Name the one urban seasonal marker you'll start watching for.`
  },
  {
    day: 25,
    title: "Seasonal Meditation",
    theme: "Contemplation",
    prompt: `Sit quietly with this season instead of just observing it from a distance.

• What quality of this current season lives inside you right now?
• What did stillness reveal that busyness usually hides?
• How might you embody this season's energy more fully in how you move through your days?

Name the one way you'll embody this season more this week.`
  },
  {
    day: 26,
    title: "Next Season Preparation",
    theme: "Transition",
    prompt: `Notice the season that's approaching before it arrives unannounced.

• What season is coming next, and what does it typically ask of you?
• What does your soul need to release before this transition?
• What do you need to embrace to move into it well?

Name the one thing you'll let go of to prepare for this next season.`
  },
  {
    day: 27,
    title: "Seasonal Wisdom",
    theme: "Learning",
    prompt: `Each season has been quietly teaching you something, whether or not you noticed.

• What has each season taught you about growth, rest, or change?
• How has this attention to seasonal cycles changed how you see yourself?
• Which season taught you the hardest lesson?

Name the one piece of seasonal wisdom you never want to forget.`
  },
  {
    day: 28,
    title: "Rhythmic Living",
    theme: "Integration",
    prompt: `Twenty-eight days of seasonal attention - now decide how this continues.

• What practice from this journey will you keep going forward?
• What lifestyle change would help you live more in harmony with natural cycles?
• What's the biggest shift in how you see your own "seasonal soul" now?

Name the one commitment you're making to rhythmic living beyond this journey.`
  }
];
export const forgivenessFreedomDays = [
  {
    day: 1,
    title: "Understanding Forgiveness",
    theme: "Definition",
    prompt: `Most people confuse forgiveness with excusing harm - separate the two before you go further.

• What does forgiveness actually mean to you, in your own words?
• Is it about excusing behavior, or something else entirely?
• Who taught you your current understanding of what forgiveness requires?

Name the misconception about forgiveness you're most ready to drop.`
  },
  {
    day: 2,
    title: "Resentment Inventory",
    theme: "Assessment",
    prompt: `Take honest stock of what you're actually carrying, without trying to fix any of it yet.

• Who or what are you genuinely angry at right now - people, institutions, situations, yourself?
• Which resentment feels heaviest?
• Which one surprised you when you actually wrote it down?

Name the resentment you're most ready to look at closely this week.`
  },
  {
    day: 3,
    title: "The Cost of Resentment",
    theme: "Impact",
    prompt: `Resentment charges rent whether or not you notice you're paying it.

• How does holding this resentment affect your daily mental and physical state?
• How does it show up in your relationships or energy?
• What would you get back if this weight were lighter?

Name the one cost of this resentment you hadn't fully acknowledged before.`
  },
  {
    day: 4,
    title: "Resentment Origins",
    theme: "Understanding",
    prompt: `Pick one significant resentment and trace it back to what actually happened.

• What happened, plainly, without the story layered on top?
• What need went unmet, or what boundary was crossed?
• What did this teach you about trust or safety that you still carry?

Name the one lesson from this experience you're ready to examine honestly.`
  },
  {
    day: 5,
    title: "The Story We Tell",
    theme: "Narrative",
    prompt: `The story you tell about this hurt might be protecting you and trapping you at the same time.

• What story do you tell yourself about this situation?
• How does this narrative protect you, and how does it also confine you?
• What would shift if you saw this from more than one angle?

Name the one part of your story you're willing to question.`
  },
  {
    day: 6,
    title: "Grief and Loss",
    theme: "Mourning",
    prompt: `Underneath resentment is usually a loss that hasn't been fully grieved.

• What did you actually lose in this situation - trust, innocence, a relationship, a dream?
• Have you let yourself grieve this loss, or rushed past it toward forgiveness?
• What would it mean to mourn this fully before trying to forgive anything?

Let yourself feel this grief for a moment before writing further.`
  },
  {
    day: 7,
    title: "Self-Forgiveness",
    theme: "Inner Healing",
    prompt: `Some of what you're carrying is actually aimed at yourself.

• What do you need to forgive yourself for in this situation?
• What action, reaction, or perceived failure still weighs on you?
• How might self-compassion here be the actual foundation for forgiving anyone else?

Write the one sentence of self-forgiveness you're ready to say to yourself.`
  },
  {
    day: 8,
    title: "Boundaries and Protection",
    theme: "Safety",
    prompt: `Forgiveness doesn't require removing your boundaries - notice what protection you still need.

• How can you protect yourself going forward, regardless of forgiveness?
• What boundary would let you open your heart without becoming vulnerable again in the same way?
• What's the difference between forgiving and forgetting here?

Name the one boundary you're keeping firmly in place no matter what.`
  },
  {
    day: 9,
    title: "The Other's Humanity",
    theme: "Perspective",
    prompt: `Seeing someone's humanity doesn't excuse what they did - it just changes what you carry.

• What pain, fear, or limitation might have driven their behavior?
• Does this understanding change anything about how heavy this resentment feels?
• Where's the line between understanding and excusing, for you?

Name the one thing about their humanity you're willing to consider, without excusing the harm.`
  },
  {
    day: 10,
    title: "Forgiveness as Process",
    theme: "Journey",
    prompt: `Forgiveness rarely happens in one clean moment - it's usually a returning.

• What would it mean to treat forgiveness as an ongoing process instead of a single event?
• Where are you in this process right now, honestly?
• What would patience with yourself here actually look like?

Name the one way you'll be gentler with your own timeline.`
  },
  {
    day: 11,
    title: "Releasing Expectations",
    theme: "Letting Go",
    prompt: `Waiting for an apology that may never come keeps your peace in someone else's hands.

• What expectation do you hold about acknowledgment or change from the person who hurt you?
• How might releasing this expectation actually free you, regardless of what they do?
• What would peace look like if it didn't depend on them at all?

Name the one expectation you're ready to release this week.`
  },
  {
    day: 12,
    title: "Forgiveness Practices",
    theme: "Methods",
    prompt: `Some practical practice might move this further than thinking about it ever will.

• What practice - meditation, an unsent letter, ritual, therapy - might support this process?
• Which approach feels authentic to you, not performative?
• What's stopped you from trying it already?

Try the one practice that feels most true to you this week.`
  },
  {
    day: 13,
    title: "Small Steps Forward",
    theme: "Progress",
    prompt: `You don't need to leap to full forgiveness - a small step is still real progress.

• What tiny step toward forgiveness feels possible today?
• Could it be as small as being willing to be willing?
• What would honoring exactly where you are, without rushing, look like?

Take that one small step today.`
  },
  {
    day: 14,
    title: "Forgiveness and Justice",
    theme: "Balance",
    prompt: `Forgiveness and accountability aren't actually opposites - notice how they can coexist.

• Can you forgive while still believing the wrong action had real consequences?
• What would justice look like here, separate from your own inner peace?
• Where do these two things feel like they're in tension for you?

Name how you'll hold both forgiveness and accountability at once.`
  },
  {
    day: 15,
    title: "The Gifts of Pain",
    theme: "Growth",
    prompt: `Something real may have grown out of this pain, even if you never wanted the lesson.

• What wisdom, compassion, or strength emerged that wouldn't exist without this experience?
• How has this hurt actually shaped who you've become?
• Does naming this gift feel like betrayal, or like genuine growth?

Name the one gift from this pain you're ready to actually claim.`
  },
  {
    day: 16,
    title: "Opening the Heart",
    theme: "Vulnerability",
    prompt: `Notice what it would feel like to hold this without your heart staying closed.

• What would it feel like to approach this situation with an open, not naive, heart?
• What shifts in you when resentment isn't the thing guarding the door?
• What are you afraid would happen if you let your heart open here?

Name the one small way you'll practice opening your heart this week.`
  },
  {
    day: 17,
    title: "Freedom Declaration",
    theme: "Liberation",
    prompt: `Seventeen days of working with resentment - now write yourself free of it, on paper at least.

• What resentment are you ready to release, specifically?
• What are you choosing to open up to instead?
• How will you live differently from this greater freedom?

Write your declaration of freedom, dated today.`
  }
];

// 7. LIFE TRANSITIONS NAVIGATOR - 21-day change guidance
export const lifeTransitionsNavigatorDays = [
  {
    day: 1,
    title: "Transition Recognition",
    theme: "Awareness",
    prompt: `Name the transition you're actually in, instead of vaguely sensing something is shifting.

• What transition are you currently experiencing or anticipating - an ending, a beginning, a shift in role or identity?
• How do you know you're in transition, specifically?
• What part of this transition are you still in denial about?

Name the transition plainly, in one sentence.`
  },
  {
    day: 2,
    title: "The Neutral Zone",
    theme: "In-Between",
    prompt: `The uncomfortable in-between space is its own real place, not just a delay before the next thing.

• What does this in-between space feel like for you right now?
• What makes it so uncomfortable - the uncertainty, the loss of identity, the waiting?
• What would navigating this uncertainty with more grace actually require?

Name the one way you'll be gentler with yourself in this neutral zone.`
  },
  {
    day: 3,
    title: "What's Ending",
    theme: "Closure",
    prompt: `Something specific is ending here - name it directly instead of around it.

• What chapter of your life is ending or needs to end?
• What are you leaving behind - a role, a relationship, an identity?
• What feeling comes up as you name this ending clearly?

Name the one thing about this ending you haven't fully accepted yet.`
  },
  {
    day: 4,
    title: "Grief and Loss",
    theme: "Mourning",
    prompt: `Even a good change involves real loss - let yourself feel it before rushing past it.

• What are you actually losing in this transition, even if it's a positive one?
• Is it familiarity, identity, or security you're grieving?
• What would it mean to sit with this sadness instead of jumping to the upside?

Let yourself feel this loss for a moment before writing further.`
  },
  {
    day: 5,
    title: "Transition Fears",
    theme: "Anxiety",
    prompt: `Sort your fears honestly - some are useful preparation, others are just noise.

• What fear arises around this transition - failure, success, the unknown?
• Which fear is realistic preparation, and which is just anxiety limiting you?
• What would you do differently if the limiting fear weren't there?

Name the one fear you're ready to act despite.`
  },
  {
    day: 6,
    title: "Past Transitions",
    theme: "Experience",
    prompt: `You've already navigated real change before - notice what actually helped.

• Recall a significant transition you've navigated in the past.
• What genuinely helped you through it?
• What pattern do you notice in how you typically handle change?

Name the one lesson from a past transition that applies directly to this one.`
  },
  {
    day: 7,
    title: "Identity Shifts",
    theme: "Self-Concept",
    prompt: `Notice who you're becoming through this change, not just what's happening around you.

• How is your sense of identity shifting through this transition?
• What part of yourself are you discovering, developing, or releasing?
• Who are you becoming in this process?

Finish the sentence: "I used to be someone who ___, and now I'm becoming someone who ___."`
  },
  {
    day: 8,
    title: "Support Systems",
    theme: "Connection",
    prompt: `Notice who and what actually holds you steady during change.

• Who or what supports you during times like this - people, practices, beliefs?
• How might you activate or strengthen this support right now?
• What's stopped you from leaning on it more?

Name the one person or practice you'll reach for this week.`
  },
  {
    day: 9,
    title: "Values Compass",
    theme: "Direction",
    prompt: `When the path is unclear, your values can still point the way.

• What core value matters most to honor during this specific transition?
• How might staying connected to this value provide direction when the way forward is unclear?
• Where have you drifted from this value under the stress of change?

Name the one decision this week where you'll let this value lead.`
  },
  {
    day: 10,
    title: "Resistance and Flow",
    theme: "Acceptance",
    prompt: `Notice exactly where you're fighting this transition and where you're actually moving with it.

• Where are you resisting this change, specifically?
• Where are you already flowing with it?
• What happens in you when you fight versus when you cooperate?

Name the one place you're ready to stop resisting.`
  },
  {
    day: 11,
    title: "New Beginnings",
    theme: "Emergence",
    prompt: `Something new is trying to emerge through this change - notice what excites you about it.

• What new aspect of yourself or new possibility is emerging through this transition?
• What genuinely excites you about what might be coming?
• What's holding you back from letting yourself feel this excitement?

Name the one new possibility you're most curious about.`
  },
  {
    day: 12,
    title: "Transition Rituals",
    theme: "Ceremony",
    prompt: `A ritual can hold what words alone can't during a change like this.

• What ritual might help you honor this ending or mark this transition?
• What would a small ceremony for this specific change actually look like?
• What's stopped you from creating one already?

Design the ritual you'll actually perform this week.`
  },
  {
    day: 13,
    title: "Learning and Growth",
    theme: "Development",
    prompt: `This transition is teaching you something, whether or not you've named it yet.

• What is this transition teaching you about yourself or what matters most?
• How is this change contributing to your growth, even the hard parts?
• What insight would you not have without this specific difficulty?

Name the one lesson you're most grateful for, even reluctantly.`
  },
  {
    day: 14,
    title: "Patience with Process",
    theme: "Timing",
    prompt: `Transitions have their own timeline that doesn't respond to your impatience.

• Where are you trying to rush this transition faster than it wants to go?
• What would cultivating real patience with this process look like?
• What would trusting the unfolding, instead of forcing it, actually require?

Name the one place you'll practice more patience this week.`
  },
  {
    day: 15,
    title: "External Changes",
    theme: "Environment",
    prompt: `Your inner transformation might need an outer change to actually support it.

• What external change - living situation, work environment, routine - would support this transition?
• What outer change would align with the inner shift already happening?
• What's stopped you from making this change already?

Name the one external change you're ready to make this month.`
  },
  {
    day: 16,
    title: "Skills and Capacities",
    theme: "Development",
    prompt: `The next chapter probably requires a capacity you haven't fully built yet.

• What new skill or way of being do you need to develop for this next chapter?
• What quality would serve you well in your emerging life?
• What's stopped you from cultivating this already?

Name the one way you'll start developing this capacity this week.`
  },
  {
    day: 17,
    title: "Meaning Making",
    theme: "Purpose",
    prompt: `The meaning you assign to this transition shapes how you experience it.

• What meaning do you make of this change?
• How does it fit into your larger life story and sense of purpose?
• How might this transition actually be serving your growth, even if it doesn't feel like it?

Write the one sentence of meaning you're choosing to hold onto through this.`
  },
  {
    day: 18,
    title: "Future Visioning",
    theme: "Aspiration",
    prompt: `A vision draws you forward through change far better than fear pushes you.

• What do you hope to create, become, or experience on the other side of this transition?
• What vision genuinely excites you when you let yourself dream into it?
• What's holding you back from imagining this fully?

Name the one detail of this future vision that pulls you forward most.`
  },
  {
    day: 19,
    title: "Practical Planning",
    theme: "Strategy",
    prompt: `Practical steps support the transition without needing to control every outcome.

• What practical step - timeline, resource, preparation - would support this transition?
• How can you plan without gripping so tightly that you miss unexpected possibilities?
• What's the very next concrete action?

Name the one practical step you'll take this week.`
  },
  {
    day: 20,
    title: "Trust and Faith",
    theme: "Confidence",
    prompt: `You can't see the whole path yet - notice what helps you trust it anyway.

• What helps you trust the process when you can't see the full picture?
• Is this trust in yourself, in life's unfolding, or in something larger?
• What would cultivating more of this trust look like practically?

Name the one thing you'll lean on to trust this process a little more.`
  },
  {
    day: 21,
    title: "Embracing Change",
    theme: "Integration",
    prompt: `Twenty-one days navigating this transition - look back at what's actually shifted.

• What insight from this exploration will you carry forward?
• How has your relationship with change itself evolved?
• What commitment are you making to how you'll navigate future transitions?

Write that commitment down as a promise to your future self.`
  }
];

// 8. DIGITAL DETOX REFLECTION - 7-day technology mindfulness
export const digitalDetoxReflectionDays = [
  {
    day: 1,
    title: "Digital Awareness Audit",
    theme: "Assessment",
    prompt: `Look honestly at your actual screen time, not your guess at it.

• How much time do you actually spend on your phone, computer, or streaming daily?
• When do you reach for a device unconsciously versus with real intention?
• What did seeing the real number do to you?

Name the one digital habit that surprised you most once you looked closely.`
  },
  {
    day: 2,
    title: "Digital Triggers and Habits",
    theme: "Patterns",
    prompt: `Something specific sends you reaching for your phone - name it precisely.

• What emotion - boredom, anxiety, loneliness - triggers your device use most?
• What time of day or situation leads to mindless scrolling?
• What automatic habit have you built around technology without noticing?

Name the trigger you'll watch for today.`
  },
  {
    day: 3,
    title: "Social Media Impact",
    theme: "Social Comparison",
    prompt: `Notice what social media actually does to your mood, not what you assume it does.

• When does social media genuinely connect you to others?
• When does it trigger comparison, envy, or a flat mood instead?
• What would change if you consumed noticeably less of it?

Name the one account or habit that consistently leaves you feeling worse.`
  },
  {
    day: 4,
    title: "Information Overwhelm",
    theme: "Mental Clutter",
    prompt: `Constant input leaves less room for your own thoughts to actually surface.

• How does nonstop information consumption affect your ability to think clearly?
• What happens to your creativity when your mind is always full of external input?
• When did you last have a truly original, unprompted thought?

Name the one source of input you'll reduce today.`
  },
  {
    day: 5,
    title: "Digital Boundaries Experiment",
    theme: "Limits",
    prompt: `Pick one boundary and actually test it today instead of just thinking about it.

• Choose one boundary - phone-free meals, no devices before bed, limited social time.
• What do you notice about your attention or inner state once you try it?
• What made you want to break this boundary the most?

Name whether this boundary is worth keeping past today.`
  },
  {
    day: 6,
    title: "Analog Alternatives",
    theme: "Replacement",
    prompt: `Notice what could actually fill the space your screen currently occupies.

• What non-digital activity could replace some of your screen time - reading, conversation, nature, creating?
• What would you do with freed-up attention if you had it?
• What's stopped you from doing more of this already?

Try one analog alternative today and notice how it actually feels.`
  },
  {
    day: 7,
    title: "Mindful Technology Use",
    theme: "Integration",
    prompt: `Seven days of paying attention - now decide how you'll actually use technology going forward.

• What boundary or practice will help you use devices as tools rather than being used by them?
• What's your honest vision for a healthier relationship with technology?
• What's the first change you'll actually keep?

Write the one commitment you're making about your technology use starting tomorrow.`
  }
];

// 9. GRIEF & GROWTH - 30-day loss processing journey
export const griefAndGrowthDays = [
  {
    day: 1,
    title: "Naming Your Loss",
    theme: "Recognition",
    prompt: `Name what you're actually grieving, plainly, without minimizing it.

• What loss are you processing right now, recent or from the past?
• What words have you been using to soften or avoid naming it directly?
• What happens in your body as you name it clearly?

Write the one sentence that names this loss without any softening.`
  },
  {
    day: 2,
    title: "Grief's Many Faces",
    theme: "Emotions",
    prompt: `Grief rarely shows up as just sadness - notice its full range.

• What emotions are actually present - sadness, anger, guilt, relief, numbness?
• Which one surprises or confuses you the most?
• Is there an emotion here you feel you're not allowed to have?

Name the emotion you're most ready to stop judging in yourself.`
  },
  {
    day: 3,
    title: "The Body of Grief",
    theme: "Physical",
    prompt: `Grief lives in your body as much as your mind - notice where.

• Where does grief show up physically - fatigue, tension, appetite changes?
• What does your body specifically need right now?
• How could you care for yourself physically with more compassion this week?

Name the one physical need you'll actually tend to today.`
  },
  {
    day: 4,
    title: "What Was Lost",
    theme: "Specificity",
    prompt: `Beyond the obvious loss, notice the smaller losses hiding inside it.

• What else was lost alongside the primary loss - a plan, a routine, a part of your identity?
• Which of these secondary losses hasn't been acknowledged yet?
• Which one actually stings the most, even if it seems smaller?

Name the secondary loss you're ready to finally acknowledge.`
  },
  {
    day: 5,
    title: "Memories and Stories",
    theme: "Remembrance",
    prompt: `Some memories are worth returning to, even if they ache a little.

• What memory of what you've lost brings you genuine comfort?
• What story captures the essence of what made this precious?
• How might remembering, rather than avoiding, actually be part of healing?

Write down the one memory you want to make sure you never lose.`
  },
  {
    day: 6,
    title: "Guilt and Regret",
    theme: "Self-Compassion",
    prompt: `Guilt often rides alongside grief uninvited - meet it with compassion instead of punishment.

• What guilt or regret accompanies this loss?
• What was left unsaid, or done differently than you wish?
• Could you offer yourself the same compassion you'd offer a friend in this exact situation?

Write the one sentence of self-compassion you're most ready to actually believe.`
  },
  {
    day: 7,
    title: "Anger in Grief",
    theme: "Difficult Emotions",
    prompt: `Anger is a valid part of grief, not a betrayal of it.

• What anger is present - at the situation, at yourself, at life's unfairness?
• Have you let yourself feel this anger, or pushed it away as inappropriate?
• How might acknowledging it actually honor your loss rather than dishonor it?

Let yourself feel this anger fully for a moment before writing further.`
  },
  {
    day: 8,
    title: "Support and Isolation",
    theme: "Connection",
    prompt: `Loss changes who shows up and who disappears - notice both.

• Who has genuinely supported you through this, and who's felt absent?
• What do you actually need from others right now that you haven't asked for?
• What's stopped you from voicing this need directly?

Name the one person you'll ask for support from this week.`
  },
  {
    day: 9,
    title: "Grief Waves",
    theme: "Process",
    prompt: `Grief comes in waves, not a steady decline - notice your own pattern.

• What have you noticed about how your grief waves come and go?
• What helps you ride a wave without being knocked flat by it?
• What tends to trigger the harder waves?

Name the one thing that's actually helped you through a recent wave.`
  },
  {
    day: 10,
    title: "Meaning Making",
    theme: "Purpose",
    prompt: `Notice what beliefs are helping, or hindering, how you're making sense of this.

• How are you currently making meaning of this loss?
• What belief or philosophy is helping you, and what's making it harder?
• Is there meaning you can find here without forcing false positivity?

Name the one piece of meaning you're genuinely finding, without pretending it makes the loss okay.`
  },
  {
    day: 11,
    title: "Continuing Bonds",
    theme: "Connection",
    prompt: `Connection to what you've lost doesn't have to end just because presence did.

• If this loss involves someone who died, how do you still feel connected to them?
• If it's another kind of loss, what from it do you want to carry forward?
• How might this connection continue despite physical absence?

Name the one way you'll keep this connection alive.`
  },
  {
    day: 12,
    title: "Rituals and Ceremonies",
    theme: "Honoring",
    prompt: `A ritual can hold what words alone sometimes can't.

• What ritual might honor this loss and support your grieving?
• Would a formal ceremony or a small personal practice serve you better?
• What's stopped you from creating this ritual already?

Design the ritual you'll actually perform this month.`
  },
  {
    day: 13,
    title: "Accepting Support",
    theme: "Receiving",
    prompt: `Accepting help is its own kind of difficult during grief - notice why.

• What makes it hard for you to accept help right now?
• How might letting someone support you actually be a gift to them too?
• What would make receiving support feel safer?

Name the one kind of support you'll actually let yourself accept this week.`
  },
  {
    day: 14,
    title: "Grief's Gifts",
    theme: "Transformation",
    prompt: `Grief sometimes leaves something behind, even as it takes something away.

• What unexpected gift has this grief brought - deeper compassion, clarity, appreciation for life?
• How has this loss changed your priorities?
• Does naming a gift here feel like betrayal, or like honest observation?

Name the one gift you're ready to actually claim, without minimizing the loss itself.`
  },
  {
    day: 15,
    title: "Identity After Loss",
    theme: "Self-Concept",
    prompt: `Some part of who you are has shifted through this loss - notice what.

• How has your identity changed through this experience?
• What role or self-concept has shifted because of it?
• Who are you becoming as you integrate this into your life story?

Finish the sentence: "Before this loss I was someone who ___, and now I am someone who ___."`
  },
  {
    day: 16,
    title: "Others' Discomfort",
    theme: "Social Navigation",
    prompt: `People often don't know how to be around grief - notice how this affects you.

• How do others typically respond to your grief?
• Which responses genuinely help, and which fall flat or hurt?
• How do you navigate their discomfort while still honoring your own process?

Name the one response you wish people would stop giving you.`
  },
  {
    day: 17,
    title: "Complicated Relationships",
    theme: "Ambivalence",
    prompt: `Some losses carry both love and pain at once - let both be true.

• If this loss involves a complicated relationship, what mixed feelings are present?
• How do you grieve something that brought both joy and hurt?
• What makes this grief harder than a simpler loss might be?

Name the one mixed feeling you're ready to actually sit with, instead of picking a side.`
  },
  {
    day: 18,
    title: "Seasonal Grief",
    theme: "Cycles",
    prompt: `Certain dates and seasons will reliably bring this grief back to the surface.

• What anniversary, holiday, or seasonal change affects your grief most?
• What makes this particular time especially hard or meaningful?
• How might you prepare for this period with more compassion for yourself?

Name the upcoming date you'll prepare for differently this time.`
  },
  {
    day: 19,
    title: "Future Without",
    theme: "Reimagining",
    prompt: `Your future needs reimagining now, not abandoning.

• What does your future look like without what you've lost?
• How do you rebuild plans or dreams that were tied to it?
• What would moving forward while still honoring this loss actually look like?

Name the one piece of your future you're ready to start reimagining.`
  },
  {
    day: 20,
    title: "Small Steps Forward",
    theme: "Progress",
    prompt: `Healing doesn't require giant leaps - notice what small step is actually possible.

• What tiny step toward healing feels possible today?
• What would honoring both your grief and your capacity to heal look like at once?
• What's stopped you from taking even a small step so far?

Take that one small step today.`
  },
  {
    day: 21,
    title: "Joy and Guilt",
    theme: "Mixed Emotions",
    prompt: `Laughing again doesn't mean you've forgotten - notice the guilt that says otherwise.

• When joy or laughter arises, what feeling follows right behind it?
• Can you let yourself feel happiness without it meaning disloyalty?
• How might joy and grief actually coexist instead of compete?

Name the one moment of joy recently that you're ready to stop feeling guilty about.`
  },
  {
    day: 22,
    title: "Professional Help",
    theme: "Resources",
    prompt: `Professional support isn't a sign that you're grieving wrong.

• When might therapy, a support group, or counseling actually help right now?
• What would make seeking help feel empowering rather than like failure?
• What's stopped you from reaching out already?

Name the one resource you'll actually look into this week.`
  },
  {
    day: 23,
    title: "Patience with Process",
    theme: "Timing",
    prompt: `Grief runs on its own clock, not the one everyone else expects you to follow.

• Where are you pressuring yourself to be "further along" than you are?
• What would real patience with your own timeline look like?
• What would it mean to trust that healing unfolds on its own schedule?

Name the one expectation about your timeline you're ready to release.`
  },
  {
    day: 24,
    title: "Legacy and Impact",
    theme: "Continuation",
    prompt: `What you've lost has left something behind in you - notice what.

• What legacy does this loss leave in you, in others, or in the world?
• How has it shaped who you are or what you value?
• How might you honor this impact going forward?

Name the one way you'll carry this legacy forward.`
  },
  {
    day: 25,
    title: "Compassion Practice",
    theme: "Self-Kindness",
    prompt: `You'd never speak to a grieving friend the way you speak to yourself - notice the gap.

• What would you tell a dear friend going through this same loss?
• How does that compare to what you actually tell yourself?
• What would it take to close this gap, even slightly?

Say the words you'd tell that friend, directly to yourself, right now.`
  },
  {
    day: 26,
    title: "Creative Expression",
    theme: "Art and Grief",
    prompt: `Grief sometimes needs a form beyond words to actually move.

• What creative expression - writing, art, music, movement - might help you process this?
• What feels most natural for you to try?
• What's stopped you from expressing this creatively already?

Try one creative expression of your grief this week.`
  },
  {
    day: 27,
    title: "Wisdom from Loss",
    theme: "Learning",
    prompt: `This loss has taught you something you wouldn't have learned any other way.

• What wisdom have you gained through this experience?
• How has grief been a teacher, even an unwelcome one?
• What insight will you carry forward from this?

Write the one piece of wisdom you never want to lose from this experience.`
  },
  {
    day: 28,
    title: "Post-Traumatic Growth",
    theme: "Resilience",
    prompt: `Notice the strength this loss revealed, not just the pain it caused.

• In what way have you grown stronger, wiser, or more compassionate through this?
• What capacity did this reveal in you that you didn't know you had?
• How does this growth sit alongside the pain, without erasing it?

Name the one strength you're most surprised to have found in yourself.`
  },
  {
    day: 29,
    title: "Helping Others",
    theme: "Service",
    prompt: `What you've learned through this loss could genuinely help someone else.

• How might your experience enable you to support someone else in grief?
• What understanding or compassion has this loss given you?
• Who in your life might benefit from what you now know?

Name the one person you might be able to support with what you've learned.`
  },
  {
    day: 30,
    title: "Integration and Moving Forward",
    theme: "Wholeness",
    prompt: `Thirty days with this loss - now decide how you'll carry it forward.

• How will you carry this loss as part of your wholeness, rather than something that defines or limits you?
• What does "moving forward" actually mean to you, distinct from "moving on"?
• How will you honor both this loss and your capacity for continued growth and joy?

Write the one sentence that captures how you'll carry this forward.`
  }
];

// 10. COURAGE CULTIVATION - 12-day bravery building
export const courageCultivationDays = [
  {
    day: 1,
    title: "Defining Courage",
    theme: "Understanding",
    prompt: `Courage isn't the absence of fear - it's moving despite it, and it's worth defining precisely for yourself.

• What does courage actually mean to you, in your own words?
• How is it different from fearlessness?
• Recall a time you acted courageously - what let you move through the fear instead of being stopped by it?

Name the one quality that made that courageous moment possible.`
  },
  {
    day: 2,
    title: "Fear Inventory",
    theme: "Assessment",
    prompt: `Some fears protect you and some just quietly restrict your life - sort yours honestly.

• What fear currently limits your choices or self-expression the most?
• Which fears actually serve to protect you?
• Which ones primarily just hold you back?

Name the one fear you're most ready to stop obeying.`
  },
  {
    day: 3,
    title: "Courage Role Models",
    theme: "Inspiration",
    prompt: `Someone you admire is modeling a courage you actually want to build in yourself.

• Who do you genuinely admire for their courage?
• What specific quality do they embody?
• What can you learn from how they actually got there, not just their current bravery?

Name the one quality of theirs you'll try to practice this week.`
  },
  {
    day: 4,
    title: "Small Acts of Bravery",
    theme: "Daily Courage",
    prompt: `Courage builds through small reps, not one dramatic leap.

• What small act of courage could you practice today - speaking up, a hard conversation, trying something new?
• Which of these feels manageable enough to actually attempt?
• What's stopped you from doing this already?

Do that one small brave thing today.`
  },
  {
    day: 5,
    title: "Fear and Excitement",
    theme: "Reframing",
    prompt: `Fear and excitement feel almost identical in the body - notice how much is just interpretation.

• Recall a moment you felt both fearful and excited at once.
• What if you relabeled the fear you're feeling right now as excitement instead?
• Does anything shift when you do?

Name the one upcoming challenge you'll try reframing this way.`
  },
  {
    day: 6,
    title: "Courage in Vulnerability",
    theme: "Openness",
    prompt: `Being seen honestly requires a different kind of bravery than facing external danger.

• When has vulnerability required real courage from you?
• Recall sharing a struggle, asking for help, or showing your true self.
• How might vulnerability actually be one of the highest forms of courage?

Name the one vulnerable thing you're ready to share this week.`
  },
  {
    day: 7,
    title: "Physical Courage",
    theme: "Embodiment",
    prompt: `Courage has a physical signature - notice what it feels like in your body.

• How does courage show up physically - posture, breath, sensation?
• How is this different from how fear shows up in your body?
• What physical practice might help you access courage more readily?

Name the one physical practice you'll use before your next brave moment.`
  },
  {
    day: 8,
    title: "Moral Courage",
    theme: "Values",
    prompt: `Standing up for what's right often takes more courage than physical bravery ever does.

• When have you needed moral courage to speak up for your values?
• What makes it hardest to act when you see something wrong?
• How might you strengthen this specific kind of courage?

Name the one situation where you'll practice speaking up this week.`
  },
  {
    day: 9,
    title: "Courage and Failure",
    theme: "Risk Taking",
    prompt: `Fear of failure quietly shrinks how much courage you're willing to spend.

• How does fear of failure inhibit your courage right now?
• What would change if you saw failure as information instead of proof of inadequacy?
• What brave action has this fear been blocking?

Name the one action you'll take despite the risk of failing at it.`
  },
  {
    day: 10,
    title: "Creative Courage",
    theme: "Expression",
    prompt: `Authentic creative expression requires the courage to be seen and possibly judged.

• What would you create or share if you weren't afraid of judgment?
• What creative risk is calling to you, even though it scares you?
• What's the smallest version of this risk you could take?

Take that smallest creative risk this week.`
  },
  {
    day: 11,
    title: "Courage Support System",
    theme: "Community",
    prompt: `Some people encourage your bravery, and some quietly reinforce your fears - notice who's who.

• Who in your life genuinely supports your courage?
• Who, even unintentionally, feeds your fears instead?
• What community or relationship would help you build more of this courage?

Name the one person you'll lean on the next time you need to be brave.`
  },
  {
    day: 12,
    title: "Courage Practice",
    theme: "Integration",
    prompt: `Twelve days building courage - now decide how you'll keep choosing it daily.

• What specific practice or reminder will help you choose bravery over comfort going forward?
• What's the biggest shift in your relationship with fear since day one?
• What courageous action will you take this week to mark this progress?

Take that courageous action, and notice how it actually feels.`
  }
];

export const visualMeditationDays = [
  {
    day: 1,
    title: "Breathing Circles",
    theme: "Foundation",
    prompt: `Let each circle on the page mark one full breath, nothing more.

• Draw simple circles, one per breath cycle, without aiming for perfection.
• Notice how your breathing itself changes as you draw.
• Which circle felt most settled, and which felt rushed?

Notice what your breath was doing in the moments your hand hesitated.`
  },
  {
    day: 2,
    title: "Color and Emotion Flow",
    theme: "Emotion",
    prompt: `Let color speak your current state before your mind labels it.

• Choose colors based purely on how you feel right now.
• Let them flow across the page with no predetermined shape.
• Which color surprised you by how strongly it pulled at you?

Notice what emotion this color combination reveals that words might have missed.`
  },
  {
    day: 3,
    title: "Mindful Line Meditation",
    theme: "Lines",
    prompt: `Keep the pen moving and let the line become your only anchor.

• Draw one continuous line without lifting your pen.
• Notice exactly when your mind wanders away from the line.
• Gently bring your attention back each time, without frustration.

Notice how many times you had to return, and what that tells you about today.`
  },
  {
    day: 4,
    title: "Nature Pattern Observation",
    theme: "Patterns",
    prompt: `Choose one natural object and actually study it before you draw a single line.

• Find a leaf, flower, or stone and observe its pattern closely.
• Sketch what you actually see, not what you assume is there.
• What detail did slowing down reveal that a glance would have missed?

Notice the one pattern in this object you've genuinely never noticed before.`
  },
  {
    day: 5,
    title: "Texture Exploration",
    theme: "Texture",
    prompt: `Let your hand explore texture the way it might explore worry beads.

• Create different textures - dots, cross-hatching, scribbles, smooth areas.
• Notice how your mental state shifts as you move between techniques.
• Which texture felt most calming, and which felt most restless?

Notice which texture you'd like to return to the next time you feel anxious.`
  },
  {
    day: 6,
    title: "Shadow and Light Dance",
    theme: "Light",
    prompt: `Work only with contrast today and notice what it reveals.

• Focus entirely on shadow and light rather than objects themselves.
• Use shading to build depth and mood.
• What did working with darkness teach you about where the light actually is?

Notice one place in your life where naming the shadow might reveal more light.`
  },
  {
    day: 7,
    title: "Geometric Meditation",
    theme: "Geometry",
    prompt: `Let precision itself become the meditation today.

• Create simple geometric shapes arranged with intention.
• Notice the care each shape asks for compared to a loose sketch.
• What geometric form feels most like your current state of mind?

Notice which shape you were most drawn to repeat.`
  },
  {
    day: 8,
    title: "Water Flow Visualization",
    theme: "Flow",
    prompt: `Let your tool move like water instead of like a hand gripping a pen.

• Draw water in any form - rivers, rain, waves, drops.
• Let the tool flow rather than control each stroke.
• What did you have to let go of to actually capture flow?

Notice where in your life you're currently resisting this same kind of flow.`
  },
  {
    day: 9,
    title: "Tree of Life Meditation",
    theme: "Growth",
    prompt: `Draw a tree slowly enough to feel its growth from roots to branches.

• Spend real time on each part - roots, trunk, branches - meditatively.
• What does this particular tree represent in your life right now?
• How do you connect with its energy as you draw?

Notice which part of the tree took the longest to draw, and why.`
  },
  {
    day: 10,
    title: "Mandala Creation",
    theme: "Wholeness",
    prompt: `Build outward from the center and let each ring hold something meaningful.

• Start a simple mandala from the center, working outward.
• Let each ring represent something specific to you.
• What did symmetry and balance feel like as a meditation, not just a design choice?

Notice which ring felt the most important to get right.`
  },
  {
    day: 11,
    title: "Cloud and Sky Contemplation",
    theme: "Space",
    prompt: `Give empty space as much attention as form today.

• Draw clouds and sky, focusing on space as much as shape.
• How do you represent vastness and openness visually?
• What did this drawing require you to leave alone?

Notice how it feels in your body to leave so much of the page open.`
  },
  {
    day: 12,
    title: "Hand Meditation Study",
    theme: "Presence",
    prompt: `Draw your own hands slowly enough to actually see them.

• Draw your hands in detail, staying present with each line.
• Notice the textures, creases, and unique character of your hands.
• What story do your hands seem to tell?

Notice one detail about your hands you'd never really looked at before.`
  },
  {
    day: 13,
    title: "Abstract Emotion Release",
    theme: "Release",
    prompt: `Let whatever you're holding find its way out through color and stroke.

• Create abstract art to release an emotion you've been carrying.
• Use bold strokes, intense color, or gentle washes - whatever feels true.
• What did you feel lighter about once it was on the page?

Notice what this artwork reveals about what you were actually holding.`
  },
  {
    day: 14,
    title: "Spiral Journey Inward",
    theme: "Journey",
    prompt: `Follow a spiral either inward or outward and notice what it stirs.

• Draw spirals of varying size and style, moving in or out.
• Let each spiral be its own small journey into awareness.
• What did you discover at the spiral's center or its outer edge?

Notice which direction, inward or outward, felt more true today.`
  },
  {
    day: 15,
    title: "Peaceful Garden Scene",
    theme: "Peace",
    prompt: `Build a scene that represents tranquility, element by element.

• Create a peaceful garden or natural scene that calms you.
• Focus only on elements that bring genuine ease.
• How did your inner state shift as the peaceful imagery built up?

Notice which single element in this scene felt most restorative to draw.`
  },
  {
    day: 16,
    title: "Energy and Movement",
    theme: "Energy",
    prompt: `Let your current energy level dictate the marks you make.

• Draw your energy today through dynamic or calm marks.
• Use quick strokes if you're energized, slow ones if you're depleted.
• How did your actual energy level show up on the page without you planning it?

Notice whether the marks matched how you'd have described your energy in words.`
  },
  {
    day: 17,
    title: "Symbol of Strength",
    theme: "Strength",
    prompt: `Give your inner strength a visual form, abstract or literal.

• Create a symbol representing your inner strength.
• What visual elements convey power and resilience to you specifically?
• Does this symbol feel earned, or aspirational?

Notice the one moment in your life this symbol could represent.`
  },
  {
    day: 18,
    title: "Gratitude Visualization",
    theme: "Gratitude",
    prompt: `Draw something you're grateful for as if it deserves total attention.

• Choose something you're grateful for and draw it in loving detail.
• Let the gratitude flow through the drawing tool itself.
• How does gratitude change the actual experience of creating?

Notice one detail of this object you'd never bothered to appreciate before.`
  },
  {
    day: 19,
    title: "Moon Phases Meditation",
    theme: "Cycles",
    prompt: `Let the moon's cycle mirror something about your own right now.

• Draw the phases of the moon, or an abstract version of life cycles.
• Reflect on the rhythms currently present in your own life.
• What phase are you actually in right now?

Notice whether you're resisting or accepting this current phase.`
  },
  {
    day: 20,
    title: "Heart Center Expression",
    theme: "Love",
    prompt: `Create from whatever "heart center" means to you, without overthinking the concept.

• Let colors and shapes emerge that feel loving and open.
• What does your heart want to express right now?
• What surprised you about what came out?

Notice who or what this piece seems to actually be directed toward.`
  },
  {
    day: 21,
    title: "Integration and Wholeness",
    theme: "Integration",
    prompt: `Bring together the symbols, colors, and techniques that mattered most across this journey.

• Create a final piece integrating what's become meaningful to you.
• Which technique or color kept reappearing without you planning it?
• How has this practice changed your relationship with art and mindfulness?

Write, next to this final piece, the one thing visual meditation taught you that you didn't expect.`
  }
];

// 2. SYMBOLIC ART (18 days, Visual, Intermediate)
export const symbolicArtDays = [
  {
    day: 1,
    title: "Personal Symbol Discovery",
    theme: "Discovery",
    prompt: `Draw before you think, and let intuition choose the symbols.

• Draw whatever symbols naturally pull at your attention right now - ancient, personal, or invented.
• Resist the urge to plan; let your hand lead.
• Which symbol surprised you the most once it was on the page?

Notice what this symbol might already know about you that your mind hasn't caught up to.`
  },
  {
    day: 2,
    title: "Elements Representation",
    theme: "Elements",
    prompt: `Give each classical element - earth, water, fire, air - a symbol that's actually yours.

• Create a symbol for each element based on your own connection to it, not a textbook version.
• Which element was hardest to represent, and which came easily?
• What does your version reveal that a generic symbol wouldn't?

Notice which element you feel most aligned with right now.`
  },
  {
    day: 3,
    title: "Emotion as Symbol",
    theme: "Emotion",
    prompt: `Distill a recent strong emotion down to its simplest visual form.

• Choose a strong emotion you've felt recently and create a symbol for it.
• What shape, line, or color captures its essence?
• What did you have to strip away to get to something this simple?

Notice how it feels to look at this emotion reduced to a single symbol.`
  },
  {
    day: 4,
    title: "Life Journey Map",
    theme: "Journey",
    prompt: `Map your life using symbols instead of a literal timeline.

• Create an abstract symbolic map of your life's major events and transformations.
• What symbol represents your hardest chapter? Your best one?
• What surprised you about the shape this map took?

Notice which symbol on this map you'd like to revisit and explore further.`
  },
  {
    day: 5,
    title: "Protection and Strength Symbols",
    theme: "Protection",
    prompt: `Design something that would make you feel genuinely safe just by looking at it.

• Create a symbol of protection, safety, or inner strength.
• Draw inspiration from traditional talismans, or invent your own entirely.
• What visual element specifically makes you feel secure?

Notice where in your life you could use this symbol as a real reminder this week.`
  },
  {
    day: 6,
    title: "Growth and Transformation",
    theme: "Growth",
    prompt: `Give the process of becoming a visual shape.

• Create a symbol for growth, change, or transformation - metamorphosis, sprouting, evolving.
• What stage of transformation are you actually in right now?
• Does your symbol capture the struggle of change, or just the outcome?

Notice which part of your own transformation this symbol seems to speak to.`
  },
  {
    day: 7,
    title: "Relationship Dynamics",
    theme: "Relationships",
    prompt: `Give different relationships in your life their own distinct symbolic signature.

• Create symbols for different relationship types - family, friendship, romantic, professional.
• What visual quality distinguishes one from another?
• Which relationship symbol surprised you the most?

Notice which relationship's symbol you'd like to see change over time.`
  },
  {
    day: 8,
    title: "Dreams and Unconscious Symbols",
    theme: "Dreams",
    prompt: `Let your unconscious lead instead of your planning mind.

• Recall a recent dream, or let imagery surface without forcing it.
• What symbol emerges when you let go of conscious control?
• What surprised you about what came up?

Notice what this unconscious symbol might be trying to tell you.`
  },
  {
    day: 9,
    title: "Ancient Wisdom Interpretation",
    theme: "Wisdom",
    prompt: `Take an ancient symbol and make it genuinely yours.

• Choose an ancient symbol that draws you in - Celtic, Egyptian, Eastern, or otherwise.
• Create your own interpretation or variation of it.
• How do you honor the tradition while making it personally meaningful?

Notice what this ancient symbol has in common with something you've already created this journey.`
  },
  {
    day: 10,
    title: "Communication Without Words",
    theme: "Communication",
    prompt: `Build a small visual language that doesn't need a single letter.

• Create symbols that could communicate important concepts without words.
• What concept was hardest to represent visually?
• Would a stranger understand any of these symbols without explanation?

Notice which symbol from this set feels most universally readable.`
  },
  {
    day: 11,
    title: "Sacred Geometry Exploration",
    theme: "Sacred",
    prompt: `Let mathematical pattern speak to something beyond logic.

• Explore sacred geometric patterns - spirals, mandalas, the flower of life.
• Create your own version that feels personally meaningful.
• What about this pattern feels like more than just math?

Notice which geometric shape you were most drawn to repeat.`
  },
  {
    day: 12,
    title: "Animal Spirit Symbols",
    theme: "Animal",
    prompt: `Choose an animal and capture its essence, not its literal appearance.

• Pick an animal representing a quality you admire or want to embody.
• Create an abstract or stylized symbol based on its essence.
• What quality of this animal do you most want to grow in yourself?

Notice one small way you could embody this quality this week.`
  },
  {
    day: 13,
    title: "Seasonal Symbol Cycle",
    theme: "Seasons",
    prompt: `Capture each season's energetic quality, not its obvious imagery.

• Create symbols for each season, focusing on feeling rather than literal scenery.
• How do you symbolically show spring's renewal versus winter's rest?
• Which season's symbol came most naturally to you?

Notice which season's symbol matches how you feel right now.`
  },
  {
    day: 14,
    title: "Personal Power Symbol",
    theme: "Power",
    prompt: `Design something that could become your personal signature.

• Create a symbol representing your unique gifts and personal power.
• What visual element captures your essence and strength?
• Would this symbol still feel true to you in five years?

Notice how it feels to claim a symbol this bold as your own.`
  },
  {
    day: 15,
    title: "Healing and Restoration",
    theme: "Healing",
    prompt: `Create something you could actually use as a reminder of your capacity to heal.

• Create a symbol related to healing, restoration, or renewal.
• What imagery genuinely supports your wellbeing right now?
• Where would you actually keep this symbol so you'd see it often?

Notice what specifically about this image feels restorative to you.`
  },
  {
    day: 16,
    title: "Connection and Unity",
    theme: "Connection",
    prompt: `Give the invisible threads that connect you to others an actual shape.

• Create a symbol representing connection - to others, nature, or something larger.
• How do you visually represent something as intangible as connection?
• What relationship or bond does this symbol most remind you of?

Notice one connection in your life this symbol makes you want to nurture.`
  },
  {
    day: 17,
    title: "Future Vision Symbol",
    theme: "Future",
    prompt: `Create the symbol that would pull your future self forward.

• Design a symbol representing your hopes and vision for the future.
• What imagery genuinely energizes you when you look at it?
• Does this feel aspirational, or does it already feel a little bit true?

Notice the one small action this symbol nudges you to take this week.`
  },
  {
    day: 18,
    title: "Integration: Personal Symbol System",
    theme: "Integration",
    prompt: `Bring your strongest symbols from this journey together into one final piece.

• Review everything you've created and choose the most meaningful symbols.
• How do these symbols work together to tell your story?
• Which one feels most essential to keep using going forward?

Write, next to this final composition, what this whole symbol system reveals about who you are right now.`
  }
];


export const artisticSoulExpressionDays = [
  {
    day: 1,
    title: "Artistic Awakening",
    theme: "Creative Identity",
    prompt: `Create something with zero plan and zero expectation, purely to see what happens.

• Use any medium available and let your hand move freely for ten minutes.
• Resist the urge to judge or control what's forming.
• What emerged that you didn't consciously choose?

Notice what it felt like to create without needing it to be good.`
  },
  {
    day: 2,
    title: "Color of Your Mood",
    theme: "Emotional Palette",
    prompt: `Let color alone carry your current emotional state, no shapes required.

• Close your eyes and feel into your mood right now.
• Choose only the colors that match this feeling and let them interact.
• How do these colors talk to each other on the page?

Notice which color felt truest to how you actually feel, not how you wish you felt.`
  },
  {
    day: 3,
    title: "Memory Fragments",
    theme: "Past Expression",
    prompt: `Capture a joyful childhood memory through feeling, not literal illustration.

• Choose a memory that still brings you joy.
• Use shape, line, and color to capture its essence rather than depicting it literally.
• What texture or pattern emerged that surprised you?

Notice what detail of this memory the art captured that words alone wouldn't have.`
  },
  {
    day: 4,
    title: "Inner Critic Dialogue",
    theme: "Creative Blocks",
    prompt: `Give your inner critic a shape, then answer it with a companion piece.

• Draw or paint the voice that says your art isn't good enough.
• Create a second piece showing your supportive creative voice.
• How do these two energies actually look different on the page?

Notice which piece you're drawn to look at longer.`
  },
  {
    day: 5,
    title: "Stream of Consciousness Art",
    theme: "Intuitive Flow",
    prompt: `Let one mark lead directly into the next for fifteen unbroken minutes.

• Draw or paint without lifting your tool from the page.
• Respond only to what the previous mark suggests, not to a plan.
• What story or shape unfolded that you didn't foresee?

Notice the moment your thinking mind tried to take back control.`
  },
  {
    day: 6,
    title: "Healing Hands",
    theme: "Therapeutic Expression",
    prompt: `Give a healing process you're going through an actual visual form.

• Think of something in your life that needs healing - a relationship, a wound, a fear.
• Create art representing this healing process using gentle, nurturing marks.
• What would transformation actually look like, visually?

Notice what this piece reveals about where you actually are in this healing.`
  },
  {
    day: 7,
    title: "Abstract Self-Portrait",
    theme: "Identity Expression",
    prompt: `Portray yourself without a single physical feature.

• Use color, shape, texture, and pattern to represent your personality and essence.
• What visual element captures who you are at your core?
• What surprised you about how you chose to represent yourself?

Notice what this portrait reveals that a literal self-portrait wouldn't.`
  },
  {
    day: 8,
    title: "Texture Symphony",
    theme: "Sensory Art",
    prompt: `Make something that would be interesting to touch even with your eyes closed.

• Use cross-hatching, stippling, scribbling, or pressed materials to build texture.
• Create a piece meant to be felt, not just seen.
• How does texture convey an emotion that a flat surface couldn't?

Notice which texture felt most satisfying to create.`
  },
  {
    day: 9,
    title: "Dream Landscape",
    theme: "Subconscious Imagery",
    prompt: `Build a landscape that only exists in dreams, with no obligation to physics.

• Create an impossible, magical, or surreal environment.
• Let your subconscious guide your hand rather than planning the scene.
• What element of this landscape feels most emotionally true, even though it's impossible?

Notice what this dream landscape might be revealing about your inner world right now.`
  },
  {
    day: 10,
    title: "Transformation Journey",
    theme: "Personal Growth",
    prompt: `Show your growth journey through metaphor rather than a literal timeline.

• Depict where you've been, where you are, and where you're heading.
• Use metaphorical imagery - a butterfly, a growing tree, flowing water.
• Which stage of this journey was hardest to depict?

Notice which part of this image represents right now, today.`
  },
  {
    day: 11,
    title: "Sacred Symbols",
    theme: "Spiritual Expression",
    prompt: `Incorporate what feels sacred to you, focused on meaning rather than appearance.

• Choose symbols that feel sacred or meaningful, personal or traditional.
• Focus on their deeper significance rather than literal accuracy.
• What did you learn about your own spirituality by creating this?

Notice which symbol felt most true to include.`
  },
  {
    day: 12,
    title: "Joy Explosion",
    theme: "Celebration",
    prompt: `Let this piece be entirely unrestrained - pure celebration, no holding back.

• Use bright color and dynamic movement to celebrate pure aliveness.
• Don't temper this piece - let it be exuberant.
• What did it feel like to create without any restraint?

Notice how rarely you let yourself be this uninhibited.`
  },
  {
    day: 13,
    title: "Integration Mandala",
    theme: "Wholeness",
    prompt: `Hold every contrasting part of yourself in one circular design.

• Create a mandala integrating light and shadow, strength and vulnerability, chaos and order.
• Work from the center outward, layer by layer.
• Which layer was hardest to include honestly?

Notice how it feels to see these contrasting parts held together instead of separated.`
  },
  {
    day: 14,
    title: "Artistic Soul Celebration",
    theme: "Creative Identity",
    prompt: `Look back across everything you've made this journey and let the final piece hold what mattered most.

• Review your creations and notice your unique artistic voice.
• Create a final piece celebrating your creative soul.
• What technique or theme kept reappearing without you planning it?

Write, next to this final piece, what this journey taught you about your own creative voice.`
  }
];

export const colorPsychologyJourneyDays = [
  {
    day: 1,
    title: "Color Intuition",
    theme: "Awareness",
    prompt: `Choose colors on instinct, before your mind has time to justify them.

• Pick 3 colors that represent how you feel today, without overthinking.
• Paint or draw using only these colors for fifteen minutes.
• What memory or emotion did each color stir up?

Notice which color you almost didn't choose, and why it belongs anyway.`
  },
  {
    day: 2,
    title: "Red Exploration",
    theme: "Energy",
    prompt: `Live inside red for a while and notice what it stirs.

• Work exclusively with shades of red - crimson, scarlet, burgundy, pink.
• Notice how this color shifts your energy and mood as you create.
• What part of yourself does red seem to awaken?

Notice whether red felt like too much, or exactly enough.`
  },
  {
    day: 3,
    title: "Blue Depths",
    theme: "Calm",
    prompt: `Dive into blue's full emotional range, not just the calm version.

• Work with navy, sky, cerulean, and teal.
• Notice how blue affects your breathing and mental state as you create.
• Does blue feel purely calming, or does it carry something heavier too?

Notice the shade of blue you were most drawn to, and what that says about your mood.`
  },
  {
    day: 4,
    title: "Yellow Sunshine",
    theme: "Joy",
    prompt: `Let yellow lead the entire piece today.

• Explore lemon, gold, ochre, and cream.
• Notice what yellow teaches you about optimism and inner light.
• Did yellow feel earned today, or did you have to reach for it?

Notice the moment yellow felt most honest on the page.`
  },
  {
    day: 5,
    title: "Green Growth",
    theme: "Nature",
    prompt: `Let the full range of green connect you to growth and healing.

• Work with forest, lime, sage, and olive.
• Notice what emerges when green leads instead of you directing it.
• Which shade of green feels most like where you are in your own growth?

Notice what growth in your own life this green might be pointing toward.`
  },
  {
    day: 6,
    title: "Purple Royalty",
    theme: "Mystery",
    prompt: `Let purple reveal what feels mysterious or unresolved in your life right now.

• Work with lavender, plum, indigo, and magenta.
• Notice what purple stirs up about mystery or transformation.
• Which shade felt most like the unknown parts of your life right now?

Notice how purple makes you feel differently than the more familiar colors do.`
  },
  {
    day: 7,
    title: "Orange Enthusiasm",
    theme: "Vitality",
    prompt: `Let orange bring out your creative fire.

• Work with tangerine, peach, amber, and coral.
• Notice how this energy shows up in your marks and choices today.
• What does orange teach you about enthusiasm you've been suppressing?

Notice one place in your life that could use more of this orange energy.`
  },
  {
    day: 8,
    title: "Black & White Contrast",
    theme: "Drama",
    prompt: `Remove color entirely and notice what becomes visible.

• Work only in black and white, exploring contrast and shadow.
• Notice what emotion arises once color is stripped away.
• What do you discover about form and drama without color to hide behind?

Notice whether this felt more honest or more limiting than working in color.`
  },
  {
    day: 9,
    title: "Warm Color Symphony",
    theme: "Heat",
    prompt: `Combine red, orange, and yellow and let their heat build together.

• Create a warm color composition exploring passion and fire.
• Notice how these colors interact and amplify each other.
• What feeling do they generate together that none of them create alone?

Notice which warm color dominated without you intending it to.`
  },
  {
    day: 10,
    title: "Cool Color Harmony",
    theme: "Serenity",
    prompt: `Let blue, green, and purple settle into something calm together.

• Create a cool color piece exploring peace and depth.
• Notice how these colors support rather than compete with each other.
• What calm did this combination bring that a single color wouldn't?

Notice whether this calm felt genuine or like something you were forcing.`
  },
  {
    day: 11,
    title: "Monochromatic Study",
    theme: "Subtlety",
    prompt: `Stay with one color and find everything it's capable of.

• Choose one color and explore its full range of tints, shades, and tones.
• Notice how many different emotions a single color can actually express.
• Which variation surprised you the most?

Notice what this exercise reveals about complexity hiding inside something simple.`
  },
  {
    day: 12,
    title: "Complementary Tension",
    theme: "Opposition",
    prompt: `Put opposite colors next to each other and notice the friction.

• Work with a complementary pair - red/green, blue/orange, or yellow/purple.
• Notice the tension and vibrancy this opposition creates.
• What energy emerges specifically from this clash?

Notice where in your life a similar tension between opposites is currently playing out.`
  },
  {
    day: 13,
    title: "Analogous Comfort",
    theme: "Harmony",
    prompt: `Stay within a family of neighboring colors and notice the ease.

• Use analogous colors - neighbors on the color wheel.
• Notice the comfort and unity this creates compared to yesterday's tension.
• How do similar colors create flow rather than friction?

Notice whether this harmony feels more true to you than yesterday's contrast.`
  },
  {
    day: 14,
    title: "Triadic Balance",
    theme: "Vibrancy",
    prompt: `Balance three evenly spaced colors and notice what equilibrium feels like.

• Work with three colors equally spaced on the color wheel.
• Notice how they balance and energize each other.
• What dynamic relationship emerges that a two-color scheme wouldn't create?

Notice which of the three colors you were most tempted to let dominate.`
  },
  {
    day: 15,
    title: "Emotional Color Mapping",
    theme: "Feelings",
    prompt: `Map your entire emotional landscape using color instead of words.

• Create a visual map of your current emotional state using color.
• Notice how these colors relate to each other spatially.
• Which feeling took up the most space on the page?

Notice which emotion you almost left off the map entirely.`
  },
  {
    day: 16,
    title: "Memory Colors",
    theme: "Past",
    prompt: `Let color transport you back to a specific memory.

• Identify colors connected to your most precious memories.
• Create art exploring these memory-colors specifically.
• Which hue instantly pulled you back to a particular time and place?

Notice what detail of that memory the color brought back that you'd forgotten.`
  },
  {
    day: 17,
    title: "Seasonal Colors",
    theme: "Cycles",
    prompt: `Let the season you're in, or the one calling to you, choose your palette.

• Explore the colors of your current season, or one that's calling to you.
• Notice how these colors reflect your inner state right now.
• What season actually lives in your soul at this moment?

Notice whether this matches or contradicts the literal season outside.`
  },
  {
    day: 18,
    title: "Cultural Color Stories",
    theme: "Heritage",
    prompt: `Explore colors carrying meaning beyond just your personal taste.

• Choose colors with cultural significance to you, or that draw you from elsewhere.
• Notice what story these colors tell.
• How do they connect you to something larger than your individual experience?

Notice which cultural color association surprised you the most.`
  },
  {
    day: 19,
    title: "Healing Colors",
    theme: "Wellness",
    prompt: `Let color act as medicine today.

• Choose colors that feel healing or nurturing to you right now.
• Create art focused entirely on supporting your wellbeing.
• How might color actually function as medicine for your soul?

Notice which color you'll want to return to the next time you need this healing.`
  },
  {
    day: 20,
    title: "Future Color Vision",
    theme: "Aspiration",
    prompt: `Let your hopes for the future choose their own palette.

• Choose colors representing your hopes and dreams ahead.
• Create a composition embodying these aspirations.
• How do these colors actually inspire or motivate you?

Notice which color from this vision you could bring into your life today.`
  },
  {
    day: 21,
    title: "Personal Color Palette",
    theme: "Integration",
    prompt: `Twenty-one days with color - now name the palette that's actually you.

• Based on this journey, choose the colors that most authentically represent you.
• Notice which colors kept reappearing without you intending it.
• What is your unique color language, distilled?

Write down your personal palette and where you'll use it going forward.`
  }
];

// 12. SACRED GEOMETRY SOUL - 14-day spiritual pattern creation
export const sacredGeometrySoulDays = [
  {
    day: 1,
    title: "Circle Meditation",
    theme: "Wholeness",
    prompt: `Build outward from a single circle and see what completeness wants to look like.

• Start with a circle in the center and spend twenty minutes adding patterns outward.
• Notice what emerges when you work from the center rather than the edges.
• How does the circle itself seem to represent wholeness to you?

Notice the ring you were most reluctant to finish.`
  },
  {
    day: 2,
    title: "Triangle Power",
    theme: "Direction",
    prompt: `Let triangles direct your attention instead of just filling space.

• Create compositions using triangles of different sizes and orientations.
• Notice how they pull your eye toward a point.
• What does this shape suggest about stability versus aspiration?

Notice which direction your triangles kept pointing without you intending it.`
  },
  {
    day: 3,
    title: "Square Foundation",
    theme: "Stability",
    prompt: `Build from squares and notice what real structure feels like.

• Work with squares and rectangles as your foundation.
• Notice how these four-sided forms create stability in the composition.
• What do they teach you about being grounded?

Notice whether this structure felt reassuring or confining today.`
  },
  {
    day: 4,
    title: "Pentagon Harmony",
    theme: "Balance",
    prompt: `Explore five-sided form and the golden ratio hiding inside it.

• Create with pentagonal patterns, noticing the golden ratio within them.
• Notice where the number five shows up in nature around you.
• What harmony does this shape create that a square or triangle doesn't?

Notice what balance in your own life this shape might be echoing.`
  },
  {
    day: 5,
    title: "Hexagon Network",
    theme: "Connection",
    prompt: `Let six-sided forms show you how connection actually tessellates.

• Create hexagonal patterns - honeycomb, crystal, molecular structures.
• Notice how these shapes connect and interlock efficiently.
• What does this teach you about community and natural cooperation?

Notice where in your life this same kind of interlocking connection is happening.`
  },
  {
    day: 6,
    title: "Spiral Journey",
    theme: "Growth",
    prompt: `Follow a spiral's curve and let it lead your creativity somewhere unplanned.

• Draw spirals - Fibonacci, galaxies, shells, DNA helixes.
• Follow the curve without deciding where it ends.
• What does the spiral teach you about growth, time, and cycles?

Notice where you are in your own spiral right now - expanding or drawing inward.`
  },
  {
    day: 7,
    title: "Mandala Creation",
    theme: "Centering",
    prompt: `Build a traditional mandala and let each section hold an intention.

• Create a symmetrical mandala from the center outward.
• As you add each section, hold a quality you want to cultivate.
• Which quality was hardest to hold in mind while working?

Notice which section of the mandala feels most alive to you.`
  },
  {
    day: 8,
    title: "Flower of Life",
    theme: "Sacred Pattern",
    prompt: `Study the Flower of Life and let your version teach you something new.

• Create your own version of the Flower of Life - overlapping circles forming a geometric flower.
• Notice what this ancient symbol suggests about interconnection.
• What surprised you about how the overlapping circles behave?

Notice which part of this pattern felt the most meditative to draw.`
  },
  {
    day: 9,
    title: "Golden Ratio Art",
    theme: "Divine Proportion",
    prompt: `Bring the golden ratio into your work and notice where it already exists around you.

• Incorporate the golden spiral or golden rectangle into your piece.
• Notice where this proportion shows up in nature around you.
• What did working with this ratio reveal about natural beauty?

Notice one place in your own life that already embodies this kind of proportion.`
  },
  {
    day: 10,
    title: "Platonic Solids",
    theme: "Elemental Forms",
    prompt: `Draw the five Platonic solids and notice which one you're drawn to.

• Depict the tetrahedron, cube, octahedron, dodecahedron, and icosahedron.
• Each was linked to an element by ancient philosophers - which resonates with you?
• What does this shape suggest about your current state?

Notice why this particular solid feels most like you right now.`
  },
  {
    day: 11,
    title: "Vesica Piscis",
    theme: "Intersection",
    prompt: `Explore the shape made by two overlapping circles and notice what it represents for you.

• Create the vesica piscis - the lens shape where two circles intersect.
• Notice how this form has represented the meeting of heaven and earth in religious art.
• What intersection in your own life needs honoring right now?

Notice which two parts of your life this overlapping shape might represent.`
  },
  {
    day: 12,
    title: "Fractal Patterns",
    theme: "Infinite Repetition",
    prompt: `Let a pattern repeat at different scales and notice what that reveals about reality.

• Create fractal-inspired art - branches, lightning, coastlines, blood vessels.
• Notice how self-similar patterns repeat at every scale.
• What does this suggest about patterns repeating in your own life?

Notice the one personal pattern that keeps repeating at different scales in your life.`
  },
  {
    day: 13,
    title: "Personal Sacred Symbol",
    theme: "Individual Meaning",
    prompt: `Design a sacred symbol that's entirely your own.

• Combine geometric elements that speak to your spiritual journey or core beliefs.
• Notice which forms most resonate with your inner truth.
• What did you have to leave out to keep this symbol clear?

Notice where you'd actually want to keep or display this symbol.`
  },
  {
    day: 14,
    title: "Sacred Integration",
    theme: "Harmony",
    prompt: `Bring together the geometric forms that resonated most across this journey.

• Create a final piece combining the shapes that meant the most to you.
• Notice how these forms work together to create balance.
• What has this exploration of geometry taught you about order and beauty?

Write, next to this final piece, the one thing sacred geometry revealed to you about yourself.`
  }
];

// 13. NATURE SKETCHING SANCTUARY - 10-day outdoor observation drawing
export const natureSketchingSanctuaryDays = [
  {
    day: 1,
    title: "Outdoor Awareness",
    theme: "Presence",
    prompt: `Sit still outside for ten minutes before you draw a single line.

• Notice what actually captures your attention - texture, light, movement.
• Begin sketching whatever pulled at your eye first.
• What did sitting quietly reveal that rushing straight to drawing wouldn't have?

Notice what you almost overlooked before you sat down.`
  },
  {
    day: 2,
    title: "Tree Portraits",
    theme: "Structure",
    prompt: `Look at one tree long enough to see its actual character.

• Sketch its overall form, then focus on bark, leaf pattern, branch relationships.
• What personality does this specific tree seem to express?
• What detail did you only notice once you slowed down?

Notice what this tree's structure might be teaching you about resilience or growth.`
  },
  {
    day: 3,
    title: "Sky Studies",
    theme: "Atmosphere",
    prompt: `Try to sketch something that refuses to hold still.

• Draw cloud formations, quality of light, or weather moving through.
• Notice what technique helps capture something this ephemeral.
• What did you learn about light and atmospheric perspective?

Notice how it feels to draw something you know will be gone in minutes.`
  },
  {
    day: 4,
    title: "Ground Textures",
    theme: "Foundation",
    prompt: `Look down instead of up and sketch what's actually beneath your feet.

• Draw grass, rock, soil, or fallen leaves in close detail.
• Notice the varied textures that make up nature's actual foundation.
• Which texture was hardest to represent accurately?

Notice what "foundation" in your own life this ground might be echoing.`
  },
  {
    day: 5,
    title: "Water in Motion",
    theme: "Flow",
    prompt: `Sketch something that never stops changing shape.

• Find moving water - a stream, fountain, or rain puddle.
• Notice what technique captures its movement and reflection.
• What did you have to let go of to draw something so unfixed?

Notice where in your life you're resisting this same kind of flow.`
  },
  {
    day: 6,
    title: "Botanical Details",
    theme: "Intimacy",
    prompt: `Get close enough to a plant to see what you'd normally miss.

• Examine flower structure, leaf arrangement, seed pods, or fruit closely.
• Create a detailed study capturing both accuracy and life force.
• What did proximity reveal that distance had hidden?

Notice the one detail in this plant you've genuinely never seen before.`
  },
  {
    day: 7,
    title: "Wildlife Observation",
    theme: "Animation",
    prompt: `Try to capture something that won't hold still for you.

• Sketch any wildlife you encounter, even if it moves quickly.
• Focus on essential form and movement rather than perfect detail.
• What did you learn about drawing life in motion?

Notice which quick sketch, however rough, actually captured something true.`
  },
  {
    day: 8,
    title: "Landscape Composition",
    theme: "Perspective",
    prompt: `Organize an entire scene into foreground, middle, and background.

• Sketch a broader landscape showing real depth and space.
• Notice how you decide what belongs in each layer.
• What did organizing a complex scene teach you about composition?

Notice which layer of this landscape pulled your attention most.`
  },
  {
    day: 9,
    title: "Seasonal Characteristics",
    theme: "Time",
    prompt: `Capture what makes this exact moment in the year unique.

• Sketch the specific colors, plant states, and light quality of right now.
• Notice what makes this season different from any other.
• What would someone recognize instantly about this exact time of year?

Notice which detail feels the most fleeting, worth capturing before it changes.`
  },
  {
    day: 10,
    title: "Nature Integration",
    theme: "Connection",
    prompt: `Bring together everything you've noticed across this week outdoors.

• Create a final piece combining elements from your week of observation.
• Notice how this focused attention has changed how you actually see nature.
• What connection to the outdoors feels different now than on day one?

Write, next to this final piece, the one way you'll keep looking this closely at nature going forward.`
  }
];

// 14. ABSTRACT EMOTIONS - 12-day non-representational expression
export const abstractEmotionsDays = [
  {
    day: 1,
    title: "Pure Feeling",
    theme: "Raw Expression",
    prompt: `Skip recognizable form entirely and let your current feeling move straight onto the page.

• Use only color, shape, line, and texture to express how you feel right now.
• Resist the urge to make anything look like an object.
• What emerged that surprised you once you let feeling lead instead of planning?

Notice what this piece reveals about your actual state, more honestly than words might.`
  },
  {
    day: 2,
    title: "Joy Abstraction",
    theme: "Happiness",
    prompt: `Strip joy of any face or scene and find its pure visual form.

• Use dancing lines, bright color, or flowing shapes with no literal representation.
• Notice what makes a mark actually read as "joyful" versus just "colorful."
• What surprised you about how joy wanted to move on the page?

Notice the last time you actually felt joy this uncomplicated.`
  },
  {
    day: 3,
    title: "Anger Energy",
    theme: "Intensity",
    prompt: `Let anger have its full shape on the page instead of softening it into something polite.

• Use jagged lines, harsh color, or forceful marks to express real frustration.
• Notice what it feels like to release this safely through non-representational marks rather than words.
• What shape did the anger actually take once you stopped controlling it?

Notice what's underneath this anger that the shapes might be pointing to.`
  },
  {
    day: 4,
    title: "Sadness Depth",
    theme: "Melancholy",
    prompt: `Give sadness weight and depth instead of a single color.

• Use color, texture, or form to express the actual heaviness of sorrow.
• Notice what makes a mark read as sad rather than just dark.
• How do you make something this internal visible?

Notice what this piece reveals about a sadness you haven't fully named yet.`
  },
  {
    day: 5,
    title: "Fear Fragments",
    theme: "Anxiety",
    prompt: `Let fear speak through the page without censoring it.

• Use jagged lines, unsettling color, or fragmented forms.
• Notice what emerges when you don't soften what fear actually looks like.
• What did you feel in your body as you let this fear take shape?

Notice which fragment of this piece feels closest to what's actually worrying you right now.`
  },
  {
    day: 6,
    title: "Love Flowing",
    theme: "Connection",
    prompt: `Let love take a shape that has nothing to do with hearts or faces.

• Use flowing lines, warm color, or embracing shapes to express it non-literally.
• Notice what form love actually wants to take today.
• Who or what were you picturing as you created this, even unconsciously?

Notice what this abstract shape reveals about how you actually experience love.`
  },
  {
    day: 7,
    title: "Confusion Chaos",
    theme: "Uncertainty",
    prompt: `Let chaos actually guide the process instead of resisting it.

• Allow uncertainty and disorder to direct your marks rather than planning them.
• Notice if there's a strange beauty hiding inside the confusion.
• What did letting go of control reveal that careful planning wouldn't have?

Notice what current situation in your life this chaotic piece might be echoing.`
  },
  {
    day: 8,
    title: "Peace Simplicity",
    theme: "Calm",
    prompt: `Strip this piece down until only true calm remains.

• Use minimal elements, subtle color, and gentle form to express serenity.
• Notice how much you can remove and still have peace come through.
• What was hardest to leave out?

Notice how rare it feels to create something this quiet.`
  },
  {
    day: 9,
    title: "Hope Rising",
    theme: "Aspiration",
    prompt: `Let hope actually rise across the page instead of sitting still.

• Use upward movement, emerging color, or light breaking through darker tones.
• Notice what specific movement makes hope feel believable rather than naive.
• What are you actually hoping for as you create this?

Notice the one real hope this piece seems to be pointing toward.`
  },
  {
    day: 10,
    title: "Complex Emotions",
    theme: "Nuance",
    prompt: `Hold two feelings at once instead of picking the simpler one.

• Express a bittersweet, nostalgic, or conflicted feeling without literal symbols.
• Notice how you show complexity without it turning into visual confusion.
• Which two emotions did you choose to combine, and why those two?

Notice a real situation in your life that actually feels this complicated right now.`
  },
  {
    day: 11,
    title: "Emotional Dialogue",
    theme: "Interaction",
    prompt: `Let two emotions actually talk to each other on the same page.

• Show two feelings in conversation or conflict - joy meeting sorrow, anger meeting compassion.
• Notice how they interact - do they blend, clash, or coexist?
• Which emotion is winning, if either is?

Notice which two feelings in your own life are currently having this same conversation.`
  },
  {
    day: 12,
    title: "Emotional Integration",
    theme: "Wholeness",
    prompt: `Bring every emotion from this journey together into one unified piece.

• Integrate multiple feelings into a single composition.
• Notice how they work together rather than canceling each other out.
• Which emotion from this whole journey was hardest to make peace with?

Write, next to this final piece, what abstract expression taught you about your own emotional range.`
  }
];

// 15. VISUAL STORYTELLING - 15-day narrative art journey
export const visualStorytellingDays = [
  {
    day: 1,
    title: "Single Image Story",
    theme: "Moment",
    prompt: `Compress an entire story into one single image.

• Choose a significant moment from your life or imagination.
• Capture it so a viewer senses the larger story around it.
• What did you have to leave out of frame to make this one moment carry the weight?

Notice what this image implies about what happened right before and right after it.`
  },
  {
    day: 2,
    title: "Before & After",
    theme: "Change",
    prompt: `Show a real transformation through just two images.

• Create a before and after - personal change, a day's progression, a season shifting.
• Notice what visual detail actually proves the change happened.
• What surprised you about how much or how little needed to shift between the two?

Notice which image, the before or the after, was harder to depict honestly.`
  },
  {
    day: 3,
    title: "Character Creation",
    theme: "Personality",
    prompt: `Build a character whose visual details reveal who they are.

• Develop a character - a version of yourself, someone you know, or invented.
• Use clothing, posture, environment, or symbols to reveal their personality.
• What detail did you include that says more than it seems to?

Notice how much of yourself ended up in this character, even if you didn't intend it.`
  },
  {
    day: 4,
    title: "Wordless Comic Strip",
    theme: "Sequence",
    prompt: `Tell a full story using only images in sequence, no words at all.

• Create a 3-6 panel strip conveying action and emotion through imagery alone.
• Notice what makes the sequence readable without any text.
• What story emerged that you didn't fully plan before starting?

Notice which panel is doing the most narrative work.`
  },
  {
    day: 5,
    title: "Emotional Journey Map",
    theme: "Internal Narrative",
    prompt: `Make an internal experience visible through imagery and layout.

• Map an emotional journey - working through a challenge, falling in love, grieving.
• Notice how you translate feeling into visual composition.
• What part of this journey was hardest to render visually?

Notice what stage of this emotional map you're actually in right now.`
  },
  {
    day: 6,
    title: "Myth & Legend",
    theme: "Archetypal Stories",
    prompt: `Bring an old story into your own contemporary voice.

• Illustrate a scene from a myth, legend, or fairy tale that resonates with you.
• Notice what universal theme in this story actually speaks to your life.
• What did you change to make this ancient story feel personally true?

Notice which character in this myth you most identify with right now.`
  },
  {
    day: 7,
    title: "Family Stories",
    theme: "Heritage",
    prompt: `Tell a piece of your family's story through image instead of words.

• Depict a specific event, tradition, or the essence of your heritage.
• Notice what detail carries the most emotional weight.
• What story did you choose to tell, and what did you leave out?

Notice what this story reveals about what your family has passed down to you.`
  },
  {
    day: 8,
    title: "Dream Narrative",
    theme: "Subconscious Story",
    prompt: `Capture a dream's illogical flow while still telling a story.

• Create a visual narrative based on a real or imagined dream.
• Notice how you keep it coherent despite the dream's strange logic.
• What symbolic image from the dream refused to make literal sense?

Notice what this dream might actually be processing from your waking life.`
  },
  {
    day: 9,
    title: "Environmental Story",
    theme: "Place Narrative",
    prompt: `Let a place tell its own story through your imagery.

• Depict your neighborhood, a natural area, or somewhere meaningful.
• Notice how this place has changed over time.
• What story do its walls, trees, or landscape seem to hold?

Notice what your own history with this place adds to the image.`
  },
  {
    day: 10,
    title: "Symbolic Journey",
    theme: "Metaphor",
    prompt: `Tell a personal story entirely through metaphor.

• Use a plant's growth, weather, or another metaphor instead of literal imagery.
• Notice what metaphor most naturally fits the story you're telling.
• What did the metaphor reveal that literal depiction wouldn't have?

Notice which part of your actual life this metaphor is quietly describing.`
  },
  {
    day: 11,
    title: "Future Fiction",
    theme: "Imagination",
    prompt: `Picture a future and tell its story visually.

• Create a scene set in your personal future or a broader vision ahead.
• Notice what you chose to include - hope, technology, evolution.
• What does this future story reveal about what you actually want?

Notice the one detail from this future you'd like to start building toward now.`
  },
  {
    day: 12,
    title: "Collaborative Story",
    theme: "Multiple Perspectives",
    prompt: `Tell one story from two different vantage points, or invite the viewer in.

• Depict the same event from two perspectives, or leave room for viewer interpretation.
• Notice how the story changes depending on who's telling it.
• What did you learn by seeing the same moment through another lens?

Notice which perspective you naturally favored, and why.`
  },
  {
    day: 13,
    title: "Micro-Story",
    theme: "Compression",
    prompt: `Compress a whole narrative into the smallest possible space.

• Create a tiny sketch or minimal image that implies something vast.
• Notice how much story a single small detail can actually hold.
• What did you have to trust the viewer to infer?

Notice how it feels to say less and imply more.`
  },
  {
    day: 14,
    title: "Interactive Narrative",
    theme: "Engagement",
    prompt: `Make a story that reveals itself differently depending on how it's viewed.

• Create imagery with hidden elements, multiple reading paths, or angle-dependent reveals.
• Notice what changes about the story depending on how someone looks at it.
• What did you want a viewer to discover only on a second look?

Notice what this layered structure reveals about how you experience your own story.`
  },
  {
    day: 15,
    title: "Personal Mythology",
    theme: "Life Story",
    prompt: `Depict the ongoing myth you're actually living.

• Create a visual representation of your personal mythology - key stories and themes.
• Notice which recurring theme shows up across your whole life, not just recent events.
• How do you tell the story of who you're becoming, not just who you've been?

Write, next to this final piece, the one theme of your personal mythology you want to keep writing.`
  }
];

// 🖤 SURPRISE BONUS PATH! 🖤
// 16. INK & ESSENCE: BLACK INK MASTERY - 33-day intensive drawing journey
export const inkAndEssenceDays = [
  // WEEK 1: FOUNDATIONS (Days 1-7)
  {
    day: 1,
    title: "First Mark",
    theme: "Beginning",
    prompt: `Make one mark with black ink and feel exactly how permanent it is.

• Use a brush, pen, or dip pen for your very first stroke.
• Notice the confidence, or hesitation, required knowing you can't erase it.
• What did this teach you about commitment in the moment you made it?

Notice whether you rushed the mark to get it over with, or actually let yourself feel its weight.`
  },
  {
    day: 2,
    title: "Line Liberation",
    theme: "Freedom",
    prompt: `Fill the page with every kind of line your hand can make.

• Explore thick, thin, confident, hesitant, curved, broken, continuous lines.
• Notice which type of line came most naturally, and which felt foreign.
• What emotion did each type of line seem to carry?

Notice which line on the page feels most like your current state of mind.`
  },
  {
    day: 3,
    title: "Brushstroke Meditation",
    theme: "Flow",
    prompt: `Let repetition itself become the meditation today.

• Practice basic brushstrokes, or flowing pen movements if you have no brush.
• Focus on rhythm rather than outcome.
• At what point did the marks stop feeling effortful and start feeling automatic?

Notice how your breathing changed as the repetition continued.`
  },
  {
    day: 4,
    title: "Texture Symphony",
    theme: "Surface",
    prompt: `See how many different surfaces you can suggest with ink alone.

• Try crosshatching, stippling, scribbling, and washing.
• Notice which technique felt most satisfying to execute.
• How many distinct textures did you manage with just one color?

Notice which texture you'd like to use again in a future piece.`
  },
  {
    day: 5,
    title: "Light from Darkness",
    theme: "Contrast",
    prompt: `Paint with darkness and let the white paper do the work of light.

• Leave areas of paper untouched and surround them with ink.
• Notice how strange it feels to create light by adding darkness around it.
• What emerged from this reversed way of thinking?

Notice which area of white space feels most important to the whole piece.`
  },
  {
    day: 6,
    title: "Ink Washes",
    theme: "Water",
    prompt: `Learn to make grays exist in a medium that's only supposed to be black.

• Dilute ink with water, or layer thin lines if your ink doesn't wash.
• Practice controlling wetness and dryness deliberately.
• What tone surprised you the most once it dried?

Notice which wash felt closest to capturing an actual mood.`
  },
  {
    day: 7,
    title: "Week One Reflection",
    theme: "Foundation",
    prompt: `Bring line, texture, contrast, and wash together into one piece.

• Combine everything you've explored this week into a single composition.
• Notice which technique you reached for most instinctively.
• What has working only in black ink taught you about simplicity so far?

Write, next to this piece, the one technique you most want to develop further.`
  },

  // WEEK 2: OBSERVATION (Days 8-14)
  {
    day: 8,
    title: "Blind Contour",
    theme: "Seeing",
    prompt: `Draw without looking at the page and see what your hand actually knows.

• Draw an object without glancing down at your paper at all.
• Embrace the wonky, honest lines that result.
• What did this teach you about seeing versus drawing from memory?

Notice which part of the object your hand rendered most accurately without looking.`
  },
  {
    day: 9,
    title: "Still Life Studies",
    theme: "Form",
    prompt: `Reduce a still life to its essential forms and shadows.

• Set up simple objects and draw them focusing on form, not detail.
• Notice which details were actually unnecessary once you simplified.
• How do you suggest three dimensions using only black and white?

Notice the one shadow that did the most work to make the object feel real.`
  },
  {
    day: 10,
    title: "Portrait Essence",
    theme: "Character",
    prompt: `Capture a person's essence instead of photographic accuracy.

• Draw yourself, a loved one, or someone who inspires you.
• Focus on what makes them recognizable, not on precision.
• What's the minimum number of strokes that still reads as them?

Notice which single stroke carries the most of their character.`
  },
  {
    day: 11,
    title: "Nature Studies",
    theme: "Organic",
    prompt: `Take your ink to something irregular and let it adapt.

• Draw plants, trees, rocks, or clouds from life if possible.
• Notice how ink behaves differently with organic forms versus geometric ones.
• What surprised you about representing something so irregular?

Notice which natural form felt most satisfying to render.`
  },
  {
    day: 12,
    title: "Architecture & Structure",
    theme: "Built World",
    prompt: `Give hard edges and straight lines to a fluid medium.

• Draw buildings, bridges, or other constructed structures.
• Notice how you represent perspective and geometry with flowing ink.
• What's the relationship between the natural and built forms you've drawn so far?

Notice which structural line was hardest to keep straight and confident.`
  },
  {
    day: 13,
    title: "Movement & Gesture",
    theme: "Action",
    prompt: `Capture motion in a medium that only makes static marks.

• Draw dancing figures, animals in motion, wind, or flowing water.
• Notice what gesture actually implies movement rather than a frozen pose.
• How do you suggest time passing in a single still image?

Notice which line in this piece feels like it's still moving.`
  },
  {
    day: 14,
    title: "Observational Integration",
    theme: "Seeing Deeply",
    prompt: `Combine everything you've studied this week into one complex piece.

• Create a piece integrating multiple elements from this week's observation practice.
• Notice how working in ink has changed the way you actually see things.
• What do you notice now that you missed two weeks ago?

Write, next to this piece, the one thing you see differently now than on day one.`
  },

  // WEEK 3: EXPRESSION (Days 15-21)
  {
    day: 15,
    title: "Emotional Landscapes",
    theme: "Inner Terrain",
    prompt: `Let an emotion become a landscape instead of a face.

• Create an abstract landscape representing an emotional state, not a real place.
• Notice what depression, joy, or anxiety might look like as terrain.
• What weather or geography emerged that surprised you?

Notice which part of this inner landscape you're currently standing in.`
  },
  {
    day: 16,
    title: "Memory Fragments",
    theme: "Past",
    prompt: `Illustrate a memory for its feeling, not its accuracy.

• Choose a significant memory and capture its emotional truth in ink.
• Notice what detail your heart remembers that your mind might have forgotten.
• What did you exaggerate or simplify to get closer to the truth of it?

Notice what this image reveals about why this memory has stayed with you.`
  },
  {
    day: 17,
    title: "Dream Visions",
    theme: "Subconscious",
    prompt: `Let ink's permanence mirror the strange, irreversible logic of dreams.

• Draw a dream or nightmare, letting the ink's fluidity match its illogic.
• Notice what imagery surfaced from your sleeping mind.
• What part of the dream refused to make sense even as you drew it?

Notice what this dream might actually be processing from your waking life.`
  },
  {
    day: 18,
    title: "Shadow Self",
    theme: "Hidden Aspects",
    prompt: `Give ink to the parts of you that usually stay hidden.

• Express an aspect of yourself you typically hide - a fear, a part still integrating.
• Approach this with curiosity rather than judgment.
• What surprised you about giving this hidden part an actual form?

Notice what this shadow piece reveals that you wouldn't say out loud.`
  },
  {
    day: 19,
    title: "Transformation Stories",
    theme: "Change",
    prompt: `Show who you were, who you are, and who you're becoming in one piece.

• Create art about your personal transformation using metaphor.
• Notice what image best captures internal change through external form.
• What metaphor did you choose, and why that one?

Notice which stage of this transformation - past, present, or becoming - felt most vivid to draw.`
  },
  {
    day: 20,
    title: "Love Letters in Ink",
    theme: "Affection",
    prompt: `Make ink express tenderness instead of just technique.

• Create a piece as a love letter to a person, place, or part of life you cherish.
• Notice how you make ink convey warmth in only black and white.
• What detail carries the most affection?

Notice what this piece reveals about how you actually experience love.`
  },
  {
    day: 21,
    title: "Expressive Integration",
    theme: "Authentic Voice",
    prompt: `Create the piece that feels most authentically you so far.

• Combine techniques you've learned with subjects that matter most to you.
• Notice what's starting to feel like your own voice in ink.
• What choice did you make in this piece purely because it felt like you?

Write, next to this piece, one word that describes your emerging voice.`
  },

  // WEEK 4: INNOVATION (Days 22-28)
  {
    day: 22,
    title: "Mixed Media Experiments",
    theme: "Combination",
    prompt: `Push ink past its traditional boundaries.

• Combine ink with coffee, tea, salt, soap, or found objects.
• Notice what new texture or effect emerged from this combination.
• What happened that you couldn't have predicted?

Notice which experimental effect you'd like to use again deliberately.`
  },
  {
    day: 23,
    title: "Calligraphy Fusion",
    theme: "Text & Image",
    prompt: `Let words become visual and visuals become linguistic.

• Combine text and image so meaning and aesthetics merge.
• Write with brushstrokes, or let letters transform into drawing.
• What did you learn about where language ends and image begins?

Notice which word or letter became the most visually alive.`
  },
  {
    day: 24,
    title: "Large Scale",
    theme: "Expansion",
    prompt: `Work bigger than you're comfortable with.

• Use the largest paper available, or work across multiple sheets.
• Notice how scale changes your relationship to the ink and your own body.
• What emerged when you had to move your whole arm, not just your wrist?

Notice what this larger scale allowed that a small page wouldn't have.`
  },
  {
    day: 25,
    title: "Miniature Mastery",
    theme: "Precision",
    prompt: `Work as small as you possibly can and notice the discipline it requires.

• Create a detailed ink drawing in a tiny format.
• Notice the control and focus this scale demands.
• How do you keep expressiveness alive when working this small?

Notice which tiny detail took the most patience to get right.`
  },
  {
    day: 26,
    title: "Time-Based Ink",
    theme: "Temporal",
    prompt: `Make time itself visible through static marks.

• Create a piece or series representing duration or change over time.
• Notice how you suggest "before and after" without motion.
• What does "now" actually look like once you try to draw it?

Notice which part of this piece represents the present moment.`
  },
  {
    day: 27,
    title: "Collaborative Ink",
    theme: "Shared Creation",
    prompt: `Let someone else's hand meet yours on the same page.

• Collaborate with someone else, or create something inviting others to add to it.
• Notice how ink works as a medium for shared creativity.
• What happened when you gave up sole control of the piece?

Notice what surprised you about seeing your work merge with someone else's.`
  },
  {
    day: 28,
    title: "Innovation Integration",
    theme: "New Techniques",
    prompt: `Bring your best experiments together into one cohesive piece.

• Combine your most successful experimental techniques from this month.
• Notice which new approach to ink surprised you the most.
• How might these innovations continue developing in future work?

Write, next to this piece, the one experimental technique you'll keep exploring.`
  },

  // WEEK 5: MASTERY (Days 29-33)
  {
    day: 29,
    title: "Technical Mastery Piece",
    theme: "Skill",
    prompt: `Push yourself to execute something genuinely complex.

• Create your most technically accomplished ink piece yet.
• Notice what you can do now that you couldn't a month ago.
• What part of this piece stretched your skill the most?

Notice the exact moment you felt real confidence in your technique.`
  },
  {
    day: 30,
    title: "Emotional Depth Piece",
    theme: "Feeling",
    prompt: `Create the piece that moves you the most, regardless of technique.

• Make your most emotionally resonant work so far.
• Notice how ink has become a language for your deepest expression.
• What did you feel while making this that you haven't felt in earlier pieces?

Notice what this piece reveals about what you needed to express right now.`
  },
  {
    day: 31,
    title: "Personal Style Manifesto",
    theme: "Voice",
    prompt: `Name what makes your ink work recognizably yours.

• Create a piece representing your emerging personal style.
• Notice the specific characteristics that mark this as unmistakably you.
• What artistic voice has emerged that wasn't there on day one?

Write down the three qualities you'd use to describe your own style.`
  },
  {
    day: 32,
    title: "Teaching Piece",
    theme: "Sharing Knowledge",
    prompt: `Create something that could teach someone else what you've learned.

• Make a piece demonstrating a technique you've genuinely mastered.
• Notice what wisdom about ink and creativity you'd want to pass on.
• How might your work actually help someone else learn?

Notice the one piece of advice you'd give someone starting this journey today.`
  },
  {
    day: 33,
    title: "Ink & Essence Culmination",
    theme: "Mastery",
    prompt: `Create the piece that holds everything this month has given you.

• Integrate technical skill, emotional depth, personal style, and innovation into one final work.
• Notice what ink has taught you about discipline and authentic expression.
• How will you continue this practice beyond today?

Write the one sentence you want to remember about what this 33-day journey gave you.`
  }
];

export const freestyleDiscoveryDays = [
  {
    day: 1,
    title: "Today's Mental Weather",
    theme: "Current State",
    prompt: `Give your mind's current state an actual forecast.

• If your mind today were weather, what would it be - clear, stormy, foggy?
• What's actually contributing to this particular weather system?
• Is this weather typical for you lately, or unusual?

Name the one thing that would shift the forecast, even slightly, today.`
  },
  {
    day: 2,
    title: "Three Things Right Now",
    theme: "Present Moment",
    prompt: `Name three true things without overthinking any of them.

• What's exciting you right now?
• What's bothering you right now?
• What are you grateful for right now?

Notice which of these three came fastest, and which took longer to find.`
  },
  {
    day: 3,
    title: "If I Could Tell Someone...",
    theme: "Unexpressed Thoughts",
    prompt: `Say the thing you've been keeping to yourself, as if a trusted friend just asked what's really going on.

• What have you been holding back from saying out loud?
• Why haven't you said it yet?
• What would happen if you actually said it to someone this week?

Name the one person you'd actually want to hear this from you.`
  },
  {
    day: 4,
    title: "Energy & Motivation Check",
    theme: "Inner Resources",
    prompt: `Take honest stock of what's fueling you and what's draining you lately.

• What's been draining your energy the most?
• What's actually been giving you life?
• What do you need more of, or less of, right now?

Name the one adjustment that would make the biggest difference this week.`
  },
  {
    day: 5,
    title: "Random Thoughts & Observations",
    theme: "Stream of Consciousness",
    prompt: `Let whatever's bouncing around your head spill out without editing it.

• What's something you noticed today that stuck with you?
• What memory popped up out of nowhere?
• What's the background mental chatter been saying lately?

Notice which random thought actually deserves more attention than you've given it.`
  },
  {
    day: 6,
    title: "What's Changing?",
    theme: "Personal Evolution",
    prompt: `Name what's actually shifting in your life, even subtly.

• What's different about how you think about something compared to a few months ago?
• What relationship or routine is quietly evolving?
• What change have you not fully acknowledged yet?

Name the one shift you're most curious to watch unfold.`
  },
  {
    day: 7,
    title: "Week in Review",
    theme: "Integration & Discovery",
    prompt: `Look back at everything you've said this week and notice what kept surfacing.

• What theme showed up more than once across this week?
• What did you learn about your current headspace?
• What surprised you most about yourself?

Name the one insight from this week you don't want to lose.`
  }
];



// Voice Discovery Journey - 10 days
export const voiceDiscoveryDays = [
  {
    day: 1,
    title: "Finding Your Voice",
    theme: "Voice Discovery",
    prompt: `Speak about who you actually are today, without polishing it for an audience.

• Talk freely about yourself, letting go of the need to sound impressive.
• What makes you uniquely you, in your own words?
• Where did your voice hesitate, and where did it flow easily?

Notice the moment your voice sounded most like the real you.`
  },
  {
    day: 2,
    title: "Childhood Echoes",
    theme: "Voice Memory",
    prompt: `Let your childhood voice speak again, unguarded.

• How did you express yourself as a kid, before self-consciousness set in?
• What stories did you love telling back then?
• What did that younger voice know that your adult voice has forgotten?

Speak one sentence the way your childhood self would have said it.`
  },
  {
    day: 3,
    title: "Emotional Tones",
    theme: "Voice Emotion",
    prompt: `Speak about an emotion you're feeling right now and notice what your voice does.

• Talk about this feeling out loud, without softening it.
• Notice how your tone, pace, or volume shifts as you speak.
• What does your voice reveal about your inner state that your words alone wouldn't?

Notice the exact word where your voice changed the most.`
  },
  {
    day: 4,
    title: "Speaking Your Dreams",
    theme: "Voice Vision",
    prompt: `Describe your dreams out loud as if telling a close friend who actually believes in you.

• Talk about what you're working toward, letting real excitement come through.
• Notice where your voice gets more energized as you speak.
• What future are you actually building with these words?

Notice which part of this dream you said with the most conviction.`
  },
  {
    day: 5,
    title: "Voice of Gratitude",
    theme: "Voice Appreciation",
    prompt: `Speak your gratitude out loud and let warmth actually color your voice.

• Talk about what you're genuinely grateful for right now.
• Notice how appreciation changes your tone compared to your usual speaking voice.
• Which specific thing brought the most warmth into your voice?

Notice how different gratitude sounds out loud versus just thought silently.`
  },
  {
    day: 6,
    title: "Difficult Conversations",
    theme: "Voice Courage",
    prompt: `Practice speaking about something hard, and notice your voice hold both fear and strength at once.

• Talk through something challenging you're currently facing.
• Notice where your voice wavers and where it steadies.
• What truth is asking to be spoken here?

Notice the sentence that took the most courage to actually say out loud.`
  },
  {
    day: 7,
    title: "Voice of Wisdom",
    theme: "Voice Guidance",
    prompt: `Speak as if you're actually advising a younger version of yourself.

• Give advice to who you used to be, out loud.
• What wisdom does your voice carry now that it didn't back then?
• What lesson shaped how you speak today?

Notice which piece of advice you most need to hear yourself say again.`
  },
  {
    day: 8,
    title: "Creative Expression",
    theme: "Voice Creativity",
    prompt: `Let your voice play instead of just inform.

• Tell a story, share a poem, or sing, letting your creative voice flow freely.
• Notice how creativity changes your vocal expression compared to plain speech.
• What surprised you about how your voice wanted to move?

Notice which creative mode felt most natural to your voice.`
  },
  {
    day: 9,
    title: "Voice in Relationships",
    theme: "Voice Connection",
    prompt: `Reflect out loud on how you actually use your voice with the people close to you.

• How do you communicate love, boundaries, and connection through speech?
• Notice which relationship brings out your most authentic voice.
• Which relationship makes your voice smaller or more guarded?

Name the one relationship where you want your voice to show up more fully.`
  },
  {
    day: 10,
    title: "Your Authentic Voice",
    theme: "Voice Integration",
    prompt: `Nine days of vocal exploration - now speak about what you've actually discovered.

• What have you learned about your authentic voice through this journey?
• Which day's exercise revealed the most about how you speak?
• How will you carry this awareness forward?

Speak the one commitment you're making to your own voice going forward.`
  }
];

// Spoken Emotions Journey - 14 days
export const spokenEmotionsDays = [
  {
    day: 1,
    title: "The Language of Feelings",
    theme: "Emotional Vocabulary",
    prompt: `Speak about your current state with more precision than "good" or "bad."

• Describe your emotional state right now using rich, specific language.
• What nuanced feeling are you actually experiencing underneath the simple label?
• Which word did you reach for that surprised you?

Notice how it feels to say the precise word out loud instead of the vague one.`
  },
  {
    day: 2,
    title: "Joy in Your Voice",
    theme: "Vocal Joy",
    prompt: `Speak about something that brings you pure joy and notice what happens to your voice.

• Talk about this joy out loud in detail.
• Notice how your tone, pace, and energy shift as you speak about it.
• What did joy do to your voice that you don't usually notice?

Notice whether you let yourself sound as happy as you actually feel.`
  },
  {
    day: 3,
    title: "Speaking Through Sadness",
    theme: "Vocal Sadness",
    prompt: `Let yourself speak about something sad without rushing past it.

• Talk about this sadness out loud, at whatever pace it needs.
• Notice how your voice carries grief - does it shake, slow down, quiet?
• What healing happened just from saying this out loud?

Notice what your voice needed to do that silence wouldn't have allowed.`
  },
  {
    day: 4,
    title: "The Sound of Anger",
    theme: "Vocal Anger",
    prompt: `Speak about something that genuinely frustrates you, without softening it.

• Talk about this frustration out loud, honestly.
• Notice how you can express real anger while staying clear, not just loud.
• What does your voice do differently when you stop suppressing this?

Notice the moment your voice actually let the anger through instead of masking it.`
  },
  {
    day: 5,
    title: "Fear's Whisper",
    theme: "Vocal Fear",
    prompt: `Speak a fear out loud instead of keeping it locked inside your head.

• Talk about something you're afraid of.
• Notice how fear changes your voice - does it get quieter, faster, tighter?
• What happens once this fear exists outside of you, spoken aloud?

Notice whether the fear feels different now that it's been said out loud.`
  },
  {
    day: 6,
    title: "Excitement and Anticipation",
    theme: "Vocal Excitement",
    prompt: `Speak about something you're looking forward to and let your voice actually bubble with it.

• Talk about this anticipation out loud, without downplaying it.
• Notice where your voice speeds up or lifts with excitement.
• What does hope actually sound like coming out of your own mouth?

Notice which detail you got most animated describing.`
  },
  {
    day: 7,
    title: "The Calm Within",
    theme: "Vocal Peace",
    prompt: `Speak from a place of real inner peace, not performed calm.

• Find a genuine moment of serenity and speak from inside it.
• Notice what your voice sounds like when it's actually calm, not just quiet.
• How can you access this tone again the next time you need it?

Notice what it takes for your voice to genuinely settle like this.`
  },
  {
    day: 8,
    title: "Surprise and Wonder",
    theme: "Vocal Wonder",
    prompt: `Speak about something that genuinely amazes you.

• Talk about this wonder out loud, letting curiosity color your voice.
• Notice how awe changes your pacing or pitch.
• What does your voice do when it's genuinely amazed versus just being polite about it?

Notice the last time you let yourself sound this amazed about something.`
  },
  {
    day: 9,
    title: "Love's Many Voices",
    theme: "Vocal Love",
    prompt: `Speak about different kinds of love in your life and notice how your voice shifts for each.

• Talk about romantic love, family love, friendship, and self-love in turn.
• Notice how your tone actually changes across these different types.
• Which kind of love was hardest to speak about out loud?

Notice which type of love your voice sounded most tender discussing.`
  },
  {
    day: 10,
    title: "Confusion and Clarity",
    theme: "Vocal Uncertainty",
    prompt: `Speak about something you're genuinely uncertain about, without forcing a resolution.

• Talk through this uncertainty out loud, letting the confusion actually show.
• Notice how your voice searches for clarity as you speak.
• Did speaking about it out loud make anything clearer, even slightly?

Notice the moment your voice found a piece of clarity you didn't expect.`
  },
  {
    day: 11,
    title: "Pride and Accomplishment",
    theme: "Vocal Pride",
    prompt: `Speak about something you're proud of and let your voice actually claim it.

• Talk about this accomplishment out loud, without minimizing it.
• Notice how confidence changes your tone and pace.
• What achievement deserves more vocal celebration than you've given it?

Notice whether your voice let itself sound as proud as you actually feel.`
  },
  {
    day: 12,
    title: "Shame and Forgiveness",
    theme: "Vocal Healing",
    prompt: `Gently speak about something you're working to forgive yourself for.

• Talk about this out loud with as much compassion as you can manage.
• Notice how your voice can offer yourself healing, not just confession.
• What does self-compassion actually sound like coming from your own mouth?

Notice the gentlest tone you can find for this, and try to use it again later.`
  },
  {
    day: 13,
    title: "Emotional Complexity",
    theme: "Vocal Nuance",
    prompt: `Speak about a moment where you felt several emotions at once.

• Talk through a situation where your feelings genuinely contradicted each other.
• Notice how your voice can hold more than one emotion simultaneously.
• Which emotion tried to dominate the others as you spoke?

Notice whether your voice found a way to hold the contradiction without resolving it.`
  },
  {
    day: 14,
    title: "Your Emotional Voice",
    theme: "Vocal Integration",
    prompt: `Fourteen days of speaking your emotions out loud - reflect on what that actually changed.

• How has your voice become a tool for emotional expression through this journey?
• Which day's exercise revealed the most about your relationship between feeling and speech?
• What have you learned about what your voice does when you let it be honest?

Speak the one thing you never want to stop saying out loud.`
  }
];

export const vocalConfidenceDays = [
  {
    day: 1,
    title: "Voice Assessment",
    theme: "Current State",
    prompt: `Speak honestly about your actual relationship with your own voice.

• When do you feel genuinely confident speaking, and when do you shrink?
• What's the real difference between those two situations?
• What would greater vocal confidence actually change in your life?

Name the one situation where you most want this confidence to show up.`
  },
  {
    day: 2,
    title: "Authority in Voice",
    theme: "Personal Power",
    prompt: `Speak with authority about something you genuinely know well.

• Talk about this topic without hedging or apologizing for your expertise.
• Notice how knowledge and passion change your vocal confidence.
• What subject makes you feel most naturally authoritative?

Notice the exact tone your voice takes when you actually trust what you're saying.`
  },
  {
    day: 3,
    title: "Speaking Your Truth",
    theme: "Authenticity",
    prompt: `Speak a belief that matters to you, clearly and without softening it.

• Talk about a value important to you, out loud, without qualifying it.
• Notice how speaking authentically changes your voice and presence.
• Where did you want to soften or take it back?

Notice the moment your voice sounded most fully committed to what you were saying.`
  },
  {
    day: 4,
    title: "Setting Vocal Boundaries",
    theme: "Boundaries",
    prompt: `Practice saying "no" out loud and notice what it does to your voice.

• Say a boundary you need to set, using your actual voice.
• Notice how this affects your tone - does it get smaller, or does it hold steady?
• What boundary in your life needs to be spoken more clearly?

Say that boundary again, this time as if you fully mean it.`
  },
  {
    day: 5,
    title: "Overcoming Voice Fears",
    theme: "Fear Transformation",
    prompt: `Speak about your actual fear of speaking, out loud.

• Talk about a fear related to public speaking or being heard.
• What would change if this fear simply weren't there?
• Practice speaking through it rather than around it.

Notice whether naming this fear out loud made it smaller.`
  },
  {
    day: 6,
    title: "Power Posture and Voice",
    theme: "Embodiment",
    prompt: `Stand differently and notice what it does to your voice.

• Stand in a confident posture and speak about your strengths.
• Notice how your physical stance changes your vocal power.
• What's the connection between how you hold your body and how you sound?

Notice the exact posture that made your voice feel strongest.`
  },
  {
    day: 7,
    title: "Leadership Voice",
    theme: "Influence",
    prompt: `Speak as if you're actually leading people toward something.

• Talk as if inspiring a team toward a real goal.
• Notice what leadership actually sounds like in your voice.
• How could you use your voice to influence others positively?

Notice which part of this speech sounded the most genuinely convincing.`
  },
  {
    day: 8,
    title: "Handling Disagreement",
    theme: "Conflict Resolution",
    prompt: `Speak confidently about something others might push back on.

• Talk about a topic where you know people could disagree with you.
• Notice how you maintain confidence while staying open to dialogue.
• What tone lets you be firm without becoming closed off?

Notice where your voice wanted to get defensive, and where it stayed steady instead.`
  },
  {
    day: 9,
    title: "Public Speaking Practice",
    theme: "Presentation",
    prompt: `Give a mini presentation as if actually addressing a group.

• Speak about something you genuinely care about, as if to an audience.
• Notice which technique helps you feel more confident while speaking.
• What made this feel more real than just talking to yourself?

Notice the moment nerves showed up, and how you kept speaking anyway.`
  },
  {
    day: 10,
    title: "Vocal Presence",
    theme: "Charisma",
    prompt: `Speak with full presence instead of half-attention.

• Focus completely on being present while you talk.
• Notice how presence itself changes your vocal confidence.
• What does real charisma feel like from the inside, not just how it looks from outside?

Notice the difference between this and how you usually speak on autopilot.`
  },
  {
    day: 11,
    title: "Confident Conversations",
    theme: "Social Confidence",
    prompt: `Practice speaking confidently across different social situations in your head.

• Imagine speaking confidently in a meeting, a party, an interview.
• Notice what strategy helps you maintain confidence across these different contexts.
• Which situation still makes your voice shrink the most?

Name the one scenario you'll practice this confidence in this week, for real.`
  },
  {
    day: 12,
    title: "Your Confident Voice",
    theme: "Integration",
    prompt: `Twelve days building vocal confidence - now speak about what's actually changed.

• How has your relationship with your speaking voice evolved through this journey?
• Which exercise made the biggest difference?
• What practice will you keep to maintain this confidence?

Speak the one sentence you want to remember about your own voice going forward.`
  }
];

// 4. Storytelling Voice Journey - 15 days
export const storytellingVoiceDays = [
  {
    day: 1,
    title: "Your Story Foundation",
    theme: "Personal Narrative",
    prompt: `Tell who you are in under three minutes, as if meeting someone for the first time.

• Speak your story out loud without a script.
• What made you choose the details you led with?
• How did your voice carry the shape of this narrative?

Notice which part of your own story you told with the most conviction.`
  },
  {
    day: 2,
    title: "Childhood Story Time",
    theme: "Memory Narratives",
    prompt: `Tell a favorite childhood memory as if talking to a close friend.

• Bring the story to life with emotion, pacing, and detail.
• Notice where your voice naturally slowed down or sped up.
• What detail came back to you only once you started speaking it?

Notice how this story sounds different told out loud than it does in your memory.`
  },
  {
    day: 3,
    title: "Character Voices",
    theme: "Voice Acting",
    prompt: `Tell a simple story using different voices for different characters.

• Experiment with how shifting your voice brings each character to life.
• Notice which character's voice came most naturally to you.
• What surprised you about the voice you gave to someone unlike yourself?

Notice which character voice you might want to use again.`
  },
  {
    day: 4,
    title: "Emotional Storytelling",
    theme: "Feeling Through Voice",
    prompt: `Tell a story that genuinely moved you, and let the feeling come through your voice.

• Notice how your voice changes telling a happy story versus a sad one.
• Where did emotion actually break through your usual speaking pattern?
• What did you have to let go of to let the feeling show?

Notice the exact moment your voice carried more truth than your words alone.`
  },
  {
    day: 5,
    title: "Family Legends",
    theme: "Heritage Stories",
    prompt: `Tell a family story or legend that's been passed down to you.

• Practice being the keeper of this story through your own voice.
• Notice what detail you want to preserve exactly as you heard it.
• How do you honor the storytellers who came before you?

Notice what you added or changed as you told it in your own voice.`
  },
  {
    day: 6,
    title: "Humor and Voice",
    theme: "Comedy",
    prompt: `Tell a funny story and pay attention to timing.

• Focus on pacing, pauses, and delivery rather than just the words.
• Notice what makes something actually funny in the telling versus on paper.
• Where did the timing land, and where did it miss?

Notice which part of the delivery made the story land better than the content alone would have.`
  },
  {
    day: 7,
    title: "Descriptive Storytelling",
    theme: "Vivid Description",
    prompt: `Describe a beautiful place as if painting it with your voice.

• Use your voice to help a listener see, feel, and experience the place.
• Notice which sensory detail came through most vividly.
• What did you have to slow down to properly describe?

Notice which detail made this place feel most alive when spoken aloud.`
  },
  {
    day: 8,
    title: "Adventure Tales",
    theme: "Exciting Narratives",
    prompt: `Tell an adventure story, real or invented, with real energy.

• Build suspense through pacing, volume, and enthusiasm.
• Notice where your voice naturally built tension.
• What made this exciting to tell, not just to hear?

Notice the moment your own energy peaked while telling it.`
  },
  {
    day: 9,
    title: "Teaching Through Stories",
    theme: "Educational Narrative",
    prompt: `Tell a story that teaches a lesson you've actually learned.

• Use narrative, not explanation, to convey the insight.
• Notice how storytelling communicates wisdom differently than stating it directly.
• What lesson did you choose, and why that one?

Notice whether telling this story taught you something new about the lesson itself.`
  },
  {
    day: 10,
    title: "Love Stories",
    theme: "Romance and Connection",
    prompt: `Tell a story about love - romantic, familial, or friendship.

• Notice how your voice conveys warmth for this specific kind of love.
• What detail carries the most genuine affection?
• How does your voice change depending on which kind of love you're describing?

Notice which type of love your voice found easiest to speak about honestly.`
  },
  {
    day: 11,
    title: "Dream and Fantasy",
    theme: "Imaginative Narratives",
    prompt: `Invent and tell a fantasy or dream story, letting your imagination run.

• Use your voice to make impossible things feel real.
• Notice what technique makes fantasy feel believable when spoken.
• What emerged in this story that surprised even you?

Notice which detail of this fantasy actually reflects something true about you.`
  },
  {
    day: 12,
    title: "Overcoming Challenges",
    theme: "Triumph Stories",
    prompt: `Tell a story about overcoming something genuinely hard.

• Let your voice convey the struggle, not just the victory.
• Notice how you narrate the hardest part differently than the resolution.
• What did you learn that you'd want someone else to hear in this story?

Notice which part of this story might genuinely inspire someone else.`
  },
  {
    day: 13,
    title: "Cultural Stories",
    theme: "Heritage Narratives",
    prompt: `Tell a story from your cultural background or one you deeply admire.

• Notice how this storytelling tradition shapes your vocal style.
• What rhythm or pacing feels specific to this tradition?
• What do you want to honor by telling this story well?

Notice what part of this cultural story feels most personally yours.`
  },
  {
    day: 14,
    title: "Future Stories",
    theme: "Visionary Narratives",
    prompt: `Tell the story of your future as you actually hope it unfolds.

• Use your voice to make this vision feel real and achievable, not just wished for.
• Notice where your voice sounds most convinced of this future.
• What detail felt most vivid to speak about?

Notice which part of this future story you're most ready to start building today.`
  },
  {
    day: 15,
    title: "Your Storytelling Voice",
    theme: "Narrative Mastery",
    prompt: `Fifteen days of telling stories out loud - reflect on what you've discovered.

• What have you learned about your unique storytelling voice?
• Which story from this journey do you want to tell again?
• How will you keep developing this voice going forward?

Speak the one thing this journey taught you about how you tell your own story.`
  }
];

// 5. Meditation Speaking Journey - 21 days
export const meditationSpeakingDays = [
  {
    day: 1,
    title: "Mindful Voice Awareness",
    theme: "Voice Presence",
    prompt: `Notice your voice itself as you speak, not just what you're saying.

• Pay attention to breath, tone, and pace as words emerge.
• Notice how words actually feel as they leave your mouth.
• What changed once you paid this much attention?

Notice the exact moment your attention drifted from your voice back to your content.`
  },
  {
    day: 2,
    title: "Breath and Voice Connection",
    theme: "Breathing Foundation",
    prompt: `Speak only on the exhale and notice how breath actually supports your words.

• Practice letting your breath carry your speech rather than fighting it.
• Notice how conscious breathing changes your vocal presence.
• Where did you run out of breath before you ran out of words?

Notice how different this feels from your usual, unconscious way of speaking.`
  },
  {
    day: 3,
    title: "Speaking with Intention",
    theme: "Purposeful Speech",
    prompt: `Pause before speaking today and actually set an intention first.

• Notice the difference between deliberate speech and automatic reaction.
• What changed in your words once you paused first?
• Which intention was hardest to actually follow through on?

Notice how much of your day is spent speaking on autopilot versus with intention.`
  },
  {
    day: 4,
    title: "Silence and Space",
    theme: "Pause Practice",
    prompt: `Let silence do some of the talking today.

• Practice meaningful pauses inside your speech.
• Notice how silence changes the power of the words around it.
• What did you almost fill with unnecessary words?

Notice how uncomfortable, or how powerful, the silence actually felt.`
  },
  {
    day: 5,
    title: "Body Awareness While Speaking",
    theme: "Embodied Speech",
    prompt: `Notice your whole body, not just your voice, as you speak.

• Pay attention to posture, tension, and energy flow while talking.
• Notice how your physical state shapes your vocal quality.
• Where in your body did you find unexpected tension?

Notice how speaking from a grounded stance changes the sound of your voice.`
  },
  {
    day: 6,
    title: "Loving-Kindness Through Voice",
    theme: "Compassionate Speech",
    prompt: `Let compassion actually shape your tone and word choice today.

• Speak with loving-kindness toward yourself and toward others.
• Notice how intentional compassion changes your vocal quality.
• Which was harder - directing this kindness at yourself or at someone else?

Notice what your voice sounds like when compassion is genuinely present, not performed.`
  },
  {
    day: 7,
    title: "Mindful Listening and Responding",
    theme: "Responsive Presence",
    prompt: `Actually listen fully before you respond today.

• Notice the difference between a response built from deep listening and a reactive one.
• Where did you catch yourself planning your reply instead of listening?
• What changed in the quality of your responses when you truly listened first?

Notice how this changes not just what you say, but how you say it.`
  },
  {
    day: 8,
    title: "Emotional Regulation Through Voice",
    theme: "Calm Communication",
    prompt: `Use your voice deliberately to return to calm during a strong emotion.

• When a strong feeling arises, notice if conscious speech can help regulate it.
• Practice speaking through a challenge with steadiness rather than reactivity.
• What tone helped you regain composure the fastest?

Notice the specific vocal quality that signals to you that you've returned to calm.`
  },
  {
    day: 9,
    title: "Gratitude Expression",
    theme: "Appreciative Speech",
    prompt: `Let genuine gratitude actually shape your voice today.

• Speak your appreciation out loud, noticing its effect on your tone.
• What does thankfulness sound like when it's not just polite, but real?
• Which expression of gratitude felt the most true?

Notice how differently gratitude sounds when it's spoken versus just thought.`
  },
  {
    day: 10,
    title: "Present Moment Speaking",
    theme: "Here and Now",
    prompt: `Speak only about what's actually happening right now.

• Describe your current sensations, thoughts, feelings, or surroundings.
• Notice how present-moment awareness changes the quality of your speech.
• What did you notice about right now that you'd normally skip past?

Notice how much of your usual speech is actually about the past or future instead.`
  },
  {
    day: 11,
    title: "Non-Violent Communication",
    theme: "Peaceful Speech",
    prompt: `Speak without blame, judgment, or criticism today.

• Focus on expressing your needs and feelings clearly and peacefully.
• Notice where you had to catch yourself before slipping into blame.
• What changed in a difficult conversation when you spoke this way?

Notice which phrase felt hardest to say without an edge of judgment.`
  },
  {
    day: 12,
    title: "Mantra and Sacred Speech",
    theme: "Sacred Expression",
    prompt: `Speak a mantra or affirmation repeatedly and notice what shifts.

• Choose a phrase and repeat it with real intention.
• Notice how repetitive, deliberate speech affects your mental state and vocal resonance.
• What changed in your body by the tenth repetition compared to the first?

Notice which phrase you'd like to return to again this week.`
  },
  {
    day: 13,
    title: "Mindful Storytelling",
    theme: "Conscious Narrative",
    prompt: `Tell a story with complete presence, not autopilot delivery.

• Notice how mindfulness affects your pacing, emphasis, and connection to listeners.
• Where did your attention drift away from the story as you told it?
• What changed when you brought your full presence back to it?

Notice the difference between a story told mindfully and one told on autopilot.`
  },
  {
    day: 14,
    title: "Wisdom Speaking",
    theme: "Insight Sharing",
    prompt: `Speak from deep knowing instead of just intellectual opinion.

• Share an insight from a place that feels more like knowing than thinking.
• Notice how wisdom sounds different from mere information.
• What did you say that surprised you, as if it came from somewhere deeper?

Notice the tone your voice takes on when it's speaking wisdom rather than opinion.`
  },
  {
    day: 15,
    title: "Compassionate Boundaries",
    theme: "Mindful Limits",
    prompt: `Set a boundary with both kindness and real clarity.

• Practice saying "no" or establishing a limit through your voice.
• Notice how you maintain compassion while still being firm.
• What tone let the boundary land clearly without becoming harsh?

Notice how it feels to hold both kindness and firmness in your voice at once.`
  },
  {
    day: 16,
    title: "Mindful Conflict Resolution",
    theme: "Peaceful Problem-Solving",
    prompt: `Address a disagreement with mindful, present speech.

• Practice expressing a different viewpoint while staying respectful and open.
• Notice where your voice wanted to escalate, and where it stayed grounded.
• What allowed you to remain present instead of defensive?

Notice the moment openness, not certainty, moved the conversation forward.`
  },
  {
    day: 17,
    title: "Inner Voice Dialogue",
    theme: "Self-Talk Awareness",
    prompt: `Notice your internal dialogue and practice changing it out loud.

• Say your usual self-talk out loud, then notice how it actually sounds.
• Practice speaking to yourself with real kindness instead.
• What did this internal voice reveal that you don't usually confront directly?

Notice which sentence from your self-talk you're most ready to rewrite.`
  },
  {
    day: 18,
    title: "Encouraging Others",
    theme: "Supportive Speech",
    prompt: `Use your voice to genuinely encourage someone, not just to be nice.

• Speak words of real support to someone in mind.
• Notice how uplifting speech affects you as the speaker, not just the listener.
• What made these words feel true rather than generic?

Notice which words you said that you also needed to hear yourself.`
  },
  {
    day: 19,
    title: "Truth and Honesty",
    theme: "Authentic Expression",
    prompt: `Speak your truth with both courage and compassion.

• Practice saying something honest that you've been avoiding.
• Notice how you balance honesty with kindness in the delivery.
• What did courage sound like in your voice as you said it?

Notice which truth felt hardest, and most necessary, to actually speak.`
  },
  {
    day: 20,
    title: "Voice as Service",
    theme: "Giving Through Speech",
    prompt: `Consider how your voice could genuinely serve someone beyond yourself.

• Speak as if your words could contribute to healing or positive change.
• Notice what shifts when you speak in service rather than for yourself.
• What message do you have that could actually help someone else right now?

Notice who specifically your voice could serve this week.`
  },
  {
    day: 21,
    title: "Integrated Mindful Speech",
    theme: "Speech Mastery",
    prompt: `Twenty-one days of mindful speaking - reflect on what has actually changed.

• How has mindfulness transformed your relationship with your own voice?
• Which practice from this journey do you want to keep permanently?
• What does conscious, compassionate speech feel like now compared to day one?

Speak the one commitment you're making to how you'll use your voice going forward.`
  }
];

export const innerElementsDays = [
  // EARTH ELEMENT
  {
    day: 1,
    title: "Earth Foundation",
    theme: "Grounding & Stability",
    type: "text",
    element: "earth",
    prompt: `Something in your life holds steady even when everything else moves - name it precisely instead of vaguely.

• What actually grounds you, not what's supposed to?
• Trace your roots - family, values, or a place that feels like home.
• What still feels solid and unshakeable, even right now?

Name the one root you'd protect first if everything else were taken.`
  },
  {
    day: 2,
    title: "Earth Roots",
    theme: "Visual Grounding",
    type: "visual",
    element: "earth",
    prompt: `Draw what stability actually looks like for you, not what it's supposed to look like.

• Draw roots, a tree, mountains, or your childhood home - whatever represents security.
• Use earthy tones - browns, greens, deep oranges.
• What shape did security take once you actually tried to draw it?

Notice which part of this drawing feels the most solid.`
  },
  {
    day: 3,
    title: "Earth Voice",
    theme: "Spoken Foundation",
    type: "voice",
    element: "earth",
    prompt: `Speak with the steadiness of stone, not the urgency of wind.

• Talk about what makes you feel secure, letting your voice stay slow and grounded.
• Name your unshakeable truths out loud.
• What did your voice do differently when you spoke from this steadiness?

Notice the exact tone that felt most like solid ground.`
  },

  // WATER ELEMENT
  {
    day: 4,
    title: "Water Emotions",
    theme: "Emotional Flow",
    type: "text",
    element: "water",
    prompt: `Your emotions move like water - trace the current instead of just naming the weather.

• How do feelings actually flow through you day to day?
• Describe a recent current of joy, sadness, or love in detail.
• What emotion needs more room to flow freely right now?

Name the one emotional current you've been quietly damming up.`
  },
  {
    day: 5,
    title: "Water Flow",
    theme: "Visual Emotions",
    type: "visual",
    element: "water",
    prompt: `Let your hand move like water instead of controlling every line.

• Paint water in any form - river, rain, tears, ocean.
• Use blue and green tones with flowing movement.
• What emotional current did this piece end up capturing?

Notice where the flow in this piece feels blocked versus where it feels free.`
  },
  {
    day: 6,
    title: "Water Voice",
    theme: "Spoken Emotions",
    type: "voice",
    element: "water",
    prompt: `Let your voice adapt and flow instead of staying rigid.

• Speak about how you feel right now, letting your voice be fluid.
• Notice where your voice naturally rises and falls like water.
• What emotion moved through you most as you spoke?

Notice which part of your voice resisted flowing freely.`
  },

  // FIRE ELEMENT
  {
    day: 7,
    title: "Fire Passion",
    theme: "Inner Flame",
    type: "text",
    element: "fire",
    prompt: `Name what's actually burning in you right now, not what should be.

• What ignites your soul when you're honest about it?
• What wants to be transformed by this fire - anger, desire, love?
• What have you been letting smolder instead of letting burn?

Name the one thing you're ready to let this fire actually transform.`
  },
  {
    day: 8,
    title: "Fire Creation",
    theme: "Visual Passion",
    type: "visual",
    element: "fire",
    prompt: `Let your creativity blaze instead of staying careful.

• Paint fire, light, sun, or lightning using warm reds, oranges, and golds.
• Don't hold back the intensity of the color or the strokes.
• What did unrestrained color reveal about your current energy?

Notice which part of this piece feels the most alive.`
  },
  {
    day: 9,
    title: "Fire Declaration",
    theme: "Spoken Power",
    type: "voice",
    element: "fire",
    prompt: `Declare your passion out loud instead of just feeling it quietly.

• Speak your dreams and desires with real intensity.
• Let your voice carry the heat of what you actually want.
• What did you declare that surprised you with its own intensity?

Notice what you want to bring into the world with this fire.`
  }
];

// SHADOW & LIGHT INTEGRATION - 12-day duality exploration
export const shadowLightIntegrationDays = [
  {
    day: 1,
    title: "Acknowledging Shadow",
    theme: "Shadow Recognition",
    type: "text",
    modality: "writing",
    prompt: `Name a part of yourself you usually keep hidden, with curiosity instead of shame.

• What aspect of your personality, history, or emotion do you tend to hide or deny?
• Where did you learn this part needed to stay hidden?
• What would happen if you looked at it without flinching?

Name the one hidden part you're most ready to actually look at this week.`
  },
  {
    day: 2,
    title: "Visualizing Shadow",
    theme: "Shadow Expression",
    type: "visual",
    modality: "art",
    prompt: `Give your shadow self an actual shape instead of leaving it formless.

• Use dark color, hidden shapes, or abstract form to represent it.
• Notice what surprised you about the shape it took.
• Does this shadow look dangerous, or just misunderstood?

Notice what this image reveals that you wouldn't say out loud.`
  },
  {
    day: 3,
    title: "Speaking Shadow",
    theme: "Shadow Voice",
    type: "voice",
    modality: "speaking",
    prompt: `Let the part of you that usually stays silent actually speak.

• Say out loud what you usually keep to yourself.
• Give this hidden part a voice, unfiltered.
• What does it want to say that you've never let it say before?

Notice how it feels in your body to let this part finally speak.`
  },
  {
    day: 4,
    title: "Shadow Wisdom",
    theme: "Shadow Learning",
    type: "text",
    modality: "writing",
    prompt: `Your shadow has taught you something real - name it plainly.

• What strength or insight has emerged from a darker experience?
• How has struggle actually shaped your wisdom?
• What would you not know now without this shadow?

Name the one piece of wisdom your shadow gave you that you're grateful for.`
  },
  {
    day: 5,
    title: "Embracing Light",
    theme: "Light Recognition",
    type: "voice",
    modality: "speaking",
    prompt: `Speak your brightest qualities out loud instead of downplaying them.

• Talk about the parts of you that genuinely shine.
• Which gift or talent do you tend to minimize?
• What would it sound like to claim this without apologizing for it?

Notice how it feels to say something good about yourself without flinching.`
  },
  {
    day: 6,
    title: "Painting Light",
    theme: "Light Expression",
    type: "visual",
    modality: "art",
    prompt: `Give your brilliance an actual visual form.

• Use bright color, radiant shape, expansive form.
• What does your most authentic, brilliant self look like?
• What surprised you about how much space this light wanted to take up?

Notice which part of this image feels the truest to who you actually are.`
  },
  {
    day: 7,
    title: "Light Sharing",
    theme: "Light Offering",
    type: "text",
    modality: "writing",
    prompt: `Notice how your brightness actually reaches other people.

• What gift do you offer the world through your light?
• How does your brightness genuinely help others, specifically?
• Where have you been holding this light back?

Name the one way you'll share this light more freely this week.`
  },
  {
    day: 8,
    title: "Integration Dialogue",
    theme: "Shadow-Light Connection",
    type: "voice",
    modality: "speaking",
    prompt: `Let your shadow and light actually talk to each other out loud.

• Speak a conversation between these two parts of yourself.
• What does each one want the other to understand?
• How might they actually work together instead of competing?

Notice which side spoke first, and what that reveals about your current balance.`
  },
  {
    day: 9,
    title: "Visual Integration",
    theme: "Wholeness Art",
    type: "visual",
    modality: "art",
    prompt: `Hold shadow and light together in one image instead of choosing a side.

• Show the balance, tension, and necessary coexistence of both.
• What does wholeness actually look like, visually?
• Which part was harder to include honestly?

Notice whether this image feels like conflict or like peace.`
  },
  {
    day: 10,
    title: "Integration Reflection",
    theme: "Wholeness Writing",
    type: "text",
    modality: "writing",
    prompt: `Write about your whole self, shadow and light both included.

• How do both aspects actually make you complete, not just tolerable?
• What becomes possible once you stop hiding one half?
• What's still hard to accept about holding both at once?

Name the one truth about your wholeness you're most ready to accept.`
  },
  {
    day: 11,
    title: "Integrated Expression",
    theme: "Authentic Voice",
    type: "voice",
    modality: "speaking",
    prompt: `Speak from a place that owns both your shadow and your light.

• Acknowledge both without shame and without arrogance.
• What does authentic wholeness actually sound like?
• Where did your voice want to tip too far toward one side?

Notice how different this integrated voice sounds from your usual one.`
  },
  {
    day: 12,
    title: "Living Integration",
    theme: "Daily Wholeness",
    type: "text",
    modality: "writing",
    prompt: `Twelve days of shadow and light work - now decide how this actually lives in your daily life.

• How will you honor both shadow and light going forward, in practice?
• What specific habit or practice supports this ongoing wholeness?
• What's most likely to make you slip back into hiding one side?

Write the one commitment you're making to carry this integration forward.`
  }
];

// LIFE CHAPTERS TRILOGY - 15-day narrative exploration
export const lifeChaptersTrilogy = [
  {
    day: 1,
    title: "Past Chapter: Beginning",
    theme: "Origins",
    type: "text",
    modality: "writing",
    chapter: "past",
    prompt: `Trace where your story actually begins, not the sanitized version.

• What foundational experience or relationship shaped your early life the most?
• Which moment from this time still quietly runs your choices today?
• What do you remember that no one else would think to mention?

Name the one origin detail you're only now starting to understand.`
  },
  {
    day: 2,
    title: "Past Chapter: Visual Memory",
    theme: "Remembrance",
    type: "visual",
    modality: "art",
    chapter: "past",
    prompt: `Capture a significant past moment through image and color, not literal recreation.

• What image, color, or symbol captures where you've been?
• What detail from that time still feels vivid enough to paint?
• What did you choose to leave out of this memory?

Notice what this image reveals about how you actually remember this chapter.`
  },
  {
    day: 3,
    title: "Past Chapter: Spoken Stories",
    theme: "Storytelling",
    type: "voice",
    modality: "speaking",
    chapter: "past",
    prompt: `Narrate the journey from then to now, out loud, as if telling someone who needs to actually understand it.

• What story from your past needs to be told, not just remembered?
• What detail do you always include, and what do you always skip?
• What does your voice do differently when you tell this story?

Notice which part of this story you're telling for the first time out loud.`
  },
  {
    day: 4,
    title: "Past Chapter: Lessons Learned",
    theme: "Wisdom",
    type: "text",
    modality: "writing",
    chapter: "past",
    prompt: `Name what your past actually taught you, not the lesson you're supposed to have learned.

• What wisdom did this chapter genuinely give you?
• What would you tell your younger self, knowing what you know now?
• Which lesson took the longest to actually land?

Name the lesson you're still in the process of learning.`
  },
  {
    day: 5,
    title: "Past Chapter: Gratitude & Release",
    theme: "Completion",
    type: "voice",
    modality: "speaking",
    chapter: "past",
    prompt: `Speak gratitude first, then speak release, and notice the difference between them.

• What are you genuinely thankful for from this chapter?
• What are you finally ready to let go of?
• Which was harder to say out loud - the thanks or the release?

Notice what shifted in your voice between the gratitude and the release.`
  },
  {
    day: 6,
    title: "Present Chapter: Current Reality",
    theme: "Now",
    type: "text",
    modality: "writing",
    chapter: "present",
    prompt: `Describe where you actually are right now, not where you wish you were.

• What defines this current chapter of your life?
• What are you experiencing, feeling, or becoming right now?
• What would you tell a stranger about your life today, in one honest paragraph?

Name the one truth about right now you've been avoiding saying.`
  },
  {
    day: 7,
    title: "Present Chapter: Visual Snapshot",
    theme: "Current Expression",
    type: "visual",
    modality: "art",
    chapter: "present",
    prompt: `Capture your life right now in color and shape, not a posed photo.

• What color, shape, or image captures this present moment?
• What does this snapshot reveal that a photo wouldn't?
• What part of "now" was hardest to render?

Notice what mood this piece carries that you hadn't consciously named yet.`
  },
  {
    day: 8,
    title: "Present Chapter: Speaking Now",
    theme: "Current Voice",
    type: "voice",
    modality: "speaking",
    chapter: "present",
    prompt: `Speak about who you are today, not who you used to introduce yourself as.

• What's true for you right now that wasn't true a year ago?
• How have you changed, in your own words?
• What's currently emerging in you that you're still figuring out?

Notice which part of this felt the most true to say out loud.`
  },
  {
    day: 9,
    title: "Present Chapter: Current Challenges",
    theme: "Growth Edge",
    type: "text",
    modality: "writing",
    chapter: "present",
    prompt: `Name what's actually challenging you right now, without minimizing it.

• What are you currently working through?
• What growth is genuinely happening in this present chapter, even if it's hard?
• What's the part of this challenge you haven't said out loud yet?

Name the one thing about this challenge you're ready to finally admit.`
  },
  {
    day: 10,
    title: "Present Chapter: Gifts of Now",
    theme: "Present Gratitude",
    type: "voice",
    modality: "speaking",
    chapter: "present",
    prompt: `Speak about what this exact chapter is giving you, even the parts that are hard.

• What gift genuinely exists in this present moment?
• What's beautiful about right now that you've been too busy to notice?
• What would you miss about this chapter once it's over?

Notice which gift surprised you the most as you said it out loud.`
  },
  {
    day: 11,
    title: "Future Chapter: Vision",
    theme: "Possibility",
    type: "text",
    modality: "writing",
    chapter: "future",
    prompt: `Write the future chapter you're actually creating, not the one you think you should want.

• What do you genuinely envision for what's ahead?
• What are you moving toward, in concrete terms?
• What's calling you forward that you haven't taken seriously yet?

Name the one detail of this future you're most ready to start building.`
  },
  {
    day: 12,
    title: "Future Chapter: Visual Dreams",
    theme: "Imagination",
    type: "visual",
    modality: "art",
    chapter: "future",
    prompt: `Let your future vision take actual shape and color.

• What image captures what the next chapter could look like?
• What imagery genuinely excites you when you look at it?
• What did you include that surprised you?

Notice the one detail of this image you'd like to bring into your life sooner.`
  },
  {
    day: 13,
    title: "Future Chapter: Speaking Dreams",
    theme: "Declaration",
    type: "voice",
    modality: "speaking",
    chapter: "future",
    prompt: `Speak your future into existence instead of just hoping for it quietly.

• What are you declaring that you're creating?
• Let your voice carry this vision forward with real confidence.
• Which part of this declaration did you say with the most conviction?

Notice how different this feels to say out loud versus just thinking it.`
  },
  {
    day: 14,
    title: "Future Chapter: Bridge Building",
    theme: "Action",
    type: "text",
    modality: "writing",
    chapter: "future",
    prompt: `Name the actual bridge between where you are and where you're going.

• What specific action will move you from present to future?
• What will genuinely help you move forward, not just feel productive?
• What's the very first step, available to you now?

Name the one action you'll take this week to start building this bridge.`
  },
  {
    day: 15,
    title: "Trilogy Integration",
    theme: "Complete Story",
    type: "voice",
    modality: "speaking",
    chapter: "integration",
    prompt: `Speak your whole story - past, present, and future - as one connected arc.

• How do all three chapters actually connect to each other?
• What's the through-line running underneath your entire life story?
• What surprised you about hearing your own story told all at once?

Notice the one sentence that captures the throughline of your whole story.`
  }
];

// SENSORY SPECTRUM JOURNEY - 21-day five senses exploration
export const sensorySpectrumDays = [
  // SIGHT CYCLE (Days 1-5)
  {
    day: 1,
    title: "Seeing: Visual Beauty",
    theme: "Sight Appreciation",
    type: "text",
    modality: "writing",
    sense: "sight",
    prompt: `Look closely enough at your surroundings to actually describe them in detail.

• What visual beauty is capturing your attention right now?
• Describe the color, shape, light, and shadow in specific terms.
• What did you almost overlook before you really looked?

Name the one visual detail you want to remember from today.`
  },
  {
    day: 2,
    title: "Seeing: Visual Expression",
    theme: "Sight Creation",
    type: "visual",
    modality: "art",
    sense: "sight",
    prompt: `Celebrate the act of seeing itself, not just what you see.

• Paint or draw something you genuinely love looking at.
• What makes the experience of seeing this thing so pleasurable?
• What did you notice only once you tried to render it?

Notice which visual detail felt the most joyful to capture.`
  },
  {
    day: 3,
    title: "Seeing: Describing Vision",
    theme: "Sight Voice",
    type: "voice",
    modality: "speaking",
    sense: "sight",
    prompt: `Describe out loud what you see right now, in vivid, specific detail.

• Speak what's in front of you as if describing it to someone who can't see it.
• Which detail was hardest to put into words?
• What did describing it aloud reveal that just looking hadn't?

Notice how much more you saw once you had to describe it.`
  },
  {
    day: 4,
    title: "Seeing: Visual Memories",
    theme: "Sight Reflection",
    type: "text",
    modality: "writing",
    sense: "sight",
    prompt: `Some sights have stayed with you long after you looked away - name them.

• What's among the most beautiful things you've ever seen?
• What visual memory keeps returning to you unprompted?
• What has your sense of sight actually given you over the years?

Name the one image you never want to forget.`
  },

  // SOUND CYCLE (Days 5-8)
  {
    day: 5,
    title: "Hearing: Sound Landscape",
    theme: "Sound Awareness",
    type: "voice",
    modality: "speaking",
    sense: "sound",
    prompt: `Speak about the sounds actually surrounding you right now.

• Describe the sounds, rhythms, voices, and silences you can hear.
• What does your auditory world sound like at this exact moment?
• Which sound did you only notice once you started listening for it?

Notice the sound you'd miss most if it suddenly disappeared.`
  },
  {
    day: 6,
    title: "Hearing: Visual Sound",
    theme: "Sound Expression",
    type: "visual",
    modality: "art",
    sense: "sound",
    prompt: `Translate sound into something you can actually see.

• What do rhythm, music, or voice look like as shape and color?
• Create art representing the experience of hearing itself.
• What surprised you about how sound wanted to look?

Notice which sound was hardest to translate visually.`
  },
  {
    day: 7,
    title: "Hearing: Written Sounds",
    theme: "Sound Reflection",
    type: "text",
    modality: "writing",
    sense: "sound",
    prompt: `Your relationship with sound is more complicated than "like" or "dislike" - explore it.

• What sound brings you genuine peace?
• What sound reliably disturbs you?
• What has listening actually taught you about yourself?

Name the sound you're most grateful your ears can hear.`
  },
  {
    day: 8,
    title: "Hearing: Sonic Memories",
    theme: "Sound Memory",
    type: "voice",
    modality: "speaking",
    sense: "sound",
    prompt: `Speak about the sounds imprinted in your memory.

• What voice, song, or sound is permanently etched into your recollection?
• Where were you when this sound first became meaningful?
• What does hearing this sound in your mind bring back with it?

Notice the sound you'd want to hear again more than any other.`
  },

  // TOUCH CYCLE (Days 9-12)
  {
    day: 9,
    title: "Touching: Tactile World",
    theme: "Touch Awareness",
    type: "text",
    modality: "writing",
    sense: "touch",
    prompt: `Notice what your body is physically feeling right now, in detail.

• Describe the textures, temperatures, and pressure you can feel this moment.
• What is your sense of touch actually telling you right now?
• What have you been feeling without registering it consciously?

Name the one physical sensation you'd like to notice more often.`
  },
  {
    day: 10,
    title: "Touching: Texture Art",
    theme: "Touch Expression",
    type: "visual",
    modality: "art",
    sense: "touch",
    prompt: `Create something meant to be felt, not just seen.

• Use materials with genuinely pleasing texture.
• What does touch add to a piece that sight alone can't?
• Which texture felt most satisfying to create?

Notice what this piece would communicate to someone touching it with eyes closed.`
  },
  {
    day: 11,
    title: "Touching: Describing Sensation",
    theme: "Touch Voice",
    type: "voice",
    modality: "speaking",
    sense: "touch",
    prompt: `Speak about physical sensation in enough detail that someone could actually feel it with you.

• Describe what something specific feels like to the touch.
• What does your body sense through contact that words usually skip past?
• Which sensation was hardest to describe accurately?

Notice the physical sensation you're most drawn to describe again.`
  },
  {
    day: 12,
    title: "Touching: Touch Memories",
    theme: "Touch Reflection",
    type: "text",
    modality: "writing",
    sense: "touch",
    prompt: `Some touch has stayed with you long after the moment passed - name it.

• What meaningful touch experience still stays with you?
• What has touch taught you specifically about connection?
• Which physical sensation carries the most emotional weight for you?

Name the touch memory you'd want to feel again if you could.`
  },

  // SMELL CYCLE (Days 13-16)
  {
    day: 13,
    title: "Smelling: Scent Awareness",
    theme: "Smell Recognition",
    type: "voice",
    modality: "speaking",
    sense: "smell",
    prompt: `Speak about what you can actually smell right now.

• Describe the scents present in your environment this moment.
• How does this particular scent affect your mood?
• What did you only notice once you consciously searched for it?

Notice the scent you'd miss the most if it disappeared from your life.`
  },
  {
    day: 14,
    title: "Smelling: Visual Scent",
    theme: "Smell Expression",
    type: "visual",
    modality: "art",
    sense: "smell",
    prompt: `Translate a favorite scent into something visual.

• What would lavender, coffee, or rain actually look like as art?
• Create imagery representing this scent's essence.
• What color or shape captured this smell most convincingly?

Notice which scent was hardest to translate visually.`
  },
  {
    day: 15,
    title: "Smelling: Scent Stories",
    theme: "Smell Reflection",
    type: "text",
    modality: "writing",
    sense: "smell",
    prompt: `Some smells instantly transport you elsewhere - name where they take you.

• What scent triggers a specific memory the moment you smell it?
• What has your sense of smell revealed to you about your own past?
• Which scent-memory connection surprised you the most?

Name the smell that would instantly take you back to a specific moment.`
  },
  {
    day: 16,
    title: "Smelling: Aromatic Memories",
    theme: "Smell Memory",
    type: "voice",
    modality: "speaking",
    sense: "smell",
    prompt: `Speak about the scents woven through your life.

• What childhood smell still feels like home?
• What favorite aroma do you associate with a specific person or place?
• Which scent-memory did you enjoy talking about the most?

Notice which scent you associate most strongly with someone you love.`
  },

  // TASTE CYCLE (Days 17-20)
  {
    day: 17,
    title: "Tasting: Flavor Awareness",
    theme: "Taste Appreciation",
    type: "text",
    modality: "writing",
    sense: "taste",
    prompt: `Describe a flavor you love in enough detail that someone could almost taste it.

• What taste experience genuinely delights you?
• What does your sense of taste actually bring to your life?
• What flavor detail do you usually rush past without noticing?

Name the flavor you'd choose if you could only taste one thing again.`
  },
  {
    day: 18,
    title: "Tasting: Visual Flavor",
    theme: "Taste Expression",
    type: "visual",
    modality: "art",
    sense: "taste",
    prompt: `Translate flavor into color and shape.

• What would sweet, sour, bitter, or savory look like visually?
• Create art representing a specific flavor's essence.
• Which flavor was hardest to translate into an image?

Notice which flavor's visual representation surprised you the most.`
  },
  {
    day: 19,
    title: "Tasting: Speaking Flavor",
    theme: "Taste Voice",
    type: "voice",
    modality: "speaking",
    sense: "taste",
    prompt: `Speak about your favorite foods with real enthusiasm.

• Describe a taste experience that genuinely brings you joy.
• What detail about this flavor is hardest to put into words?
• What food memory came up as you spoke?

Notice which flavor you got the most animated describing.`
  },
  {
    day: 20,
    title: "Tasting: Flavor Memories",
    theme: "Taste Reflection",
    type: "text",
    modality: "writing",
    sense: "taste",
    prompt: `Some tastes are woven into specific memories - name the connection.

• What flavor connects directly to a meaningful memory?
• How is this taste woven into your life story?
• Which flavor-memory would you want to relive exactly as it was?

Name the taste you associate most strongly with a specific chapter of your life.`
  },

  // INTEGRATION
  {
    day: 21,
    title: "Sensory Integration",
    theme: "Complete Spectrum",
    type: "voice",
    modality: "speaking",
    sense: "all",
    prompt: `Twenty days moving through each sense - now speak about the whole spectrum together.

• How do all five senses actually work together to create your experience of being alive?
• Which sense did this journey teach you the most about?
• What has paying this much attention changed about how you move through a day?

Speak the one sense you never want to take for granted again.`
  }
];

// EMOTION-COLOR-SOUND TRINITY - 18-day synesthetic exploration
export const emotionColorSoundDays = [
  // JOY TRINITY (Days 1-3)
  {
    day: 1,
    title: "Joy in Words",
    theme: "Joy Expression",
    type: "text",
    modality: "writing",
    emotion: "joy",
    prompt: `Name what actually brings you joy, specifically, not generically.

• What experience genuinely makes your heart lift?
• Describe one recent moment of real delight in detail.
• What does this joy have in common with your other happiest moments?

Name the one source of joy you'd like more of in your life.`
  },
  {
    day: 2,
    title: "Joy in Color",
    theme: "Joy Visualization",
    type: "visual",
    modality: "art",
    emotion: "joy",
    prompt: `Let joy choose its own colors instead of the ones you assume it should use.

• What color genuinely feels like happiness to you?
• Create art expressing the visual quality of delight.
• Which color surprised you by how joyful it actually felt?

Notice which part of this piece feels the most alive.`
  },
  {
    day: 3,
    title: "Joy in Voice",
    theme: "Joy Speaking",
    type: "voice",
    modality: "speaking",
    emotion: "joy",
    prompt: `Speak about joy and let your actual voice sound joyful, not just describe it.

• Talk about what makes you happy, letting the feeling come through your tone.
• Notice what happiness does to your pace and pitch.
• What did joy sound like once you gave it voice instead of just words?

Notice whether you let yourself sound as happy as you actually feel.`
  },

  // SADNESS TRINITY (Days 4-6)
  {
    day: 4,
    title: "Sadness in Words",
    theme: "Sadness Expression",
    type: "text",
    modality: "writing",
    emotion: "sadness",
    prompt: `Describe a sorrow you carry without rushing to explain it away.

• What sadness are you actually holding right now?
• Describe its texture and depth without judging it.
• What would this sadness say if it could speak for itself?

Name the one thing this sadness might be trying to tell you.`
  },
  {
    day: 5,
    title: "Sadness in Color",
    theme: "Sadness Visualization",
    type: "visual",
    modality: "art",
    emotion: "sadness",
    prompt: `Give sadness a color and shape that honors its depth, not just its darkness.

• What color and form represents this sorrow for you?
• Create art that treats sadness with respect rather than shame.
• What surprised you about how much beauty sadness could hold?

Notice what this piece reveals about the actual shape of your sadness.`
  },
  {
    day: 6,
    title: "Sadness in Voice",
    theme: "Sadness Speaking",
    type: "voice",
    modality: "speaking",
    emotion: "sadness",
    prompt: `Let your voice actually carry the weight of this sorrow instead of masking it.

• Speak about this sadness, letting your voice slow down or soften.
• Notice what sadness sounds like when it's not being hidden.
• What released once you let your voice carry this weight?

Notice whether speaking it aloud made the sadness feel lighter or heavier.`
  },

  // ANGER TRINITY (Days 7-9)
  {
    day: 7,
    title: "Anger in Words",
    theme: "Anger Expression",
    type: "text",
    modality: "writing",
    emotion: "anger",
    prompt: `Let anger onto the page without editing it into politeness.

• What genuinely makes you angry right now?
• What injustice or frustration is actually burning in you?
• What has this anger been trying to protect?

Name the one thing this anger wants you to finally address.`
  },
  {
    day: 8,
    title: "Anger in Color",
    theme: "Anger Visualization",
    type: "visual",
    modality: "art",
    emotion: "anger",
    prompt: `Let anger move through the page with its full intensity.

• What color and movement expresses this rage or frustration?
• Create art that doesn't soften the intensity of this feeling.
• What surprised you about how this anger wanted to move?

Notice what's underneath this anger that the marks are pointing toward.`
  },
  {
    day: 9,
    title: "Anger in Voice",
    theme: "Anger Speaking",
    type: "voice",
    modality: "speaking",
    emotion: "anger",
    prompt: `Speak your anger aloud instead of swallowing it.

• Let your voice carry real fire and intensity about what's frustrating you.
• Notice what changes in your voice once you stop suppressing this.
• What did honest anger sound like once you actually gave it voice?

Notice whether this anger felt dangerous or just honest once spoken.`
  },

  // FEAR TRINITY (Days 10-12)
  {
    day: 10,
    title: "Fear in Words",
    theme: "Fear Expression",
    type: "text",
    modality: "writing",
    emotion: "fear",
    prompt: `Name a fear specifically, instead of letting it stay a vague dread.

• What are you actually afraid of right now?
• Describe this fear and its accompanying worry with real honesty.
• What is this fear trying to protect you from?

Name the one fear you're most ready to look at directly.`
  },
  {
    day: 11,
    title: "Fear in Color",
    theme: "Fear Visualization",
    type: "visual",
    modality: "art",
    emotion: "fear",
    prompt: `Give fear a visual form instead of letting it stay formless and looming.

• What color and shape represents this anxiety for you?
• Create art expressing what being afraid actually looks like.
• What surprised you once fear had an actual shape on the page?

Notice whether this fear looks smaller now that it has a form.`
  },
  {
    day: 12,
    title: "Fear in Voice",
    theme: "Fear Speaking",
    type: "voice",
    modality: "speaking",
    emotion: "fear",
    prompt: `Speak your fear aloud and notice if naming it actually diminishes its power.

• Talk about this fear, noticing exactly how your voice changes.
• What does fear sound like once it's out in the open?
• Did speaking it make it feel smaller, or did it stay just as big?

Notice which part of this fear felt different once it was actually spoken.`
  },

  // LOVE TRINITY (Days 13-15)
  {
    day: 13,
    title: "Love in Words",
    theme: "Love Expression",
    type: "text",
    modality: "writing",
    emotion: "love",
    prompt: `Describe love in its actual forms, not the greeting-card version.

• Who and what do you genuinely love right now?
• Describe this love in its specific form - romantic, familial, friendship, universal.
• What does this particular love actually require of you?

Name the love you've been meaning to express more openly.`
  },
  {
    day: 14,
    title: "Love in Color",
    theme: "Love Visualization",
    type: "visual",
    modality: "art",
    emotion: "love",
    prompt: `Let love choose its own colors instead of the expected ones.

• What color genuinely represents love to you?
• Create art expressing the warmth and connection of this feeling.
• What surprised you about how love wanted to look?

Notice which part of this piece feels the most tender.`
  },
  {
    day: 15,
    title: "Love in Voice",
    theme: "Love Speaking",
    type: "voice",
    modality: "speaking",
    emotion: "love",
    prompt: `Speak about love and let tenderness actually color your voice.

• Talk about someone or something you love, letting warmth come through your tone.
• Notice what love does to your pace and softness.
• What did love sound like once you gave it voice instead of just thought?

Notice who you were actually picturing as you spoke.`
  },

  // PEACE TRINITY (Days 16-18)
  {
    day: 16,
    title: "Peace in Words",
    theme: "Peace Expression",
    type: "text",
    modality: "writing",
    emotion: "peace",
    prompt: `Name what actually brings you calm, not what's supposed to.

• What genuinely gives you a sense of serenity?
• Describe a real moment of inner or outer peace.
• What's the difference between this peace and just the absence of stress?

Name the one practice that reliably brings you back to this peace.`
  },
  {
    day: 17,
    title: "Peace in Color",
    theme: "Peace Visualization",
    type: "visual",
    modality: "art",
    emotion: "peace",
    prompt: `Let stillness itself become the subject of this piece.

• What color and form represents tranquility for you?
• Create art expressing calm rather than depicting a calm scene.
• How much could you remove and still have peace come through?

Notice how rare it feels to create something this quiet.`
  },
  {
    day: 18,
    title: "Peace in Voice",
    theme: "Peace Speaking",
    type: "voice",
    modality: "speaking",
    emotion: "peace",
    prompt: `Speak about peace and let your actual voice settle into calm.

• Talk about what peace means to you, letting your voice slow and soften.
• Notice what genuine calm sounds like compared to your usual pace.
• Now that you've spoken joy, sadness, anger, fear, love, and peace - what has moving through all six taught you?

Speak the one thing this whole journey revealed about how your emotions actually sound.`
  }
];


/**
 * Helper function to create a journey path with minimal boilerplate
 * @param {Object} options - Path configuration options
 * @returns {Object} - Complete path object
 */
export const createJourneyPath = (options) => {
  return {
    id: options.id,
    title: options.title,
    subtitle: options.subtitle || `${options.days.length}-day guided journey`,
    description: options.description,
    iconName: options.iconName || "Book",
    duration: options.days.length,
    color: options.color,
    progressField: options.progressField || `${options.id.replace(/-/g, '')}Progress`,
    days: options.days,
    isDisabled: options.isDisabled || false,
    isPremium: options.isPremium || false,
    recommendedFor: options.recommendedFor || [],
    tags: options.tags || [],
    difficulty: options.difficulty || 'intermediate',
    // Exclusive one-time-purchase paths (outside the Artisan subscription)
    isExclusive: options.isExclusive || false,
    isNew: options.isNew || false,
    price: options.price || null, // display string, e.g. '€2.99'
    // Flex paths: the user picks voice OR drawing per day (vs. isMultiModal,
    // where each day prescribes its modality)
    isFlexModal: options.isFlexModal || false,
    // Interactive paths: each day carries a `prompts` array the user can
    // shuffle through (e.g. Kairos Cards). The shuffle UI itself keys off the
    // presence of `day.prompts`; this flag is metadata for badges/filtering.
    isInteractive: options.isInteractive || false,
    // Any other metadata you might want to store
  };
};

// Register NEW Multi-Modal Paths
JOURNEY_PATHS['shadow-light-integration'] = createJourneyPath({
  id: 'shadow-light-integration',
  title: "Shadow & Light Integration",
  subtitle: "12-day duality exploration",
  description: "Explore and integrate both your shadow self and your light through multi-modal expression. Alternating between exploring hidden aspects and celebrating brilliance creates wholeness.",
  iconName: "Moon",
  days: shadowLightIntegrationDays,
  color: "147, 51, 234", // Purple for duality
  tags: ['multi-modal', 'shadow-work', 'integration', 'self-discovery'],
  duration: 12,
  difficulty: 'intermediate',
  recommendedFor: ['shadow workers', 'integration seekers', 'multi-modal explorers'],
  isMultiModal: true
});

JOURNEY_PATHS['life-chapters-trilogy'] = createJourneyPath({
  id: 'life-chapters-trilogy',
  title: "Life Chapters Trilogy",
  subtitle: "15-day narrative journey",
  description: "Explore your life story through past, present, and future chapters using text, voice, and visual expression. Create a comprehensive narrative of your journey.",
  iconName: "BookOpen",
  days: lifeChaptersTrilogy,
  color: "71, 85, 105", // Slate for storytelling
  tags: ['multi-modal', 'life-story', 'narrative', 'reflection'],
  duration: 15,
  difficulty: 'intermediate',
  recommendedFor: ['storytellers', 'life reviewers', 'multi-modal explorers'],
  isMultiModal: true
});

JOURNEY_PATHS['sensory-spectrum'] = createJourneyPath({
  id: 'sensory-spectrum',
  title: "Sensory Spectrum Journey",
  subtitle: "21-day five senses exploration",
  description: "Deepen your embodied awareness through systematic exploration of all five senses using text, voice, and visual modalities. Celebrate the richness of sensory experience.",
  iconName: "Eye",
  days: sensorySpectrumDays,
  color: "34, 197, 94", // Green for nature/senses
  tags: ['multi-modal', 'mindfulness', 'embodiment', 'sensory-awareness'],
  duration: 21,
  difficulty: 'beginner',
  recommendedFor: ['mindfulness practitioners', 'embodiment seekers', 'sensory explorers'],
  isMultiModal: true
});

JOURNEY_PATHS['emotion-color-sound'] = createJourneyPath({
  id: 'emotion-color-sound',
  title: "Emotion-Color-Sound Trinity",
  subtitle: "18-day synesthetic exploration",
  description: "Explore six core emotions (joy, sadness, anger, fear, love, peace) through feeling, color, and sound. Express each emotion across all three modalities for deep emotional literacy.",
  iconName: "Heart",
  days: emotionColorSoundDays,
  color: "236, 72, 153", // Pink for emotions
  tags: ['multi-modal', 'emotions', 'expression', 'emotional-intelligence'],
  duration: 18,
  difficulty: 'intermediate',
  recommendedFor: ['emotional explorers', 'creative souls', 'multi-modal learners'],
  isMultiModal: true
});

JOURNEY_PATHS['deciding-to-doing'] = createJourneyPath({
  id: 'deciding-to-doing',
  title: "The Gap Between Deciding and Doing",
  subtitle: "7-day confrontational path for when you've decided but haven't started",
  description: "This path is for when the planning is done but the doing hasn't begun. When you know what's next but you're sitting in the space before action. A confrontational journey that tracks how many days you spend preparing to start vs. actually starting. This path will make you uncomfortable. That's the point.",
  iconName: "Zap", // Lightning bolt - represents the spark of action, urgency
  days: decidingToDoingDays,
  color: "234, 88, 12", // Bold orange-red (urgency + courage)
  tags: ['transformation', 'action', 'courage', 'decision-making', 'procrastination', 'execution'],
  duration: 7,
  difficulty: 'intermediate',
  recommendedFor: [
    'anyone stuck between deciding and doing',
    'people who endlessly plan but never start',
    'entrepreneurs ready to launch',
    'anyone tired of "potential" and ready for "actual"'
  ]
});

JOURNEY_PATHS['inner-elements'] = createJourneyPath({
  id: 'inner-elements',
  title: "Inner Elements Journey",
  subtitle: "9-day multi-modal exploration through earth, water, and fire",
  description: "Discover your elemental nature through writing, art, and voice. Each element is explored through all three modalities, creating a unique integrated self-discovery experience.",
  iconName: "Sparkles", // Perfect for elements!
  days: innerElementsDays,
  color: "139, 69, 19", // Earthy brown as base
  tags: ['multi-modal', 'elements', 'creativity', 'integration'],
  duration: 9,
  difficulty: 'intermediate',
  recommendedFor: ['creative explorers', 'those seeking variety', 'multi-modal learners'],
  isMultiModal: true // NEW PROPERTY
});

JOURNEY_PATHS['vocal-confidence'] = createJourneyPath({
  id: 'vocal-confidence',
  title: "Vocal Confidence",
  subtitle: "12-day confidence building journey",
  description: "Build confidence and authority in your voice and learn to speak with power, presence, and authentic leadership through vocal expression.",
  iconName: "Volume2",
  days: vocalConfidenceDays,
  color: "79, 70, 229", // Indigo
  tags: ['voice', 'confidence', 'leadership', 'authority', 'public-speaking'],
  duration: 12,
  difficulty: 'intermediate',
  recommendedFor: ['confidence builders', 'leaders', 'public speakers', 'professionals'],
  isVoiceJourney: true
});

JOURNEY_PATHS['storytelling-voice'] = createJourneyPath({
  id: 'storytelling-voice',
  title: "Storytelling Voice",
  subtitle: "15-day narrative expression journey",
  description: "Develop your storytelling abilities and learn to captivate through the art of spoken narrative, character voices, and compelling vocal delivery.",
  iconName: "MessageSquare",
  days: storytellingVoiceDays,
  color: "245, 101, 101", // Red/Orange
  tags: ['voice', 'storytelling', 'narrative', 'creativity', 'communication'],
  duration: 15,
  difficulty: 'intermediate',
  recommendedFor: ['storytellers', 'creative spirits', 'communication enthusiasts', 'performers'],
  isVoiceJourney: true
});

JOURNEY_PATHS['meditation-speaking'] = createJourneyPath({
  id: 'meditation-speaking',
  title: "Meditation Speaking",
  subtitle: "21-day mindful communication journey",
  description: "Integrate mindfulness with vocal expression to develop presence, awareness, and conscious communication through meditative speaking practices.",
  iconName: "Brain",
  days: meditationSpeakingDays,
  color: "16, 185, 129", // Emerald
  tags: ['voice', 'mindfulness', 'meditation', 'presence', 'conscious-communication'],
  duration: 21,
  difficulty: 'advanced',
  recommendedFor: ['mindfulness practitioners', 'meditation students', 'presence seekers', 'spiritual growth'],
  isVoiceJourney: true
});

JOURNEY_PATHS['voice-discovery'] = createJourneyPath({
  id: 'voice-discovery',
  title: "Voice Discovery Journey",
  subtitle: "10-day exploration of your authentic voice",
  description: "Discover the power and authenticity of your spoken voice through guided vocal exploration and reflection.",
  iconName: "Mic",
  days: voiceDiscoveryDays,
  color: "138, 43, 226", // Blue Violet
  tags: ['voice', 'self-discovery', 'authenticity', 'speaking'],
  duration: 10,
  difficulty: 'beginner',
  recommendedFor: ['voice newcomers', 'self-discovery seekers', 'authenticity explorers'],
  isVoiceJourney: true
});

// Register Spoken Emotions Journey
JOURNEY_PATHS['spoken-emotions'] = createJourneyPath({
  id: 'spoken-emotions',
  title: "Spoken Emotions",
  subtitle: "14-day journey through vocal emotional expression",
  description: "Learn to express and understand your emotions through the power of spoken word and vocal tone.",
  iconName: "Heart",
  days: spokenEmotionsDays,
  color: "220, 20, 60", // Crimson
  tags: ['voice', 'emotions', 'expression', 'healing'],
  duration: 14,
  difficulty: 'intermediate',
  recommendedFor: ['emotional explorers', 'voice developers', 'healing journeyers'],
  isVoiceJourney: true
});

JOURNEY_PATHS['freestyle-discovery'] = createJourneyPath({
  id: 'freestyle-discovery',
  title: "Freestyle Discovery",
  subtitle: "7-day casual exploration of your mental landscape",
  description: "A relaxed journey perfect for getting started with journaling. Each day offers a simple, conversational prompt to help you explore your thoughts and feelings without pressure. Ideal for helping our AI understand your unique voice and perspective while you discover patterns in your thinking.",
  iconName: "Feather", // Lucide icon for casual writing
  days: freestyleDiscoveryDays,
  color: "255, 159, 67", // Warm orange RGB
  tags: ['beginner', 'casual', 'exploration', 'discovery', 'conversation'],
  duration: 7,
  difficulty: 'beginner',
  recommendedFor: ['new journalers', 'busy people', 'casual writers', 'anyone wanting to start simple']
});

JOURNEY_PATHS['letter-to-myself'] = createJourneyPath({
  id: 'letter-to-myself',
  title: "Letter to Myself",
  subtitle: "7-day journey of self-correspondence",
  description: "Explore different aspects of yourself through the intimate practice of letter writing. Connect with your past, present, and future selves while cultivating self-compassion, gratitude, and inner wisdom through heartfelt personal correspondence.",
  iconName: "Mail",
  days: letterToMyselfDays,
  color: "168, 85, 247", // Purple/Violet
  tags: ['self-love', 'reflection', 'healing', 'inner-dialogue', 'short-journey', 'self-compassion'],
  duration: 7,
  difficulty: 'beginner',
  recommendedFor: ['anyone new to journaling', 'those seeking self-compassion', 'people working on self-relationship', 'short journey seekers']
});

JOURNEY_PATHS['manifestation-reality'] = createJourneyPath({
  id: 'manifestation-reality',
  title: "Manifestation & Reality Creation",
  subtitle: "33-day journey into conscious creation",
  description: "Bridge practical goal-setting with intentional manifestation practices. Learn to align your energy, thoughts, and actions with your deepest desires while developing a healthy relationship with abundance and creation.",
  iconName: "Sparkles",
  days: manifestationRealityDays,
  color: "147, 51, 234", // Purple
  tags: ['manifestation', 'goals', 'intention', 'vision', 'creation', 'abundance'],
  duration: 33,
  difficulty: 'intermediate',
  recommendedFor: ['goal-setters', 'spiritual seekers', 'those ready for major life changes']
});

JOURNEY_PATHS['decision-compass'] = createJourneyPath({
  id: 'decision-compass',
  title: "Decision-Making Compass",
  subtitle: "14-day framework for aligned choices",
  description: "Develop a personal framework for making aligned decisions by balancing intuition, logic, and values. Learn to navigate uncertainty with confidence and create a sustainable decision-making process.",
  iconName: "Compass",
  days: decisionCompassDays,
  color: "34, 197, 94", // Green
  tags: ['decisions', 'clarity', 'intuition', 'practical-wisdom', 'confidence'],
  duration: 14,
  difficulty: 'beginner',
  recommendedFor: ['overthinkers', 'people-pleasers', 'those facing major decisions', 'anyone wanting more confidence in choices']
});

JOURNEY_PATHS['portrait-emotions'] = createJourneyPath({
  id: 'portrait-emotions',
  title: "Emotional Portrait Series",
  subtitle: "25-day exploration through faces and feelings",
  description: "Create self-portraits and character studies that capture different emotional states. Develop your artistic skills while exploring the full spectrum of human emotion through visual expression.",
  iconName: "User",
  days: portraitEmotionsDays,
  color: "236, 72, 153", // Pink
  tags: ['portraits', 'emotions', 'self-study', 'character', 'faces', 'artistic-expression'],
  duration: 25,
  difficulty: 'intermediate',
  recommendedFor: ['artists', 'those interested in human psychology', 'visual learners', 'anyone wanting to understand emotions better']
});

JOURNEY_PATHS['color-psychology'] = createJourneyPath({
  id: 'color-psychology',
  title: "Color Psychology Journey",
  subtitle: "21-day emotional color exploration",
  description: "Explore the emotional language of color through painting, discovering how different hues reflect and influence your inner emotional landscape and creative expression.",
  iconName: "Palette",
  color: "244, 114, 182", // Pink color
  days: colorPsychologyJourneyDays,
  difficulty: 'beginner',
  tags: ['color-therapy', 'emotions', 'painting', 'psychology'],
  recommendedFor: ['color enthusiasts', 'emotional explorers', 'painters']
});

// Register Sacred Geometry Soul path
JOURNEY_PATHS['sacred-geometry'] = createJourneyPath({
  id: 'sacred-geometry',
  title: "Sacred Geometry Soul",
  subtitle: "14-day spiritual pattern creation",
  description: "Connect with ancient wisdom through mandala creation, geometric patterns, and sacred shapes that reflect cosmic harmony and inner balance.",
  iconName: "Hexagon",
  color: "147, 51, 234", // Purple color
  days: sacredGeometrySoulDays,
  difficulty: 'intermediate',
  tags: ['geometry', 'spirituality', 'mandalas', 'sacred-art'],
  recommendedFor: ['spiritual seekers', 'pattern lovers', 'meditation practitioners']
});

// Register Nature Sketching Sanctuary path
JOURNEY_PATHS['nature-sketching'] = createJourneyPath({
  id: 'nature-sketching',
  title: "Nature Sketching Sanctuary",
  subtitle: "10-day outdoor observation drawing",
  description: "Develop observational skills and nature connection through plein-air sketching, capturing the essence of natural forms and seasonal changes.",
  iconName: "TreePine",
  color: "22, 163, 74", // Green color
  days: natureSketchingSanctuaryDays,
  difficulty: 'beginner',
  tags: ['nature', 'sketching', 'observation', 'outdoor-art'],
  recommendedFor: ['nature lovers', 'beginner artists', 'mindfulness practitioners']
});

// Register Abstract Emotions path
JOURNEY_PATHS['abstract-emotions'] = createJourneyPath({
  id: 'abstract-emotions',
  title: "Abstract Emotions",
  subtitle: "12-day non-representational expression",
  description: "Express complex emotions through abstract art forms, learning to communicate feelings without literal representation through color, form, and texture.",
  iconName: "Paintbrush2",
  color: "239, 68, 68", // Red color
  days: abstractEmotionsDays,
  difficulty: 'intermediate',
  tags: ['abstract-art', 'emotions', 'expression', 'non-figurative'],
  recommendedFor: ['emotional processors', 'abstract art lovers', 'experimental artists']
});

// Register Visual Storytelling path
JOURNEY_PATHS['visual-storytelling'] = createJourneyPath({
  id: 'visual-storytelling',
  title: "Visual Storytelling",
  subtitle: "15-day narrative art journey",
  description: "Create visual narratives and personal mythology through sequential art, comic-style storytelling, and illustrated personal histories.",
  iconName: "BookOpen",
  color: "59, 130, 246", // Blue color
  days: visualStorytellingDays,
  difficulty: 'advanced',
  tags: ['storytelling', 'narrative', 'comics', 'illustration'],
  recommendedFor: ['storytellers', 'comic artists', 'narrative enthusiasts']
});

// 🖤 SURPRISE BONUS PATH! 🖤
JOURNEY_PATHS['ink-essence'] = createJourneyPath({
  id: 'ink-essence',
  title: "Ink & Essence: Black Ink Mastery",
  subtitle: "33-day intensive drawing journey",
  description: "Master the ancient art of black ink drawing through progressive skill building, combining Eastern brush techniques with Western pen mastery for profound artistic expression.",
  iconName: "PenTool",
  color: "148, 163, 184", // Silvery ink-wash slate – keeps the monochrome ink feel while staying visible on dark cards
  days: inkAndEssenceDays,
  difficulty: 'advanced',
  tags: ['ink-drawing', 'traditional-art', 'mastery', 'discipline', 'black-ink'],
  recommendedFor: ['serious artists', 'traditional art lovers', 'discipline seekers', 'ink enthusiasts']
});

JOURNEY_PATHS['mindful-visualization'] = createJourneyPath({
  id: 'mindful-visualization',
  title: "Mindful Visualization",
  subtitle: "33-day visual expression journey",
  description: "Combine drawing, doodling, and painting with mindfulness techniques to explore your inner landscape through visual expression rather than words alone.",
  iconName: "Paintbrush", // Using a Lucide icon
  color: "244, 114, 182", // Pink color
  days: mindfulVisualizationDays,
  isPremium: false, // This is a premium path that requires subscription
  difficulty: 'intermediate',
  tags: ['creativity', 'mindfulness', 'visual', 'drawing'],
  recommendedFor: ['creative souls', 'visual thinkers', 'mindfulness practitioners']
});
JOURNEY_PATHS['career-compass'] = createJourneyPath({
  id: 'career-compass',
  title: "Career Compass",
  subtitle: "21-day professional direction journey",
  description: "Navigate career transitions, clarify professional goals, and align your work with your deeper purpose and values through strategic self-reflection and visionary planning.",
  iconName: "Briefcase",
  color: "59, 130, 246", // Blue color
  days: careerCompassDays,
  difficulty: 'intermediate',
  tags: ['career', 'purpose', 'transitions', 'professional-growth'],
  recommendedFor: ['career changers', 'professionals seeking direction', 'purpose seekers']
});

// Register Inner Child Healing path
JOURNEY_PATHS['inner-child'] = createJourneyPath({
  id: 'inner-child',
  title: "Inner Child Healing",
  subtitle: "14-day childhood exploration",
  description: "Reconnect with your inner child to heal old wounds, reclaim lost gifts, and integrate childhood wisdom into your adult life for greater authenticity and wholeness.",
  iconName: "Baby",
  color: "236, 72, 153", // Pink color
  days: innerChildDays,
  difficulty: 'intermediate',
  tags: ['healing', 'childhood', 'integration', 'therapy'],
  recommendedFor: ['healing seekers', 'therapy clients', 'personal growth enthusiasts']
});

// Register Anxiety Alchemy path
JOURNEY_PATHS['anxiety-alchemy'] = createJourneyPath({
  id: 'anxiety-alchemy',
  title: "Anxiety Alchemy",
  subtitle: "10-day worry transformation",
  description: "Transform anxiety from an enemy into a messenger, learning to work with worry as a pathway to wisdom, growth, and deeper self-understanding.",
  iconName: "Heart",
  color: "16, 185, 129", // Emerald color
  days: anxietyAlchemyDays,
  difficulty: 'beginner',
  tags: ['anxiety', 'transformation', 'mental-health', 'mindfulness'],
  recommendedFor: ['anxiety sufferers', 'stress managers', 'mindfulness practitioners']
});

JOURNEY_PATHS['visual-meditation'] = createJourneyPath({
  id: 'visual-meditation',
  title: "Visual Meditation",
  subtitle: "21-day mindful art practice",
  description: "Combine drawing, painting, and visual creation with mindfulness techniques to explore your inner landscape through meditative artistic expression. Perfect for developing both artistic skills and mindful awareness.",
  iconName: "Eye",
  days: visualMeditationDays,
  color: "59, 130, 246", // Blue
  tags: ['meditation', 'mindfulness', 'visual-art', 'contemplation', 'awareness', 'artistic-practice'],
  duration: 21,
  difficulty: 'beginner',
  recommendedFor: ['meditation practitioners', 'beginning artists', 'anyone seeking mindful creativity', 'stress relief seekers']
});

JOURNEY_PATHS['symbolic-art'] = createJourneyPath({
  id: 'symbolic-art',
  title: "Symbolic Art",
  subtitle: "18-day personal symbol creation",
  description: "Discover and create your own visual language through symbolic art. Explore archetypal imagery, personal symbols, and visual storytelling to develop a unique symbolic vocabulary for self-expression.",
  iconName: "Triangle",
  days: symbolicArtDays,
  color: "245, 158, 11", // Amber/Orange
  tags: ['symbols', 'visual-language', 'archetypal', 'personal-expression', 'sacred-art', 'storytelling'],
  duration: 18,
  difficulty: 'intermediate',
  recommendedFor: ['visual artists', 'symbol enthusiasts', 'those interested in personal mythology', 'spiritual seekers']
});

JOURNEY_PATHS['dream-decoder'] = createJourneyPath({
  id: 'dream-decoder',
  title: "Dream Journal Decoder",
  subtitle: "14-day subconscious exploration",
  description: "Unlock the wisdom of your dreams through systematic recording, analysis, and interpretation of your nighttime messages from the subconscious mind.",
  iconName: "Moon",
  color: "124, 58, 237", // Purple color
  days: dreamJournalDecoderDays,
  difficulty: 'beginner',
  tags: ['dreams', 'subconscious', 'symbols', 'interpretation'],
  recommendedFor: ['dream explorers', 'psychology enthusiasts', 'spiritual seekers']
});

// Register Seasonal Soul Rhythms path
JOURNEY_PATHS['seasonal-rhythms'] = createJourneyPath({
  id: 'seasonal-rhythms',
  title: "Seasonal Soul Rhythms",
  subtitle: "28-day natural cycles alignment",
  description: "Align your inner seasons with nature's cycles, learning to honor your natural rhythms and seasonal energy patterns for more harmonious living.",
  iconName: "Sun",
  color: "245, 158, 11", // Amber color
  days: seasonalSoulRhythmsDays,
  difficulty: 'intermediate',
  tags: ['seasons', 'cycles', 'nature', 'rhythms'],
  recommendedFor: ['nature lovers', 'seasonal awareness seekers', 'holistic wellness enthusiasts']
});
JOURNEY_PATHS['forgiveness-freedom'] = createJourneyPath({
  id: 'forgiveness-freedom',
  title: "Forgiveness Freedom",
  subtitle: "17-day resentment release journey",
  description: "Learn the art of forgiveness - not for others, but for your own freedom. Release resentment and reclaim your emotional energy through compassionate self-liberation.",
  iconName: "Heart",
  color: "220, 38, 38", // Red color
  days: forgivenessFreedomDays,
  difficulty: 'advanced',
  tags: ['forgiveness', 'healing', 'freedom', 'resentment'],
  recommendedFor: ['healing seekers', 'those holding resentment', 'emotional freedom seekers']
});

// Register Life Transitions Navigator path
JOURNEY_PATHS['transitions-navigator'] = createJourneyPath({
  id: 'transitions-navigator',
  title: "Life Transitions Navigator",
  subtitle: "21-day change guidance",
  description: "Navigate major life transitions with grace and intention, finding meaning in change and emerging stronger from uncertainty with wisdom and resilience.",
  iconName: "Navigation",
  color: "99, 102, 241", // Indigo color
  days: lifeTransitionsNavigatorDays,
  difficulty: 'intermediate',
  tags: ['transitions', 'change', 'growth', 'uncertainty'],
  recommendedFor: ['people in transition', 'change navigators', 'life stage shifters']
});

// Register Digital Detox Reflection path
JOURNEY_PATHS['digital-detox'] = createJourneyPath({
  id: 'digital-detox',
  title: "Digital Detox Reflection",
  subtitle: "7-day technology mindfulness",
  description: "Examine your relationship with technology and social media, creating healthier boundaries with digital consumption for greater presence and peace.",
  iconName: "Smartphone",
  color: "107, 114, 128", // Gray color
  days: digitalDetoxReflectionDays,
  difficulty: 'beginner',
  tags: ['technology', 'mindfulness', 'boundaries', 'digital-wellness'],
  recommendedFor: ['heavy tech users', 'social media consumers', 'mindfulness seekers']
});

// Register Grief & Growth path
JOURNEY_PATHS['grief-growth'] = createJourneyPath({
  id: 'grief-growth',
  title: "Grief & Growth",
  subtitle: "30-day loss processing journey",
  description: "Process loss, grief, and significant life changes while finding meaning, growth, and new beginnings within the healing journey of bereavement and recovery.",
  iconName: "Heart",
  color: "75, 85, 99", // Gray-600 color
  days: griefAndGrowthDays,
  difficulty: 'advanced',
  tags: ['grief', 'healing', 'growth', 'loss'],
  recommendedFor: ['those experiencing loss', 'grief processors', 'healing journeyers']
});

// Register Courage Cultivation path
JOURNEY_PATHS['courage-cultivation'] = createJourneyPath({
  id: 'courage-cultivation',
  title: "Courage Cultivation",
  subtitle: "12-day bravery building",
  description: "Build courage muscle through daily challenges, fear-facing exercises, and brave action practices that expand your comfort zone and authentic self-expression.",
  iconName: "Shield",
  color: "239, 68, 68", // Red-500 color
  days: courageCultivationDays,
  difficulty: 'intermediate',
  tags: ['courage', 'fear', 'action', 'bravery'],
  recommendedFor: ['fear-facers', 'growth seekers', 'confidence builders']
});

JOURNEY_PATHS['artistic-soul-expression'] = createJourneyPath({
  id: 'artistic-soul-expression',
  title: "Artistic Soul Expression",
  subtitle: "14-day intuitive art journey",
  description: "Discover your unique artistic voice through stream-of-consciousness creation, emotional healing through art, and intuitive expression that bypasses the analytical mind.",
  iconName: "Brush", // Using a Lucide icon for art brush
  color: "192, 38, 211", // Vibrant purple color
  days: artisticSoulExpressionDays,
  difficulty: 'beginner',
  tags: ['art-therapy', 'intuitive-art', 'emotional-healing', 'creative-expression'],
  recommendedFor: ['healing seekers', 'intuitive creators', 'art therapy enthusiasts']
});

JOURNEY_PATHS['holistic-transformation'] = createJourneyPath({
  id: 'holistic-transformation',
  title: "Holistic Transformation",
  subtitle: "100-day comprehensive growth journey",
  description: "Embark on a complete transformation journey that integrates mind, body, emotions, habits, relationships, purpose, and resilience through 10 powerful modules of guided reflection and practice.",
  iconName: "Sparkles",
  color: "124, 58, 237", // Purple color
  days: holisticTransformationDays,
  difficulty: 'advanced',
  tags: ['transformation', 'personal-growth', 'holistic', 'life-change']
});

JOURNEY_PATHS['life-values'] = createJourneyPath({
  id: 'life-values',
  title: "Life Values & Core Principles",
  subtitle: "22-day values exploration",
  description: "Clarify your core values and learn to align your daily choices with what matters most to you for a more authentic and purposeful life.",
  iconName: "Compass",
  color: "16, 185, 129", // Emerald color
  days: lifeValuesDays,
  difficulty: 'intermediate',
  tags: ['values', 'purpose', 'authenticity']
});

// Add these paths to JOURNEY_PATHS registry
JOURNEY_PATHS['gratitude-practice'] = createJourneyPath({
  id: 'gratitude-practice',
  title: "Gratitude Practice",
  subtitle: "10-day appreciation journey",
  description: "Cultivate a daily gratitude practice that expands your awareness of life's blessings, shifts your perspective, and enhances your overall sense of wellbeing and joy.",
  iconName: "Heart",
  color: "234, 88, 12", // Orange color
  days: gratitudePracticeDays,
  difficulty: 'beginner',
  tags: ['gratitude', 'positivity', 'mindfulness']
});

JOURNEY_PATHS['shadow-work'] = createJourneyPath({
  id: 'shadow-work',
  title: "Shadow Work Exploration",
  subtitle: "10-day inner discovery",
  description: "Explore the hidden aspects of your psyche to integrate disowned parts of yourself, heal internal conflicts, and move toward greater authenticity and wholeness.",
  iconName: "Moon",
  color: "91, 33, 182", // Purple color
  days: shadowWorkDays,
  difficulty: 'intermediate',
  tags: ['psychology', 'healing', 'self-awareness']
});

JOURNEY_PATHS['nature-connection'] = createJourneyPath({
  id: 'nature-connection',
  title: "Nature Connection",
  subtitle: "10-day ecological awareness journey",
  description: "Deepen your relationship with the natural world through mindful observation, sensory exploration, and reflective practices that restore your sense of belonging to the web of life.",
  iconName: "Leaf",
  color: "22, 163, 74", // Green color
  days: natureConnectionDays,
  difficulty: 'beginner',
  tags: ['nature', 'mindfulness', 'environment']
});

JOURNEY_PATHS['relationship-mastery'] = createJourneyPath({
  id: 'relationship-mastery',
  title: "Relationship Mastery",
  subtitle: "30-day interpersonal journey",
  description: "Develop deeper connections through communication, empathy, and boundary-setting practices for healthier, more fulfilling relationships.",
  iconName: "Heart",
  color: "220, 38, 38", // Red color
  days: relationshipMasteryDays,
  difficulty: 'intermediate',
  tags: ['relationships', 'communication', 'connection']
});

JOURNEY_PATHS['financial-mindfulness'] = createJourneyPath({
  id: 'financial-mindfulness',
  title: "Financial Mindfulness",
  subtitle: "21-day money relationship journey",
  description: "Transform your relationship with money by examining beliefs, patterns, and developing a mindful approach to resources and wealth.",
  iconName: "Coins",
  color: "234, 179, 8", // Yellow color
  days: financialMindfulnessDays,
  difficulty: 'intermediate',
  tags: ['finances', 'mindfulness', 'abundance']
});

// Register Self-Discovery path
JOURNEY_PATHS['self-discovery'] = createJourneyPath({
  id: 'self-discovery',
  title: "Self-Discovery Journey",
  subtitle: "10-day guided reflection experience",
  description: "Begin a transformative 10-day journey through guided prompts that help you explore your values, fears, aspirations, and relationships. Perfect for both beginners and experienced journalers.",
  iconName: "Compass",
  days: journeyDays,
  progressField: "selfDiscoveryProgress",
  difficulty: 'beginner',
  tags: ['reflection', 'self-awareness', 'values']
});

// Register Emotional Intelligence path
JOURNEY_PATHS['emotional-intelligence'] = createJourneyPath({
  id: 'emotional-intelligence',
  title: "Emotional Intelligence Expedition",
  subtitle: "10-day emotional awareness program",
  description: "Develop greater awareness and mastery of your emotional landscape through structured journaling exercises designed to help you recognize, understand, and manage your emotions effectively.",
  iconName: "Heart",
  days: emotionalIntelligenceDays,
  progressField: "emotionalIntelligenceProgress",
  tags: ['emotions', 'awareness', 'regulation']
});

// Register Mindfulness Awareness path
JOURNEY_PATHS['mindfulness-awareness'] = createJourneyPath({
  id: 'mindfulness-awareness',
  title: "Mindfulness & Present Awareness",
  subtitle: "10-day mindfulness practice",
  description: "Learn to be more present and mindful through daily journaling practices focused on sensory awareness, thought observation, and being fully engaged in the present moment.",
  iconName: "Brain",
  days: mindfulnessAwarenessDays,
  progressField: "mindfulnessAwarenessProgress",
  tags: ['mindfulness', 'presence', 'meditation']
});

// Register Transformation Journey path
JOURNEY_PATHS['transformation-journey'] = createJourneyPath({
  id: 'transformation-journey',
  title: "Transformation Journey: Breaking Patterns",
  subtitle: "21-day guided recovery experience",
  description: "This extended journey helps you understand, address, and transform challenging patterns in your life through awareness, strategy-building, and sustainable change practices.",
  iconName: "Droplet",
  color: "26, 155, 155", // RGB for #1a9b9b teal color
  days: transformationJourneyDays,
  progressField: "transformationJourneyProgress",
  difficulty: 'advanced',
  tags: ['habit-change', 'recovery', 'transformation']
});

// Register NEW Creative Expression path
JOURNEY_PATHS['creative-expression'] = createJourneyPath({
  id: 'creative-expression',
  title: "Creative Expression",
  subtitle: "14-day creative unblocking journey",
  description: "Rediscover your creative voice through daily prompts designed to overcome blocks, explore new forms of expression, and establish a sustainable creative practice.",
  iconName: "Palette",
  color: "245, 158, 11", // Amber color
  days: creativeExpressionDays,
  difficulty: 'beginner',
  tags: ['creativity', 'expression', 'art']
});

// Register NEW Habit Formation path
JOURNEY_PATHS['habit-formation'] = createJourneyPath({
  id: 'habit-formation',
  title: "Habit Formation",
  subtitle: "30-day behavior change framework",
  description: "Leverage behavioral science principles to establish new habits through daily reflection, tracking, and adjusting your approach for long-term success.",
  iconName: "RotateCcw",
  color: "79, 70, 229", // Indigo color
  days: habitFormationDays,
  difficulty: 'intermediate',
  tags: ['habits', 'behavior-change', 'consistency']
});

// Register NEW Life Vision path
JOURNEY_PATHS['life-vision'] = createJourneyPath({
  id: 'life-vision',
  title: "Life Vision & Purpose",
  subtitle: "100-day comprehensive life journey",
  description: "Our most comprehensive journey guides you through a deep exploration of your past, present, and future to create an intentional vision for your life's next chapter.",
  iconName: "Map",
  color: "147, 51, 234", // Purple color
  days: lifeVisionDays,
  isPremium: false, // Mark this as a premium path
  difficulty: 'advanced',
  tags: ['life-purpose', 'vision', 'legacy']
});

// ============================================================================
// ✨ KAIROS MOMENTS — the app's namesake path (exclusive one-time purchase)
// 9 days on the opportune moment: recognizing it, waiting for it, seizing it.
// Every prompt is designed to work equally spoken aloud OR drawn — the user
// chooses their medium each day (isFlexModal).
// ============================================================================
export const kairosMomentsDays = [
  {
    day: 1,
    title: "The Doorway",
    theme: "Recognition",
    prompt: "Every life has doorways — moments that split time into before and after. Revisit one of yours. Write the story down, speak it as if telling it to someone who loves you, or draw the doorway itself: what stood on each side, and what it felt like to cross."
  },
  {
    day: 2,
    title: "The Almost",
    theme: "Honesty",
    prompt: "Somewhere behind you is a moment you saw coming and let pass — a word unsaid, a leap untaken. Without judging yourself, give that almost-moment a shape. Write it a letter, speak to it directly and tell it what you understand now, or draw what it looked like as it drifted by."
  },
  {
    day: 3,
    title: "Ordinary Gold",
    theme: "Presence",
    prompt: "Kairos hides inside ordinary days. Somewhere in the last 24 hours, a small opportune moment offered itself — a pause, a glance, an opening. Find it. Write or speak it back into existence with every detail you can recover, or draw the moment glowing inside the plain day that surrounded it."
  },
  {
    day: 4,
    title: "The Signal",
    theme: "Discernment",
    prompt: "Your body knows when it's time before your mind agrees — a quickening, a stillness, a pull. How does 'now' announce itself in you? Describe your signal — on paper or aloud — so you'll recognize it next time, or draw what it feels like from the inside."
  },
  {
    day: 5,
    title: "The Waiting Room",
    theme: "Patience",
    prompt: "Between moments there is waiting — and waiting is not nothing; it's where readiness is built. What are you waiting for right now, and who are you becoming while you wait? Write or speak about the season you're in, or draw the waiting room of your life and what's growing there quietly."
  },
  {
    day: 6,
    title: "Seized",
    theme: "Confidence",
    prompt: "At least once, you moved at exactly the right moment — you said yes, walked out, held on, let go. Return to that day as evidence of what you're capable of. Retell it with pride — written or aloud — or draw the instant of the leap itself, mid-air."
  },
  {
    day: 7,
    title: "The Knock",
    theme: "Courage",
    prompt: "Something is knocking right now — an invitation you keep hearing at the edge of your days. Name it without flinching. Write or speak about what's asking to happen and what the knock sounds like, or draw the door as it looks today: how thick, how heavy, and how far it has already opened."
  },
  {
    day: 8,
    title: "Making Room",
    theme: "Release",
    prompt: "You can't catch the moment with full hands. Something — a habit, a fear, a grudge, a plan that expired — has to be set down first. Write or speak about what you're ready to release and what it has cost you to carry, or draw your open hands and what falls away from them."
  },
  {
    day: 9,
    title: "The Meeting",
    theme: "Commitment",
    prompt: "Your next kairos moment is already on its way. Meet it ahead of time: make it a promise. Write your vow down or speak it aloud — what you will do when it arrives, in the exact words you want to remember — or draw the meeting itself: you, the moment, and the first step after."
  }
];

JOURNEY_PATHS['kairos-moments'] = createJourneyPath({
  id: 'kairos-moments',
  title: "Kairos Moments",
  subtitle: "9 days on the art of the opportune moment",
  description: "The path the app is named for. Kairos — the fleeting, opportune moment — can be recognized, waited for, and seized. Nine days of reflection where you choose your medium each day: write it, speak it aloud, or draw it. Recognition, honesty, patience, courage — and finally, a vow to meet your next moment ready.",
  iconName: "Hourglass",
  days: kairosMomentsDays,
  color: "212, 175, 55", // Gold — the exclusive path
  tags: ['kairos', 'timing', 'multi-modal', 'exclusive'],
  duration: 9,
  difficulty: 'intermediate',
  recommendedFor: ['moment seekers', 'threshold dwellers', 'anyone sensing it might be time'],
  isFlexModal: true,
  isExclusive: true,
  isNew: false,
  price: '€2.99'
});

// ===========================================================================
// KAIROS CARDS — the first INTERACTIVE path. Each day deals a themed hand of
// prompts; the user taps Shuffle to draw the next card until one fits, then
// answers it in any medium (write / speak / draw). `prompts` is the hand;
// `prompt` mirrors the first card so every reader that expects a single
// prompt string (Home hero, PDF export, archive) keeps working unchanged.
// Bundled into the Kairos Moments package — see constants/pathBundles.js.
// ===========================================================================
export const kairosCardsDays = [
  // ---- WEEK 1: ARRIVING (Days 1-7) — showing up, noticing, the present ----
  {
    day: 1,
    title: "Arriving",
    theme: "Checking In",
    prompts: [
      "What's the first honest thing you'd say if someone asked how you actually are today?",
      "Capture this exact moment — the room, the light, the sound, the feeling in your chest right now.",
      "What made you open this today? Follow that thread wherever it wants to go.",
      "If today were a color, which one — and why that shade?",
      "Finish it, in any medium: 'Right now, I just need to say…'"
    ]
  },
  {
    day: 2,
    title: "What's Here",
    theme: "The Senses",
    prompts: [
      "Right now, what can you hear? Start there and let it lead you somewhere.",
      "Give shape to the most vivid thing your senses are picking up this minute.",
      "What's the texture of today — rough, soft, sharp, still? Show it however you like.",
      "Close your eyes for ten seconds. What's the first thing you notice when you open them?",
      "Describe today as a smell or a taste. What does this day actually feel like from the inside?"
    ]
  },
  {
    day: 3,
    title: "The Overlooked",
    theme: "Small Things",
    prompts: [
      "Name one small thing from today that you'd normally walk right past.",
      "What tiny good thing happened in the last 24 hours that you didn't stop to notice?",
      "Give attention to something ordinary near you — really look at it, then capture what you see.",
      "What small comfort are you grateful for that you usually take completely for granted?",
      "Find the most beautiful unremarkable thing in your day and make it remarkable."
    ]
  },
  {
    day: 4,
    title: "Inner Weather",
    theme: "Today's Mood",
    prompts: [
      "If your inside were weather right now, what's the forecast — and what's driving it?",
      "What's the emotional temperature of your day so far? Show it however feels right.",
      "Name the feeling that's been quietly running underneath everything today.",
      "What's taking up the most room in your head right now? Give it some air.",
      "Is today a light day or a heavy one? Capture the weight of it."
    ]
  },
  {
    day: 5,
    title: "In the Body",
    theme: "The Physical",
    prompts: [
      "Where does today live in your body — the tension, the ease, the tiredness? Locate it.",
      "Scan from head to toe. What's the loudest thing your body is telling you right now?",
      "What does your body need today that you've been ignoring? Give it a voice.",
      "Show the difference between how your body felt this morning and how it feels now.",
      "If the tightest or heaviest part of you could speak, what would it say?"
    ]
  },
  {
    day: 6,
    title: "A Single Moment",
    theme: "Presence",
    prompts: [
      "Pick one moment from today and slow it all the way down. What was actually in it?",
      "What's a moment from the last day you'd want to keep? Capture it before it fades.",
      "Freeze a single ordinary instant from today and give it the attention of a photograph.",
      "When did time feel different today — faster or slower? Return to that moment.",
      "What's one moment you were fully present for — and one you wish you'd been present for?"
    ]
  },
  {
    day: 7,
    title: "Seven Days In",
    theme: "First Week",
    prompts: [
      "A week of showing up. What surprised you about doing this every day?",
      "Look back over your first seven cards. What theme keeps quietly reappearing?",
      "What's different about how you're paying attention now versus day one?",
      "Which day this week landed hardest — and why that one?",
      "Finish it: 'After one week of this, I've noticed that I…'"
    ]
  },

  // ---- WEEK 2: GOING DEEPER (Days 8-14) — feelings, memory, people, honesty ----
  {
    day: 8,
    title: "Naming It",
    theme: "A Feeling",
    prompts: [
      "What's a feeling you've had this week that you never quite found the word for?",
      "Pick an emotion that's been visiting a lot lately and give it your full attention.",
      "What are you feeling right now that's more complicated than 'fine'? Untangle it a little.",
      "Where did today's strongest feeling come from? Trace it back to its start.",
      "If a feeling you've been avoiding could speak to you, what would it want to say?"
    ]
  },
  {
    day: 9,
    title: "The Keeping",
    theme: "A Memory",
    prompts: [
      "What memory has drifted up lately, unasked? Follow it and see where it goes.",
      "Capture a memory you'd hate to lose — in enough detail that it stays.",
      "What's a small moment from years ago that somehow still lives in you? Revisit it.",
      "Return to a place from your past that felt safe. What was it, and where did it go?",
      "What memory makes you smile every single time? Deal yourself back into it for a minute."
    ]
  },
  {
    day: 10,
    title: "Someone",
    theme: "A Person",
    prompts: [
      "Who's been on your mind lately? Say what you'd say to them if they were here.",
      "Capture someone you love the way only you see them — the details others miss.",
      "Who shaped you more than they'll ever know? Give them their due today.",
      "Is there someone you miss right now? Let yourself miss them out loud.",
      "Who made your life a little better recently, and did you ever tell them? Tell them here."
    ]
  },
  {
    day: 11,
    title: "Unsaid",
    theme: "The Honest Thing",
    prompts: [
      "What's something true you've been carrying around unsaid? The page keeps secrets.",
      "If you could say one honest thing with no consequences, what would it be?",
      "What have you been telling yourself is fine that isn't quite fine?",
      "Finish it without flinching: 'What I'm not saying out loud is…'",
      "What's the thing you'd only admit to a journal? This is the journal. Admit it."
    ]
  },
  {
    day: 12,
    title: "Wanting",
    theme: "Desire",
    prompts: [
      "What do you actually want right now — under the sensible answer, the real one?",
      "If nothing were in the way, what would you reach for first? Let yourself want it.",
      "What have you been quietly longing for and not letting yourself say?",
      "Name one small want you could actually give yourself this week.",
      "What did you want badly once that you've stopped letting yourself want? Is it still there?"
    ]
  },
  {
    day: 13,
    title: "The Hard Thing",
    theme: "A Difficulty",
    prompts: [
      "What's the hardest thing you're carrying right now? Set some of it down here.",
      "What's been weighing on you that you keep pushing to tomorrow? Face it for a few minutes.",
      "Give shape to a worry that's been circling — sometimes naming it shrinks it.",
      "What's a challenge you're in the middle of, and what would help even a little?",
      "What would you tell a friend carrying exactly what you're carrying right now?"
    ]
  },
  {
    day: 14,
    title: "Gentle",
    theme: "Self-Kindness",
    prompts: [
      "Say something to yourself today in the voice you'd use for someone you love.",
      "What do you need to forgive yourself for, even a little? Begin it here.",
      "Where have you been too hard on yourself lately? Ease up, out loud.",
      "What's one kind, true thing about you that you rarely let yourself hear?",
      "If you could give the tired part of you exactly what it needs, what would that be?"
    ]
  },

  // ---- WEEK 3: LOOKING OUTWARD (Days 15-21) — gratitude, joy, hopes, forward ----
  {
    day: 15,
    title: "Thanks",
    theme: "Gratitude",
    prompts: [
      "What are you genuinely grateful for today — beyond the obvious, the real one?",
      "Who or what quietly held you up this week? Give thanks for it here.",
      "Capture one thing you'd miss terribly if it were suddenly gone.",
      "What small mercy of an ordinary day deserves a proper thank-you?",
      "Finish it: 'I don't say it enough, but I'm grateful for…'"
    ]
  },
  {
    day: 16,
    title: "What Lights You",
    theme: "Joy",
    prompts: [
      "What made you feel most alive recently? Return to it and relive it a little.",
      "What reliably lights you up — and when did you last let it?",
      "Capture something that brought you pure, uncomplicated delight.",
      "When did you last lose track of time in a good way? What were you doing?",
      "What's a small joy you could give yourself more of, starting this week?"
    ]
  },
  {
    day: 17,
    title: "Ahead",
    theme: "A Hope",
    prompts: [
      "What are you quietly looking forward to? Let yourself get excited about it.",
      "What do you hope is true a year from now? Say it as if it already is.",
      "Capture a small hope you've been almost afraid to name.",
      "What's one thing you want to be different, and what's the first tiny step?",
      "Finish it: 'The version of me I'm moving toward is someone who…'"
    ]
  },
  {
    day: 18,
    title: "What Matters",
    theme: "Values",
    prompts: [
      "What matters most to you — really — and does your week reflect it?",
      "When did you feel most like yourself recently? What were you honoring in that moment?",
      "Name something you'd never trade away, no matter what. Why that one?",
      "What do you want your life to stand for, in the simplest words you've got?",
      "What's a value you were raised with that you'd keep — and one you're ready to leave behind?"
    ]
  },
  {
    day: 19,
    title: "Becoming",
    theme: "The Emerging You",
    prompts: [
      "Who are you becoming lately? Capture the version of you that's still forming.",
      "What's shifted in you over the last few weeks, even quietly?",
      "What old story about yourself are you starting to outgrow?",
      "What would the you of a year ago be surprised to see about you now?",
      "Finish it: 'I'm not who I was, and I'm learning that I…'"
    ]
  },
  {
    day: 20,
    title: "Forward",
    theme: "A Small Promise",
    prompts: [
      "What's one small promise you want to make to yourself as this deck winds down?",
      "What have these days shown you that you want to keep doing?",
      "Name one thing you'll carry forward from this — and how you'll actually hold onto it.",
      "What would 'keeping this going' look like in your real, ordinary week?",
      "Finish it and mean it: 'From here, I want to…'"
    ]
  },
  {
    day: 21,
    title: "What the Cards Knew",
    theme: "The Whole Deck",
    prompts: [
      "Twenty-one days of shuffling and showing up. What did the deck end up teaching you?",
      "Look back through everything you've made here. What does this person keep circling?",
      "What surprised you most about yourself across these three weeks?",
      "Which card, on which day, still echoes? Return to it one last time.",
      "Finish it: 'When I started, I thought this was about ____. It turned out to be about…'"
    ]
  }
];

// Mirror the first card into `prompt` on every day, so any reader that expects
// a single prompt string (Home hero, PDF export, archive) has a sensible
// default without knowing about the shuffle mechanic.
kairosCardsDays.forEach((d) => { d.prompt = d.prompts[0]; });

JOURNEY_PATHS['kairos-cards'] = createJourneyPath({
  id: 'kairos-cards',
  title: "Kairos Cards",
  subtitle: "21 days you shuffle — deal yourself the prompt that fits",
  description: "The first interactive path. Each day deals you a hand of prompts — if the card doesn't fit your day, shuffle for another until one lands. Then answer it however you like: write it, speak it, or draw it. No wrong card, no pressure — a gentle, agency-first way to start (or restart) the journaling habit. Part of the Kairos Moments package.",
  iconName: "Shuffle",
  days: kairosCardsDays,
  color: "230, 145, 90", // Warm amber — sibling to Kairos Moments' gold
  tags: ['kairos', 'interactive', 'shuffle', 'multi-modal', 'exclusive'],
  duration: 21,
  difficulty: 'beginner',
  recommendedFor: ['new journalers', 'anyone restarting the habit', 'the pressure-averse'],
  isFlexModal: true,
  isInteractive: true,
  isExclusive: true,
  isNew: true,
  price: '€2.99'
});

// ===========================================================================
// KAIROS SPARKS — the blank-canvas member of the Kairos trilogy. Each day gives
// a single evocative "spark" (a word, an image) and nothing else — no prompt,
// no scaffolding. Shuffle for a different spark if one doesn't catch. Reuses
// the same interactive `prompts` hand + shuffle mechanic as Kairos Cards.
// Bundled into the Kairos Moments package — see constants/pathBundles.js.
// ===========================================================================
export const kairosSparksDays = [
  { day: 1, title: "First Spark", theme: "Beginnings",
    prompts: ["threshold", "the blank page", "almost", "first light", "what you came here to say", "begin"] },
  { day: 2, title: "Light & Shadow", theme: "Light",
    prompts: ["dusk", "a flicker", "the last light of the day", "glare", "the shadow you cast", "dawn"] },
  { day: 3, title: "What You Carry", theme: "Weight",
    prompts: ["anchor", "feather-light", "the thing you carry", "ballast", "what you'd set down", "the load"] },
  { day: 4, title: "The Water", theme: "Flow",
    prompts: ["undertow", "still water", "the flood", "the deep end", "a single ripple", "the tide going out"] },
  { day: 5, title: "The People", theme: "Connection",
    prompts: ["a face you miss", "the stranger", "the one who left", "your hands", "home", "a name unsaid for years"] },
  { day: 6, title: "The Hours", theme: "Time",
    prompts: ["later", "the long way round", "too soon", "the waiting", "again", "someday"] },
  { day: 7, title: "Small Things", theme: "The Overlooked",
    prompts: ["a crumb", "dust in a sunbeam", "the overlooked", "one degree warmer", "a whisper", "the smallest good thing"] },
  { day: 8, title: "The Fire", theme: "Heat",
    prompts: ["a spark", "ember", "ash", "the struck match", "warmth", "what's still burning"] },
  { day: 9, title: "The Distance", theme: "Nearness",
    prompts: ["the space between", "arm's length", "the horizon", "far", "within reach", "the gap"] },
  { day: 10, title: "Wanting", theme: "Desire",
    prompts: ["hunger", "enough", "the itch", "thirst", "restless", "the pull"] },
  { day: 11, title: "The Roots", theme: "Origins",
    prompts: ["where you're from", "the ground beneath", "buried", "deep", "home soil", "the oldest branch"] },
  { day: 12, title: "The Rooms", theme: "Spaces",
    prompts: ["the empty chair", "a light left on", "the window", "the hallway", "the room you avoid", "the kitchen table"] },
  { day: 13, title: "In Motion", theme: "Movement",
    prompts: ["leap", "drift", "the turn", "the pause", "forward", "held still"] },
  { day: 14, title: "Openings", theme: "Endings & Beginnings",
    prompts: ["the last page", "goodbye", "the blank page again", "what's next", "begin again", "the opening door"] }
];

// Mirror the first spark into `prompt` on every day, so any reader that expects
// a single prompt string (Home hero, PDF export, archive) has a sensible default.
kairosSparksDays.forEach((d) => { d.prompt = d.prompts[0]; });

JOURNEY_PATHS['kairos-sparks'] = createJourneyPath({
  id: 'kairos-sparks',
  title: "Kairos Sparks",
  subtitle: "14 days, one spark each — you supply the rest",
  description: "The most open path. Each day gives you a single evocative spark — a word, an image — and nothing more. No prompt, no scaffolding: you decide what it means and where it goes. Shuffle for a different spark if one doesn't catch, then write it, speak it, or draw it. The blank-canvas member of the Kairos Collection.",
  iconName: "Sparkles",
  days: kairosSparksDays,
  color: "244, 197, 102", // Bright candle-gold — completes the Kairos warm trio
  tags: ['kairos', 'interactive', 'minimalist', 'multi-modal', 'exclusive'],
  duration: 14,
  difficulty: 'beginner',
  recommendedFor: ['free spirits', 'the over-prompted', 'anyone who wants room'],
  isFlexModal: true,
  isInteractive: true,
  isExclusive: true,
  isNew: true,
  price: '€2.99'
});

/* =============================================================================
   STARTING OVER — a one-time-purchase package of three paths, 42 days.
   For people who moved country and began again. Sold as one product anchored
   on 'starting-over'; see BUNDLES in src/constants/pathBundles.js.

   The arc is split so a reader can enter where they actually are: The Crossing
   for the first months, Learning to Speak for the year language takes, Two
   Homes for the long middle where it stops being an ordeal and becomes a life.
   ========================================================================== */

// The Body That Hurts — chronic pain and chronic illness.
//
// The hazard in this one is not tone, it is implication. People with chronic
// pain are told constantly that it is stress, or attitude, or trauma they have
// not processed. Any prompt that hints at reframing, gratitude or positive
// thinking reproduces exactly the dismissal they get from doctors, and would be
// read as an insult rather than a suggestion. Nothing here asks anyone to feel
// better about it, and nothing implies the pain is generated by the mind.
//
// It also does not promise improvement. Writing does not treat chronic pain.
// What it can do is give an accurate record to someone who is routinely told
// their account is unreliable — which is why several days are about language
// and evidence rather than feeling.
//
// Energy is the scarce resource for this audience, so prompts are answerable
// briefly. Day 10 makes that explicit rather than pretending otherwise.
export const bodyPainDays = [
  {
    day: 1,
    title: "An Ordinary Day",
    theme: "Record",
    prompt: `Not your worst day and not your best. A Tuesday.

• What time did you wake, and what was the first thing your body told you?
• What did the day cost to get through, in the order it cost it?
• What did you not do, that someone watching would not have noticed?

Write the day as it actually went. Leave in the parts you would normally edit out for being boring.`
  },
  {
    day: 2,
    title: "What It Actually Feels Like",
    theme: "Language",
    prompt: `"Seven out of ten" tells nobody anything. You have better words than the form allows.

• Where is it, and what is it doing — burning, dragging, gripping, humming?
• Does it move, and does it have a rhythm you could predict?
• What is the closest thing a person without it has felt?

Write a description you would actually recognise on re-reading, using none of the words from a pain scale.`
  },
  {
    day: 3,
    title: "The Translation",
    theme: "Performance",
    prompt: `There is what it is like, and there is what you say when asked. They diverged a long time ago.

• What do you say when someone asks how you are, and what is true?
• Who gets a slightly truer version, and why them?
• How much energy goes into seeming fine, and what does that spend leave?

Write both answers to "how are you" side by side — the one you give, and the one you would give if it were safe.`
  },
  {
    day: 4,
    title: "Not Being Believed",
    theme: "Testimony",
    prompt: `Being disbelieved is its own injury, separate from the pain and sometimes worse.

• Who has not believed you — a doctor, a manager, a relative, yourself?
• What did they say, in their words as closely as you can recall?
• What did you start doing differently afterwards to be believed?

Write what you have had to do to be taken seriously, and what it costs to do it every time.`
  },
  {
    day: 5,
    title: "The Appointment",
    theme: "Evidence",
    prompt: `The peculiar performance of proving something invisible to someone with eleven minutes.

• How do you prepare — what do you rehearse, bring, wear, leave out?
• What have you learned not to mention because of how it gets heard?
• What happened the last time, and what did you do in the car afterwards?

Write what you would say to a doctor with unlimited time who had already decided to believe you.`
  },
  {
    day: 6,
    title: "Have You Tried",
    theme: "Advice",
    prompt: `Everyone has a suggestion. Most of them have been tried, and the suggesting is rarely about you.

• What is the suggestion you get most often, and how many times have you tried it?
• What does the person offering it need from the exchange?
• Which piece of advice actually helped, if any?

Write the reply you have never given to the person who tells you about yoga.`
  },
  {
    day: 7,
    title: "The Body You Had",
    theme: "Loss",
    prompt: `There was a body before this one, and it is reasonable to grieve it.

• What could it do that this one cannot?
• What did you take entirely for granted, and when did you last do it without thinking?
• Was there a last time, and did you know it was the last time?

Write about the old body as you would write about a person you have lost.`
  },
  {
    day: 8,
    title: "What Got Cancelled",
    theme: "Revision",
    prompt: `Illness edits plans without asking, and the edits are rarely acknowledged out loud.

• What were you going to do or be, before?
• Which of those is genuinely gone, and which have you assumed is gone?
• What has quietly replaced them, if anything?

Write the version of your life that did not happen, without deciding yet how you feel about it.`
  },
  {
    day: 9,
    title: "The Good Day",
    theme: "Cost",
    prompt: `A good day is not a reprieve. It is usually a loan.

• What do you do when a good day arrives, and what does it cost afterwards?
• How many days do you pay, and does anyone connect the two?
• What would it take to spend a good day carefully rather than all at once?

Write what you would do with a good day if there were no bill attached, and then what you will actually do.`
  },
  {
    day: 10,
    title: "The Arithmetic",
    theme: "Budget",
    prompt: `Energy is currency, the balance is small, and nobody else sees the ledger. Short answers today.

• What did this week's energy go on, in rough proportions?
• What is non-negotiable, and what only feels non-negotiable?
• What are you spending on other people's comfort rather than your own life?

List the three largest expenditures. Mark one you could stop paying.`
  },
  {
    day: 11,
    title: "Who Stayed",
    theme: "Presence",
    prompt: `Some people did not leave and did not make it about themselves. That is rarer than it should be.

• Who is still here, and what specifically do they do?
• Who understood without needing it explained repeatedly?
• Who adjusted quietly, without announcing the adjustment?

Name one person and write exactly what they do that helps, in enough detail that they could keep doing it.`
  },
  {
    day: 12,
    title: "Who Drifted",
    theme: "Subtraction",
    prompt: `Chronic illness rarely ends friendships loudly. They mostly thin out.

• Who is no longer around, and when did you notice?
• Was it your withdrawal, theirs, or the arithmetic of cancelled plans?
• Which absence still stings, and which turned out to be a relief?

Write what you would say to the one whose leaving you have not stopped thinking about.`
  },
  {
    day: 13,
    title: "What Actually Helps",
    theme: "Accuracy",
    prompt: `Not cures. The small, unglamorous, real things — the ones too minor to mention to a doctor.

• What genuinely makes a difference, however small or strange?
• What position, hour, temperature, order of doing things?
• What have you worked out for yourself that nobody told you?

Write the list you would hand to someone newly diagnosed with what you have.`
  },
  {
    day: 14,
    title: "Terms",
    theme: "Continuance",
    prompt: `Not acceptance, which is usually demanded by people who are not in it. Terms — the arrangement you are actually living under.

• What have you stopped fighting, and was that a loss or a relief?
• What are you still fighting, and is it worth what it costs?
• What would you like the next year to be, given this body rather than another one?

Write the terms you are prepared to live on. Write them as terms, not as a resignation.`
  }
];

// Existential Pain — the four concerns Yalom named as unavoidable: death,
// freedom (and the responsibility that comes with it), isolation, and
// meaninglessness. Three days each, then two on living with them.
//
// The failure mode here is different from Moral Pain's. Writing about
// existential distress tends to reach for consolation — everything happens for
// a reason, the universe has a plan, at least you have your health. Consolation
// is precisely what does not survive contact with these questions, and offering
// it insults someone who has already looked. These prompts stay with the
// question and do not resolve it, because it does not resolve.
//
// Gated behind a disclaimer. "Why go on" is day fourteen's actual subject.
export const existentialPainDays = [
  {
    day: 1,
    title: "The Fact",
    theme: "Finitude",
    prompt: `You are going to die. Not as a metaphor, and not eventually — actually, on a specific date that already exists.

• How old will you be, roughly, if things go normally?
• How many summers is that? Write the number down.
• When did you last think about this on purpose rather than by accident?

Write the number of years you probably have left. Look at it for a moment before moving on.`
  },
  {
    day: 2,
    title: "When You First Knew",
    theme: "Recognition",
    prompt: `Everyone has a moment as a child when it lands for the first time. Most people remember theirs.

• How old were you, and what brought it on — a death, an animal, a thought in bed?
• What did you do with it: ask someone, or decide not to?
• What were you told, and did you believe it?

Describe that moment as the child had it, in the child's words.`
  },
  {
    day: 3,
    title: "What You Do With It",
    theme: "Strategy",
    prompt: `Nobody carries this fact continuously. Everyone has a way of setting it down, and the way is revealing.

• Which is yours — being busy, having children, faith, work that outlives you, not thinking about it?
• When does the strategy stop working, and what happens then?
• What would you have to feel if it stopped working permanently?

Name your strategy honestly, without deciding whether it is good.`
  },
  {
    day: 4,
    title: "Nobody Is Coming",
    theme: "Freedom",
    prompt: `There is no authority that will arrive and tell you what your life was supposed to be for. This is either the worst or the best news, depending on the day.

• Whose approval have you been waiting for, and are they even watching?
• What would you do differently if you accepted no one is going to adjudicate?
• Is there a rule you have been following that nobody actually enforces?

Write down the permission you have been waiting for and who you imagined giving it.`
  },
  {
    day: 5,
    title: "The Freedom You Did Not Want",
    theme: "Responsibility",
    prompt: `Being free to choose sounds like a gift until you notice it means the choices are yours.

• Which choice in your life do you most want to blame on circumstances?
• How much of it was actually circumstance, and how much was preference you did not want to admit?
• What are you choosing right now by not choosing?

Write the sentence "I chose this" about something you usually describe as having happened to you. See whether it is true.`
  },
  {
    day: 6,
    title: "What You Have Deferred",
    theme: "Postponement",
    prompt: `Most people are living a provisional life, waiting for the real one to start.

• What are you waiting for before your life properly begins — money, a partner, a qualification, permission?
• How long have you been waiting, in years?
• What is the actual first step, and what has it cost to not take it?

Write what you would begin this month if you accepted that this is the real life and there is no other one queued behind it.`
  },
  {
    day: 7,
    title: "The Gap",
    theme: "Isolation",
    prompt: `However close you are to someone, you experience your life from inside it and they do not. The gap cannot be closed, only acknowledged.

• Who knows you best, and what proportion of you is that?
• What do they have wrong about you that you have never corrected?
• Is the gap a failure of theirs, or simply the condition?

Write what you have never been able to make anyone fully understand.`
  },
  {
    day: 8,
    title: "What You Have Never Said",
    theme: "Unshared",
    prompt: `Everyone carries something they have not handed to anyone. Not necessarily shameful — just unshared.

• What is it, and how long have you had it?
• Why has it stayed inside: no one would understand, or no one has asked?
• What would change if one person knew?

Write it here, since here is not a person. Notice whether that helps or only postpones.`
  },
  {
    day: 9,
    title: "Alone and Lonely",
    theme: "Distinction",
    prompt: `Being alone is a fact of existence. Being lonely is a response to it, and the two are not the same.

• When were you last alone and completely fine?
• When were you last surrounded by people and unbearably lonely?
• What actually changes between those two states, if it is not the number of people?

Write what you need that other people can genuinely provide, and what you have been asking them for that they cannot.`
  },
  {
    day: 10,
    title: "Does Any Of It Matter",
    theme: "Meaning",
    prompt: `The question underneath the others. Ask it plainly rather than letting it ask you at 4am.

• On a bad night, what is your honest answer?
• On a good day, what changes — the answer, or only how much it presses?
• If the universe is indifferent, does that settle the question or leave it open?

Write your genuine current answer, not the one you would give to reassure someone else.`
  },
  {
    day: 11,
    title: "Borrowed Meaning",
    theme: "Inheritance",
    prompt: `Most people are running on meaning they were handed rather than meaning they chose.

• What did you inherit — a faith, a family expectation, a national story, a career shape?
• Which parts have you actually examined, and which are simply still installed?
• What would remain if you set down everything you never chose?

List what you inherited, and mark each one kept, discarded, or never examined.`
  },
  {
    day: 12,
    title: "What Survives Examination",
    theme: "Residue",
    prompt: `Some things go on mattering even after you have looked at them properly and stopped defending them.

• What still holds when you are at your most sceptical?
• Which of your commitments would you keep even knowing nothing records them?
• What do you do that needs no justification beyond doing it?

Write the shortest true list of what matters to you. Nothing on it should require an argument.`
  },
  {
    day: 13,
    title: "Small Enough To Be True",
    theme: "Scale",
    prompt: `Cosmic meaning is not available. Meaning at human scale mostly is, and people discard it because it looks too small.

• What has felt meaningful this week that you dismissed as not counting?
• Who would notice if you stopped doing it?
• Why does small meaning feel like a consolation prize rather than the actual thing?

Write down one small thing that is true and sufficient, without apologising for its size.`
  },
  {
    day: 14,
    title: "Going On Anyway",
    theme: "Continuance",
    prompt: `Two weeks of questions that do not resolve. The only remaining question is what you do tomorrow morning.

• What have you stopped arguing with in these fourteen days?
• What will you do differently, not because it is justified but because you have decided?
• If none of it is underwritten, what do you choose to be true to regardless?

Write your answer to the only question that stays: knowing all of this, what now?`
  }
];

// Moral Pain — moral injury, which is not guilt and not shame. Guilt is "I did
// a bad thing"; shame is "I am a bad thing"; moral injury is "something happened
// that violated what I believe is right, and I was part of it". The distinction
// matters for every prompt here: the two failure modes in writing about this are
// absolving the person ("you did your best with what you had") and piling on,
// and both stop the work. These ask someone to look without telling them how to
// feel about what they see.
//
// Gated behind a disclaimer — see DISCLAIMER_VARIANTS in JourneyPreviewModal.
// Moral injury correlates with PTSD, depression and suicidality more strongly
// than either subject already gated in this app.
export const moralPainDays = [
  {
    day: 1,
    title: "The Thing Itself",
    theme: "Account",
    prompt: `Before any explanation, write down what happened. Just that.

• What did you do, or fail to do, that you have not been able to put down?
• Where were you, who else was there, and what did it look like?
• At what exact moment did you know?

Write it as a plain account, with no reasons attached. The reasons get their own days.`
  },
  {
    day: 2,
    title: "The Version You Tell",
    theme: "Editing",
    prompt: `There is what happened, and there is the account you have practised. They are rarely the same length.

• How do you describe this when you have to, and what gets left out?
• Which detail do you always include, and what work is it doing for you?
• Who has heard the full version, if anyone?

Put the two side by side and mark every place they differ.`
  },
  {
    day: 3,
    title: "What You Could Have Done",
    theme: "Agency",
    prompt: `This is the question that circles at night, so meet it deliberately rather than at 3am.

• What options did you actually have at the time — not the ones visible now?
• What did you know then, as opposed to what you learned afterwards?
• Were you following an instruction, a fear, or a preference?

Write the honest answer to how much of it was choice. Do not round it in either direction.`
  },
  {
    day: 4,
    title: "The Belief It Broke",
    theme: "Rupture",
    prompt: `Moral pain needs a moral to injure. Something you believed took the damage.

• What did you believe about yourself that this made impossible to keep believing?
• Was it about courage, loyalty, competence, or being someone who does not do that?
• When did you first notice it was gone?

Write the sentence about yourself that you can no longer say.`
  },
  {
    day: 5,
    title: "Whose Voice",
    theme: "Origin",
    prompt: `The standard you failed came from somewhere. It is worth knowing where.

• Who taught you that this was the line, and did they hold it themselves?
• Is it a standard you chose as an adult, or inherited and never examined?
• Would you apply it as harshly to someone else in your position?

Name the person whose judgement you are still imagining. Then say whether it is really theirs or yours.`
  },
  {
    day: 6,
    title: "Whether It Survived",
    theme: "Inventory",
    prompt: `Some beliefs break and stay broken. Others turn out to be intact and merely bruised.

• Do you still think the thing you did was wrong, or only that it felt wrong?
• If someone you love had done it, what would you actually conclude?
• What part of the belief still holds, even now?

Separate what you did from what you are. Write both sentences and notice which is harder.`
  },
  {
    day: 7,
    title: "Who Was Harmed",
    theme: "Names",
    prompt: `Moral pain tends to stay abstract, because abstract is bearable. Today it does not.

• Who was actually affected — name them, or describe them precisely if you never knew the name.
• What happened to them afterwards, as far as you know?
• Have you avoided finding out, and what would finding out change?

Write the name. If there is more than one, write them all.`
  },
  {
    day: 8,
    title: "What It Cost Them",
    theme: "Ledger",
    prompt: `Today is not about your pain. Give theirs the space first — it is the part most often skipped.

• What did this cost the person on the other end of it, concretely?
• What did they lose that cannot be given back?
• What might they not even know they lost?

Write it from their side, in their position, without mentioning yourself.`
  },
  {
    day: 9,
    title: "What It Cost You",
    theme: "Toll",
    prompt: `Now yours. Not as balance — the ledger does not net out — but because it is real and you have been carrying it.

• What has this taken from you since: sleep, closeness, work, the ability to be told you are good?
• What do you avoid now because of it?
• Who has quietly paid for the fact that you are carrying this?

Write the cost plainly, without offering it as payment.`
  },
  {
    day: 10,
    title: "Debt or Punishment",
    theme: "Distinction",
    prompt: `People in moral pain often punish themselves and call it accountability. They are different things.

• What have you been doing to yourself since, and who does it help?
• Would the person harmed be served by any of it?
• What are you owed nothing for, and what is genuinely owed?

Write what you actually owe. Then cross out everything on the list that is only self-punishment.`
  },
  {
    day: 11,
    title: "What You Did Instead",
    theme: "Substitutes",
    prompt: `Where repair is impossible or terrifying, most people substitute something. The substitutes are worth naming.

• What have you done in place of addressing this — overwork, generosity elsewhere, silence, distance?
• Which of those helped someone, and which only helped you not think about it?
• What would you have to stop doing to face it directly?

Name the substitute you are most defensive about.`
  },
  {
    day: 12,
    title: "What Repair Would Be",
    theme: "Specifics",
    prompt: `Not whether it is possible. What it would actually consist of, in concrete terms.

• What would the harmed person need — an account, an acknowledgement, restitution, distance?
• Have you ever asked, or assumed you knew?
• What part of it could you do this month, if you decided to?

Write the specific act. Not "make it right" — the actual thing, with a verb in it.`
  },
  {
    day: 13,
    title: "When It Cannot Be Repaired",
    theme: "Limits",
    prompt: `Sometimes the person is dead, or unreachable, or would be harmed again by hearing from you. This is the day for that.

• What makes repair impossible here — their absence, their refusal, or your own imagination of it?
• If contact would hurt them again, whose need would the apology serve?
• What can be done that does not involve them at all?

Write what you will do instead, given that the direct route is closed.`
  },
  {
    day: 14,
    title: "Carrying It",
    theme: "Continuance",
    prompt: `The aim was never to stop feeling this. It is to stop it running the place.

• What has changed in fourteen days — not about the event, about your grip on it?
• What will you do when it surfaces again, because it will?
• What do you want it to have made you, if it must have made you something?

Write a paragraph to yourself for the next time this arrives at 3am. Be accurate rather than kind.`
  }
];

// First Light — the shortest path in Kairos, and the only one whose subject is
// Kairos itself. Three days, one per medium: written, spoken, drawn. It exists
// so someone can find out which mode is theirs before committing to a
// fourteen-day path, so each day has to stand on its own rather than build an
// arc, and each has to give a reason the medium is different from the last.
export const firstLightDays = [
  {
    day: 1,
    title: "One True Thing",
    theme: "Beginning",
    type: "text",
    modality: "writing",
    prompt: `Most journals open with what happened today. Start somewhere harder.

• What is true for you today that you have not said out loud to anyone?
• Is it true because something happened, or because you finally stopped avoiding it?
• Who would be most surprised to read it, and what does that tell you?

Write it as one sentence. Then write the sentence underneath it that you actually mean.`
  },
  {
    day: 2,
    title: "Out Loud",
    theme: "Voice",
    type: "voice",
    modality: "speaking",
    prompt: `Writing gives you time to edit. Speaking does not, which is the point of today.

• Say the thing you began writing yesterday and then softened.
• Listen for where your voice changes — that is usually the real sentence.
• What arrives when you do not get to choose the words carefully?

Record it once. Do not re-record — the first take is the honest one.`
  },
  {
    day: 3,
    title: "No Words For It",
    theme: "Image",
    type: "visual",
    modality: "art",
    prompt: `Some things are not sentences, and forcing them into sentences loses them.

• Draw the shape of the last few days — not a picture of what happened, the shape of it.
• Reach for whichever colour is nearest to right, even if you cannot justify it.
• Where did your hand slow down or hesitate?

Give it a title of three words or fewer, and resist explaining it.`
  }
];

export const startingOverCrossingDays = [
  {
    day: 1,
    title: "What Ended",
    theme: "Rupture",
    prompt: `Before the moving, before the paperwork, something ended. Start there.

• What actually ended — a plan, a career, a relationship, a body that worked, a country that stopped being possible?
• Did you get to grieve it, or did the logistics start immediately?
• What have you been calling "a move" that was really a loss?

Write the ending in one sentence, without the word "but".`
  },
  {
    day: 2,
    title: "Chosen or Forced",
    theme: "Agency",
    prompt: `People will ask why you came. The honest answer is rarely the one you give them.

• How much of this was chosen, and how much was the only remaining option?
• What do you say when people ask, and how far is it from the truth?
• If it was forced, what does it cost you to describe it as a choice?

Write the version you have never said out loud.`
  },
  {
    day: 3,
    title: "What You Packed",
    theme: "Selection",
    prompt: `You reduced a life to what would travel. That list says something.

• What did you take that made no practical sense?
• What did you agonise over and then leave behind?
• What did you assume you could replace, and were you right?

Name the one object you would go back for.`
  },
  {
    day: 4,
    title: "What You Left",
    theme: "Loss",
    prompt: `Not the objects. The rest of it.

• Which relationship changed shape the moment you left, whether or not anyone admitted it?
• What role did you hold there that nobody here knows you ever had?
• What did you leave unfinished because leaving finished it for you?

Write the name of one person you left, and what you owe them.`
  },
  {
    day: 5,
    title: "The Last Day",
    theme: "Departure",
    prompt: `Most people remember arriving. Fewer let themselves remember the day before.

• Where were you, and who was with you, on your last ordinary day there?
• What did you do that you did not know was for the last time?
• What did you say goodbye to properly, and what did you skip?

Describe the last hour in that place, in detail, as if you were there.`
  },
  {
    day: 6,
    title: "The First Week",
    theme: "Arrival",
    prompt: `The first week is usually a blur with three sharp things sticking out of it.

• What are the three things you actually remember from that week?
• What did you get wrong about this place in the first seven days?
• Where did you sleep, and did it feel like anything?

Write the first moment you thought: this is real now.`
  },
  {
    day: 7,
    title: "Suddenly Incompetent",
    theme: "Humility",
    prompt: `You knew how to do everything. Then you didn't know how to post a letter.

• What ordinary task defeated you first — a form, a ticket machine, a phone call, a shop?
• You were competent somewhere. What did it do to you to be treated as though you weren't?
• Who watched you fail at something small, and how did you feel about them afterwards?

Name one thing you can do now without thinking that once took your whole day.`
  },
  {
    day: 8,
    title: "The Paperwork",
    theme: "Endurance",
    prompt: `Nobody tells you that starting over is mostly queuing.

• Which office, form or appointment has taken the most out of you?
• What did you learn about how this country sees people like you, from how it processes them?
• What are you still waiting on, and what does the waiting stop you doing?

Write one sentence about what you would say to the person behind that desk.`
  },
  {
    day: 9,
    title: "Who You Told",
    theme: "Disclosure",
    prompt: `Some people got the full story. Most got a shorter one.

• Who at home knows how hard this actually was, and who gets the edited version?
• What are you protecting them from, and is that the real reason?
• Who here has no idea what you left, because you have never explained it?

Write the paragraph you would send home if you told the truth.`
  },
  {
    day: 10,
    title: "The First Time You Cried Here",
    theme: "Breaking",
    prompt: `There is usually a small, stupid trigger. That is normal, and it is worth writing down.

• When was it, and what set it off — something trivial, most likely?
• Were you alone, and did you want to be?
• What had you been carrying for weeks that finally came out over nothing?

Write what you needed in that moment, and whether you asked for it.`
  },
  {
    day: 11,
    title: "What You Expected to Miss",
    theme: "Prediction",
    prompt: `You braced for certain losses. Check your predictions.

• What did you expect to miss most before you left?
• Do you actually miss it, or was that a story about who you thought you were?
• What have you replaced it with, if anything?

Write the thing you were sure you would miss and don't.`
  },
  {
    day: 12,
    title: "What Surprised You",
    theme: "Discovery",
    prompt: `The real homesickness comes for things nobody warns you about.

• What do you miss that you never once thought about while you lived there?
• What ordinary thing here still catches you off guard?
• What has this place given you that you did not know you wanted?

Name one small thing here you would now be sad to lose.`
  },
  {
    day: 13,
    title: "Who Helped",
    theme: "Debt",
    prompt: `Somebody made this survivable, and it is easy to forget them once you are steady.

• Who helped when you had nothing to offer in return?
• What did they do — practically, not sentimentally?
• Have you ever told them, and if not, what stops you?

Write what you would say to them, then decide whether to send it.`
  },
  {
    day: 14,
    title: "A Letter to the Plane",
    theme: "Integration",
    prompt: `Write to the person in transit, before any of this had happened.

• What do they most need to hear — not reassurance, information?
• What are they about to get wrong, and can you spare them it?
• What would you refuse to tell them, because they have to find it themselves?

Write it as a letter, addressed to them, dated the day you arrived.`
  }
];

export const learningToSpeakDays = [
  {
    day: 1,
    title: "The Word You Couldn't Find",
    theme: "Silence",
    prompt: `There was a first time you stood in a room, knew exactly what you meant, and had nothing to say it with.

• Where were you, and what were you trying to say?
• What did you do instead — gesture, simplify, give up, laugh?
• What did the other person think you meant?

Write the sentence you wanted to say, in full, now that you can.`
  },
  {
    day: 2,
    title: "Treated as Simple",
    theme: "Perception",
    prompt: `Your vocabulary shrank. People assumed you had.

• When did someone speak to you slowly, loudly, or in very short words, and what did that feel like?
• What were you actually thinking in that moment that you couldn't say?
• Have you ever done this to someone else, before you knew?

Write one sentence you wanted to say back — in your own language, then in theirs.`
  },
  {
    day: 3,
    title: "Your Jokes Don't Land",
    theme: "Humour",
    prompt: `Humour is the last thing to arrive and the first thing you miss.

• What kind of funny were you at home — dry, quick, absurd, cutting?
• What happened the first time you tried it here?
• Who here has never once seen you be funny?

Write a joke that works in your first language and cannot survive translation.`
  },
  {
    day: 4,
    title: "The Exhaustion",
    theme: "Cost",
    prompt: `A day in another language costs something a day at home does not.

• How do you feel at 6pm after a day of listening in a language you are still learning?
• What do you avoid because you do not have the energy for it in this language?
• What have you cancelled, or not started, for this reason alone?

Name the thing you keep putting off because it would have to happen in their words.`
  },
  {
    day: 5,
    title: "The First Joke You Understood",
    theme: "Threshold",
    prompt: `Comprehension arrives before production. There is a day the room becomes funny.

• When did you first laugh at something without translating it first?
• Who was there, and did they notice?
• What did it feel like in your body?

Write the moment down, in as much detail as you have.`
  },
  {
    day: 6,
    title: "The First Joke You Made",
    theme: "Return",
    prompt: `Making people laugh in a foreign language is the moment you get yourself back.

• When did you first say something funny on purpose, in this language, and have it work?
• Who laughed, and what did you feel?
• How long was it between understanding their humour and being able to use it?

Write what you said. Even if it was small.`
  },
  {
    day: 7,
    title: "Words They Have That You Don't",
    theme: "Gain",
    prompt: `Every language carries ideas the others have to explain.

• Which word here has no clean equivalent at home?
• What does having that word let people notice that you previously had no handle for?
• Has it changed anything about how you think?

Write the word, then write what it would take to explain it to your mother.`
  },
  {
    day: 8,
    title: "Words You Have That They Don't",
    theme: "Untranslatable",
    prompt: `And every language leaves you carrying things nobody here can receive.

• Which word from your language do you most wish existed here?
• What have you failed to explain because there was no word for it?
• What does it cost you that the people around you cannot name this thing?

Write the word, and then attempt the translation you have always avoided.`
  },
  {
    day: 9,
    title: "Who You Are in Each Language",
    theme: "Selves",
    prompt: `Most people are not the same person in their second language. That is not a failure.

• Are you warmer, blunter, funnier, more careful, more formal in one than the other?
• Which version do the people here think is the real you?
• Which one do you prefer being?

Write two sentences about the same thing — one in each language — and notice the difference.`
  },
  {
    day: 10,
    title: "The Night You Dreamt in It",
    theme: "Crossing Over",
    prompt: `At some point the language stops being something you use and becomes something you are inside.

• Have you dreamt in this language yet, and what happened in the dream?
• Do you count, swear, or do arithmetic in it?
• What did you notice the first time you thought a whole thought without translating?

Write the first sentence you remember thinking in this language, unprompted.`
  },
  {
    day: 11,
    title: "Losing Your Own",
    theme: "Erosion",
    prompt: `The new language arrives by taking room from the old one. Nobody warns you.

• When did you first reach for a word in your own language and find the foreign one instead?
• What does it cost you that your mother tongue is now slightly slower?
• Who at home has noticed, and what did they say?

Write three sentences in your first language, about anything. Notice what it feels like.`
  },
  {
    day: 12,
    title: "Talking to Family",
    theme: "Drift",
    prompt: `The conversations get shorter. It is rarely because there is less love in them.

• What can you no longer explain to your family about your life here?
• What do they think you do all day, and how wrong are they?
• What do you leave out of every call, every time?

Write the thing you have never managed to make them understand.`
  },
  {
    day: 13,
    title: "The Accent",
    theme: "Permanence",
    prompt: `You will probably always have it. Sit with that for one entry.

• How do you feel when someone comments on your accent, kindly or otherwise?
• Have you tried to lose it, and what did that attempt cost you?
• What does it mark you as, here?

Write what you want your accent to mean, rather than what you fear it means.`
  },
  {
    day: 14,
    title: "What You Can Say Now",
    theme: "Fluency",
    prompt: `Measure the distance rather than the remaining gap.

• What can you do in this language now that would have been impossible in your first month?
• What conversation did you have recently that you could not have had a year ago?
• What do you still avoid, and is it still out of reach or only out of habit?

Write one sentence you are proud of being able to say.`
  }
];

export const twoHomesDays = [
  {
    day: 1,
    title: "When It Stopped Being Temporary",
    theme: "Recognition",
    prompt: `Nobody announces it. One day you notice you have stopped counting the months.

• When did you realise you were not going back soon, or at all?
• Was there an object, a purchase, a decision that made it official?
• Did you tell anyone, or did you keep it to yourself for a while?

Write the moment you knew, even if you did not admit it then.`
  },
  {
    day: 2,
    title: "The First Thing Here You'd Defend",
    theme: "Belonging",
    prompt: `Belonging often shows up first as irritation on someone else's behalf.

• What do people criticise about this place that you now find yourself arguing against?
• When did you first say "we" about the people here?
• What have you started doing their way, on purpose?

Write one thing about this country you would defend to someone from home.`
  },
  {
    day: 3,
    title: "Going Back",
    theme: "Return",
    prompt: `The first visit home is not a rest. It is an audit.

• What did you notice on your first trip back that you had never noticed living there?
• What had changed without you, and how did that land?
• What did you find yourself defending, in either direction?

Write what you felt at the airport, going back and coming back.`
  },
  {
    day: 4,
    title: "A Foreigner There Now",
    theme: "Displacement",
    prompt: `The hardest part is not being foreign here. It is becoming slightly foreign there.

• When did someone at home treat you as though you had become an outsider?
• What do you now do differently that marks you out there?
• What do you no longer understand about the place you are from?

Write the moment you felt like a visitor in your own country.`
  },
  {
    day: 5,
    title: "What You Carried That Works",
    theme: "Continuity",
    prompt: `Some of what you brought turned out to be exactly right.

• Which habit, value or way of doing things from home has served you well here?
• What have people here noticed about you that comes from there?
• What are you glad you refused to adapt?

Name one thing you brought that you will never trade.`
  },
  {
    day: 6,
    title: "What You Carried That Doesn't",
    theme: "Adaptation",
    prompt: `And some of it does not survive the crossing.

• Which assumption from home has cost you here?
• What did you have to unlearn, and how long did it take you to notice?
• What are you still doing their way in your head and this way in public?

Write the belief you brought that turned out to be local, not universal.`
  },
  {
    day: 7,
    title: "The One Who Stayed",
    theme: "Counterfactual",
    prompt: `Somebody you know did not leave. Their life is the control group for yours.

• Who stayed, and what does their life look like now?
• What do you envy about it, honestly?
• What do they think about your leaving, as far as you know?

Write what you would want to ask them, if you could ask it without it sounding like a comparison.`
  },
  {
    day: 8,
    title: "Smell, Food, a Song",
    theme: "Involuntary",
    prompt: `The body remembers on its own schedule and does not consult you.

• What smell, dish or song puts you back there instantly?
• When did it last happen, and where were you?
• Do you seek these out or avoid them?

Describe the sensation itself — not the memory, the physical feeling.`
  },
  {
    day: 9,
    title: `"Where Are You From?"`,
    theme: "Explanation",
    prompt: `A simple question that stopped being simple.

• How do you answer now, and how long is the answer?
• Does it change depending on who is asking?
• What do you leave out, and why?

Write the shortest true answer you have.`
  },
  {
    day: 10,
    title: "The Legal Self",
    theme: "Paper",
    prompt: `There is a version of you that exists in documents, and it is not quite you.

• What status do you currently hold, and how secure does it feel?
• What has a piece of paper allowed or refused you?
• How much of your life is arranged around a renewal date?

Write what you would do first if the paperwork were permanently settled.`
  },
  {
    day: 11,
    title: "What You Built",
    theme: "Evidence",
    prompt: `You arrived with nothing here. Take an inventory of what now exists.

• Who would notice if you disappeared from this city tomorrow?
• What exists here that would not exist if you had not come?
• What are you competent at now that you were not on arrival?

List five things you built here. Do not qualify any of them.`
  },
  {
    day: 12,
    title: "Who You'd Be If You'd Stayed",
    theme: "Shadow",
    prompt: `Write the other life honestly, without rigging it in either direction.

• Where would you be living, and doing what?
• What would you have that you do not have now?
• What would you not have become?

Write one paragraph about that person, in the third person.`
  },
  {
    day: 13,
    title: "To Someone Arriving Tomorrow",
    theme: "Transmission",
    prompt: `Someone is landing here next week with your first-week face on.

• What do you know now that would have saved you six months?
• What advice did you receive that turned out to be wrong?
• What would you not tell them, because it has to be lived?

Write three things you would say, and one you would keep to yourself.`
  },
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
];

JOURNEY_PATHS['body-pain'] = createJourneyPath({
  id: 'body-pain',
  title: "The Body That Hurts",
  subtitle: "14 days on chronic pain, and not being believed",
  description: "For living in a body that hurts every day, and for the second injury on top of it — being disbelieved. The ordinary Tuesday, the language no pain scale allows, the appointment you rehearse, the body you had before, the price of a good day, and the small unglamorous things that genuinely help. It does not suggest your pain is attitude, and it does not promise to reduce it. It gives you an accurate record, which is what gets taken from you.",
  iconName: "Activity",
  days: bodyPainDays,
  color: "168, 124, 116", // Warm ember — present, not alarming
  tags: ['chronic-pain', 'chronic-illness', 'disbelief', 'body', 'exclusive'],
  duration: 14,
  difficulty: 'intermediate',
  recommendedFor: ['anyone in pain most days', 'people whose symptoms are doubted', 'those who already keep a symptom diary and want somewhere to put the rest of it'],
  isExclusive: true,
  isNew: true,
  price: '€2.99'
});

JOURNEY_PATHS['existential-pain'] = createJourneyPath({
  id: 'existential-pain',
  title: "Existential Pain",
  subtitle: "14 days on dying, choosing, being alone, and whether it matters",
  description: "The four questions that do not go away: that you will die, that no one is coming to tell you what your life is for, that no one can fully reach you inside it, and whether any of it means anything. Fourteen days that stay with the questions rather than resolving them, because they do not resolve — and because being offered consolation, when you have already looked, is its own insult.",
  iconName: "Infinity",
  days: existentialPainDays,
  color: "88, 96, 122", // Slate dusk — cool, unlit
  tags: ['existential', 'mortality', 'meaning', 'freedom', 'exclusive'],
  duration: 14,
  difficulty: 'advanced',
  recommendedFor: ['anyone awake at 4am with the large questions', 'people for whom the usual reassurances stopped working', 'those who would rather look at it than around it'],
  isExclusive: true,
  isNew: true,
  price: '€2.99'
});

JOURNEY_PATHS['moral-pain'] = createJourneyPath({
  id: 'moral-pain',
  title: "Moral Pain",
  subtitle: "14 days on what you did, or failed to do",
  // Named plainly rather than poetically. Someone looking for this is looking
  // for it on purpose, often in distress, and needs to recognise it on sight.
  description: "For the thing you did, or watched, or failed to stop — and have not been able to put down since. Moral pain is not guilt and not shame: it is what happens when you act against what you believe is right, and then have to go on being yourself. Fourteen days on the act, the belief it broke, who carried the cost, what is actually owed, and what repair looks like when repair is not available.",
  iconName: "Scale",
  days: moralPainDays,
  color: "134, 106, 106", // Muted oxblood — sombre without being alarming
  tags: ['moral-injury', 'guilt', 'accountability', 'repair', 'exclusive'],
  duration: 14,
  difficulty: 'advanced',
  recommendedFor: ['anyone carrying something they did or failed to prevent', 'people whose work put them in impossible positions', 'those who have apologised and found it did not help'],
  isExclusive: true,
  isNew: true,
  price: '€2.99'
});

JOURNEY_PATHS['first-light'] = createJourneyPath({
  id: 'first-light',
  title: "First Light",
  subtitle: "3 days, three ways to say it",
  description: "Three days and three ways of putting something down: written, spoken, drawn. The same honesty each time, in a different medium — because some things only arrive once you stop typing. The shortest path in Kairos, and the quickest way to find out which mode is yours.",
  iconName: "Sunrise",
  days: firstLightDays,
  color: "236, 170, 120", // Dawn amber — warmer than Sparks' gold, distinct from the Starting Over blues
  tags: ['multi-modal', 'beginner', 'short', 'introduction', 'exclusive'],
  duration: 3,
  difficulty: 'beginner',
  recommendedFor: ['anyone new to Kairos', 'people unsure whether to write, speak or draw', 'those who want something finishable'],
  isMultiModal: true,
  isExclusive: true,
  isNew: true,
  // Stripe will not charge below €0.50, so €0.29 was never possible. See
  // MINIMUM_CHARGE in functions/index.js — this string is display only, and the
  // amount actually charged lives there.
  price: '€0.99'
});

JOURNEY_PATHS['starting-over'] = createJourneyPath({
  id: 'starting-over',
  title: "The Crossing",
  subtitle: "14 days on leaving and arriving",
  description: "For anyone who moved countries and began again. The rupture that started it, what you packed and what you left, the first weeks of being suddenly incompetent at ordinary things, and the people who made it survivable. Written from the inside — the anchor path of the Starting Over package.",
  iconName: "Plane",
  days: startingOverCrossingDays,
  color: "96, 125, 173", // Cold departure blue
  tags: ['starting-over', 'migration', 'transition', 'identity', 'exclusive'],
  duration: 14,
  difficulty: 'intermediate',
  recommendedFor: ['people who moved countries', 'anyone starting again somewhere new', 'those between two places'],
  isExclusive: true,
  isNew: true,
  price: '€2.99'
});

JOURNEY_PATHS['learning-to-speak'] = createJourneyPath({
  id: 'learning-to-speak',
  title: "Learning to Speak",
  subtitle: "14 days on language, and who you are without it",
  description: "The part nobody writes about. You do not only lose words — you lose the version of yourself that was quick. Being spoken to slowly, jokes that do not land, the first one you understand, the first one you make, and the strange grief of your own language going slightly slower. Part of the Starting Over package.",
  iconName: "MessagesSquare",
  days: learningToSpeakDays,
  color: "142, 122, 178", // Muted violet — the in-between
  tags: ['starting-over', 'language', 'identity', 'belonging', 'exclusive'],
  duration: 14,
  difficulty: 'intermediate',
  recommendedFor: ['anyone living in a second language', 'people rebuilding a personality in new words', 'long-term learners'],
  isExclusive: true,
  isNew: true,
  price: '€2.99'
});

JOURNEY_PATHS['two-homes'] = createJourneyPath({
  id: 'two-homes',
  title: "Two Homes",
  subtitle: "14 days on belonging to neither, then to both",
  description: "The long middle, where it stops being an ordeal and becomes a life. Going back and finding yourself a visitor, the person who stayed, what a piece of paper allows you, and an honest ledger of what leaving cost and what it bought. Part of the Starting Over package.",
  iconName: "Home",
  days: twoHomesDays,
  color: "191, 145, 106", // Warm settled amber
  tags: ['starting-over', 'belonging', 'identity', 'home', 'exclusive'],
  duration: 14,
  difficulty: 'intermediate',
  recommendedFor: ['anyone years into a new country', 'people with two passports or none', 'those explaining where they are from'],
  isExclusive: true,
  isNew: true,
  price: '€2.99'
});

/**
 * Get journey day data for a specific day and path
 * @param {number} day - The day number (1-based)
 * @param {string} pathId - The path ID
 * @returns {Object} - The journey day data
 */
export const getJourneyDay = (day, pathId = 'self-discovery') => {
  // Ensure day is a number
  const dayNum = parseInt(day);
  
  // Get the path data
  const pathData = JOURNEY_PATHS[pathId] || JOURNEY_PATHS['self-discovery'];
  
  // Find the day in the journey
  const journeyDay = pathData.days.find(jd => jd.day === dayNum);
  
  if (!journeyDay) {
    console.warn(`Day ${dayNum} not found in journey ${pathId}`);
    
    // Return a default day if not found
    return {
      day: dayNum,
      title: `Day ${dayNum}`,
      theme: "Reflection",
      prompt: "What's on your mind today?"
    };
  }
  
  return journeyDay;
};

/**
 * Get the total number of days for a journey path
 * @param {string} pathId - The path ID
 * @returns {number} - Total days in the journey
 */
export const getJourneyDaysCount = (pathId = 'self-discovery') => {
  const pathData = JOURNEY_PATHS[pathId] || JOURNEY_PATHS['self-discovery'];
  return pathData.duration;
};

/**
 * Get all journey paths
 * @returns {Array} - Array of all journey paths
 */
export const getAllJourneyPaths = () => {
  return Object.values(JOURNEY_PATHS);
};

export const getJourneyPath = (pathId) => {
  if (!pathId) {
    return Object.values(JOURNEY_PATHS);
  }
  return JOURNEY_PATHS[pathId];
};

// Translated journey content (path title/subtitle/description + day title/theme/prompt).
// Each file in journeyTranslations/<lng>/ is optional and keyed by pathId — missing files and
// missing keys simply fall back to English, so a partially translated language is safe to ship.
// We mutate JOURNEY_PATHS in place so every consumer that holds a reference to it (including
// pathRecommender.js, which reads the registry directly) picks up the active language without
// needing its own translation-lookup logic.
// Adding a language: create the directory and add a glob entry here (Vite needs static patterns).
const JOURNEY_TRANSLATION_MODULES = {
  de: import.meta.glob('./journeyTranslations/de/*.js', { eager: true }),
  ka: import.meta.glob('./journeyTranslations/ka/*.js', { eager: true })
};

const JOURNEY_TRANSLATIONS = {};
for (const lng in JOURNEY_TRANSLATION_MODULES) {
  const byPathId = {};
  for (const modPath in JOURNEY_TRANSLATION_MODULES[lng]) {
    const pathId = modPath.match(/([^/]+)\.js$/)[1];
    byPathId[pathId] = JOURNEY_TRANSLATION_MODULES[lng][modPath].default;
  }
  JOURNEY_TRANSLATIONS[lng] = byPathId;
}

const JOURNEY_PATHS_EN_SNAPSHOT = {};
Object.entries(JOURNEY_PATHS).forEach(([pathId, pathObj]) => {
  JOURNEY_PATHS_EN_SNAPSHOT[pathId] = {
    title: pathObj.title,
    subtitle: pathObj.subtitle,
    description: pathObj.description,
    days: pathObj.days.map(d => ({ day: d.day, title: d.title, theme: d.theme, prompt: d.prompt }))
  };
});

const applyJourneyLanguage = (lng) => {
  const base = (lng || 'en').split('-')[0];
  const translations = JOURNEY_TRANSLATIONS[base] || {};

  Object.entries(JOURNEY_PATHS).forEach(([pathId, pathObj]) => {
    const enSnap = JOURNEY_PATHS_EN_SNAPSHOT[pathId];
    const translation = translations[pathId] || null;

    pathObj.title = translation?.title || enSnap.title;
    pathObj.subtitle = translation?.subtitle || enSnap.subtitle;
    pathObj.description = translation?.description || enSnap.description;

    pathObj.days.forEach((dayObj, idx) => {
      const enDay = enSnap.days[idx];
      const tDay = translation?.days?.[dayObj.day];
      dayObj.title = tDay?.title || enDay.title;
      dayObj.theme = tDay?.theme || enDay.theme;
      dayObj.prompt = tDay?.prompt || enDay.prompt;
    });
  });
};

applyJourneyLanguage(i18n.resolvedLanguage || i18n.language);
i18n.on('languageChanged', applyJourneyLanguage);