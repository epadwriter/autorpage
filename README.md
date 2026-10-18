# Landing del autor

Sitio estático. El contenido se administra desde **Google Sheets**; no hay que tocar código.

## 1. Crear la hoja de cálculo
Crea un Google Sheet con estas 6 hojas (pestañas) y **exactamente** estas columnas en la fila 1:

| Hoja | Columnas |
|---|---|
| `perfil` | `clave`, `valor` → filas: `nombre`, `titulo`, `lema`, `foto`, `bio`, `redes` |
| `libros` | `titulo`, `anio`, `portada`, `sinopsis`, `enlaces` |
| `personajes` | `nombre`, `foto`, `descripcion`, `aparece_en` |
| `galeria` | `foto`, `descripcion` |
| `videos` | `titulo`, `url`, `descripcion` |
| `blog` | `titulo`, `fecha` (AAAA-MM-DD), `foto`, `texto` |

- **Enlaces de compra / redes:** `Amazon|https://...; Kindle|https://...` (etiqueta|url separados por `;`).
- **Párrafos:** separa con una línea en blanco dentro de la celda (Alt/Option+Enter).
- **Imágenes:** cualquier URL directa, o enlace de Google Drive (`Compartir > Cualquier persona con el enlace`). Se convierten automáticamente.
- **Videos:** enlace normal de YouTube.
- Para agregar un libro/foto/video/entrada: añade una fila. Para editar: cambia la celda. Para ocultar: borra la fila.

## 2. Publicar cada hoja
En cada pestaña: **Archivo > Compartir > Publicar en la web** → elige la pestaña → formato **CSV** → Publicar. Copia el enlace y pégalo en `js/config.js`.

Los cambios en la hoja aparecen en la web en unos minutos (caché de Google).

## 3. Subir a Cloudflare
Cloudflare Pages > Create > Upload assets (o conectar el repositorio). Sin build command; directorio de salida: raíz.

Mientras `js/config.js` esté vacío se muestran datos de ejemplo. Para ver el sitio localmente: `python3 -m http.server`.
