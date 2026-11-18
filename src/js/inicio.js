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