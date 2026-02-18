const transformFirstLetter = (string) => {
  const firstLetter = string[0].toUpperCase();
  return firstLetter.concat(string.slice(1));
};

const writeToFile = (data) => {
  Deno.writeTextFileSync("./pokemons.json", JSON.stringify(data, null, 2));
};

const extractPokemonDetails = async (pokemons) => {
  const features = ["hp", "attack", "defense", "speed"];
  const allData = [];
  for (const pokemon of pokemons) {
    const response = await fetch(pokemon.url);
    const pokeData = await response.json();
    const { id, name, weight, base_experience } = pokeData;
    const pokeName = transformFirstLetter(name);
    const types = pokeData.types.map((t) => transformFirstLetter(t.type.name));
    const [hp, attack, defense, speed] = pokeData.stats
      .filter((s) => features.includes(s.stat.name))
      .map((s) => s.base_stat);
    allData.push({
      id,
      pokeName,
      weight,
      base_experience,
      hp,
      attack,
      defense,
      types,
      speed,
    });
  }
  return writeToFile(allData);
};

const fetchPokemons = async () => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1350`);
  const content = await response.json();
  const pokemons = content.results;

  return await extractPokemonDetails(pokemons);
};

await fetchPokemons();
