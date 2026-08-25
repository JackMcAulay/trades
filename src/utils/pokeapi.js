import { FORM_ALIASES } from '../data/forms';

const API = 'https://pokeapi.co/api/v2';
const cache = new Map();

const prettify = (value) =>
  value
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

function getAlias(id, form) {
  return FORM_ALIASES[`${id}:${form}`] ?? FORM_ALIASES[form] ?? null;
}

async function getJson(url) {
  if (cache.has(url)) return cache.get(url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`PokéAPI request failed (${response.status})`);
  }

  const data = await response.json();
  cache.set(url, data);

  return data;
}

async function getBasePokemon(id) {
  return getJson(`${API}/pokemon/${id}`);
}

async function getFormPokemon(id, form) {
  const base = await getBasePokemon(id);
  const alias = getAlias(id, form);

  if (alias) {
    return getJson(`${API}/pokemon-form/${alias}`);
  }

  const wanted = String(form).toLowerCase();

  const match = base.forms.find((entry) => {
    const name = entry.name.toLowerCase();

    return name === wanted || name.endsWith(`-${wanted}`);
  });

  if (match) {
    return getJson(match.url);
  }

  try {
    const variant = await getJson(
      `${API}/pokemon/${base.name}-${wanted}`
    );

    return variant.forms[0]?.url
      ? getJson(variant.forms[0].url)
      : variant;
  } catch {
    throw new Error(`Could not find form "${form}" for Pokémon ${id}.`);
  }
}

function getSprites(formData, shiny) {
  const staticSprite = shiny
    ? formData.sprites.front_shiny
    : formData.sprites.front_default;

  const animatedSprites =
    formData.sprites.versions?.['generation-v']?.['black-white']?.animated;

  const animatedSprite = animatedSprites
    ? shiny
      ? animatedSprites.front_shiny
      : animatedSprites.front_default
    : null;

  return {
    static: staticSprite,
    animated: animatedSprite,
  };
}

export async function resolvePokemon(entry) {
  const base = await getBasePokemon(entry.id);

  const formData = entry.form
    ? await getFormPokemon(entry.id, entry.form)
    : await getJson(base.forms[0].url);

  const sprites = getSprites(formData, entry.shiny);

  return {
    ...entry,

    name: prettify(base.name),

    formName: entry.form
      ? prettify(formData.form_name || entry.form)
      : null,

    sprite: sprites.static,

    animated: sprites.animated,
  };
}