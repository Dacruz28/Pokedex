const MAX_POKEMON = 151;
const listWrapper = document.querySelector(".list-wrapper");

const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
});

async function fetchPokemonDataBeforeRedirect(id){
    try{
        const [pokemon, pokemonSpecies] = await Promise. 
        all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
            res.json()
        ),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
            res.json()
        ),    
    ]);
    return true
    } catch (error){
        console.error("falha a o fetch pokemon data before redirect");
    }
}

function displayPokemons(pokemon){
    listWrapper.innerHTML = "";

    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `

            
            <div class="img-wrap">
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonID}</p>
            </div>
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}"/>
            <div class="name-wrap">
                <p class="body3-fonts">${pokemon.name}</p>
            </div>
        </div>
            
        `;

        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDataBeforeRedirect
            (pokemonID);
            if (success){
                window.location.href = `./detail.html?id=${pokemonID}`;
            }
        });

        listWrapper.appendChild(listItem);
    });
}


searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;

    if (numberFilter.checked) {
        filteredPokemons = allPokemons.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchTerm);
        });
    } else if (nameFilter.checked) {
        filteredPokemons = allPokemons.filter((pokemon) => {
            return pokemon.name.toLowerCase().startsWith(searchTerm);
        });
    } else {
        filteredPokemons = allPokemons;
    }

    displayPokemons(filteredPokemons);

    // Mostrar a mensagem "não encontrado" apenas se a busca foi feita e nenhum resultado apareceu
    if (filteredPokemons.length === 0 && searchTerm !== "") {
        notFoundMessage.style.display = "flex";
    } else {
        notFoundMessage.style.display = "none";
    }
}



const closeButton = document.querySelector('.search-close-icon');
closeButton.addEventListener("click", clearSearch)

function clearSearch() {
    searchInput.value = "";
    displayPokemons(allPokemons)
    notFoundMessage.style.display = "nome";
}



// modal

document.addEventListener("DOMContentLoaded", () => {
  const filterButton = document.getElementById("filter-button");
  const modalOverlay = document.getElementById("modal-overlay");
  const closeModal = document.getElementById("close-modal");

  filterButton.addEventListener("click", () => {
    modalOverlay.style.display = "flex";
  });

  closeModal.addEventListener("click", () => {
    modalOverlay.style.display = "none";
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
    }
  });
});
