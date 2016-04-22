(function (W, document) {
    'use strict';
    
    require('script!./libs/tap');
    require('script!./libs/swipe'); // ToDo: Replace with hammer.js
    require('script!./scripts/util/shims');

    var platformSdk = require('./libs/platformSdk'),
        constants = require('./scripts/constants');
        
    platformSdk.ready(function () {
        var utils = require('./scripts/util/utils');

        // Set up bugsnag info.
        Bugsnag.metaData = {
            appData: JSON.stringify(platformSdk.appData)
        };

        Bugsnag.appVersion = constants.APP_VERSION;

        Bugsnag.beforeNotify = function () {
            
        };  

        environment === constants.STAGING_ENV && platformSdk.bridge.setDebuggableEnabled('true');
    });

})(window, document);
