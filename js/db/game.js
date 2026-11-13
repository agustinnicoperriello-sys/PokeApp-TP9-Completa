import { leerPokemones } from '../persistencia.js';

const app = document.querySelector('#app');
let jugador = null;
let rival = null;
let vidaJugador = 100;
let vidaRival = 100;
let pociones = 2;
let mensajeBatalla = '';

function ponerImagen(imagen, pokemon) {
  const ruta = pokemon.imagen;
  const nombre = pokemon.nombre;
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

function elegirPokemon() {
  jugador = null;
  rival = null;
  const pokemones = leerPokemones();
  app.innerHTML = `
    <section class="batalla-section">
      <h1>Elegí tu Pokémon</h1>
      <p>El rival se elige al azar entre los demás Pokémon de tu Pokédex.
      Ambos empiezan con 100 de vida y tenés 2 pociones.</p>
      <div class="batalla-opciones"></div>
    </section>`;
  const opciones = document.querySelector('.batalla-opciones');
  if (pokemones.length < 2) {
    opciones.textContent = 'Necesitás al menos dos Pokémon en la Pokédex para combatir.';
    return;
  }
  for (const pokemon of pokemones) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'batalla-opcion';
    const imagen = document.createElement('img');
    ponerImagen(imagen, pokemon);
    const nombre = document.createElement('strong');
    nombre.textContent = pokemon.nombre;
    boton.append(imagen, nombre);
    boton.addEventListener('click', function () {
      iniciarBatalla(pokemon.id);
    });
    opciones.append(boton);
  }
}

function iniciarBatalla(id) {
  const pokemones = leerPokemones();
  jugador = pokemones.find(pokemon => pokemon.id === id);
  const rivales = pokemones.filter(pokemon => pokemon.id !== id);
  if (!jugador || rivales.length === 0) {
    elegirPokemon();
    return;
  }
  rival = rivales[Math.floor(Math.random() * rivales.length)];
  vidaJugador = 100;
  vidaRival = 100;
  pociones = 2;
  mensajeBatalla = `¡${jugador.nombre} se enfrenta a ${rival.nombre}!`;
  mostrarBatalla();
}

function mostrarBatalla() {
  const terminada = vidaJugador === 0 || vidaRival === 0;
  app.innerHTML = `
    <section class="batalla-section">
      <h1>Batalla Pokémon</h1>
      <p>Atacar quita 20 de vida al rival. Si sigue en pie, responde y te quita 15.
      Cada poción recupera hasta 30 de vida de tu Pokémon, sin superar los 100.</p>
      <div class="batalla-rivales">
        <figure>
          <img id="imagen-jugador">
          <figcaption><strong id="nombre-jugador"></strong> · Tu Pokémon</figcaption>
          <p>Vida: <strong>${vidaJugador} / 100</strong></p>
          <progress max="100" value="${vidaJugador}" aria-label="Vida de tu Pokémon"></progress>
        </figure>
        <span aria-hidden="true">VS</span>
        <figure>
          <img id="imagen-rival">
          <figcaption><strong id="nombre-rival"></strong> · Rival</figcaption>
          <p>Vida: <strong>${vidaRival} / 100</strong></p>
          <progress max="100" value="${vidaRival}" aria-label="Vida del rival"></progress>
        </figure>
      </div>
      <p role="status" class="batalla-mensaje"></p>
      <div class="batalla-acciones">
        <button type="button" class="btn btn-primary" id="atacar" ${terminada ? 'disabled' : ''}>Atacar</button>
        <button type="button" class="btn btn-secondary" id="usar-pocion"
          ${terminada || pociones === 0 || vidaJugador === 100 ? 'disabled' : ''}>Usar poción (${pociones} restantes)</button>
        <button type="button" class="btn" id="reiniciar-batalla">Nueva batalla</button>
        <button type="button" class="btn" id="cambiar-pokemon">Elegir otro Pokémon</button>
      </div>
    </section>`;

  ponerImagen(document.querySelector('#imagen-jugador'), jugador);
  ponerImagen(document.querySelector('#imagen-rival'), rival);
  document.querySelector('#nombre-jugador').textContent = jugador.nombre;
  document.querySelector('#nombre-rival').textContent = rival.nombre;
  document.querySelector('.batalla-mensaje').textContent = mensajeBatalla;
  document.querySelector('#atacar').addEventListener('click', atacar);
  document.querySelector('#usar-pocion').addEventListener('click', usarPocion);
  document.querySelector('#reiniciar-batalla').addEventListener('click', function () {
    iniciarBatalla(jugador.id);
  });
  document.querySelector('#cambiar-pokemon').addEventListener('click', elegirPokemon);
}

function atacar() {
  if (!jugador || !rival || vidaJugador === 0 || vidaRival === 0) return;
  vidaRival = Math.max(0, vidaRival - 20);
  if (vidaRival === 0) {
    mensajeBatalla = `¡Ganaste! ${rival.nombre} se quedó sin vida.`;
  } else {
    vidaJugador = Math.max(0, vidaJugador - 15);
    if (vidaJugador === 0) {
      mensajeBatalla = `${jugador.nombre} se quedó sin vida. ¡Podés volver a intentarlo!`;
    } else {
      mensajeBatalla = `${jugador.nombre} quitó 20 de vida. ${rival.nombre} respondió y quitó 15.`;
    }
  }
  mostrarBatalla();
}

function usarPocion() {
  if (!jugador || !rival || pociones === 0 || vidaJugador === 100 || vidaJugador === 0 || vidaRival === 0) return;
  const vidaAnterior = vidaJugador;
  vidaJugador = Math.min(100, vidaJugador + 30);
  pociones = pociones - 1;
  mensajeBatalla = `${jugador.nombre} recuperó ${vidaJugador - vidaAnterior} de vida. Te quedan ${pociones} pociones.`;
  mostrarBatalla();
}

document.querySelector('#link-juego').addEventListener('click', function (event) {
  event.preventDefault();
  elegirPokemon();
});
