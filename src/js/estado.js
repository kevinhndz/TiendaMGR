document.addEventListener("DOMContentLoaded", function () {


    

    const CLAVE_CARRITO = "creacionesStyleMGR_carrito_v1";

    function cargarCarritoGuardado() {
        try {
            const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "[]");
            if (!Array.isArray(guardado)) return [];
            return guardado.filter(item =>
                item && typeof item.nombre === "string" &&
                Number.isFinite(Number(item.precio)) && Number(item.precio) >= 0 &&
                Number.isFinite(Number(item.cantidad)) && Number(item.cantidad) > 0
            ).map(item => ({
                id: item.id || Date.now() + Math.random(),
                nombre: item.nombre,
                precio: Number(item.precio),
                cantidad: Math.max(1, Math.floor(Number(item.cantidad))),
                imagen: typeof item.imagen === "string" ? item.imagen : "",
                detalles: Array.isArray(item.detalles) ? item.detalles.map(String) : []
            }));
        } catch (error) {
            return [];
        }
    }

    function guardarCarrito() {
        try {
            localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
        } catch (error) {
            // El almacenamiento puede estar bloqueado.
        }
    }

    let carrito = cargarCarritoGuardado();

    let productoActual = null;


    

