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



    

