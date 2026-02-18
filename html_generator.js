const writeToFile = (path, data) => Deno.writeTextFileSync(path, data);

const generateHtmlCode = (cards) => {
  const htmlCode = `<html>

<head>
  <title>Pokedex</title>
  <link rel="stylesheet" href="/styles/style.css">
  <link rel="stylesheet" href="/styles/colors.css">
  <style>
    .all a {
      color: white;
    }
  </style>
</head>

<body>
  <div class="main">
    <div class="sidebar">
      <ul class="sidebar-contents">
        <li class="all"><a href="/index.html">all</a></li>
        <li><a href="/bug.html">bug</a></li>
        <li><a href="/dark.html">dark</a></li>
        <li><a href="/dragon.html">dragon</a></li>
        <li><a href="/electric.html">electric</a></li>
        <li><a href="/fairy.html">fairy</a></li>
        <li><a href="/fighting.html">fighting</a></li>
        <li><a href="/fire.html">fire</a></li>
        <li><a href="/flying.html">flying</a></li>
        <li><a href="/ghost.html">ghost</a></li>
        <li><a href="/grass.html">grass</a></li>
        <li><a href="/ground.html">ground</a></li>
        <li><a href="/ice.html">ice</a></li>
        <li><a href="/normal.html">normal</a></li>
        <li><a href="/poison.html">poison</a></li>
        <li><a href="/psychic.html">psychic</a></li>
        <li><a href="/rock.html">rock</a></li>
        <li><a href="/steel.html">steel</a></li>
        <li><a href="/water.html">water</a></li>
      </ul>
    </div>
    <div class="card-container">
    ${cards}
    </div>
  </div>
</body>

</html>`;

  return writeToFile("./pages/index.html", htmlCode);
};

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
  return generateHtmlCode(cards.join("\n"));
};

const readContent = () => {
  const content = Deno.readTextFileSync("./pokemons.json");
  const pokemons = JSON.parse(content);
  return generateHtmlForCards(pokemons);
};

readContent();
