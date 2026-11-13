import { pokemonesDefecto } from './db/pokemones.js';
import { usuariosDefecto } from './db/usuarios.js';

const CLAVES = {
  pokemones: 'pokeapp_pokemones',
  usuarios: 'pokeapp_usuarios',
  sesion: 'pokeapp_sesion'
};

function leerLista(clave, respaldo, claveAnterior) {
  try {
    const texto = localStorage.getItem(clave) ?? localStorage.getItem(claveAnterior);
    if (texto === null) return structuredClone(respaldo);
    const lista = JSON.parse(texto);
    if (!Array.isArray(lista)) return structuredClone(respaldo);
    return lista;
  } catch {
    return structuredClone(respaldo);
  }
}

function guardarLista(clave, lista) {
  try {
    localStorage.setItem(clave, JSON.stringify(lista));
  } catch {
    throw new Error('No se pudo guardar. Habilitá el almacenamiento del navegador o liberá espacio.');
  }
}

export function leerPokemones() {
  const lista = leerLista(CLAVES.pokemones, pokemonesDefecto, 'pokemones');
  const validos = [];
  for (const pokemon of lista) {
    if (!pokemon || !Number.isInteger(pokemon.id) || pokemon.id < 1 ||
        typeof pokemon.nombre !== 'string' || !Array.isArray(pokemon.tipo) ||
        !pokemon.tipo.every(tipo => typeof tipo === 'string') ||
        !['hp', 'ataque', 'defensa', 'velocidad'].every(campo => Number.isFinite(pokemon[campo]) && pokemon[campo] > 0)) continue;
    const copia = { ...pokemon };
    const original = pokemonesDefecto.find(p => p.id === copia.id);
    if (original) {
      if (!copia.descripcion) copia.descripcion = original.descripcion;
      for (const campo of ['imagen', 'imagenShiny', 'sonido']) {
        if (String(copia[campo]).startsWith('https://raw.githubusercontent.com/PokeAPI/')) {
          copia[campo] = original[campo];
        }
      }
    }
    validos.push(copia);
  }
  if (lista.length && !validos.length) return structuredClone(pokemonesDefecto);
  return validos;
}

export function leerUsuarios() {
  const lista = leerLista(CLAVES.usuarios, usuariosDefecto, 'usuarios');
  const usuarios = lista.filter(u => u && Number.isInteger(u.id) && u.id > 0 &&
    typeof u.username === 'string' && typeof u.email === 'string' && typeof u.password === 'string');
  for (const cuenta of usuariosDefecto) {
    const existe = usuarios.some(u => u.username.toLowerCase() === cuenta.username.toLowerCase() ||
      u.email.toLowerCase() === cuenta.email.toLowerCase());
    if (!existe) {
      const copia = { ...cuenta };
      if (usuarios.some(u => u.id === copia.id)) {
        copia.id = Math.max(...usuarios.map(u => u.id)) + 1;
      }
      usuarios.push(copia);
    }
  }
  return usuarios;
}

export function guardarPokemones(pokemon) {
  if (!Number.isInteger(pokemon.id) || pokemon.id < 1 || !pokemon.nombre.trim() ||
      !pokemon.tipo.length || !pokemon.descripcion.trim() || !pokemon.habilidad.trim() ||
      !Number.isInteger(pokemon.generacion) || pokemon.generacion < 1 ||
      ['hp', 'ataque', 'defensa', 'velocidad'].some(campo => !Number.isInteger(pokemon[campo]) || pokemon[campo] < 1) ||
      ['altura', 'peso'].some(campo => !Number.isFinite(pokemon[campo]) || pokemon[campo] <= 0)) {
    throw new Error('Revisá los campos: medidas positivas y estadísticas enteras mayores a cero.');
  }
  const pokemones = leerPokemones();
  if (pokemones.some(p => p.id === pokemon.id)) throw new Error('Ya existe un Pokémon con ese número.');
  pokemones.push(pokemon);
  guardarLista(CLAVES.pokemones, pokemones);
}

export function guardarUsuarios(usuario) {
  if (!usuario.nombre.trim() || !usuario.username.trim() || !usuario.password.trim() ||
      !/^\S+@\S+\.\S+$/.test(usuario.email)) {
    throw new Error('Completá el nombre, el usuario, el correo válido y la contraseña.');
  }
  const usuarios = leerUsuarios();
  if (usuarios.some(u => u.username.toLowerCase() === usuario.username.toLowerCase())) {
    throw new Error('Ese nombre de usuario ya existe.');
  }
  if (usuarios.some(u => u.email.toLowerCase() === usuario.email.toLowerCase())) {
    throw new Error('Ese correo ya está registrado.');
  }
  if (usuarios.some(u => u.id === usuario.id)) throw new Error('Ese número de usuario ya existe.');
  usuarios.push(usuario);
  guardarLista(CLAVES.usuarios, usuarios);
}

export function iniciarSesion(usuario) {
  const id = typeof usuario === 'object' ? usuario.id : usuario;
  guardarLista(CLAVES.usuarios, leerUsuarios());
  guardarLista(CLAVES.sesion, id);
}

export function leerUsuarioActivo() {
  try {
    const texto = localStorage.getItem(CLAVES.sesion) ?? localStorage.getItem('pokeappUsuarioActivo');
    if (texto === null) return null;
    const id = Number(JSON.parse(texto));
    return leerUsuarios().find(u => u.id === id) || null;
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  try {
    localStorage.removeItem(CLAVES.sesion);
    localStorage.removeItem('pokeappUsuarioActivo');
  } catch {}
}
