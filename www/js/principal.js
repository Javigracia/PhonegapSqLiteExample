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
    tx.executeSql('CREATE TABLE IF NOT EXISTS User(UserId INTEGER PRIMARY KEY AUTOINCREMENT, FirstName TEXT NOT NULL, LastName TEXT NOT NULL)',
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
  db.transaction(function (transaction) {
    transaction.executeSql('SELECT * FROM User;', [],
      function (transaction, result) {
        if (result != null && result.rows != null) {
          for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            $('#databaseTable').append('<br>' + row.UserId + '. ' +
              row.FirstName + ' ' + row.LastName);
          }
        }
      }, errorHandler);
  }, errorHandler, nullHandler);
  return;
}

function AddValueToDB() {
  if (!window.openDatabase) {
    alert('Databases are not supported in this browser.');
    return;
  }

  var textName = $('#txFirstName').val();
  var textLastName = $('#txLastName').val();
  if (!isEmptyOrSpaces(textName) && !isEmptyOrSpaces(textLastName)) {
    db.transaction(function (transaction) {
      transaction.executeSql('INSERT INTO User(FirstName, LastName) VALUES (?,?)', [$('#txFirstName').val(), $('#txLastName').val()],
        nullHandler, errorHandler);
    });

    ListDBValues();
    return false;
  } else {
    alert('Algun campo esta vacío o en blanco');
  }
}

function SearchTittle() {
  if (!window.openDatabase) {
    alert('Databases are not supported in this browser.');
    return;
  }

  $('#databaseTable').html('');
  var textSearch = $('#buscarTitulo').val();
  db.transaction(function (transaction) {
    transaction.executeSql('SELECT * FROM User where FirstName LIKE "%' + textSearch + '%";', [],
      function (transaction, result) {
        if (result != null && result.rows != null) {
          for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            $('#databaseTable').append('<br><a href="editTittle.html?id=' + row.UserId + '">' + row.UserId + '. ' +
              row.FirstName + ' ' + row.LastName + '</a>');
          }
        }
      }, errorHandler);
  }, errorHandler, nullHandler);
  return;
}

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}