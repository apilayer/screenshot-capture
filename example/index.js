var URL = require('url');
var path = require('path');
var moment = require('moment');
var _ = require('lodash');
var uuid = require('node-uuid');

var APIPath = path.join(__dirname, '../', 'index');
var API = require(APIPath);

var api = new API({
    access_key: process.env.ACCESS_KEY,
    secret_key: process.env.SECRET_KEY
});

// Random content for each request
var url = 'https://en.wikipedia.org/wiki/Special:Random';

// CAPTURE - FILE
var captureQueryFile = {
    url: url,
    filename: path.join(__dirname, '../', '.tmp', URL.parse(url).hostname, uuid.v4() + '.png')
}

api.capture(captureQueryFile, function (err, result) {
    if (err) {
        return console.log('Capture (FILE) Callback (Error): ' + JSON.stringify(err));
    }
    console.log('Screenshot (FILE) fetched...');
});


// CAPTURE - FTP
var captureQueryFTP = {
    url: url,
    force: api.PARAM_FORCE_TRUE,
    'export': process.env.EXPORT_FTP
}

api.capture(captureQueryFTP, function (err, result) {
    if (err) {
        return console.log('Capture (FTP) Callback (Error): ' + JSON.stringify(err));
    }
    console.log('Screenshot (FTP) fetched...');
});