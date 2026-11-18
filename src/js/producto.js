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



    

