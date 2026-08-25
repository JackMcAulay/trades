# Pokémon GO Trade List

A small React/Vite static site for a Pokémon GO Want/Have trade list.

## Data format

Edit `want.txt` and `have.txt` directly. The website preserves the exact order of each file.

```text
PokemonID, Shiny, Background, Costume, Form
382, R, NBG, NC
384, S, London, NC
25, S, NBG, Rayquaza Costume
201, S, NBG, NC, A
```

- `R` = regular
- `S` = shiny
- `NBG` = no background
- `NC` = no costume
- Form is optional
- Blank lines and lines beginning with `#` are ignored

Forms are matched against PokéAPI. Add special aliases in `src/data/forms.js` when Pokémon GO terminology does not match PokéAPI.

## Run locally

```bash
npm install
npm run dev
```

Build for GitHub Pages:

```bash
npm run build
```

The generated site is in `dist/`.

## GitHub Pages

The project is configured with Vite's relative asset base, so it can be served from a GitHub Pages project URL without changing the code.

A simple GitHub Actions workflow can be added to deploy `dist/` automatically on every push.

## Data source

Pokémon names, forms and sprites are loaded from PokéAPI. The app caches API responses in memory during a page session and only requests the Pokémon actually present in the two lists.
