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
