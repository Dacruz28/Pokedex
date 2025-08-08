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

    setElementStyle(document.querySelector)

}