var API = require('screenshot-capture');
var api = new API({
    access_key: 'access_key',
    secret_key: 'secret_key'
});

var captureQuery = {
    url: 'https://en.wikipedia.org/wiki/Special:Random'
};

api.capture(captureQuery)
    .then(function (result) {
        console.log('Capture Promise Resolve (image contains '+ result.length +' bytes)');
    })
    .catch(function (err) {
        console.log('Capture Promise Reject: ' + JSON.stringify(err));
    });