import type { WikiSection } from '../content';

export const WIKI_ES: WikiSection[] = [
  {
    id: 'getting-started',
    title: 'Primeros pasos',
    md: `# Primeros pasos

AnvilCSS crea un **tema Custom CSS completo para Jellyfin** — sin necesidad de saber CSS.

## El flujo de trabajo

1. **Diseña** tu tema con los paneles del constructor a la izquierda (Colores, Fondo, Logos, Componentes).
2. **Observa** cada cambio en vivo en la vista previa central. Cambia entre las vistas Inicio, Inicio de sesión, Detalles, Reproductor y Panel de control, y entre anchos de TV / Escritorio / Tableta / Móvil.
3. **Afina** en el editor de código a la derecha — el CSS generado es texto plano y totalmente editable.
4. **Exporta** desde el panel Exportar: copia el CSS o descarga \`jellyfin-theme.css\`.
5. En Jellyfin abre **Panel de control → General → CSS personalizado**, pega y guarda. Listo.

## Conviene saber

- **Deshacer** (↶ en la barra superior) revierte cualquier cambio del constructor, importación de snippets o preset.
- **Restablecer** devuelve todo al aspecto oscuro original de Jellyfin.
- El **banco de temas** guarda borradores ilimitados en disco (\`data/themes.json\`), sobreviven a los reinicios.
- La vista previa es una réplica fiel del DOM real de jellyfin-web: usa exactamente los mismos nombres de clase (\`.skinHeader\`, \`.cardBox\`, \`.button-submit\`, …), así que lo que ves es lo que Jellyfin renderiza.`
  },
  {
    id: 'colors',
    title: 'Paleta de colores',
    md: `# Paleta de colores

Los temas de Jellyfin no usan variables CSS — cada color se escribe directamente en reglas que apuntan a las clases del skin de Jellyfin. AnvilCSS gestiona seis roles:

| Rol | Se usa para | Selectores de Jellyfin (ejemplos) |
|-----|-------------|-----------------------------------|
| **Acento** | Botones, enlaces, progreso, selección | \`.button-submit\`, \`.navMenuOption-selected\`, \`.itemProgressBarForeground\` |
| **Fondo** | Lienzo de la página | \`html\`, \`.backgroundContainer\` |
| **Superficie** | Cabecera, diálogos, listas | \`.skinHeader-withBackground\`, \`.paperList\` |
| **Elevado** | Botones, avisos | \`.raised\`, \`.fab\`, \`.toast\` |
| **Texto primario** | Texto principal | \`html\`, \`.skinHeader\` |
| **Texto secundario** | Subtítulos, etiquetas | \`.cardText-secondary\`, \`.inputLabel\` |

## Herramientas

- **Tema aleatorio** genera una combinación armoniosa: un tono base, una rotación de esquema (análogo, complementario o triádico) para el acento y superficies oscuras derivadas del mismo tono.
- **Paleta desde imagen** extrae los colores dominantes de la imagen de fondo actual mediante cuantización median-cut, asigna los más oscuros a Fondo/Superficie/Elevado y el más vivo al Acento — y luego corrige automáticamente el contraste del texto.
- **Corregir contraste** ajusta ambos colores de texto hasta cumplir las relaciones **WCAG** contra tu fondo: 7:1 para el texto primario (AAA) y 4,5:1 para el secundario (AA). Las insignias junto a cada color muestran la relación en vivo.`
  },
  {
    id: 'background',
    title: 'Fondo',
    md: `# Fondo

Hay cuatro tipos de fondo disponibles:

- **Solo color** — el color de fondo plano de la paleta.
- **Degradado** — dos colores y un ángulo, aplicados a \`html\` y \`.backgroundContainer\`.
- **Imagen por URL** — cualquier URL de imagen accesible. Se escribe literalmente en el CSS, así que debe seguir siendo accesible desde todos los dispositivos que usen el tema.
- **Subir imagen** — el archivo se incrusta en el CSS como data URI Base64. No hay que alojar nada, pero el archivo CSS crece alrededor de un 135 % del tamaño de la imagen — vigila el indicador de tamaño en el panel Exportar.

## Controles

- **Escala** — \`cover\` llena la pantalla (recortando si hace falta), \`contain\` muestra la imagen completa (puede dejar bandas).
- **Posición X/Y** — qué parte de la imagen queda visible al recortar (50/50 = centrada).
- **Superposición** — una capa tintada entre imagen y UI. Sube la opacidad para mantener legibles pósteres y texto sobre fondos recargados.
- **Desenfoque** — suaviza la imagen (en px). Se aplica con \`filter: blur()\` sobre \`.backgroundContainer\` con un ligero aumento de escala para ocultar el borde difuminado.

**Consejo:** la pestaña Fondos del Catálogo trae la lista semanal de Wallhaven — un clic la pone de fondo, otro extrae la paleta a juego.`
  },
  {
    id: 'logos',
    title: 'Logos y marca',
    md: `# Logos y marca

Jellyfin muestra su marca en cinco lugares. AnvilCSS reemplaza cada uno vía CSS donde es técnicamente posible:

1. **Logo de cabecera** — el banner arriba a la izquierda. Se reemplaza con \`background-image\` en \`.pageTitleWithLogo\` / \`.pageTitleWithDefaultLogo\` con \`background-size: contain\`.
2. **Logo de inicio de sesión / splash** — el logo de la página de acceso y de la pantalla de carga. Se reemplaza con \`content: url()\` en \`.imgLogoIcon\` y \`background-image\` en \`.splashLogo\`.
3. **Fondo de la pantalla de carga** — una imagen a pantalla completa tras el splash (\`html.preload\` y el contenedor del splash).
4. **Favicon** — ⚠ **no se puede cambiar con CSS.** El navegador carga el favicon del servidor antes de aplicar ninguna hoja de estilos. La ranura muestra igualmente una vista previa para preparar el archivo; para cambiarlo de verdad, reemplaza \`favicon.ico\` dentro de la carpeta \`jellyfin-web\` del servidor.
5. **Banner de Android TV** — el logo del diseño para TV, dirigido con reglas con prefijo \`.layout-tv\`. Nota: solo afecta a clientes de TV basados en web; la app nativa de Android TV no carga Custom CSS.

Cada ranura acepta **URL o subida** (las subidas se incrustan como data URI) y muestra siempre una **miniatura de vista previa** cuando hay imagen. Los SVG de la búsqueda de logos del Catálogo también funcionan — se pueden recolorear antes de aplicar.`
  },
  {
    id: 'components',
    title: 'Componentes',
    md: `# Componentes

Control fino sobre los bloques de la interfaz de Jellyfin:

## Tipografía
- **Fuente** — fuentes web seleccionadas (cargadas con \`@import\` desde Google Fonts) o una cadena \`font-family\` propia. Las fuentes de iconos están protegidas: Material Icons sigue renderizando.
- **Tamaño del texto** — escala \`html { font-size }\` del 80 % al 130 %. Jellyfin mide todo en em, así que toda la interfaz escala proporcionalmente.

## Botones
- **Radio de esquinas** 0–28 px, **estilo de relleno** (relleno / contorno / tinte suave) y **efecto hover** (aclarar, elevar, brillo, ninguno).

## Tarjetas
- **Radio de esquinas** para pósteres y miniaturas (\`.cardBox\`, \`.cardImageContainer\`, …).
- **Efecto hover** — elevar (subida + sombra), brillo (halo de acento), zoom (escala de imagen) o ninguno.

## Barras de progreso
- **Estilo**: plano, redondeado, brillo o rayado; **altura** 2–16 px. Se aplica a las barras de reanudar en tarjetas (\`.itemProgressBar\`) — el deslizador del reproductor sigue el color de acento.

## Marco de la interfaz
- **Cabecera**: sólida, totalmente transparente o cristal esmerilado (\`backdrop-filter\`).
- **Menú lateral**: sólido, flotante (separado, redondeado, con sombra) o translúcido con desenfoque.
- **Pestaña activa**: subrayado, píldora o bloque resaltado.
- **Velocidad de animación**: apagada / lenta / normal / rápida — escala todas las transiciones; «apagada» desactiva también las animaciones propias de Jellyfin.`
  },
  {
    id: 'editor',
    title: 'Editor de código',
    md: `# Editor de código

El panel derecho muestra el **CSS generado completo en texto plano** — con resaltado de sintaxis, números de línea y totalmente editable. Cada pulsación se refleja en la vista previa tras una pausa de ~0,3 s.

## Cómo conviven las ediciones y el constructor

El documento tiene dos regiones, separadas por una línea de comentario marcador:

- **Sobre el marcador** — el bloque generado. *Puedes* editarlo libremente; tu versión editada se usa para vista previa y exportación. El editor muestra entonces la etiqueta **«editado»**: tu versión manual sigue activa **hasta que cambies cualquier control del constructor**, lo que regenera el bloque. Pulsa **Regenerar** en la etiqueta para descartar las ediciones manuales a propósito.
- **Bajo el marcador** — tu espacio. Todo lo de aquí **siempre sobrevive** a los cambios del constructor. Los temas de la comunidad, los snippets y tus propias reglas van aquí.

## Consejos

- Las líneas \`@import\` se elevan automáticamente al principio del archivo exportado (CSS exige los imports antes de cualquier otra regla), sin importar dónde las escribas.
- Si borras la línea del marcador, todo el documento se trata como anulación manual — el constructor deja de reescribir hasta que pulses Regenerar.
- Usa el conmutador de vistas mientras editas: los selectores del reproductor (\`.videoOsdBottom\`, \`.mdl-slider-*\`) solo se ven en la vista Reproductor.`
  },
  {
    id: 'catalog',
    title: 'Catálogo',
    md: `# Catálogo

Cinco fuentes de material listo para usar:

## Presets
Doce temas AnvilCSS integrados (paleta + ajustes de componentes). Aplicar uno **reemplaza** tu estado actual del constructor — Deshacer te devuelve atrás.

## Temas de la comunidad
Temas completos seleccionados de la lista [awesome-jellyfin](https://github.com/awesome-jellyfin/awesome-jellyfin) (Scyfin, Catppuccin, JellySkin, Ultrachromic, ElegantFin, …). **Importar** añade una línea \`@import url(…)\` a tu región de CSS personalizado — el tema se carga desde su CDN en la vista previa y después en Jellyfin. Tus ajustes del constructor siguen activos encima, así que puedes combinar una base de la comunidad con tu propio color de acento. Cada tarjeta muestra créditos y enlace al repositorio.

## Snippets
Pequeños ajustes CSS autónomos (ocultar marcas de visto, retratos redondos del reparto, barras de desplazamiento finas, …). Se añaden como texto plano a la región personalizada, donde puedes editarlos.

## Fondos — Wallhaven
Explora la API de **Wallhaven.cc**. Sin término de búsqueda obtienes la **lista top de 7 días**; los resultados se guardan en disco durante 7 días para respetar la API. Cada tarjeta muestra la resolución, los chips de color que reporta Wallhaven y el **subidor (artista) con enlace a su perfil**. Acciones: poner de fondo o extraer una paleta.

## Logos — Iconify
Busca en la API de **Iconify** entre más de 200 000 iconos open source. Elige una ranura de destino y un color, haz clic en un icono — se descarga como SVG, se recolorea, se convierte a data URI y se asigna a la ranura de logo.`
  },
  {
    id: 'pool',
    title: 'Banco de temas',
    md: `# Banco de temas

El banco es tu biblioteca local de temas.

- **Guardar** almacena el estado actual completo (todos los paneles + CSS personalizado) con un nombre.
- **Cargar** aplica un tema guardado al constructor (tu trabajo actual se reemplaza — Deshacer funciona).
- **Sobrescribir** actualiza un tema guardado con el estado actual.
- **Renombrar** y **Eliminar** gestionan la lista.

## ¿Dónde se guarda?

En el servidor de AnvilCSS, en \`data/themes.json\` — un archivo JSON plano en disco. Sobrevive a reinicios, se respalda trivialmente y se puede copiar entre máquinas. Si ejecutas AnvilCSS en Docker, la carpeta \`data/\` es el volumen a persistir.

**Nota:** los temas guardados incluyen las imágenes subidas (como data URI), así que un banco con muchos temas cargados de imágenes puede crecer bastante. No pasa nada — es tu disco — pero tenlo en cuenta al hacer copias.`
  },
  {
    id: 'export',
    title: 'Exportar e instalar',
    md: `# Exportar e instalar

## Exportar

- **Copiar CSS** pone el tema completo en el portapapeles.
- **Descargar** guarda \`jellyfin-theme.css\`.
- El **indicador de tamaño** se actualiza en vivo. Los temas de solo color ocupan unos pocos KB; las imágenes incrustadas (subidas) dominan el tamaño. Por encima de **1 MB** aparece un aviso — Jellyfin acepta CSS grande, pero cada cliente lo descarga en cada carga: cuanto más ligero, mejor.

## Instalar para todo el servidor (todos los usuarios)

1. Abre Jellyfin como administrador.
2. **Panel de control → General**.
3. Baja hasta **CSS personalizado**, pega el tema.
4. **Guardar** — los clientes conectados cambian de estilo al recargar.

## Instalar por usuario

**Ajustes → Pantalla → CSS personalizado** aplica un tema solo a una cuenta, y puede además *anular* el tema del servidor si marcas «desactivar el CSS proporcionado por el servidor».

## ¿A qué clientes afecta?

El Custom CSS funciona en todo cliente que incruste jellyfin-web: navegadores, la app de escritorio (Jellyfin Media Player) y clientes de TV basados en webview. Las apps totalmente nativas (pantallas nativas de las apps móviles, Android TV nativo) lo ignoran.`
  },
  {
    id: 'limitations',
    title: 'Límites y honestidad',
    md: `# Límites y honestidad

Cosas que el Custom CSS **no puede** hacer por principio — ninguna herramienta puede, esta incluida:

- **Favicon** — lo sirve el servidor antes de que cargue el CSS. Reemplaza \`favicon.ico\` en la carpeta \`jellyfin-web\` (el panel Logos lo explica en su sitio).
- **El primer fotograma del splash** — la pantalla de carga aparece un instante antes de que tu CSS se descargue; el fondo original puede verse brevemente.
- **Apps nativas** — la app nativa de Android TV y las pantallas nativas de las apps móviles no renderizan CSS web.
- **Plantillas de correo, imágenes de metadatos** — quedan fuera del DOM de la interfaz web.

Y notas honestas sobre la vista previa:

- La vista previa es una **réplica fiel**, no un jellyfin-web incrustado. Los nombres de clase, el anidamiento del DOM y los colores por defecto proceden del cliente real (verificados contra jellyfin-web 10.10), pero selectores exóticos de temas de terceros pueden apuntar a elementos que la réplica no incluye. El CSS exportado funciona igualmente en el Jellyfin real — la réplica simplemente no puede mostrarlo todo.
- Los temas de la comunidad cargados con \`@import\` pueden verse ligeramente distintos en la vista previa que en un Jellyfin completo, por la misma razón.`
  }
];
