import { guardarCarrito, estado } from './estado.js';
import { carritoModal, abrirCarrito, cerrarCarrito, vaciarCarrito, carritoItems, carritoTotal, contadorCarrito } from './elementos.js';
import { dinero, escaparHTML } from './formato.js';

function actualizarCarrito() {

    guardarCarrito();
    carritoItems.innerHTML = "";

    if (
        estado.carrito.length === 0
    ) {

        carritoItems.innerHTML = `

            <div class="carrito-vacio">

                <i class="fa-solid fa-cart-shopping"></i>

                <p>
                    Tu pedido está vacío.
                </p>

            </div>

        `;

        carritoTotal.textContent =
            "L.0";

        contadorCarrito.textContent =
            "0";

        return;

    }

    let total = 0;

    let cantidadTotal = 0;

    estado.carrito.forEach(
        function (producto) {

            const subtotal =
                producto.precio *
                producto.cantidad;

            total += subtotal;

            cantidadTotal +=
                producto.cantidad;

            const detalles =
                producto.detalles.length > 0
                    ? producto.detalles.map(escaparHTML).join(" · ")
                    : "Sin detalles";

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "carrito-item";

            item.innerHTML = `

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >

                <div>

                    <h3>
                        ${producto.nombre}
                    </h3>

                    <p>
                        ${detalles}
                    </p>

                    <div class="carrito-item-precio">

                        ${dinero(subtotal)}

                    </div>

                    <div class="carrito-controles">

                        <button
                            class="menos"
                            data-id="${producto.id}">
                            −
                        </button>

                        <strong>
                            ${producto.cantidad}
                        </strong>

                        <button
                            class="mas"
                            data-id="${producto.id}">
                            +
                        </button>

                        <button
                            class="btn-eliminar"
                            data-id="${producto.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </div>

            `;

            carritoItems.appendChild(
                item
            );

        }
    );

    carritoTotal.textContent =
        dinero(total);

    contadorCarrito.textContent =
        cantidadTotal;

    document.querySelectorAll(
        ".menos"
    ).forEach(function (boton) {

        boton.addEventListener(
            "click",
            function () {

                cambiarCantidad(
                    Number(
                        boton.dataset.id
                    ),
                    -1
                );

            }
        );

    });

    document.querySelectorAll(
        ".mas"
    ).forEach(function (boton) {

        boton.addEventListener(
            "click",
            function () {

                cambiarCantidad(
                    Number(
                        boton.dataset.id
                    ),
                    1
                );

            }
        );

    });

    document.querySelectorAll(
        ".btn-eliminar"
    ).forEach(function (boton) {

        boton.addEventListener(
            "click",
            function () {

                const id =
                    Number(
                        boton.dataset.id
                    );

                estado.carrito =
                    estado.carrito.filter(
                        function (producto) {

                            return producto.id !== id;

                        }
                    );

                actualizarCarrito();

            }
        );

    });

}

function cambiarCantidad(
    id,
    cambio
) {

    const producto =
        estado.carrito.find(
            function (item) {

                return item.id === id;

            }
        );

    if (!producto) {
        return;
    }

    producto.cantidad +=
        cambio;

    if (
        producto.cantidad <= 0
    ) {

        estado.carrito =
            estado.carrito.filter(
                function (item) {

                    return item.id !== id;

                }
            );

    }

    actualizarCarrito();

}

function abrirCarritoModal() {

    carritoModal.classList.add(
        "activo"
    );

    document.body.classList.add(
        "bloqueado"
    );

}

abrirCarrito.addEventListener(
    "click",
    abrirCarritoModal
);

cerrarCarrito.addEventListener(
    "click",
    function () {

        carritoModal.classList.remove(
            "activo"
        );

        document.body.classList.remove(
            "bloqueado"
        );

    }
);

vaciarCarrito.addEventListener(
    "click",
    function () {

        if (
            estado.carrito.length === 0
        ) {

            return;

        }

        if (
            confirm(
                "¿Quieres vaciar todo el pedido?"
            )
        ) {

            estado.carrito = [];

            actualizarCarrito();

        }

    }
);

export { actualizarCarrito, cambiarCantidad, abrirCarritoModal };
