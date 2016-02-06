var API = require('screenshot-capture');
var api = new API({
    access_key: 'access_key'
});

var captureQuery = {
    url: 'https://en.wikipedia.org/wiki/Special:Random'
};

api.capture(captureQuery)
    .then(function () {
        console.log('Capture Promise Resolve');
    })
    .catch(function (err) {
        console.log('Capture Promise Reject: ' + JSON.stringify(err));
    });