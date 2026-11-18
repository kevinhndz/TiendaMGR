# TiendaMGR

Sitio de Creaciones Style MG-R con catalogo, personalizacion, carrito local y pedidos por WhatsApp.

## Editar el sitio

- `src/html/index.html`: estructura principal y orden de las secciones.
- `src/html/`: cabecera, secciones, tarjetas de productos, modales y pie.
- `src/css/`: estilos por responsabilidad. `orden.txt` conserva la cascada original.
- `src/js/`: estado, elementos, formato, producto, carrito, pedido y galeria. `orden.txt` conserva el orden de ejecucion.

Despues de editar los archivos fuente:

```bash
python3 scripts/build.py
python3 -m unittest discover -s tests -v
node --check js/script.js
```

El generador expande `{{ incluir:archivo.html }}` y concatena CSS y JavaScript. Los fragmentos JavaScript comparten el mismo cierre de `DOMContentLoaded`; no son scripts independientes. No hay peticiones adicionales ni dependencias nuevas en el navegador.

Incluye en cada commit los archivos fuente y los generados: `index.html`, `css/estilos.css` y `js/script.js`. Docker sigue copiando los mismos archivos estaticos. No edites directamente los generados.

## Validacion continua

`.github/workflows/ci.yml` se ejecuta en pushes y pull requests. Verifica generacion, recursos locales, sintaxis JavaScript, Compose y HTTP dentro de la imagen Nginx existente. No reinicia servicios de produccion.

`tests/original.json` registra las huellas del sitio anterior a la modularizacion. Un cambio intencional de contenido requiere revisar y actualizar esa referencia; no la regeneres para ocultar una regresion.

## Despliegue existente

La aplicacion usa `nginx:alpine`, el servicio `tienda-frontend` y la red externa `red-saas`. Otro contenedor Nginx recibe el trafico del dominio. Se conservan `Dockerfile` y `docker-compose.yml`.

El servidor mantiene el repositorio en `/srv/proyectos/TiendaMGR`. Antes de actualizar, verifica rama, estado y respaldo. Genera y valida los archivos antes de construir la imagen. La reconstruccion habitual con Compose reemplaza el contenedor y puede producir una interrupcion breve; no ejecutes `docker compose down` para actualizar.
