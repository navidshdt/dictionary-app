import { useState } from 'react';

function App() {
  const [word, setWord] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    if (!word.trim()) return;

    setData(null);
    setError('');

    try {
      const response = await fetch(
        `https://freedictionaryapi.com/api/v1/entries/en/${word}?translations=true`,
      );

      if (!response.ok) {
        throw new Error('http-error');
      }

      const result = await response.json();
      if (!result.entries || result.entries.length === 0) {
        throw new Error('not-found');
      }
      setData(result);
    } catch (err) {
      // Distinguish network failures from "word not found"
      if (err.message === 'not-found') {
        setError(`No definitions found for "${word}".`);
      } else if (err.message === 'http-error') {
        setError('The dictionary service returned an error.');
      } else {
        // Anything else here is almost certainly a network failure
        setError('Network error — check your connection and try again.');
      }
    }
  }
  function getFarsiTranslations(entry) {
    const words = new Set();

    for (const sense of entry.senses) {
      for (const t of sense.translations ?? []) {
        if (t.language.code === 'fa') {
          words.add(t.word);
        }
      }
    }
    return [...words];
  }
  return (
    <div className="app">
      <h1>📖 Simple Dictionary</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Type a word..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {data && (
        <div className="result">
          <h2>{data.word}</h2>

          {data.entries[0]?.pronunciations?.[0]?.text && (
            <p
              className="phonetic"
              onClick={() =>
                speechSynthesis.speak(new SpeechSynthesisUtterance(word))
              }
            >
              🔊{data.entries[0].pronunciations[0].text}
            </p>
          )}

          {data.entries.map((entry, entryIndex) => {
            const farsiWords = getFarsiTranslations(entry);

            return (
              <div key={entryIndex} className="entry">
                <h3>{entry.partOfSpeech}</h3>

                <ol>
                  {entry.senses.slice(0, 3).map((sense, senseIndex) => (
                    <li key={senseIndex}>
                      <p>{sense.definition}</p>
                      {sense.examples?.length > 0 && (
                        <ul className="examples">
                          {sense.examples.map((ex, i) => (
                            <li key={i} className="example">
                              "{ex}"
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>

                {entry.synonyms?.length > 0 && (
                  <p className="synonyms">
                    <strong>Synonyms: </strong>
                    {entry.synonyms.slice(0, 8).join(', ')}
                  </p>
                )}

                {farsiWords.length > 0 && (
                  <p className="farsi">
                    <strong>Farsi: </strong>
                    <span className="farsi-word" dir="rtl">
                      {farsiWords.slice(0, 3).join(' · ')}
                    </span>
                  </p>
                )}
              </div>
            );
          })}

          {data.source?.url && (
            <p className="source">
              Source:{' '}
              <a href={data.source.url} target="_blank" rel="noreferrer">
                Wiktionary
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
