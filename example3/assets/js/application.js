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

    if (!contacts.isEmpty()) {
        template = $('#contact_list-template').html();
        html = _.template(template, {contacts: contacts.toJSON()});

        $('#results').html(html);
        $('#results ul').listview();
    }
    
    template = $('#counter-template').html();
    html = _.template(template, {contacts: contacts});
    $('#counter').html(html);
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
