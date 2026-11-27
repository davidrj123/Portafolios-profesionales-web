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
- `js/main.js`: inicialización, tema y coordinación de módulos.
- `js/navigation.js`: navegación entre pantallas y menú móvil.
- `js/students.js`: carga y presentación de los datos de estudiantes.
- `js/portfolio.js`: carga de portafolios independientes y renderizado de trabajos, proyectos y evidencias.
- `js/tasks.js`: cálculo de estadísticas de trabajos.
- `js/comparison.js`: actualización de la comparación con datos de ambos portafolios.
- `js/animations.js`: transiciones GSAP.
- `data/students.json`: información compartida de los estudiantes.
- `data/guillermo/portfolio.json`: trabajos, proyectos y evidencias de Guillermo.
- `data/eduardo/portfolio.json`: trabajos, proyectos y evidencias de Eduardo.
- `assets/images/` (previsto): fotografías y evidencias que se añadirán después.

Cada archivo `portfolio.json` contiene tres listas independientes: `tasks`, `projects` y `evidence`. Pueden permanecer vacías. Los trabajos llevan `id`, `title` y `type` (`individual` o `grupal`); la descripción es opcional. Los proyectos llevan `id` y `title`, con descripción opcional. Las evidencias llevan `id`, `title`, `url`, `workId` y `workType` (`task` o `project`) para asociarlas a un trabajo o proyecto. La interfaz y las estadísticas se actualizan desde esos datos, sin cambios de JavaScript al añadir registros con esa estructura. Las estadísticas actuales cuentan `tasks`; los proyectos se muestran aparte.

## Próximos pasos
1. Reemplazar los marcadores de fotografía por retratos reales.
2. Incorporar los trabajos reales de cada estudiante.
3. Ajustar textos, estadísticas y evidencias.
4. Refinar las transiciones y el contenido de cada perfil.
