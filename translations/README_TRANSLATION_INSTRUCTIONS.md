# Translating the Kairos journal prompts (EN → DE)

## What's here

`translations/en/*.json` — 50 files, one per journey path, 1,003 prompts total.
Each file is a JSON array of entries shaped like:

```json
{
  "id": "decidingToDoingDays:1",
  "title": "Closing Doors",
  "theme": "Decision aftermath and emotional reality",
  "prompt": "You've made a decision. Other paths are closed. How does this actually feel in your body right now?\n\nExplore these aspects:\n• What physical sensations do you notice..."
}
```

`translations/manifest.json` — list of all 50 files with entry counts, for reference.

## What to do

For each file in `translations/en/`, translate `title`, `theme`, and `prompt` into German and save the result as a same-named file under `translations/de/` (create that folder). **Do not change the `id` field.**

## Prompt to give DeepSeek (or paste per-file)

```
You are translating journal-writing prompts for a German-language mental
wellness / self-reflection journaling app called Kairos. Translate the
following JSON array from English to German.

Rules:
- Translate only the values of "title", "theme", and "prompt". Never
  change "id".
- Use informal "du" form throughout (not formal "Sie") — this matches
  the app's existing tone.
- Preserve the exact structure: bullet points (•), line breaks (\n),
  paragraph breaks (\n\n), and any bolded/quoted phrases in the prompt
  text. The prompt field contains multi-paragraph text with bullet
  lists — keep that formatting intact in the translation.
- Translate naturally and idiomatically, the way a thoughtful German
  wellness app would phrase a reflective journaling prompt — not a
  literal word-for-word translation. It's fine to rephrase a sentence
  if the literal translation would sound stiff or awkward in German.
- Return valid JSON, same array structure, same order, same number of
  entries as the input.

Here is the JSON:
<paste contents of one file from translations/en/ here>
```

## Output

Save each translated file as `translations/de/<same-filename>.json`
(e.g. `translations/en/decidingToDoingDays.json` → `translations/de/decidingToDoingDays.json`).

You don't have to do all 50 in one sitting — do as many as you want,
tell Claude which ones are done, and it'll wire those in. Files can be
delivered in any order/batches.

## Tips for splitting the work across DeepSeek conversations

- The prompt files vary a lot in size (7 to 100 entries). For the big
  ones (`holisticTransformationDays`, `lifeVisionDays` — 100 entries
  each), you may want to split those single files into two chat turns
  if DeepSeek's context gets tight — just paste half the array each
  time and combine the JSON results into one file afterward.
- Small files (7-15 entries) can likely be batched 2-3 files per
  DeepSeek message if you want to go faster — just be clear in the
  prompt that you're sending multiple arrays and want them each
  translated and returned separately.

## When you're done

Tell Claude which files are in `translations/de/` and it will merge
the translations back into `src/data/JourneyData.js`, verify the
build, and clean up the `translations/` folder.
