const modal =
    document.getElementById("productoModal");

const carritoModal =
    document.getElementById("carritoModal");

const clienteModal =
    document.getElementById("clienteModal");

const abrirCarrito =
    document.getElementById("abrirCarrito");

const menuToggle = document.getElementById("menuToggle");
const menuPrincipal = document.getElementById("menuPrincipal");

function cerrarMenuMovil() {
    if (!menuToggle || !menuPrincipal) return;
    menuPrincipal.classList.remove("nav-abierto");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
}

if (menuToggle && menuPrincipal) {
    menuToggle.addEventListener("click", function () {
        const abierto = menuPrincipal.classList.toggle("nav-abierto");
        menuToggle.setAttribute("aria-expanded", String(abierto));
        menuToggle.setAttribute("aria-label", abierto ? "Cerrar menú de navegación" : "Abrir menú de navegación");
        menuToggle.innerHTML = abierto
            ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });
    menuPrincipal.querySelectorAll("a").forEach(function (enlace) {
        enlace.addEventListener("click", cerrarMenuMovil);
    });
    window.addEventListener("resize", function () {
        if (window.innerWidth > 950) cerrarMenuMovil();
    });
}

const cerrarCarrito =
    document.getElementById("cerrarCarrito");

const cerrarModal =
    document.getElementById("cerrarModal");

const cerrarCliente =
    document.getElementById("cerrarCliente");

const agregarCarrito =
    document.getElementById("agregarCarrito");

const finalizarPedido =
    document.getElementById("finalizarPedido");

const vaciarCarrito =
    document.getElementById("vaciarCarrito");

const carritoItems =
    document.getElementById("carritoItems");

const carritoTotal =
    document.getElementById("carritoTotal");

const contadorCarrito =
    document.getElementById("contadorCarrito");

const modalProducto =
    document.getElementById("modalProducto");

const modalDescripcion =
    document.getElementById("modalDescripcion");

const modalPrecio =
    document.getElementById("modalPrecio");

const modalImagen =
    document.getElementById("modalImagen");

const cantidadProducto =
    document.getElementById("cantidadProducto");

const personalizacionProducto =
    document.getElementById("personalizacionProducto");

const colorProducto =
    document.getElementById("colorProducto");

const tallaProducto =
    document.getElementById("tallaProducto");

const tipoCamisa =
    document.getElementById("tipoCamisa");

const tipoPlaca =
    document.getElementById("tipoPlaca");

const campoTipoCamisa =
    document.getElementById("campoTipoCamisa");

const campoTipoPlaca =
    document.getElementById("campoTipoPlaca");

const campoTalla =
    document.getElementById("campoTalla");

const formCliente =
    document.getElementById("formCliente");

export { modal, carritoModal, clienteModal, abrirCarrito, menuToggle, menuPrincipal, cerrarMenuMovil, cerrarCarrito, cerrarModal, cerrarCliente, agregarCarrito, finalizarPedido, vaciarCarrito, carritoItems, carritoTotal, contadorCarrito, modalProducto, modalDescripcion, modalPrecio, modalImagen, cantidadProducto, personalizacionProducto, colorProducto, tallaProducto, tipoCamisa, tipoPlaca, campoTipoCamisa, campoTipoPlaca, campoTalla, formCliente };
