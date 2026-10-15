# Simple Dictionary

A small React dictionary app that looks up English words and shows definitions, pronunciation, examples, synonyms, and a Farsi translation.

Built as a learning project to practice React state, controlled inputs, async data fetching, and rendering nested API data.

## Features

- Search any English word
- View IPA pronunciation and hear it spoken (Web Speech API)
- Browse definitions grouped by part of speech
- See usage examples and common synonyms
- Get a Farsi translation when available
- Clear error messages for bad input, unknown words, and network failures

## Tech Stack

- **React** (function components + hooks)
- **Vite** for the dev server and build
- **[freedictionaryapi.com](https://freedictionaryapi.com)** for dictionary data
- **Web Speech API** for pronunciation playback
- Plain CSS

No API key required.

## Getting Started

```bash
npm install
npm run dev
```

## How It Works

The app makes a single request per search:

```
GET https://freedictionaryapi.com/api/v1/entries/en/{word}?translations=true
```

The response contains:

- `word` — the searched word
- `entries[]` — one entry per part of speech, each with:
  - `partOfSpeech` — e.g. `"noun"`, `"verb"`
  - `pronunciations[]` — IPA transcriptions with dialect tags
  - `senses[]` — definitions, each with examples and translations
  - `synonyms[]` / `antonyms[]`
- `source` — attribution back to Wiktionary

The `?translations=true` parameter is required to receive translation data. Responses without it are smaller but omit the `translations` arrays.

## Project Structure

```
src/
├── App.jsx      # the entire app — state, fetch logic, rendering
├── App.css      # component styles
├── index.css    # global styles
└── main.jsx     # entry point
```

Everything lives in `App.jsx` for simplicity. A production version would split this into components (`SearchForm`, `EntryList`, `SenseItem`, etc.) and possibly a custom hook for the fetch logic.

## Notable Implementation Details

- **Error handling** distinguishes between network failures and "word not found" by checking for entries in the response body rather than relying on HTTP status codes, since the API may return 200 with an empty entries array.
- **Optional chaining** (`?.`) is used throughout when reading API data, since any nested field may be missing.
- **The pronunciation button** uses `speechSynthesis.speak()` with `lang = "en-US"` and speaks the plain word, not the IPA text.
- **Farsi translations** are located by walking the entries' senses and returning the first one with `language.code === "fa"`.

## Limitations

- Only the first pronunciation variant is displayed (the API provides several dialects).
- Only the first three definitions per part of speech are shown.
- Only the first Farsi translation is shown.
- No search history, no favorites, no offline support.

## Data Source

Dictionary data comes from [freedictionaryapi.com](https://freedictionaryapi.com), which is built on Wiktionary. Wiktionary content is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
