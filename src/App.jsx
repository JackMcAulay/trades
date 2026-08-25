import { useEffect, useState } from 'react';
import { TradeList } from './components/TradeList';
import { parseList } from './utils/parser';
import { resolvePokemon } from './utils/pokeapi';
import './styles.css';

const tabs = ['want', 'have'];

async function loadList(fileName) {
  const response = await fetch(`${import.meta.env.BASE_URL}${fileName}`);

  if (!response.ok) {
    throw new Error(`Could not load ${fileName}.`);
  }

  const text = await response.text();
  const entries = parseList(text);

  return Promise.all(entries.map(resolvePokemon));
}

function App() {
  const [activeTab, setActiveTab] = useState('want');
  const [lists, setLists] = useState({ want: [], have: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      loadList('want.txt'),
      loadList('have.txt')
    ])
      .then(([want, have]) => {
        if (!cancelled) {
          setLists({ want, have });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err.message ||
            'Something went wrong loading the trade lists.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const current = lists[activeTab];

  return (
    <div className="app-shell">
      <header className="site-header">
        <h1>ToxicPotatoZ Trades</h1>
      </header>

      <nav className="tabs" aria-label="Trade lists">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab)}
            aria-selected={activeTab === tab}
            role="tab"
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </nav>

      <section className="list-heading">
        <h2>
          {activeTab === 'want'
            ? 'Looking For'
            : 'Available To Trade'}
        </h2>
      </section>

      <TradeList
        pokemon={current}
        loading={loading}
        error={error}
      />

      <footer className="site-footer">
        Pokémon data and sprites provided by PokéAPI.
      </footer>
    </div>
  );
}

export default App;