var db;
var shortName = 'MoviesSqlDB';
var version = '1.0';
var displayName = 'MoviesSqlDB';
var maxSize = 65535;

function errorHandler(tx, error) {
    alert('Error: ' + error.message + ' code: ' + error.code);
}

function successCallBack(tx) {
    //alert("DEBUGGING: success");
}

function nullHandler() { };

function onBodyLoad() {
    //alert("DEBUGGING: we are in the onBodyLoad() function");
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

    $('#databaseEditTable').html('');
    var tittleId = getParameterByName('id');
    if (tittleId != 0) {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM User where UserId LIKE "' + tittleId + '";', [],
                function (tx, result) {
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            $('#databaseEditTable').append('<br><label>UserId</label><input id="txEditId" type="text" value="' + row.UserId + '" readonly><br><label>Nombre</label><input id="txEditName" type="text" value="' + row.FirstName + '"><br><label>Apellido</label><input id="txEditLastName" type="text" value="' + row.LastName + '"><br><input type="button" value="Back" onClick="BackView()"><input type="button" value="Update" onClick="UpdateTittle()"><input type="button" value="Delete" onClick="DeleteTittle()">');
                        }
                    }
                }, errorHandler);
        }, errorHandler, nullHandler);
        return;
    } else {
        $('#databaseEditTable').append('<br><label>Nombre</label><input id="txEditName" type="text" value=""><br><label>Apellido</label><input id="txEditLastName" type="text" value=""><br><input type="button" value="Back" onClick="BackView()"><input type="button" value="Save" onClick="SaveTittle()">');
    }
}

function SaveTittle() {
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }

    var textName = $('#txEditName').val();
    var textLastName = $('#txEditLastName').val();
    if (!isEmptyOrSpaces(textName) && !isEmptyOrSpaces(textLastName)) {
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO User(FirstName, LastName) VALUES (?,?)', [$('#txEditName').val(), $('#txEditLastName').val()],
                nullHandler, errorHandler);
        });
        window.history.back();
        // return false;
    } else {
        alert('Algun campo esta vacío o en blanco');
    }
}

function DeleteTittle() {
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }

    var deleteById = getParameterByName("id");
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM User where UserId=?', [deleteById],
            nullHandler, errorHandler);
    });
    window.history.back();
}

function UpdateTittle() {
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }

    var textName = $('#txEditName').val();
    var textLastName = $('#txEditLastName').val();
    var selectedId = getParameterByName("id");
    if (!isEmptyOrSpaces(textName) && !isEmptyOrSpaces(textLastName)) {
        db.transaction(function (tx) {
            tx.executeSql('UPDATE User SET FirstName=?, LastName=? where UserId=?', [textName, textLastName, selectedId], nullHandler, errorHandler);
        });
        window.history.back();
        // return false;
    } else {
        alert('Algun campo esta vacío o en blanco');
    }
}

function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

function BackView() {
    window.history.back();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}