import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";
var todos = [];
const getLista = async (params = "limit=20&offset=0") => {
  try {
    try {
      const res = await axios.get(`${BASE_URL}/pokemon?${params}`);

      todos = res.data;

      console.log(`GET: Here's the list of todos`, todos);

      return todos;
    } catch (error) {
      debugger;
    }
  } catch (e) {
    console.error(e);
  }
};

const createLi = (item) => {
  const li = document.createElement("div");
  li.setAttribute("class", "col");
  li.innerHTML = createCard(item);

  return li;
};

const createCard = (p) => {
  var name = p.name;
  var id = p.url
    .replace("https://pokeapi.co/api/v2/pokemon/", "")
    .replace("/", "");

  return `<div  class="card" style="width: 13rem; margin: 10px">
  <img loading=lazy id="img-${id}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" class="card-img-top" alt="${name}">
  <div class="card-body">
    <h5 class="card-title">${name}</h5>
    <p class="card-text">Codigo ${id} </p>
  </div>
  <div class="card-body">
  <a target="_blank" href="https://pokedex.org/#/pokemon/${id}" class="card-link">Saiba mais</a>
  </div>
</div>`;
};

const addTodosToDOM = (all) => {
  const ul = document.querySelector(".lista-pokemon");
  let resultado = all.results;
  if (Array.isArray(resultado) && resultado.length > 0) {
    resultado.map((todo) => {
      ul.appendChild(createLi(todo));
    });
  } else if (resultado) {
    ul.appendChild(createLi(resultado));
  }
};

const form = document.querySelector("form#form-buscar");

const formEvent = form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const tmp = document.querySelector("#pokemon-input").value;
});
const main = async () => {
  addTodosToDOM(await getLista());
};

main();
