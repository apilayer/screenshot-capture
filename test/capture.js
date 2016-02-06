var _ = require('lodash');
var path = require('path');
var async = require('async');
var utils = require('../lib/utils');

var APIPath = path.join(__dirname, '../', 'index');
var API = require(APIPath);

var api = new API({
    access_key: process.env.ACCESS_KEY
});

// TEST START

var assert = require('assert');

describe('#capture()', function () {

    this.timeout(10000);

    it('testing capture', function (done) {

        async.waterfall(
            [
                function (stepCallback) {

                    // setup test check

                },
                function (currencies, stepCallback) {

                    api.capture()
                        .then(function (result) {

                            // check results

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