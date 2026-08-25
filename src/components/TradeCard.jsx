import { useState } from 'react';

export function TradeCard({ pokemon }) {
  const [animatedFailed, setAnimatedFailed] = useState(false);
  const useAnimated = pokemon.animated && !animatedFailed;

  return (
    <article className="trade-card">
      {pokemon.background !== 'NBG' && (
        <span className="badge badge-background" title={`Background: ${pokemon.background}`}>BG</span>
      )}
      {pokemon.costume !== 'NC' && (
        <span className="badge badge-costume" title={`Costume: ${pokemon.costume}`}>C</span>
      )}

      <div className="sprite-wrap">
        <img
          src={useAnimated ? pokemon.animated : pokemon.sprite}
          alt={`${pokemon.shiny ? 'Shiny ' : ''}${pokemon.name}${pokemon.formName ? ` ${pokemon.formName}` : ''}`}
          loading="lazy"
          onError={() => setAnimatedFailed(true)}
        />
      </div>

      <div className="pokemon-name">{pokemon.name}</div>
      {pokemon.formName && <div className="pokemon-detail">{pokemon.formName}</div>}
      {pokemon.background !== 'NBG' && <div className="pokemon-detail">{pokemon.background}</div>}
      {pokemon.costume !== 'NC' && <div className="pokemon-detail">{pokemon.costume}</div>}
    </article>
  );
}
