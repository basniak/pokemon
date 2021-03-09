import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";
var todos = [];
var total = 0;
var proximo = null;
var anterior = null;
var pag = 1;
var max_pag = 0;
var limit = 20;
var offset = 0;

const getLista = async () => {
  let link = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  const res = await axios.get(link);
  setLink(link);
  var todos = await getDados(res);
  return todos;
};

const getDados = async (res) => {
  try {
    todos = res.data;
    proximo = todos.next;
    anterior = todos.previous;
    total = todos.count;

    max_pag = parseInt(Number(total) / Number(limit));
    setTotal(total);
    console.log(`GET: Here's the list of todos`, todos);
    setAnterior();
    setProximo();
    setPaginator(true);
    $(".tipos-pokemons").hide();
    return todos;
  } catch (e) {
    console.error(e);
  }
};

const setPaginator = (flag) => {
  if (flag) {
    $(".page-navigation-pokemon").show();
  } else {
    $(".page-navigation-pokemon").hide();
  }
};

const setLink = (link) => {
  $("#url-json-pokemon").attr("href", link);
};

const setTotal = (t) => {
  $("#total-pokemon").text(
    `Pagina ${pag} de ${max_pag} | Total de Pokémons: ${t}`
  );
};
const setProximo = () => {
  if (!proximo) {
    $("#proximo-pokemon").addClass("disabled");
  } else {
    $("#proximo-pokemon").removeClass("disabled");
  }
};
const setAnterior = () => {
  if (!anterior) {
    $("#anterior-pokemon").addClass("disabled");
  } else {
    $("#anterior-pokemon").removeClass("disabled");
  }
};
const clickProximo = () => {
  $("#proximo-pokemon a").click(function (event) {
    event.preventDefault();
    if (proximo) {
      const urlParams = new URLSearchParams(
        proximo.replace(`${BASE_URL}/pokemon?`, "")
      );
      pag++;
      offset = urlParams.get("offset");
      limit = urlParams.get("limit");
      getLista().then((res) => {
        addTodosToDOM(res);
      });
    }
  });
};
const clickAnterior = () => {
  $("#anterior-pokemon a").click(function (event) {
    event.preventDefault();
    if (anterior) {
      const urlParams = new URLSearchParams(
        anterior.replace(`${BASE_URL}/pokemon?`, "")
      );
      pag--;
      offset = urlParams.get("offset");
      limit = urlParams.get("limit");
      getLista().then((res) => {
        addTodosToDOM(res);
      });
    }
  });
};

const getTipos = async () => {
  /**
   * https://select2.org/data-sources/arrays
   */
  const res = await axios.get(`${BASE_URL}/type`);
  const TIPOS = res.data.results;
  const data = TIPOS.map((e) => {
    return { id: e.name, text: e.name };
  });
  $(document).ready(function () {
    $(".js-example-basic-single").select2({ data: data });
  });
};

const createLi = (item) => {
  const li = document.createElement("div");
  li.setAttribute("class", "col card-pokemon");
  // li.setAttribute("class", "");
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
  $(".lista-pokemon div.card-pokemon").remove();
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
  $(".tipos-pokemons").show();
  const tmp = document.querySelector("#pokemon-input").value;
  console.log(tmp);
  if (tmp) {
    listByType(tmp);
  }
});

const listByType = async (t) => {
  if (t != "all") {
    var link = `${BASE_URL}/type/${t}`;
    const res = await axios.get(link);
    console.log(res.data.pokemon);

    var tmp = {
      results:
        res.data.pokemon.map((e) => {
          return e.pokemon;
        }) || [],
    };
    setPaginator(false);

    addTodosToDOM(tmp);
    $(".tipos-pokemons").text(
      `Total de ${tmp.results.length} | Tipo: ${t}`.toUpperCase()
    );
    setLink(link);
  } else {
    addTodosToDOM(await getLista());
  }
};

const main = async () => {
  addTodosToDOM(await getLista());
  clickProximo();
  clickAnterior();
  getTipos();
};

main();
