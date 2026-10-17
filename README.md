# TiendaMGR

Sitio de Creaciones Style MG-R con catálogo, personalización de productos, carrito en el navegador y pedidos por WhatsApp.

## Despliegue con Docker

Requiere Git, Docker Engine y el complemento Docker Compose en el servidor.

```bash
git clone https://github.com/kevinhndz/TiendaMGR.git
cd TiendaMGR
sudo docker compose up -d --build
```

Abre `http://IP_DEL_SERVIDOR`. El puerto TCP 80 debe estar permitido en el firewall.

```bash
sudo docker compose ps
sudo docker compose logs --tail=100 web
```

## HTTPS con un dominio

Apunta el registro DNS A del dominio a la IP del servidor y permite los puertos TCP 80 y 443. Reemplaza `:80` en `Caddyfile` por tu dominio real, por ejemplo `tienda.example.com`, conservando el resto del bloque. Publica el cambio y reconstruye el contenedor. Caddy gestionará el certificado y su renovación; los volúmenes conservan sus datos.

## Actualizar el sitio

Después de publicar los cambios en GitHub, ejecuta desde la carpeta del proyecto en el servidor:

```bash
git pull --ff-only
sudo docker compose up -d --build
```

Los archivos del sitio se copian dentro de la imagen, por lo que cada actualización requiere reconstruirla.

## Archivos de despliegue

- `Dockerfile`: prepara la imagen de Caddy y copia los archivos públicos.
- `Caddyfile`: configura el servidor de archivos estáticos; inicialmente usa HTTP por IP.
- `docker-compose.yml`: configura el servicio, los puertos, el reinicio automático, los volúmenes y el límite de registros.
- `.dockerignore`: excluye archivos innecesarios del contexto de construcción.
- `.gitignore`: excluye configuraciones locales, secretos y archivos temporales del repositorio.

El sitio no necesita base de datos ni dependencias de Node.js. El carrito se conserva únicamente en el navegador de cada visitante.
