# PokeApp

Aplicación educativa basada en la estructura de `PokeAppCasiTerminadaSinCSS.zip`, manteniendo el CSS del proyecto actual.

## Ejecutar

Abrir `index.html` con Live Server en Visual Studio Code. Las imágenes, variantes shiny, avatares y sonidos están incluidos en `assets/`; no se consulta el catálogo nacional ni se necesita internet para esos recursos.

## Estructura

- `index.html`: encabezado, menú, contenedor `#app` y pie de página.
- `css/styles.css`: diseño y adaptación a celulares.
- `js/app.js`: bienvenida, Pokédex, detalle, login, registro y perfiles. El perfil administrador incluye el formulario para agregar Pokémon.
- `js/persistencia.js`: lectura y guardado con JSON y localStorage, sesión y validaciones.
- `js/db/pokemones.js`: los 10 Pokémon de la base.
- `js/db/usuarios.js`: las cuentas de ejemplo del ZIP.
- `js/db/game.js`: elección de tu Pokémon y batalla contra un rival al azar de la Pokédex. Atacar quita vida al rival y permite su respuesta; dos pociones recuperan vida de tu Pokémon.
- `assets/`: imágenes, avatares y sonidos locales.

La ficha muestra los valores de HP, ataque, defensa y velocidad directamente, sin barras ni fórmulas. En la batalla ambos empiezan con 100 de vida: tu Pokémon quita 20 y el rival responde con 15. Hay dos pociones de 30 puntos y botones para iniciar otra batalla o elegir otro Pokémon.

## Cuentas de ejemplo

| Perfil | Usuario | Contraseña |
| --- | --- | --- |
| Administrador (Juan) | `1234` | `password123` |
| Usuario común (Maria) | `5678` | `password567` |

Las cuentas nuevas son usuarios comunes. Después de iniciar sesión, el menú permite abrir el perfil y cerrar sesión. Las cuentas y los Pokémon agregados se guardan en este navegador. Se conservan las cuentas anteriores y se incorporan las cuentas de ejemplo que falten.

Las contraseñas se guardan como texto para este ejercicio educativo; usá únicamente contraseñas de prueba.

No modifica el repositorio del profesor ni publica la aplicación.
