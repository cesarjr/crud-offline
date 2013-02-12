var Contacts = Backbone.Collection.extend({
    model: Contact,
    localStorage: new Backbone.LocalStorage('crud-offline')
})
