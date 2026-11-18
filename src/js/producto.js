import { guardarCarrito, estado } from './estado.js';
import { modal, cerrarModal, agregarCarrito, modalProducto, modalDescripcion, modalPrecio, modalImagen, cantidadProducto, personalizacionProducto, colorProducto, tallaProducto, tipoCamisa, tipoPlaca, campoTipoCamisa, campoTipoPlaca, campoTalla } from './elementos.js';
import { dinero } from './formato.js';
import { actualizarCarrito, abrirCarritoModal } from './carrito.js';

document.querySelectorAll(
    ".btn-ver-producto"
).forEach(function (boton) {

    boton.addEventListener(
        "click",
        function () {

            const tarjeta =
                boton.closest(
                    ".producto-card"
                );

            let imagen = "";

            if (tarjeta) {

                const imagenElemento =
                    tarjeta.querySelector(
                        ".imagen-principal, .producto-image img"
                    );

                if (imagenElemento) {

                    imagen =
                        imagenElemento.src;

                }

            }

            estado.productoActual = {

                nombre:
                    boton.dataset.producto,

                precio:
                    Number(
                        boton.dataset.precio
                    ),

                descripcion:
                    boton.dataset.descripcion,

                imagen:
                    imagen

            };

            modalProducto.textContent =
                estado.productoActual.nombre;

            modalDescripcion.textContent =
                estado.productoActual.descripcion;

            modalPrecio.textContent =
                dinero(
                    estado.productoActual.precio
                );

            modalImagen.src =
                estado.productoActual.imagen;

            modalImagen.alt =
                estado.productoActual.nombre;

            campoTipoCamisa.style.display =
                "none";

            campoTipoPlaca.style.display =
                "none";

            campoTalla.style.display =
                "none";

            if (
                estado.productoActual.nombre ===
                "Camisas"
            ) {

                campoTipoCamisa.style.display =
                    "block";

                campoTalla.style.display =
                    "block";

                tallaProducto.value =
                    "M";

            }

            if (
                estado.productoActual.nombre ===
                "Placas"
            ) {

                campoTipoPlaca.style.display =
                    "block";

                actualizarPrecioPlaca();

            }

            cantidadProducto.value = 1;

            colorProducto.value =
                "No especificado";

            personalizacionProducto.value = "";

            modal.classList.add(
                "activo"
            );

            document.body.classList.add(
                "bloqueado"
            );

        }
    );

});

function actualizarPrecioPlaca() {

    if (
        !estado.productoActual ||
        estado.productoActual.nombre !== "Placas"
    ) {

        return;

    }

    const opcion =
        tipoPlaca.options[
            tipoPlaca.selectedIndex
        ];

    const precio =
        Number(
            opcion.dataset.precio
        );

    estado.productoActual.precio =
        precio;

    modalPrecio.textContent =
        dinero(precio);

}

tipoPlaca.addEventListener(
    "change",
    actualizarPrecioPlaca
);

function cerrarProducto() {

    modal.classList.remove(
        "activo"
    );

    document.body.classList.remove(
        "bloqueado"
    );

}

cerrarModal.addEventListener(
    "click",
    cerrarProducto
);

agregarCarrito.addEventListener(
    "click",
    function () {

        if (!estado.productoActual) {
            return;
        }

        const cantidad =
            Number(
                cantidadProducto.value
            );

        if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
            alert("Selecciona una cantidad entre 1 y 99.");
            cantidadProducto.focus();
            return;
        }

        let precio =
            estado.productoActual.precio;

        let detalles = [];

        if (
            estado.productoActual.nombre ===
            "Camisas"
        ) {

            detalles.push(
                "Tipo: " +
                tipoCamisa.value
            );

            detalles.push(
                "Talla: " +
                tallaProducto.value
            );

        }

        if (
            estado.productoActual.nombre ===
            "Placas"
        ) {

            detalles.push(
                "Vehículo: " +
                tipoPlaca.value
            );

        }

        if (
            colorProducto.value !==
            "No especificado"
        ) {

            detalles.push(
                "Color: " +
                colorProducto.value
            );

        }

        if (
            personalizacionProducto.value.trim()
        ) {

            detalles.push(
                "Personalización: " +
                personalizacionProducto.value.trim()
            );

        }

        const producto = {

            id:
                Date.now(),

            nombre:
                estado.productoActual.nombre,

            precio:
                precio,

            cantidad:
                cantidad,

            imagen:
                estado.productoActual.imagen,

            detalles:
                detalles

        };

        estado.carrito.push(
            producto
        );

        guardarCarrito();
        actualizarCarrito();

        cerrarProducto();

        abrirCarritoModal();

    }
);

export { actualizarPrecioPlaca, cerrarProducto };
