class Vehiculo {
  constructor(vehiculo_id, vehiculo_marca, vehiculo_modelo, vehiculo_precio) {
    this.id = vehiculo_id;
    this.marca = vehiculo_marca;
    this.modelo = vehiculo_modelo;
    this.precio = vehiculo_precio;
  }
}

class Camioneta extends Vehiculo {
  constructor(
    Camioneta_id,
    Camioneta_marca,
    Camioneta_modelo,
    Camioneta_precio,
    Camioneta_cuatroXcuatro
  ) {
    super(Camioneta_id, Camioneta_marca, Camioneta_modelo, Camioneta_precio);
    this.cuatroXcuatro = Camioneta_cuatroXcuatro;
  }
}
class Auto extends Vehiculo {
  constructor(
    Auto_id,
    Auto_marca,
    Auto_modelo,
    Auto_precio,
    Auto_cantidadPuertas
  ) {
    super(Auto_id, Auto_marca, Auto_modelo, Auto_precio);
    this.cantidadPuertas = Auto_cantidadPuertas;
  }
}

class App {
  static list;

  static async getFromApi() {
    try {
      let response = await fetch("http://localhost:3001/Vehiculos", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.status.toString() == "200") {
        await response.json().then((array) => App.FullList(array));
        App.fillTable(App.list);
      }
    } catch {
      console.log("Error al obtener los elementos");
    }
  }

  static FullList(listaJson) {
    let listaObjetos = new Array();
    listaJson.map(function (element) {
      if (element.hasOwnProperty("cuatroXcuatro")) {
        listaObjetos.push(
          new Camioneta(
            element.id,
            element.make,
            element.model,
            element.price,
            element.cuatroXcuatro
          )
        );
      } else {
        listaObjetos.push(
          new Auto(
            element.id,
            element.make,
            element.model,
            element.price,
            element.cantidadPuertas
          )
        );
      }
    });

    App.list = listaObjetos;
  }

  static fillTable(listaJson) {
    console.log(listaJson);
    for (let i = 0; i < listaJson.length; i++) {
      let fila = document.createElement("tr");
      let CamionetaId = document.createElement("td");
      let CamionetaNombre = document.createElement("td");
      let CamionetaApellido = document.createElement("td");
      let CamionetaSexo = document.createElement("td");
      let CamionetaEdad = document.createElement("td");
      let tableId = document.createTextNode(listaJson[i].id);
      let tableNombre = document.createTextNode(listaJson[i].marca);
      let tableApellido = document.createTextNode(listaJson[i].modelo);
      let tableEdad = document.createTextNode(listaJson[i].precio);
      let tableTipo;
      if (listaJson[i].hasOwnProperty("cantidadPuertas")) {
        tableTipo = document.createTextNode(listaJson[i].cantidadPuertas);
      } else {
        tableTipo = document.createTextNode(listaJson[i].cuatroXcuatro);
      }
      CamionetaId.appendChild(tableId);
      CamionetaNombre.appendChild(tableNombre);
      CamionetaApellido.appendChild(tableApellido);
      CamionetaSexo.appendChild(tableTipo);
      CamionetaEdad.appendChild(tableEdad);
      fila.appendChild(CamionetaId);
      fila.appendChild(CamionetaNombre);
      fila.appendChild(CamionetaApellido);
      fila.appendChild(CamionetaEdad);
      fila.appendChild(CamionetaSexo);
      fila.addEventListener("click", App.fillForm);
      document.getElementById("table").appendChild(fila);
    }
  }
  static addClient() {
    let nombre = document.getElementById("NombreCliente").value;
    let apellido = document.getElementById("ApellidoCliente").value;
    let edad = document.getElementById("EdadCliente").value;
    let sexo = document.getElementById("SexoCliente").value;
    let id = App.list.reduce((valorAcumulado, valorActual) => {
      if (valorActual.id > valorAcumulado.id) {
        return valorActual;
      } else {
        return valorAcumulado;
      }
    });
    if (nombre == "" || apellido == "" || edad == "" || sexo == "") {
      console.log("Error");
    } else {
        if (sexo == "Camioneta") {
          sexo = true;
          App.list.push(new Camioneta(id.id + 1, nombre, apellido, edad, sexo));
        } else {
          sexo = 4;
          App.list.push(new Auto(id.id + 1, nombre, apellido, edad, sexo));
        }
        App.refreshTable();
        App.fillTable(App.list);
    }
  }
  static fillForm(event) {
    var abm = document.getElementById("abm");
    abm.style.cssText = "visibility: initial;";
    var Camioneta = event.target.parentNode;
    document.getElementById("IdCliente").value =
      Camioneta.children[0].innerHTML;
    document.getElementById("NombreCliente").value =
      Camioneta.children[1].innerHTML;
    document.getElementById("ApellidoCliente").value =
      Camioneta.children[2].innerHTML;
    document.getElementById("SexoCliente").style.cssText = "visibility:hidden;";
    document.getElementById("EdadCliente").value =
      Camioneta.children[3].innerHTML;
  }
  static deleteClient() {
    let id = document.getElementById("IdCliente").value;
    App.list.forEach((element) => {
      if (element.id == id) {
        App.list.splice(App.list.indexOf(element), 1);
        App.refreshTable();
        App.fillTable(App.list);
      } else {
        console.log("El Cliente no existe");
      }
    });
  }
  static refreshTable() {
    var elmtTable = document.getElementById("table");
    var tableRows = elmtTable.getElementsByTagName("tr");
    var rowCount = tableRows.length;
    for (var x = rowCount - 1; x > 0; x--) {
      elmtTable.removeChild(tableRows[x]);
    }
  }
  static calcProm(correct, wrong) {
    var prom = 0;
    try {
      prom = App.list.reduce(
        (previousValue, currentValue) =>
          previousValue + parseInt(currentValue.precio),
        0
      );
      prom = prom / App.list.length;
      correct(prom);
    } catch {
      console.log(wrong);
    }
  }
  static fillPromLabel(prom) {
    document.getElementById("Prom").value = prom;
  }
  static promPromise() {
    var promPromise = new Promise(App.calcProm);
    promPromise.then(App.fillPromLabel).catch("Error");
  }
  static filterTable(correct, wrong) {
    var filtro = document.getElementById("SexoClienteFiltro").value;
    var filterList = App.list.filter((vehiculo) => vehiculo.precio > filtro);
    try {
      App.refreshTable();
      correct(filterList);
    } catch {
      console.log(wrong);
    }
  }
  static filterPromise() {
    var filterPromise = new Promise(App.filterTable);
    filterPromise.then(App.fillTable).catch("Error");
  }
  static showFields(number) {
    var columnaID;
    var stl;
    switch (number) {
      case 0:
        columnaID = document.getElementById("Id");
        break;

      case 1:
        columnaID = document.getElementById("Nombre");
        break;

      case 2:
        columnaID = document.getElementById("Apellido");
        break;
      case 3:
        columnaID = document.getElementById("Sexo");
        break;
      case 4:
        columnaID = document.getElementById("Edad");
        break;
    }
    if (columnaID.checked) {
      stl = "table-cell";
    } else {
      stl = "none";
    }
    var tbl = document.getElementById("table");
    var th = tbl.getElementsByTagName("th");
    var rows = tbl.getElementsByTagName("tr");
    th[number].style.display = stl;
    for (var row = 1; row < rows.length; row++) {
      var cels = rows[row].getElementsByTagName("td");
      cels[number].style.display = stl;
    }
  }
  static closeABM() {
    var abm = document.getElementById("abm");
    abm.style.cssText = "visibility: hidden;";
  }
  static OpenABM() {
    var abm = document.getElementById("abm");
    abm.style.cssText = "visibility: initial;";
  }
}
document.getElementById("Add").addEventListener("click", App.addClient);
document.getElementById("Delete").addEventListener("click", App.deleteClient);
document.getElementById("Clean").addEventListener("click", App.closeABM);
document.getElementById("calc").addEventListener("click", App.promPromise);
document
  .getElementById("SexoClienteFiltro")
  .addEventListener("change", App.filterPromise);
window.addEventListener("load", App.getFromApi);
