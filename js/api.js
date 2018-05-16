var datosURL = "https://gobiernoabierto.cordoba.gob.ar";

var datosTask = new Promise(function (resolve, reject) {
    var today = new Date().toLocaleDateString();

    if (localStorage.datosData == null || localStorage.datosData == "null" || localStorage.datosData == "undefined" || localStorage.userDate != today ) {
        d3.json(datosURL + "/api/categorias-datos-abiertos/?format=json&page_size=10s0", function (error, datos) {
            if (error) reject(error);
            resolve(datos);
            localStorage.datosData = JSON.stringify(datos);
        });
    } else {
        resolve(JSON.parse(localStorage.datosData));
    }
    localStorage.userDate = today;
});

function getApiUrl() {
    return datosURL;
}
