const pokeForm = document.querySelector('.poke-form');
const pokeList = document.querySelector('.poke-list');

function addPokemon(pokemon) {
  const liEl = document.createElement('li');
  const imgEl = document.createElement('img');
  const h2El = document.createElement('h2');
  const remove = document.createElement('button');
  const like = document.createElement('button');

  liEl.classList.add('pokemon');
  imgEl.src = pokemon.image;

  h2El.innerText = pokemon.name;
  remove.innerText = 'delete';
  like.innerText = 'like';

  liEl.append(imgEl, h2El, remove, like);
  pokeList.append(liEl);

  if (pokemon.liked === true) liEl.classList.add('liked');
  else liEl.classList.remove('liked');

  remove.addEventListener('click', () => {
    const del = {
      method: 'DELETE',
    };

    fetch(`http://localhost:3000/pokemons/${pokemon.id}`, del);
    init();
  });

  like.addEventListener('click', () => {
    const patchLike = {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        liked: true,
      }),
    };
    const patchUnlike = {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        liked: false,
      }),
    };
    if (pokemon.liked === false) {
      fetch(`http://localhost:3000/pokemons/${pokemon.id}`, patchLike);
    } else {
      fetch(`http://localhost:3000/pokemons/${pokemon.id}`, patchUnlike);
    }
    init();
  });
}

function addPokemons(pokemons) {
  pokeList.innerHTML = '';
  pokemons.forEach((pokemon) => addPokemon(pokemon));
}

function listenToAddPokemonForm() {
  pokeForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const pokemon = {
      name: pokeForm.name.value,
      image: pokeForm.image.value,
    };

    // CREATE
    fetch('http://localhost:3000/pokemons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pokemon),
    })
      .then((res) => res.json())
      .then((pokemon) => addPokemon(pokemon));
    pokeForm.reset();
  });
}

function init() {
  listenToAddPokemonForm();

  // READ
  fetch('http://localhost:3000/pokemons')
    .then((res) => res.json())
    .then((pokemons) => addPokemons(pokemons));
}

init();
