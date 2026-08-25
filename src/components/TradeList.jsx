function TradeCard({ pokemon }) {
  return (
    <article className="trade-card">
      {pokemon.background !== 'NBG' && (
        <span className="badge badge-background">BG</span>
      )}

      {pokemon.costume !== 'NC' && (
        <span className="badge badge-costume">C</span>
      )}

      <div className="sprite-wrap">
        <img
          src={pokemon.animated || pokemon.sprite}
          alt={pokemon.name}
          onError={(event) => {
            if (event.currentTarget.src !== pokemon.sprite) {
              event.currentTarget.src = pokemon.sprite;
            }
          }}
        />
      </div>

      <div className="pokemon-name">
        {pokemon.name}
        {pokemon.form && ` (${pokemon.form})`}
      </div>

      {pokemon.background !== 'NBG' && (
        <div className="pokemon-detail">
          {pokemon.background} BG
        </div>
      )}

      {pokemon.costume !== 'NC' && (
        <div className="pokemon-detail">
          {pokemon.costume}
        </div>
      )}
    </article>
  );
}

export function TradeList({ pokemon, loading, error }) {
  if (loading) {
    return <div className="status">Loading Pokémon...</div>;
  }

  if (error) {
    return <div className="status error">{error}</div>;
  }

  if (pokemon.length === 0) {
    return <div className="status">No Pokémon listed.</div>;
  }

  return (
    <section className="trade-grid">
      {pokemon.map((entry, index) => (
        <TradeCard
          key={`${entry.id}-${entry.form || ''}-${index}`}
          pokemon={entry}
        />
      ))}
    </section>
  );
}