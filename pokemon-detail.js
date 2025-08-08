let currentPokemonId = null;

document.addEventListener('DOMContentLoaded', () => {
    const MAX_POKEMONS = 151;
    const pokemonID = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pokemonID, 10);

    if (id < 1 || id > MAX_POKEMONS){
        return(window.location.href = "./index.html")
    }

    currentPokemonId = id;
    loadPokemon(id);
});

async function loadPokemon(id) {
    try{

    const [pokemon, pokemonSpecies] = await Promise. 
        all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
            res.json()
        ),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
            res.json()
        ),    
    ]);
    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
    abilitiesWrapper.innerHTML="";
    
    if (currentPokemonId === id){
        displayPokemonsDetails(pokemon){
            const flavorText = getEnglishFlavorText(pokemonSpecies);
            document.querySelector(".body3-fonts.pokemon-description").textContent = flavorText
        }
    const [leftArrow, rightArrow] = ['#leftArrow', '#rightArrow'].map(
        (sel) => document.querySelector(sel)
    );
    leftArrow.removeEventListener("click", navigatePokemon);
    rightArrow.removeEventListener("click", navigatePokemon);

    if(id !== 1) {
        leftArrow.addEventListener("click", () => {
            navigatePokemon(id - 1);
        });
    }

    if(id !== 151) {
        rightArrow.addEventListener("click", () => {
            navigatePokemon(id + 1);
        });
    }
    Window.history.pushState({}, "", `./detail.html?id=${id}`);

    }
    
    return true;
}   catch(error){
            console.error("an Error occured while fetching Pokemon data:", error);
            return false;
        }   
}


async function navigatePokemon(id) {
    currentPokemonId = id;
    await loadPokemon(id);

    const typeColors = {
        normal: "#A8A878",
        fire: "#F08030",
        water: "#6890F0",
        eletric: "#f8D930",
        grass: "#78C850",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#ABBB20",
        rock: "#BBA038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        dark: "#EE99AC"
    };

    function setElementStyle(elements, cssProperty, value){
        elements.forEach((element) => {
            element.style[cssProperty] = value;
        });
    }

    function rgbaFraHex(hexColor) {
        return [
            perseInt(hexColor.slice(1,3), 16),
            perseInt(hexColor.slice(3,5), 16),
            perseInt(hexColor.slice(5,7), 16),
    ].join(",");
}

function setTypeBackgroundColor(pokemon){
    const mainType = pokemon.types[0].type.name;
    const color = typeColors[mainType];

    if (!color) {
        console.warn(`Color não definida seu tipo: ${mainType}`);
    };
    return;
}

const detailMainElement = document.querySelector(".detail-main");
    setElementStyle([detailMainElement],
        "backgroundColor", color);
    setElementStyle([detailMainElement], "borderColor",
    color);

    setElementStyle(document.querySelectorAll(".power-wrapper > p"),
        "backgroundColor",
        color
    );

    setElementStyle(document.querySelectorAll(".stats-wrap p.stats"),
        "color",
        color
    );

    setElementStyle(document.querySelectorAll(".stats-wrap .progress-bar"),
        "color",
        color
    );

    const rgbaColor = rgbaFromHex(color);
    const styleTag = document.createElement("style");
styleTag.innerHTML = `. stats-wrap progress-bar::-webkit-progress-bar {
    background-color: rgba(${rgbaColor}, 0.5)
}`;

styleTag.innerHTML = `. stats-wrap progress-bar::-webkit-progress-bar {
    background-color:${color};
}`;

document.head.appendChild(styleTag);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAndppendElement(parent, tag, options = {}){
    const element = document.createElement(tag);
    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });

    parent.appendChild(element);
    return element;
}

function displayPokemonsDetails(pokemon) {
    const { name, id, types, weight, height, abilities, stats } = pokemon;
    const capitalizePokemonName = capitalizeFirstLetter(name);

    document.querySelector("title").textContent = capitalizePokemonName;

    const detailMainElement = document.querySelector("detail-main");
    detailMainElement.classList.add(name.toLowerCase());

        document.querySelector("name-wrap .nome").textContent = capitalizePokemonName;

        document.querySelector(".pokemon-id-wrap .body2-fonts").textContent = `#${String(id).padStart(3, "0")}`;

        const imageElement = document.querySelector(".detail-img-wrapper img");
        imageElement.src =`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`

        const typeWrapper = document.querySelector(".power-wrapper");
        typeWrapper.innerHTML = "";
        types.forEach(({ type }) => {
            createAndppendElement(typeWrapper, "p", {
                className: `body3-fonts type ${type.name}`,
                textContent:type.name,
            });
        });

        document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body-fonts.weight").textContent = `${weight / 10} kg`;
        document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body-fonts.height").textContent = `${height / 10} kg`;

        const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detai-move"
        );
        
}