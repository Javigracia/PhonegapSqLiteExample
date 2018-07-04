var db;
var shortName = 'MoviesSqlDB';
var version = '1.0';
var displayName = 'MoviesSqlDB';
var maxSize = 65535;

function errorHandler(transaction, error) {
  alert('Error: ' + error.message + ' code: ' + error.code);
}

function successCallBack() {
  //alert("DEBUGGING: success");
}

function nullHandler() { };

function onBodyLoad() {
  //alert("DEBUGGING: we are in the onBodyLoad() function");
  $('#buscarTitulo').val('');
  if (!window.openDatabase) {
    alert('Databases are not supported in this browser.');
    return;
  }

  db = openDatabase(shortName, version, displayName, maxSize);

  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Movies(MovieId INTEGER PRIMARY KEY AUTOINCREMENT, Tittle TEXT NOT NULL, LastChapter INTEGER, Saw NCHAR NOT NULL, Description VARCHAR, WhereStored NCHAR, Downloaded NCHAR NOT NULL)',
      [], nullHandler, errorHandler);
  }, errorHandler, successCallBack);
  ListDBValues();
}

function ListDBValues() {
  if (!window.openDatabase) {
    alert('Databases are not supported in this browser.');
    return;
  }

  $('#databaseTable').html('');
  var tabla = document.createElement("table");
  tabla.className="table";
  var tblHead = document.createElement("thead");
  var fila = document.createElement("tr");

  var celdaHeader = document.createElement("th");
  var textTblHead = document.createTextNode("Id");
  celdaHeader.appendChild(textTblHead);
  fila.appendChild(celdaHeader);
  var celdaHeader = document.createElement("th");
  textTblHead = document.createTextNode("Tittle");
  celdaHeader.appendChild(textTblHead);
  fila.appendChild(celdaHeader);
  var celdaHeader = document.createElement("th");
  textTblHead = document.createTextNode("Saw");
  celdaHeader.appendChild(textTblHead);
  fila.appendChild(celdaHeader);
  var celdaHeader = document.createElement("th");
  textTblHead = document.createTextNode("Downloaded");
  celdaHeader.appendChild(textTblHead);
  fila.appendChild(celdaHeader);

  tblHead.appendChild(fila);
  tabla.appendChild(tblHead);

  var tblBody = document.createElement("tbody");
  db.transaction(function (transaction) {
    transaction.executeSql('SELECT * FROM Movies;', [],
      function (transaction, result) {
        if (result != null && result.rows != null) {
          for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            var filabody = document.createElement("tr");

            var celdabody = document.createElement("td");
            var textoFila = document.createTextNode(row.MovieId);
            celdabody.appendChild(textoFila);
            filabody.appendChild(celdabody);
            var celdabody = document.createElement("td");
            var textoFila = document.createTextNode(row.Tittle);
            celdabody.appendChild(textoFila);
            filabody.appendChild(celdabody);
            var celdabody = document.createElement("td");
            if(row.Saw=="yes"){
              var spanYes = document.createElement("span");
              spanYes.className="fa fa-check";
              celdabody.appendChild(spanYes);
            }else{
              var spanNo = document.createElement("span");
              spanNo.className="fa fa-close";
              celdabody.appendChild(spanNo);
            }
            filabody.appendChild(celdabody);
            var celdabody = document.createElement("td");
            if(row.Downloaded=="yes"){
              var spanYes = document.createElement("span");
              spanYes.className="fa fa-check";
              celdabody.appendChild(spanYes);
            }else{
              var spanNo = document.createElement("span");
              spanNo.className="fa fa-close";
              celdabody.appendChild(spanNo);
            }
            filabody.appendChild(celdabody);

            tblBody.appendChild(filabody);
            tabla.appendChild(tblBody);
          }
        }
      }, errorHandler);
  }, errorHandler, nullHandler);
  document.getElementById('databaseTable').appendChild(tabla);
  return;
}

function SearchTittle() {
  if (!window.openDatabase) {
    alert('Databases are not supported in this browser.');
    return;
  }

  $('#databaseTable').html('');
  var textSearch = $('#buscarTitulo').val();
  db.transaction(function (transaction) {
    transaction.executeSql('SELECT * FROM Movies where Tittle LIKE "%' + textSearch + '%";', [],
      function (transaction, result) {
        if (result != null && result.rows != null) {
          for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            $('#databaseTable').append('<br><a href="editTittle.html?id=' + row.MovieId + '">' + row.MovieId + '. ' +
              row.Tittle + '</a>');
          }
        }
      }, errorHandler);
  }, errorHandler, nullHandler);
  return;
}

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}