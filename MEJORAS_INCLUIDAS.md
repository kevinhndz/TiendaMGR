# Creaciones Style MG-R — mejoras incluidas

Esta versión conserva la estructura original del sitio y sus funciones de catálogo, personalización, carrito y pedidos por WhatsApp.

## Mejoras realizadas

- Menú móvil desplegable con botón accesible y cierre al elegir una sección.
- Carrito persistente mediante `localStorage`, para conservar el pedido si se actualiza la página (en el mismo navegador/dispositivo).
- Validación de cantidades entre 1 y 99.
- Escapado de texto de personalización al mostrarlo en el carrito.
- Carga diferida de varias imágenes del catálogo para ayudar al rendimiento.
- Mejoras de accesibilidad: etiquetas ARIA, foco visible y respeto a la preferencia de movimiento reducido.
- Ajustes visuales de tarjetas, botones, navegación y sombras.
- Metadatos básicos para buscadores y vistas previas al compartir el enlace.
- Enlaces externos de WhatsApp con `rel="noopener noreferrer"`.

## Cómo abrir

1. Descomprime la carpeta.
2. Abre `index.html` en un navegador, o utiliza Live Server en Visual Studio Code.
3. Prueba el menú móvil reduciendo el ancho de la ventana.
4. Agrega un producto al carrito, actualiza la página y confirma que sigue en el carrito.
5. Prueba el formulario de pedido. Al enviarlo, se abrirá WhatsApp con el resumen para que el cliente lo revise y lo envíe.

## Importante

- La tienda prepara pedidos por WhatsApp; esta versión no incluye cobros en línea ni base de datos de pedidos.
- Verifica que los números de WhatsApp publicados sean los contactos correctos del negocio antes de hacer pública la página.
- `localStorage` solo conserva el carrito en ese navegador y dispositivo; no es un sistema de inventario ni de pedidos centralizado.
