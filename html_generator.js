import { capitalizeFirstLetter } from "./fetch_data.js";

const writeToFile = (path, data) => Deno.writeTextFileSync(path, data);

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
    const [colour1, colour] = pokemon.types.map((t) => t.toLowerCase());
    const colour2 = colour || "transparent";
    const card = `<div class="card">
        <div class="img-container" style="background: linear-gradient(135deg, hsl(var(--${colour1}) / 50% ), hsl(var(--${colour2}) / 50%), transparent);">
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
    const file = t === "all" ? "/index.html" : `/pages/${t}.html`;
    if (t === type) {
      return `<li class = ${t}><a href="${file}">${
        capitalizeFirstLetter(t)
      }</a></li>`;
    }
    return `<li><a href="${file}">${capitalizeFirstLetter(t)}</a></li>`;
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
  pokemons.filter((p) => p.types.includes(capitalizeFirstLetter(type)));

const generateHtmlFiles = (pokemons) => {
  const types = [
    "all",
    "bug",
    "dark",
    "dragon",
    "electric",
    "fairy",
    "fighting",
    "fire",
    "flying",
    "ghost",
    "grass",
    "ground",
    "ice",
    "normal",
    "poison",
    "psychic",
    "rock",
    "steel",
    "water",
  ];

  for (const type of types) {
    const [pokeData, file] = type === "all"
      ? [pokemons, "./index.html"]
      : [getPokemons(type, pokemons), `./pages/${type}.html`];

    const htmlCode = generateHtmlCode(pokeData, type, types);
    writeToFile(file, htmlCode);
  }
};

const readContent = () => {
  const content = Deno.readTextFileSync("./pokemons.json");
  const pokemons = JSON.parse(content);
  return generateHtmlFiles(pokemons);
};

readContent();
