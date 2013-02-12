var db;
var dataset;

function initDatabase() {
    console.debug('called initDatabase()');

    try {
        if (!window.openDatabase) {
            alert('not supported');
        } else {
            var shortName = 'MyDatabase';
            var version = '1.0';
            var displayName = 'My Test Database Example';
            var maxSizeInBytes = 65536;
            db = openDatabase(shortName, version, displayName, maxSizeInBytes);

            createTableIfNotExists();
        }
    } catch(e) {
        if (e == 2) {
            alert('Invalid database version');
        } else {
            alert('Unknown error ' + e);
        }
        return;
    }
}

function createTableIfNotExists() {
    console.debug('called createTableIfNotExists()');

    var sql = "CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT)";

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [], showRecords, handleErrors);
            console.debug('executeSql: ' + sql);
        }
    );
}

function insertRecord() {
    console.debug('called insertRecord()');

    var name = $('#name').val();
    var phone = $('#phone').val();

    var sql = 'INSERT INTO Contacts (name, phone) VALUES (?, ?)';

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [name, phone], showRecordsAndResetForm, handleErrors);
            console.debug('executeSql: ' + sql);
        }
    );
}

function deleteRecord(id) {
    console.debug('called deleteRecord()');

    var sql = 'DELETE FROM Contacts WHERE id=?';

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [id], showRecords, handleErrors);
            console.debug('executeSql: ' + sql);
            alert('Delete Sucessfully');
        }
    );

    resetForm();
}

function updateRecord() {
    console.debug('called updateRecord()');

    var name = $('#name').val();
    var phone = $('#phone').val();
    var id = $("#id").val();

    var sql = 'UPDATE Contacts SET name=?, phone=? WHERE id=?';

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [name, phone, id], showRecordsAndResetForm, handleErrors);
            console.debug('executeSql: ' + sql);
        }
    );
}

function dropTable() {
    console.debug('called dropTable()');

    var sql = 'DROP TABLE Contacts';

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [], showRecords, handleErrors);
        }
    );

    resetForm();

    initDatabase();
}

function resetForm() {
    console.debug('called resetForm()');

    $('#name').val('');
    $('#phone').val('');
    $('#id').val('');
}

function showRecordsAndResetForm() {
    console.debug('called showRecordsAndResetForm()');

    resetForm();
    showRecords()
}

function handleErrors(transaction, error) {
    console.debug('called handleErrors()');
    console.error('error ' + error.message);

    alert(error.message);
    return true;
}

function showRecords() {
    console.debug('called showRecords()');

    var sql = "SELECT * FROM Contacts";

    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, [], renderRecords, handleErrors);
        }
    );
}

function renderRecords(transaction, results) {
    console.debug('called renderRecords()');

    html = '';
    $('#results').html('');

    dataset = results.rows;

    if (dataset.length > 0) {
        html = html + '  <ul data-role="listview">';

        for (var i = 0, item = null; i < dataset.length; i++) {
            item = dataset.item(i);

            html = html + '    <li>';
            html = html + '      <h3>' + item['name'] + '</h3>';
            html = html + '      <p>Phone: ' + item['phone'] + '</p>';
            html = html + '      <p>Id: ' + item['id'] + '</p>';
            html = html + '      <p>';
            html = html + '        <button type="button" data-icon="arrow-u" onClick="prepareEdit(' + i + ');">edit</button>';
            html = html + '        <button type"button" data-icon="delete" onClick="deleteRecord(' + item['id'] + ');">delete</button>';
            html = html + '      </p>';
            html = html + '    </li>';
        }

        html = html + '  </ul>';

        $('#results').append(html);
        $('#results ul').listview();
    }
}

function prepareAdd() {
  $('form').show();
  $('#btnAdd').addClass('ui-disabled');
  $('#results').addClass('ui-disabled');
  $('#btnSave').on('click', function(){ insertRecord() });
  $('#btnSave').on('click', function(){ cancelAction() });
  $('#name').focus();
}

function prepareEdit(i) {
  loadRecord(i)

  $('form').show();
  $('#btnAdd').addClass('ui-disabled');
  $('#results').addClass('ui-disabled');
  $('#btnSave').on('click', function(){ updateRecord() });
  $('#btnSave').on('click', function(){ cancelAction() });
  $('#name').focus();
}

function loadRecord(i) {
    console.debug('called loadRecord()');

    var item = dataset.item(i);

    $('#name').val(item['name']);
    $('#phone').val(item['phone']);
    $('#id').val(item['id']);
}

function cancelAction() {
  $('form').hide();
  $('#btnAdd').removeClass('ui-disabled');
  $('#results').removeClass('ui-disabled');
  $('#btnSave').off('click');
}

function updateCacheContent(event) {
    console.debug('called updateCacheContent()');
    window.applicationCache.swapCache();
}

$(document).ready(function () {
    window.applicationCache.addEventListener('updateready', updateCacheContent, false);

    initDatabase();
    cancelAction();
});
