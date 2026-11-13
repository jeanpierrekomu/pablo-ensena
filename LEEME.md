# Pablo Enseña · web jugable

Versión jugable de las 52 pantallas del Figma: Empezar (P01–P07), los 6 mundos (P08–P41), Siempre contigo (P42–P45) y el modo docente (D01–D07).

## Cómo abrirla

En línea: https://jeanpierrekomu.github.io/pablo-ensena/

En tu computadora, desde esta carpeta:

```bash
python3 -m http.server 4400
```

Luego abre http://localhost:4400. No necesita instalar nada.

## Archivos

| Archivo | Qué tiene |
|---|---|
| `index.html` | La página |
| `styles.css` | Colores y estilos (los mismos tokens del Figma) |
| `data.js` | **Todos los textos, preguntas, juegos y premios.** Para cambiar contenido, edita solo este archivo |
| `app.js` | Motor (XP, niveles, racha, insignias, misiones, progreso) + Empezar y Mundo 1 |
| `mundos.js` | Mundos 2 a 6 y Siempre contigo (repaso, álbum, viste a Pablo, perfil) |
| `interacciones.js` | Efecto tecla 3D, vibración y clic al presionar; hojas de info (racha, XP, insignias, mundos, misiones) |
| `docente.js` | Modo docente (D01–D07), índice de pantallas y arranque |
| `assets/` | Las poses de Pablo |

## Notas

- El progreso se guarda en el navegador (localStorage). Perfil → «Reiniciar mi progreso» lo borra.
- Puedes saltar a cualquier pantalla con la URL, por ejemplo `#P13` (si ya pasaste el inicio).
- P15 · Error amable es la hoja de abajo que sale cuando te equivocas, en todos los juegos.
- No pide datos de la familia (D.S. 016-2024-JUS): solo nombre o apodo y las compras propias del reto.
- Cada mundo se abre al terminar el anterior. Para saltar a cualquier pantalla: «Ver todas las pantallas» (en la bienvenida o en el perfil).
- El modo docente usa alumnos ficticios.
