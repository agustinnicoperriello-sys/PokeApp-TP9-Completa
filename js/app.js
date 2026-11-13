import {
  leerPokemones,
  guardarPokemones,
  leerUsuarios,
  guardarUsuarios,
  iniciarSesion,
  leerUsuarioActivo,
  cerrarSesion,
} from "./persistencia.js";

const app = document.querySelector("#app");

const landing = `
  <section class="landing">
    <h1>Bienvenido a mi PokeApp</h1>
    <p>Explorá el mundo Pokémon!</p>
    <p>Elegí una opción del menú para comenzar.</p>
  </section>
`;

function cargarLanding() {
  console.log("Landing cargado");
}

const logo = document.querySelector(".header-logo img");

logo.addEventListener("click", function () {
  app.innerHTML = landing;

  cargarLanding();
});

const pokedex = `
  <section class="pokedex-section">
    <h1>Pokédex</h1>

    <div id="pokedex-gallery" class="pokedex-gallery"></div>
  </section>
`;

function cargarPokedex() {
  const pokemones = leerPokemones();

  const pokedexGallery = document.querySelector("#pokedex-gallery");

  for (let pokemon of pokemones) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "pokemon-card";
    tarjeta.innerHTML = `
      <div class="pokemon-image"><img /></div>
      <div class="pokemon-info">
        <span class="pokemon-id"></span>
        <h2></h2>
        <div class="pokemon-types"></div>
        <p class="pokemon-rareza"></p>
        <button class="btn-detalle">Ver detalles</button>
      </div>`;
    const imagen = tarjeta.querySelector("img");
    cargarImagen(imagen, pokemon.imagen, pokemon.nombre);
    tarjeta.querySelector(".pokemon-id").textContent = `N.º ${pokemon.id}`;
    tarjeta.querySelector("h2").textContent = pokemon.nombre;
    tarjeta.querySelector(".pokemon-rareza").textContent = pokemon.rareza;
    tarjeta.querySelector(".btn-detalle").dataset.id = pokemon.id;
    for (let tipo of pokemon.tipo) {
      const etiqueta = document.createElement("span");
      etiqueta.className = "type type-" + tipo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      etiqueta.textContent = tipo;
      tarjeta.querySelector(".pokemon-types").append(etiqueta);
    }
    pokedexGallery.append(tarjeta);
  }

  pokedexGallery.addEventListener("click", function (evento) {
    const id = evento.target.dataset.id;
    if (id) {
      mostrarDetalle(id);
    }
  });
}

const botonPokedex = document.querySelector("#link-pokedex");

botonPokedex.addEventListener("click", function (event) {
  event.preventDefault();

  mostrarLista();
});

function mostrarLista() {
  app.innerHTML = pokedex;
  cargarPokedex();
}

function mostrarDetalle(id) {
  app.innerHTML = `
    <section class="detalle-pokemon">
      <button type="button" class="back" id="volver-pokedex">Volver a la Pokédex</button>
      <div id="detalle-pokemon" class="detalle-simple"></div>
    </section>
  `;
  document.querySelector("#volver-pokedex").addEventListener("click", mostrarLista);
  const detalle = document.querySelector("#detalle-pokemon");

  for (let pokemon of leerPokemones()) {
    if (String(pokemon.id) === id) {
      detalle.innerHTML = `
        <h1></h1>
        <img id="imagen-detalle" width="180" />
        <p id="descripcion-detalle"></p>
        <ul id="datos-detalle"></ul>
        <div id="sonido-detalle"></div>
        <div id="shiny-detalle"></div>
      `;
      detalle.querySelector("h1").textContent = `N.º ${pokemon.id} · ${pokemon.nombre}`;
      const imagen = detalle.querySelector("#imagen-detalle");
      cargarImagen(imagen, pokemon.imagen, pokemon.nombre);
      detalle.querySelector("#descripcion-detalle").textContent =
        pokemon.descripcion || "Sin descripción registrada.";

      let evolucion = "No evoluciona";
      if (pokemon.tieneEvolucion) {
        evolucion = pokemon.evolucion || "Sin registrar";
        if (pokemon.nivelEvolucion) {
          evolucion += ` (nivel ${pokemon.nivelEvolucion})`;
        } else {
          evolucion += " (sin nivel registrado)";
        }
      }

      const datos = [
        `Tipo: ${pokemon.tipo.join(" / ")}`,
        `Rareza: ${pokemon.rareza}`,
        `Generación: ${pokemon.generacion}`,
        `Altura: ${pokemon.altura} m`,
        `Peso: ${pokemon.peso} kg`,
        `HP: ${pokemon.hp}`,
        `Ataque: ${pokemon.ataque}`,
        `Defensa: ${pokemon.defensa}`,
        `Velocidad: ${pokemon.velocidad}`,
        `Habilidad: ${pokemon.habilidad}`,
        `Evolución: ${evolucion}`
      ];
      const lista = detalle.querySelector("#datos-detalle");
      let filas = "";
      for (let i = 0; i < datos.length; i++) {
        filas += `<li id="dato-${i}"></li>`;
      }
      lista.innerHTML = filas;
      for (let i = 0; i < datos.length; i++) {
        lista.querySelector(`#dato-${i}`).textContent = datos[i];
      }

      const sonido = detalle.querySelector("#sonido-detalle");
      if (pokemon.sonido) {
        sonido.innerHTML = '<p>Sonido</p><audio controls preload="none"></audio>';
        sonido.querySelector("audio").src = pokemon.sonido;
      } else {
        sonido.textContent = "Sin sonido registrado.";
      }

      const shiny = detalle.querySelector("#shiny-detalle");
      if (pokemon.shiny && pokemon.imagenShiny) {
        shiny.innerHTML = '<p>Variante shiny</p><img width="150" />';
        const imagenShiny = shiny.querySelector("img");
        cargarImagen(imagenShiny, pokemon.imagenShiny, `${pokemon.nombre} shiny`);
      } else if (pokemon.shiny) {
        shiny.textContent = "Variante shiny: sin imagen registrada.";
      } else {
        shiny.textContent = "Sin variante shiny registrada.";
      }
      return;
    }
  }

  detalle.textContent = "Este Pokémon ya no está en la Pokédex.";
}

const login = `
  <section class="login-section">
          <h1>Iniciar sesión</h1>

          <p id="mensaje-login" role="status"></p>
          <form id="form-login">
            <label for="username"> Usuario </label>

            <input type="text" id="username" required />

            <label for="password"> Contraseña </label>

            <input type="password" id="password" required />
            <button class="btn btn-primary" type="submit">Ingresar</button>
          </form>
        </section>
`;

const botonLogin = document.querySelector("#link-login");

function actualizarMenuUsuario() {
  const usuario = leerUsuarioActivo();
  if (usuario) {
    botonLogin.textContent = `Perfil de ${usuario.nombre}`;
    botonRegistro.textContent = "Cerrar sesión";
  } else {
    botonLogin.textContent = "Iniciar sesión";
    botonRegistro.textContent = "Registrarse";
  }
}

function mostrarPerfil(usuario) {
  if (usuario.admin === true) {
    app.innerHTML = perfilAdmin;
    cargarPerfilAdmin();
  } else {
    app.innerHTML = perfilEstandar;
    cargarPerfilEstandar();
  }
  document.querySelector(".user-profile-username").textContent = usuario.username;
  document.querySelector(".user-profile-email").textContent = usuario.email;
  const avatar = document.querySelector(".user-profile-avatar");
  avatar.src = usuario.avatar;
  avatar.alt = `Avatar de ${usuario.nombre}`;
}

function mostrarLogin(mensaje) {
  app.innerHTML = login;
  const aviso = document.querySelector("#mensaje-login");
  aviso.textContent = mensaje || "";
  document.querySelector("#form-login").addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.querySelector("#username").value.trim().toLowerCase();
    const password = document.querySelector("#password").value;
    for (let usuario of leerUsuarios()) {
      if (String(usuario.username).toLowerCase() === username && usuario.password === password) {
        try {
          iniciarSesion(usuario);
        } catch (error) {
          aviso.textContent = error.message;
          return;
        }
        actualizarMenuUsuario();
        mostrarPerfil(usuario);
        return;
      }
    }
    aviso.textContent = "Usuario o contraseña incorrectos.";
  });
}

botonLogin.addEventListener("click", function (event) {
  event.preventDefault();
  const usuario = leerUsuarioActivo();
  if (usuario) {
    mostrarPerfil(usuario);
  } else {
    mostrarLogin("");
  }
});

const registro = `
  <section class="registro-section">

    <h1>Registrarse</h1>

    <p id="mensaje-registro" role="status"></p>
    <form id="form-registro">

      <label for="nombre">
        Nombre
      </label>

      <input 
        type="text" 
        id="nombre" required
      />

      <label for="email">
        Email
      </label>

      <input 
        type="email" 
        id="email" required
      />

      <label for="nuevo-username">
        Usuario
      </label>

      <input 
        type="text" 
        id="nuevo-username" required
      />

      <label for="nueva-password">
        Contraseña
      </label>

      <input 
        type="password" 
        id="nueva-password" required
      />

      <button class="btn btn-primary" type="submit">
        Registrarse
      </button>

    </form>

  </section>
`;

function cargarRegistro() {
  document.querySelector("#form-registro").addEventListener("submit", function (event) {
    event.preventDefault();
    const nombre = document.querySelector("#nombre").value.trim();
    const email = document.querySelector("#email").value.trim().toLowerCase();
    const username = document.querySelector("#nuevo-username").value.trim();
    const password = document.querySelector("#nueva-password").value;
    const aviso = document.querySelector("#mensaje-registro");
    if (!nombre || !username || !password.trim()) {
      aviso.textContent = "Completá los campos sin dejarlos en blanco.";
      return;
    }

    let id = 1;
    for (let usuario of leerUsuarios()) {
      if (String(usuario.username).toLowerCase() === username.toLowerCase() ||
          usuario.email.toLowerCase() === email) {
        aviso.textContent = "Ese usuario o email ya está registrado.";
        return;
      }
      if (usuario.id >= id) id = usuario.id + 1;
    }

    const nuevoUsuario = {
      id: id, nombre: nombre, email: email, username: username, password: password,
      avatar: "./assets/avatar/default.png", admin: false
    };
    try {
      guardarUsuarios(nuevoUsuario);
    } catch (error) {
      aviso.textContent = error.message;
      return;
    }
    mostrarLogin("Cuenta creada. Ya podés iniciar sesión.");
    document.querySelector("#username").value = username;
  });
}

const botonRegistro = document.querySelector("#link-registro");

botonRegistro.addEventListener("click", function (event) {
  event.preventDefault();

  if (leerUsuarioActivo()) {
    cerrarSesion();
    actualizarMenuUsuario();
    app.innerHTML = landing;
    cargarLanding();
    return;
  }
  app.innerHTML = registro;

  cargarRegistro();
});

function cargarPerfilEstandar() {
  console.log("Perfil de usuario estándar cargado");
}

const perfilEstandar = `
<section class="user-profile" id="user-profile">
          <h2>Perfil de usuario</h2>
          <div class="user-profile-info">
            <div>
              <img
                src="./assets/avatar/default.png"
                alt="Avatar de usuario"
                class="user-profile-avatar"
              />
            </div>
            <div>
              <p>
                Nombre de usuario:
                <span class="user-profile-username">Usuario</span>
              </p>
              <p>
                Email:
                <span class="user-profile-email">usuario@example.com</span>
              </p>
            </div>
          </div>
        </section>`;

function cargarPerfilAdmin() {
  console.log("Perfil de usuario admin cargado");

  const formularioNuevoPokemon = document.querySelector("#form-nuevo-pokemon");

  formularioNuevoPokemon.addEventListener("submit", function (event) {
    event.preventDefault();

    const activo = leerUsuarioActivo();
    if (!activo || activo.admin !== true) {
      actualizarMenuUsuario();
      if (activo) mostrarPerfil(activo);
      else mostrarLogin("Ingresá con una cuenta administradora.");
      return;
    }
    const numero = document.querySelector("#pokemon-number");
    const nombre = document.querySelector("#pokemon-name");
    const tipo = document.querySelector("#pokemon-type");
    const altura = document.querySelector("#pokemon-height");
    const peso = document.querySelector("#pokemon-weight");
    const generacion = document.querySelector("#pokemon-generation");
    const hp = document.querySelector("#pokemon-hp");
    const ataque = document.querySelector("#pokemon-attack");
    const velocidad = document.querySelector("#pokemon-speed");
    const defensa = document.querySelector("#pokemon-defense");
    const habilidad = document.querySelector("#pokemon-ability");
    const tieneEvolucion = document.querySelector(
      'input[name="pokemon-has-evolution"]:checked',
    );
    const evolucion = document.querySelector("#pokemon-evolution");
    const nivelEvolucion = document.querySelector("#pokemon-evolution-level");
    const rareza = document.querySelector("#pokemon-rarity");
    const imagen = document.querySelector("#pokemon-image");
    const sonido = document.querySelector("#pokemon-sound");
    const shiny = document.querySelector("#pokemon-shiny");
    const imagenShiny = document.querySelector("#pokemon-shiny-image");

    const descripcion = document.querySelector("#pokemon-description").value.trim();
    const aviso = document.querySelector("#mensaje-carga");
    const tipos = [];
    for (let parte of tipo.value.split(",")) {
      if (parte.trim()) tipos.push(parte.trim());
    }
    if (!nombre.value.trim() || !descripcion || tipos.length === 0 ||
        !sonido.value.trim()) {
      aviso.textContent = "Completá el nombre, la descripción, el tipo y el sonido.";
      return;
    }
    for (let pokemon of leerPokemones()) {
      if (Number(pokemon.id) === numero.valueAsNumber) {
        aviso.textContent = "Ya existe un Pokémon con ese número.";
        numero.focus();
        return;
      }
    }

    const evoluciona = tieneEvolucion && tieneEvolucion.value === "true";
    if (evoluciona && !evolucion.value.trim()) {
      aviso.textContent = "Indicá a qué Pokémon evoluciona.";
      evolucion.focus();
      return;
    }
    if (shiny.checked && !imagenShiny.value.trim()) {
      aviso.textContent = "Ingresá la ruta de la imagen shiny.";
      imagenShiny.focus();
      return;
    }

    for (const campo of [imagen, sonido, imagenShiny]) {
      if (campo.value.trim()) {
        try {
          const url = new URL(campo.value.trim(), location.href);
          if (!['http:', 'https:', 'file:'].includes(url.protocol)) throw new Error();
        } catch {
          aviso.textContent = 'Ingresá una URL http/https o una ruta local válida.';
          campo.focus();
          return;
        }
      }
    }
    const nuevoPokemon = {
      id: numero.valueAsNumber,
      nombre: nombre.value.trim(),
      tipo: tipos,
      descripcion: descripcion,
      altura: altura.valueAsNumber,
      peso: peso.valueAsNumber,
      generacion: generacion.valueAsNumber,
      hp: hp.valueAsNumber,
      ataque: ataque.valueAsNumber,
      velocidad: velocidad.valueAsNumber,
      defensa: defensa.valueAsNumber,
      habilidad: habilidad.value,
      tieneEvolucion: evoluciona,
      evolucion: evoluciona ? evolucion.value.trim() : "",
      nivelEvolucion: evoluciona && nivelEvolucion.value ? nivelEvolucion.valueAsNumber : null,
      rareza: rareza.value,
      imagen: imagen.value.trim() || "./assets/img/pokemon-logo.svg",
      sonido: sonido.value.trim(),
      shiny: shiny.checked,
      imagenShiny: shiny.checked ? imagenShiny.value.trim() : "",
    };

    console.log("Nuevo Pokémon agregado:", nuevoPokemon);
    try {
      guardarPokemones(nuevoPokemon);
    } catch (error) {
      aviso.textContent = error.message;
      return;
    }

    mostrarLista();
  });
}

const perfilAdmin = ` <section class="user-profile" id="user-profile">
          <h2>Perfil de usuario</h2>
          <div class="user-profile-info">
            <div>
              <img
                src="./assets/avatar/default.png"
                alt="Avatar de usuario"
                class="user-profile-avatar"
              />
            </div>
            <div>
              <p>
                Nombre de usuario:
                <span class="user-profile-username">Usuario</span>
              </p>
              <p>
                Email:
                <span class="user-profile-email">usuario@example.com</span>
              </p>
            </div>
          </div>
        </section>
        <section class="new-pokemon" id="new-pokemon">
          <h2>Nuevo Pokémon</h2>
          <p id="mensaje-carga" role="status"></p>
          <form id="form-nuevo-pokemon">
            <label for="pokemon-number"> Numero en el Pokedex: </label>
            <input type="number" id="pokemon-number" min="1" required />

            <label for="pokemon-name">Nombre:</label>
            <input type="text" id="pokemon-name" required />

            <label for="pokemon-description">Descripción:</label>
            <textarea id="pokemon-description" required></textarea>

            <label for="pokemon-type">Tipos (separados por coma):</label>
            <input type="text" id="pokemon-type" required />

            <label for="pokemon-height">Altura (m):</label>
            <input type="number" id="pokemon-height" min="0.01" step="any" required />

            <label for="pokemon-weight">Peso (kg):</label>
            <input type="number" id="pokemon-weight" min="0.01" step="any" required />

            <label for="pokemon-generation">Generación:</label>
            <input type="number" id="pokemon-generation" min="1" required />

            <label for="pokemon-hp">HP:</label>
            <input type="number" id="pokemon-hp" min="1" required />
            <label for="pokemon-attack">Ataque:</label>
            <input type="number" id="pokemon-attack" min="1" required />
            <label for="pokemon-speed">Velocidad:</label>
            <input type="number" id="pokemon-speed" min="1" required />
            <label for="pokemon-defense">Defensa:</label>
            <input type="number" id="pokemon-defense" min="1" required />

            <label for="pokemon-ability">Habilidad:</label>
            <select id="pokemon-ability" required>
             <option value="" disabled selected>Seleccioná una habilidad</option>
              <option value="Adaptability">Adaptable</option>
              <option value="Battle Armor">Armadura batalla</option>
              <option value="Blaze">Mar llamas</option>
              <option value="Chlorophyll">Clorofila</option>
              <option value="Clear Body">Cuerpo puro</option>
              <option value="Color Change">Cambio color</option>
              <option value="Compound Eyes">Ojo compuesto</option>
              <option value="Cute Charm">Gran encanto</option>
              <option value="Early Bird">Madrugar</option>
              <option value="Effect Spore">Efecto espora</option>
              <option value="Flame Body">Cuerpo llama</option>
              <option value="Flash Fire">Absorbe fuego</option>
              <option value="Guts">Agallas</option>
              <option value="Huge Power">Potencia</option>
              <option value="Hustle">Entusiasmo</option>
              <option value="Hyper Cutter"> Corte fuerte</option>
              <option value="Illuminate">Iluminacion</option>
              <option value="Immunity">Inmunidad</option>
              <option value="Inner Focus">Foco interno</option>
              <option value="Intimidate">Intimidación</option>
              <option value="Keen Eye">Vista lince</option>
              <option value="Levitate">Levitación</option>
              <option value="Lightning Rod">Pararrayos</option>
              <option value="Limber">Flexibilidad</option>
              <option value="Liquid Ooze">Lodo líquido</option>
              <option value="Magic Guard">Muro mágico</option>
              <option value="Natural Cure">Cura natural</option>
              <option value="Oblivious">Despiste</option>
              <option value="Overgrow">Espesura</option>
              <option value="Own Tempo">Ritmo propio</option>
              <option value="Pickup">Recogida</option>
              <option value="Poison Point">Punto tóxico</option>
              <option value="Pressure">Presión</option>
              <option value="Run Away">Fuga</option>
              <option value="Serene Grace"> dicha</option>
              <option value="Shed Skin">Mudar</option>
              <option value="Shield Dust">Polvo escudo</option>
              <option value="Soundproof">Insonorizar</option>
              <option value="Static">Electricidad estática</option>
              <option value="Stench">Hedor</option>
              <option value="Sturdy">Robustez</option>
              <option value="Swarm">Enjambre</option>
              <option value="Swift Swim">Nado veloz</option>
              <option value="Synchronize">Sincronía</option>
              <option value="Thick Fat">Sebo</option>
              <option value="Torrent">Torrente</option>
              <option value="Trace">Rastro</option>
              <option value="Volt Absorb">Absorbe electricidad</option>
              <option value="Water Absorb">Absorbe agua</option>
              <option value="Wonder Guard">Superguarda</option>
            </select>

            <fieldset>
              <legend>¿Tiene evolución?</legend>
              <label for="pokemon-has-evolution-yes">
                <input type="radio" id="pokemon-has-evolution-yes" name="pokemon-has-evolution" value="true" required />
                Sí
              </label>
              <label for="pokemon-has-evolution-no">
                <input type="radio" id="pokemon-has-evolution-no" name="pokemon-has-evolution" value="false" required />
                No
              </label>
            </fieldset>

            <label for="pokemon-evolution">Evolución:</label>
            <input type="text" id="pokemon-evolution" />

            <label for="pokemon-evolution-level">Nivel de evolución:</label>
            <input type="number" id="pokemon-evolution-level" min="1" />

            <label for="pokemon-rarity">Rareza:</label>
            <select id="pokemon-rarity" required>
              <option value="" disabled selected>Seleccioná una rareza</option>
              <option value="Común">Común</option>
              <option value="Raro">Raro</option>
              <option value="Legendario">Legendario</option>
              <option value="Mítico">Mítico</option>
              <option value="Singular">Singular</option>
            </select>

            <label for="pokemon-image">Imagen (URL, opcional):</label>
            <input type="text" id="pokemon-image" placeholder="Sin imagen se usa el logo de Pokémon" />

            <label for="pokemon-sound">Sonido (URL):</label>
            <input type="text" id="pokemon-sound" required />

            <label for="pokemon-shiny">¿Es shiny?</label>
            <input type="checkbox" id="pokemon-shiny" />

            <label for="pokemon-shiny-image">Imagen shiny (URL):</label>
            <input type="text" id="pokemon-shiny-image" />

            <button class="btn btn-primary" type="submit">Agregar Pokémon</button>
          </form>
        </section>`;

actualizarMenuUsuario();
app.innerHTML = landing;

cargarLanding();

function cargarImagen(imagen, ruta, nombre) {
  const logo = './assets/img/pokemon-logo.svg';
  imagen.alt = nombre;
  imagen.addEventListener('error', function () {
    imagen.src = logo;
  }, { once: true });

  if (!ruta || !ruta.trim()) {
    imagen.src = logo;
    return;
  }
  try {
    const url = new URL(ruta, location.href);
    imagen.src = ['http:', 'https:', 'file:'].includes(url.protocol) ? url.href : logo;
  } catch {
    imagen.src = logo;
  }
}
