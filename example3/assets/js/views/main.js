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
        
        $('#btnAdd').removeClass('ui-disabled');
        $('#btnDeleteAll').removeClass('ui-disabled');
        
        this.showRecords();        
    },
    
    showRecords: function() {
        console.debug('MainView.showRecords');

        if (!contacts.isEmpty()) {
            template = $('#contact_list-template').html();
            html = _.template(template, {contacts: contacts.toJSON()});

            $('#content').html(html).trigger('create');
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

    showForm: function() {
        console.debug('MainView.showForm');

        template = $('#form-template').html();
        html = _.template(template);

        $('#content').html(html).trigger('create');
    },
    
    prepareAdd: function() {
        console.debug('MainView.prepareAdd');

        this.showForm();       

        $('form').data('action', 'add');
        $('#btnAdd').addClass('ui-disabled');
        $('#btnDeleteAll').addClass('ui-disabled');        
        
        $('#name').focus();
    },
    
    prepareEdit: function(event) {
        console.debug('MainView.prepareEdit');

        this.showForm();
        
        var id = $(event.target).data('contact-id');
        var contact = contacts.get(id);

        $('#name').val(contact.escape('name'));
        $('#phone').val(contact.escape('phone'));
        $('#id').val(contact.escape('id'));

        $('form').data('action', 'edit');
        $('#btnAdd').addClass('ui-disabled');
        $('#btnDeleteAll').addClass('ui-disabled');        
        
        $('#name').focus();
    },

    deleteRecord: function(event) {
        console.debug('MainView.deleteRecord');

        var id = $(event.target).data('contact-id');
        var contact = contacts.get(id);
        contact.destroy();

        this.showRecords();
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
    },

    updateRecord: function() {
        console.debug('MainView.updateRecord');

        var contact = contacts.get($('#id').val());

        contact.set('name', $('#name').val());
        contact.set('phone', $('#phone').val());
        contact.save();
    }

});