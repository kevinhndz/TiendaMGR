# TiendaMGR

Sitio de Creaciones Style MG-R con catalogo, personalizacion, carrito local y pedidos por WhatsApp.

## Archivos editables

- `index.html`: plantilla principal corta; incluye las secciones de `src/html/`.
- `src/html/`: cabecera, secciones, productos, modales y pie.
- `src/css/`: diez archivos de estilos. `orden.txt` conserva el orden de la cascada.
- `src/js/`: modulos JavaScript completos con imports y exports. `estado.js` conserva el carrito y el producto seleccionado; `inicio.js` inicia la interfaz.

El navegador carga modulos nativos con `type="module"`. Cada archivo JavaScript tiene sintaxis valida por si mismo. No hay funciones abiertas entre archivos.

## Generar y probar

```bash
python3 scripts/build.py
python3 -m unittest discover -s tests -v
```

La salida se escribe en `public/`, carpeta generada e ignorada por Git. No edites sus archivos. El HTML incluye las secciones antes de publicarse para conservar el contenido disponible desde la primera respuesta HTTP. El CSS conserva la cascada y las rutas originales. JavaScript se publica como modulos separados.

Para ver el sitio localmente:

```bash
python3 -m http.server 8080 --directory public
```

Para probar los flujos en Chromium:

```bash
npm ci
npx playwright install chromium
node tests/browser.cjs
```

Node y Playwright solo se usan para pruebas. No se agregan a la imagen de produccion. Las pruebas cubren productos, cantidades, persistencia, pedido de WhatsApp sin enviarlo, precio de placas, miniaturas y menu movil.

## CI y despliegue existente

`.github/workflows/ci.yml` genera el sitio, comprueba HTML y CSS contra la referencia anterior, verifica la sintaxis de cada modulo y prueba los flujos en Chromium. Tambien construye la imagen Docker y verifica sus respuestas HTTP.

Antes de construir la imagen, ejecuta `python3 scripts/build.py`. El Dockerfile copia los archivos generados de `public/`, conservando `nginx:alpine`, las rutas publicas y el puerto 80. Compose sigue usando `tienda-frontend` y la red externa `red-saas`. La configuracion del Nginx principal se conserva.

El repositorio del servidor esta en `/srv/proyectos/TiendaMGR`. Verifica rama, estado y respaldo antes de actualizar. El CI valida los cambios; no reinicia produccion automaticamente.

## Despliegue continuo

Al fusionar un PR en `main`, el trabajo `validar` debe terminar correctamente antes de ejecutar `desplegar`. El CD usa el artefacto exacto del CI. Los PR y otras ramas no publican en produccion.

El receptor `/usr/local/lib/tiendamgr-cd/server.py` acepta solo los comandos SSH `deploy SHA` y `rollback SHA`. La llave exclusiva esta restringida en `authorized_keys`; GitHub conserva la clave privada como secreto y verifica la identidad SSH del servidor. Los secretos son `TIENDA_DEPLOY_KEY`, `TIENDA_DEPLOY_KNOWN_HOSTS` y la variable `TIENDA_DEPLOY_HOST`.

Cada version publica sus recursos en `/releases/SHA/`. Primero se verifican todos por HTTPS; despues se sustituye `index.html` con un movimiento atomico. Las paginas abiertas conservan sus recursos anteriores. El contenedor y el Nginx principal siguen ejecutandose en `red-saas`.

El servidor guarda respaldos en `/srv/tiendamgr-cd/SHA/` y prepara las imagenes `tiendamgr-backup:SHA` y `tiendamgr-release:SHA`. Actualiza tambien la etiqueta usada por Compose para conservar la version al recrear el contenedor. El repositorio del servidor se sincroniza con `main`.

Si falla la salud HTTP, el receptor revierte la pagina y la imagen automaticamente. Si fallan los flujos de Chromium posteriores, el workflow solicita el rollback. Para una recuperacion manual desde SSH administrativo:

```bash
sudo env SSH_ORIGINAL_COMMAND="rollback SHA_COMPLETO" python3 /usr/local/lib/tiendamgr-cd/server.py
```

Solo se puede revertir la revision actualmente activa. Los respaldos y recursos antiguos se conservan; conviene revisar su espacio antes de eliminarlos. Este CD publica archivos estaticos y conserva la configuracion y la base del contenedor actual. Un cambio de infraestructura necesita su propio procedimiento.

`tests/deploy_integration.py` comprueba publicacion y rollback en un contenedor temporal, incluyendo un fallo simulado despues de activar la pagina. El CI ejecuta esta prueba antes del CD.
