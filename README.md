# TiendaMGR

Sitio de Creaciones Style MG-R con catalogo, personalizacion, carrito local y pedidos por WhatsApp.

## Archivos editables

- `index.html`: plantilla principal corta; incluye las secciones de `src/html/`.
- `src/html/`: cabecera, secciones, productos, modales y pie.
- `src/css/`: diez archivos de estilos. `orden.txt` conserva el orden de la cascada.
- `src/js/`: modulos JavaScript completos con imports y exports. `estado.js` conserva el carrito y el producto seleccionado; `inicio.js` inicia la interfaz.

El navegador carga modulos nativos con `type="module"`. Cada archivo JavaScript tiene sintaxis valida por si mismo. No hay funciones abiertas entre archivos.


## CI y despliegue existente

`.github/workflows/ci.yml` genera el sitio, comprueba HTML y CSS contra la referencia anterior, verifica la sintaxis de cada modulo y prueba los flujos en Chromium. Tambien construye la imagen Docker y verifica sus respuestas HTTP.

El Dockerfile y Compose conservan exactamente su contenido anterior a la modularizacion. El sitio generado en `public/` contiene las rutas originales `index.html`, `css/`, `js/`, `img/` y el archivo de verificacion.

Para construir con el Dockerfile original se usa `public/` como contexto:

```bash
python3 scripts/build.py --image tiendamgr-tienda-frontend
```

Ese comando construye la imagen y no reinicia servicios. Cuando decidas aplicarla con el Compose existente:

```bash
docker compose up -d --no-build
```

La construccion directa con `docker compose up --build` desde los fuentes copiaria la plantilla sin ensamblar. Usa el comando anterior para preparar la imagen. La recreacion del contenedor puede causar una interrupcion breve.

Se conservan `nginx:alpine`, el puerto 80, `tienda-frontend`, la red externa `red-saas` y la configuracion del Nginx principal.

El repositorio del servidor esta en `/srv/proyectos/TiendaMGR`. Verifica rama, estado y respaldo antes de actualizar. El CI valida los cambios; no reinicia produccion automaticamente.
