var _ = require('lodash');
var URL = require('url');
var fs = require('fs');
var path = require('path');
var async = require('async');
var uuid = require('uuid');
var utils = require('../lib/utils');

var APIPath = path.join(__dirname, '../', 'index');
var API = require(APIPath);

var api = new API({
    access_key: process.env.ACCESS_KEY,
    secret_key: process.env.SECRET_KEY
});

// TEST START
var chai = require('chai');
var expect = chai.expect;
var assert = require('assert');

describe('#capture()', function () {

    this.timeout(20000);

    it('basic', function (done) {

        async.waterfall(
            [
                function (stepCallback) {

                    // Random content for each request
                    //var url = 'http://itsthisforthat.com/';
                    var url = 'https://en.wikipedia.org/wiki/Special:Random';

                    // CAPTURE - FILE
                    var query = {
                        url: url
                    }

                    api.capture(query)
                        .then(function (result) {

                            expect(result).to.exist;
                            expect(result).to.be.an.instanceOf(Uint8Array);

                            stepCallback();
                        })
                        .catch(function (err) {
                            stepCallback(err);
                        });
                }
            ],
            function (err) {
                return done(err);
            }
        )
    });

    it('with filename', function (done) {

        async.waterfall(
            [
                function (stepCallback) {

                    // Random content for each request
                    //var url = 'http://itsthisforthat.com/';
                    var url = 'https://en.wikipedia.org/wiki/Special:Random';

                    // CAPTURE - FILE
                    var query = {
                        url: url,
                        filename: path.join(__dirname, '../', '.tmp', URL.parse(url).hostname, uuid.v4() + '.png')
                    }

                    api.capture(query)
                        .then(function (result) {

                            var exists = fs.existsSync(query.filename);
                            expect(exists).to.be.true;

                            stepCallback();
                        })
                        .catch(function (err) {
                            stepCallback(err);
                        });
                }
            ],
            function (err) {
                return done(err);
            }
        )
    });
});