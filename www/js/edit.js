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

    $('#databaseEditTable').html('');
    var tittleId = getParameterByName('id');
    if (tittleId != 0) {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Movies where MovieId LIKE "' + tittleId + '";', [],
                function (tx, result) {
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            $('#databaseEditTable').append('<br><label>Id</label><br><input class="form-control" id="txEditId" type="text" value="' + 
                            row.MovieId + '" readonly><br><label>Tittle</label><br><input class="form-control" id="txEditTittle" type="text" value="' + 
                            row.Tittle + '"><br><label>Last Chapter</label><br><input class="form-control" id="txEditLastChapter" type="text" value="' + row.LastChapter +
                             '"><br><label>Saw</label><br><input class="form-control" id="txEditSaw" placeholder="Yes or No" type="text" value="' + row.Saw +
                             '"><br><label>Downloaded</label><br><input class="form-control" id="txEditDownloaded" placeholder="Yes or No" type="text" value="' + row.Downloaded +
                             '"><br><label>Where is stored</label><br><input class="form-control" id="txEditWhereStored" type="text" value="' + row.WhereStored +
                             '"><br><label>Description</label><br><textarea class="descriptionBox form-control" id="txEditDescription">'+row.Description+'</textarea><br><br><div style="display: flex; justify-content: space-between"><input class="btn btn-primary" type="button" value="Back" onClick="BackView()"><input class="btn btn-primary" type="button" value="Update" onClick="UpdateTittle()"><input class="btn btn-danger" type="button" value="Delete" onClick="DeleteTittle()"></div>');
                        }
                    }
                }, errorHandler);
        }, errorHandler, nullHandler);
        return;
    } else {
        $('#databaseEditTable').append('<br><label>Tittle</label><br><input class="form-control" id="txEditTittle" type="text" placeholder="Tittle of movie or serie"><br><label>Last Chapter</label><br><input class="form-control" id="txEditLastChapter" class="form-control" type="text" placeholder="Last chapter saw"><br><label>Saw</label><br><input class="form-control" id="txEditSaw" placeholder="Yes or No" type="text"><br><label>Downloaded</label><br><input placeholder="Yes or No" class="form-control" id="txEditDownloaded" type="text"><br><label>Where is stored</label><br><input class="form-control" id="txEditWhereStored" type="text" placeholder="Which pendrive or hard disk"><br><label>Description</label><br><textarea class="descriptionBox form-control" id="txEditDescription" placeholder="Write a description of the movie or serie for remain it"></textarea><br><br><div style="display: flex; justify-content: space-between"><input class="btn btn-primary" type="button" value="Back" onClick="BackView()"><input class="btn btn-primary" type="button" value="Save" onClick="SaveTittle()"></div>');
    }
}

function SaveTittle() {
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }

    var textTittle = $('#txEditTittle').val().toLowerCase();
    var textLastChapter = $('#txEditLastChapter').val();
    var textSaw = $('#txEditSaw').val().toLowerCase();
    var textDownloaded = $('#txEditDownloaded').val().toLowerCase();
    var textWhereStored = $('#txEditWhereStored').val().toLowerCase();
    var textDescription = $('#txEditDescription').val().toLowerCase();
    if (!isEmptyOrSpaces(textTittle) && !isEmptyOrSpaces(textSaw) && !isEmptyOrSpaces(textDownloaded)) {
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO Movies(Tittle, LastChapter, Saw, Downloaded, WhereStored, Description) VALUES (?,?,?,?,?,?)', [textTittle,textLastChapter,textSaw,textDownloaded,textWhereStored,textDescription],
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
        tx.executeSql('DELETE FROM Movies where MovieId=?', [deleteById],
            nullHandler, errorHandler);
    });
    window.history.back();
}

function UpdateTittle() {
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }

    var textTittle = $('#txEditTittle').val().toLowerCase();
    var textLastChapter = $('#txEditLastChapter').val();
    var textSaw = $('#txEditSaw').val().toLowerCase();
    var textDownloaded = $('#txEditDownloaded').val().toLowerCase();
    var textWhereStored = $('#txEditWhereStored').val().toLowerCase();
    var textDescription = $('#txEditDescription').val().toLowerCase();
    var selectedId = getParameterByName("id");
    if (!isEmptyOrSpaces(textTittle) && !isEmptyOrSpaces(textSaw) && !isEmptyOrSpaces(textDownloaded)) {
        db.transaction(function (tx) {
            tx.executeSql('UPDATE Movies SET Tittle=?, LastChapter=?, Saw=?, Downloaded=?,WhereStored=?, Description=? where MovieId=?', [textTittle, textLastChapter, textSaw, textDownloaded, textWhereStored, textDescription, selectedId], nullHandler, errorHandler);
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