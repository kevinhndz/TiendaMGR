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



    

