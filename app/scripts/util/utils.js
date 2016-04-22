/**
 * Created by anuraggrover on 27/07/15.
 */

( function (W, undefined) {
    'use strict';

    var Constants = require('../constants'),
        ConnTypes = Constants.ConnectionTypes,
        _extend = function ( toObj, fromObj ) {
            for( var key in fromObj ) {
                if ( fromObj.hasOwnProperty( key ) && toObj[key] === undefined ) {
                    toObj[key] = fromObj[key];
                }
            }
        },
        imageOptimizationConnTypes = [ConnTypes.UNKNOWN, ConnTypes.TWO_G],
        noop = function () {

        },
        memoizationCache = {},
        basePrefix = 'id_',
        platformSdk = require('../../libs/platformSdk'),
        idCounter = 1;

    module.exports = {
        isStaging: '',
        isDev: '',
        isFunction: function (fn) {
            return typeof fn === 'function';
        },

        extend: function ( toObj, fromObj ) {
            _extend( toObj.prototype, fromObj.prototype );
            _extend( toObj, fromObj );

            return toObj;
        },

        serializeParams: function ( params ) {
            var serializedParams = [];

            for ( var key in params ) {
                if ( params.hasOwnProperty( key ) ) {
                    serializedParams.push( key + '=' + params[key] );
                }
            }

            return serializedParams.join( '&' );
        },

        empty: function ( element ) {
            while ( element.firstChild ) {
                element.removeChild( element.firstChild );
            }

            return element;
        },

        getUniqueId: function (prefix) {
            return (prefix || basePrefix) + idCounter++;
        },

        simpleClone: function (obj) {
            return JSON.parse(JSON.stringify(obj));
        },

        loadImage: function (params) {
            var imageEl = document.createElement('img');

            imageEl.onload = function () {
                params.success(imageEl) || noop();
            };

            imageEl.onerror = params.error || noop;

            imageEl.src = params.src;
        },

        toOptimizeForImages: function (connectionType) {
            if (memoizationCache[connectionType] === undefined) {
                memoizationCache[connectionType] = imageOptimizationConnTypes.indexOf(connectionType) !== -1;
            }

            return memoizationCache[connectionType];
        },

        getNodeIndex: function (elem) {
            var index = 0;

            while(elem = elem.previousElementSibling) {
                index++;
            }

            return index;
        },

        createCustomEvent: function (eventName) {
            var customEvent;

            if (W.CustomEvent) {
                customEvent = new CustomEvent(eventName, {
                    bubbles: true
                });
            } else {
                customEvent = document.createEvent('Event');
                customEvent.initEvent(eventName, true, false);
            }

            return customEvent;

        },

        toggleBackNavigation: function (enable) {
            var _bridge = platformSdk.bridge;

            enable = enable ? 'true' : 'false';

            _bridge.allowBackPress(enable);

            // This method is only supported since target_platform 5 and our user base is 3.
            _bridge.allowUpPress && _bridge.allowUpPress(enable);
        },

        getRandomNum: function () {
            return Math.floor(Math.random() * 100000);
        }
    };

} )(window);