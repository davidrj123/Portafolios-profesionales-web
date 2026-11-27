# Academic Showcase

Sitio web académico colaborativo para presentar las trayectorias y trabajos de Guillermo David Rojas Jimenez y Eduardo Yabeta Zamorano. Utiliza HTML, CSS, JavaScript con módulos ES y JSON; no incluye backend ni framework.

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
- `js/filters.js`: búsqueda, filtros y ordenamiento de trabajos.
- `js/project-detail.js`: vista detallada y validación de evidencias.
- `js/animations.js`: transiciones GSAP.
- `data/students.json`: información compartida de los estudiantes.
- `data/guillermo/portfolio.json`: trabajos, proyectos y evidencias de Guillermo.
- `data/eduardo/portfolio.json`: trabajos, proyectos y evidencias de Eduardo.
- `assets/guillermo/photographs/`: fotografías independientes de Guillermo.
- `assets/guillermo/documents/`: documentos independientes de Guillermo.
- `assets/eduardo/photographs/`: fotografías independientes de Eduardo.
- `assets/eduardo/documents/`: documentos independientes de Eduardo.

Guillermo y Eduardo utilizan los mismos módulos, estilos y componentes. Su información personal y de contenido se mantiene separada en `data/students.json`, en sus archivos `portfolio.json` y en sus carpetas `assets/`.

Cada archivo `portfolio.json` contiene un objeto `profile` y tres listas independientes: `tasks`, `projects` y `evidence`. Pueden permanecer vacíos. `profile` admite `biography`, `photography`, `skills` y `technologies`.

Los trabajos requieren `id`, `title` y `type` (`individual` o `grupal`). Pueden incluir `description`, `fullDescription`, `subject`, `date`, `category`, `activityType`, `coverImage`, `technologies`, `reflection` y `learnings`. Los proyectos requieren `id` y `title`, y pueden usar los mismos campos opcionales, salvo `type`. Las evidencias llevan `id`, `title`, `workId` y `workType` (`task` o `project`) para asociarlas a un trabajo o proyecto. Usan `url` para enlaces externos seguros o `path` para archivos y imágenes relativos dentro del sitio.

Las categorías y tecnologías se renderizan únicamente cuando existen en los datos. `activityType` debe usar un valor coherente con los filtros, como `practica` o `investigacion`, y `date` debe ser una fecha ISO válida cuando se registre. Las URL externas deben usar HTTP o HTTPS. Las rutas locales deben ser relativas al sitio y no pueden ser rutas absolutas del equipo. El campo opcional `type` admite `image`, `pdf`, `document`, `github`, `video` o `link`. La interfaz y las estadísticas se actualizan desde estos datos sin cambios de JavaScript al incorporar registros válidos.

## Ramas

- `main`: base compartida estable e integrada.
- `feature/guillermo-portfolio`: desarrollo independiente de Guillermo.
- `feature/eduardo-portfolio`: desarrollo independiente de Eduardo.

Las ramas de estudiantes deben partir de `main` y se integran mediante Pull Request. No hagan push directo a `main`.

## Clonar

```bash
git clone https://github.com/davidrj123/Portafolios-profesionales-web.git
cd Portafolios-profesionales-web
git switch main
git pull --ff-only origin main
```

Para cambiar a una rama de estudiante:

```bash
git switch --track origin/feature/guillermo-portfolio
```

Eduardo debe usar:

```bash
git switch --track origin/feature/eduardo-portfolio
```

Para volver a la base:

```bash
git switch main
```

## Añadir trabajos

Edite únicamente el archivo correspondiente:

- Guillermo: `data/guillermo/portfolio.json`
- Eduardo: `data/eduardo/portfolio.json`

Dentro de `tasks`, incorpore un objeto con `id`, `title` y `type` (`individual` o `grupal`). Puede incluir `description`, `fullDescription`, `subject`, `date`, `category`, `activityType`, `coverImage`, `technologies`, `reflection` y `learnings`. No invente fechas ni tecnologías si no están disponibles. Los proyectos se incorporan en `projects` con `id` y `title`, más los campos opcionales aplicables.

## Añadir evidencias

Dentro de `evidence`, cada registro requiere `id`, `title`, `workId` y `workType` (`task` o `project`). Utilice `url` para enlaces externos o `path` para archivos locales relativos al sitio.

Ejemplo de evidencia externa:

```json
{
  "id": "github-evidence",
  "title": "Repositorio",
  "url": "https://github.com/usuario/repositorio",
  "type": "github",
  "workId": "trabajo-id",
  "workType": "task"
}
```

Ejemplo de documento local:

```json
{
  "id": "pdf-evidence",
  "title": "Documento",
  "path": "assets/guillermo/documentos/documento.pdf",
  "type": "pdf",
  "workId": "trabajo-id",
  "workType": "task"
}
```

Coloque los archivos reales dentro de `assets/guillermo/` o `assets/eduardo/` y conserve rutas relativas. No use rutas absolutas del equipo.

## Commits y cambios remotos

Después de comprobar los cambios:

```bash
git status
git add .
git diff --cached
git commit -m "feat: actualizar portafolio de Guillermo"
```

Para Eduardo cambie únicamente el nombre del mensaje. Incluya cambios relacionados y evite modificar componentes generales sin coordinación.

Suba una rama usando un push normal, sin force:

```bash
git push -u origin feature/guillermo-portfolio
```

Eduardo debe usar `feature/eduardo-portfolio`.

## Pull Requests

1. Actualice la rama desde `main` antes de comenzar:
   ```bash
   git switch main
   git pull --ff-only origin main
   git switch feature/guillermo-portfolio
   git merge --ff-only main
   ```
2. Desarrolle y confirme los cambios en la rama del estudiante.
3. Suba la rama al remoto.
4. Cree una Pull Request desde la rama del estudiante hacia `main`.
5. Revise el cambio y resuelva conflictos en GitHub antes de integrar.
6. Un responsable fusionará la Pull Request en `main`; no se hacen merges automáticos entre los agentes.

## Próximos pasos
1. Reemplazar los marcadores de fotografía por retratos reales.
2. Incorporar los trabajos reales de cada estudiante.
3. Ajustar textos, estadísticas y evidencias.
4. Refinar las transiciones y el contenido de cada perfil.
