// src/data/JourneyData.js - Enhanced with unified path registry
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
    prompt: "Write a letter to yourself from one year ago. What would you want them to know? What wisdom, encouragement, or gentle advice would you offer to who you were then? Share what you've learned and how you've grown."
  },
  {
    day: 2,
    title: "Letter from Your Inner Child",
    theme: "Playfulness",
    prompt: "Imagine your inner child writing you a letter. What would they want to tell you? What do they miss about life? What dreams and joys do they want to remind you about? Let your playful, innocent self speak to you."
  },
  {
    day: 3,
    title: "A Letter of Forgiveness",
    theme: "Compassion",
    prompt: "Write a letter of forgiveness to yourself. What mistakes, regrets, or harsh self-judgments are you ready to release? Offer yourself the same compassion you would give a dear friend. What do you need to hear to truly forgive yourself?"
  },
  {
    day: 4,
    title: "Letter to Your Future Self",
    theme: "Vision",
    prompt: "Write a letter to yourself one year from now. What hopes and dreams do you want to share? What are you working toward? What encouragement and love do you want your future self to remember? Paint a picture of who you're becoming."
  },
  {
    day: 5,
    title: "Letter of Gratitude to Yourself",
    theme: "Appreciation",
    prompt: "Write a letter thanking yourself for everything you've done, survived, and accomplished. Acknowledge your strength, resilience, and all the ways you've shown up for yourself and others. What are you most grateful to yourself for?"
  },
  {
    day: 6,
    title: "Letter from Your Wisest Self",
    theme: "Wisdom",
    prompt: "Imagine the wisest version of yourself - aged, experienced, and deeply knowing - writing you a letter. What profound truths would they share? What perspective on your current challenges would they offer? What do they want you to remember?"
  },
  {
    day: 7,
    title: "A Love Letter to Yourself",
    theme: "Self-Love",
    prompt: "Write yourself the most loving, appreciative letter you can imagine. Celebrate who you are - your quirks, your journey, your heart. What do you love about yourself? How can you speak to yourself with the tenderness you deserve? End this journey with pure self-love."
  }
];

export const journeyDays = [
  {
    day: 1,
    title: "Beginning the Journey",
    theme: "Self-Awareness",
    prompt: "What are your hopes for this journaling journey? Write about why you've decided to begin this practice and what you hope to discover about yourself."
  },
  {
    day: 2,
    title: "Values Exploration",
    theme: "Core Values",
    prompt: "What are 3-5 core values that guide your life? Explore why these matter to you and how they shape your choices."
  },
  {
    day: 3,
    title: "Life Chapters",
    theme: "Personal Narrative",
    prompt: "If your life were a book, what would the chapters be so far? Name each chapter and write a brief summary of that period."
  },
  {
    day: 4,
    title: "Inner Critic",
    theme: "Self-Compassion",
    prompt: "Describe your inner critic. What does this voice say to you? How long has it been with you? How might you respond to it with compassion?"
  },
  {
    day: 5,
    title: "Sources of Joy",
    theme: "Meaning & Purpose",
    prompt: "What activities make you lose track of time? When do you feel most alive and engaged? Explore what these experiences have in common."
  },
  {
    day: 6,
    title: "Relationship Patterns",
    theme: "Connection",
    prompt: "What patterns do you notice in your closest relationships? What do you tend to seek from others? What do you find challenging about connection?"
  },
  {
    day: 7,
    title: "Future Self",
    theme: "Growth",
    prompt: "Imagine yourself 5 years from now, living a fulfilling life. What does that look like? What qualities have you developed? What advice would this future self give you today?"
  },
  {
    day: 8,
    title: "Limiting Beliefs",
    theme: "Mindset",
    prompt: "What beliefs about yourself or the world might be holding you back? Choose one and explore where it came from and how your life might be different without it."
  },
  {
    day: 9,
    title: "Gratitude Reflection",
    theme: "Appreciation",
    prompt: "What are you grateful for in this season of life? Include small daily joys as well as bigger blessings. How does focusing on gratitude affect your perspective?"
  },
  {
    day: 10,
    title: "Integration",
    theme: "Wisdom",
    prompt: "Looking back at your journaling from the past days, what patterns, insights or themes do you notice? What is one truth about yourself that you want to remember going forward?"
  }
];

// Emotional Intelligence 10-day journey
export const emotionalIntelligenceDays = [
  {
    day: 1,
    title: "Emotional Awareness",
    theme: "Feeling Recognition",
    prompt: "Describe 3-5 emotions you've experienced today. Where did you feel them in your body? What triggered them? How did you respond?"
  },
  {
    day: 2,
    title: "Emotional Vocabulary",
    theme: "Expression",
    prompt: "Beyond happy, sad, angry, or scared, what nuanced emotions do you experience? Create a list of at least 10 specific feeling words that resonate with your emotional life."
  },
  {
    day: 3,
    title: "Emotional Patterns",
    theme: "Self-Knowledge",
    prompt: "What emotion tends to arise most frequently in your life? What situations typically trigger it? How does this emotion serve you or challenge you?"
  },
  {
    day: 4,
    title: "Difficult Emotions",
    theme: "Acceptance",
    prompt: "Choose an emotion you find uncomfortable or try to avoid. How do you typically respond when it arises? What might this emotion be trying to tell you?"
  },
  {
    day: 5,
    title: "Emotional Triggers",
    theme: "Self-Regulation",
    prompt: "What situations reliably trigger strong emotional responses in you? Identify patterns in these triggers and explore why they might affect you so deeply."
  },
  {
    day: 6,
    title: "Emotion & the Body",
    theme: "Embodiment",
    prompt: "How do your emotions manifest physically? Describe the bodily sensations of a recent strong emotion. How might you use these physical cues as early warning signs?"
  },
  {
    day: 7,
    title: "Emotional Needs",
    theme: "Self-Care",
    prompt: "What emotional needs are most important for your wellbeing? How can you recognize when these needs aren't being met? What helps you address them?"
  },
  {
    day: 8,
    title: "Empathy Practice",
    theme: "Understanding Others",
    prompt: "Recall a recent disagreement with someone. Try to imagine the situation from their perspective. What emotions might they have been feeling? What needs might they have been trying to meet?"
  },
  {
    day: 9,
    title: "Emotional Resilience",
    theme: "Recovery",
    prompt: "How do you recover from emotionally challenging experiences? What helps you process and move through difficult feelings? What new strategies might you try?"
  },
  {
    day: 10,
    title: "Emotional Integration",
    theme: "Wisdom",
    prompt: "Looking back at your emotional awareness journey, what have you learned about your emotional life? What is one way you'd like to grow in your relationship with your emotions?"
  }
];

// Mindfulness Awareness 10-day journey
export const mindfulnessAwarenessDays = [
  {
    day: 1,
    title: "Present Moment",
    theme: "Awareness",
    prompt: "Pause and notice five things you can see, four things you can feel, three things you can hear, two things you can smell, and one thing you can taste. How does this deliberate attention shift your experience of the moment?"
  },
  {
    day: 2,
    title: "Mindful Activity",
    theme: "Engaged Presence",
    prompt: "Choose a routine activity (like washing dishes, walking, or eating) and do it with complete attention. Describe the experience—what did you notice that you typically miss?"
  },
  {
    day: 3,
    title: "Thought Patterns",
    theme: "Mental Habits",
    prompt: "Spend five minutes observing your thoughts without judgment. What patterns do you notice? Are they mostly past-focused, future-focused, positive, negative, or neutral?"
  },
  {
    day: 4,
    title: "Body Awareness",
    theme: "Physical Presence",
    prompt: "Conduct a slow body scan from head to toe. Where do you hold tension? What sensations arise? How does your body respond as you bring attention to different areas?"
  },
  {
    day: 5,
    title: "Mindful Listening",
    theme: "Receptive Awareness",
    prompt: "Reflect on how you listen to others. Do you listen to respond or to understand? Describe a recent conversation and how your level of presence may have affected the interaction."
  },
  {
    day: 6,
    title: "Mindfulness in Challenges",
    theme: "Equanimity",
    prompt: "Recall a recent challenging situation. How might approaching it with mindful awareness have changed your experience? What mindful response might you try next time?"
  },
  {
    day: 7,
    title: "Inner Dialogue",
    theme: "Self-Talk",
    prompt: "Notice the tone and content of your inner voice today. Is it kind, critical, encouraging, or anxious? How might you bring more mindful awareness to this internal conversation?"
  },
  {
    day: 8,
    title: "Gratitude Practice",
    theme: "Appreciation",
    prompt: "With full attention, notice and describe five things you're grateful for today. Include small, ordinary things that you might typically overlook."
  },
  {
    day: 9,
    title: "Compassion Meditation",
    theme: "Loving-Kindness",
    prompt: "Write a message of compassion to yourself, a loved one, an acquaintance, someone you find difficult, and finally to all beings. How does this practice affect your emotional state?"
  },
  {
    day: 10,
    title: "Mindfulness Integration",
    theme: "Conscious Living",
    prompt: "Reflect on your mindfulness journey. What have you learned about being present? How might you incorporate mindful awareness more fully into your daily life?"
  }
];

// Three new 10-day journeys for Καιρός Smart Journal

// Gratitude Practice 10-day journey
export const gratitudePracticeDays = [
  {
    day: 1,
    title: "Gratitude Foundations",
    theme: "Awareness",
    prompt: "What does gratitude mean to you personally? Reflect on a time when you felt deeply grateful. How did it feel in your body? What thoughts accompanied this feeling?"
  },
  {
    day: 2,
    title: "Simple Pleasures",
    theme: "Daily Appreciation",
    prompt: "What are five simple pleasures you experienced today that often go unnoticed? Consider each of your senses - what did you see, hear, taste, smell, or touch that brought you joy?"
  },
  {
    day: 3,
    title: "People Appreciation",
    theme: "Connection",
    prompt: "Who are three people who have positively impacted your life recently? What specific actions did they take that you're grateful for? Consider expressing your gratitude directly to at least one of them."
  },
  {
    day: 4,
    title: "Challenge Gratitude",
    theme: "Growth",
    prompt: "Reflect on a recent challenge or obstacle. What lessons or growth has it brought into your life? What aspects of this difficult experience can you find gratitude for?"
  },
  {
    day: 5,
    title: "Body Gratitude",
    theme: "Physical Wellbeing",
    prompt: "What aspects of your physical body are you grateful for today? Consider functions, abilities, or features that serve you well, even if you don't normally acknowledge them."
  },
  {
    day: 6,
    title: "Abundance Awareness",
    theme: "Sufficiency",
    prompt: "What material resources, opportunities, or privileges do you have that others might not? How do these elements of abundance support your daily life and wellbeing?"
  },
  {
    day: 7,
    title: "Nature's Gifts",
    theme: "Environmental Connection",
    prompt: "What elements of the natural world bring you joy or support your existence? Consider everything from the air you breathe to landscapes that inspire you. How does nature enrich your life?"
  },
  {
    day: 8,
    title: "Self-Appreciation",
    theme: "Inner Worth",
    prompt: "What personal qualities, achievements, or actions of your own are you grateful for? How have you contributed to your own wellbeing or growth recently? Acknowledge yourself fully."
  },
  {
    day: 9,
    title: "Future Gratitude",
    theme: "Anticipation",
    prompt: "What upcoming experiences or possibilities are you looking forward to with gratitude? How might cultivating gratitude in advance enhance your experience of these future events?"
  },
  {
    day: 10,
    title: "Gratitude Integration",
    theme: "Practice",
    prompt: "Reflect on how your relationship with gratitude has evolved over the past nine days. What new awareness has emerged? How might you incorporate gratitude more consistently in your daily life?"
  }
];

// Shadow Work Exploration 10-day journey
export const shadowWorkDays = [
  {
    day: 1,
    title: "Shadow Introduction",
    theme: "Awareness",
    prompt: "What do you understand about your 'shadow self'? Which parts of your personality do you tend to hide, repress, or feel ashamed of? Approach this exploration with curiosity rather than judgment."
  },
  {
    day: 2,
    title: "Emotional Triggers",
    theme: "Reactions",
    prompt: "Recall a recent situation where you had a strong emotional reaction. What triggered you? How might this trigger connect to disowned aspects of yourself? What might this reaction be trying to teach you?"
  },
  {
    day: 3,
    title: "Projection Patterns",
    theme: "Mirroring",
    prompt: "What qualities in others tend to irritate or bother you the most? Consider how these qualities might reflect disowned parts of yourself. How might acknowledging these aspects change your relationships?"
  },
  {
    day: 4,
    title: "Childhood Messages",
    theme: "Origins",
    prompt: "What parts of yourself were you taught to hide or suppress as a child? What messages did you receive about which feelings or traits were unacceptable? How have these messages shaped you?"
  },
  {
    day: 5,
    title: "Fear Exploration",
    theme: "Defense",
    prompt: "What fears protect your shadow aspects? What are you afraid might happen if you acknowledged or expressed these hidden parts of yourself? Meet these fears with compassion."
  },
  {
    day: 6,
    title: "Shadow Strengths",
    theme: "Reclamation",
    prompt: "Consider how your shadow qualities might actually be strengths in disguise. How might traits you've labeled as 'negative' actually serve you when expressed in healthy ways?"
  },
  {
    day: 7,
    title: "Needs and Boundaries",
    theme: "Self-Care",
    prompt: "What needs have you been denying or minimizing? How might honoring your shadow help you establish healthier boundaries? What would it look like to advocate for yourself more fully?"
  },
  {
    day: 8,
    title: "Creative Expression",
    theme: "Integration",
    prompt: "Express a shadow aspect through creative means - drawing, writing fiction, movement, or any medium that calls to you. Allow this expression to be private and free from judgment."
  },
  {
    day: 9,
    title: "Shadow Dialogue",
    theme: "Communication",
    prompt: "Write a dialogue between your conscious self and a specific shadow aspect. Ask what it needs and what it's trying to protect. Listen deeply to what emerges from this conversation."
  },
  {
    day: 10,
    title: "Shadow Integration",
    theme: "Wholeness",
    prompt: "Reflect on your shadow work journey. What have you discovered about yourself? How might you continue to acknowledge and integrate your shadow aspects with compassion? What would greater wholeness look like?"
  }
];

// Nature Connection 10-day journey
export const natureConnectionDays = [
  {
    day: 1,
    title: "Natural Awareness",
    theme: "Presence",
    prompt: "Spend at least 10 minutes outside today observing the natural world with full attention. What elements of nature do you notice that you typically overlook? How does being in nature affect your state of mind?"
  },
  {
    day: 2,
    title: "Sensory Immersion",
    theme: "Experience",
    prompt: "Explore nature through each of your senses. What do you see, hear, smell, feel, and perhaps taste? Which sensory experience feels most vivid or meaningful to you? Describe it in detail."
  },
  {
    day: 3,
    title: "Childhood Nature",
    theme: "Memory",
    prompt: "What are your earliest or most significant memories of connecting with nature as a child? How did these experiences shape your relationship with the natural world? What elements still resonate with you today?"
  },
  {
    day: 4,
    title: "Earth as Teacher",
    theme: "Wisdom",
    prompt: "What lessons or wisdom can you learn from observing natural processes? Choose one element of nature (water, trees, animals, weather, etc.) and reflect on what it might teach you about your own life."
  },
  {
    day: 5,
    title: "Local Ecosystem",
    theme: "Interdependence",
    prompt: "Research or observe the local ecosystem where you live. What species share your habitat? How do they interact and depend on each other? How are you connected to this web of relationships?"
  },
  {
    day: 6,
    title: "Seasonal Awareness",
    theme: "Cycles",
    prompt: "What season are you currently experiencing? How does this season manifest in your environment and in your body? What wisdom might this particular season have to offer you right now?"
  },
  {
    day: 7,
    title: "Nature Relationship",
    theme: "Connection",
    prompt: "If your relationship with nature were a human relationship, how would you describe it? Is it intimate, distant, reverent, fearful, curious? How might you deepen this relationship in meaningful ways?"
  },
  {
    day: 8,
    title: "Urban Nature",
    theme: "Discovery",
    prompt: "Even in the most urban environments, nature finds a way. Seek out and document evidence of nature in unexpected places today. How does recognizing these connections shift your perspective?"
  },
  {
    day: 9,
    title: "Environmental Impact",
    theme: "Stewardship",
    prompt: "Reflect on your personal impact on the natural world. What actions do you take that support environmental health? What small, sustainable change might you implement to deepen your role as an earth steward?"
  },
  {
    day: 10,
    title: "Nature Integration",
    theme: "Belonging",
    prompt: "How has your sense of connection to nature evolved over this journey? What practices might you continue to nurture this relationship? How might a deeper nature connection enhance your overall wellbeing?"
  }
];

// Transformation Journey 21-day journey (existing)
export const transformationJourneyDays = [
  {
    day: 1,
    title: "Honest Assessment",
    theme: "Self-Awareness",
    prompt: "Describe your relationship with [substance/behavior] honestly and without judgment. When did it begin? How has it evolved? What role does it play in your life currently?"
  },
  {
    day: 2,
    title: "Understanding Your Why",
    theme: "Motivation",
    prompt: "Why do you want to transform this pattern in your life? Write about your deepest motivations for change. What has brought you to this point of wanting transformation?"
  },
  {
    day: 3,
    title: "Commitment Setting",
    theme: "Intention",
    prompt: "Write a letter to yourself about the commitment you're making. Be specific about what you're committing to and why it matters. What are you willing to do differently starting today?"
  },
  {
    day: 4,
    title: "Identifying Triggers",
    theme: "Trigger Awareness",
    prompt: "Reflect on the situations, people, emotions, or thoughts that trigger your desire for [substance/behavior]. Try to be as specific as possible about the circumstances that precede the behavior."
  },
  {
    day: 5,
    title: "The Emotional Landscape",
    theme: "Emotional Awareness",
    prompt: "Explore the emotions you experience before, during, and after engaging in [substance/behavior]. Does it provide comfort, excitement, relief, or something else? What emotions are you trying to fulfill or avoid?"
  },
  {
    day: 6,
    title: "The Physical Experience",
    theme: "Body Awareness",
    prompt: "Describe the physical sensations you experience when craving [substance/behavior]. Where do you feel it in your body? How does your body feel during and after?"
  },
  {
    day: 7,
    title: "The Pattern Cycle",
    theme: "Pattern Recognition",
    prompt: "Map out your full pattern cycle from trigger to behavior to aftermath. Are there predictable stages? Where in this cycle might you have the power to intervene?"
  },
  {
    day: 8,
    title: "The Pause Practice",
    theme: "Mindful Response",
    prompt: "Explore how you might create a mindful pause between trigger and response. What would help you stop and breathe before automatically following the pattern?"
  },
  {
    day: 9,
    title: "Replacement Behaviors",
    theme: "Healthy Alternatives",
    prompt: "Brainstorm at least 5 specific alternative activities you could turn to when experiencing a craving. Which ones might address the same needs but in healthier ways?"
  },
  {
    day: 10,
    title: "Managing Difficult Emotions",
    theme: "Emotional Resilience",
    prompt: "Reflect on healthy ways to process difficult emotions without [substance/behavior]. How might you sit with discomfort, anxiety, boredom, or stress?"
  },
  {
    day: 11,
    title: "Building Your Support System",
    theme: "Connection",
    prompt: "Who can support you in this transformation journey? Write about specific people and how they might help. Consider both personal connections and professional resources."
  },
  {
    day: 12,
    title: "Preparing for Challenges",
    theme: "Resilience Planning",
    prompt: "Anticipate your most likely challenges or setbacks. For each one, create a specific plan for how you'll respond and recover."
  },
  {
    day: 13,
    title: "Designing Your Environment",
    theme: "Environmental Design",
    prompt: "How can you redesign your physical environment to support your new patterns? What changes to your space would make it easier to maintain your commitment?"
  },
  {
    day: 14,
    title: "Daily Rituals and Routines",
    theme: "Positive Routines",
    prompt: "Create a daily routine that incorporates healthy activities during vulnerable times. Be specific about when and how you'll implement these new habits."
  },
  {
    day: 15,
    title: "Nurturing Physical Wellbeing",
    theme: "Physical Health",
    prompt: "Reflect on how improved sleep, nutrition, hydration, and movement might support your transformation. Choose one aspect to focus on improving."
  },
  {
    day: 16,
    title: "Finding Meaning and Purpose",
    theme: "Values and Meaning",
    prompt: "Write about activities and pursuits that give you a sense of meaning, purpose, or flow. How might you incorporate more of these into your daily life?"
  },
  {
    day: 17,
    title: "Celebrating Small Wins",
    theme: "Progress Recognition",
    prompt: "Reflect on the progress you've made so far, no matter how small. What changes have you noticed in your thoughts, feelings, or behaviors?"
  },
  {
    day: 18,
    title: "Managing Stress and Pressure",
    theme: "Stress Resilience",
    prompt: "Consider how stress affects your vulnerability to old patterns. Develop a specific stress management plan that you can implement during high-pressure periods."
  },
  {
    day: 19,
    title: "Identity Transformation",
    theme: "Self-Concept",
    prompt: "How has your self-image begun to change during this journey? Write about who you are becoming as you transform this pattern."
  },
  {
    day: 20,
    title: "Planning for the Future",
    theme: "Sustainable Change",
    prompt: "Create a specific plan for maintaining your progress beyond these 21 days. What ongoing practices, check-ins, or support will you need?"
  },
  {
    day: 21,
    title: "Integration and Commitment Renewal",
    theme: "Integration",
    prompt: "Reflect on your entire 21-day journey. What have you learned about yourself? How has your relationship with [substance/behavior] changed? Renew your commitment to yourself for the path ahead."
  }
];

// NEW 14-day Creative Expression journey
export const creativeExpressionDays = [
  {
    day: 1,
    title: "Creative Identity",
    theme: "Self-Perception",
    prompt: "How do you see yourself as a creative person? Write about your creative strengths, blocks, and aspirations without judgment."
  },
  {
    day: 2,
    title: "Childhood Creativity",
    theme: "Origins",
    prompt: "What creative activities did you enjoy as a child? What happened to those interests as you grew older? How might you reconnect with that childlike creative spirit?"
  },
  {
    day: 3,
    title: "Creative Inspiration",
    theme: "Sources",
    prompt: "What inspires you creatively? Write about people, places, works, or experiences that spark your imagination. How might you intentionally seek more inspiration?"
  },
  {
    day: 4,
    title: "Creative Fears",
    theme: "Resistance",
    prompt: "What fears hold back your creative expression? Explore concerns about judgment, failure, or inadequacy. What would creating feel like without these fears?"
  },
  {
    day: 5,
    title: "The Inner Critic",
    theme: "Self-Judgment",
    prompt: "Describe your inner critic's voice when you create. What does it say? Where did these messages come from? How might you respond to this voice with compassion?"
  },
  {
    day: 6,
    title: "Creative Space",
    theme: "Environment",
    prompt: "Describe your ideal creative environment. What physical elements, atmosphere, and conditions help you feel most inspired and productive? How might you cultivate more of these conditions?"
  },
  {
    day: 7,
    title: "Creative Routine",
    theme: "Practice",
    prompt: "What would a sustainable creative practice look like in your life? Design a realistic routine that honors both your creative needs and your other responsibilities."
  },
  {
    day: 8,
    title: "Beginner's Mind",
    theme: "Exploration",
    prompt: "Choose a creative medium you've never tried. What attracts you to it? What assumptions or expectations do you have? How might approaching it with beginner's mind feel liberating?"
  },
  {
    day: 9,
    title: "Creative Blocks",
    theme: "Obstacles",
    prompt: "Reflect on times when you've felt creatively blocked. What triggered these blocks? What helped you move through them? What strategies might you develop for future blocks?"
  },
  {
    day: 10,
    title: "Creative Collaboration",
    theme: "Connection",
    prompt: "How does creating with others affect your creative process? Reflect on past collaborations, challenges, and benefits of creative partnership. Who might you create with in the future?"
  },
  {
    day: 11,
    title: "Creative Risk-Taking",
    theme: "Courage",
    prompt: "What creative risks would you like to take? What holds you back? Describe a small creative risk you could take this week and what you might learn from it."
  },
  {
    day: 12,
    title: "Sharing Your Work",
    theme: "Vulnerability",
    prompt: "How do you feel about sharing your creative work with others? What would make sharing feel safer or more meaningful? How might your work impact others?"
  },
  {
    day: 13,
    title: "Creative Legacy",
    theme: "Purpose",
    prompt: "What do you hope your creative expression will contribute to the world? What themes, values, or experiences would you like your creative work to explore or embody?"
  },
  {
    day: 14,
    title: "Creative Integration",
    theme: "Commitment",
    prompt: "Looking back on this creative journey, what have you discovered about yourself? How will you continue to nurture your creative expression going forward?"
  }
];

export const habitFormationDays = [
  {
    day: 1,
    title: "Habit Vision",
    theme: "Intention",
    prompt: "What habit do you want to develop over the next 30 days? Why is this important to you? How will this habit improve your life?"
  },
  {
    day: 2,
    title: "Current State",
    theme: "Awareness",
    prompt: "Describe your current behavior regarding this habit. What triggers your current actions? What barriers exist to your desired habit?"
  },
  {
    day: 3,
    title: "Science of Habits",
    theme: "Understanding",
    prompt: "Reflect on the habit loop: cue, craving, response, reward. How does this apply to your desired habit? What cues could trigger your new habit?"
  },
  {
    day: 4,
    title: "Micro-Habit Design",
    theme: "Small Steps",
    prompt: "What is the smallest version of your habit you could start with? How can you make it so easy you can't say no?"
  },
  {
    day: 5,
    title: "Environmental Design",
    theme: "Context",
    prompt: "How can you design your environment to make your habit easier? What can you change in your physical space to support this new behavior?"
  },
  {
    day: 6,
    title: "Habit Stacking",
    theme: "Integration",
    prompt: "What existing habit or routine could you connect your new habit to? Complete this sentence: 'After I [current habit], I will [new habit].'"
  },
  {
    day: 7,
    title: "Implementation Intentions",
    theme: "Planning",
    prompt: "Create specific plans for when and where you'll perform your habit. Fill in: 'I will [habit] at [time] in [location].'"
  },
  {
    day: 8,
    title: "Identifying Obstacles",
    theme: "Preparation",
    prompt: "What obstacles might prevent your habit formation? For each obstacle, develop a specific if-then plan: 'If [obstacle], then I will [solution].'"
  },
  {
    day: 9,
    title: "Habit Tracking System",
    theme: "Measurement",
    prompt: "Design a simple system to track your habit. How will you measure success? What will you track and how often?"
  },
  {
    day: 10,
    title: "First Week Reflection",
    theme: "Evaluation",
    prompt: "Reflect on your first week of habit formation. What's working? What's challenging? What adjustments could improve your consistency?"
  },
  {
    day: 11,
    title: "Reward System",
    theme: "Positive Reinforcement",
    prompt: "What immediate rewards could you pair with your habit? What meaningful rewards could you give yourself after a week of consistency?"
  },
  {
    day: 12,
    title: "Social Accountability",
    theme: "Support",
    prompt: "Who could support your habit formation? How might you involve others in your habit journey for accountability and encouragement?"
  },
  {
    day: 13,
    title: "Identity Shift",
    theme: "Self-Concept",
    prompt: "How might this habit change how you see yourself? Complete this sentence: 'I am becoming the kind of person who...'"
  },
  {
    day: 14,
    title: "Habit Recovery Plan",
    theme: "Resilience",
    prompt: "If you miss a day, what's your recovery plan? How will you avoid the 'all or nothing' mindset and return to your habit quickly?"
  },
  {
    day: 15,
    title: "Mid-Point Assessment",
    theme: "Progress",
    prompt: "You're halfway through! What progress have you made? What evidence do you see of your habit forming? What adjustments are needed?"
  },
  {
    day: 16,
    title: "Deepening Understanding",
    theme: "Motivation",
    prompt: "Reconnect with your deeper 'why' for this habit. How does this behavior connect to your core values and long-term goals?"
  },
  {
    day: 17,
    title: "Challenging Situations",
    theme: "Adaptation",
    prompt: "How might your habit need to adapt during travel, high-stress periods, or social events? Create specific plans for maintaining your habit in challenging contexts."
  },
  {
    day: 18,
    title: "Unexpected Benefits",
    theme: "Awareness",
    prompt: "What unexpected benefits have you noticed from your new habit? How is this habit affecting other areas of your life?"
  },
  {
    day: 19,
    title: "Habit Expansion",
    theme: "Growth",
    prompt: "Is your habit becoming easier? If so, how might you expand or enhance it slightly to create continued growth?"
  },
  {
    day: 20,
    title: "Intrinsic Motivation",
    theme: "Enjoyment",
    prompt: "How might you make your habit more enjoyable? What aspects of the habit give you satisfaction beyond external rewards?"
  },
  {
    day: 21,
    title: "Three-Week Milestone",
    theme: "Celebration",
    prompt: "Congratulate yourself on three weeks of habit formation! What have you learned about yourself through this process? What are you proud of?"
  },
  {
    day: 22,
    title: "Process vs. Outcome",
    theme: "Focus",
    prompt: "How are you balancing focus on the process (doing the habit) versus outcomes (results of the habit)? Which focus serves you better right now?"
  },
  {
    day: 23,
    title: "Deeper Habit Integration",
    theme: "Normalization",
    prompt: "How is this habit beginning to feel normal or automatic? When do you do it without thinking, and when does it still require conscious effort?"
  },
  {
    day: 24,
    title: "Handling Plateaus",
    theme: "Persistence",
    prompt: "If progress seems to have plateaued, how might you maintain motivation? What would help you persist through the flat spots in your habit journey?"
  },
  {
    day: 25,
    title: "Compound Effect",
    theme: "Long-Term Vision",
    prompt: "Imagine continuing this habit for a year. What compound effects might you experience? How might small daily actions create significant change over time?"
  },
  {
    day: 26,
    title: "Mindfulness in Habit",
    theme: "Presence",
    prompt: "How can you bring more mindfulness to your habit? What would change if you performed it with complete presence and attention?"
  },
  {
    day: 27,
    title: "Sharing Your Experience",
    theme: "Wisdom",
    prompt: "What have you learned about habit formation that might help others? What advice would you give someone just starting this process?"
  },
  {
    day: 28,
    title: "Preparing for Month Two",
    theme: "Continuity",
    prompt: "As you approach the end of your first month, how will you ensure this habit continues? What systems will support ongoing practice?"
  },
  {
    day: 29,
    title: "Habit Ecosystem",
    theme: "Integration",
    prompt: "How does this habit fit within your overall routine and other habits? What other habits might naturally evolve from or complement this one?"
  },
  {
    day: 30,
    title: "The Path Forward",
    theme: "Continuation",
    prompt: "Reflect on your 30-day habit journey. What has changed? What challenges remain? How will you maintain this habit going forward?"
  }
];

// Complete 100-day Life Vision journey
export const lifeVisionDays = [
  // FOUNDATION (Days 1-10): Self-awareness, values, and identity
  {
    day: 1,
    title: "Life Mapping",
    theme: "Overview",
    prompt: "Create a timeline of your life's major events and turning points. What patterns do you notice? What themes have defined your journey so far?"
  },
  {
    day: 2,
    title: "Core Identity",
    theme: "Self-Concept",
    prompt: "Who are you at your core? Beyond roles and responsibilities, what defines you as a person? What parts of yourself have remained constant through change?"
  },
  {
    day: 3,
    title: "Values Exploration",
    theme: "Principles",
    prompt: "What 5-7 values are most important to you? For each value, explore why it matters and how it manifests in your life choices."
  },
  {
    day: 4,
    title: "Strengths Inventory",
    theme: "Capabilities",
    prompt: "What are your natural talents and developed strengths? When do you feel most capable and in flow? How might these strengths shape your future?"
  },
  {
    day: 5,
    title: "Meaningful Achievements",
    theme: "Accomplishment",
    prompt: "What achievements are you most proud of? What made these meaningful? What do they reveal about what matters to you?"
  },
  {
    day: 6,
    title: "Life Roles",
    theme: "Identity",
    prompt: "What roles do you play in your life (e.g., parent, friend, professional)? Which feel most authentic? Which feel constraining or expansive?"
  },
  {
    day: 7,
    title: "Personal Beliefs",
    theme: "Worldview",
    prompt: "What core beliefs shape how you see the world? Which have you consciously chosen, and which have you inherited? Which serve you well?"
  },
  {
    day: 8,
    title: "Character Strengths",
    theme: "Virtues",
    prompt: "What character strengths (e.g., courage, kindness, curiosity) do you embody? Which would you like to develop further? How might these guide your life vision?"
  },
  {
    day: 9,
    title: "Multiple Intelligences",
    theme: "Abilities",
    prompt: "Beyond traditional intelligence, reflect on your emotional, social, creative, physical, and other intelligences. How do these shape your potential path?"
  },
  {
    day: 10,
    title: "Foundation Integration",
    theme: "Self-Knowledge",
    prompt: "Looking at your reflections from the past 9 days, write a comprehensive self-description. What essential truths about yourself will inform your life vision?"
  },
  
  // PAST REFLECTION (Days 11-20): Learning from life experiences
  {
    day: 11,
    title: "Childhood Influences",
    theme: "Origins",
    prompt: "How has your childhood shaped who you are today? What lessons, beliefs, or patterns stem from your early experiences?"
  },
  {
    day: 12,
    title: "Formative Experiences",
    theme: "Key Moments",
    prompt: "What 3-5 experiences have most shaped your life path? How did each change your direction, perspective, or sense of what's possible?"
  },
  {
    day: 13,
    title: "Teachers & Mentors",
    theme: "Guidance",
    prompt: "Who has guided or influenced your life journey? What wisdom from them continues to shape your choices and perspectives?"
  },
  {
    day: 14,
    title: "Past Dreams",
    theme: "Aspirations",
    prompt: "What did you dream of becoming or doing when you were younger? Which dreams did you pursue, abandon, or postpone? What might these tell you about your authentic desires?"
  },
  {
    day: 15,
    title: "Life Challenges",
    theme: "Resilience",
    prompt: "What significant challenges have you faced? How did you navigate them? What strengths and capacities emerged from these difficulties?"
  },
  {
    day: 16,
    title: "Regrets & Lessons",
    theme: "Learning",
    prompt: "What decisions or actions do you regret? What have you learned from these experiences? How might these lessons guide your future choices?"
  },
  {
    day: 17,
    title: "Relationship Patterns",
    theme: "Connection History",
    prompt: "What patterns have you noticed in your relationships over time? How have these shaped who you are and how you connect with others?"
  },
  {
    day: 18,
    title: "Career Journey",
    theme: "Work History",
    prompt: "Trace your work or career path. What patterns emerge in what you've sought, enjoyed, or avoided? What has this journey taught you about meaningful work?"
  },
  {
    day: 19,
    title: "Personal Evolution",
    theme: "Growth",
    prompt: "How have you evolved as a person over time? What beliefs, values, or priorities have shifted? What aspects of yourself have remained constant?"
  },
  {
    day: 20,
    title: "Past Integration",
    theme: "Life Lessons",
    prompt: "Reflecting on your past, what are the 5-7 most significant lessons you've learned? How will these inform your vision for the future?"
  },
  
  // PRESENT ASSESSMENT (Days 21-30): Current life evaluation
  {
    day: 21,
    title: "Current Reality Check",
    theme: "Present State",
    prompt: "Assess your life as it is today. What's working well? What's not working? Where do you feel alignment or misalignment with your true self?"
  },
  {
    day: 22,
    title: "Life Satisfaction",
    theme: "Fulfillment Areas",
    prompt: "Rate your satisfaction (1-10) in key life areas: career, relationships, health, finances, personal growth, fun, physical environment, etc. What patterns do you notice?"
  },
  {
    day: 23,
    title: "Energy Inventory",
    theme: "Vitality",
    prompt: "What activities, people, or environments energize you? What depletes you? How might you design a life with more of what fills your cup?"
  },
  {
    day: 24,
    title: "Time Audit",
    theme: "Priorities",
    prompt: "How do you currently spend your time? Does this alignment with your values and priorities? What adjustments would create better alignment?"
  },
  {
    day: 25,
    title: "Relationship Assessment",
    theme: "Current Connections",
    prompt: "Evaluate your key relationships. Which support your growth and authentic expression? Which feel challenging? What might need to shift?"
  },
  {
    day: 26,
    title: "Work & Contribution",
    theme: "Meaningful Activity",
    prompt: "Assess your current work or main activities. How meaningful do they feel? How well do they utilize your strengths and align with your values?"
  },
  {
    day: 27,
    title: "Financial Landscape",
    theme: "Resource Reality",
    prompt: "Examine your relationship with money and resources. What's working well? What needs attention? How does this impact your life choices?"
  },
  {
    day: 28,
    title: "Physical Wellbeing",
    theme: "Body Assessment",
    prompt: "How are you caring for your physical health? What's supporting your wellbeing? What habits or patterns might you want to change?"
  },
  {
    day: 29,
    title: "Emotional Landscape",
    theme: "Feeling States",
    prompt: "What emotions dominate your daily experience? Which do you welcome, and which do you avoid? What might your emotional patterns be telling you?"
  },
  {
    day: 30,
    title: "Present Integration",
    theme: "Current Snapshot",
    prompt: "Create a comprehensive snapshot of your life today - the fulfilling and challenging aspects. What does this reveal about what you need and want moving forward?"
  },
  
  // DREAM EXPLORATION (Days 31-40): Imagining possibilities
  {
    day: 31,
    title: "Permission to Dream",
    theme: "Liberation",
    prompt: "If anything were possible - with no limitations of money, time, or expectations - what would you do, be, or create? Allow yourself to dream without constraints."
  },
  {
    day: 32,
    title: "Alternate Lives",
    theme: "Possibilities",
    prompt: "Imagine 3-5 completely different lives you could lead. Describe each in detail. What elements across these scenarios feel most exciting or meaningful?"
  },
  {
    day: 33,
    title: "Childhood Dreams Revisited",
    theme: "Original Desires",
    prompt: "Return to your childhood dreams. Which still resonate? Is there wisdom or authentic desire in these early visions that might inform your life vision now?"
  },
  {
    day: 34,
    title: "Idealized Day",
    theme: "Daily Rhythm",
    prompt: "Describe your ideal day in detail from morning to night. What activities, people, places, and feelings are present? What does this reveal about what matters to you?"
  },
  {
    day: 35,
    title: "Adventure & Growth",
    theme: "Expansion",
    prompt: "What adventures, challenges, or growth experiences do you yearn for? What would stretch you beyond your comfort zone in meaningful ways?"
  },
  {
    day: 36,
    title: "Dream Environment",
    theme: "Physical Context",
    prompt: "Describe your ideal living environment and location. What elements would nourish your spirit? How would this environment support your best life?"
  },
  {
    day: 37,
    title: "Relationship Vision",
    theme: "Connection Dreams",
    prompt: "Envision your ideal relationship landscape - romantic, family, friendship, community. What qualities and experiences would these relationships embody?"
  },
  {
    day: 38,
    title: "Creative Expression",
    theme: "Artistic Vision",
    prompt: "What forms of creative expression call to you? What would you create if you knew you couldn't fail? How might creativity be part of your life vision?"
  },
  {
    day: 39,
    title: "Impact Imagination",
    theme: "Contribution Vision",
    prompt: "If you could create any positive impact in the world, what would it be? How might your unique gifts address needs that matter to you?"
  },
  {
    day: 40,
    title: "Dreams Integration",
    theme: "Possibility Patterns",
    prompt: "Review your dreams and visions from the past 10 days. What patterns emerge? What elements feel most alive, exciting, and authentic to you?"
  },
  
  // PURPOSE & MEANING (Days 41-50): Finding core purpose
  {
    day: 41,
    title: "Sources of Meaning",
    theme: "Significance",
    prompt: "When have you felt that your life had deep meaning or purpose? What conditions or elements were present? What activities make you lose track of time?"
  },
  {
    day: 42,
    title: "Life as Legacy",
    theme: "Contribution",
    prompt: "What mark do you want to leave on the world? How would you like your life to have mattered? What contribution feels uniquely yours to make?"
  },
  {
    day: 43,
    title: "Core Motivations",
    theme: "Driving Forces",
    prompt: "What fundamentally motivates you? Beyond external rewards, what drives your choices and actions at the deepest level?"
  },
  {
    day: 44,
    title: "Intersections",
    theme: "Sweet Spots",
    prompt: "Where do your talents, passions, values, and the world's needs intersect? What activities or roles combine what you're good at, love, value, and what's needed?"
  },
  {
    day: 45,
    title: "Purpose Statements",
    theme: "Mission",
    prompt: "Draft 3-5 possible purpose statements that might guide your life. Example: 'My purpose is to...' Which resonates most deeply?"
  },
  {
    day: 46,
    title: "Meaning Through Adversity",
    theme: "Transformation",
    prompt: "How have you found meaning in difficult experiences? What purpose might your challenges serve in your larger life story?"
  },
  {
    day: 47,
    title: "Transcendent Experiences",
    theme: "Beyond Self",
    prompt: "When have you felt connected to something larger than yourself? What practices, places, or activities provide this sense of transcendence or connection?"
  },
  {
    day: 48,
    title: "Mortality Reflection",
    theme: "Limited Time",
    prompt: "Reflecting on life's finite nature, what becomes most important? If you had limited time, how would you spend it? What would you no longer tolerate?"
  },
  {
    day: 49,
    title: "Personal Philosophy",
    theme: "Wisdom",
    prompt: "What wisdom have you gained about living a good life? What principles or understandings guide your approach to life's fundamental questions?"
  },
  {
    day: 50,
    title: "Purpose Integration",
    theme: "Unified Direction",
    prompt: "Synthesize your reflections on purpose and meaning. What central purpose might guide your life vision? How might this purpose express itself across different domains?"
  },
  
  // RELATIONSHIPS (Days 51-60): Connection with others
  {
    day: 51,
    title: "Relationship Values",
    theme: "Connection Principles",
    prompt: "What values are most important to you in relationships? What qualities do you bring to your relationships? What qualities do you seek in others?"
  },
  {
    day: 52,
    title: "Family Vision",
    theme: "Kin Connections",
    prompt: "What kind of family life do you envision? How do family relationships (chosen or birth) fit into your life vision? What patterns would you continue or change?"
  },
  {
    day: 53,
    title: "Friendship Landscape",
    theme: "Peer Bonds",
    prompt: "What role do friendships play in your ideal life? What qualities and experiences define your most meaningful friendships? How might these evolve over time?"
  },
  {
    day: 54,
    title: "Romantic Connection",
    theme: "Partnership",
    prompt: "What place does romantic partnership have in your life vision? What would an ideal partnership look and feel like? How would it support your growth and purpose?"
  },
  {
    day: 55,
    title: "Community Belonging",
    theme: "Larger Circles",
    prompt: "What communities do you want to belong to? What would meaningful community connection look like in your vision? How might you contribute and receive?"
  },
  {
    day: 56,
    title: "Relationship Patterns",
    theme: "Connection Habits",
    prompt: "What patterns in relationships would you like to transform? What new relational skills or approaches would support your vision for connection?"
  },
  {
    day: 57,
    title: "Communication Vision",
    theme: "Authentic Expression",
    prompt: "How do you want to communicate and be heard? What would authentic, effective communication look like in your key relationships?"
  },
  {
    day: 58,
    title: "Boundaries & Space",
    theme: "Healthy Limits",
    prompt: "What boundaries would support healthy relationships in your life vision? How do you balance connection with others and connection with yourself?"
  },
  {
    day: 59,
    title: "Conflict & Growth",
    theme: "Productive Tension",
    prompt: "How might conflict be generative in your relationships? What approach to differences would allow both parties to grow while preserving connection?"
  },
  {
    day: 60,
    title: "Relationships Integration",
    theme: "Connection Ecosystem",
    prompt: "Design your ideal ecosystem of relationships. Who would be in your inner, middle, and outer circles? How would these relationships support your wholeness and purpose?"
  },
  
  // WORK & CONTRIBUTION (Days 61-70): Career and meaningful work
  {
    day: 61,
    title: "Work Purpose",
    theme: "Meaningful Contribution",
    prompt: "What kind of work feels most meaningful to you? How might your work express your purpose and values? What impact would you like to have through your work?"
  },
  {
    day: 62,
    title: "Ideal Work Environment",
    theme: "Context & Culture",
    prompt: "Describe your ideal work environment - physical space, culture, pace, structure, colleagues. What conditions allow you to thrive and contribute at your best?"
  },
  {
    day: 63,
    title: "Skills & Mastery",
    theme: "Competence",
    prompt: "What skills would you like to develop or master? What expertise would be most fulfilling to cultivate? How might developing these serve your larger purposes?"
  },
  {
    day: 64,
    title: "Financial Vision",
    theme: "Resource Stewardship",
    prompt: "What role does money play in your life vision? What would 'enough' look like? How would you like to earn, save, spend, invest, and share financial resources?"
  },
  {
    day: 65,
    title: "Balance & Integration",
    theme: "Work-Life Harmony",
    prompt: "How does work integrate with other dimensions of your life vision? What would healthy balance look and feel like for you?"
  },
  {
    day: 66,
    title: "Leadership & Influence",
    theme: "Positive Impact",
    prompt: "How might you lead or influence others through your work? What approach to leadership aligns with your values and purpose?"
  },
  {
    day: 67,
    title: "Entrepreneurship & Creation",
    theme: "Building & Innovating",
    prompt: "What might you create or build? Does creating your own venture or project fit into your vision? What would you bring into being if you could?"
  },
  {
    day: 68,
    title: "Service & Giving",
    theme: "Altruism",
    prompt: "How might service or volunteering fit into your life vision? What causes or communities would you like to support through your time, talent, or resources?"
  },
  {
    day: 69,
    title: "Legacy Through Work",
    theme: "Enduring Impact",
    prompt: "What professional legacy would you like to leave? How might your work contributions outlast your direct involvement? What would you like to be remembered for?"
  },
  {
    day: 70,
    title: "Work Integration",
    theme: "Contribution Synthesis",
    prompt: "Synthesize your reflections on work and contribution. What would your ideal work life look like? How would it express your purpose and utilize your gifts?"
  },
  
  // WELLBEING & JOY (Days 71-80): Health and happiness
  {
    day: 71,
    title: "Physical Vitality",
    theme: "Body Care",
    prompt: "What role does physical health play in your life vision? What practices, activities, and choices would support your ideal of physical wellbeing?"
  },
  {
    day: 72,
    title: "Emotional Wellbeing",
    theme: "Feeling Life",
    prompt: "What would emotional wellbeing look and feel like for you? What practices and approaches would help you develop emotional resilience and richness?"
  },
  {
    day: 73,
    title: "Mental Clarity",
    theme: "Cognitive Health",
    prompt: "How would you like to develop and maintain your mental faculties? What practices would support clear thinking, learning, and cognitive wellbeing?"
  },
  {
    day: 74,
    title: "Spiritual Connection",
    theme: "Transcendent Dimension",
    prompt: "What role does spirituality play in your life vision? How might you nurture connection to what you consider sacred, meaningful, or greater than yourself?"
  },
  {
    day: 75,
    title: "Play & Joy",
    theme: "Pleasure & Delight",
    prompt: "What brings you genuine joy and pleasure? How would play, fun, and enjoyment be integrated into your ideal life? What would you do just because it delights you?"
  },
  {
    day: 76,
    title: "Rest & Restoration",
    theme: "Renewal",
    prompt: "How would you ideally rest and restore your energy? What would healthy rhythms of activity and recovery look like in your vision?"
  },
  {
    day: 77,
    title: "Creative Expression",
    theme: "Making & Imagining",
    prompt: "How would creative expression nurture your wellbeing? What forms of creativity would you include in your vision for a joyful, fulfilled life?"
  },
  {
    day: 78,
    title: "Nature Connection",
    theme: "Environmental Bond",
    prompt: "What role does connection with the natural world play in your vision? How would you integrate nature experiences into your ideal life?"
  },
  {
    day: 79,
    title: "Learning & Growth",
    theme: "Development",
    prompt: "How would continual learning and personal growth feature in your vision? What would you like to learn, study, or explore throughout your life?"
  },
  {
    day: 80,
    title: "Wellbeing Integration",
    theme: "Wholeness",
    prompt: "Design a comprehensive approach to wellbeing that integrates physical, emotional, mental, and spiritual dimensions. What practices and priorities would support your thriving?"
  },
  
  // FUTURE PLANNING (Days 81-90): Concrete plans and goals
  {
    day: 81,
    title: "Vision to Reality",
    theme: "Implementation",
    prompt: "What would it take to move from vision to reality? What specific changes or actions would bridge where you are now and where you want to be?"
  },
  {
    day: 82,
    title: "Core Goal Areas",
    theme: "Key Focuses",
    prompt: "What 3-5 areas of your life vision feel most important to focus on first? For each, what specific goals would create meaningful progress?"
  },
  {
    day: 83,
    title: "Habit Design",
    theme: "Daily Practices",
    prompt: "What daily and weekly habits would support your vision? Design specific routines that would gradually shift your life toward your vision."
  },
  {
    day: 84,
    title: "Resource Inventory",
    theme: "Assets & Needs",
    prompt: "What resources (skills, relationships, finances, etc.) do you already have to support your vision? What additional resources will you need to develop or acquire?"
  },
  {
    day: 85,
    title: "Obstacle Planning",
    theme: "Challenge Management",
    prompt: "What internal and external obstacles might hinder your vision? For each, develop specific strategies to overcome or navigate these challenges."
  },
  {
    day: 86,
    title: "Support System",
    theme: "Help & Accountability",
    prompt: "Who could support you in realizing your vision? How might you enlist help, feedback, accountability, or encouragement from others?"
  },
  {
    day: 87,
    title: "Decision Framework",
    theme: "Choice Architecture",
    prompt: "What framework will help you make decisions aligned with your vision? Develop specific questions or criteria to guide future choices."
  },
  {
    day: 88,
    title: "Metrics & Feedback",
    theme: "Progress Tracking",
    prompt: "How will you measure progress toward your vision? What indicators would show you're moving in the right direction? How will you gather feedback?"
  },
  {
    day: 89,
    title: "Adjustment Process",
    theme: "Adaptive Planning",
    prompt: "How will you review and adjust your vision and plans over time? Design a process for periodically reflecting on your journey and course-correcting as needed."
  },
  {
    day: 90,
    title: "Action Plan",
    theme: "First Steps",
    prompt: "Develop a concrete action plan for your first three months. What specific steps will you take? What calendar commitments will you make to yourself?"
  },
  
  // INTEGRATION & LEGACY (Days 91-100): Synthesis and living your vision
  {
    day: 91,
    title: "Living Your Vision",
    theme: "Daily Embodiment",
    prompt: "How can you begin living elements of your vision today, even before external circumstances fully change? What mindsets or practices can you embody now?"
  },
  {
    day: 92,
    title: "Personal Credo",
    theme: "Guiding Principles",
    prompt: "Write a personal credo or manifesto that captures the essence of how you want to live. What principles will guide your choices and actions?"
  },
  {
    day: 93,
    title: "Life Chapters Ahead",
    theme: "Future Story",
    prompt: "Envision the chapters of your life story yet to be written. What titles would you give these chapters? What themes and developments might unfold?"
  },
  {
    day: 94,
    title: "Aging With Purpose",
    theme: "Lifelong Development",
    prompt: "How do you envision growing older with purpose and grace? What would meaningful aging look like within your life vision?"
  },
  {
    day: 95,
    title: "Wisdom Cultivation",
    theme: "Growing Deeper",
    prompt: "What wisdom would you like to develop over your lifetime? How might you grow not just older but wiser, deeper, and more compassionate?"
  },
  {
    day: 96,
    title: "Legacy Statement",
    theme: "Impact",
    prompt: "Draft a personal legacy statement. What positive impact do you want to have on others and the world? How do you want to be remembered?"
  },
  {
    day: 97,
    title: "One-Year Vision",
    theme: "Near Future",
    prompt: "Create a detailed vision of your life one year from now. What will have changed? What will you be doing, feeling, and experiencing?"
  },
  {
    day: 98,
    title: "Five-Year Vision",
    theme: "Medium Future",
    prompt: "Envision your life five years from now. What will you have accomplished? How will your daily life look and feel? What will matter most?"
  },
  {
    day: 99,
    title: "Ten-Year Horizon",
    theme: "Long Future",
    prompt: "Look ten years ahead. What possibilities excite you? What impact will you have made? How will your wisdom and experience have deepened?"
  },
  {
    day: 100,
    title: "Your Legacy",
    theme: "Integration",
    prompt: "After this 100-day journey of reflection, what do you want your life to stand for? What legacy do you hope to create? What will be your next chapter?"
  }
];

export const mindfulVisualizationDays = [
  {
    day: 1,
    title: "Visual Awareness",
    theme: "Present Observation",
    prompt: "Take a moment to observe your surroundings. Choose one object that catches your attention and create a simple sketch of it, focusing on its basic shapes and lines rather than perfection."
  },
  {
    day: 2,
    title: "Emotional Colors",
    theme: "Color Expression",
    prompt: "What emotion are you feeling most strongly today? Select colors that represent this emotion and create an abstract expression using only colors, shapes, and movement. No specific objects needed."
  },
  {
    day: 3,
    title: "Mindful Lines",
    theme: "Process Focus",
    prompt: "Draw a series of flowing lines without planning the outcome. Focus entirely on the sensation of the pen or pencil moving across the paper. Allow the lines to develop organically as you stay present with each stroke."
  },
  {
    day: 4,
    title: "Nature's Patterns",
    theme: "Natural Forms",
    prompt: "Spend time observing a natural element (a leaf, flower, cloud formations, or tree bark). Create a drawing that captures the patterns you observe, focusing on texture and repetition."
  },
  {
    day: 5,
    title: "Body Awareness",
    theme: "Physical Sensation",
    prompt: "Close your eyes and notice sensations in your body. Where do you feel tension, lightness, or energy? Create a visual representation of these physical sensations using colors, shapes, or symbols."
  },
  {
    day: 6,
    title: "Breath Visualization",
    theme: "Rhythmic Flow",
    prompt: "As you breathe deeply, draw a continuous line that follows your breath - perhaps rising with inhales and falling with exhales. Continue for at least 5 minutes, creating a visual record of your breathing pattern."
  },
  {
    day: 7,
    title: "Sound Translation",
    theme: "Sensory Integration",
    prompt: "Listen carefully to sounds in your environment (or play a piece of music). Translate these sounds into visual elements - perhaps dots for short sounds, waves for continuous ones, or colors for different tones."
  },
  {
    day: 8,
    title: "Memory Sketching",
    theme: "Present to Past",
    prompt: "Recall a calm, pleasant memory. Without overthinking, sketch elements from this memory. Focus on capturing the feeling rather than creating an accurate representation."
  },
  {
    day: 9,
    title: "Gratitude Symbols",
    theme: "Appreciation",
    prompt: "Create simple symbols or icons representing three things you're grateful for today. Arrange them in a composition that feels balanced and meaningful to you."
  },
  {
    day: 10,
    title: "Inner Weather",
    theme: "Emotional Landscape",
    prompt: "If your current emotional state were weather, what would it be? Create a visual representation of this internal weather system using colors, shapes, and textures that reflect your emotional climate."
  },
  {
    day: 11,
    title: "Intentional Mandalas",
    theme: "Centered Focus",
    prompt: "Create a simple mandala starting from the center and working outward. As you add each layer, set an intention or focus on a quality you wish to cultivate (patience, joy, calm, etc.)."
  },
  {
    day: 12,
    title: "Shadow Appreciation",
    theme: "Contrast & Balance",
    prompt: "Observe shadows and light around you. Create a drawing focusing on the contrast between light and dark, noticing how shadows define and reveal objects rather than simply obscuring them."
  },
  {
    day: 13,
    title: "Texture Exploration",
    theme: "Tactile Awareness",
    prompt: "Close your eyes and touch different textures around you. Create a visual composition of these textures, translating the tactile experience into visual patterns."
  },
  {
    day: 14,
    title: "Dream Fragment",
    theme: "Subconscious Expression",
    prompt: "Recall a recent dream or fragment of a dream. Create a drawing, doodle, or painting that captures the essence or feeling of this dream without trying to literally illustrate it."
  },
  {
    day: 15,
    title: "Mid-Journey Reflection",
    theme: "Integration",
    prompt: "Review your visual journal entries from the past two weeks. Create a new piece that integrates elements or techniques from your favorite previous entries, bringing them together in a new way."
  },
  {
    day: 16,
    title: "Body Mapping",
    theme: "Self-Connection",
    prompt: "Draw a simple outline of a human body. Using colors, patterns, or symbols, map your emotional and physical experiences onto this body outline. Where do you feel joy, tension, energy, or calm?"
  },
  {
    day: 17,
    title: "Releasing Visualization",
    theme: "Letting Go",
    prompt: "Think of something you'd like to release or let go of. Create a visual representation of this release - perhaps depicting the transformation from tension to freedom or from chaos to clarity."
  },
  {
    day: 18,
    title: "Sacred Space",
    theme: "Inner Sanctuary",
    prompt: "Visualize a space that represents safety, peace, and comfort to you. Create a drawing of this inner sanctuary, including elements that make you feel protected and nourished."
  },
  {
    day: 19,
    title: "Movement Traces",
    theme: "Dynamic Presence",
    prompt: "Attach your drawing tool to a longer stick or holder to create distance. Move your whole arm or body as you draw, tracing the natural movements of your body rather than controlling with just your hand."
  },
  {
    day: 20,
    title: "Intuitive Symbols",
    theme: "Personal Iconography",
    prompt: "Without overthinking, create 3-5 symbols that feel personally meaningful to you right now. These might represent current challenges, aspirations, or significant aspects of your life."
  },
  {
    day: 21,
    title: "Nature Connection",
    theme: "Ecological Awareness",
    prompt: "Spend time observing a natural element (tree, flower, sky, water). Create a drawing that explores your connection with this element, perhaps blending your human form with the natural world."
  },
  {
    day: 22,
    title: "Childhood Memory",
    theme: "Playful Expression",
    prompt: "Recall how you used to draw or create as a child. Using your non-dominant hand, create a drawing with the freedom and unselfconsciousness of childhood."
  },
  {
    day: 23,
    title: "Visual Meditation",
    theme: "Focused Awareness",
    prompt: "Begin with a single dot in the center of your page. For 10 minutes, add to your drawing while maintaining complete focus on the present moment, returning to mindful awareness whenever your mind wanders."
  },
  {
    day: 24,
    title: "Emotional Spectrum",
    theme: "Full Range Expression",
    prompt: "Create a visual representation of your emotional spectrum - from your most challenging emotions to your most uplifting ones. How do these emotions relate to each other in your inner landscape?"
  },
  {
    day: 25,
    title: "Word to Image",
    theme: "Linguistic Translation",
    prompt: "Choose a word that feels significant to you today. Without illustrating the word literally, create a visual expression of the essence or feeling of this word through color, shape, and texture."
  },
  {
    day: 26,
    title: "Energy Pathways",
    theme: "Vitality Awareness",
    prompt: "With your eyes closed, sense the movement of energy in your body. Open your eyes and create flowing lines that map these energy pathways, perhaps using different colors for different types of energy."
  },
  {
    day: 27,
    title: "Growth Visualization",
    theme: "Transformation",
    prompt: "Create a visual representation of your personal growth journey. How might you depict where you've been, where you are now, and the direction you're growing toward?"
  },
  {
    day: 28,
    title: "Boundary Exploration",
    theme: "Containment & Freedom",
    prompt: "Draw a boundary or container of some kind (circle, square, irregular shape). Fill the inside and outside differently, exploring the relationship between contained and uncontained space."
  },
  {
    day: 29,
    title: "Visual Storytelling",
    theme: "Narrative Flow",
    prompt: "Create a simple sequential drawing that tells a story in 3-4 panels. Focus on transition and flow rather than detail, allowing the story to emerge intuitively rather than planning it completely."
  },
  {
    day: 30,
    title: "Aspirational Vision",
    theme: "Future Self",
    prompt: "Create a visual representation of a quality you wish to develop more fully in yourself. How might this quality look and feel if it were expressed visually?"
  },
  {
    day: 31,
    title: "Integration Patterns",
    theme: "Wholeness",
    prompt: "Create a drawing that represents integration of different aspects of yourself. You might use different patterns in the same image, or find ways to visually harmonize contrasting elements."
  },
  {
    day: 32,
    title: "Gratitude Garden",
    theme: "Abundance",
    prompt: "Create a visual garden filled with elements that represent things you're grateful for. Each plant, flower, or feature can symbolize a different aspect of your life that nourishes you."
  },
  {
    day: 33,
    title: "Visual Journey Reflection",
    theme: "Creative Integration",
    prompt: "Look through all your visual journal entries from this journey. Create a final piece that incorporates elements that most resonated with you, celebrating your visual mindfulness practice and what you've discovered."
  }
];

export const lifeValuesDays = [
  {
    day: 1,
    title: "Values Introduction",
    theme: "Self-Awareness",
    prompt: "What are values and why do they matter? Reflect on times when you felt most aligned and fulfilled. What values were you honoring in those moments?"
  },
  {
    day: 2,
    title: "Values Exploration",
    theme: "Discovery",
    prompt: "From a list of common values (integrity, freedom, creativity, security, etc.), which 10-15 initially resonate with you? Why do these particular values stand out?"
  },
  {
    day: 3,
    title: "Core Values Identification",
    theme: "Prioritization",
    prompt: "From yesterday's list, which 5-7 values feel most essential to who you are? What makes these your core values rather than simply preferences?"
  },
  {
    day: 4,
    title: "Values in Action",
    theme: "Manifestation",
    prompt: "For each of your core values, describe a specific time when you lived that value fully. How did it feel? What impact did it have?"
  },
  {
    day: 5,
    title: "Values Conflicts",
    theme: "Tension",
    prompt: "When have your core values come into conflict with each other? How did you navigate this tension? What did you prioritize and why?"
  },
  {
    day: 6,
    title: "Family Values",
    theme: "Origins",
    prompt: "What values were emphasized in your family of origin? Which did you absorb, reject, or modify as you developed your own value system?"
  },
  {
    day: 7,
    title: "Cultural Values",
    theme: "Societal Influence",
    prompt: "How have your cultural background and societal expectations shaped your values? Which culturally-transmitted values do you embrace, and which do you question?"
  },
  {
    day: 8,
    title: "Values Assessment",
    theme: "Congruence",
    prompt: "How aligned is your current life with your core values? Rate each value on a scale of 1-10 for how fully you're living it. Where are the gaps?"
  },
  {
    day: 9,
    title: "Work Values",
    theme: "Professional Alignment",
    prompt: "How do your values show up in your work or career? Which values are honored in your current role, and which are compromised? What would greater alignment look like?"
  },
  {
    day: 10,
    title: "Relationship Values",
    theme: "Connection",
    prompt: "How do your values influence your relationships? Which values do you share with those closest to you? Where do your values differ, and how do you navigate those differences?"
  },
  {
    day: 11,
    title: "Values and Time",
    theme: "Priorities",
    prompt: "Examine how you spend your time in a typical week. Which activities align with your core values? Which activities don't serve your values? What adjustments would create better alignment?"
  },
  {
    day: 12,
    title: "Values Under Pressure",
    theme: "Resilience",
    prompt: "When under stress or pressure, which of your values are easiest to maintain and which tend to be compromised? What helps you stay aligned with your values during difficult times?"
  },
  {
    day: 13,
    title: "Values and Decision-Making",
    theme: "Choices",
    prompt: "Recall a significant decision you've made recently. How did your values influence this choice? Create a values-based framework for making future decisions."
  },
  {
    day: 14,
    title: "Values Evolution",
    theme: "Growth",
    prompt: "How have your values evolved over time? Which values have remained constant throughout your life, and which have shifted? What catalyzed these changes?"
  },
  {
    day: 15,
    title: "Aspirational Values",
    theme: "Future Self",
    prompt: "What values do you aspire to embody more fully? What qualities do you admire in others that you'd like to develop in yourself? What would living these values look like?"
  },
  {
    day: 16,
    title: "Values and Ethics",
    theme: "Principles",
    prompt: "How do your values inform your ethical framework? Consider a morally complex situation. How do your values guide your approach to ethical dilemmas?"
  },
  {
    day: 17,
    title: "Values in Community",
    theme: "Collective Belonging",
    prompt: "Which communities or groups share your core values? How does belonging to these communities reinforce your values? How might you contribute to communities that matter to you?"
  },
  {
    day: 18,
    title: "Living Your Values",
    theme: "Alignment",
    prompt: "Choose one value you want to express more fully. What specific actions, habits, or practices would help you live this value more intentionally? Create a concrete plan."
  },
  {
    day: 19,
    title: "Values Legacy",
    theme: "Impact",
    prompt: "What values do you hope to pass on or be remembered for? How might your living these values impact others and continue beyond your lifetime?"
  },
  {
    day: 20,
    title: "Personal Values Statement",
    theme: "Integration",
    prompt: "Draft a personal values statement that captures your core principles and how you aim to live them. How might this statement guide your choices and actions?"
  },
  {
    day: 21,
    title: "Values and Purpose",
    theme: "Meaning",
    prompt: "How do your values connect to your sense of purpose or meaning? What kind of contribution feels aligned with your core values? How might living your values create a more meaningful life?"
  },
  {
    day: 22,
    title: "Values Journey Integration",
    theme: "Commitment",
    prompt: "Looking back on your values exploration, what key insights have emerged? What commitments will you make to ensure your life remains aligned with what matters most to you?"
  }
];

// "Relationship Mastery" 30-day journey (adapted from premium path)
export const relationshipMasteryDays = [
  {
    day: 1,
    title: "Relationship Audit",
    theme: "Assessment",
    prompt: "Map your key relationships (family, friends, romantic, professional). For each, note what's working well and what could be improved. What patterns do you notice across relationships?"
  },
  {
    day: 2,
    title: "Relationship Values",
    theme: "Principles",
    prompt: "What qualities do you most value in relationships (trust, humor, depth, etc.)? Which of these do you embody consistently, and which do you aspire to develop more fully?"
  },
  {
    day: 3,
    title: "Attachment Patterns",
    theme: "Connection Styles",
    prompt: "Reflect on your attachment style. Do you tend to cling, avoid, or remain secure in close relationships? How do these patterns stem from early experiences and affect your connections now?"
  },
  {
    day: 4,
    title: "Communication Inventory",
    theme: "Expression",
    prompt: "Assess your communication habits. When do you express yourself clearly vs. hold back? What helps you communicate effectively, and what triggers poor communication?"
  },
  {
    day: 5,
    title: "Active Listening",
    theme: "Receptivity",
    prompt: "When did you last truly listen to someone without planning your response? What helps you be fully present? How might you improve your listening in important relationships?"
  },
  {
    day: 6,
    title: "Boundaries Exploration",
    theme: "Healthy Limits",
    prompt: "Where do you maintain healthy boundaries, and where are they weak or rigid? How might clearer boundaries actually enhance your most important connections?"
  },
  {
    day: 7,
    title: "Conflict Patterns",
    theme: "Disagreement",
    prompt: "How do you typically approach conflict (avoid, accommodate, compete, compromise, collaborate)? What was modeled for you growing up? How effective is your current approach?"
  },
  {
    day: 8,
    title: "Trust Builders",
    theme: "Reliability",
    prompt: "What builds trust for you in relationships? When have you experienced deep trust with someone? What specific behaviors helped create this foundation?"
  },
  {
    day: 9,
    title: "Trust Breakers",
    theme: "Rupture",
    prompt: "When has trust been broken in a significant relationship? What impact did this have? What helped (or would help) rebuild that trust? What did you learn from this experience?"
  },
  {
    day: 10,
    title: "Vulnerability Exploration",
    theme: "Openness",
    prompt: "How comfortable are you with being vulnerable? What makes vulnerability easier or harder for you? How might appropriate vulnerability deepen your key relationships?"
  },
  {
    day: 11,
    title: "Asking for What You Need",
    theme: "Self-Advocacy",
    prompt: "How effectively do you express your needs in relationships? What makes this challenging? Draft language for clearly expressing an important need to someone in your life."
  },
  {
    day: 12,
    title: "Giving vs. Receiving",
    theme: "Balance",
    prompt: "Do you find it easier to give or receive in relationships? Where might your relationships be unbalanced? What helps you maintain a healthy flow of giving and receiving?"
  },
  {
    day: 13,
    title: "Empathy Practices",
    theme: "Understanding Others",
    prompt: "Recall a recent disagreement. How well did you understand the other person's perspective? Reimagine the situation, fully stepping into their experience and feelings."
  },
  {
    day: 14,
    title: "Forgiveness Exploration",
    theme: "Letting Go",
    prompt: "Is there someone you're struggling to forgive? What makes forgiveness difficult? What might become possible if you could release this resentment? What would help you move toward forgiveness?"
  },
  {
    day: 15,
    title: "Relationship Mid-Point Check",
    theme: "Progress",
    prompt: "Review insights from the past two weeks. What relationship patterns have you recognized? What shifts have you begun to make? What remains challenging?"
  },
  {
    day: 16,
    title: "Digital Communication",
    theme: "Modern Connection",
    prompt: "How do digital tools affect your relationships? When do they enhance connection, and when do they detract? What boundaries around technology would benefit your relationships?"
  },
  {
    day: 17,
    title: "Appreciation Practices",
    theme: "Gratitude",
    prompt: "How often do you express genuine appreciation to others? For three key relationships, note specific qualities you appreciate. How might you express this appreciation more consistently?"
  },
  {
    day: 18,
    title: "Difficult Conversations",
    theme: "Courage",
    prompt: "What conversation have you been avoiding? Why is it difficult? How might you approach it constructively? Script an opening that's both honest and respectful."
  },
  {
    day: 19,
    title: "Relationship Maintenance",
    theme: "Nurturing",
    prompt: "What regular practices keep your important relationships healthy? Which relationships need more intentional maintenance? Design a simple practice for nurturing a key relationship."
  },
  {
    day: 20,
    title: "Support Systems",
    theme: "Community",
    prompt: "Map your support network. Who do you turn to for different types of support? Where are there gaps? How might you strengthen or expand your support system?"
  },
  {
    day: 21,
    title: "Relationship Repair",
    theme: "Healing",
    prompt: "Reflect on a relationship that needs repair. What steps could begin a healing process? What would a first conversation include? What outcome are you hoping for?"
  },
  {
    day: 22,
    title: "Mentorship & Learning",
    theme: "Growth",
    prompt: "Who has modeled healthy relationships for you? What have you learned from them? What relationship skills are you still developing, and where might you find guidance?"
  },
  {
    day: 23,
    title: "Expectations vs. Reality",
    theme: "Acceptance",
    prompt: "Where do your relationship expectations create disappointment or frustration? Which expectations are reasonable, and which might need adjustment? How might greater acceptance transform a challenging relationship?"
  },
  {
    day: 24,
    title: "Cultural Influences",
    theme: "Societal Context",
    prompt: "How have cultural messages shaped your relationship expectations and behaviors? Which of these influences serve you well, and which might you want to reconsider?"
  },
  {
    day: 25,
    title: "Self-Relationship",
    theme: "Inner Connection",
    prompt: "How is your relationship with yourself? Where are you self-critical vs. self-compassionate? How does your self-relationship affect your connections with others?"
  },
  {
    day: 26,
    title: "Interdependence Balance",
    theme: "Connection & Autonomy",
    prompt: "How do you balance closeness and independence in relationships? Where do you lean toward unhealthy dependence or distance? What helps you maintain healthy interdependence?"
  },
  {
    day: 27,
    title: "Relationship Vision",
    theme: "Aspiration",
    prompt: "Envision your ideal relationship ecosystem 5 years from now. What qualities characterize these relationships? What changes would lead toward this vision? What first steps can you take?"
  },
  {
    day: 28,
    title: "Relationship Action Plan",
    theme: "Implementation",
    prompt: "Choose one key relationship to focus on improving. What specific actions will you take? What conversation might you initiate? What personal change would make the biggest difference?"
  },
  {
    day: 29,
    title: "Navigating Change",
    theme: "Evolution",
    prompt: "How do you adapt when relationships change? Reflect on a relationship that's evolved significantly. What helped you navigate this transition? What wisdom can you apply to future changes?"
  },
  {
    day: 30,
    title: "Relationship Mastery Integration",
    theme: "Wisdom",
    prompt: "Looking back over the past month, what key relationship insights have emerged? What patterns have you recognized? What new practices are you committed to continuing? What's your next step in relationship growth?"
  }
];

// "Financial Mindfulness" 21-day journey (adapted from premium path)
export const financialMindfulnessDays = [
  {
    day: 1,
    title: "Money Story",
    theme: "Narrative",
    prompt: "Explore your earliest memories about money. What messages did you receive growing up? How have these shaped your current relationship with finances?"
  },
  {
    day: 2,
    title: "Money Beliefs",
    theme: "Mindset",
    prompt: "What core beliefs do you hold about money? (Examples: 'There's never enough,' 'Money corrupts,' 'I'm bad with finances'). Which beliefs serve you, and which limit you?"
  },
  {
    day: 3,
    title: "Financial Feelings",
    theme: "Emotions",
    prompt: "What emotions arise when you think about your finances? What specific money situations trigger anxiety, shame, pride, or security? How do these emotions influence your financial decisions?"
  },
  {
    day: 4,
    title: "Money & Identity",
    theme: "Self-Concept",
    prompt: "How does money relate to your sense of self-worth and identity? In what ways have you tied your value as a person to your financial status? How might you separate the two?"
  },
  {
    day: 5,
    title: "Financial Reality Check",
    theme: "Awareness",
    prompt: "Without judgment, take stock of your current financial situation. What's working well? What needs attention? What small step would create greater clarity about your finances?"
  },
  {
    day: 6,
    title: "Spending Patterns",
    theme: "Consumption",
    prompt: "Review your recent purchases. What patterns do you notice? When do you spend mindfully vs. reactively? What values are reflected in your spending choices?"
  },
  {
    day: 7,
    title: "Scarcity vs. Abundance",
    theme: "Perspective",
    prompt: "Do you operate from a scarcity mindset or an abundance mindset around money? How does this perspective affect your decisions? What would shift if you adopted a more balanced view?"
  },
  {
    day: 8,
    title: "Money & Relationships",
    theme: "Social Dynamics",
    prompt: "How does money impact your relationships? Explore financial dynamics with partners, family, or friends. Where do tensions arise? How might you improve financial communication?"
  },
  {
    day: 9,
    title: "Financial Values",
    theme: "Principles",
    prompt: "What values matter most to you regarding money? (Examples: security, generosity, freedom, or growth). How well do your current financial habits align with these values?"
  },
  {
    day: 10,
    title: "Enough",
    theme: "Sufficiency",
    prompt: "What does 'enough' mean to you financially? How would you define true wealth beyond monetary measurements? What non-financial assets enrich your life?"
  },
  {
    day: 11,
    title: "Money Triggers",
    theme: "Reactions",
    prompt: "What financial situations trigger stress or automatic reactions? (Examples: checking your balance, receiving bills, or discussing money). What would help you respond more mindfully?"
  },
  {
    day: 12,
    title: "Financial Habits",
    theme: "Patterns",
    prompt: "Identify your helpful and unhelpful financial habits. Choose one habit to change. What small, concrete step could you take to begin shifting this pattern?"
  },
  {
    day: 13,
    title: "Money & Time",
    theme: "Exchange",
    prompt: "Reflect on the relationship between your time and money. When does spending money save time wisely? When does pursuing money cost too much time? How might you create a healthier balance?"
  },
  {
    day: 14,
    title: "Mid-Journey Financial Check",
    theme: "Progress",
    prompt: "How has your relationship with money shifted over the past two weeks? What insights have been most valuable? What remains challenging? What would you like to explore further?"
  },
  {
    day: 15,
    title: "Financial Fears",
    theme: "Concerns",
    prompt: "What money fears keep you awake at night? Name your biggest financial worries. For each fear, consider: How likely is this scenario? What would help you feel more secure?"
  },
  {
    day: 16,
    title: "Money & Purpose",
    theme: "Meaning",
    prompt: "How might money serve your deeper purpose? What meaningful goals could financial resources help you achieve? How could your finances better align with what matters most to you?"
  },
  {
    day: 17,
    title: "Financial Decision-Making",
    theme: "Choices",
    prompt: "How do you make financial decisions? Are they reactive or deliberate? Create a simple framework for making money choices that align with your values and long-term wellbeing."
  },
  {
    day: 18,
    title: "Gratitude & Generosity",
    theme: "Abundance",
    prompt: "Reflect on what you're grateful for financially. How does gratitude shift your money mindset? How does generosity play a role in your financial life? How might you cultivate both?"
  },
  {
    day: 19,
    title: "Money Vision",
    theme: "Future",
    prompt: "Envision your ideal relationship with money three years from now. What's different? How do you feel about finances? What habits have you developed? What steps would move you toward this vision?"
  },
  {
    day: 20,
    title: "Financial Action Plan",
    theme: "Implementation",
    prompt: "Based on your insights from this journey, what 2-3 specific actions would most improve your financial wellbeing? Create a concrete plan with timelines for these priority changes."
  },
  {
    day: 21,
    title: "Financial Mindfulness Integration",
    theme: "Wisdom",
    prompt: "Looking back over the past three weeks, how has your relationship with money evolved? What key insights will you carry forward? How will you maintain financial mindfulness in your daily life?"
  }
];

export const holisticTransformationDays = [
  // MODULE 1: FOUNDATIONS (Days 1-10) - Setting the groundwork
  {
    day: 1,
    title: "Journey Beginning",
    theme: "Intention",
    prompt: "What brings you to this 100-day transformation journey? Write about your hopes, expectations, and what transformation means to you personally."
  },
  {
    day: 2,
    title: "Current Reality",
    theme: "Assessment",
    prompt: "Take an honest inventory of your life as it stands today. Rate your satisfaction (1-10) in key areas: physical health, emotional wellbeing, relationships, career, finances, personal growth, and spirituality."
  },
  {
    day: 3,
    title: "Vision Creation",
    theme: "Possibility",
    prompt: "Imagine yourself 100 days from now, having experienced significant positive change. What would be different? How would you feel, think, and behave? Be as specific and vivid as possible."
  },
  {
    day: 4,
    title: "Values Clarification",
    theme: "Core Principles",
    prompt: "What are your top 5-7 core values? For each value, explain why it matters to you and how it might guide your transformation. Are there values you'd like to embody more fully?"
  },
  {
    day: 5,
    title: "Limiting Beliefs",
    theme: "Mental Barriers",
    prompt: "What beliefs about yourself or the world might be holding you back from transformation? Where did these beliefs originate? How might reframing them support your growth?"
  },
  {
    day: 6,
    title: "Strengths Identification",
    theme: "Personal Power",
    prompt: "What are your greatest strengths, talents, and positive qualities? When do you feel most capable and alive? How might these strengths support your transformation journey?"
  },
  {
    day: 7,
    title: "Resource Mapping",
    theme: "Support",
    prompt: "What resources (people, tools, environments, practices) are available to support your transformation? What additional resources might you need to seek out or create?"
  },
  {
    day: 8,
    title: "Obstacles & Challenges",
    theme: "Preparation",
    prompt: "What internal and external obstacles might arise during your transformation? For each challenge, brainstorm potential strategies to overcome or navigate it."
  },
  {
    day: 9,
    title: "Learning Modalities",
    theme: "Growth Approach",
    prompt: "How do you learn and grow most effectively? Consider past growth experiences - what conditions, approaches, or environments helped you transform most successfully?"
  },
  {
    day: 10,
    title: "Commitment Contract",
    theme: "Dedication",
    prompt: "Write a formal commitment to yourself for this 100-day journey. What specific promises will you make? How will you hold yourself accountable? Sign and date your contract."
  },
  
  // MODULE 2: MIND MASTERY (Days 11-20) - Mental patterns and thought management
  {
    day: 11,
    title: "Thought Patterns",
    theme: "Awareness",
    prompt: "Observe your thought patterns today. What recurring thoughts arise? Which are constructive, and which create limitation or suffering? Simply notice without judgment."
  },
  {
    day: 12,
    title: "Cognitive Distortions",
    theme: "Thinking Traps",
    prompt: "Identify three cognitive distortions you experience (e.g., all-or-nothing thinking, catastrophizing, mind reading). How do these distortions affect your emotions and behaviors?"
  },
  {
    day: 13,
    title: "Mental Reframing",
    theme: "Perspective Shift",
    prompt: "Choose a challenging situation you're facing. Write about it from three completely different perspectives, noticing how each viewpoint changes your emotional response."
  },
  {
    day: 14,
    title: "Mindfulness Practice",
    theme: "Present Awareness",
    prompt: "Spend 10 minutes in mindful observation, then reflect: What sensations, thoughts, and emotions did you notice? How might regular mindfulness support your transformation?"
  },
  {
    day: 15,
    title: "Self-Talk Patterns",
    theme: "Inner Dialogue",
    prompt: "What is the tone and content of your self-talk? Write down your most common self-statements. How would you speak to a beloved friend facing the same situations?"
  },
  {
    day: 16,
    title: "Focus & Attention",
    theme: "Mental Energy",
    prompt: "Where does your attention naturally go throughout the day? What deserves more of your focus, and what deserves less? How might you redirect your mental energy?"
  },
  {
    day: 17,
    title: "Curiosity Cultivation",
    theme: "Open Mind",
    prompt: "What topics, questions, or experiences awaken your curiosity? How might approaching your transformation with curiosity rather than judgment enhance your growth?"
  },
  {
    day: 18,
    title: "Mental Triggers",
    theme: "Emotional Reactions",
    prompt: "What situations, words, or behaviors reliably trigger strong emotional reactions in you? Explore the underlying beliefs or past experiences connected to these triggers."
  },
  {
    day: 19,
    title: "Worry Management",
    theme: "Future Thinking",
    prompt: "What worries or anxieties about the future occupy your mind? For each worry, ask: Is this within my control? What specific action could address what's controllable?"
  },
  {
    day: 20,
    title: "Mind Mastery Reflection",
    theme: "Integration",
    prompt: "Looking back at the past 10 days, what insights have you gained about your mental patterns? What specific thought management practices will you carry forward?"
  },
  
  // MODULE 3: EMOTIONAL INTELLIGENCE (Days 21-30) - Emotional awareness and regulation
  {
    day: 21,
    title: "Emotional Vocabulary",
    theme: "Naming Feelings",
    prompt: "Expand your emotional vocabulary by listing as many emotion words as possible. Which emotions do you experience most frequently? Which are most uncomfortable for you?"
  },
  {
    day: 22,
    title: "Emotion Location",
    theme: "Body Awareness",
    prompt: "Where do you physically feel different emotions in your body? Create a body map of your emotions, noting physical sensations associated with joy, fear, anger, sadness, etc."
  },
  {
    day: 23,
    title: "Emotional Triggers",
    theme: "Reaction Patterns",
    prompt: "What consistently triggers specific emotional responses in you? Consider people, situations, topics, or unmet needs that reliably elicit strong feelings."
  },
  {
    day: 24,
    title: "Emotion Regulation",
    theme: "Self-Soothing",
    prompt: "What strategies help you regulate intense emotions? Identify healthy techniques for each primary emotion (joy, fear, anger, sadness). What new strategies might you develop?"
  },
  {
    day: 25,
    title: "Emotional Needs",
    theme: "Core Requirements",
    prompt: "What are your fundamental emotional needs (e.g., connection, autonomy, security, purpose)? How well are these needs being met, and how might you address unfulfilled needs?"
  },
  {
    day: 26,
    title: "Difficult Emotions",
    theme: "Acceptance",
    prompt: "Choose an emotion you typically avoid or suppress. What wisdom might this emotion carry? How might accepting rather than resisting it transform your experience?"
  },
  {
    day: 27,
    title: "Emotional Cycles",
    theme: "Patterns",
    prompt: "What cyclical emotional patterns do you notice in your life? Are there predictable emotional waves related to work, relationships, time of day, or other factors?"
  },
  {
    day: 28,
    title: "Joy Cultivation",
    theme: "Positive Emotions",
    prompt: "What reliably brings you joy, contentment, or peace? How might you intentionally incorporate more of these positive emotional experiences into your daily life?"
  },
  {
    day: 29,
    title: "Emotional Intelligence in Relationships",
    theme: "Connection",
    prompt: "How do you navigate emotions in relationships? Consider how you express, recognize, and respond to others' feelings. What patterns create connection or disconnection?"
  },
  {
    day: 30,
    title: "Emotional Intelligence Reflection",
    theme: "Integration",
    prompt: "Reflecting on the past 10 days, what have you learned about your emotional landscape? What practices for emotional awareness and regulation will you continue?"
  },
  
  // MODULE 4: BODY WISDOM (Days 31-40) - Physical wellbeing and body awareness
  {
    day: 31,
    title: "Body Relationship",
    theme: "Physical Connection",
    prompt: "How would you describe your relationship with your body? What messages did you receive about your body growing up, and how have these shaped your body image?"
  },
  {
    day: 32,
    title: "Body Sensations",
    theme: "Physical Awareness",
    prompt: "Take time to scan your body from head to toe. What sensations do you notice? Where do you feel tension, ease, energy, or depletion? What might your body be communicating?"
  },
  {
    day: 33,
    title: "Movement Exploration",
    theme: "Physical Expression",
    prompt: "What forms of movement bring you joy and vitality? How does your body like to move? What new ways of moving might you explore during this transformation journey?"
  },
  {
    day: 34,
    title: "Rest & Recovery",
    theme: "Restoration",
    prompt: "How well do you honor your body's need for rest? Examine your sleep quality, relaxation practices, and ability to recognize and respond to signals of fatigue."
  },
  {
    day: 35,
    title: "Nourishment Patterns",
    theme: "Fuel",
    prompt: "What is your relationship with food and eating? How do different foods affect your energy, mood, and wellbeing? What shifts in nourishment might support your transformation?"
  },
  {
    day: 36,
    title: "Physical Environment",
    theme: "Surroundings",
    prompt: "How do your physical surroundings affect your wellbeing? Consider spaces where you feel most at ease versus tense. How might you create more supportive environments?"
  },
  {
    day: 37,
    title: "Stress Responses",
    theme: "Tension Patterns",
    prompt: "How does your body respond to stress? Where do you hold tension? What physical practices help you release stress and return to a state of balance?"
  },
  {
    day: 38,
    title: "Pain & Discomfort",
    theme: "Body Messages",
    prompt: "What physical pain or discomfort do you experience? Consider both chronic and occasional issues. What might these sensations be communicating, and how do you respond?"
  },
  {
    day: 39,
    title: "Energy Management",
    theme: "Vitality",
    prompt: "When do you feel most energized and vital? What depletes your energy? How might you structure your days to honor your natural energy rhythms?"
  },
  {
    day: 40,
    title: "Body Wisdom Reflection",
    theme: "Integration",
    prompt: "Reflecting on the past 10 days, what have you learned about your body's wisdom? What practices will you continue to nurture your physical wellbeing?"
  },
  
  // MODULE 5: HABIT REDESIGN (Days 41-50) - Creating supportive routines and breaking patterns
  {
    day: 41,
    title: "Habit Inventory",
    theme: "Pattern Recognition",
    prompt: "What are your current daily and weekly habits? Make a comprehensive list of both supportive and unsupportive routines that shape your life."
  },
  {
    day: 42,
    title: "Keystone Habits",
    theme: "Foundation Behaviors",
    prompt: "What 2-3 keystone habits, if implemented consistently, would have the greatest positive impact on your overall wellbeing and transformation?"
  },
  {
    day: 43,
    title: "Habit Triggers",
    theme: "Cues",
    prompt: "For habits you want to change, what are the triggers or cues that initiate the behavior? For habits you want to develop, what reliable triggers could you establish?"
  },
  {
    day: 44,
    title: "Morning Routine",
    theme: "Day Foundation",
    prompt: "Design your ideal morning routine. How would you begin your day to set a tone of intention, presence, and vitality? What specific elements would you include?"
  },
  {
    day: 45,
    title: "Evening Routine",
    theme: "Closure",
    prompt: "Create your ideal evening routine. How would you end your day to support reflection, rest, and preparation for tomorrow? What specific elements would you include?"
  },
  {
    day: 46,
    title: "Habit Obstacles",
    theme: "Friction Points",
    prompt: "What internal and external obstacles interfere with your desired habits? For each obstacle, brainstorm specific strategies to overcome or work around it."
  },
  {
    day: 47,
    title: "Habit Support Systems",
    theme: "Scaffolding",
    prompt: "What environmental and social supports could help your new habits stick? How might you design your physical space, schedule, and relationships to reinforce positive change?"
  },
  {
    day: 48,
    title: "Weekly Planning",
    theme: "Intentional Time",
    prompt: "Design a weekly planning process. How will you review the past week and intentionally design the coming week to align with your transformation goals?"
  },
  {
    day: 49,
    title: "Habit Tracking",
    theme: "Measurement",
    prompt: "What simple system will you use to track your key habits? How will you measure progress, celebrate consistency, and adjust when needed?"
  },
  {
    day: 50,
    title: "Habit Redesign Reflection",
    theme: "Integration",
    prompt: "Looking back at the past 10 days, what insights have you gained about your habits? What specific habit changes will you focus on implementing in the coming weeks?"
  },
  
  // MODULE 6: RELATIONSHIP DYNAMICS (Days 51-60) - Interpersonal connections and patterns
  {
    day: 51,
    title: "Relationship Mapping",
    theme: "Connection Inventory",
    prompt: "Map your key relationships, placing yourself at the center with concentric circles representing closeness. What patterns do you notice in how you connect with others?"
  },
  {
    day: 52,
    title: "Communication Patterns",
    theme: "Expression",
    prompt: "How do you typically communicate your needs, boundaries, and feelings? When are you most clear and authentic in your expression, and when do you struggle to communicate?"
  },
  {
    day: 53,
    title: "Listening Practices",
    theme: "Reception",
    prompt: "How would you rate your listening skills? When do you listen deeply versus when do you plan responses or get distracted? How might you develop deeper listening?"
  },
  {
    day: 54,
    title: "Relationship Needs",
    theme: "Connection Requirements",
    prompt: "What do you most need in close relationships? Consider needs for autonomy, connection, understanding, support, etc. How well are these needs being met?"
  },
  {
    day: 55,
    title: "Conflict Patterns",
    theme: "Tension Navigation",
    prompt: "How do you typically respond to interpersonal conflict? Do you tend toward avoidance, accommodation, competition, compromise, or collaboration? What patterns have you inherited?"
  },
  {
    day: 56,
    title: "Boundaries",
    theme: "Healthy Limits",
    prompt: "Where are your boundaries strong, and where do they need strengthening? Consider physical, emotional, time, and energy boundaries. What makes boundary-setting challenging?"
  },
  {
    day: 57,
    title: "Trust Dynamics",
    theme: "Safety & Vulnerability",
    prompt: "What builds and breaks trust for you in relationships? Consider past experiences that have shaped your ability to trust others and be vulnerable."
  },
  {
    day: 58,
    title: "Forgiveness Exploration",
    theme: "Releasing Resentment",
    prompt: "Where are you holding resentment or hurt in relationships? What might forgiveness look like, and what steps could begin the healing process? Remember forgiveness is for your freedom."
  },
  {
    day: 59,
    title: "Community & Belonging",
    theme: "Collective Connection",
    prompt: "Where do you experience a sense of belonging and community? How might you cultivate deeper connections with groups that share your values and interests?"
  },
  {
    day: 60,
    title: "Relationship Dynamics Reflection",
    theme: "Integration",
    prompt: "Reflecting on the past 10 days, what patterns have you discovered in your relationships? What specific changes in your approach to connection will you implement going forward?"
  },
  
  // MODULE 7: MEANING & PURPOSE (Days 61-70) - Life direction and significance
  {
    day: 61,
    title: "Sources of Meaning",
    theme: "Significance",
    prompt: "When have you experienced a deep sense of meaning and purpose? What activities, relationships, or contributions create a feeling that your life matters?"
  },
  {
    day: 62,
    title: "Values in Action",
    theme: "Living Principles",
    prompt: "How are your core values expressed through your daily choices and actions? Where do you see alignment between values and behavior, and where do you notice gaps?"
  },
  {
    day: 63,
    title: "Legacy Consideration",
    theme: "Impact",
    prompt: "What impact would you like to have on the world and those around you? How would you like to be remembered? What legacy do you wish to create through your life?"
  },
  {
    day: 64,
    title: "Work & Contribution",
    theme: "Service",
    prompt: "How does your work or daily contribution align with your sense of purpose? What would make your work feel more meaningful and aligned with your values?"
  },
  {
    day: 65,
    title: "Life Mission",
    theme: "Core Purpose",
    prompt: "If you were to craft a personal mission statement, what would it be? What central purpose might guide your choices and actions across different domains of your life?"
  },
  {
    day: 66,
    title: "Ikigai Exploration",
    theme: "Purposeful Intersection",
    prompt: "Consider the Japanese concept of ikigai - the intersection of what you love, what you're good at, what the world needs, and what you can be rewarded for. Where is this sweet spot for you?"
  },
  {
    day: 67,
    title: "Spiritual Connection",
    theme: "Transcendence",
    prompt: "What practices, experiences, or beliefs connect you to something larger than yourself? How might deepening this connection enhance your sense of meaning and purpose?"
  },
  {
    day: 68,
    title: "Creativity & Expression",
    theme: "Authentic Voice",
    prompt: "How does creative expression bring meaning to your life? What forms of creativity feel most authentic to you, and how might you incorporate more creative expression?"
  },
  {
    day: 69,
    title: "Growth & Learning",
    theme: "Evolution",
    prompt: "How does personal growth and learning contribute to your sense of purpose? What areas of development call to you now, and how might pursuing them enrich your life's meaning?"
  },
  {
    day: 70,
    title: "Meaning & Purpose Reflection",
    theme: "Integration",
    prompt: "Looking back at the past 10 days, what insights have emerged about your life's meaning and purpose? How will you align your daily life more closely with what matters most?"
  },
  
  // MODULE 8: PROFESSIONAL DEVELOPMENT (Days 71-80) - Career and work life
  {
    day: 71,
    title: "Career Assessment",
    theme: "Professional Inventory",
    prompt: "How satisfied are you with your current professional life? Consider alignment with values, use of strengths, relationships, compensation, growth, and impact."
  },
  {
    day: 72,
    title: "Professional Strengths",
    theme: "Work Capabilities",
    prompt: "What are your greatest professional strengths and talents? When do you feel most capable, engaged, and valuable in your work? How might you leverage these strengths further?"
  },
  {
    day: 73,
    title: "Growth Edges",
    theme: "Development Areas",
    prompt: "What skills or capabilities would you like to develop professionally? What specific growth areas, if addressed, would most enhance your effectiveness and satisfaction?"
  },
  {
    day: 74,
    title: "Work Relationships",
    theme: "Professional Connections",
    prompt: "How would you describe your relationships with colleagues, supervisors, clients, or team members? What patterns create connection or tension in your work relationships?"
  },
  {
    day: 75,
    title: "Professional Environment",
    theme: "Work Context",
    prompt: "How does your work environment affect your productivity, creativity, and wellbeing? Consider physical space, culture, and structure. What changes would enhance your experience?"
  },
  {
    day: 76,
    title: "Work Boundaries",
    theme: "Professional Limits",
    prompt: "How effectively do you maintain boundaries between work and personal life? What adjustments would create a healthier integration of professional and personal domains?"
  },
  {
    day: 77,
    title: "Career Vision",
    theme: "Professional Future",
    prompt: "If you were to envision your ideal professional life 3-5 years from now, what would it look like? What specific steps could move you toward this vision?"
  },
  {
    day: 78,
    title: "Leadership Approach",
    theme: "Influence",
    prompt: "How do you express leadership, regardless of formal role? What is your natural leadership style, and how might you develop as a positive influence in your professional context?"
  },
  {
    day: 79,
    title: "Productivity & Focus",
    theme: "Effective Work",
    prompt: "When are you most productive and focused in your work? What conditions, habits, or approaches maximize your effectiveness? How might you create more of these optimal conditions?"
  },
  {
    day: 80,
    title: "Professional Development Reflection",
    theme: "Integration",
    prompt: "Reflecting on the past 10 days, what insights have emerged about your professional life? What specific changes will you implement to enhance your work experience and impact?"
  },
  
  // MODULE 9: RESILIENCE BUILDING (Days 81-90) - Developing inner strength and adaptability
  {
    day: 81,
    title: "Adversity Inventory",
    theme: "Challenge Assessment",
    prompt: "What significant challenges have you faced in your life? How did you navigate them, and what strengths or coping strategies emerged from these experiences?"
  },
  {
    day: 82,
    title: "Stress Response",
    theme: "Pressure Reactions",
    prompt: "How do you typically respond to stress and pressure? What thought patterns, emotions, and behaviors arise when you're under stress? Which responses serve you, and which don't?"
  },
  {
    day: 83,
    title: "Recovery Practices",
    theme: "Restoration",
    prompt: "What helps you recover from stress, setbacks, or difficult experiences? What specific practices support your resilience and ability to bounce back?"
  },
  {
    day: 84,
    title: "Support Network",
    theme: "Connection Resources",
    prompt: "Who comprises your support network during challenges? How do you reach out for and receive support? How might you strengthen this network of connection?"
  },
  {
    day: 85,
    title: "Meaning Making",
    theme: "Narrative Construction",
    prompt: "How do you make meaning from difficult experiences? Consider how you've integrated past challenges into your life story and identity. What meaning might you create from current challenges?"
  },
  {
    day: 86,
    title: "Adaptability",
    theme: "Flexible Response",
    prompt: "How adaptable are you when plans change or expectations aren't met? What helps you adjust to new circumstances, and what makes adaptation more difficult?"
  },
  {
    day: 87,
    title: "Inner Resources",
    theme: "Personal Strengths",
    prompt: "What inner resources help you navigate challenging times? Consider traits like patience, courage, humor, faith, determination, or creativity that support your resilience."
  },
  {
    day: 88,
    title: "Failure Relationship",
    theme: "Learning from Setbacks",
    prompt: "How do you relate to failure and setbacks? When have failures ultimately led to growth or unexpected positive outcomes? How might you reframe your relationship with failure?"
  },
  {
    day: 89,
    title: "Future Challenges",
    theme: "Preparation",
    prompt: "What challenges might you face in the coming months or years? How might you proactively prepare to navigate these potential difficulties with resilience?"
  },
  {
    day: 90,
    title: "Resilience Building Reflection",
    theme: "Integration",
    prompt: "Looking back at the past 10 days, what have you learned about your resilience? What specific practices or mindsets will you cultivate to strengthen your ability to navigate life's challenges?"
  },
  
  // MODULE 10: INTEGRATION & FUTURE VISION (Days 91-100) - Synthesizing learning and planning forward
  {
    day: 91,
    title: "Transformation Review",
    theme: "Journey Assessment",
    prompt: "Looking back over the past 90 days, what have been your most significant insights, changes, or growth experiences? What has shifted in how you think, feel, or behave?"
  },
  {
    day: 92,
    title: "Integration Challenges",
    theme: "Growth Obstacles",
    prompt: "What aspects of your transformation have been most challenging to integrate into daily life? What resistance, obstacles, or setbacks have you encountered?"
  },
  {
    day: 93,
    title: "Success Celebration",
    theme: "Achievement Recognition",
    prompt: "What specific successes and wins from this journey deserve celebration? Take time to acknowledge and appreciate your commitment, courage, and growth."
  },
  {
    day: 94,
    title: "Identity Evolution",
    theme: "Self-Concept",
    prompt: "How has your sense of identity evolved during this journey? What new ways of seeing yourself have emerged? What old self-concepts have you outgrown or transformed?"
  },
  {
    day: 95,
    title: "Wisdom Distillation",
    theme: "Key Learnings",
    prompt: "If you could distill the wisdom gained from this journey into five key insights or principles, what would they be? How might these serve as guideposts moving forward?"
  },
  {
    day: 96,
    title: "Ongoing Practices",
    theme: "Sustainability",
    prompt: "What specific practices from this journey will you continue? How will you sustain these practices and maintain the momentum of your transformation?"
  },
  {
    day: 97,
    title: "One-Year Vision",
    theme: "Near Future",
    prompt: "Envision your life one year from now, building on the foundation of this transformation journey. What will be different in how you live, relate, work, and experience yourself?"
  },
  {
    day: 98,
    title: "Five-Year Vision",
    theme: "Extended Horizon",
    prompt: "Expand your vision to five years from now. What possibilities might unfold as you continue to apply the insights and practices from this transformation journey?"
  },
  {
    day: 99,
    title: "Continuation Plan",
    theme: "Next Steps",
    prompt: "Design a specific plan for your ongoing growth after this 100-day journey. What areas will you focus on next? What structures will support your continued transformation?"
  },
  {
    day: 100,
    title: "Full Circle Integration",
    theme: "Completion",
    prompt: "As you complete this 100-day journey, reflect on your initial intentions and hopes from Day 1. What has been fulfilled? What surprised you? What will you carry forward as you begin your next chapter?"
  }
];

// Add these three new journey arrays to your JourneyData.js file

// 1. MANIFESTATION & REALITY CREATION (33 days, Text, Intermediate)
export const manifestationRealityDays = [
  {
    day: 1,
    title: "Setting Your Manifestation Foundation",
    theme: "Foundation",
    prompt: "What does manifestation mean to you? Write about your current beliefs about creating your reality. What do you want to manifest in your life, and what might be holding you back from believing it's possible?"
  },
  {
    day: 2,
    title: "Identifying Your Deepest Desires",
    theme: "Clarity",
    prompt: "Beyond surface wants, what are your soul's deepest desires? Explore what you truly want to experience, feel, and become. Don't worry about 'how' - focus on the 'what' and 'why'."
  },
  {
    day: 3,
    title: "Examining Your Relationship with Abundance",
    theme: "Abundance",
    prompt: "How do you relate to abundance in all its forms - love, money, opportunities, joy? Write about any scarcity beliefs or abundance blocks you notice in your thinking."
  },
  {
    day: 4,
    title: "Present Moment Awareness",
    theme: "Presence",
    prompt: "Manifestation happens in the present moment. Describe your current reality with gratitude and detail. What aspects of your dream life are already present now?"
  },
  {
    day: 5,
    title: "Energy and Vibration Check-In",
    theme: "Energy",
    prompt: "How does your energy feel today? Write about your emotional state, physical sensations, and overall vibration. What energy are you putting out into the world?"
  },
  {
    day: 6,
    title: "Vision Clarity Session",
    theme: "Vision",
    prompt: "Create a detailed written vision of your ideal life. Be specific - what does a typical day look like? How do you feel? What are you doing? Who surrounds you?"
  },
  {
    day: 7,
    title: "Removing Internal Obstacles",
    theme: "Obstacles",
    prompt: "What internal beliefs, fears, or patterns might be blocking your manifestations? Write about any resistance you feel and where it might come from."
  },
  {
    day: 8,
    title: "Aligned Action Planning",
    theme: "Action",
    prompt: "What inspired actions can you take toward your vision? Focus on actions that feel exciting and aligned rather than forced or desperate."
  },
  {
    day: 9,
    title: "Gratitude Amplification",
    theme: "Gratitude",
    prompt: "Write a detailed gratitude practice for everything that supports your manifestation journey - including challenges that help you grow."
  },
  {
    day: 10,
    title: "Signs and Synchronicities",
    theme: "Synchronicity",
    prompt: "Reflect on any signs, synchronicities, or meaningful coincidences you've noticed lately. How might the universe be responding to your intentions?"
  },
  {
    day: 11,
    title: "Embodying Your Future Self",
    theme: "Embodiment",
    prompt: "How would your future self - who has manifested your vision - think, feel, and act? Write from that perspective about your day today."
  },
  {
    day: 12,
    title: "Relationship with Timing",
    theme: "Timing",
    prompt: "How do you handle the gap between intention and manifestation? Explore your relationship with divine timing and trust in the process."
  },
  {
    day: 13,
    title: "Community and Support",
    theme: "Community",
    prompt: "Who supports your growth and dreams? How can you surround yourself with people who believe in your vision and encourage your manifestation journey?"
  },
  {
    day: 14,
    title: "Mid-Journey Integration",
    theme: "Integration",
    prompt: "Reflect on your manifestation journey so far. What insights have emerged? What shifts have you noticed in your thinking or energy?"
  },
  {
    day: 15,
    title: "Releasing Control",
    theme: "Surrender",
    prompt: "Where are you trying to control outcomes rather than trusting the process? Write about learning to hold your vision while releasing attachment to how it unfolds."
  },
  {
    day: 16,
    title: "Worthiness and Deserving",
    theme: "Worthiness",
    prompt: "Do you believe you deserve what you're trying to manifest? Explore any feelings of unworthiness and write affirmations of your inherent deserving nature."
  },
  {
    day: 17,
    title: "Financial Flow and Abundance",
    theme: "Financial",
    prompt: "If money were no object, what would you create? Examine your relationship with money as energy and how it supports your manifestation goals."
  },
  {
    day: 18,
    title: "Creative Expression of Vision",
    theme: "Creativity",
    prompt: "How can you creatively express your vision? Write about ways to bring more creativity and play into your manifestation process."
  },
  {
    day: 19,
    title: "Health and Vitality Manifestation",
    theme: "Health",
    prompt: "How does your physical health support your manifestation goals? Write about creating energy, vitality, and well-being as part of your vision."
  },
  {
    day: 20,
    title: "Relationship Manifestation",
    theme: "Relationships",
    prompt: "What kinds of relationships do you want to manifest? Write about calling in connections that support your highest growth and joy."
  },
  {
    day: 21,
    title: "Career and Purpose Alignment",
    theme: "Purpose",
    prompt: "How can your work life align with your manifestation vision? Explore creating purpose, fulfillment, and abundance through meaningful contribution."
  },
  {
    day: 22,
    title: "Environmental Support",
    theme: "Environment",
    prompt: "How does your physical environment support your vision? Write about creating spaces that energetically align with what you're manifesting."
  },
  {
    day: 23,
    title: "Seasonal Manifestation Cycles",
    theme: "Cycles",
    prompt: "How do natural cycles and seasons support your manifestation process? Reflect on working with rather than against natural rhythms."
  },
  {
    day: 24,
    title: "Past Success Integration",
    theme: "Success",
    prompt: "Recall times you successfully manifested desires in the past. What patterns and approaches worked? How can you apply these insights now?"
  },
  {
    day: 25,
    title: "Fear Transformation",
    theme: "Fear",
    prompt: "What fears arise around actually receiving what you desire? Write about transforming fear into excitement and preparation for your manifestations."
  },
  {
    day: 26,
    title: "Service and Contribution",
    theme: "Service",
    prompt: "How do your manifestation goals serve not just you but others and the world? Explore the bigger purpose behind your personal desires."
  },
  {
    day: 27,
    title: "Intuition and Inner Guidance",
    theme: "Intuition",
    prompt: "How does your intuition guide your manifestation process? Write about strengthening your connection to inner wisdom and divine guidance."
  },
  {
    day: 28,
    title: "Celebration and Appreciation",
    theme: "Celebration",
    prompt: "How do you celebrate manifestation wins, both big and small? Write about cultivating appreciation for progress and maintaining positive momentum."
  },
  {
    day: 29,
    title: "Integration and Sustainability",
    theme: "Sustainability",
    prompt: "How can you make manifestation a sustainable life practice rather than a one-time event? Reflect on building long-term manifestation habits."
  },
  {
    day: 30,
    title: "Quantum Leaps and Expansion",
    theme: "Expansion",
    prompt: "What quantum leaps are possible for you? Write about expanding beyond your comfort zone and allowing for manifestations beyond your current imagination."
  },
  {
    day: 31,
    title: "Legacy and Long-term Vision",
    theme: "Legacy",
    prompt: "How do your manifestations contribute to the legacy you want to leave? Explore your long-term vision for impact and contribution."
  },
  {
    day: 32,
    title: "Final Integration and Wisdom",
    theme: "Wisdom",
    prompt: "What wisdom have you gained about manifestation and reality creation? Write about key insights and how they'll guide your ongoing practice."
  },
  {
    day: 33,
    title: "Commitment to Continued Creation",
    theme: "Commitment",
    prompt: "How will you continue applying manifestation principles in your daily life? Write a commitment to yourself about staying aligned with your creative power."
  }
];

// 2. DECISION-MAKING COMPASS (14 days, Text, Beginner)
export const decisionCompassDays = [
  {
    day: 1,
    title: "Your Current Decision-Making Style",
    theme: "Self-Awareness",
    prompt: "How do you typically make decisions? Do you rely on logic, intuition, others' opinions, or emotion? Write about your current approach and what works or doesn't work for you."
  },
  {
    day: 2,
    title: "Values-Based Decision Framework",
    theme: "Values",
    prompt: "What are your core values? Write about how your deepest values can serve as a compass for decisions. How would your choices change if you always honored your values first?"
  },
  {
    day: 3,
    title: "Intuition vs. Logic Balance",
    theme: "Balance",
    prompt: "Reflect on a recent decision where your intuition and logic conflicted. How do you find balance between analytical thinking and gut feelings? What does your body tell you about decisions?"
  },
  {
    day: 4,
    title: "Fear-Based vs. Love-Based Choices",
    theme: "Motivation",
    prompt: "Examine a current decision you're facing. Write about whether your options come from fear (avoiding something) or love (moving toward something). How does this awareness change your perspective?"
  },
  {
    day: 5,
    title: "The Cost of Indecision",
    theme: "Consequences",
    prompt: "Think about a time when you delayed making a decision. What was the cost of waiting? How does indecision affect your energy, relationships, and opportunities?"
  },
  {
    day: 6,
    title: "Future Self Consultation",
    theme: "Perspective",
    prompt: "Imagine yourself five years from now looking back at a current decision. What advice would your future self give you? What would you regret not doing?"
  },
  {
    day: 7,
    title: "External Influences and Pressure",
    theme: "Boundaries",
    prompt: "Who or what influences your decisions? Write about family expectations, social pressure, and cultural conditioning. How can you honor others' input while staying true to yourself?"
  },
  {
    day: 8,
    title: "Decision-Making in Uncertainty",
    theme: "Uncertainty",
    prompt: "How comfortable are you with making decisions without having all the information? Explore your relationship with uncertainty and how to move forward when you can't guarantee outcomes."
  },
  {
    day: 9,
    title: "Small Daily Choices Matter",
    theme: "Daily Practice",
    prompt: "Reflect on how small daily decisions shape your life. What routine choices could you make more consciously? How do minor decisions align with or conflict with your bigger goals?"
  },
  {
    day: 10,
    title: "Learning from Past Decisions",
    theme: "Learning",
    prompt: "Think about a decision you made that didn't turn out as expected. What did you learn? How can you apply this wisdom to current choices without being paralyzed by past mistakes?"
  },
  {
    day: 11,
    title: "Energy and Decision Quality",
    theme: "Energy",
    prompt: "Notice how your energy levels affect your decision-making. When do you make your best choices? How can you optimize your physical and mental state for important decisions?"
  },
  {
    day: 12,
    title: "Reversible vs. Irreversible Decisions",
    theme: "Flexibility",
    prompt: "Categorize current decisions as reversible or irreversible. How does this distinction change how much energy you invest in deciding? When is it okay to just try something?"
  },
  {
    day: 13,
    title: "Your Personal Decision Ritual",
    theme: "Process",
    prompt: "Design a personal process for making important decisions. What steps help you gain clarity? Create a decision-making ritual that incorporates your values, intuition, and wisdom."
  },
  {
    day: 14,
    title: "Commitment and Moving Forward",
    theme: "Commitment",
    prompt: "Reflect on your decision-making journey. What insights will you carry forward? Choose one decision you've been avoiding and commit to a process for moving forward with clarity and confidence."
  }
];

// 3. EMOTIONAL PORTRAIT SERIES (25 days, Visual, Intermediate)
export const portraitEmotionsDays = [
  {
    day: 1,
    title: "Self-Portrait Baseline",
    theme: "Foundation",
    prompt: "Create a simple self-portrait reflecting how you see yourself today. Don't worry about technical skill - focus on capturing your essence. What emotions do you see in your own eyes?"
  },
  {
    day: 2,
    title: "Joy Expression Study",
    theme: "Joy",
    prompt: "Draw or paint a portrait (yourself or imagined) expressing pure joy. Pay attention to how joy changes facial features - the eyes, mouth, overall expression. What colors represent joy to you?"
  },
  {
    day: 3,
    title: "Melancholy and Sadness",
    theme: "Sadness",
    prompt: "Explore sadness through portraiture. How do you show melancholy in the eyes, posture, or overall composition? There's beauty in sadness - try to capture that depth."
  },
  {
    day: 4,
    title: "Anger and Fire",
    theme: "Anger",
    prompt: "Channel anger or frustration into a portrait. How do you show intensity and fire in facial expression? What colors and strokes convey this powerful emotion?"
  },
  {
    day: 5,
    title: "Fear and Vulnerability",
    theme: "Fear",
    prompt: "Draw fear or anxiety in a portrait. Focus on the vulnerability in the eyes, tension in features. How can you show fear with compassion rather than judgment?"
  },
  {
    day: 6,
    title: "Surprise and Wonder",
    theme: "Surprise",
    prompt: "Capture the moment of surprise or wonder. How do features change when someone is amazed? Focus on the openness and expansion that surprise brings."
  },
  {
    day: 7,
    title: "Love and Tenderness",
    theme: "Love",
    prompt: "Create a portrait expressing love or deep tenderness. This might be romantic love, parental love, or universal compassion. How does love soften features?"
  },
  {
    day: 8,
    title: "Confidence and Strength",
    theme: "Confidence",
    prompt: "Draw someone (yourself or imagined) radiating confidence and inner strength. How do you show power that comes from within rather than aggression?"
  },
  {
    day: 9,
    title: "Contemplation and Wisdom",
    theme: "Contemplation",
    prompt: "Capture a contemplative moment - someone deep in thought or meditation. Focus on the inward-turning quality of reflection and the peace of inner focus."
  },
  {
    day: 10,
    title: "Longing and Desire",
    theme: "Longing",
    prompt: "Express longing or yearning in a portrait. This could be romantic longing, homesickness, or spiritual seeking. How do you show desire that hasn't been fulfilled?"
  },
  {
    day: 11,
    title: "Peaceful Serenity",
    theme: "Peace",
    prompt: "Create a portrait of deep peace and serenity. Focus on relaxed features, soft expressions, and the quality of inner calm. What does true peace look like?"
  },
  {
    day: 12,
    title: "Curiosity and Interest",
    theme: "Curiosity",
    prompt: "Draw someone in a state of curiosity or deep interest. How do you show the alert, engaged quality of a mind that's actively exploring?"
  },
  {
    day: 13,
    title: "Embarrassment and Shyness",
    theme: "Embarrassment",
    prompt: "Explore embarrassment or shyness through portraiture. Focus on the turning away, the hiding, but also the endearing quality of vulnerability."
  },
  {
    day: 14,
    title: "Excitement and Anticipation",
    theme: "Excitement",
    prompt: "Capture the energy of excitement or anticipation. How do features light up when someone is enthusiastic? What body language shows excitement?"
  },
  {
    day: 15,
    title: "Disappointment and Loss",
    theme: "Disappointment",
    prompt: "Draw disappointment or the weight of loss. Focus on the heaviness in features, the way disappointment settles in the face and posture."
  },
  {
    day: 16,
    title: "Determination and Grit",
    theme: "Determination",
    prompt: "Show determination or fierce resolve in a portrait. How do you capture the set jaw, focused eyes, and unwavering commitment of someone who won't give up?"
  },
  {
    day: 17,
    title: "Playfulness and Mischief",
    theme: "Playfulness",
    prompt: "Express playfulness, humor, or mischief in a portrait. Focus on the lightness, the sparkle in the eyes, and the smile that suggests fun."
  },
  {
    day: 18,
    title: "Nostalgia and Memory",
    theme: "Nostalgia",
    prompt: "Capture the distant, soft quality of nostalgia or remembering. How do you show someone lost in a memory, with that far-away look in their eyes?"
  },
  {
    day: 19,
    title: "Pride and Accomplishment",
    theme: "Pride",
    prompt: "Draw someone experiencing pride or satisfaction in accomplishment. Focus on the expansion, the straightened posture, the glow of achievement."
  },
  {
    day: 20,
    title: "Envy and Wanting",
    theme: "Envy",
    prompt: "Explore envy or jealousy through portraiture. How do you show the tension of wanting what someone else has? Can you find compassion for this difficult emotion?"
  },
  {
    day: 21,
    title: "Gratitude and Appreciation",
    theme: "Gratitude",
    prompt: "Express gratitude or deep appreciation in a portrait. Focus on the softness, warmth, and openness that comes with genuine thankfulness."
  },
  {
    day: 22,
    title: "Confusion and Uncertainty",
    theme: "Confusion",
    prompt: "Show confusion or uncertainty in a portrait. How do you capture the furrowed brow, the questioning look, the discomfort of not knowing?"
  },
  {
    day: 23,
    title: "Relief and Release",
    theme: "Relief",
    prompt: "Draw the moment of relief - when tension finally releases. Focus on the softening, the exhale, the visible relaxation that comes with relief."
  },
  {
    day: 24,
    title: "Complex Emotional Mix",
    theme: "Complexity",
    prompt: "Create a portrait showing mixed emotions - bittersweet, conflicted feelings, or multiple emotions at once. Life is complex; how do you show that in a face?"
  },
  {
    day: 25,
    title: "Your Emotional Spectrum Complete",
    theme: "Integration",
    prompt: "Create a final self-portrait incorporating all the emotional understanding you've gained. How has exploring emotions through art changed how you see yourself and others?"
  }
];



// 1. CAREER COMPASS - 21-day professional direction journey
export const careerCompassDays = [
  {
    day: 1,
    title: "Career Inventory",
    theme: "Assessment",
    prompt: "Take an honest inventory of your current professional situation. What aspects of your work energize you, and what drains you? What skills do you most enjoy using, and which feel like a burden?"
  },
  {
    day: 2,
    title: "Professional Strengths",
    theme: "Capabilities",
    prompt: "What are your greatest professional strengths and natural talents? When do you feel most competent and confident at work? How might these strengths be better utilized or developed?"
  },
  {
    day: 3,
    title: "Work Environment Preferences",
    theme: "Context",
    prompt: "Describe your ideal work environment. Consider physical space, company culture, team dynamics, autonomy level, and structure. How does your current environment compare to this ideal?"
  },
  {
    day: 4,
    title: "Career Influences",
    theme: "Origins",
    prompt: "What influenced your career choices? Consider family expectations, societal pressures, practical considerations, and personal interests. Which influences still serve you, and which might you question?"
  },
  {
    day: 5,
    title: "Professional Relationships",
    theme: "Connection",
    prompt: "Reflect on your relationships with colleagues, supervisors, clients, or team members. What patterns create connection or tension? How do these relationships impact your job satisfaction?"
  },
  {
    day: 6,
    title: "Work-Life Integration",
    theme: "Balance",
    prompt: "How well does your career integrate with your personal life and values? Where do you experience conflict or harmony? What adjustments would create better alignment?"
  },
  {
    day: 7,
    title: "Values at Work",
    theme: "Alignment",
    prompt: "How do your core personal values show up (or not show up) in your work? What would it look like to have greater alignment between your values and your career?"
  },
  {
    day: 8,
    title: "Career Fears",
    theme: "Obstacles",
    prompt: "What fears hold you back professionally? Consider fears about failure, success, change, or judgment. How might these fears be both protecting and limiting you?"
  },
  {
    day: 9,
    title: "Professional Learning",
    theme: "Growth",
    prompt: "What new skills or knowledge would most enhance your career satisfaction and effectiveness? What learning opportunities excite you, and what barriers prevent your development?"
  },
  {
    day: 10,
    title: "Impact and Contribution",
    theme: "Purpose",
    prompt: "What kind of impact do you want to have through your work? How do you want to contribute to your organization, industry, or society? What would make your work feel more meaningful?"
  },
  {
    day: 11,
    title: "Career Role Models",
    theme: "Inspiration",
    prompt: "Who do you admire professionally? What qualities do they embody that you'd like to develop? What can you learn from their career paths and approaches to work?"
  },
  {
    day: 12,
    title: "Professional Challenges",
    theme: "Obstacles",
    prompt: "What are your biggest professional challenges right now? Which are within your control to address, and which require acceptance or creative adaptation?"
  },
  {
    day: 13,
    title: "Success Redefinition",
    theme: "Achievement",
    prompt: "How do you currently define professional success? Is this definition truly yours, or influenced by others? How might you redefine success to better align with your authentic goals?"
  },
  {
    day: 14,
    title: "Future Vision",
    theme: "Aspiration",
    prompt: "Envision your ideal professional life 5 years from now. What type of work are you doing? What impact are you having? What environment are you working in? Be as specific as possible."
  },
  {
    day: 15,
    title: "Career Transitions",
    theme: "Change",
    prompt: "If you were to make a career change, what would it look like? What's attracting you toward change, and what's holding you back? What would a gradual transition involve?"
  },
  {
    day: 16,
    title: "Financial Considerations",
    theme: "Resources",
    prompt: "How do financial needs and goals impact your career choices? What's the relationship between money and fulfillment in your work? How might you balance financial and personal satisfaction?"
  },
  {
    day: 17,
    title: "Professional Legacy",
    theme: "Impact",
    prompt: "What professional legacy do you want to leave? How do you want to be remembered by colleagues and those you've worked with? What would you like your career to have contributed?"
  },
  {
    day: 18,
    title: "Networking and Community",
    theme: "Connection",
    prompt: "What professional communities or networks support your growth? How might you contribute to and benefit from professional relationships? What communities would you like to join or build?"
  },
  {
    day: 19,
    title: "Skill Gap Analysis",
    theme: "Development",
    prompt: "What gaps exist between your current capabilities and your career aspirations? What specific skills, knowledge, or experiences would bridge these gaps? How might you acquire them?"
  },
  {
    day: 20,
    title: "Risk Assessment",
    theme: "Strategy",
    prompt: "What risks are you willing to take for career growth or change? What's the cost of staying in your current situation versus the cost of making changes? How do you typically approach professional risks?"
  },
  {
    day: 21,
    title: "Action Planning",
    theme: "Implementation",
    prompt: "Based on your reflections, what are the top 3 concrete steps you could take to move toward your ideal career vision? What obstacles might you face, and how will you address them? Set specific timelines and accountability measures."
  }
];

// 2. INNER CHILD HEALING - 14-day childhood exploration
export const innerChildDays = [
  {
    day: 1,
    title: "Childhood Memories",
    theme: "Exploration",
    prompt: "What are your earliest and most vivid childhood memories? Which ones bring joy, and which bring sadness or confusion? What do these memories tell you about your young self and your early experiences of the world?"
  },
  {
    day: 2,
    title: "Young Self Description",
    theme: "Identity",
    prompt: "Describe yourself as a child. What were your personality traits, favorite activities, and natural tendencies? What did you love most about being young? What aspects of your childhood self do you miss?"
  },
  {
    day: 3,
    title: "Family Dynamics",
    theme: "Relationships",
    prompt: "How would you describe your family dynamics as a child? What spoken and unspoken rules existed? How did you learn to get attention, love, or approval? What survival strategies did you develop?"
  },
  {
    day: 4,
    title: "Childhood Wounds",
    theme: "Healing",
    prompt: "What experiences from childhood still feel painful or unresolved? Consider times you felt misunderstood, rejected, or hurt. Approach these memories with compassion rather than judgment."
  },
  {
    day: 5,
    title: "Lost Dreams",
    theme: "Reclamation",
    prompt: "What did you dream of becoming as a child? What interests and passions did you have that you may have abandoned or been told were impractical? Which of these still spark something in you today?"
  },
  {
    day: 6,
    title: "Childhood Gifts",
    theme: "Strengths",
    prompt: "What special qualities, talents, or ways of seeing the world did you have as a child? What gifts did others recognize in you? How might these natural gifts still be part of who you are today?"
  },
  {
    day: 7,
    title: "Protective Patterns",
    theme: "Survival",
    prompt: "What patterns did you develop as a child to feel safe, loved, or accepted? Consider people-pleasing, perfectionism, withdrawal, or rebellion. How do these patterns still show up in your adult life?"
  },
  {
    day: 8,
    title: "Messages Received",
    theme: "Beliefs",
    prompt: "What messages did you receive about yourself, relationships, and the world as a child? Which messages were spoken, and which were implied through actions? How have these shaped your adult beliefs?"
  },
  {
    day: 9,
    title: "Play and Joy",
    theme: "Spontaneity",
    prompt: "How did you experience play and joy as a child? What made you laugh, feel free, or lose track of time? How might you bring more of this natural playfulness into your adult life?"
  },
  {
    day: 10,
    title: "Inner Child Dialogue",
    theme: "Communication",
    prompt: "Write a conversation between your adult self and your inner child. What does your inner child need to hear? What fears or concerns does your inner child have? What wisdom does your inner child offer you?"
  },
  {
    day: 11,
    title: "Reparenting Practices",
    theme: "Nurturing",
    prompt: "What did you need more of as a child that you can now provide for yourself? Consider comfort, validation, encouragement, boundaries, or fun. How might you 'reparent' yourself in healthy ways?"
  },
  {
    day: 12,
    title: "Forgiveness Process",
    theme: "Release",
    prompt: "What aspects of your childhood are you ready to forgive - in yourself, your parents, or others? Remember that forgiveness is for your own freedom, not about condoning harmful behavior."
  },
  {
    day: 13,
    title: "Childhood Wisdom",
    theme: "Integration",
    prompt: "What wisdom did you have as a child that you've since forgotten or dismissed? Consider your natural intuition, creativity, or ways of seeing the world. How might this childhood wisdom serve you now?"
  },
  {
    day: 14,
    title: "Integration",
    theme: "Wholeness",
    prompt: "How can you honor and integrate your inner child into your adult life? What small actions could you take to bring more playfulness, curiosity, wonder, or authenticity into your daily experience? What commitment will you make to your inner child?"
  }
];

// 3. ANXIETY ALCHEMY - 10-day worry transformation
export const anxietyAlchemyDays = [
  {
    day: 1,
    title: "Anxiety Mapping",
    theme: "Awareness",
    prompt: "Describe your personal experience of anxiety in detail. Where do you feel it in your body? What physical sensations arise? What thoughts typically accompany it? When does it tend to show up most strongly?"
  },
  {
    day: 2,
    title: "Anxiety Origins",
    theme: "Understanding",
    prompt: "When did you first remember experiencing anxiety? What circumstances or life events may have contributed to your anxiety patterns? How has your relationship with anxiety evolved over time?"
  },
  {
    day: 3,
    title: "Anxiety Triggers",
    theme: "Patterns",
    prompt: "What specific situations, thoughts, or circumstances reliably trigger your anxiety? Look for patterns in timing, environments, relationships, or internal states that precede anxious episodes."
  },
  {
    day: 4,
    title: "Anxiety Messages",
    theme: "Wisdom",
    prompt: "If your anxiety could speak, what might it be trying to tell you? What might it be trying to protect you from or alert you to? How might it actually be attempting to help or guide you?"
  },
  {
    day: 5,
    title: "Body and Anxiety",
    theme: "Physical",
    prompt: "How does anxiety manifest in your body? Explore the physical sensations, tension patterns, and bodily responses. What helps your body feel safer when anxiety arises?"
  },
  {
    day: 6,
    title: "Anxiety and Control",
    theme: "Acceptance",
    prompt: "What aspects of life do you try to control when feeling anxious? What happens when you can't control these things? How might accepting uncertainty reduce your anxiety burden?"
  },
  {
    day: 7,
    title: "Reframing Practice",
    theme: "Transformation",
    prompt: "Choose a current worry or anxiety. How might you reframe this concern as valuable information, motivation for positive action, or preparation for challenges? What would change if you saw anxiety as guidance rather than suffering?"
  },
  {
    day: 8,
    title: "Anxiety Allies",
    theme: "Support",
    prompt: "What practices, people, or environments help you feel calmer when anxiety arises? What tools have you found most effective for managing anxious thoughts and feelings?"
  },
  {
    day: 9,
    title: "Future Self",
    theme: "Growth",
    prompt: "Imagine a version of yourself who has learned to work skillfully with anxiety. How does this future self relate to anxious thoughts and feelings? What wisdom would they share with you?"
  },
  {
    day: 10,
    title: "Anxiety Integration",
    theme: "Partnership",
    prompt: "How can you develop a more collaborative relationship with your anxiety? What practices will help you work with anxious energy rather than against it? What have you learned about transforming worry into wisdom?"
  }
];

// 4. DREAM JOURNAL DECODER - 14-day subconscious exploration
export const dreamJournalDecoderDays = [
  {
    day: 1,
    title: "Dream Awareness",
    theme: "Recognition",
    prompt: "Begin by simply paying attention to your dreams. Upon waking, before getting out of bed, lie still and recall any dream fragments, images, or feelings from the night. Record whatever you remember, no matter how incomplete."
  },
  {
    day: 2,
    title: "Dream Recording",
    theme: "Capture",
    prompt: "Establish a consistent practice of recording your dreams immediately upon waking. Include visual details, emotions, people, settings, and any dialogue. Don't worry about interpretation yet - focus on accurate capture."
  },
  {
    day: 3,
    title: "Dream Emotions",
    theme: "Feelings",
    prompt: "Focus specifically on the emotions present in your dreams and upon waking. What feelings dominated your dream experience? How do these emotions compare to your waking life feelings?"
  },
  {
    day: 4,
    title: "Dream Characters",
    theme: "Relationships",
    prompt: "Who appears in your dreams? Consider both known people and strangers. What might these dream characters represent? How do you interact with them, and what might these relationships symbolize?"
  },
  {
    day: 5,
    title: "Dream Settings",
    theme: "Environment",
    prompt: "Pay attention to where your dreams take place. Are you in familiar or unknown locations? What do these settings feel like? How might dream environments reflect your internal landscape?"
  },
  {
    day: 6,
    title: "Recurring Elements",
    theme: "Patterns",
    prompt: "What themes, symbols, or elements appear repeatedly in your dreams? Consider recurring people, places, objects, or situations. What might your subconscious be trying to emphasize through repetition?"
  },
  {
    day: 7,
    title: "Dream Symbols",
    theme: "Meaning",
    prompt: "Identify key symbols from your dreams this week. Rather than looking up universal meanings, consider what these symbols mean to you personally. What associations, memories, or feelings do they evoke?"
  },
  {
    day: 8,
    title: "Nightmare Navigation",
    theme: "Shadow",
    prompt: "If you've had any disturbing dreams, approach them with curiosity rather than fear. What might nightmares be trying to tell you? How might they be highlighting unresolved fears or issues that need attention?"
  },
  {
    day: 9,
    title: "Dream Gifts",
    theme: "Wisdom",
    prompt: "What insights, solutions, or creative ideas have emerged from your dreams? How might your dreaming mind offer wisdom that your conscious mind hasn't considered? What gifts has your dream world provided?"
  },
  {
    day: 10,
    title: "Dream Actions",
    theme: "Behavior",
    prompt: "How do you behave in your dreams? Are you active or passive, confident or fearful? How does your dream behavior compare to your waking behavior? What might this reveal about different aspects of yourself?"
  },
  {
    day: 11,
    title: "Lucid Moments",
    theme: "Consciousness",
    prompt: "Have you experienced any moments of awareness within dreams? Even brief glimpses of 'knowing you're dreaming' can offer insights. How might developing greater dream consciousness serve your growth?"
  },
  {
    day: 12,
    title: "Dream Integration",
    theme: "Application",
    prompt: "How might you apply dream insights to your waking life? What messages from your dreams feel relevant to current situations or decisions? How can dream wisdom inform your daily choices?"
  },
  {
    day: 13,
    title: "Dream Dialogue",
    theme: "Communication",
    prompt: "Choose a significant dream from this journey and engage in written dialogue with a key dream element - a character, symbol, or setting. What questions would you ask? What might it say in response?"
  },
  {
    day: 14,
    title: "Dream Journey Reflection",
    theme: "Integration",
    prompt: "Looking back over your two weeks of dream exploration, what patterns, insights, or surprising discoveries have emerged? How has paying attention to your dreams affected your understanding of yourself? What practice will you continue?"
  }
];

// 5. SEASONAL SOUL RHYTHMS - 28-day natural cycles alignment
export const seasonalSoulRhythmsDays = [
  {
    day: 1,
    title: "Current Season Awareness",
    theme: "Present Moment",
    prompt: "What season are you currently experiencing, both externally in nature and internally in your life? How does this season manifest in your environment, your body, and your emotional state?"
  },
  {
    day: 2,
    title: "Seasonal Childhood",
    theme: "Memory",
    prompt: "What are your earliest memories of seasonal changes? Which season felt most magical or significant to you as a child? How did your family or culture mark seasonal transitions?"
  },
  {
    day: 3,
    title: "Body Seasons",
    theme: "Physical Rhythms",
    prompt: "How does your body respond to seasonal changes? Consider energy levels, sleep patterns, appetite, and physical comfort. What does your body need during different seasons?"
  },
  {
    day: 4,
    title: "Emotional Seasons",
    theme: "Inner Weather",
    prompt: "What emotional season are you experiencing right now? Just as nature has seasons, our inner lives have periods of growth, harvest, decay, and rest. What is your soul's current season?"
  },
  {
    day: 5,
    title: "Spring Energy",
    theme: "New Beginnings",
    prompt: "Whether or not it's spring externally, explore the spring energy within you. What wants to be born, grow, or begin in your life? What seeds of possibility are you nurturing?"
  },
  {
    day: 6,
    title: "Summer Fullness",
    theme: "Peak Expression",
    prompt: "Connect with summer energy - the time of fullness, activity, and peak expression. What aspects of your life are in full bloom? Where are you expressing your gifts most fully?"
  },
  {
    day: 7,
    title: "Autumn Harvest",
    theme: "Gathering",
    prompt: "Explore autumn energy - the time of harvest and gathering wisdom. What fruits of your efforts are you harvesting? What wisdom have you gained from recent experiences? What are you grateful to have gathered?"
  },
  {
    day: 8,
    title: "Winter Rest",
    theme: "Contemplation",
    prompt: "Connect with winter energy - the time of rest, reflection, and going inward. What in your life needs rest or hibernation? What wants to be released or composted to nourish future growth?"
  },
  {
    day: 9,
    title: "Natural Rhythms",
    theme: "Observation",
    prompt: "Spend time observing the natural world around you. What seasonal signs do you notice? How do plants, animals, and landscapes embody the current season? What can you learn from nature's rhythms?"
  },
  {
    day: 10,
    title: "Resistance to Seasons",
    theme: "Acceptance",
    prompt: "What seasonal changes do you resist, both in nature and in your personal life? Why might you prefer certain seasons over others? How might accepting all seasons enrich your experience?"
  },
  {
    day: 11,
    title: "Seasonal Self-Care",
    theme: "Adaptation",
    prompt: "How might you adjust your self-care practices to align with the current season? What does your body, mind, and spirit need during this particular time of year?"
  },
  {
    day: 12,
    title: "Light and Dark",  
    theme: "Balance",
    prompt: "How do changing patterns of light and darkness affect you? Consider both literal daylight cycles and metaphorical periods of illumination and mystery in your life."
  },
  {
    day: 13,
    title: "Seasonal Creativity",
    theme: "Expression",
    prompt: "How does your creativity express itself differently across seasons? What season feels most creatively fertile for you? How might you honor your creative rhythms throughout the year?"
  },
  {
    day: 14,
    title: "Seasonal Relationships",
    theme: "Connection",
    prompt: "How do your relationships change with the seasons? Do you crave more or less social connection during different times of year? How might seasonal awareness improve your relationships?"
  },
  {
    day: 15,
    title: "Weather Patterns",
    theme: "External Reflection",
    prompt: "What is your relationship with different types of weather? How do rain, sunshine, wind, or snow affect your mood and energy? What might weather patterns teach you about adaptability?"
  },
  {
    day: 16,
    title: "Seasonal Foods",
    theme: "Nourishment",
    prompt: "What foods does your body crave during different seasons? How might eating seasonally support your health and connection to natural cycles? What seasonal nourishment practices call to you?"
  },
  {
    day: 17,
    title: "Holiday and Ritual",
    theme: "Ceremony",
    prompt: "What seasonal celebrations or rituals feel meaningful to you? How might you create personal ceremonies to honor seasonal transitions? What rituals would support your alignment with natural cycles?"
  },
  {
    day: 18,
    title: "Seasonal Work",
    theme: "Professional Rhythms",
    prompt: "How does your work or career align with seasonal rhythms? What would it look like to honor natural energy cycles in your professional life? How might seasonal awareness improve your productivity?"
  },
  {
    day: 19,
    title: "Climate and Location",
    theme: "Geography",
    prompt: "How does your geographic location affect your experience of seasons? What seasonal patterns are unique to where you live? How do you connect with seasonal rhythms if you live in a climate with subtle changes?"
  },
  {
    day: 20,
    title: "Life Season Assessment",
    theme: "Personal Timing",
    prompt: "What season of life are you in overall? Consider your age, life circumstances, and developmental stage. How might understanding your life season guide your choices and expectations?"
  },
  {
    day: 21,
    title: "Seasonal Challenges",
    theme: "Difficulty",
    prompt: "What seasonal challenges do you face? This might include seasonal depression, difficult anniversaries, or challenging weather. How might you prepare for and navigate these seasonal difficulties with compassion?"
  },
  {
    day: 22,
    title: "Micro-Seasons",
    theme: "Subtle Changes",
    prompt: "Can you notice micro-seasonal changes - subtle shifts that happen within longer seasons? How might paying attention to these small transitions increase your sensitivity to natural rhythms?"
  },
  {
    day: 23,
    title: "Seasonal Ancestors",
    theme: "Heritage",
    prompt: "How did your ancestors live in relationship with seasonal cycles? What traditional knowledge about seasonal living might inform your modern approach to natural rhythms?"
  },
  {
    day: 24,
    title: "Urban Seasons",
    theme: "City Rhythms",
    prompt: "If you live in an urban environment, how do you connect with seasonal rhythms? What signs of seasonal change can you notice in city life? How might you strengthen your connection to natural cycles in an urban setting?"
  },
  {
    day: 25,
    title: "Seasonal Meditation",
    theme: "Contemplation",
    prompt: "Spend time in meditation or quiet reflection focusing on the current season. What qualities of this season live within you? How might you embody seasonal energy more fully?"
  },
  {
    day: 26,
    title: "Next Season Preparation",
    theme: "Transition",
    prompt: "What season is approaching next? How might you prepare for this transition? What does your soul need to let go of or embrace as you move into the next seasonal phase?"
  },
  {
    day: 27,
    title: "Seasonal Wisdom",
    theme: "Learning",
    prompt: "What has each season taught you about life, growth, and natural rhythms? How has paying attention to seasonal cycles changed your understanding of yourself and your place in the natural world?"
  },
  {
    day: 28,
    title: "Rhythmic Living",
    theme: "Integration",
    prompt: "How will you continue to align your life with seasonal and natural rhythms? What practices, awareness, or lifestyle changes will help you live more in harmony with the cycles of nature and your own seasonal soul?"
  }
];
export const forgivenessFreedomDays = [
  {
    day: 1,
    title: "Understanding Forgiveness",
    theme: "Definition",
    prompt: "What does forgiveness mean to you? Explore your beliefs about forgiveness - is it about excusing behavior, letting people off the hook, or something else entirely? How has your understanding of forgiveness been shaped?"
  },
  {
    day: 2,
    title: "Resentment Inventory",
    theme: "Assessment",
    prompt: "Make an honest inventory of resentments you carry. Who or what are you angry at? Include people, institutions, situations, and even yourself. Notice the weight of these resentments without trying to fix anything yet."
  },
  {
    day: 3,
    title: "The Cost of Resentment",
    theme: "Impact",
    prompt: "How does holding resentment affect your daily life? Consider the mental, emotional, physical, and spiritual costs. How does resentment influence your relationships, energy, and overall wellbeing?"
  },
  {
    day: 4,
    title: "Resentment Origins",
    theme: "Understanding",
    prompt: "Choose one significant resentment and explore its origins. What happened? What needs weren't met? What boundaries were crossed? What did this experience teach you about trust, safety, or relationships?"
  },
  {
    day: 5,
    title: "The Story We Tell",
    theme: "Narrative",
    prompt: "What story do you tell yourself about this hurt? How might this narrative be both protecting and imprisoning you? What would change if you could see this situation from multiple perspectives?"
  },
  {
    day: 6,
    title: "Grief and Loss",
    theme: "Mourning",
    prompt: "What did you lose in the situation that created your resentment? Consider lost trust, innocence, relationships, or dreams. Allow yourself to feel the grief of these losses without rushing to forgiveness."
  },
  {
    day: 7,
    title: "Self-Forgiveness",
    theme: "Inner Healing",
    prompt: "What do you need to forgive yourself for? Consider your actions, reactions, or perceived failures related to this situation. How might self-compassion be the foundation for forgiving others?"
  },
  {
    day: 8,
    title: "Boundaries and Protection",
    theme: "Safety",
    prompt: "How can you protect yourself going forward? Forgiveness doesn't mean removing boundaries or making yourself vulnerable again. What boundaries would help you feel safe while still opening your heart?"
  },
  {
    day: 9,
    title: "The Other's Humanity",
    theme: "Perspective",
    prompt: "Consider the person who hurt you as a whole human being. What pain, fear, or limitation might have driven their behavior? This doesn't excuse harm, but might offer understanding that serves your freedom."
  },
  {
    day: 10,
    title: "Forgiveness as Process",
    theme: "Journey",
    prompt: "Forgiveness is rarely a one-time event. What would it look like to approach forgiveness as an ongoing process rather than a destination? How might you be patient with yourself in this journey?"
  },
  {
    day: 11,
    title: "Releasing Expectations",
    theme: "Letting Go",
    prompt: "What expectations do you hold about apologies, acknowledgment, or change from those who hurt you? How might releasing these expectations free you from waiting for others to give you peace?"
  },
  {
    day: 12,
    title: "Forgiveness Practices",
    theme: "Methods",
    prompt: "What practices might support your forgiveness journey? Consider meditation, prayer, letter writing (not sending), ritual, or therapy. What approaches feel authentic and supportive for you?"
  },
  {
    day: 13,
    title: "Small Steps Forward",
    theme: "Progress",
    prompt: "What small step toward forgiveness feels possible today? This might be releasing one resentful thought, sending loving thoughts, or simply being willing to be willing to forgive. Honor where you are."
  },
  {
    day: 14,
    title: "Forgiveness and Justice",
    theme: "Balance",
    prompt: "How do you balance forgiveness with justice or accountability? Can you forgive while still believing that wrong actions have consequences? How might forgiveness and justice coexist?"
  },
  {
    day: 15,
    title: "The Gifts of Pain",
    theme: "Growth",
    prompt: "What gifts have emerged from your painful experiences? Consider wisdom, compassion, strength, or clarity that wouldn't exist without these challenges. How has hurt contributed to your growth?"
  },
  {
    day: 16,
    title: "Opening the Heart",
    theme: "Vulnerability",
    prompt: "What would it feel like to hold this situation with an open heart? Not naive or unprotected, but open to love, compassion, and possibility. What shifts when your heart isn't closed by resentment?"
  },
  {
    day: 17,
    title: "Freedom Declaration",
    theme: "Liberation",
    prompt: "Write yourself a declaration of freedom from the resentments you're ready to release. What are you choosing to let go of? What are you opening up to? How will you live differently from this place of greater freedom?"
  }
];

// 7. LIFE TRANSITIONS NAVIGATOR - 21-day change guidance
export const lifeTransitionsNavigatorDays = [
  {
    day: 1,
    title: "Transition Recognition",
    theme: "Awareness",
    prompt: "What transition are you currently experiencing or anticipating? Consider endings, beginnings, career changes, relationship shifts, life stages, or internal transformations. How do you know you're in transition?"
  },
  {
    day: 2,
    title: "The Neutral Zone",
    theme: "In-Between",
    prompt: "Transitions often include a 'neutral zone' - the uncomfortable space between what was and what's coming. What does this in-between space feel like for you? How might you navigate uncertainty with more grace?"
  },
  {
    day: 3,
    title: "What's Ending",
    theme: "Closure",
    prompt: "What chapter of your life is ending or needs to end? What are you leaving behind - roles, relationships, identities, or ways of being? What feelings arise as you consider these endings?"
  },
  {
    day: 4,
    title: "Grief and Loss",
    theme: "Mourning",
    prompt: "What are you losing in this transition? Even positive changes involve loss - of familiarity, identity, or security. Allow yourself to feel sadness for what's passing away without rushing to the positive."
  },
  {
    day: 5,
    title: "Transition Fears",
    theme: "Anxiety",
    prompt: "What fears arise around this transition? Consider fears about failure, success, change, or the unknown. Which fears might be realistic preparation, and which might be anxiety that limits you?"
  },
  {
    day: 6,
    title: "Past Transitions",
    theme: "Experience",
    prompt: "Reflect on significant transitions you've navigated before. What helped you through previous changes? What patterns do you notice in how you handle transition? What wisdom can you draw from past experience?"
  },
  {
    day: 7,
    title: "Identity Shifts",
    theme: "Self-Concept",
    prompt: "How is your sense of identity shifting through this transition? What aspects of yourself are you discovering, developing, or letting go of? Who are you becoming in this process of change?"
  },
  {
    day: 8,
    title: "Support Systems",
    theme: "Connection",
    prompt: "Who and what supports you during times of change? Consider people, practices, beliefs, or resources that provide stability and encouragement. How might you activate or strengthen your support network?"
  },
  {
    day: 9,
    title: "Values Compass",
    theme: "Direction",
    prompt: "How can your core values guide you through this transition? What values are most important to honor during times of change? How might staying connected to your values provide direction in uncertainty?"
  },
  {
    day: 10,
    title: "Resistance and Flow",
    theme: "Acceptance",
    prompt: "Where are you resisting this transition, and where are you flowing with it? What happens when you fight change versus when you work with it? How might acceptance transform your experience of transition?"
  },
  {
    day: 11,
    title: "New Beginnings",
    theme: "Emergence",
    prompt: "What wants to be born through this transition? What new aspects of yourself, new directions, or new possibilities are emerging? What excites you about what might be coming?"
  },
  {
    day: 12,
    title: "Transition Rituals",
    theme: "Ceremony",
    prompt: "What rituals might help you navigate this transition? Consider ceremonies to honor endings, mark the journey, or celebrate new beginnings. How might ritual provide meaning and support during change?"
  },
  {
    day: 13,
    title: "Learning and Growth",
    theme: "Development",
    prompt: "What is this transition teaching you? Consider insights about yourself, life, or what matters most. How is this change contributing to your growth and development as a person?"
  },
  {
    day: 14,
    title: "Patience with Process",
    theme: "Timing",
    prompt: "Transitions have their own timing and can't be rushed. How might you cultivate patience with the process of change? What would it look like to trust the unfolding of your transition journey?"
  },
  {
    day: 15,
    title: "External Changes",
    theme: "Environment",
    prompt: "What external changes are required or would support your transition? Consider living situation, work environment, relationships, or daily routines. What outer changes would align with your inner transformation?"
  },
  {
    day: 16,
    title: "Skills and Capacities",
    theme: "Development",
    prompt: "What new skills, capacities, or ways of being do you need to develop for this new chapter? What qualities would serve you well in your emerging life? How might you cultivate these capabilities?"
  },
  {
    day: 17,
    title: "Meaning Making",
    theme: "Purpose",
    prompt: "What meaning do you make of this transition? How does this change fit into your larger life story and purpose? How might this transition be serving your growth and authentic expression?"
  },
  {
    day: 18,
    title: "Future Visioning",
    theme: "Aspiration",
    prompt: "What vision draws you forward through this transition? What do you hope to create, become, or experience on the other side of this change? Let yourself dream into the possibilities ahead."
  },
  {
    day: 19,
    title: "Practical Planning",
    theme: "Strategy",
    prompt: "What practical steps will support your transition? Consider timelines, resources, preparations, or actions needed. How can you balance planning with staying open to unexpected possibilities?"
  },
  {
    day: 20,
    title: "Trust and Faith",
    theme: "Confidence",
    prompt: "What helps you trust the process of transition when you can't see the whole path? Consider faith in yourself, in life's unfolding, or in something greater. How do you cultivate trust during uncertainty?"
  },
  {
    day: 21,
    title: "Embracing Change",
    theme: "Integration",
    prompt: "Looking back over this transition exploration, what insights will you carry forward? How has your relationship with change evolved? What commitment will you make to navigating life transitions with wisdom and grace?"
  }
];

// 8. DIGITAL DETOX REFLECTION - 7-day technology mindfulness
export const digitalDetoxReflectionDays = [
  {
    day: 1,
    title: "Digital Awareness Audit",
    theme: "Assessment",
    prompt: "Honestly assess your relationship with technology and digital devices. How much time do you spend on phones, computers, social media, and streaming? When do you reach for devices unconsciously versus intentionally?"
  },
  {
    day: 2,
    title: "Digital Triggers and Habits",
    theme: "Patterns",
    prompt: "What triggers your digital consumption? Consider emotions (boredom, anxiety, loneliness), times of day, or situations that lead to mindless scrolling or device use. What automatic habits have you developed around technology?"
  },
  {
    day: 3,
    title: "Social Media Impact",
    theme: "Social Comparison",
    prompt: "How does social media affect your mood, self-image, and worldview? When does it connect you meaningfully versus when does it trigger comparison, envy, or negative feelings? What would change if you consumed less social content?"
  },
  {
    day: 4,
    title: "Information Overwhelm",
    theme: "Mental Clutter",
    prompt: "How does constant information consumption affect your ability to think clearly, be present, or access your own thoughts? What happens to your creativity and inner wisdom when your mind is constantly filled with external input?"
  },
  {
    day: 5,
    title: "Digital Boundaries Experiment",
    theme: "Limits",
    prompt: "Today, experiment with one digital boundary - perhaps phone-free meals, no devices before bed, or limited social media time. What do you notice about the quality of your attention, relationships, or inner state?"
  },
  {
    day: 6,
    title: "Analog Alternatives",
    theme: "Replacement",
    prompt: "What non-digital activities could replace some of your screen time? Consider reading physical books, having face-to-face conversations, spending time in nature, or creative pursuits. What would you do with freed-up time and attention?"
  },
  {
    day: 7,
    title: "Mindful Technology Use",
    theme: "Integration",
    prompt: "How can you use technology more intentionally going forward? What boundaries, practices, or awareness will help you use devices as tools rather than being used by them? What's your vision for a healthier relationship with technology?"
  }
];

// 9. GRIEF & GROWTH - 30-day loss processing journey
export const griefAndGrowthDays = [
  {
    day: 1,
    title: "Naming Your Loss",
    theme: "Recognition",
    prompt: "What loss are you processing - whether recent or from the past? This might be death, divorce, job loss, health changes, or any significant ending. Gently name what you're grieving without trying to fix or minimize it."
  },
  {
    day: 2,
    title: "Grief's Many Faces",
    theme: "Emotions",
    prompt: "What emotions are present in your grief? Consider sadness, anger, fear, guilt, relief, or numbness. All feelings are valid parts of grief - there's no 'right' way to grieve. What emotions surprise or confuse you?"
  },
  {
    day: 3,
    title: "The Body of Grief",
    theme: "Physical",
    prompt: "How does grief show up in your body? Consider fatigue, tension, appetite changes, or physical sensations. What does your body need during this time? How can you care for your physical self with extra compassion?"
  },
  {
    day: 4,
    title: "What Was Lost",
    theme: "Specificity",
    prompt: "Beyond the primary loss, what else was lost? Consider future plans, daily routines, identity aspects, or sources of meaning that were connected to what you're grieving. Acknowledge the multiple layers of loss."
  },
  {
    day: 5,
    title: "Memories and Stories",
    theme: "Remembrance",
    prompt: "What memories of what you've lost bring you comfort? What stories capture the essence of what made this person, relationship, or situation precious? How might remembering be part of your healing?"
  },
  {
    day: 6,
    title: "Guilt and Regret",
    theme: "Self-Compassion",
    prompt: "What guilt or regret accompanies your loss? Consider things left unsaid, done differently, or wishes about the past. Can you offer yourself compassion for being human and imperfect in relationships and situations?"
  },
  {
    day: 7,
    title: "Anger in Grief",
    theme: "Difficult Emotions",
    prompt: "What anger is present in your grief? Anger at the person/situation, at yourself, at life's unfairness, or at others' responses? How might acknowledging anger be part of honoring your loss rather than being disloyal?"
  },
  {
    day: 8,
    title: "Support and Isolation",
    theme: "Connection",
    prompt: "How has your loss affected your relationships? Who provides support, and who feels absent or unhelpful? What do you need from others, and how might you communicate these needs or find additional support?"
  },
  {
    day: 9,
    title: "Grief Waves",
    theme: "Process",
    prompt: "Grief often comes in waves - sometimes manageable, sometimes overwhelming. What have you noticed about your grief patterns? What helps you ride the waves without being knocked over by them?"
  },
  {
    day: 10,
    title: "Meaning Making",
    theme: "Purpose",
    prompt: "How do you make meaning of your loss? What beliefs, spirituality, or philosophy help or hinder your processing? How might you find purpose or meaning within or despite your grief?"
  },
  {
    day: 11,
    title: "Continuing Bonds",
    theme: "Connection",
    prompt: "If your loss involves someone who died, how do you maintain connection with them? If it's another type of loss, what from the past do you want to carry forward? How might love continue despite physical absence?"
  },
  {
    day: 12,
    title: "Rituals and Ceremonies",
    theme: "Honoring",
    prompt: "What rituals might honor your loss and support your grieving process? Consider formal ceremonies, personal practices, or memorial activities that help you process and remember meaningfully."
  },
  {
    day: 13,
    title: "Accepting Support",
    theme: "Receiving",
    prompt: "What makes it difficult to accept help during grief? How might allowing others to support you be a gift to them as well as to you? What would make receiving support feel safer or more comfortable?"
  },
  {
    day: 14,
    title: "Grief's Gifts",
    theme: "Transformation",
    prompt: "What unexpected gifts has grief brought - perhaps deeper compassion, clarity about what matters, or appreciation for life's preciousness? How has loss changed your perspective or priorities?"
  },
  {
    day: 15,
    title: "Identity After Loss",
    theme: "Self-Concept",
    prompt: "How has your sense of identity shifted through this loss? What roles, self-concepts, or ways of being have changed? Who are you becoming as you integrate this experience into your life story?"
  },
  {
    day: 16,
    title: "Others' Discomfort",
    theme: "Social Navigation",
    prompt: "How do others respond to your grief, and how does this affect you? Consider both helpful and unhelpful responses. How might you navigate others' discomfort with loss while still honoring your own process?"
  },
  {
    day: 17,
    title: "Complicated Relationships",
    theme: "Ambivalence",
    prompt: "If your loss involves a complicated relationship, how do you grieve someone or something that brought both joy and pain? How do you process mixed feelings about what you've lost?"
  },
  {
    day: 18,
    title: "Seasonal Grief",
    theme: "Cycles",
    prompt: "How do anniversaries, holidays, or seasonal changes affect your grief? What times feel particularly difficult or meaningful? How might you prepare for and navigate these challenging periods?"
  },
  {
    day: 19,
    title: "Future Without",
    theme: "Reimagining",
    prompt: "What does your future look like without what you've lost? How do you rebuild dreams and plans? What would it look like to move forward while still honoring what you've lost?"
  },
  {
    day: 20,
    title: "Small Steps Forward",
    theme: "Progress",
    prompt: "What small steps toward healing feel possible? This might be tiny actions, gentle self-care, or moments of engagement with life. How can you honor both your need to grieve and your capacity for healing?"
  },
  {
    day: 21,
    title: "Joy and Guilt",
    theme: "Mixed Emotions",
    prompt: "When moments of joy or laughter arise during grief, what emotions follow? Can you allow happiness without feeling guilty or disloyal? How might joy and grief coexist rather than compete?"
  },
  {
    day: 22,
    title: "Professional Help",
    theme: "Resources",
    prompt: "When might professional support be helpful in grief? Consider therapy, support groups, or counseling. What would make seeking help feel empowering rather than weak? What additional resources might serve your healing?"
  },
  {
    day: 23,
    title: "Patience with Process",
    theme: "Timing",
    prompt: "Grief has its own timeline that can't be rushed or scheduled. How might you cultivate patience with your own process? What would it look like to trust that healing unfolds in its own time?"
  },
  {
    day: 24,
    title: "Legacy and Impact",
    theme: "Continuation",
    prompt: "What legacy does your loss leave - in you, in others, or in the world? How has what you've lost contributed to who you are or what you value? How might you honor this impact going forward?"
  },
  {
    day: 25,
    title: "Compassion Practice",
    theme: "Self-Kindness",
    prompt: "How can you extend more compassion to yourself in grief? What would you tell a dear friend going through similar loss? How might self-compassion accelerate rather than hinder your healing?"
  },
  {
    day: 26,
    title: "Creative Expression",
    theme: "Art and Grief",
    prompt: "How might creative expression support your grief processing? Consider writing, art, music, movement, or any form of creativity that helps you explore and express your loss."
  },
  {
    day: 27,
    title: "Wisdom from Loss",
    theme: "Learning",
    prompt: "What wisdom have you gained through this loss that you might not have learned otherwise? How has grief been a teacher, even if an unwelcome one? What insights will you carry forward?"
  },
  {
    day: 28,
    title: "Post-Traumatic Growth",
    theme: "Resilience",
    prompt: "In what ways have you grown stronger, wiser, or more compassionate through your loss? How has grief revealed capacities you didn't know you had? What strengths have emerged from your pain?"
  },
  {
    day: 29,
    title: "Helping Others",
    theme: "Service",
    prompt: "How might your experience with loss enable you to support others in grief? What understanding or compassion has your loss given you that could serve others facing similar challenges?"
  },
  {
    day: 30,
    title: "Integration and Moving Forward",
    theme: "Wholeness",
    prompt: "How will you carry this loss as part of your wholeness rather than as something that defines or limits you? What does 'moving forward' mean to you? How will you honor both your loss and your capacity for continued growth and joy?"
  }
];

// 10. COURAGE CULTIVATION - 12-day bravery building
export const courageCultivationDays = [
  {
    day: 1,
    title: "Defining Courage",
    theme: "Understanding",
    prompt: "What does courage mean to you? How do you distinguish between courage and fearlessness? Consider times when you've acted courageously - what enabled you to move through fear rather than being stopped by it?"
  },
  {
    day: 2,
    title: "Fear Inventory",
    theme: "Assessment",
    prompt: "What fears currently limit your life choices or self-expression? Consider fears about failure, success, judgment, rejection, or change. Which fears serve to protect you, and which primarily restrict your growth?"
  },
  {
    day: 3,
    title: "Courage Role Models",
    theme: "Inspiration",
    prompt: "Who do you admire for their courage? This might be public figures, personal acquaintances, or characters from stories. What specific qualities do they embody? How might you cultivate similar courage in your own life?"
  },
  {
    day: 4,
    title: "Small Acts of Bravery",
    theme: "Daily Courage",
    prompt: "What small acts of courage could you practice today? Consider speaking up in a meeting, having a difficult conversation, trying something new, or expressing your authentic self. Start with manageable courage-building actions."
  },
  {
    day: 5,
    title: "Fear and Excitement",
    theme: "Reframing",
    prompt: "How might fear and excitement be physiologically similar? Consider situations where you've felt both fearful and excited. How might reframing fear as excitement change your relationship with challenging situations?"
  },
  {
    day: 6,
    title: "Courage in Vulnerability",
    theme: "Openness",
    prompt: "When has being vulnerable required courage from you? Consider times you've shared struggles, asked for help, or showed your true self. How might vulnerability be one of the highest forms of courage?"
  },
  {
    day: 7,
    title: "Physical Courage",
    theme: "Embodiment",
    prompt: "How does courage show up in your body? Consider posture, breathing, or physical sensations when you're being brave versus when you're held back by fear. What physical practices might support your courage?"
  },
  {
    day: 8,
    title: "Moral Courage",
    theme: "Values",
    prompt: "When have you needed moral courage to stand up for your values or what's right? What makes it difficult to speak or act when you see injustice or behavior that conflicts with your values? How might you strengthen your moral courage?"
  },
  {
    day: 9,
    title: "Courage and Failure",
    theme: "Risk Taking",
    prompt: "How does fear of failure inhibit your courage? What would change if you saw failure as information rather than evidence of inadequacy? How might reframing failure expand your willingness to take brave actions?"
  },
  {
    day: 10,
    title: "Creative Courage",
    theme: "Expression",
    prompt: "What would you create, express, or share if you weren't afraid of judgment? How might courage be essential for authentic creative expression? What creative risks are calling to you but feel scary to take?"
  },
  {
    day: 11,
    title: "Courage Support System",
    theme: "Community",
    prompt: "Who in your life supports your courage? How might you cultivate relationships with people who encourage your bravery rather than your fears? What communities or groups might support your courage-building journey?"
  },
  {
    day: 12,
    title: "Courage Practice",
    theme: "Integration",
    prompt: "How will you continue cultivating courage in your daily life? What specific practices, reminders, or commitments will help you choose bravery over comfort? What courageous action will you take this week as a celebration of your growing courage?"
  }
];

export const visualMeditationDays = [
  {
    day: 1,
    title: "Breathing Circles",
    theme: "Foundation",
    prompt: "Draw simple circles while focusing on your breath. Let each circle represent one breath cycle. Don't worry about perfection - focus on the meditative rhythm of creation. How does your breathing affect your drawing?"
  },
  {
    day: 2,
    title: "Color and Emotion Flow",
    theme: "Emotion",
    prompt: "Choose colors based on your current emotional state. Let the colors flow across the page without predetermined shapes. What emotions emerge through color? How do different hues make you feel?"
  },
  {
    day: 3,
    title: "Mindful Line Meditation",
    theme: "Lines",
    prompt: "Draw continuous lines without lifting your pen or pencil. Follow your intuition - curves, spirals, zigzags. Let the line be your meditation. Notice when your mind wanders and gently return to the line."
  },
  {
    day: 4,
    title: "Nature Pattern Observation",
    theme: "Patterns",
    prompt: "Find a natural object (leaf, flower, stone) and draw its patterns mindfully. Focus completely on observation. What details do you notice when you slow down and really see?"
  },
  {
    day: 5,
    title: "Texture Exploration",
    theme: "Texture",
    prompt: "Create different textures using various techniques - dots, cross-hatching, scribbles, smooth areas. Let your hand move meditatively across the page. How does creating texture affect your state of mind?"
  },
  {
    day: 6,
    title: "Shadow and Light Dance",
    theme: "Light",
    prompt: "Focus only on shadows and light in your artwork today. Use shading to create depth and mood. How does working with light and shadow change your perspective on seeing?"
  },
  {
    day: 7,
    title: "Geometric Meditation",
    theme: "Geometry",
    prompt: "Create simple geometric shapes - triangles, squares, circles - arranged in a meditative pattern. Focus on precision and intention with each shape. What sacred geometry speaks to you?"
  },
  {
    day: 8,
    title: "Water Flow Visualization",
    theme: "Flow",
    prompt: "Draw water in any form - rivers, rain, waves, drops. Let your drawing tool flow like water across the page. How can you capture the essence of flow and movement?"
  },
  {
    day: 9,
    title: "Tree of Life Meditation",
    theme: "Growth",
    prompt: "Draw a tree, focusing on its growth from roots to branches. Spend time on each part meditatively. What does this tree represent in your life? How do you connect with its energy?"
  },
  {
    day: 10,
    title: "Mandala Creation",
    theme: "Wholeness",
    prompt: "Create a simple mandala starting from the center and working outward. Let each ring or layer represent something meaningful to you. Focus on symmetry and balance as meditation."
  },
  {
    day: 11,
    title: "Cloud and Sky Contemplation",
    theme: "Space",
    prompt: "Draw clouds and sky, focusing on empty space as much as form. How do you represent vastness and openness? Let your drawing be about space and breathing room."
  },
  {
    day: 12,
    title: "Hand Meditation Study",
    theme: "Presence",
    prompt: "Draw your own hands in detail, staying completely present with each line. Notice the textures, creases, and unique character of your hands. What stories do your hands tell?"
  },
  {
    day: 13,
    title: "Abstract Emotion Release",
    theme: "Release",
    prompt: "Create abstract art to release any emotions you've been holding. Use bold strokes, intense colors, or gentle washes - whatever feels right. Let the artwork be your emotional release valve."
  },
  {
    day: 14,
    title: "Spiral Journey Inward",
    theme: "Journey",
    prompt: "Draw spirals of different sizes and styles. Start from the outside and work inward, or vice versa. Let each spiral be a journey into deeper awareness. What do you discover in the spiral's center?"
  },
  {
    day: 15,
    title: "Peaceful Garden Scene",
    theme: "Peace",
    prompt: "Create a peaceful garden or natural scene that represents tranquility to you. Focus on elements that bring you calm. How does creating peaceful imagery affect your inner state?"
  },
  {
    day: 16,
    title: "Energy and Movement",
    theme: "Energy",
    prompt: "Draw your current energy level and state through dynamic or calm marks. Use quick, energetic strokes or slow, flowing movements. How does your energy express itself visually?"
  },
  {
    day: 17,
    title: "Symbol of Strength",
    theme: "Strength",
    prompt: "Create a symbol or image that represents your inner strength. This could be abstract or representational. What visual elements convey power and resilience to you?"
  },
  {
    day: 18,
    title: "Gratitude Visualization",
    theme: "Gratitude",
    prompt: "Draw something you're grateful for, focusing lovingly on every detail. Let your gratitude flow through your drawing tool. How does gratitude change the way you create?"
  },
  {
    day: 19,
    title: "Moon Phases Meditation",
    theme: "Cycles",
    prompt: "Draw the phases of the moon or create abstract representations of life cycles. Reflect on the rhythms and cycles in your own life. What phases are you experiencing now?"
  },
  {
    day: 20,
    title: "Heart Center Expression",
    theme: "Love",
    prompt: "Create artwork that comes from your heart center - whatever that means to you. Use colors, shapes, and forms that feel loving and open. What does your heart want to express?"
  },
  {
    day: 21,
    title: "Integration and Wholeness",
    theme: "Integration",
    prompt: "Create a final piece that integrates elements from your visual meditation journey. Include symbols, colors, or techniques that have become meaningful to you. How has visual meditation changed your relationship with art and mindfulness?"
  }
];

// 2. SYMBOLIC ART (18 days, Visual, Intermediate)
export const symbolicArtDays = [
  {
    day: 1,
    title: "Personal Symbol Discovery",
    theme: "Discovery",
    prompt: "What symbols naturally draw your attention? Draw symbols that feel meaningful to you - they could be ancient, personal, or completely new. Don't think too hard; let your intuition guide you."
  },
  {
    day: 2,
    title: "Elements Representation",
    theme: "Elements",
    prompt: "Create symbols for the four elements - earth, water, fire, air. How would you visually represent each element's essence? What unique symbols emerge from your personal connection to these forces?"
  },
  {
    day: 3,
    title: "Emotion as Symbol",
    theme: "Emotion",
    prompt: "Choose a strong emotion you've experienced recently and create a symbol for it. How can you distill complex feelings into simple, powerful visual symbols? What shapes and forms capture this emotion's essence?"
  },
  {
    day: 4,
    title: "Life Journey Map",
    theme: "Journey",
    prompt: "Create a symbolic map of your life journey using abstract symbols rather than literal representations. What symbols represent major life events, relationships, or transformations?"
  },
  {
    day: 5,
    title: "Protection and Strength Symbols",
    theme: "Protection",
    prompt: "Design symbols that represent protection, safety, and inner strength for you. These could be inspired by traditional talismans or be completely original. What visual elements make you feel secure and powerful?"
  },
  {
    day: 6,
    title: "Growth and Transformation",
    theme: "Growth",
    prompt: "Create symbols representing growth, change, and transformation. Think about metamorphosis, sprouting, evolution. How do you symbolically represent the process of becoming?"
  },
  {
    day: 7,
    title: "Relationship Dynamics",
    theme: "Relationships",
    prompt: "Develop symbols for different types of relationships in your life - family, friendship, romantic, professional. How do different connections have different energetic signatures that you can represent symbolically?"
  },
  {
    day: 8,
    title: "Dreams and Unconscious Symbols",
    theme: "Dreams",
    prompt: "Recall a recent dream or let your unconscious mind guide you to create symbols that emerge from deeper awareness. What imagery comes up when you let go of conscious control?"
  },
  {
    day: 9,
    title: "Ancient Wisdom Interpretation",
    theme: "Wisdom",
    prompt: "Research an ancient symbol that interests you (Celtic, Egyptian, Eastern, etc.) and create your own interpretation or variation. How can you honor traditional wisdom while making it personally meaningful?"
  },
  {
    day: 10,
    title: "Communication Without Words",
    theme: "Communication",
    prompt: "Create a set of symbols that could communicate important concepts without using any letters or words. How can you develop a personal visual language that others might understand?"
  },
  {
    day: 11,
    title: "Sacred Geometry Exploration",
    theme: "Sacred",
    prompt: "Explore sacred geometric patterns - spirals, mandalas, flower of life patterns. Create your own sacred geometric symbol that feels personally meaningful. What mathematical beauty speaks to your soul?"
  },
  {
    day: 12,
    title: "Animal Spirit Symbols",
    theme: "Animal",
    prompt: "Choose an animal that represents qualities you admire or want to embody. Create an abstract or stylized symbol based on this animal's essence rather than its literal appearance."
  },
  {
    day: 13,
    title: "Seasonal Symbol Cycle",
    theme: "Seasons",
    prompt: "Create symbols representing each season, focusing on their energetic qualities rather than obvious imagery. How do you symbolically capture the essence of spring's renewal or winter's rest?"
  },
  {
    day: 14,
    title: "Personal Power Symbol",
    theme: "Power",
    prompt: "Design a symbol that represents your unique gifts, talents, and personal power. This could become your signature symbol or personal logo. What visual elements capture your essence and strength?"
  },
  {
    day: 15,
    title: "Healing and Restoration",
    theme: "Healing",
    prompt: "Create symbols related to healing, restoration, and renewal. These might be symbols you could use for meditation or to remind yourself of your healing capacity. What imagery supports your well-being?"
  },
  {
    day: 16,
    title: "Connection and Unity",
    theme: "Connection",
    prompt: "Develop symbols that represent connection - to others, to nature, to the universe, to your higher self. How do you visually represent the invisible threads that connect all things?"
  },
  {
    day: 17,
    title: "Future Vision Symbol",
    theme: "Future",
    prompt: "Create a symbol that represents your hopes, dreams, and vision for the future. This symbol should inspire and energize you when you look at it. What imagery calls your future self forward?"
  },
  {
    day: 18,
    title: "Integration: Personal Symbol System",
    theme: "Integration",
    prompt: "Review all the symbols you've created and design a final composition that integrates the most meaningful ones into a personal symbol system or symbolic artwork. How do these symbols work together to tell your story?"
  }
];


export const artisticSoulExpressionDays = [
  {
    day: 1,
    title: "Artistic Awakening",
    theme: "Creative Identity",
    prompt: "Create your first piece without any plan or expectation. Use any medium you have available - pencil, pen, crayons, paint. Let your hand move freely for 10 minutes. What emerges when you don't judge or control the process?"
  },
  {
    day: 2,
    title: "Color of Your Mood",
    theme: "Emotional Palette",
    prompt: "Close your eyes and feel into your current emotional state. What colors represent this feeling? Create a color composition using only these colors - no forms or objects, just pure color interaction. How do the colors speak to each other?"
  },
  {
    day: 3,
    title: "Memory Fragments",
    theme: "Past Expression",
    prompt: "Choose a childhood memory that brings you joy. Don't try to illustrate it literally - instead, capture the essence, feeling, or energy of that memory through shapes, lines, and colors. What textures or patterns emerge?"
  },
  {
    day: 4,
    title: "Inner Critic Dialogue",
    theme: "Creative Blocks",
    prompt: "Draw or paint your inner critic - the voice that says your art isn't good enough. Give it a form, color, shape. Then create a companion piece showing your supportive creative voice. How do these two energies look different on paper?"
  },
  {
    day: 5,
    title: "Stream of Consciousness Art",
    theme: "Intuitive Flow",
    prompt: "Set a timer for 15 minutes. Start drawing or painting without lifting your tool from the paper. Let one mark lead to another in an unbroken flow. Don't think - just respond to what the previous mark suggests. What story unfolds?"
  },
  {
    day: 6,
    title: "Healing Hands",
    theme: "Therapeutic Expression",
    prompt: "Think of something in your life that needs healing - a relationship, a wound, a fear. Create art that represents this healing process. What would transformation look like visually? Use gentle, nurturing marks and colors."
  },
  {
    day: 7,
    title: "Abstract Self-Portrait",
    theme: "Identity Expression",
    prompt: "Create a self-portrait without drawing your physical features. Instead, use colors, shapes, textures, and patterns that represent your personality, energy, and essence. What visual elements capture who you are at your core?"
  },
  {
    day: 8,
    title: "Texture Symphony",
    theme: "Sensory Art",
    prompt: "Focus entirely on texture today. Use cross-hatching, stippling, scribbling, or pressing objects into paint/clay. Create a piece that would be interesting to touch even if you couldn't see it. How does texture convey emotion?"
  },
  {
    day: 9,
    title: "Dream Landscape",
    theme: "Subconscious Imagery",
    prompt: "Create a landscape that exists only in dreams or imagination. It doesn't need to follow the laws of physics or reality. What impossible, magical, or surreal environment speaks to your soul? Let your subconscious guide your hand."
  },
  {
    day: 10,
    title: "Transformation Journey",
    theme: "Personal Growth",
    prompt: "Create a visual representation of your personal growth journey. Show where you've been, where you are now, and where you're heading. Use metaphorical imagery - perhaps a butterfly emerging, a tree growing, or water flowing."
  },
  {
    day: 11,
    title: "Sacred Symbols",
    theme: "Spiritual Expression",
    prompt: "What symbols feel sacred or meaningful to you? They might be from your spiritual tradition, nature, or purely personal. Create art incorporating these symbols, focusing on their deeper meaning rather than their literal appearance."
  },
  {
    day: 12,
    title: "Joy Explosion",
    theme: "Celebration",
    prompt: "Create art that celebrates pure joy and aliveness. Use bright colors, dynamic movement, or whatever visual language represents celebration to you. Don't hold back - let this piece be exuberant and unrestrained."
  },
  {
    day: 13,
    title: "Integration Mandala",
    theme: "Wholeness",
    prompt: "Create a mandala (circular design) that represents the integration of all aspects of yourself - light and shadow, strength and vulnerability, chaos and order. Work from the center outward, adding layers that represent different parts of your being."
  },
  {
    day: 14,
    title: "Artistic Soul Celebration",
    theme: "Creative Identity",
    prompt: "Looking back at all your creations from this journey, what do you notice about your unique artistic voice? Create one final piece that celebrates your creative soul and incorporates elements that feel most authentically 'you' from this exploration."
  }
];

export const colorPsychologyJourneyDays = [
  {
    day: 1,
    title: "Color Intuition",
    theme: "Awareness",
    prompt: "Without thinking, choose 3 colors that represent how you feel today. Paint or draw with only these colors for 15 minutes. What emotions or memories do these colors evoke? How do they interact with each other?"
  },
  {
    day: 2,
    title: "Red Exploration",
    theme: "Energy",
    prompt: "Work exclusively with shades of red today - crimson, scarlet, burgundy, pink. How does this color affect your energy and mood as you create? What aspects of yourself does red represent or awaken?"
  },
  {
    day: 3,
    title: "Blue Depths",
    theme: "Calm",
    prompt: "Dive into the world of blues - navy, sky, cerulean, teal. Create something that explores the emotional range of blue. What feelings does blue evoke? How does it affect your breathing and mental state?"
  },
  {
    day: 4,
    title: "Yellow Sunshine",
    theme: "Joy",
    prompt: "Explore yellows in all their forms - lemon, gold, ochre, cream. Let yellow guide your creation today. What does yellow teach you about optimism, creativity, and inner light?"
  },
  {
    day: 5,
    title: "Green Growth",
    theme: "Nature",
    prompt: "Work with the full spectrum of greens - forest, lime, sage, olive. How does green connect you to growth, healing, and the natural world? What emerges when you let green lead?"
  },
  {
    day: 6,
    title: "Purple Royalty",
    theme: "Mystery",
    prompt: "Explore purples and violets - lavender, plum, indigo, magenta. What does purple reveal about mystery, spirituality, and transformation in your life? How does this color make you feel?"
  },
  {
    day: 7,
    title: "Orange Enthusiasm",
    theme: "Vitality",
    prompt: "Create with oranges - tangerine, peach, amber, coral. How does orange energy show up in your artwork? What does this color teach you about enthusiasm and creative fire?"
  },
  {
    day: 8,
    title: "Black & White Contrast",
    theme: "Drama",
    prompt: "Work only in black and white today. Explore contrast, shadows, and light. What emotions arise when color is removed? What do you discover about form, texture, and drama?"
  },
  {
    day: 9,
    title: "Warm Color Symphony",
    theme: "Heat",
    prompt: "Combine reds, oranges, and yellows. Create a warm color composition that explores passion, energy, and fire. How do warm colors interact? What feelings do they generate together?"
  },
  {
    day: 10,
    title: "Cool Color Harmony",
    theme: "Serenity",
    prompt: "Work with blues, greens, and purples. Create a cool color piece that explores peace, depth, and tranquility. How do cool colors support each other? What calm do they bring?"
  },
  {
    day: 11,
    title: "Monochromatic Study",
    theme: "Subtlety",
    prompt: "Choose one color and explore all its possible variations - tints, shades, and tones. How many different emotions can one color express? What subtleties emerge in monochromatic work?"
  },
  {
    day: 12,
    title: "Complementary Tension",
    theme: "Opposition",
    prompt: "Work with complementary colors - red/green, blue/orange, or yellow/purple. How do opposite colors create tension and vibrancy? What energy emerges from this color relationship?"
  },
  {
    day: 13,
    title: "Analogous Comfort",
    theme: "Harmony",
    prompt: "Use analogous colors (neighbors on the color wheel). Create something that explores the comfort and harmony of related colors. How do similar colors create unity and flow?"
  },
  {
    day: 14,
    title: "Triadic Balance",
    theme: "Vibrancy",
    prompt: "Work with three colors equally spaced on the color wheel. Explore how these colors balance and energize each other. What dynamic relationships emerge from triadic color schemes?"
  },
  {
    day: 15,
    title: "Emotional Color Mapping",
    theme: "Feelings",
    prompt: "Create a visual map of your current emotional landscape using color. What colors represent your different feelings? How do they relate to each other spatially and energetically?"
  },
  {
    day: 16,
    title: "Memory Colors",
    theme: "Past",
    prompt: "What colors are connected to your most precious memories? Create art that explores these memory-colors. How do certain hues transport you to specific times and places?"
  },
  {
    day: 17,
    title: "Seasonal Colors",
    theme: "Cycles",
    prompt: "Explore the colors of your current season or a season that calls to you. How do seasonal colors reflect natural rhythms and inner states? What season lives in your soul right now?"
  },
  {
    day: 18,
    title: "Cultural Color Stories",
    theme: "Heritage",
    prompt: "Explore colors that have cultural significance for you or that you're drawn to from other cultures. What stories do these colors tell? How do they connect you to larger human experiences?"
  },
  {
    day: 19,
    title: "Healing Colors",
    theme: "Wellness",
    prompt: "What colors feel healing or nurturing to you right now? Create art focused on colors that support your wellbeing. How might color be medicine for your soul?"
  },
  {
    day: 20,
    title: "Future Color Vision",
    theme: "Aspiration",
    prompt: "What colors represent your hopes and dreams for the future? Create a color composition that embodies your aspirations. How do these colors inspire and motivate you?"
  },
  {
    day: 21,
    title: "Personal Color Palette",
    theme: "Integration",
    prompt: "Based on your 21-day color journey, create your personal color palette - the colors that most authentically represent your emotional signature and artistic voice. What is your unique color language?"
  }
];

// 12. SACRED GEOMETRY SOUL - 14-day spiritual pattern creation
export const sacredGeometrySoulDays = [
  {
    day: 1,
    title: "Circle Meditation",
    theme: "Wholeness",
    prompt: "Begin with a simple circle in the center of your page. Spend 20 minutes slowly adding patterns, shapes, and colors radiating from the center outward. What emerges when you work from your center? How does the circle represent completeness?"
  },
  {
    day: 2,
    title: "Triangle Power",
    theme: "Direction",
    prompt: "Explore triangular forms in your art today. Create compositions based on triangles of different sizes and orientations. How do triangles direct energy and attention? What do they represent about stability and aspiration?"
  },
  {
    day: 3,
    title: "Square Foundation",
    theme: "Stability",
    prompt: "Work with squares and rectangles as your foundation. How do these four-sided forms create structure and stability in your artwork? What do they teach you about grounding and material reality?"
  },
  {
    day: 4,
    title: "Pentagon Harmony",
    theme: "Balance",
    prompt: "Explore five-sided forms and pentagonal patterns. Research the golden ratio within pentagons. How does the number five show up in nature and in your creative expression? What harmony does it create?"
  },
  {
    day: 5,
    title: "Hexagon Network",
    theme: "Connection",
    prompt: "Create with hexagonal patterns - think honeycomb, crystals, and molecular structures. How do six-sided forms connect and tessellate? What do they teach you about community and natural efficiency?"
  },
  {
    day: 6,
    title: "Spiral Journey",
    theme: "Growth",
    prompt: "Draw or paint spirals in various forms - Fibonacci spirals, galaxies, shells, DNA helixes. Follow their curves and see where they lead your creativity. What do spirals teach about growth, time, and life cycles?"
  },
  {
    day: 7,
    title: "Mandala Creation",
    theme: "Centering",
    prompt: "Create a traditional mandala starting from the center and working outward in symmetrical patterns. As you add each section, set an intention or focus on a quality you wish to cultivate (peace, strength, love, etc.)."
  },
  {
    day: 8,
    title: "Flower of Life",
    theme: "Sacred Pattern",
    prompt: "Study and create your version of the Flower of Life pattern - overlapping circles that form a geometric flower. What does this ancient symbol teach you about interconnection and the geometry of creation?"
  },
  {
    day: 9,
    title: "Golden Ratio Art",
    theme: "Divine Proportion",
    prompt: "Incorporate the golden ratio (1.618...) into your artwork. Use the golden spiral or golden rectangle as guides. How does this divine proportion appear in your creative work and in nature around you?"
  },
  {
    day: 10,
    title: "Platonic Solids",
    theme: "Elemental Forms",
    prompt: "Draw or paint representations of the five Platonic solids (tetrahedron, cube, octahedron, dodecahedron, icosahedron). Each was associated with an element by ancient philosophers. Which resonates with you?"
  },
  {
    day: 11,
    title: "Vesica Piscis",
    theme: "Intersection",
    prompt: "Explore the vesica piscis - the lens shape created when two circles intersect. This form appears in religious art and represents the intersection of heaven and earth. What intersections in your life need honoring?"
  },
  {
    day: 12,
    title: "Fractal Patterns",
    theme: "Infinite Repetition",
    prompt: "Create fractal-inspired art where patterns repeat at different scales. Think tree branches, lightning, coastlines, blood vessels. How do self-similar patterns reflect the nature of reality?"
  },
  {
    day: 13,
    title: "Personal Sacred Symbol",
    theme: "Individual Meaning",
    prompt: "Design your own sacred geometric symbol that represents your spiritual journey or core beliefs. Combine elements that speak to your soul. What geometric forms most resonate with your inner truth?"
  },
  {
    day: 14,
    title: "Sacred Integration",
    theme: "Harmony",
    prompt: "Create a final piece that combines geometric forms that have resonated with you throughout this journey. How do these shapes work together to create harmony, balance, and sacred beauty? What has geometry taught you about the divine order?"
  }
];

// 13. NATURE SKETCHING SANCTUARY - 10-day outdoor observation drawing
export const natureSketchingSanctuaryDays = [
  {
    day: 1,
    title: "Outdoor Awareness",
    theme: "Presence",
    prompt: "Find a natural outdoor space and sit quietly for 10 minutes before drawing. Notice what captures your attention - textures, light, movement, forms. Begin with simple observational sketches of whatever draws your eye."
  },
  {
    day: 2,
    title: "Tree Portraits",
    theme: "Structure",
    prompt: "Choose a tree and spend time really seeing its unique character. Sketch its overall form, then focus on details - bark texture, leaf patterns, branch relationships. What personality does this tree express?"
  },
  {
    day: 3,
    title: "Sky Studies",
    theme: "Atmosphere",
    prompt: "Look up and sketch cloud formations, the quality of light, weather patterns. How do you capture something as ephemeral as sky? What do you notice about light, shadow, and atmospheric perspective?"
  },
  {
    day: 4,
    title: "Ground Textures",
    theme: "Foundation",
    prompt: "Focus on what's beneath your feet - grass, rocks, soil, fallen leaves. Sketch different ground textures and patterns. How do you represent the varied surfaces that form nature's foundation?"
  },
  {
    day: 5,
    title: "Water in Motion",
    theme: "Flow",
    prompt: "If possible, find moving water - a stream, fountain, or even puddles in rain. How do you sketch something that's constantly changing? What techniques capture the essence of water's movement and reflection?"
  },
  {
    day: 6,
    title: "Botanical Details",
    theme: "Intimacy",
    prompt: "Get close to plants - examine flower structures, leaf arrangements, seed pods, or fruit. Create detailed botanical studies that capture both accuracy and the life force within plants."
  },
  {
    day: 7,
    title: "Wildlife Observation",
    theme: "Animation",
    prompt: "Sketch any wildlife you encounter - birds, insects, squirrels, cats. Even if they move quickly, practice capturing their essential forms and movements. What do you learn about drawing life in motion?"
  },
  {
    day: 8,
    title: "Landscape Composition",
    theme: "Perspective",
    prompt: "Create a broader landscape sketch that shows depth and space. Consider foreground, middle ground, and background. How do you organize complex natural scenes into compelling compositions?"
  },
  {
    day: 9,
    title: "Seasonal Characteristics",
    theme: "Time",
    prompt: "Focus on what makes this season unique in your environment - specific colors, plant states, weather qualities, light characteristics. How do you capture the temporal essence of now?"
  },
  {
    day: 10,
    title: "Nature Integration",
    theme: "Connection",
    prompt: "Create a final piece that combines elements from your week of nature observation. How has this focused attention to the natural world affected your seeing and your connection to the environment around you?"
  }
];

// 14. ABSTRACT EMOTIONS - 12-day non-representational expression
export const abstractEmotionsDays = [
  {
    day: 1,
    title: "Pure Feeling",
    theme: "Raw Expression",
    prompt: "Without planning or thinking about recognizable forms, create art that expresses your current emotional state using only colors, shapes, lines, and textures. Let your feelings move through your hand onto the page."
  },
  {
    day: 2,
    title: "Joy Abstraction",
    theme: "Happiness",
    prompt: "How would joy look if it weren't a face or a scene? Use abstract elements - maybe dancing lines, bright explosions of color, or flowing forms - to express the essence of joy without literal representation."
  },
  {
    day: 3,
    title: "Anger Energy",
    theme: "Intensity",
    prompt: "Express anger or frustration through abstract forms. What shapes, colors, and movements capture the energy of anger? How can you release this emotion safely through non-representational art?"
  },
  {
    day: 4,
    title: "Sadness Depth",
    theme: "Melancholy",
    prompt: "Create an abstract representation of sadness or melancholy. What colors, textures, or forms express the weight and depth of sorrow? How do you make visible something so internal?"
  },
  {
    day: 5,
    title: "Fear Fragments",
    theme: "Anxiety",
    prompt: "Express fear or anxiety through abstract elements. Consider jagged lines, unsettling color combinations, fragmented forms, or whatever emerges when you let fear speak through your art without censorship."
  },
  {
    day: 6,
    title: "Love Flowing",
    theme: "Connection",
    prompt: "How would love look in abstract form? Explore flowing lines, warm colors, embracing shapes, or whatever forms emerge when you let love express itself non-literally through your creative process."
  },
  {
    day: 7,
    title: "Confusion Chaos",
    theme: "Uncertainty",
    prompt: "Express confusion or feeling overwhelmed through abstract art. What happens when you let chaos and uncertainty guide your creative process? How do you find beauty in confusion?"
  },
  {
    day: 8,
    title: "Peace Simplicity",
    theme: "Calm",
    prompt: "Create abstract art that embodies peace and tranquility. What minimal elements, subtle colors, or gentle forms express serenity? How much can you remove while still conveying peace?"
  },
  {
    day: 9,
    title: "Hope Rising",
    theme: "Aspiration",
    prompt: "Express hope and optimism through abstract forms. What movements, colors, or compositions capture the feeling of hope rising, dreams emerging, or light breaking through darkness?"
  },
  {
    day: 10,
    title: "Complex Emotions",
    theme: "Nuance",
    prompt: "Create art that expresses complex, mixed emotions - bittersweet, nostalgic, or conflicted feelings. How do you show emotional complexity without using recognizable symbols or forms?"
  },
  {
    day: 11,
    title: "Emotional Dialogue",
    theme: "Interaction",
    prompt: "Create abstract art that shows two emotions in conversation or conflict. How do different feelings interact with each other? What happens when joy meets sorrow, or anger meets compassion in abstract form?"
  },
  {
    day: 12,
    title: "Emotional Integration",
    theme: "Wholeness",
    prompt: "Create a final abstract piece that integrates multiple emotions into a unified composition. How do all your feelings work together to create the complex, beautiful whole of your emotional landscape?"
  }
];

// 15. VISUAL STORYTELLING - 15-day narrative art journey
export const visualStorytellingDays = [
  {
    day: 1,
    title: "Single Image Story",
    theme: "Moment",
    prompt: "Tell a complete story in just one image. Choose a significant moment from your life or imagination and capture it visually so that viewers can sense the larger narrative around this moment."
  },
  {
    day: 2,
    title: "Before & After",
    theme: "Change",
    prompt: "Create two images that show a before and after - this could be personal transformation, a day's progression, seasonal change, or any transition that interests you. How do you show change through visual comparison?"
  },
  {
    day: 3,
    title: "Character Creation",
    theme: "Personality",
    prompt: "Develop a character through visual art - this could be a version of yourself, someone you know, or an imaginary being. What visual elements (clothing, posture, environment, symbols) reveal personality and story?"
  },
  {
    day: 4,
    title: "Wordless Comic Strip",
    theme: "Sequence",
    prompt: "Create a 3-6 panel comic strip that tells a story without using any words. How do you convey action, emotion, and narrative progression through images alone? What story emerges through sequence?"
  },
  {
    day: 5,
    title: "Emotional Journey Map",
    theme: "Internal Narrative",
    prompt: "Create a visual map of an emotional journey - perhaps working through a challenge, falling in love, or processing grief. How do you make internal experiences visible through imagery and composition?"
  },
  {
    day: 6,
    title: "Myth & Legend",
    theme: "Archetypal Stories",
    prompt: "Illustrate a scene from a myth, legend, or fairy tale that resonates with you. How do you bring ancient stories into your contemporary artistic voice? What universal themes speak to you?"
  },
  {
    day: 7,
    title: "Family Stories",
    theme: "Heritage",
    prompt: "Tell a story from your family history or cultural background through visual art. This might be a specific event, a tradition, or the essence of your heritage expressed through imagery."
  },
  {
    day: 8,
    title: "Dream Narrative",
    theme: "Subconscious Story",
    prompt: "Create a visual narrative based on a dream - your own or imagined. How do you capture the illogical flow and symbolic nature of dreams while still telling a coherent visual story?"
  },
  {
    day: 9,
    title: "Environmental Story",
    theme: "Place Narrative",
    prompt: "Tell the story of a place - your neighborhood, a natural area, or somewhere meaningful to you. How has this place changed over time? What stories do the walls, trees, or landscape hold?"
  },
  {
    day: 10,
    title: "Symbolic Journey",
    theme: "Metaphor",
    prompt: "Create a visual story using symbols and metaphors rather than literal representation. How might you tell the story of personal growth through the metaphor of a plant, or the story of overcoming challenges through weather imagery?"
  },
  {
    day: 11,
    title: "Future Fiction",
    theme: "Imagination",
    prompt: "Create a visual story set in the future - either your personal future or a broader vision of what's to come. What story do you want to tell about possibility, hope, technology, or human evolution?"
  },
  {
    day: 12,
    title: "Collaborative Story",
    theme: "Multiple Perspectives",
    prompt: "Tell the same story from two different perspectives or create art that invites the viewer to participate in creating the narrative. How do you make your artwork a dialogue rather than a monologue?"
  },
  {
    day: 13,
    title: "Micro-Story",
    theme: "Compression",
    prompt: "Tell a powerful story in the smallest format possible - maybe a tiny sketch, a single panel, or minimal imagery that implies a vast narrative. How much story can you compress into minimal visual space?"
  },
  {
    day: 14,
    title: "Interactive Narrative",
    theme: "Engagement",
    prompt: "Create a visual story that changes based on how someone looks at it - perhaps with hidden elements, multiple reading paths, or imagery that reveals different stories depending on viewing angle or distance."
  },
  {
    day: 15,
    title: "Personal Mythology",
    theme: "Life Story",
    prompt: "Create a visual representation of your personal mythology - the key stories, themes, and narratives that define your life journey. How do you tell the ongoing story of who you are and who you're becoming?"
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
    prompt: "Make your first mark with black ink today - whether with brush, pen, or dip pen. Feel the permanence and confidence required. There's no erasing in ink. What does this teach you about commitment and presence?"
  },
  {
    day: 2,
    title: "Line Liberation",
    theme: "Freedom",
    prompt: "Explore different types of lines - thick, thin, confident, hesitant, curved, straight, broken, continuous. Fill your page with lines that express different emotions and energies. What stories do your lines tell?"
  },
  {
    day: 3,
    title: "Brushstroke Meditation",
    theme: "Flow",
    prompt: "If you have a brush, practice basic brushstrokes inspired by East Asian calligraphy. If not, practice flowing movements with your pen. Focus on the rhythm and meditation of repetitive marks. Let ink become moving meditation."
  },
  {
    day: 4,
    title: "Texture Symphony",
    theme: "Surface",
    prompt: "Using only black ink, create as many different textures as possible - crosshatching, stippling, scribbling, washing. How many ways can you suggest different surfaces using only ink and technique?"
  },
  {
    day: 5,
    title: "Light from Darkness",
    theme: "Contrast",
    prompt: "Work on creating light by leaving areas of paper white and surrounding them with ink. Understand that in ink drawing, you're painting with darkness to reveal light. What emerges from this reverse thinking?"
  },
  {
    day: 6,
    title: "Ink Washes",
    theme: "Water",
    prompt: "Dilute your ink with water to create different tones and washes. Practice controlling wetness and dryness. If you don't have washable ink, practice layering thin lines to create tone. How do you create grays with black ink?"
  },
  {
    day: 7,
    title: "Week One Reflection",
    theme: "Foundation",
    prompt: "Create a piece that incorporates all the techniques you've explored this week - line, texture, contrast, wash. What has working in black ink taught you about focus, simplicity, and essential elements?"
  },

  // WEEK 2: OBSERVATION (Days 8-14)
  {
    day: 8,
    title: "Blind Contour",
    theme: "Seeing",
    prompt: "Practice blind contour drawing with ink - draw objects without looking at your paper. Embrace the wonky, expressive lines that result. What does this teach you about seeing versus drawing from memory?"
  },
  {
    day: 9,
    title: "Still Life Studies",
    theme: "Form",
    prompt: "Set up a simple still life and draw it with ink, focusing on essential forms and shadows. How do you capture three-dimensional form using only black and white? What details are truly necessary?"
  },
  {
    day: 10,
    title: "Portrait Essence",
    theme: "Character",
    prompt: "Draw a portrait - yourself, a loved one, or someone who inspires you. Focus on capturing the essence of the person rather than photographic accuracy. What makes a face recognizable in just a few ink strokes?"
  },
  {
    day: 11,
    title: "Nature Studies",
    theme: "Organic",
    prompt: "Take your ink outdoors or work from natural objects. Draw plants, trees, rocks, or clouds. How does ink work differently when representing organic, irregular forms versus geometric objects?"
  },
  {
    day: 12,
    title: "Architecture & Structure",
    theme: "Built World",
    prompt: "Draw buildings, bridges, or other human-made structures. How do you represent hard edges, perspective, and geometric forms with flowing ink? What's the relationship between natural and constructed environments in your art?"
  },
  {
    day: 13,
    title: "Movement & Gesture",
    theme: "Action",
    prompt: "Capture movement - dancing figures, animals in motion, wind in trees, or flowing water. How do you represent time and movement in a static medium? What gestures capture the essence of motion?"
  },
  {
    day: 14,
    title: "Observational Integration",
    theme: "Seeing Deeply",
    prompt: "Create a complex observational piece that combines multiple elements you've been studying. How has working in ink changed the way you see the world? What do you notice now that you missed before?"
  },

  // WEEK 3: EXPRESSION (Days 15-21)
  {
    day: 15,
    title: "Emotional Landscapes",
    theme: "Inner Terrain",
    prompt: "Create abstract landscapes that represent emotional states rather than real places. How might depression look as a landscape? What about joy or anxiety? Let your inner weather become visible terrain."
  },
  {
    day: 16,
    title: "Memory Fragments",
    theme: "Past",
    prompt: "Illustrate a significant memory using ink. Don't aim for photographic accuracy - capture the feeling, essence, and emotional truth of the memory. What details does your heart remember that your mind might forget?"
  },
  {
    day: 17,
    title: "Dream Visions",
    theme: "Subconscious",
    prompt: "Draw a dream or nightmare with ink. Let the fluid, permanent nature of ink mirror the strange logic and irreversible flow of dreams. What imagery emerges from your sleeping mind?"
  },
  {
    day: 18,
    title: "Shadow Self",
    theme: "Hidden Aspects",
    prompt: "Express aspects of yourself you typically hide or don't show the world. Let ink give form to your shadow self, your fears, or parts of your personality you're still integrating. Approach with curiosity, not judgment."
  },
  {
    day: 19,
    title: "Transformation Stories",
    theme: "Change",
    prompt: "Create art about personal transformation - who you were, who you are, who you're becoming. How do you show internal change through external imagery? What metaphors capture your evolution?"
  },
  {
    day: 20,
    title: "Love Letters in Ink",
    theme: "Affection",
    prompt: "Create ink art as a love letter - to a person, place, activity, or aspect of life you cherish. How do you make ink express tenderness, appreciation, and deep feeling? What does love look like in black and white?"
  },
  {
    day: 21,
    title: "Expressive Integration",
    theme: "Authentic Voice",
    prompt: "Create a piece that feels most authentically 'you' - combining techniques you've learned with subjects and emotions that matter most to you. What is your unique voice in ink beginning to sound like?"
  },

  // WEEK 4: INNOVATION (Days 22-28)
  {
    day: 22,
    title: "Mixed Media Experiments",
    theme: "Combination",
    prompt: "Combine ink with other materials - coffee, tea, salt, soap, or found objects. What happens when you push beyond traditional ink application? What new textures and effects can you discover?"
  },
  {
    day: 23,
    title: "Calligraphy Fusion",
    theme: "Text & Image",
    prompt: "Combine words and images, letting text become visual and visuals become linguistic. Write poetry with brushstrokes, or let letters transform into drawings. How do meaning and aesthetics merge?"
  },
  {
    day: 24,
    title: "Large Scale",
    theme: "Expansion",
    prompt: "Work larger than you have before - use the biggest paper available, or work across multiple sheets. How does scale change your relationship with ink? What emerges when you work with your whole body, not just your wrist?"
  },
  {
    day: 25,
    title: "Miniature Mastery",
    theme: "Precision",
    prompt: "Work extremely small - create detailed ink drawings in tiny formats. What control and focus does this require? How do you maintain expressiveness when working in miniature scale?"
  },
  {
    day: 26,
    title: "Time-Based Ink",
    theme: "Temporal",
    prompt: "Create art that represents time - perhaps a series showing change, or a single piece that captures duration. How do you make time visible through static imagery? What does 'now' look like in ink?"
  },
  {
    day: 27,
    title: "Collaborative Ink",
    theme: "Shared Creation",
    prompt: "If possible, collaborate with someone else on an ink piece, or create something that invites others to add to it. How does ink work as a medium for shared creativity and dialogue?"
  },
  {
    day: 28,
    title: "Innovation Integration",
    theme: "New Techniques",
    prompt: "Combine your most successful experimental techniques into a cohesive piece. What new approaches to ink have you discovered? How might these innovations continue to develop in your future work?"
  },

  // WEEK 5: MASTERY (Days 29-33)
  {
    day: 29,
    title: "Technical Mastery Piece",
    theme: "Skill",
    prompt: "Create your most technically accomplished ink piece - something that demonstrates all the skills you've developed. Push yourself to execute something complex and challenging. What can you accomplish with ink now that you couldn't a month ago?"
  },
  {
    day: 30,
    title: "Emotional Depth Piece",
    theme: "Feeling",
    prompt: "Create your most emotionally resonant piece - something that moves you deeply and expresses your most authentic feelings. How has ink become a language for your deepest self-expression?"
  },
  {
    day: 31,
    title: "Personal Style Manifesto",
    theme: "Voice",
    prompt: "Create a piece that represents your emerging personal style in ink. What characteristics make your ink work recognizably yours? What artistic voice has emerged through this 33-day journey?"
  },
  {
    day: 32,
    title: "Teaching Piece",
    theme: "Sharing Knowledge",
    prompt: "Create an ink piece that demonstrates or teaches a technique you've mastered. How might your artwork help others learn and grow? What wisdom about ink and creativity would you pass on?"
  },
  {
    day: 33,
    title: "Ink & Essence Culmination",
    theme: "Mastery",
    prompt: "Create your masterpiece - a final work that represents the culmination of your 33-day ink journey. This should integrate technical skill, emotional depth, personal style, and creative innovation. What has ink taught you about art, discipline, and authentic expression? How will you continue this practice?"
  }
];

export const freestyleDiscoveryDays = [
  {
    day: 1,
    title: "Today's Mental Weather",
    theme: "Current State",
    prompt: "If your mind was weather today, what would it be? Sunny and clear? Stormy and chaotic? Foggy and uncertain? Describe your mental landscape and what's contributing to today's 'weather.'"
  },
  {
    day: 2,
    title: "Three Things Right Now",
    theme: "Present Moment",
    prompt: "Write about three things: something that's exciting you, something that's bothering you, and something you're grateful for right now. Don't overthink it - just let your thoughts flow."
  },
  {
    day: 3,
    title: "If I Could Tell Someone...",
    theme: "Unexpressed Thoughts",
    prompt: "If you could tell someone something you've been keeping to yourself, what would it be? Write as if you're having an honest conversation with a trusted friend who just asked 'What's really going on?'"
  },
  {
    day: 4,
    title: "Energy & Motivation Check",
    theme: "Inner Resources",
    prompt: "How are your energy levels lately? What's draining you? What's giving you life? Write about the push and pull of your current motivation and what you need more (or less) of."
  },
  {
    day: 5,
    title: "Random Thoughts & Observations",
    theme: "Stream of Consciousness",
    prompt: "Write whatever random thoughts are bouncing around in your head. Something you noticed today, a memory that popped up, a weird connection you made, or just the mental chatter that's been playing in the background."
  },
  {
    day: 6,
    title: "What's Changing?",
    theme: "Personal Evolution",
    prompt: "What's shifting in your life lately? Maybe it's how you think about something, a relationship that's evolving, or just a subtle change in your daily routine. What feels different from a few months ago?"
  },
  {
    day: 7,
    title: "Week in Review",
    theme: "Integration & Discovery",
    prompt: "Looking back at this week of writing, what themes keep showing up? What did you learn about your current headspace? What patterns in your thinking or feeling did you notice? What surprised you about yourself?"
  }
];



// Voice Discovery Journey - 10 days
export const voiceDiscoveryDays = [
  {
    day: 1,
    title: "Finding Your Voice",
    theme: "Voice Discovery",
    prompt: "Speak freely about who you are today. Don't worry about perfection - just let your authentic voice emerge. What makes you uniquely you?"
  },
  {
    day: 2,
    title: "Childhood Echoes",
    theme: "Voice Memory",
    prompt: "Think back to your childhood voice. How did you express yourself as a child? What stories did you love to tell? Let your inner child speak."
  },
  {
    day: 3,
    title: "Emotional Tones",
    theme: "Voice Emotion",
    prompt: "Speak about an emotion you're feeling right now. Notice how your voice changes with different feelings. What does your voice reveal about your inner state?"
  },
  {
    day: 4,
    title: "Speaking Your Dreams",
    theme: "Voice Vision",
    prompt: "Describe your dreams and aspirations as if you're telling a close friend. Let excitement and passion color your voice. What future are you creating with your words?"
  },
  {
    day: 5,
    title: "Voice of Gratitude",
    theme: "Voice Appreciation",
    prompt: "Speak about what you're grateful for, letting warmth and appreciation flow through your voice. How does gratitude change the way you sound?"
  },
  {
    day: 6,
    title: "Difficult Conversations",
    theme: "Voice Courage",
    prompt: "Practice speaking about something challenging in your life. Notice how your voice carries both vulnerability and strength. What truth needs to be spoken?"
  },
  {
    day: 7,
    title: "Voice of Wisdom",
    theme: "Voice Guidance",
    prompt: "Speak as if you're giving advice to a younger version of yourself. What wisdom does your voice carry? What lessons have shaped how you speak?"
  },
  {
    day: 8,
    title: "Creative Expression",
    theme: "Voice Creativity",
    prompt: "Tell a story, share a poem, or sing a song - let your creative voice flow freely. How does creativity change your vocal expression?"
  },
  {
    day: 9,
    title: "Voice in Relationships",
    theme: "Voice Connection",
    prompt: "Reflect on how you use your voice in relationships. How do you communicate love, set boundaries, and connect with others through speech?"
  },
  {
    day: 10,
    title: "Your Authentic Voice",
    theme: "Voice Integration",
    prompt: "After nine days of vocal exploration, speak about what you've discovered about your authentic voice. How will you carry this awareness forward?"
  }
];

// Spoken Emotions Journey - 14 days
export const spokenEmotionsDays = [
  {
    day: 1,
    title: "The Language of Feelings",
    theme: "Emotional Vocabulary",
    prompt: "Speak about your current emotional state using rich, descriptive language. Go beyond 'good' or 'bad' - what nuanced emotions are you experiencing?"
  },
  {
    day: 2,
    title: "Joy in Your Voice",
    theme: "Vocal Joy",
    prompt: "Think of something that brings you pure joy and speak about it. Notice how happiness changes your vocal tone, pace, and energy."
  },
  {
    day: 3,
    title: "Speaking Through Sadness",
    theme: "Vocal Sadness",
    prompt: "Allow yourself to speak about something that makes you sad. How does your voice carry grief? What healing happens through vocal expression?"
  },
  {
    day: 4,
    title: "The Sound of Anger",
    theme: "Vocal Anger",
    prompt: "Speak about something that frustrates or angers you. Notice how you can express anger in your voice while maintaining respect and clarity."
  },
  {
    day: 5,
    title: "Fear's Whisper",
    theme: "Vocal Fear",
    prompt: "Talk about a fear you have. How does fear affect your voice? What happens when you speak your fears aloud instead of keeping them inside?"
  },
  {
    day: 6,
    title: "Excitement and Anticipation",
    theme: "Vocal Excitement",
    prompt: "Speak about something you're looking forward to. Let your voice bubble with excitement and anticipation. How does hope sound in your voice?"
  },
  {
    day: 7,
    title: "The Calm Within",
    theme: "Vocal Peace",
    prompt: "Find a moment of inner peace and speak from that place. What does serenity sound like in your voice? How can you access this calm through speech?"
  },
  {
    day: 8,
    title: "Surprise and Wonder",
    theme: "Vocal Wonder",
    prompt: "Speak about something that amazes or surprises you. Let wonder and curiosity color your voice. How does awe change your vocal expression?"
  },
  {
    day: 9,
    title: "Love's Many Voices",
    theme: "Vocal Love",
    prompt: "Talk about different types of love in your life - romantic, familial, friendship, self-love. How does your voice express different forms of love?"
  },
  {
    day: 10,
    title: "Confusion and Clarity",
    theme: "Vocal Uncertainty",
    prompt: "Speak about something you're uncertain about. Notice how your voice can hold both confusion and the search for clarity."
  },
  {
    day: 11,
    title: "Pride and Accomplishment",
    theme: "Vocal Pride",
    prompt: "Talk about something you're proud of. How does your voice carry confidence and self-appreciation? What achievements deserve vocal celebration?"
  },
  {
    day: 12,
    title: "Shame and Forgiveness",
    theme: "Vocal Healing",
    prompt: "Gently speak about something you're working to forgive yourself for. How can your voice offer yourself compassion and healing?"
  },
  {
    day: 13,
    title: "Emotional Complexity",
    theme: "Vocal Nuance",
    prompt: "Speak about a situation where you felt multiple emotions at once. How can your voice hold complexity and contradiction?"
  },
  {
    day: 14,
    title: "Your Emotional Voice",
    theme: "Vocal Integration",
    prompt: "Reflect on how your voice has become a tool for emotional expression and healing. What have you learned about the relationship between voice and feeling?"
  }
];

export const vocalConfidenceDays = [
  {
    day: 1,
    title: "Voice Assessment",
    theme: "Current State",
    prompt: "Speak about how you currently feel about your voice and speaking abilities. When do you feel confident speaking, and when do you feel less sure? What would greater vocal confidence mean to you?"
  },
  {
    day: 2,
    title: "Authority in Voice",
    theme: "Personal Power",
    prompt: "Practice speaking with authority about something you know well. Notice how knowledge and passion affect your vocal confidence. What topics make you feel most authoritative when speaking?"
  },
  {
    day: 3,
    title: "Speaking Your Truth",
    theme: "Authenticity",
    prompt: "Talk about a belief or value that's important to you. Practice speaking your truth clearly and confidently. How does speaking authentically affect your voice and presence?"
  },
  {
    day: 4,
    title: "Setting Vocal Boundaries",
    theme: "Boundaries",
    prompt: "Practice saying 'no' or setting a boundary using your voice. Notice how boundary-setting affects your vocal tone and confidence. What boundaries do you need to speak more clearly?"
  },
  {
    day: 5,
    title: "Overcoming Voice Fears",
    theme: "Fear Transformation",
    prompt: "Speak about a fear you have related to public speaking or vocal expression. What would change if you could release this fear? Practice speaking through the fear rather than avoiding it."
  },
  {
    day: 6,
    title: "Power Posture and Voice",
    theme: "Embodiment",
    prompt: "Stand in a confident posture and speak about your strengths and capabilities. Notice how your physical stance affects your vocal power. How do body and voice work together for confidence?"
  },
  {
    day: 7,
    title: "Leadership Voice",
    theme: "Influence",
    prompt: "Speak as if you're leading a team or inspiring others toward a goal. What does leadership sound like in your voice? How can you use your voice to positively influence others?"
  },
  {
    day: 8,
    title: "Handling Disagreement",
    theme: "Conflict Resolution",
    prompt: "Practice speaking confidently about a topic where others might disagree with you. How can you maintain vocal confidence while remaining respectful and open to dialogue?"
  },
  {
    day: 9,
    title: "Public Speaking Practice",
    theme: "Presentation",
    prompt: "Give a mini presentation about something you care about, speaking as if addressing a group. What techniques help you feel more confident when speaking to others?"
  },
  {
    day: 10,
    title: "Vocal Presence",
    theme: "Charisma",
    prompt: "Focus on speaking with full presence and attention. How does being completely present affect your vocal confidence? What does it mean to have vocal charisma?"
  },
  {
    day: 11,
    title: "Confident Conversations",
    theme: "Social Confidence",
    prompt: "Practice speaking confidently in different social scenarios - meetings, parties, interviews. What strategies help you maintain vocal confidence in various social situations?"
  },
  {
    day: 12,
    title: "Your Confident Voice",
    theme: "Integration",
    prompt: "Reflect on your vocal confidence journey. How has your relationship with your speaking voice evolved? What practices will you continue to maintain and grow your vocal confidence?"
  }
];

// 4. Storytelling Voice Journey - 15 days
export const storytellingVoiceDays = [
  {
    day: 1,
    title: "Your Story Foundation",
    theme: "Personal Narrative",
    prompt: "Tell the story of who you are in 2-3 minutes, as if meeting someone for the first time. What elements make your personal story compelling? How does your voice carry your narrative?"
  },
  {
    day: 2,
    title: "Childhood Story Time",
    theme: "Memory Narratives",
    prompt: "Share a favorite childhood memory as if telling it to a friend. Practice using your voice to bring the story to life with emotion, pacing, and descriptive language."
  },
  {
    day: 3,
    title: "Character Voices",
    theme: "Voice Acting",
    prompt: "Tell a simple story using different voices for different characters. Experiment with how changing your voice can bring characters to life. What character voices feel natural to you?"
  },
  {
    day: 4,
    title: "Emotional Storytelling",
    theme: "Feeling Through Voice",
    prompt: "Share a story that moved you emotionally, letting the feelings come through your voice. How does your voice change when telling happy versus sad stories? Practice emotional vocal expression."
  },
  {
    day: 5,
    title: "Family Legends",
    theme: "Heritage Stories",
    prompt: "Tell a family story or legend that's been passed down. Practice being a keeper of family history through your voice. How do you honor the storytellers who came before you?"
  },
  {
    day: 6,
    title: "Humor and Voice",
    theme: "Comedy",
    prompt: "Share a funny story or joke, focusing on timing, pacing, and vocal delivery. How does your voice contribute to humor? What makes a story funny in the telling?"
  },
  {
    day: 7,
    title: "Descriptive Storytelling",
    theme: "Vivid Description",
    prompt: "Describe a beautiful place you've been as if painting a picture with words. Use your voice to help listeners see, feel, and experience the place through your description."
  },
  {
    day: 8,
    title: "Adventure Tales",
    theme: "Exciting Narratives",
    prompt: "Tell an adventure story - real or imagined - with excitement and energy. Practice building suspense and excitement through vocal pacing, volume, and enthusiasm."
  },
  {
    day: 9,
    title: "Teaching Through Stories",
    theme: "Educational Narrative",
    prompt: "Share a story that teaches a lesson or insight you've learned. How can storytelling be a powerful way to share wisdom? Practice using narrative to convey important messages."
  },
  {
    day: 10,
    title: "Love Stories",
    theme: "Romance and Connection",
    prompt: "Tell a story about love - romantic, familial, or friendship. How does your voice convey different types of love and connection? Practice speaking about love with warmth and authenticity."
  },
  {
    day: 11,
    title: "Dream and Fantasy",
    theme: "Imaginative Narratives",
    prompt: "Create and tell a fantasy or dream story. Let your imagination run free and practice using your voice to make impossible things feel real and magical."
  },
  {
    day: 12,
    title: "Overcoming Challenges",
    theme: "Triumph Stories",
    prompt: "Tell a story about overcoming a personal challenge or obstacle. How does your voice convey struggle, growth, and triumph? Practice inspiring others through your narrative."
  },
  {
    day: 13,
    title: "Cultural Stories",
    theme: "Heritage Narratives",
    prompt: "Share a story from your cultural background or a culture you admire. How do different cultural storytelling traditions influence vocal expression and narrative style?"
  },
  {
    day: 14,
    title: "Future Stories",
    theme: "Visionary Narratives",
    prompt: "Tell the story of your future as you hope it will unfold. Use your voice to make your dreams and aspirations feel real and achievable through storytelling."
  },
  {
    day: 15,
    title: "Your Storytelling Voice",
    theme: "Narrative Mastery",
    prompt: "Reflect on your storytelling journey. What have you discovered about your unique storytelling voice? How will you continue developing your ability to share stories that connect and inspire?"
  }
];

// 5. Meditation Speaking Journey - 21 days
export const meditationSpeakingDays = [
  {
    day: 1,
    title: "Mindful Voice Awareness",
    theme: "Voice Presence",
    prompt: "Begin by simply noticing your voice as you speak. Pay attention to breath, tone, pace, and how words feel as they emerge. How does mindful attention change your speaking experience?"
  },
  {
    day: 2,
    title: "Breath and Voice Connection",
    theme: "Breathing Foundation",
    prompt: "Focus on the relationship between your breath and voice. Practice speaking on the exhale, noticing how breath supports your words. How does conscious breathing affect your vocal presence?"
  },
  {
    day: 3,
    title: "Speaking with Intention",
    theme: "Purposeful Speech",
    prompt: "Before speaking today, pause and set an intention for your words. Practice speaking with deliberate purpose rather than automatic reaction. What changes when you speak intentionally?"
  },
  {
    day: 4,
    title: "Silence and Space",
    theme: "Pause Practice",
    prompt: "Practice incorporating meaningful pauses and silence into your speech. Notice how silence enhances the power of words. How does embracing quiet moments affect your vocal communication?"
  },
  {
    day: 5,
    title: "Body Awareness While Speaking",
    theme: "Embodied Speech",
    prompt: "Pay attention to your entire body as you speak. Notice posture, tension, energy flow. How does body awareness influence your voice? Practice speaking from a place of physical groundedness."
  },
  {
    day: 6,
    title: "Loving-Kindness Through Voice",
    theme: "Compassionate Speech",
    prompt: "Practice speaking with loving-kindness - to yourself and about others. How does intentional compassion change your vocal tone and word choice? Let love infuse your speech."
  },
  {
    day: 7,
    title: "Mindful Listening and Responding",
    theme: "Responsive Presence",
    prompt: "Practice truly listening before responding in conversations. Notice the quality of responses that come from deep listening versus reactive speaking. How does mindful listening improve communication?"
  },
  {
    day: 8,
    title: "Emotional Regulation Through Voice",
    theme: "Calm Communication",
    prompt: "When strong emotions arise, practice using your voice to return to calm presence. How can conscious speaking help regulate emotional states? Practice speaking through challenge with equanimity."
  },
  {
    day: 9,
    title: "Gratitude Expression",
    theme: "Appreciative Speech",
    prompt: "Practice expressing genuine gratitude through your voice. Notice how appreciation affects your vocal quality and the energy of your communication. Let thankfulness flow through your words."
  },
  {
    day: 10,
    title: "Present Moment Speaking",
    theme: "Here and Now",
    prompt: "Practice speaking about what's happening right now - sensations, thoughts, feelings, environment. How does present-moment awareness change the quality of your verbal expression?"
  },
  {
    day: 11,
    title: "Non-Violent Communication",
    theme: "Peaceful Speech",
    prompt: "Practice speaking without blame, judgment, or criticism. Focus on expressing needs and feelings clearly and peacefully. How does non-violent communication transform difficult conversations?"
  },
  {
    day: 12,
    title: "Mantra and Sacred Speech",
    theme: "Sacred Expression",
    prompt: "Experiment with speaking mantras, affirmations, or sacred phrases. Notice how repetitive, intentional speech affects your mental state and vocal resonance."
  },
  {
    day: 13,
    title: "Mindful Storytelling",
    theme: "Conscious Narrative",
    prompt: "Tell a story with complete presence and awareness. Notice how mindfulness affects your storytelling pace, emphasis, and connection with listeners. Practice present-moment narrative."
  },
  {
    day: 14,
    title: "Wisdom Speaking",
    theme: "Insight Sharing",
    prompt: "Practice speaking wisdom or insights from a place of deep knowing rather than intellectual understanding. How does wisdom speak differently than opinion or knowledge?"
  },
  {
    day: 15,
    title: "Compassionate Boundaries",
    theme: "Mindful Limits",
    prompt: "Practice setting boundaries with kindness and clarity through your voice. How can you say 'no' or establish limits while maintaining compassion and respect?"
  },
  {
    day: 16,
    title: "Mindful Conflict Resolution",
    theme: "Peaceful Problem-Solving",
    prompt: "Practice addressing disagreements with mindful speech. How can you express different viewpoints while maintaining presence, respect, and openness to understanding?"
  },
  {
    day: 17,
    title: "Inner Voice Dialogue",
    theme: "Self-Talk Awareness",
    prompt: "Notice and practice changing your internal dialogue. How does mindful awareness of self-talk affect your external speech? Practice speaking to yourself with kindness."
  },
  {
    day: 18,
    title: "Encouraging Others",
    theme: "Supportive Speech",
    prompt: "Practice using your voice to genuinely encourage and support others. Notice how uplifting speech affects both speaker and listener. How can your words be medicine for others?"
  },
  {
    day: 19,
    title: "Truth and Honesty",
    theme: "Authentic Expression",
    prompt: "Practice speaking your truth with courage and compassion. How do you balance honesty with kindness? Explore authentic expression that honors both truth and relationship."
  },
  {
    day: 20,
    title: "Voice as Service",
    theme: "Giving Through Speech",
    prompt: "Consider how your voice can serve others and the world. How might your words contribute to healing, understanding, or positive change? Practice speaking in service of the greater good."
  },
  {
    day: 21,
    title: "Integrated Mindful Speech",
    theme: "Speech Mastery",
    prompt: "Reflect on your meditation speaking journey. How has mindfulness transformed your relationship with voice and communication? What practices will you continue to cultivate conscious, compassionate speech?"
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
    prompt: "Write about what truly grounds you. What gives you stability? Describe your roots - family, values, places that feel like home. What in your life feels solid and unshakeable?"
  },
  { 
    day: 2, 
    title: "Earth Roots", 
    theme: "Visual Grounding",
    type: "visual",
    element: "earth",
    prompt: "Draw or paint your sense of stability and grounding. This could be actual roots, a tree, mountains, your childhood home, or abstract shapes that represent security. Use earthy colors - browns, greens, deep oranges."
  },
  { 
    day: 3, 
    title: "Earth Voice", 
    theme: "Spoken Foundation",
    type: "voice",
    element: "earth",
    prompt: "Speak about your foundation with the deep, steady voice of the earth. Talk about what makes you feel secure, your core values, your unshakeable truths. Let your voice be grounded and steady."
  },
  
  // WATER ELEMENT  
  { 
    day: 4, 
    title: "Water Emotions", 
    theme: "Emotional Flow",
    type: "text",
    element: "water",
    prompt: "Write about your emotional landscape. How do feelings flow through you? Describe your emotional depths, your currents of joy, streams of sadness, or oceans of love. What emotions need to flow more freely?"
  },
  { 
    day: 5, 
    title: "Water Flow", 
    theme: "Visual Emotions",
    type: "visual",
    element: "water",
    prompt: "Create art representing your emotional flow. Paint or draw water in any form - rivers, rain, tears, oceans, or abstract flowing shapes. Use blues, greens, and flowing movements to express your inner emotional currents."
  },
  { 
    day: 6, 
    title: "Water Voice", 
    theme: "Spoken Emotions",
    type: "voice",
    element: "water",
    prompt: "Let your voice flow like water as you speak about your emotions. Talk about how you feel, let your voice be fluid and adaptive. Express the flowing, changing nature of your emotional world."
  },
  
  // FIRE ELEMENT
  { 
    day: 7, 
    title: "Fire Passion", 
    theme: "Inner Flame",
    type: "text",
    element: "fire",
    prompt: "Write about what ignites your soul. What are you passionate about? What burns within you - dreams, desires, anger that needs transformation, or love that blazes bright? What wants to be transformed in the fire of your spirit?"
  },
  { 
    day: 8, 
    title: "Fire Creation", 
    theme: "Visual Passion",
    type: "visual",
    element: "fire",
    prompt: "Create art of your inner flame. Paint or draw fire, light, sun, lightning, or abstract representations of your passion and energy. Use warm colors - reds, oranges, yellows, golds. Let your creativity blaze!"
  },
  { 
    day: 9, 
    title: "Fire Declaration", 
    theme: "Spoken Power",
    type: "voice",
    element: "fire",
    prompt: "Speak with the power of fire! Declare your passions, your dreams, your burning desires. Let your voice carry the intensity and warmth of flame. What do you want to bring into the world with the fire of your spirit?"
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
    prompt: "Write about the parts of yourself you tend to hide or deny. What aspects of your personality, history, or emotions do you keep in darkness? Approach with curiosity, not judgment."
  },
  { 
    day: 2, 
    title: "Visualizing Shadow", 
    theme: "Shadow Expression",
    type: "visual",
    modality: "art",
    prompt: "Create art representing your shadow self. Use dark colors, hidden shapes, or abstract forms. What does your shadow look like when given visual form?"
  },
  { 
    day: 3, 
    title: "Speaking Shadow", 
    theme: "Shadow Voice",
    type: "voice",
    modality: "speaking",
    prompt: "Speak about what you usually keep silent. Let your shadow aspects have a voice. What do these hidden parts want to say?"
  },
  { 
    day: 4, 
    title: "Shadow Wisdom", 
    theme: "Shadow Learning",
    type: "text",
    modality: "writing",
    prompt: "Write about what your shadow has taught you. What strengths or insights have emerged from your darker experiences? How has struggle shaped wisdom?"
  },
  { 
    day: 5, 
    title: "Embracing Light", 
    theme: "Light Recognition",
    type: "voice",
    modality: "speaking",
    prompt: "Speak about your brightest qualities - the parts of you that shine. What gifts, talents, and beautiful aspects do you sometimes downplay or hide?"
  },
  { 
    day: 6, 
    title: "Painting Light", 
    theme: "Light Expression",
    type: "visual",
    modality: "art",
    prompt: "Create art celebrating your light. Use bright colors, radiant forms, expansive shapes. What does your most authentic, brilliant self look like?"
  },
  { 
    day: 7, 
    title: "Light Sharing", 
    theme: "Light Offering",
    type: "text",
    modality: "writing",
    prompt: "Write about how you share your light with the world. What gifts do you offer? How does your brightness help others?"
  },
  { 
    day: 8, 
    title: "Integration Dialogue", 
    theme: "Shadow-Light Connection",
    type: "voice",
    modality: "speaking",
    prompt: "Speak a conversation between your shadow and light selves. What do they want to say to each other? How might they work together?"
  },
  { 
    day: 9, 
    title: "Visual Integration", 
    theme: "Wholeness Art",
    type: "visual",
    modality: "art",
    prompt: "Create art that holds both shadow and light together. Show the balance, the dance, the necessary coexistence of both. What does wholeness look like?"
  },
  { 
    day: 10, 
    title: "Integration Reflection", 
    theme: "Wholeness Writing",
    type: "text",
    modality: "writing",
    prompt: "Write about your whole self - shadow and light integrated. How do both aspects make you complete? What's possible when you embrace all of who you are?"
  },
  { 
    day: 11, 
    title: "Integrated Expression", 
    theme: "Authentic Voice",
    type: "voice",
    modality: "speaking",
    prompt: "Speak from your integrated self - acknowledging both shadow and light without shame or arrogance. What does authentic wholeness sound like?"
  },
  { 
    day: 12, 
    title: "Living Integration", 
    theme: "Daily Wholeness",
    type: "text",
    modality: "writing",
    prompt: "Write about how you'll carry this integration forward. How will you honor both shadow and light in your daily life? What practices support your wholeness?"
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
    prompt: "Write about where you began. What were the foundational experiences, relationships, and moments that shaped your early life?"
  },
  { 
    day: 2, 
    title: "Past Chapter: Visual Memory", 
    theme: "Remembrance",
    type: "visual",
    modality: "art",
    chapter: "past",
    prompt: "Create art representing significant moments from your past. What images, colors, or symbols capture where you've been?"
  },
  { 
    day: 3, 
    title: "Past Chapter: Spoken Stories", 
    theme: "Storytelling",
    type: "voice",
    modality: "speaking",
    chapter: "past",
    prompt: "Tell the story of your past out loud. Narrate the journey from then to now. What stories need to be told?"
  },
  { 
    day: 4, 
    title: "Past Chapter: Lessons Learned", 
    theme: "Wisdom",
    type: "text",
    modality: "writing",
    chapter: "past",
    prompt: "Write about what your past has taught you. What wisdom have you gained? What would you tell your younger self?"
  },
  { 
    day: 5, 
    title: "Past Chapter: Gratitude & Release", 
    theme: "Completion",
    type: "voice",
    modality: "speaking",
    chapter: "past",
    prompt: "Speak words of gratitude for your past, then speak words of release. What are you thankful for? What are you ready to let go?"
  },
  { 
    day: 6, 
    title: "Present Chapter: Current Reality", 
    theme: "Now",
    type: "text",
    modality: "writing",
    chapter: "present",
    prompt: "Write about where you are right now. What defines this current chapter? What are you experiencing, feeling, becoming?"
  },
  { 
    day: 7, 
    title: "Present Chapter: Visual Snapshot", 
    theme: "Current Expression",
    type: "visual",
    modality: "art",
    chapter: "present",
    prompt: "Create art representing your life right now. What colors, shapes, or images capture this present moment?"
  },
  { 
    day: 8, 
    title: "Present Chapter: Speaking Now", 
    theme: "Current Voice",
    type: "voice",
    modality: "speaking",
    chapter: "present",
    prompt: "Speak about who you are today. What's true for you now? How have you changed? What's emerging?"
  },
  { 
    day: 9, 
    title: "Present Chapter: Current Challenges", 
    theme: "Growth Edge",
    type: "text",
    modality: "writing",
    chapter: "present",
    prompt: "Write about what's challenging you now. What are you working through? What growth is happening in this present chapter?"
  },
  { 
    day: 10, 
    title: "Present Chapter: Gifts of Now", 
    theme: "Present Gratitude",
    type: "voice",
    modality: "speaking",
    chapter: "present",
    prompt: "Speak about what this current chapter is giving you. What gifts exist in this moment? What's beautiful about now?"
  },
  { 
    day: 11, 
    title: "Future Chapter: Vision", 
    theme: "Possibility",
    type: "text",
    modality: "writing",
    chapter: "future",
    prompt: "Write about the future chapter you're creating. What do you envision? What are you moving toward? What's calling you forward?"
  },
  { 
    day: 12, 
    title: "Future Chapter: Visual Dreams", 
    theme: "Imagination",
    type: "visual",
    modality: "art",
    chapter: "future",
    prompt: "Create art representing your future vision. What does the next chapter look like? Use imagery that inspires and excites you."
  },
  { 
    day: 13, 
    title: "Future Chapter: Speaking Dreams", 
    theme: "Declaration",
    type: "voice",
    modality: "speaking",
    chapter: "future",
    prompt: "Speak your future into existence. Declare what you're creating. Let your voice carry your vision forward with confidence."
  },
  { 
    day: 14, 
    title: "Future Chapter: Bridge Building", 
    theme: "Action",
    type: "text",
    modality: "writing",
    chapter: "future",
    prompt: "Write about how you'll bridge from present to future. What actions will you take? What will help you move forward?"
  },
  { 
    day: 15, 
    title: "Trilogy Integration", 
    theme: "Complete Story",
    type: "voice",
    modality: "speaking",
    chapter: "integration",
    prompt: "Speak your complete story - past, present, and future. How do all three chapters connect? What's the through-line of your life story?"
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
    prompt: "Write about what you see around you. What visual beauty captures your attention? Describe colors, shapes, light, and shadow in detail."
  },
  { 
    day: 2, 
    title: "Seeing: Visual Expression", 
    theme: "Sight Creation",
    type: "visual",
    modality: "art",
    sense: "sight",
    prompt: "Create art celebrating the sense of sight itself. Paint what you love to look at. Express the joy of seeing."
  },
  { 
    day: 3, 
    title: "Seeing: Describing Vision", 
    theme: "Sight Voice",
    type: "voice",
    modality: "speaking",
    sense: "sight",
    prompt: "Describe aloud what you see right now in vivid detail. Practice being present to visual experience through verbal description."
  },
  { 
    day: 4, 
    title: "Seeing: Visual Memories", 
    theme: "Sight Reflection",
    type: "text",
    modality: "writing",
    sense: "sight",
    prompt: "Write about the most beautiful things you've ever seen. What visual memories stay with you? What has your sense of sight given you?"
  },
  
  // SOUND CYCLE (Days 5-8)
  { 
    day: 5, 
    title: "Hearing: Sound Landscape", 
    theme: "Sound Awareness",
    type: "voice",
    modality: "speaking",
    sense: "sound",
    prompt: "Speak about what you hear around you. Describe sounds, rhythms, music, voices, and silence. What does your auditory world sound like?"
  },
  { 
    day: 6, 
    title: "Hearing: Visual Sound", 
    theme: "Sound Expression",
    type: "visual",
    modality: "art",
    sense: "sound",
    prompt: "Create art representing sound. What do rhythms, music, or voices look like visually? Express the experience of hearing through imagery."
  },
  { 
    day: 7, 
    title: "Hearing: Written Sounds", 
    theme: "Sound Reflection",
    type: "text",
    modality: "writing",
    sense: "sound",
    prompt: "Write about your relationship with sound. What sounds bring you peace? What sounds disturb you? What has listening taught you?"
  },
  { 
    day: 8, 
    title: "Hearing: Sonic Memories", 
    theme: "Sound Memory",
    type: "voice",
    modality: "speaking",
    sense: "sound",
    prompt: "Speak about sounds you remember from your life. What voices, songs, or sounds are imprinted in your memory?"
  },
  
  // TOUCH CYCLE (Days 9-12)
  { 
    day: 9, 
    title: "Touching: Tactile World", 
    theme: "Touch Awareness",
    type: "text",
    modality: "writing",
    sense: "touch",
    prompt: "Write about what you can feel physically right now. Describe textures, temperatures, pressure. What does your sense of touch tell you?"
  },
  { 
    day: 10, 
    title: "Touching: Texture Art", 
    theme: "Touch Expression",
    type: "visual",
    modality: "art",
    sense: "touch",
    prompt: "Create art with interesting textures. Use materials that feel good. Express the sense of touch through tactile creation."
  },
  { 
    day: 11, 
    title: "Touching: Describing Sensation", 
    theme: "Touch Voice",
    type: "voice",
    modality: "speaking",
    sense: "touch",
    prompt: "Speak about physical sensations and touch. Describe what things feel like. What does your body sense through contact?"
  },
  { 
    day: 12, 
    title: "Touching: Touch Memories", 
    theme: "Touch Reflection",
    type: "text",
    modality: "writing",
    sense: "touch",
    prompt: "Write about meaningful touch experiences. What physical sensations stay with you? What has touch taught you about connection?"
  },
  
  // SMELL CYCLE (Days 13-16)
  { 
    day: 13, 
    title: "Smelling: Scent Awareness", 
    theme: "Smell Recognition",
    type: "voice",
    modality: "speaking",
    sense: "smell",
    prompt: "Speak about scents in your environment. What do you smell? How do scents affect your mood and memory?"
  },
  { 
    day: 14, 
    title: "Smelling: Visual Scent", 
    theme: "Smell Expression",
    type: "visual",
    modality: "art",
    sense: "smell",
    prompt: "Create art representing your favorite scents. What would lavender, coffee, or rain look like as visual art?"
  },
  { 
    day: 15, 
    title: "Smelling: Scent Stories", 
    theme: "Smell Reflection",
    type: "text",
    modality: "writing",
    sense: "smell",
    prompt: "Write about scents that trigger memories. What smells transport you? What has your sense of smell revealed to you?"
  },
  { 
    day: 16, 
    title: "Smelling: Aromatic Memories", 
    theme: "Smell Memory",
    type: "voice",
    modality: "speaking",
    sense: "smell",
    prompt: "Speak about the scents of your life - childhood smells, favorite aromas, scents you associate with people or places."
  },
  
  // TASTE CYCLE (Days 17-20)
  { 
    day: 17, 
    title: "Tasting: Flavor Awareness", 
    theme: "Taste Appreciation",
    type: "text",
    modality: "writing",
    sense: "taste",
    prompt: "Write about flavors you love. Describe taste experiences in detail. What does your sense of taste bring to your life?"
  },
  { 
    day: 18, 
    title: "Tasting: Visual Flavor", 
    theme: "Taste Expression",
    type: "visual",
    modality: "art",
    sense: "taste",
    prompt: "Create art representing flavors. What would sweet, sour, bitter, or savory look like as colors and shapes?"
  },
  { 
    day: 19, 
    title: "Tasting: Speaking Flavor", 
    theme: "Taste Voice",
    type: "voice",
    modality: "speaking",
    sense: "taste",
    prompt: "Describe your favorite foods and flavors aloud. Speak about taste experiences that bring you joy."
  },
  { 
    day: 20, 
    title: "Tasting: Flavor Memories", 
    theme: "Taste Reflection",
    type: "text",
    modality: "writing",
    sense: "taste",
    prompt: "Write about tastes that connect to memories. What flavors are woven into your life story?"
  },
  
  // INTEGRATION
  { 
    day: 21, 
    title: "Sensory Integration", 
    theme: "Complete Spectrum",
    type: "voice",
    modality: "speaking",
    sense: "all",
    prompt: "Speak about your complete sensory experience. How do all five senses work together to create your experience of being alive? What has this sensory journey taught you?"
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
    prompt: "Write about joy. What brings you happiness? Describe joyful experiences, moments of delight, what makes your heart sing."
  },
  { 
    day: 2, 
    title: "Joy in Color", 
    theme: "Joy Visualization",
    type: "visual",
    modality: "art",
    emotion: "joy",
    prompt: "Paint joy. What colors represent happiness to you? Create art that expresses the visual quality of joy and delight."
  },
  { 
    day: 3, 
    title: "Joy in Voice", 
    theme: "Joy Speaking",
    type: "voice",
    modality: "speaking",
    emotion: "joy",
    prompt: "Speak about joy with a joyful voice. Let happiness come through your tone. What does joy sound like when you give it voice?"
  },
  
  // SADNESS TRINITY (Days 4-6)
  { 
    day: 4, 
    title: "Sadness in Words", 
    theme: "Sadness Expression",
    type: "text",
    modality: "writing",
    emotion: "sadness",
    prompt: "Write about sadness. What sorrows do you carry? Describe the texture and depth of sad feelings without judgment."
  },
  { 
    day: 5, 
    title: "Sadness in Color", 
    theme: "Sadness Visualization",
    type: "visual",
    modality: "art",
    emotion: "sadness",
    prompt: "Paint sadness. What colors and shapes represent sorrow? Create art that honors the beauty and depth of sadness."
  },
  { 
    day: 6, 
    title: "Sadness in Voice", 
    theme: "Sadness Speaking",
    type: "voice",
    modality: "speaking",
    emotion: "sadness",
    prompt: "Speak about sadness, letting your voice carry the weight of sorrow. What does sadness sound like when spoken aloud?"
  },
  
  // ANGER TRINITY (Days 7-9)
  { 
    day: 7, 
    title: "Anger in Words", 
    theme: "Anger Expression",
    type: "text",
    modality: "writing",
    emotion: "anger",
    prompt: "Write about anger. What makes you angry? What injustices or frustrations burn within you? Express it freely on the page."
  },
  { 
    day: 8, 
    title: "Anger in Color", 
    theme: "Anger Visualization",
    type: "visual",
    modality: "art",
    emotion: "anger",
    prompt: "Paint anger. What colors and movements express rage, frustration, or righteous indignation? Let anger flow through art."
  },
  { 
    day: 9, 
    title: "Anger in Voice", 
    theme: "Anger Speaking",
    type: "voice",
    modality: "speaking",
    emotion: "anger",
    prompt: "Speak your anger aloud. Let your voice carry fire and intensity. What does anger sound like when given honest expression?"
  },
  
  // FEAR TRINITY (Days 10-12)
  { 
    day: 10, 
    title: "Fear in Words", 
    theme: "Fear Expression",
    type: "text",
    modality: "writing",
    emotion: "fear",
    prompt: "Write about fear. What are you afraid of? Describe your fears, anxieties, and worries with honesty and detail."
  },
  { 
    day: 11, 
    title: "Fear in Color", 
    theme: "Fear Visualization",
    type: "visual",
    modality: "art",
    emotion: "fear",
    prompt: "Paint fear. What colors and forms represent anxiety and fear? Create art that expresses the visual quality of being afraid."
  },
  { 
    day: 12, 
    title: "Fear in Voice", 
    theme: "Fear Speaking",
    type: "voice",
    modality: "speaking",
    emotion: "fear",
    prompt: "Speak about fear, noticing how your voice changes. What does fear sound like? Can you speak your fears to diminish their power?"
  },
  
  // LOVE TRINITY (Days 13-15)
  { 
    day: 13, 
    title: "Love in Words", 
    theme: "Love Expression",
    type: "text",
    modality: "writing",
    emotion: "love",
    prompt: "Write about love. Who and what do you love? Describe the feeling of love in all its forms - romantic, familial, friendly, universal."
  },
  { 
    day: 14, 
    title: "Love in Color", 
    theme: "Love Visualization",
    type: "visual",
    modality: "art",
    emotion: "love",
    prompt: "Paint love. What colors represent love to you? Create art that expresses the warmth, connection, and beauty of love."
  },
  { 
    day: 15, 
    title: "Love in Voice", 
    theme: "Love Speaking",
    type: "voice",
    modality: "speaking",
    emotion: "love",
    prompt: "Speak about love with a loving voice. Let tenderness and warmth flow through your words. What does love sound like?"
  },
  
  // PEACE TRINITY (Days 16-18)
  { 
    day: 16, 
    title: "Peace in Words", 
    theme: "Peace Expression",
    type: "text",
    modality: "writing",
    emotion: "peace",
    prompt: "Write about peace. What brings you calm and serenity? Describe moments of inner and outer peace."
  },
  { 
    day: 17, 
    title: "Peace in Color", 
    theme: "Peace Visualization",
    type: "visual",
    modality: "art",
    emotion: "peace",
    prompt: "Paint peace. What colors and forms represent tranquility? Create art that expresses stillness, calm, and serenity."
  },
  { 
    day: 18, 
    title: "Peace in Voice", 
    theme: "Peace Speaking",
    type: "voice",
    modality: "speaking",
    emotion: "peace",
    prompt: "Speak about peace with a peaceful voice. Let calm flow through your words. What does peace sound like? How has exploring emotions through all modalities deepened your understanding?"
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

// German translations of journey content (path title/subtitle/description + day title/theme/prompt).
// Each file in journeyTranslations/de/ is optional and keyed by pathId — missing translations
// simply fall back to English. We mutate JOURNEY_PATHS in place so every consumer that holds
// a reference to it (including pathRecommender.js, which reads the registry directly) picks up
// the active language without needing its own translation-lookup logic.
const deTranslationModules = import.meta.glob('./journeyTranslations/de/*.js', { eager: true });
const JOURNEY_PATHS_DE = {};
for (const modPath in deTranslationModules) {
  const pathId = modPath.match(/([^/]+)\.js$/)[1];
  JOURNEY_PATHS_DE[pathId] = deTranslationModules[modPath].default;
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
  Object.entries(JOURNEY_PATHS).forEach(([pathId, pathObj]) => {
    const enSnap = JOURNEY_PATHS_EN_SNAPSHOT[pathId];
    const deTranslation = lng === 'de' ? JOURNEY_PATHS_DE[pathId] : null;

    pathObj.title = deTranslation?.title || enSnap.title;
    pathObj.subtitle = deTranslation?.subtitle || enSnap.subtitle;
    pathObj.description = deTranslation?.description || enSnap.description;

    pathObj.days.forEach((dayObj, idx) => {
      const enDay = enSnap.days[idx];
      const deDay = deTranslation?.days?.[dayObj.day];
      dayObj.title = deDay?.title || enDay.title;
      dayObj.theme = deDay?.theme || enDay.theme;
      dayObj.prompt = deDay?.prompt || enDay.prompt;
    });
  });
};

applyJourneyLanguage(i18n.resolvedLanguage || i18n.language);
i18n.on('languageChanged', applyJourneyLanguage);