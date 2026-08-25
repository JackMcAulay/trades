export function parseList(text) {
  return text
    .split(/\r?\n/)
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.trim() && !line.trim().startsWith('#'))
    .map(({ line, index }) => {
      const parts = line.split(',').map((part) => part.trim());
      const [id, shiny, background, costume, form = ''] = parts;

      if (!/^\d+$/.test(id)) {
        throw new Error(`Invalid Pokémon ID on line ${index + 1}: ${line}`);
      }
      if (!['R', 'S'].includes(shiny)) {
        throw new Error(`Shiny value must be R or S on line ${index + 1}: ${line}`);
      }
      if (!background) {
        throw new Error(`Background is missing on line ${index + 1}: ${line}`);
      }
      if (!costume) {
        throw new Error(`Costume is missing on line ${index + 1}: ${line}`);
      }

      return {
        id: Number(id),
        shiny: shiny === 'S',
        background,
        costume,
        form: form || null,
        sourceLine: index + 1,
      };
    });
}
