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
