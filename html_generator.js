import { transformFirstLetter } from "./fetch_data.js";

const writeToFile = async (path, data) => await Deno.writeTextFile(path, data);

const generateHtmlForTypes = (types) => {
  const typesHtml = [];
  for (const type of types) {
    typesHtml.push(`<div class="type ${type.toLowerCase()}">${type}</div>`);
  }

  return typesHtml.join("\n");
};

const generateHtmlForCards = (pokemons) => {
  const cards = [];
  for (const pokemon of pokemons) {
    const card = `<div class="card">
        <div class="img-container">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png"
            alt="This is an image of ${pokemon.pokeName.toLowerCase()}">
        </div>
        <div class="header">
          <h2>${pokemon.pokeName}</h2>
          <div class="types">
          ${generateHtmlForTypes(pokemon.types)}
          </div>
        </div>
        <table class="stats">
          <tr>
            <td class="data">Weight</td>
            <td class="right-align">${pokemon.weight}</td>
          </tr>
          <tr>
            <td class="data">Base XP</td>
            <td class="right-align">${pokemon.base_experience}</td>
          </tr>
          <tr>
            <td class="data">HP</td>
            <td class="right-align">${pokemon.hp}</td>
          </tr>
          <tr>
            <td class="data">Attack</td>
            <td class="right-align">${pokemon.attack}</td>
          </tr>
          <tr>
            <td class="data">Defense</td>
            <td class="right-align">${pokemon.defense}</td>
          </tr>
          <tr>
            <td class="data">Speed</td>
            <td class="right-align">${pokemon.speed}</td>
          </tr>
        </table>
      </div>`;
    cards.push(card);
  }
  return cards.join("\n");
};

const generateHtmlCodeForListItems = (type, types) => {
  const lists = types.map((t) => {
    const file = t === "all" ? "index" : t;
    if (t === type) {
      return `<li class = ${t}><a href="/pages/${file}.html">${t}</a></li>`;
    }
    return `<li><a href="/pages/${file}.html">${t}</a></li>`;
  });

  return lists.join("\n");
};

const generateHtmlCode = (pokemons, type, types) => {
  const listItems = generateHtmlCodeForListItems(type, types);
  const cards = generateHtmlForCards(pokemons);
  const htmlCode = `<html>

<head>
  <title>Pokedex</title>
  <link rel="stylesheet" href="/styles/style.css">
  <link rel="stylesheet" href="/styles/colors.css">
  <style>
    .${type} a {
      color: white;
    }
  </style>
</head>

<body>
  <div class="main">
    <div class="sidebar">
      <ul class="sidebar-contents">
        ${listItems}
      </ul>
    </div>
    <div class="card-container">
    ${cards}
    </div>
  </div>
</body>

</html>`;
  return htmlCode;
};

const getPokemons = (type, pokemons) =>
  pokemons.filter((p) => p.types.includes(transformFirstLetter(type)));

const generateHtmlFiles = async (pokemons) => {
  const types = ["all", "bug"];

  for (const type of types) {
    const [pokeData, file] = type === "all"
      ? [pokemons, "index"]
      : [getPokemons(type, pokemons), type];

  const htmlCode = generateHtmlCode(pokeData, type, types);
  await writeToFile(`./pages/${file}.html`, htmlCode);
  }
};

const readContent = async () => {
  const content = Deno.readTextFileSync("./pokemons.json");
  const pokemons = JSON.parse(content);
  return await generateHtmlFiles(pokemons);
};

await readContent();
