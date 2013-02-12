var contacts = new Contacts;

function insertRecord() {
    console.debug('called insertRecord()');

    var contact = new Contact({
        name: $('#name').val(),
        phone: $('#phone').val()
    });

    contacts.add(contact);
    contact.save();
    showRecords();
}

function deleteRecord(id) {
    console.debug('called deleteRecord()');

    var contact = contacts.get(id);
    contact.destroy();

    showRecords();
}

function updateRecord() {
    console.debug('called updateRecord()');

    var contact = contacts.get($('#id').val());

    contact.set('name', $('#name').val());
    contact.set('phone', $('#phone').val());
    contact.save();

    showRecords();
}

function deleteAll() {
    console.debug('called deleteAll()');

    contacts.each(function(contact) {
      contact.destroy();
    });

    showRecords();
}

function showRecords() {
    console.debug('called showRecords()');

    html = '';
    $('#results').html('');

    if (!contacts.isEmpty()) {
        html = html + '  <ul data-role="listview">';

        contacts.each(
            function(contact) {
                html = html + '    <li>';
                html = html + '      <h3>' + contact.escape('name') + '</h3>';
                html = html + '      <p>Phone: ' + contact.escape('phone') + '</p>';
                html = html + '      <p>Id: ' + contact.escape('id') + '</p>';
                html = html + '      <p>';
                html = html + '        <button type="button" data-icon="arrow-u" onClick="prepareEdit(\'' + contact.escape('id') + '\');">edit</button>';
                html = html + '        <button type="button" data-icon="delete" onClick="deleteRecord(\'' + contact.escape('id') + '\');">delete</button>';
                html = html + '      </p>';
                html = html + '    </li>';
            }
        );

        html = html + '  </ul>';

        $('#results').append(html);
        $('#results ul').listview();
    }
}

function prepareAdd() {
    resetForm();

    $('form').show();
    $('#btnAdd').addClass('ui-disabled');
    $('#results').addClass('ui-disabled');
    $('#btnSave').on('click', function(){ insertRecord() });
    $('#btnSave').on('click', function(){ cancelAction() });
    $('#name').focus();
}

function resetForm() {
    console.debug('called resetForm()');

    $('#name').val('');
    $('#phone').val('');
    $('#id').val('');
}

function prepareEdit(id) {
    var contact = contacts.get(id);

    $('#name').val(contact.escape('name'));
    $('#phone').val(contact.escape('phone'));
    $('#id').val(contact.escape('id'));

    $('form').show();
    $('#btnAdd').addClass('ui-disabled');
    $('#results').addClass('ui-disabled');
    $('#btnSave').on('click', function(){ updateRecord() });
    $('#btnSave').on('click', function(){ cancelAction() });
    $('#name').focus();
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

$(document).ready(function() {
    window.applicationCache.addEventListener('updateready', updateCacheContent, false);

    cancelAction();

    contacts.fetch();
    showRecords();
})
