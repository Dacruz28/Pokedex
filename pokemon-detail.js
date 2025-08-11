let currentPokemonId = null;

const leftArrow = document.querySelector("#leftArrow");
const rightArrow = document.querySelector("#rightArrow");

function handleLeftArrowClick() {
    if (currentPokemonId > 1) {
        navigatePokemon(currentPokemonId - 1);
    }
}

function handleRightArrowClick() {
    if (currentPokemonId < 151) {
        navigatePokemon(currentPokemonId + 1);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const MAX_POKEMONS = 151;
    const pokemonID = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pokemonID, 10);

    if (isNaN(id) || id < 1 || id > MAX_POKEMONS) {
        window.location.href = "./index.html";
        return;
    }

    leftArrow.addEventListener("click", handleLeftArrowClick);
    rightArrow.addEventListener("click", handleRightArrowClick);

    currentPokemonId = id;
    loadPokemon(id);
});


async function loadPokemon(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
        ]);

        const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
        abilitiesWrapper.innerHTML = "";

        if (currentPokemonId === id) {
            displayPokemonDetails(pokemon);
            const flavorText = getEnglishFlavorText(pokemonSpecies);
            document.querySelector(".pokemon-description").textContent = flavorText;
        }

        const [leftArrow, rightArrow] = ['#leftArrow', '#rightArrow'].map(
            (sel) => document.querySelector(sel)
        );

        window.history.pushState({}, "", `./detail.html?id=${id}`);
        return true;

    } catch (error) {
        console.error("An error occurred while fetching Pokémon data:", error);
        return false;
    }
}

async function navigatePokemon(id) {
    currentPokemonId = id;
    await loadPokemon(id);
}

// ==================== Helpers ====================

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAndAppendElement(parent, tag, options = {}) {
    const element = document.createElement(tag);
    Object.assign(element, options);
    parent.appendChild(element);
    return element;
}

function getEnglishFlavorText(pokemonSpecies) {
    for (let entry of pokemonSpecies.flavor_text_entries) {
        if (entry.language.name === "en") {
            return entry.flavor_text.replace(/\f/g, " ");
        }
    }
    return "";
}

function displayPokemonDetails(pokemon) {
    const { name, id, types, weight, height, abilities, stats } = pokemon;
    const capitalizedPokemonName = capitalizeFirstLetter(name);

    // Título da página
    document.title = capitalizedPokemonName;

    // Nome
    document.querySelector(".name-wrap .name").textContent = capitalizedPokemonName;

    // ID formatado
    document.querySelector(".pokemon-id-wrap .body2-fonts").textContent = `#${String(id).padStart(3, "0")}`;

    // Imagem
    const imageElement = document.querySelector(".detail-img-wrapper img");
    imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;

    // Tipos
    const typeWrapper = document.querySelector(".power-wrapper");
    typeWrapper.innerHTML = "";
    types.forEach(({ type }) => {
        createAndAppendElement(typeWrapper, "p", {
            className: `body3-fonts type ${type.name}`,
            textContent: capitalizeFirstLetter(type.name),
        });
    });

    // Peso e altura
    document.querySelector(".weight").textContent = `${weight / 10} kg`;
    document.querySelector(".height").textContent = `${height / 10} m`;

    // Habilidades (moves)
    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
    abilitiesWrapper.innerHTML = "<p class='caption-fonts'>Moves</p>";
    abilities.forEach(({ ability }) => {
        createAndAppendElement(abilitiesWrapper, "p", {
            textContent: capitalizeFirstLetter(ability.name),
            className: "body3-fonts"
        });
    });

    // Stats
    const statsWrapper = document.querySelector(".stats-wrapper");
    statsWrapper.innerHTML = "";

    const statNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD",
    };

    stats.forEach(({ stat, base_stat }) => {
        const statDiv = document.createElement("div");
        statDiv.className = "stats-wrap";
        statsWrapper.appendChild(statDiv);

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts stats",
            textContent: statNameMapping[stat.name] || stat.name,
        });

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts",
            textContent: String(base_stat).padStart(3, "0"),
        });

        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar",
            value: base_stat,
            max: 100,
        });
    });

    setTypeBackgroundColor(pokemon);
}

// ==================== Cores ====================

const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
};

function setElementStyle(elements, cssProperty, value) {
    elements.forEach((element) => {
        element.style[cssProperty] = value;
    });
}

function rgbaFromHex(hexColor) {
    return [
        parseInt(hexColor.slice(1, 3), 16),
        parseInt(hexColor.slice(3, 5), 16),
        parseInt(hexColor.slice(5, 7), 16),
    ].join(",");
}

function setTypeBackgroundColor(pokemon) {
    const mainType = pokemon.types[0].type.name;
    const color = typeColors[mainType];

    if (!color) {
        console.warn(`Color not defined for type: ${mainType}`);
        return;
    }

    const detailMainElement = document.querySelector(".detail-main");

    setElementStyle([detailMainElement], "backgroundColor", color);
    setElementStyle([detailMainElement], "borderColor", color);

    // 👉 Aplique também ao body e html
    document.body.style.backgroundColor = color;
    document.documentElement.style.backgroundColor = color;

    document.querySelectorAll(".power-wrapper > p").forEach((el) => {
        const typeClass = el.classList.contains("type") ? el.classList[2] : null;
        if (typeClass && typeColors[typeClass]) {
            el.style.backgroundColor = typeColors[typeClass];
        }
    });

    setElementStyle(document.querySelectorAll(".stats-wrap p.stats"), "color", color);
    setElementStyle(document.querySelectorAll(".stats-wrap .progress-bar"), "color", color);

    setElementStyle(document.querySelectorAll(".about-text"), "color", color);

    const rgbaColor = rgbaFromHex(color);

    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
        .stats-wrap .progress-bar::-webkit-progress-bar {
            background-color: rgba(${rgbaColor}, 0.3);
        }

        .stats-wrap .progress-bar::-webkit-progress-value {
            background-color: ${color};
        }
    `;
    document.head.appendChild(styleTag);
}




