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



    

    function dinero(numero) {
        return "L." + Number(numero).toLocaleString("es-HN");
    }

    function escaparHTML(valor) {
        return String(valor).replace(/[&<>"']/g, function (caracter) {
            return ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[caracter];
        });
    }



    

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


                productoActual = {

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
                    productoActual.nombre;


                modalDescripcion.textContent =
                    productoActual.descripcion;


                modalPrecio.textContent =
                    dinero(
                        productoActual.precio
                    );


                modalImagen.src =
                    productoActual.imagen;


                modalImagen.alt =
                    productoActual.nombre;


                

                campoTipoCamisa.style.display =
                    "none";

                campoTipoPlaca.style.display =
                    "none";

                campoTalla.style.display =
                    "none";


                

                if (
                    productoActual.nombre ===
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
                    productoActual.nombre ===
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
            !productoActual ||
            productoActual.nombre !== "Placas"
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


        productoActual.precio =
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


            if (!productoActual) {
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
                productoActual.precio;


            let detalles = [];


            

            if (
                productoActual.nombre ===
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
                productoActual.nombre ===
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
                    productoActual.nombre,

                precio:
                    precio,

                cantidad:
                    cantidad,

                imagen:
                    productoActual.imagen,

                detalles:
                    detalles

            };


            carrito.push(
                producto
            );

            guardarCarrito();
            actualizarCarrito();

            cerrarProducto();


            abrirCarritoModal();

        }
    );



    

    function actualizarCarrito() {

        guardarCarrito();
        carritoItems.innerHTML = "";


        if (
            carrito.length === 0
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


        carrito.forEach(
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


                    carrito =
                        carrito.filter(
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
            carrito.find(
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

            carrito =
                carrito.filter(
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
                carrito.length === 0
            ) {

                return;

            }


            if (
                confirm(
                    "¿Quieres vaciar todo el pedido?"
                )
            ) {

                carrito = [];

                actualizarCarrito();

            }

        }
    );



    

    finalizarPedido.addEventListener(
        "click",
        function () {


            if (
                carrito.length === 0
            ) {

                alert(
                    "Agrega al menos un producto al pedido."
                );

                return;

            }


            carritoModal.classList.remove(
                "activo"
            );


            clienteModal.classList.add(
                "activo"
            );

        }
    );



    

    cerrarCliente.addEventListener(
        "click",
        function () {

            clienteModal.classList.remove(
                "activo"
            );

            document.body.classList.remove(
                "bloqueado"
            );

        }
    );



    

    formCliente.addEventListener(
        "submit",
        function (evento) {


            evento.preventDefault();


            const nombre =
                document.getElementById(
                    "clienteNombre"
                ).value.trim();


            const telefono =
                document.getElementById(
                    "clienteTelefono"
                ).value.trim();


            const ubicacion =
                document.getElementById(
                    "clienteUbicacion"
                ).value.trim();


            const comentario =
                document.getElementById(
                    "clienteComentario"
                ).value.trim();



            let total = 0;


            let mensaje =
                "Hola Creaciones Style MG-R 👋\n\n";


            mensaje +=
                "🛍️ NUEVO PEDIDO\n\n";


            mensaje +=
                "Cliente: " +
                nombre +
                "\n";


            mensaje +=
                "Teléfono: " +
                telefono +
                "\n";


            if (ubicacion) {

                mensaje +=
                    "Ubicación: " +
                    ubicacion +
                    "\n";

            }


            mensaje +=
                "\nPRODUCTOS:\n";



            carrito.forEach(
                function (producto, indice) {


                    const subtotal =
                        producto.precio *
                        producto.cantidad;


                    total += subtotal;


                    mensaje +=
                        "\n" +
                        (indice + 1) +
                        ". " +
                        producto.nombre +
                        "\n";


                    mensaje +=
                        "Cantidad: " +
                        producto.cantidad +
                        "\n";


                    mensaje +=
                        "Precio: " +
                        dinero(
                            producto.precio
                        ) +
                        "\n";


                    mensaje +=
                        "Subtotal: " +
                        dinero(
                            subtotal
                        ) +
                        "\n";


                    if (
                        producto.detalles.length > 0
                    ) {

                        mensaje +=
                            producto.detalles.join(
                                "\n"
                            ) +
                            "\n";

                    }

                }
            );


            mensaje +=
                "\nTOTAL: " +
                dinero(total) +
                "\n";


            if (comentario) {

                mensaje +=
                    "\nComentario:\n" +
                    comentario +
                    "\n";

            }


            mensaje +=
                "\nGracias por su atención.";


            const numeroWhatsApp =
                "50489846442";


            const url =
                "https://wa.me/" +
                numeroWhatsApp +
                "?text=" +
                encodeURIComponent(
                    mensaje
                );


            window.open(
                url,
                "_blank"
            );


            carrito = [];
            guardarCarrito();
            actualizarCarrito();

            formCliente.reset();


            clienteModal.classList.remove(
                "activo"
            );

            document.body.classList.remove(
                "bloqueado"
            );

        }
    );



    

    document.querySelectorAll(
        ".miniatura"
    ).forEach(function (miniatura) {


        miniatura.addEventListener(
            "click",
            function () {


                const nuevaImagen =
                    miniatura.dataset.imagen;


                const galeria =
                    miniatura.closest(
                        ".producto-galeria"
                    );


                const imagenPrincipal =
                    galeria.querySelector(
                        ".imagen-principal"
                    );


                imagenPrincipal.src =
                    nuevaImagen;


                galeria.querySelectorAll(
                    ".miniatura"
                ).forEach(function (item) {

                    item.classList.remove(
                        "activa"
                    );

                });


                miniatura.classList.add(
                    "activa"
                );

            }
        );

    });



    

    document.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Escape"
            ) {

                modal.classList.remove(
                    "activo"
                );

                carritoModal.classList.remove(
                    "activo"
                );

                clienteModal.classList.remove(
                    "activo"
                );

                document.body.classList.remove(
                    "bloqueado"
                );

            }

        }
    );



    

    actualizarCarrito();

});