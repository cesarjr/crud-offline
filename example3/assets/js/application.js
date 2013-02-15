var contacts = new Contacts;

function updateCacheContent(event) {
    console.debug('called updateCacheContent()');
    window.applicationCache.swapCache();
}

$(document).ready(function() {
    window.applicationCache.addEventListener('updateready', updateCacheContent, false);

    var mainView = new MainView({model: contacts});    
})