# Academic Showcase

Sitio web académico para presentar las trayectorias y trabajos de Guillermo David Rojas Jimenez y Eduardo Yabeta Zamorano.

## Requisitos
- Navegador moderno.
- Conexión a internet para cargar Google Fonts y GSAP desde CDN.

## Cómo ejecutar
Como el proyecto utiliza módulos JavaScript y `fetch()` para leer JSON, debe ejecutarse desde un servidor local. No abras `index.html` directamente con doble clic.

En Visual Studio Code:
1. Abre la carpeta `academic-showcase`.
2. Instala la extensión **Live Server** si todavía no la tienes.
3. Haz clic derecho en `index.html`.
4. Selecciona **Open with Live Server**.

También puedes usar:
```bash
python -m http.server 5500
```
Y abrir `http://localhost:5500`.

## Estructura
- `index.html`: estructura y pantallas principales.
- `css/styles.css`: estilos y responsive.
- `css/animations.css`: animaciones CSS.
- `js/main.js`: navegación, tema y lógica principal.
- `js/students.js`: información de estudiantes.
- `js/tasks.js`: lectura y estadísticas de trabajos.
- `js/animations.js`: transiciones GSAP.
- `data/tasks.json`: trabajos académicos (vacío por ahora).
- `assets/images/`: fotografías y evidencias que se añadirán después.

## Próximos pasos
1. Reemplazar los marcadores de fotografía por retratos reales.
2. Incorporar los trabajos reales de cada estudiante.
3. Ajustar textos, estadísticas y evidencias.
4. Refinar las transiciones y el contenido de cada perfil.
