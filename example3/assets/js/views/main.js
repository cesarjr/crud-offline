var MainView = Backbone.View.extend({
    el: $('body'),
  
    initialize: function() {
        console.debug('MainView.initialize');
        this.render();
    },
    
    render: function() {
        console.debug('MainView.render');
        
        this.cancelAction();

        contacts.fetch();
        this.showRecords();
    },
    
    events: {
        'click #btnAdd': 'prepareAdd',
        'click .btnEdit': 'prepareEdit',
        'click .btnDelete': 'deleteRecord',

        'click #btnSave': 'saveAction',
        'click #btnCancel': 'cancelAction',
        
        'click #btnDeleteAll': 'deleteAll'
    },
        
    cancelAction: function() {
        console.debug('MainView.cancelAction');
        
        $('form').hide();
        $('#btnAdd').removeClass('ui-disabled');
        $('#results').removeClass('ui-disabled');
        $('#btnSave').off('click');
    },
    
    resetForm: function() {
        console.debug('MainView.resetForm');

        $('#name').val('');
        $('#phone').val('');
        $('#id').val('');
    },
 
    showRecords: function() {
        console.debug('MainView.showRecords');

        if (!contacts.isEmpty()) {
            template = $('#contact_list-template').html();
            html = _.template(template, {contacts: contacts.toJSON()});

            $('#results').html(html);
            $('#results ul').listview();
        }
        
        template = $('#counter-template').html();
        html = _.template(template, {contacts: contacts});
        $('#counter').html(html);
    },

    deleteAll: function() {
        console.debug('MainView.deleteAll');

        contacts.each(function(contact) {
          contact.destroy();
        });

        this.showRecords();
    },
    
    prepareAdd: function() {
        console.debug('MainView.prepareAdd');
    
        this.resetForm();

        $('form').data('action', 'add');
        $('form').show();
        $('#btnAdd').addClass('ui-disabled');
        $('#results').addClass('ui-disabled');
        $('#name').focus();
    },

    deleteRecord: function(event) {
        console.debug('MainView.deleteRecord');

        var id = $(event.target).data('contact-id');
        var contact = contacts.get(id);
        contact.destroy();

        this.showRecords();
    },
    
    prepareEdit: function(event) {
        console.debug('MainView.prepareEdit');

        var id = $(event.target).data('contact-id');
        var contact = contacts.get(id);

        $('#name').val(contact.escape('name'));
        $('#phone').val(contact.escape('phone'));
        $('#id').val(contact.escape('id'));

        $('form').data('action', 'edit');
        $('form').show();
        $('#btnAdd').addClass('ui-disabled');
        $('#results').addClass('ui-disabled');
        $('#name').focus();
    },
    
    saveAction: function() {
        console.debug('MainView.saveAction');
        
        action = $('form').data('action');
      
        if (action == 'add') {
            this.insertRecord();
        } else {
            this.updateRecord();
        };
        
        this.cancelAction();
    },

    insertRecord: function() {
        console.debug('MainView.insertRecord');

        var contact = new Contact({
            name: $('#name').val(),
            phone: $('#phone').val()
        });

        contacts.add(contact);
        contact.save();
        this.showRecords();
    },

    updateRecord: function() {
        console.debug('MainView.updateRecord');

        var contact = contacts.get($('#id').val());

        contact.set('name', $('#name').val());
        contact.set('phone', $('#phone').val());
        contact.save();

        this.showRecords();
    }

});