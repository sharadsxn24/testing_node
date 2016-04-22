/**
 * Created by anuraggrover on 16/09/15.
 */

(function () {
    'use strict';

    var Constants = require('./constants');

    module.exports = function (env) {
        if (env === Constants.STAGING_ENV) {
            return {
                SUB_UNSUB_BASE_URL: 'http://54.254.187.66/subscription/api/v3/microapps',
                API_URL: 'http://coupons-api-staging.platform.hike.in'
            };
        } else if (env === Constants.PROD_ENV) {
            return {
                SUB_UNSUB_BASE_URL: 'https://subscription.platform.hike.in/subscription/api/v3/microapps',
                API_URL: 'https://coupons-api.platform.hike.in'
            };
        }

        return {};
    };
})();