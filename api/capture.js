'use strict';

var crypto = require('crypto');
var async = require('async');
var path = require('path');
var URL = require('url');
var uuid = require('node-uuid');
var _ = require('lodash');

var utils = require('../lib/utils');
var Promise = require('../lib/promise');
var APIError = require('../lib/apirequest-error');


// Declare our main module scope
var API;


/**
 * Capture Screenshot
 *
 * @param  {object} params - Parameters for request
 * @param  {callback} callback - The callback that handles the response.
 * @return {object} Result
 */
API = function (params, callback, options) {


    options = utils.defaults({}, options, this.options, {
            service: API.SERVICE_NAME,
            method: API.SERVICE_METHOD,
            encoding: null
        }
    );


    // Declare the promise we will use to wrap the request call
    var promise = new Promise(function (resolve, reject) {

        // Input Validation (we only do the most basic, and let the server do the most so validation will always be up to date)
        if (!params) {
            return reject(new APIError.MissingArgumentError(API.SERVICE_NAME, 'params'));
        }
        else if (!_.has(params, API.PARAM_URL)) {
            return reject(new APIError.MissingArgumentError(API.SERVICE_NAME, 'params.' + API.PARAM_URL));
        }

        var args = _.defaults(_.clone(params), {
            format: API.PARAM_FORMAT_PNG
        });

        var secretKey = args.url + _.get(options, API.PARAM_SECRET_KEY);
        secretKey = crypto.createHash('md5').update(secretKey).digest('hex');
        _.set(args, API.PARAM_SECRET_KEY, secretKey);

        args.url = encodeURIComponent(params.url);


        // Prepare Parameters and prepare it for the Request modus
        var query = {
            options: options,
            params: {
                json: true,
                qs: args
            }
        };


        var APIRequest = require('../lib/apirequest');
        APIRequest.request(query, function (err, result) {

            // If an error happens, we return early
            if (err) {
                return reject(err);
            }

            if (_.has(args, API.PARAM_FILENAME)) {

                var exportFilename = _.get(args, API.PARAM_FILENAME);

                var fs = require('fs-path');
                fs.writeFile(exportFilename, result, 'base64', function (err) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                });
            }
            else {
                // and we resolve and return (not necessary to return, but keeps consistency)
                return resolve(result);
            }

            if (_.has(args, API.PARAM_EXPORT)) {
                console.log('Coming soon... the ability to provide feedback to check or successful exports.');
            }
        });
    });


    // Ensure callback is set to make the main functions slightly simpler by avoiding nested conditionals
    callback = callback || utils.noop;

    // We offer callback support in addition to promise style (we know callback is set as we default it in the beginning)
    promise
        .then(function (result) {
            callback(null, result);
        })
        .catch(function (err) {
            callback(err);
        });


    // return the promise to the caller
    return promise;
};


var CaptureQuery = function (url) {
    this.url = url;
};
API.CaptureQuery = CaptureQuery;


API.SERVICE_NAME = 'capture';
API.SERVICE_METHOD = 'GET';

API.PARAM_URL = 'url';
API.PARAM_EXPORT = 'export';
API.PARAM_FILENAME = 'filename';
API.PARAM_SECRET_KEY = 'secret_key';
API.PARAM_FULLPAGE = 'fullpage';
API.PARAM_FULLPAGE_TRUE = 1;
API.PARAM_WIDTH = 'width';
API.PARAM_VIEWPORT = 'viewport';
API.PARAM_FORMAT = 'format';
API.PARAM_FORMAT_PNG = 'PNG';
API.PARAM_FORMAT_JPG = 'JPG';
API.PARAM_FORMAT_GIF = 'GIF';
API.PARAM_CSS_URL = 'css_url';
API.PARAM_DELAY = 'delay';
API.PARAM_TTL = 'ttl';
API.PARAM_FORCE = 'force';
API.PARAM_FORCE_TRUE = 1;
API.PARAM_PLACEHOLDER = 'placeholder';
API.PARAM_USER_AGENT = 'user_agent';
API.PARAM_ACCEPT_LANG = 'accept_lang';

/**
 * Exports the APIs
 * @type {Object}
 */
module.exports = API;